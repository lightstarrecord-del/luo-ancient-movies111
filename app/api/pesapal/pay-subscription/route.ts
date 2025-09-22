export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getToken, PLANS, IPN_ID, BASE_URL } from '@/lib/pesapal';
import { verifyIdToken } from '@/lib/firebase-admin';
import { saveSubscriptionByOrder } from '@/lib/firestore-db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { planId, phone, email, firstName, lastName } = body;
  // Expect Authorization: Bearer <Firebase ID token>
  const authHeader = req.headers.get('authorization') || '';
  const idToken = authHeader.replace(/^Bearer\s+/i, '') || null;
  if (!idToken) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  let uid: string | null = null;
  try {
    const decoded = await verifyIdToken(idToken);
    uid = decoded.uid;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });
  }

  if (!PLANS[planId as keyof typeof PLANS] || !/^07\d{8}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  if (!IPN_ID) {
    return NextResponse.json({ error: 'IPN_ID not set. Register your IPN first.' }, { status: 500 });
  }

  const plan = PLANS[planId as keyof typeof PLANS];
  const pesapalToken = await getToken();
  const orderRequest = {
    id: 'ORDER_' + Date.now(),
    currency: 'UGX',
    amount: plan.price,
    description: `${planId} subscription`,
    callback_url: 'https://luoancientmovies.com/pesapal-callback.php',
    notification_id: IPN_ID,
    billing_address: {
      phone_number: phone,
      email_address: email || undefined,
      country_code: 'UG',
      first_name: firstName || '',
      last_name: lastName || '',
    },
  };

  const pesapalRes = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pesapalToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderRequest),
  });
  const data = await pesapalRes.json();
  if (!data.redirect_url) {
    return NextResponse.json({ error: 'Failed to get payment redirect URL from Pesapal.' }, { status: 500 });
  }
  // Save pending subscription tied to order id and user
  try {
    await saveSubscriptionByOrder(orderRequest.id, {
      orderId: orderRequest.id,
      uid,
      planId,
      phone,
      email,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    // non-fatal, but log in server console
    console.error('Failed to save subscription_by_order', e);
  }
  return NextResponse.json({
    redirect_url: data.redirect_url,
    order_id: orderRequest.id,
  });
}
