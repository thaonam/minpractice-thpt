'use client';

import { useEffect, useRef, useState } from 'react';

export function CountdownTimer({ expiresAt, onExpire }: { expiresAt: string; onExpire?: () => void }) {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(new Date(expiresAt).getTime() - Date.now(), 0));
  const expiredCalled = useRef(false);

  useEffect(() => {
    expiredCalled.current = false;
    const update = () => {
      const next = Math.max(new Date(expiresAt).getTime() - Date.now(), 0);
      setRemainingMs(next);
      if (next === 0 && !expiredCalled.current) {
        expiredCalled.current = true;
        onExpire?.();
      }
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, onExpire]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return <strong>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong>;
}
