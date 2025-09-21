import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const check = async () => {
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
