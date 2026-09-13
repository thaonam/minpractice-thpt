'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(new Date(expiresAt).getTime() - Date.now(), 0));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingMs(Math.max(new Date(expiresAt).getTime() - Date.now(), 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <strong>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </strong>
  );
}
