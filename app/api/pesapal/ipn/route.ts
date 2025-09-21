export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getToken, PLANS, BASE_URL } from '@/lib/pesapal';
import { saveUserSubscription, savePaymentRecord } from '@/lib/firestore-db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { OrderTrackingId, planId } = body;
  if (!OrderTrackingId) {
    return NextResponse.json({ error: 'OrderTrackingId required' }, { status: 400 });
  }
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const status = data.payment_status_description;
  const phone = data.phone_number;
  const plan = PLANS[planId as keyof typeof PLANS] || PLANS[data.plan_id as keyof typeof PLANS];
  // Save subscription/payment record here
  if (status === 'COMPLETED' && phone && plan) {
    const now = new Date();
    const expires = new Date(now.getTime() + plan.days * 24 * 60 * 60 * 1000);
    await saveUserSubscription(phone, planId || data.plan_id, expires.toISOString());
    await savePaymentRecord(OrderTrackingId, data);
  }
  return NextResponse.json({ status, phone, plan });
}
