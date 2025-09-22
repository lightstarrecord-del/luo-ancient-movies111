export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
// Optionally save payment record here
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('paymentId');
  // TODO: Save payment record if needed
  return NextResponse.json({ message: '✅ Payment complete. Please check your account.', paymentId });
}
