'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { AdminService } from '@/lib/supabase/admin-service';
import { Profile, UserRole } from '@/lib/supabase/types';
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
} from 'lucide-react';

export default function UsersDirectoryPage() {
  const toast = useAdminToast();

  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Role Change Confirmation Modal
  const [roleModalUser, setRoleModalUser] = useState<Profile | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('donor');
  const [roleUpdating, setRoleUpdating] = useState(false);

  // Status Toggle Confirmation Modal
  const [statusModalUser, setStatusModalUser] = useState<Profile | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Donor &amp; Staff Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage authenticated profiles, audit cumulative giving histories, and assign administrative permissions.
          </p>
        </div>
      </div>

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
      {loading ? (
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
