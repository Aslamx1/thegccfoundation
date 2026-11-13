'use client';

import Link from 'next/link';
import BrandLoadingGate from '@/components/BrandLoadingGate';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

const items = [
  { id: 'profile', label: 'Profile', href: '/account/profile' },
  { id: 'impact', label: 'Your impact', href: '/account/impact' },
  { id: 'messages', label: 'Messages', href: '/messages/primary' },
  { id: 'settings', label: 'Account', href: '/account/settings' },
  { id: 'notifications', label: 'Notifications', href: '/account/notifications' },
] as const;

type AccountSection = (typeof items)[number]['id'];

export default function AccountLayout({
  active,
  title,
  description,
  children,
}: {
  active: AccountSection;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const returnPath = items.find((item) => item.id === active)?.href ?? '/account/profile';

  return (
    <>
      <Header />
      <BrandLoadingGate label={`Loading ${title.toLowerCase()}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#087443]">GCC account</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#20251f]">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#626b64]">{description}</p>
        </div>

        {!user ? (
          <section className="rounded-3xl border border-[#e4e8e3] bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#20251f]">Sign in to view your account</h2>
            <p className="mt-2 text-sm text-[#626b64]">Your profile and account tools are available after you sign in.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/sign-in?next=${encodeURIComponent(returnPath)}`} className="inline-flex rounded-full bg-[#02a95c] px-5 py-3 text-sm font-bold text-white hover:bg-[#087443]">Sign in</Link>
              <Link href={`/sign-up?next=${encodeURIComponent(returnPath)}`} className="inline-flex rounded-full border border-[#cfd6d0] px-5 py-3 text-sm font-bold text-[#20251f] hover:bg-[#f7faf7]">Create an account</Link>
            </div>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-[230px_minmax(0,1fr)]">
            <nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto rounded-2xl border border-[#e4e8e3] bg-white p-2 md:block md:space-y-1 md:self-start">
              {items.map((item) => (
                <Link key={item.id} href={item.href} aria-current={active === item.id ? 'page' : undefined}
                  className={`block shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active === item.id ? 'bg-[#eaf5ed] text-[#087443]' : 'text-[#505a52] hover:bg-[#f6f8f5]'}`}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <section className="min-w-0 rounded-3xl border border-[#e4e8e3] bg-white p-6 shadow-[0_8px_36px_rgba(24,43,30,0.05)] sm:p-8">
              {children}
            </section>
          </div>
        )}
      </div>
      </BrandLoadingGate>
    </>
  );
}
