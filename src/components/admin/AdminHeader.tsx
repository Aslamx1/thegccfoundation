'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  Plus,
  Search,
  Bell,
  HeartHandshake,
  DollarSign,
  Megaphone,
  MailCheck,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function AdminHeader({ onOpenMobileSidebar }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Derive title from pathname
  const getHeaderTitle = () => {
    if (pathname === '/admin') return 'Command Center Overview';
    if (pathname.includes('/sponsorships')) return 'Child Sponsorship CMS';
    if (pathname.includes('/letters')) return 'Letter & Report Moderation';
    if (pathname.includes('/donations')) return 'Donations & Financial Ledger';
    if (pathname.includes('/users')) return 'Donor & Staff Directory';
    if (pathname.includes('/campaigns')) return 'Campaigns & P2P Moderation';
    if (pathname.includes('/operations')) return 'Events, Volunteers & Settings';
    return 'Admin Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              GCC Foundation
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-medium text-slate-500">Admin Area</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
            {getHeaderTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Quick Actions, Global Search, and User Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickActionOpen(!quickActionOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Action</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {quickActionOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setQuickActionOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Create / Post
                </div>

                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    router.push('/admin/sponsorships?action=new');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Add Child Profile</span>
                </button>

                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    router.push('/admin/donations?action=log_offline');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Log Offline Donation</span>
                </button>

                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    router.push('/admin/campaigns?action=new_update');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <Megaphone className="w-4 h-4 text-purple-600" />
                  <span>Publish Project Update</span>
                </button>

                <button
                  onClick={() => {
                    setQuickActionOpen(false);
                    router.push('/admin/letters');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <MailCheck className="w-4 h-4 text-amber-600" />
                  <span>Review Pending Letters</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-300">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || 'Administrator'}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              {user?.role || 'Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
