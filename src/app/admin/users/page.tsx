'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AdminService } from '@/lib/supabase/admin-service';
import { Profile, UserRole, AuthAuditLog, AuthActionType } from '@/lib/supabase/types';
import { useAdminToast } from '@/components/admin/AdminToast';
import { StatusBadge, ConfirmModal, EmptyState, TableSkeleton } from '@/components/admin/AdminUI';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserX,
  UserCheck,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Activity,
  LogIn,
  LogOut,
  UserPlus,
  Download,
  RefreshCw,
  Clock,
  Shield,
  Laptop,
} from 'lucide-react';

export default function UsersDirectoryPage() {
  const toast = useAdminToast();
  const searchParams = useSearchParams();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'directory' | 'activity'>('directory');

  // Directory state
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Activity Logs state
  const [activityLogs, setActivityLogs] = useState<AuthAuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [refreshingLogs, setRefreshingLogs] = useState(false);
  const [activitySearch, setActivitySearch] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | 'signup' | 'login' | 'logout'>('all');

  // Role Change Confirmation Modal
  const [roleModalUser, setRoleModalUser] = useState<Profile | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('donor');
  const [roleUpdating, setRoleUpdating] = useState(false);

  // Status Toggle Confirmation Modal
  const [statusModalUser, setStatusModalUser] = useState<Profile | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Auto-tab select from query string
  useEffect(() => {
    if (searchParams.get('tab') === 'activity') {
      setActiveTab('activity');
    }
  }, [searchParams]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to load user directory.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadActivityLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await AdminService.getAuthAuditLogs();
      setActivityLogs(data);
    } catch {
      toast.error('Failed to load authentication audit logs.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadActivityLogs();
  }, []);

  const handleRefreshLogs = async () => {
    try {
      setRefreshingLogs(true);
      const data = await AdminService.getAuthAuditLogs();
      setActivityLogs(data);
      toast.success('Activity logs refreshed.');
    } catch {
      toast.error('Could not refresh activity logs.');
    } finally {
      setRefreshingLogs(false);
    }
  };

  const handleRoleChangeConfirm = async () => {
    if (!roleModalUser) return;
    try {
      setRoleUpdating(true);
      await AdminService.updateUserRole(roleModalUser.id, targetRole);
      toast.success(`Role for ${roleModalUser.name} updated to ${targetRole.replace('_', ' ')}.`);
      setRoleModalUser(null);
      await loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user role.');
    } finally {
      setRoleUpdating(false);
    }
  };

  const handleStatusToggleConfirm = async () => {
    if (!statusModalUser) return;
    try {
      setStatusUpdating(true);
      const nextStatus = !statusModalUser.is_active;
      await AdminService.toggleUserStatus(statusModalUser.id, nextStatus);
      toast.success(
        nextStatus
          ? `Account for ${statusModalUser.name} activated.`
          : `Account for ${statusModalUser.name} suspended.`
      );
      setStatusModalUser(null);
      await loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update account status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Export Activity Logs to CSV
  const handleExportActivityCSV = () => {
    if (filteredActivityLogs.length === 0) {
      toast.info('No activity records to export.');
      return;
    }

    const headers = [
      'Event ID',
      'Timestamp (UTC)',
      'Action Type',
      'User Name',
      'User Email',
      'User ID',
      'IP Address',
      'Status',
      'Details',
      'Client User-Agent',
    ];

    const rows = filteredActivityLogs.map((log) => [
      `"${log.id}"`,
      `"${log.created_at}"`,
      `"${log.action.toUpperCase()}"`,
      `"${log.user_name.replace(/"/g, '""')}"`,
      `"${log.user_email}"`,
      `"${log.user_id || 'N/A'}"`,
      `"${log.ip_address || 'Direct'}"`,
      `"${log.status}"`,
      `"${(log.details || '').replace(/"/g, '""')}"`,
      `"${(log.user_agent || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GCC_Auth_Activity_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Session activity CSV exported successfully.');
  };

  // Filtered Users Directory
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Filtered Activity Logs
  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const q = activitySearch.toLowerCase();
      const matchesSearch =
        log.user_name.toLowerCase().includes(q) ||
        log.user_email.toLowerCase().includes(q) ||
        (log.ip_address && log.ip_address.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q));

      const matchesAction = actionFilter === 'all' ? true : log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [activityLogs, activitySearch, actionFilter]);

  // Activity Stats
  const activityStats = useMemo(() => {
    const signups = activityLogs.filter((l) => l.action === 'signup').length;
    const logins = activityLogs.filter((l) => l.action === 'login').length;
    const logouts = activityLogs.filter((l) => l.action === 'logout').length;
    return { signups, logins, logouts, total: activityLogs.length };
  }, [activityLogs]);

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Supporter &amp; Account Activity Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit registered accounts, role privileges, and real-time sign-ups, logins, and logouts across the organization.
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Directory ({users.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'activity'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Login &amp; Session Logs ({activityLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* TAB 1: USER DIRECTORY */}
      {/* ====================================================================== */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, phone, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex rounded-xl bg-slate-100 p-1 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    roleFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  onClick={() => setRoleFilter('admin')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    roleFilter === 'admin' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Admins ({users.filter((u) => u.role === 'admin').length})
                </button>
                <button
                  onClick={() => setRoleFilter('donor')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    roleFilter === 'donor' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Donors ({users.filter((u) => u.role === 'donor').length})
                </button>
                <button
                  onClick={() => setRoleFilter('finance_manager')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    roleFilter === 'finance_manager' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Finance ({users.filter((u) => u.role === 'finance_manager').length})
                </button>
              </div>
            </div>
          </div>

          {/* Directory Table */}
          {loadingUsers ? (
            <TableSkeleton rows={6} cols={5} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users match query"
              description="Try modifying search keywords or role filters."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Supporter / Staff Profile</th>
                      <th className="py-3 px-4">Contact &amp; Location</th>
                      <th className="py-3 px-4">Role Assignment</th>
                      <th className="py-3 px-4">Giving History</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Profile */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center border border-emerald-200 shrink-0">
                              {u.avatar_url ? (
                                <Image src={u.avatar_url} alt={u.name} fill className="object-cover" />
                              ) : (
                                <span>{u.name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact & Location */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-700 flex items-center gap-1.5 truncate">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{u.phone || 'No phone recorded'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{u.location || 'Location not set'}</span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={u.role} />
                        </td>

                        {/* Giving History */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            ${u.giving_total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.giving_count} lifetime gifts</div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              u.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.is_active ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setRoleModalUser(u);
                                setTargetRole(u.role);
                              }}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                            >
                              Change Role
                            </button>

                            <button
                              onClick={() => setStatusModalUser(u)}
                              title={u.is_active ? 'Suspend Account' : 'Activate Account'}
                              className={`p-1.5 rounded-xl border transition-colors ${
                                u.is_active
                                  ? 'border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {u.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 2: ACCOUNT ACTIVITY & SESSION LOGS */}
      {/* ====================================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Accounts Created */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Accounts Created (Sign-Ups)
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {activityStats.signups}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-0.5">
                  Registered supporters
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>

            {/* Total Logins */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  User Logins
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {activityStats.logins}
                </div>
                <div className="text-xs text-sky-600 font-medium mt-0.5">
                  Authenticated sessions
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <LogIn className="w-5 h-5" />
              </div>
            </div>

            {/* Total Logouts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  User Logouts
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {activityStats.logouts}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Terminated sessions
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                <LogOut className="w-5 h-5" />
              </div>
            </div>

            {/* Total Events Monitored */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Events Monitored
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {activityStats.total}
                </div>
                <div className="text-xs text-purple-600 font-medium mt-0.5">
                  Real-time audit records
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Activity Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, email, IP address, details..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Action Filter Pills */}
              <div className="flex rounded-xl bg-slate-100 p-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActionFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    actionFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All ({activityLogs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActionFilter('signup')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    actionFilter === 'signup' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign-Ups ({activityStats.signups})
                </button>
                <button
                  type="button"
                  onClick={() => setActionFilter('login')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    actionFilter === 'login' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Logins ({activityStats.logins})
                </button>
                <button
                  type="button"
                  onClick={() => setActionFilter('logout')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    actionFilter === 'logout' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Logouts ({activityStats.logouts})
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleRefreshLogs}
                disabled={refreshingLogs}
                title="Refresh Activity Logs"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshingLogs ? 'animate-spin text-emerald-600' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleExportActivityCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Activity Table */}
          {loadingLogs ? (
            <TableSkeleton rows={6} cols={5} />
          ) : filteredActivityLogs.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No account activity recorded yet"
              description="As supporters register, log in, or sign out of their accounts, their activity and session records will automatically stream here."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Activity Event</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">IP Address &amp; Origin</th>
                      <th className="py-3 px-4">Client Device</th>
                      <th className="py-3 px-4 text-right">Event Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredActivityLogs.map((log) => {
                      const isSignup = log.action === 'signup';
                      const isLogin = log.action === 'login';
                      const isLogout = log.action === 'logout';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* User */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isSignup
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isLogin
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {log.user_name ? log.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{log.user_name}</div>
                                <div className="text-[11px] text-slate-400 font-normal">{log.user_email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Event Action */}
                          <td className="py-3.5 px-4">
                            {isSignup && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Account Created</span>
                              </span>
                            )}
                            {isLogin && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                <LogIn className="w-3.5 h-3.5 text-sky-600" />
                                <span>Signed In</span>
                              </span>
                            )}
                            {isLogout && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                                <span>Signed Out</span>
                              </span>
                            )}
                            {log.details && (
                              <div className="text-[10px] text-slate-400 mt-1 max-w-[200px] truncate">
                                {log.details}
                              </div>
                            )}
                          </td>

                          {/* Timestamp */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-medium">
                              {new Date(log.created_at).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-emerald-600 font-medium">{formatRelativeTime(log.created_at)}</span>
                            </div>
                          </td>

                          {/* IP Address */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-700 font-mono text-[11px]">
                              {log.ip_address || 'Direct'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {log.ip_address?.startsWith('127.') || log.ip_address === '::1' || log.ip_address === 'Direct'
                                ? 'Local Session'
                                : 'Public Network'}
                            </div>
                          </td>

                          {/* Client Device */}
                          <td className="py-3.5 px-4 max-w-[200px]">
                            <div className="flex items-center gap-1 text-slate-600 text-[11px] truncate">
                              <Laptop className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">
                                {log.user_agent ? (
                                  log.user_agent.includes('Chrome')
                                    ? 'Chrome Browser'
                                    : log.user_agent.includes('Safari')
                                    ? 'Safari Browser'
                                    : log.user_agent.includes('Firefox')
                                    ? 'Firefox Browser'
                                    : 'Web Browser'
                                ) : (
                                  'Client App'
                                )}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {log.user_agent ? log.user_agent.slice(0, 45) : 'Standard Session'}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-right">
                            {log.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Failed</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* ROLE ASSIGNMENT MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Permissions: {roleModalUser.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Select an administrative role or return user to standard supporter access.
                </p>
              </div>
            </div>

            <div className="space-y-2 py-2">
              {[
                {
                  id: 'admin',
                  title: 'Administrator',
                  desc: 'Full read/write permissions to all tables, security policies, and ledger.',
                },
                {
                  id: 'finance_manager',
                  title: 'Finance Manager',
                  desc: 'Manage donations ledger, log offline contributions, review payouts.',
                },
                {
                  id: 'program_coordinator',
                  title: 'Program Coordinator',
                  desc: 'Manage sponsored children profiles, review letters, and upload field reports.',
                },
                {
                  id: 'donor',
                  title: 'Donor / Supporter',
                  desc: 'Standard public portal access with personal giving history.',
                },
              ].map((r) => (
                <label
                  key={r.id}
                  onClick={() => setTargetRole(r.id as UserRole)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    targetRole === r.id
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="roleOption"
                    checked={targetRole === r.id}
                    onChange={() => setTargetRole(r.id as UserRole)}
                    className="mt-1 text-emerald-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{r.title}</div>
                    <div className="text-[11px] text-slate-500 leading-tight">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={roleUpdating}
                onClick={handleRoleChangeConfirm}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {roleUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Role Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS TOGGLE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={Boolean(statusModalUser)}
        title={statusModalUser?.is_active ? 'Suspend User Access' : 'Reactivate User Account'}
        message={
          statusModalUser?.is_active
            ? `Are you sure you want to suspend account access for ${statusModalUser?.name}? They will not be able to log in to the portal.`
            : `Are you sure you want to reactivate ${statusModalUser?.name}?`
        }
        confirmLabel={statusModalUser?.is_active ? 'Suspend Account' : 'Reactivate Account'}
        isDestructive={Boolean(statusModalUser?.is_active)}
        isLoading={statusUpdating}
        onConfirm={handleStatusToggleConfirm}
        onCancel={() => setStatusModalUser(null)}
      />
    </div>
  );
}
