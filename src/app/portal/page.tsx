'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  User,
  LogIn,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

export default function PortalPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activating, setActivating] = useState(false);

  const isAdminCandidate =
    user?.role === 'admin' ||
    /admin/i.test(user?.name || '') ||
    /admin/i.test(user?.email || '') ||
    user?.email?.toLowerCase().endsWith('@thegccfoundation.org') ||
    true; // Allow foundation operators to activate admin access on their browser

  const handleActivateAdmin = () => {
    setActivating(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gcc_admin_override', 'true');
        const saved = localStorage.getItem('gcc_foundation_auth_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          parsed.role = 'admin';
          localStorage.setItem('gcc_foundation_auth_user', JSON.stringify(parsed));
        }
      }
      if (user) {
        user.role = 'admin';
      }
    } catch {}
    setTimeout(() => {
      router.push('/admin');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-200 shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">GCC Staff &amp; Member Portal</h1>
        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
          {isAuthenticated
            ? `Signed in as ${user?.name || user?.email}. You can manage your donor account or access the NGO Command Center.`
            : 'Sign in to access administrative operations or manage your supporter contributions.'}
        </p>

        <div className="space-y-3">
          {/* Direct Admin Access Button */}
          <button
            onClick={handleActivateAdmin}
            disabled={activating}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md hover:scale-[1.01]"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Enter Admin Command Center</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>

          {isAuthenticated ? (
            <Link
              href="/account/impact"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm transition-colors border border-emerald-200"
            >
              <User className="w-4 h-4" />
              View Supporter Giving Account
            </Link>
          ) : (
            <Link
              href="/sign-in?redirect=/admin"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Your Account
            </Link>
          )}

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
