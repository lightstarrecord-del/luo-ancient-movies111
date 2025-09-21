import { NextRequest, NextResponse } from 'next/server';
import { getToken, BASE_URL } from '@/lib/pesapal';

export async function GET() {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/api/URLSetup/GetIpnList`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
