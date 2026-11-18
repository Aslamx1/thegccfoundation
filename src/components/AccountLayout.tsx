'use client';

import Link from 'next/link';
import BrandLoadingGate from '@/components/BrandLoadingGate';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  HeartHandshake,
  MessageSquare,
  Settings,
  Bell,
  PlusCircle,
} from 'lucide-react';

const items = [
  { id: 'impact', label: 'Your Impact', href: '/account/impact', icon: HeartHandshake },
  { id: 'profile', label: 'Profile', href: '/account/profile', icon: UserIcon },
  { id: 'messages', label: 'Messages', href: '/messages/primary', icon: MessageSquare },
  { id: 'settings', label: 'Account Settings', href: '/account/settings', icon: Settings },
  { id: 'notifications', label: 'Notifications', href: '/account/notifications', icon: Bell },
  { id: 'fundraise', label: 'Start a Fundraiser', href: '/create/fundraiser/category', icon: PlusCircle },
] as const;

type AccountSection = 'profile' | 'impact' | 'messages' | 'settings' | 'notifications' | 'fundraise';

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
  const returnPath = items.find((item) => item.id === active)?.href ?? '/account/impact';

  return (
    <>
      <Header />
      <BrandLoadingGate label={`Loading ${title.toLowerCase()}`}>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#087443]">
                GCC Member & Supporter Portal
              </p>
              <h1 className="mt-1.5 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#20251f]">
                {title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#626b64]">
                {description}
              </p>
            </div>
          </div>

          {!user ? (
            <section className="rounded-3xl border border-[#e4e8e3] bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#20251f]">Sign in to view your account</h2>
              <p className="mt-2 text-sm text-[#626b64]">
                Your welcome dashboard, impact history, messages, and profile tools are available after you sign in.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/sign-in?next=${encodeURIComponent(returnPath)}`}
                  className="inline-flex rounded-full bg-[#02a95c] px-5 py-3 text-sm font-bold text-white hover:bg-[#087443]"
                >
                  Sign in
                </Link>
                <Link
                  href={`/sign-up?next=${encodeURIComponent(returnPath)}`}
                  className="inline-flex rounded-full border border-[#cfd6d0] px-5 py-3 text-sm font-bold text-[#20251f] hover:bg-[#f7faf7]"
                >
                  Create an account
                </Link>
              </div>
            </section>
          ) : (
            <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
              <nav
                aria-label="Account navigation"
                className="flex gap-2 overflow-x-auto rounded-2xl border border-[#e4e8e3] bg-white p-2.5 md:block md:space-y-1 md:self-start shadow-subtle"
              >
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#eaf5ed] text-[#087443]'
                          : 'text-[#505a52] hover:bg-[#f6f8f5]'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#02a95c]' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
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
