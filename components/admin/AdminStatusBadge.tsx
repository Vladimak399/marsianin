'use client';

import { useEffect, useState } from 'react';

type AdminStatus = {
  authorized: boolean;
  blobConfigured: boolean;
};

export default function AdminStatusBadge() {
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      setIsChecking(true);
      setError('');

      try {
        const response = await fetch('/api/admin/status', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store'
        });

        if (!response.ok) {
          if (isMounted) setError('статус недоступен');
          return;
        }

        const payload = (await response.json()) as AdminStatus;
        if (isMounted) setStatus(payload);
      } catch {
        if (isMounted) setError('статус недоступен');
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    void checkStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return <p className="text-[11px] text-black/40">проверяем статус админки…</p>;
  }

  if (error) {
    return <p className="text-[11px] text-red-600">{error}</p>;
  }

  if (!status) return null;

  return (
    <div className="flex flex-wrap gap-2 text-[11px]">
      <span className={status.authorized ? 'text-[#ed6a32]' : 'text-red-600'}>
        сессия: {status.authorized ? 'активна' : 'истекла'}
      </span>
      <span className={status.blobConfigured ? 'text-[#ed6a32]' : 'text-red-600'}>
        blob: {status.blobConfigured ? 'настроен' : 'не настроен'}
      </span>
    </div>
  );
}
