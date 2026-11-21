'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, ArrowLeft, Heart, User, LogIn } from 'lucide-react';

export default function PortalPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Member Portal Access</h1>
        <p className="text-slate-600 text-sm mb-6">
          {isAuthenticated
            ? `Signed in as ${user?.name || user?.email}. Administrative routes (/admin/*) require staff permissions.`
            : 'You must be signed in with an authorized administrator account to access the NGO Command Center.'}
        </p>

        <div className="space-y-3">
          {isAuthenticated ? (
            <Link
              href="/account"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
              Go to Supporter Account
            </Link>
          ) : (
            <Link
              href="/sign-in?redirect=/admin"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </Link>
          )}

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
