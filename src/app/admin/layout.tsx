'use client';

import React, { useState } from 'react';
import { AdminToastProvider } from '@/components/admin/AdminToast';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminToastProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-slate-50/80 font-sans antialiased text-slate-900">
          {/* Persistent Left Sidebar */}
          <AdminSidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Header Bar */}
            <AdminHeader
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />

            {/* Scrollable Page Body */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
              {children}
            </main>
          </div>
        </div>
      </AdminGuard>
    </AdminToastProvider>
  );
}
