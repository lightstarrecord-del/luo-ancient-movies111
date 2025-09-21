// Firestore DB helpers for subscriptions and payments (serverless)
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;
if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export async function saveUserSubscription(phone: string, plan: string, expires: string) {
  await db.collection('subscriptions').doc(phone).set({ plan, expires }, { merge: true });
}

export async function getUserSubscription(phone: string) {
  const doc = await db.collection('subscriptions').doc(phone).get();
  return doc.exists ? doc.data() : null;
}

export async function savePaymentRecord(paymentId: string, data: any) {
  await db.collection('payments').doc(paymentId).set(data, { merge: true });
}
