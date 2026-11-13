'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function BrandLoadingGate({ children, label = 'Loading your account' }: { children: React.ReactNode; label?: string }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  return <>
    {loading && <div className="auth-page-loader" role="status" aria-live="polite">
      <div className="auth-page-loader-content">
        <Image src="/images/gcc-logo-full.jpg" alt="GCC Foundation" width={190} height={52} priority className="auth-loader-logo" />
        <span className="auth-loading-ring" aria-hidden="true" />
        <span className="auth-page-loader-label">{label}</span>
      </div>
    </div>}
    <div aria-hidden={loading}>{children}</div>
  </>;
}
