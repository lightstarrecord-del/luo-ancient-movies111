import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscription } from '@/lib/firestore-db';
export async function GET(req: NextRequest, { params }: { params: { phone: string } }) {
  const { phone } = params;
  if (!/^07\d{8}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid phone number format.' }, { status: 400 });
  }
  const user = await getUserSubscription(phone);
  if (!user) return NextResponse.json({ active: false });
  const active = new Date() < new Date(user.expires);
  return NextResponse.json({ active, plan: user.plan, expires: user.expires });
}
