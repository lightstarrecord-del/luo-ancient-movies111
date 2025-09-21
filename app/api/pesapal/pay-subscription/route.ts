import { NextRequest, NextResponse } from 'next/server';
import { getToken, PLANS, IPN_ID, BASE_URL } from '@/lib/pesapal';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { planId, phone, email, firstName, lastName } = body;

  if (!PLANS[planId as keyof typeof PLANS] || !/^07\d{8}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  if (!IPN_ID) {
    return NextResponse.json({ error: 'IPN_ID not set. Register your IPN first.' }, { status: 500 });
  }

  const plan = PLANS[planId as keyof typeof PLANS];
  const token = await getToken();
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
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderRequest),
  });
  const data = await pesapalRes.json();
  if (!data.redirect_url) {
    return NextResponse.json({ error: 'Failed to get payment redirect URL from Pesapal.' }, { status: 500 });
  }
  return NextResponse.json({
    redirect_url: data.redirect_url,
    order_id: orderRequest.id,
  });
}
