'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  HelpCircle,
  Inbox,
  Loader2,
} from 'lucide-react';

// ==============================================================================
// 1. STATUS BADGES
// ==============================================================================
export type StatusBadgeType =
  | 'available'
  | 'sponsored'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'succeeded'
  | 'failed'
  | 'active'
  | 'draft'
  | 'paused'
  | 'completed'
  | 'admin'
  | 'finance_manager'
  | 'program_coordinator'
  | 'donor'
  | 'volunteer'
  | 'user'
  | 'online'
  | 'offline'
  | string;

export function StatusBadge({ status, label }: { status: StatusBadgeType; label?: string }) {
  const norm = (status || '').toLowerCase();
  const displayLabel = label || status.replace(/_/g, ' ');

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = HelpCircle;

  if (norm === 'available' || norm === 'active' || norm === 'approved' || norm === 'succeeded' || norm === 'sent') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    Icon = CheckCircle;
  } else if (norm === 'sponsored' || norm === 'finance_manager' || norm === 'program_coordinator') {
    style = 'bg-sky-50 text-sky-700 border-sky-200/80';
    Icon = CheckCircle;
  } else if (norm === 'pending' || norm === 'pending_review' || norm === 'draft' || norm === 'paused') {
    style = 'bg-amber-50 text-amber-700 border-amber-200/80';
    Icon = Clock;
  } else if (norm === 'rejected' || norm === 'failed' || norm === 'cancelled') {
    style = 'bg-rose-50 text-rose-700 border-rose-200/80';
    Icon = XCircle;
  } else if (norm === 'admin') {
    style = 'bg-purple-50 text-purple-700 border-purple-200/80 font-semibold';
    Icon = CheckCircle;
  } else if (norm === 'donor') {
    style = 'bg-teal-50 text-teal-700 border-teal-200/80';
    Icon = CheckCircle;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{displayLabel}</span>
    </span>
  );
}

// ==============================================================================
// 2. CONFIRMATION MODAL
// ==============================================================================
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-sm transition-all disabled:opacity-50 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 3. EMPTY STATE
// ==============================================================================
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ==============================================================================
// 4. LOADING SKELETONS
// ==============================================================================
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
