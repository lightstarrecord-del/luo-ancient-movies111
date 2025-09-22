import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

/**
 * useSubscriptionAccess
 * Checks if the current user has an active subscription.
 * Returns { status: 'loading' | 'active' | 'inactive', refresh: () => void }
 * Optionally redirects to /premium if not active.
 */
export function useSubscriptionAccess({ redirect = false } = {}) {
  const [status, setStatus] = useState<'loading'|'active'|'inactive'>('loading');
  const router = useRouter();

  // Simulate user ID (replace with real auth)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // Admin email that should bypass subscription checks
  const ADMIN_EMAIL = "lightstarrecord@gmail.com";

  const check = async () => {
    // If the current signed-in auth user is the admin, treat as active immediately
    try {
      const auth = getAuth();
      const current = auth.currentUser;
      if (current && current.email === ADMIN_EMAIL) {
        setStatus('active');
        return;
      }
      // If there's no current user yet, listen briefly for auth state change
      if (!current) {
        const unsub = onAuthStateChanged(auth, (u) => {
          if (u && u.email === ADMIN_EMAIL) {
            setStatus('active');
            unsub();
          }
        });
      }
    } catch (e) {
      // ignore auth errors and continue to regular subscription checks
    }
    if (!userId) {
      setStatus('inactive');
      if (redirect) router.replace('/premium');
      return;
    }
    try {
      const res = await fetch(`/api/pesapal/subscription/${userId}`);
      const data = await res.json();
      if (data.active) {
        setStatus('active');
      } else {
        setStatus('inactive');
        if (redirect) router.replace('/premium');
      }
    } catch {
      setStatus('inactive');
      if (redirect) router.replace('/premium');
    }
  };

  useEffect(() => { check(); /* eslint-disable-next-line */ }, [userId]);

  return { status, refresh: check };
}
