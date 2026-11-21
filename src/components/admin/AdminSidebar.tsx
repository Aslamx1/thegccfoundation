'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { AdminService } from '@/lib/supabase/admin-service';
import {
  LayoutDashboard,
  HeartHandshake,
  MailCheck,
  DollarSign,
  Users,
  Megaphone,
  Sliders,
  ExternalLink,
  LogOut,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Database,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [pendingLetters, setPendingLetters] = useState<number>(0);
  const [pendingFundraisers, setPendingFundraisers] = useState<number>(0);

  useEffect(() => {
    async function loadCounters() {
      try {
        const kpis = await AdminService.getDashboardKPIs();
        setPendingLetters(kpis.pendingLetterApprovals);
        setPendingFundraisers(kpis.pendingFundraiserApprovals);
      } catch {}
    }
    loadCounters();
  }, [pathname]);

  const navLinks = [
    {
      title: 'Command Center',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'Registered Accounts',
      href: '/admin/accounts',
      icon: UserCheck,
    },
    {
      title: 'Child Sponsorships',
      href: '/admin/sponsorships',
      icon: HeartHandshake,
    },
    {
      title: 'Letter Moderation',
      href: '/admin/letters',
      icon: MailCheck,
      badge: pendingLetters > 0 ? pendingLetters : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      title: 'Donations & Ledger',
      href: '/admin/donations',
      icon: DollarSign,
    },
    {
      title: 'Supporters & Staff',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Campaigns & P2P',
      href: '/admin/campaigns',
      icon: Megaphone,
      badge: pendingFundraisers > 0 ? pendingFundraisers : undefined,
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      title: 'Events & Settings',
      href: '/admin/operations',
      icon: Sliders,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-72 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105">
            <Image
              src="/images/gcc-emblem.png"
              alt="GCC Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight">GCC Admin</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">NGO Operations Hub</span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Database Mode Pill */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">
              {isSupabaseConfigured ? 'Supabase Postgres' : 'Postgres / Local Store'}
            </span>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
          Main Management
        </div>

        {navLinks.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.title}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    item.badgeColor || 'bg-slate-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Quick Links & Profile */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            Public Supporter Portal
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30 shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium capitalize">
                {user?.role || 'Admin'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.href = '/sign-in';
            }}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
