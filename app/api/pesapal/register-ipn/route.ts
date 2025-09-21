import { NextRequest, NextResponse } from 'next/server';
import { getToken, BASE_URL } from '@/lib/pesapal';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ipnUrl = searchParams.get('url') || 'https://luoancientmovies.com/pesapal-ipn.php';
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: ipnUrl, ipn_notification_type: 'POST' }),
  });
  const data = await res.json();
  return NextResponse.json({ message: 'IPN Registered', data });
}
