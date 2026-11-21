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
  CheckCircle2,
  XCircle,
  Activity,
  LogIn,
  LogOut,
  UserPlus,
  Download,
  RefreshCw,
  Clock,
  Shield,
  Laptop,
  Eye,
  X,
  Copy,
  Check,
  Globe,
  Mail,
  Sparkles,
} from 'lucide-react';

export default function AdminAccountsPage() {
  const toast = useAdminToast();
  const searchParams = useSearchParams();

  // Active view tab: 'accounts' (all registered accounts with full details) or 'audit' (logins/logouts/signups)
  const [activeTab, setActiveTab] = useState<'accounts' | 'audit'>('accounts');

  // Registered Accounts State
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuthAuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | 'signup' | 'login' | 'logout'>('all');

  // Full Details Modal for a Selected User
  const [detailsModalUser, setDetailsModalUser] = useState<Profile | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Role Change Modal
  const [roleModalUser, setRoleModalUser] = useState<Profile | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('donor');
  const [roleUpdating, setRoleUpdating] = useState(false);

  // Status Toggle Modal
  const [statusModalUser, setStatusModalUser] = useState<Profile | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Check query params to pre-select audit tab if requested
  useEffect(() => {
    if (searchParams.get('tab') === 'audit' || searchParams.get('tab') === 'activity') {
      setActiveTab('audit');
    }
  }, [searchParams]);

  // Load registered users
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to load registered accounts directory.');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load authentication & session audit logs
  const loadAuditLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await AdminService.getAuthAuditLogs();
      setAuditLogs(data);
    } catch {
      toast.error('Failed to load login and session audit logs.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadAuditLogs();
  }, []);

  // Live Refresh handler
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([loadUsers(), loadAuditLogs()]);
      toast.success('Accounts and session logs refreshed.');
    } catch {
      toast.error('Refresh failed.');
    } finally {
      setRefreshing(false);
    }
  };

  // Format date helper
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Relative time helper
  const getRelativeTime = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Parse User Agent to readable device/browser
  const parseUserAgent = (ua?: string | null) => {
    if (!ua || ua === 'Browser') return 'Desktop Browser';
    let browser = 'Browser';
    let os = '';

    if (ua.includes('Edg/')) browser = 'Edge';
    else if (ua.includes('Chrome/')) browser = 'Chrome';
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox/')) browser = 'Firefox';

    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('iPhone')) os = 'iPhone (iOS)';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('Linux')) os = 'Linux';

    return os ? `${browser} on ${os}` : browser;
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.id || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q) ||
        (u.location || '').toLowerCase().includes(q);

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.is_active) ||
        (statusFilter === 'inactive' && !u.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, userSearch, roleFilter, statusFilter]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = auditSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (log.user_name || '').toLowerCase().includes(q) ||
        (log.user_email || '').toLowerCase().includes(q) ||
        (log.ip_address || '').toLowerCase().includes(q) ||
        (log.user_agent || '').toLowerCase().includes(q) ||
        (log.details || '').toLowerCase().includes(q) ||
        (log.user_id || '').toLowerCase().includes(q);

      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [auditLogs, auditSearch, actionFilter]);

  // Export Registered Accounts to CSV
  const exportAccountsCSV = () => {
    if (filteredUsers.length === 0) {
      toast.info('No account records to export.');
      return;
    }

    const headers = [
      'Account ID',
      'Full Name',
      'Email Address',
      'Role',
      'Status',
      'Verified',
      'Phone Number',
      'Location',
      'Account Created At',
      'Total Giving (USD)',
    ];

    const rows = filteredUsers.map((u) => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.is_active ? 'Active' : 'Suspended'}"`,
      `"${u.is_verified ?? true ? 'Yes' : 'No'}"`,
      `"${(u.phone || '').replace(/"/g, '""')}"`,
      `"${(u.location || '').replace(/"/g, '""')}"`,
      `"${u.created_at}"`,
      `"${(u.giving_total || 0).toFixed(2)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GCC_Registered_Accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredUsers.length} account profiles to CSV.`);
  };

  // Export Audit Logs to CSV
  const exportAuditLogsCSV = () => {
    if (filteredAuditLogs.length === 0) {
      toast.info('No audit logs to export.');
      return;
    }

    const headers = [
      'Event ID',
      'Action Type',
      'User Name',
      'User Email',
      'User ID',
      'Timestamp (UTC)',
      'IP Address',
      'Client Device / User Agent',
      'Status',
      'Details',
    ];

    const rows = filteredAuditLogs.map((log) => [
      `"${log.id}"`,
      `"${log.action}"`,
      `"${(log.user_name || '').replace(/"/g, '""')}"`,
      `"${log.user_email}"`,
      `"${log.user_id || ''}"`,
      `"${log.created_at}"`,
      `"${log.ip_address || ''}"`,
      `"${(log.user_agent || '').replace(/"/g, '""')}"`,
      `"${log.status}"`,
      `"${(log.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GCC_Session_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredAuditLogs.length} audit logs to CSV.`);
  };

  // Role update confirm
  const handleUpdateRole = async () => {
    if (!roleModalUser) return;
    try {
      setRoleUpdating(true);
      const updated = await AdminService.updateUserRole(roleModalUser.id, targetRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      if (detailsModalUser?.id === updated.id) {
        setDetailsModalUser(updated);
      }
      toast.success(`Updated role for ${updated.name} to ${updated.role}.`);
      setRoleModalUser(null);
    } catch {
      toast.error('Failed to update user role.');
    } finally {
      setRoleUpdating(false);
    }
  };

  // Status toggle confirm
  const handleToggleStatus = async () => {
    if (!statusModalUser) return;
    try {
      setStatusUpdating(true);
      const newStatus = !statusModalUser.is_active;
      const updated = await AdminService.toggleUserStatus(statusModalUser.id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      if (detailsModalUser?.id === updated.id) {
        setDetailsModalUser(updated);
      }
      toast.success(
        newStatus
          ? `Account for ${updated.name} activated.`
          : `Account for ${updated.name} suspended.`
      );
      setStatusModalUser(null);
    } catch {
      toast.error('Failed to change user account status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Copy User ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success('Account ID copied to clipboard.');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Role Badge Helper
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3 h-3 text-rose-600" />
            Admin
          </span>
        );
      case 'finance_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Finance
          </span>
        );
      case 'program_coordinator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Programs
          </span>
        );
      case 'volunteer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Volunteer
          </span>
        );
      case 'donor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Donor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Supporter
          </span>
        );
    }
  };

  // Action Badge Helper
  const getActionBadge = (action: AuthActionType) => {
    switch (action) {
      case 'signup':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            Account Created
          </span>
        );
      case 'login':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <LogIn className="w-3.5 h-3.5 text-blue-600" />
            Signed In
          </span>
        );
      case 'logout':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            Signed Out
          </span>
        );
    }
  };

  // User-specific audit logs for details modal
  const userSpecificLogs = useMemo(() => {
    if (!detailsModalUser) return [];
    return auditLogs.filter(
      (log) =>
        (log.user_id && log.user_id === detailsModalUser.id) ||
        (log.user_email && log.user_email.toLowerCase() === detailsModalUser.email.toLowerCase())
    );
  }, [detailsModalUser, auditLogs]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalAccounts = users.length;
    const signups = auditLogs.filter((l) => l.action === 'signup').length;
    const logins = auditLogs.filter((l) => l.action === 'login').length;
    const logouts = auditLogs.filter((l) => l.action === 'logout').length;
    return {
      totalAccounts,
      signups: signups || totalAccounts,
      logins,
      logouts,
    };
  }, [users, auditLogs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Admin Security &amp; Access Controls
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registered Accounts &amp; Session Activity
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Real-time administrative ledger of all created accounts, donor registrations, and user login/logout activity.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {activeTab === 'accounts' ? (
            <button
              onClick={exportAccountsCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Accounts CSV</span>
            </button>
          ) : (
            <button
              onClick={exportAuditLogsCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accounts Created
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.totalAccounts}
          </div>
          <p className="text-[11px] text-slate-500">Total registered supporters &amp; staff</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Sign-Ins
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.logins}
          </div>
          <p className="text-[11px] text-slate-500">Authenticated user sessions</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Signed Out Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.logouts}
          </div>
          <p className="text-[11px] text-slate-500">Terminated sessions recorded</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Audit Events Monitored
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {auditLogs.length}
          </div>
          <p className="text-[11px] text-slate-500">Security &amp; auth history records</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'accounts'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Registered Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Login &amp; Session Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL REGISTERED ACCOUNTS WITH FULL DETAILS */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, account ID, phone, or location..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by account role"
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="finance_manager">Finance Managers</option>
                <option value="program_coordinator">Program Coordinators</option>
                <option value="donor">Donors</option>
                <option value="volunteer">Volunteers</option>
                <option value="user">Supporters</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by account status"
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loadingUsers ? (
              <div className="p-6">
                <TableSkeleton rows={5} cols={6} />
              </div>
            ) : filteredUsers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Registered Accounts Found"
                description={
                  userSearch || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'No registered user matches your active search or filter criteria.'
                    : 'No external users have created accounts yet.'
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-4">Account User</th>
                      <th className="py-3 px-4">Role &amp; Permissions</th>
                      <th className="py-3 px-4">Account Created</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Status &amp; Verification</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* User Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                              {u.avatar_url ? (
                                <Image
                                  src={u.avatar_url}
                                  alt={u.name}
                                  width={36}
                                  height={36}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                u.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                                {u.name}
                              </div>
                              <div className="text-xs text-slate-500 truncate">{u.email}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ID: {u.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getRoleBadge(u.role)}
                        </td>

                        {/* Created At */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-slate-800">
                            {formatDate(u.created_at)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {getRelativeTime(u.created_at)}
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{u.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{u.location || 'Unknown region'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Status & Verification */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            {u.is_active ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Suspended
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Email Verified
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setDetailsModalUser(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="View full account profile & history"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span>View Details</span>
                            </button>

                            <button
                              onClick={() => {
                                setRoleModalUser(u);
                                setTargetRole(u.role);
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                              title="Change permissions / role"
                            >
                              <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            </button>

                            <button
                              onClick={() => setStatusModalUser(u)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.is_active
                                  ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                                  : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'
                              }`}
                              title={u.is_active ? 'Suspend account' : 'Activate account'}
                            >
                              {u.is_active ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE LOGIN & SESSION AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Action Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by user name, email, IP address, device, or action details..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Action Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActionFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  actionFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Events ({auditLogs.length})
              </button>
              <button
                onClick={() => setActionFilter('signup')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  actionFilter === 'signup'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign-Ups ({auditLogs.filter((l) => l.action === 'signup').length})
              </button>
              <button
                onClick={() => setActionFilter('login')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  actionFilter === 'login'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Logins ({auditLogs.filter((l) => l.action === 'login').length})
              </button>
              <button
                onClick={() => setActionFilter('logout')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  actionFilter === 'logout'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                Logouts ({auditLogs.filter((l) => l.action === 'logout').length})
              </button>
            </div>
          </div>

          {/* Audit Trail Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loadingLogs ? (
              <div className="p-6">
                <TableSkeleton rows={6} cols={6} />
              </div>
            ) : filteredAuditLogs.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No Session Activity Found"
                description={
                  auditSearch || actionFilter !== 'all'
                    ? 'No login, logout, or sign-up activity matches your current filters.'
                    : 'No authentication events have occurred yet. New sign-ins and registrations will appear here automatically.'
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">User Identity</th>
                      <th className="py-3 px-4">Timestamp (UTC)</th>
                      <th className="py-3 px-4">Network &amp; IP</th>
                      <th className="py-3 px-4">Device &amp; Browser</th>
                      <th className="py-3 px-4">Result / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Event Type */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getActionBadge(log.action)}
                        </td>

                        {/* User */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 truncate">
                            {log.user_name || 'Supporter'}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{log.user_email}</div>
                          {log.user_id && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ID: {log.user_id}
                            </div>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-slate-800">
                            {formatDate(log.created_at)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {getRelativeTime(log.created_at)}
                          </div>
                        </td>

                        {/* Network & IP */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs text-slate-700">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span>{log.ip_address || 'Direct'}</span>
                          </div>
                        </td>

                        {/* Device / Client */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700">
                            <Laptop className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]" title={log.user_agent || ''}>
                              {parseUserAgent(log.user_agent)}
                            </span>
                          </div>
                        </td>

                        {/* Result / Details */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            {log.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Success
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                Failed
                              </span>
                            )}
                            {log.details && (
                              <div className="text-[11px] text-slate-500 truncate max-w-[240px]" title={log.details}>
                                {log.details}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL ACCOUNT DETAILS MODAL / DRAWER */}
      {detailsModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-base flex items-center justify-center border border-emerald-200 shadow-xs">
                  {detailsModalUser.avatar_url ? (
                    <Image
                      src={detailsModalUser.avatar_url}
                      alt={detailsModalUser.name}
                      width={48}
                      height={48}
                      className="rounded-2xl object-cover"
                    />
                  ) : (
                    detailsModalUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {detailsModalUser.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">{detailsModalUser.email}</span>
                    {getRoleBadge(detailsModalUser.role)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetailsModalUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account ID */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Unique Account ID</span>
                  <button
                    onClick={() => handleCopyId(detailsModalUser.id)}
                    className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-[11px]"
                  >
                    {copiedId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs font-semibold text-slate-800 truncate">
                  {detailsModalUser.id}
                </div>
              </div>

              {/* Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Account Status
                </span>
                <div className="flex items-center gap-2">
                  {detailsModalUser.is_active ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Active &amp; Permitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      Suspended / Access Denied
                    </span>
                  )}
                  <span className="text-xs text-emerald-600 font-medium">Verified Email</span>
                </div>
              </div>

              {/* Created At */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Registration Date
                </span>
                <div className="text-xs font-semibold text-slate-800">
                  {formatDate(detailsModalUser.created_at)}
                </div>
                <div className="text-[10px] text-slate-500">
                  {getRelativeTime(detailsModalUser.created_at)}
                </div>
              </div>

              {/* Phone & Location */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Contact &amp; Location
                </span>
                <div className="text-xs text-slate-800 font-medium">
                  Phone: {detailsModalUser.phone || 'Not provided'}
                </div>
                <div className="text-xs text-slate-500">
                  Location: {detailsModalUser.location || 'Uganda (East Africa)'}
                </div>
              </div>
            </div>

            {/* User Specific Audit History */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Recent Session History for this User ({userSpecificLogs.length})
                </h3>
              </div>

              {userSpecificLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No individual session logs recorded for this account yet.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {userSpecificLogs.map((log) => (
                    <div key={log.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        {getActionBadge(log.action)}
                        <div>
                          <div className="font-semibold text-slate-800">{log.details || log.action}</div>
                          <div className="text-[10px] text-slate-400">
                            IP: {log.ip_address || 'Direct'} &bull; {parseUserAgent(log.user_agent)}
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {getRelativeTime(log.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setRoleModalUser(detailsModalUser);
                    setTargetRole(detailsModalUser.role);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                >
                  Change Role
                </button>
                <button
                  onClick={() => setStatusModalUser(detailsModalUser)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    detailsModalUser.is_active
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {detailsModalUser.is_active ? 'Suspend Account' : 'Activate Account'}
                </button>
              </div>

              <button
                onClick={() => setDetailsModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Account Role</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign administrative or supporter privileges to {roleModalUser.name}
                </p>
              </div>
              <button
                onClick={() => setRoleModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'admin', title: 'Administrator', desc: 'Full permissions to all sections and ledger.' },
                { id: 'finance_manager', title: 'Finance Manager', desc: 'Manage ledger, log contributions, review receipts.' },
                { id: 'program_coordinator', title: 'Program Coordinator', desc: 'Manage children profiles, sponsorships, letters.' },
                { id: 'donor', title: 'Donor / Supporter', desc: 'Standard portal access with personal giving history.' },
                { id: 'volunteer', title: 'Volunteer', desc: 'Field activities and verified hours.' },
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
                    name="roleOptionAccounts"
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
                onClick={handleUpdateRole}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {roleUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Role Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(statusModalUser)}
        title={statusModalUser?.is_active ? 'Suspend User Access' : 'Reactivate User Account'}
        message={
          statusModalUser?.is_active
            ? `Are you sure you want to suspend account access for ${statusModalUser?.name}? They will not be able to log in to the portal.`
            : `Are you sure you want to reactivate access for ${statusModalUser?.name}?`
        }
        confirmLabel={statusModalUser?.is_active ? 'Suspend Account' : 'Reactivate Account'}
        isDestructive={Boolean(statusModalUser?.is_active)}
        isLoading={statusUpdating}
        onConfirm={handleToggleStatus}
        onCancel={() => setStatusModalUser(null)}
      />
    </div>
  );
}
