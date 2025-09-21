// Pesapal shared logic for serverless API routes
import { NextRequest } from 'next/server';

export const PLANS = {
  access2days: { price: 5000, days: 2 },
  week: { price: 10000, days: 7 },
  twoweeks: { price: 17000, days: 14 },
  month: { price: 30000, days: 30 },
  threemonth: { price: 70000, days: 90 },
  sixmonth: { price: 120000, days: 180 },
  year: { price: 200000, days: 365 },
};

export const BASE_URL = 'https://pay.pesapal.com/v3';

export async function getToken() {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });
  if (!res.ok) throw new Error('Failed to get Pesapal token');
  const data = await res.json();
  return data.token;
}

// Helper to get IPN_ID from env or DB (for demo, use env)
export const IPN_ID = process.env.PESAPAL_IPN_ID || '';

// Add more helpers as needed for DB, payment record, etc.
