'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/AccountLayout';
import { useAuth } from '@/context/AuthContext';

type Preferences = { fundraiserUpdates: boolean; donationReceipts: boolean; communityNews: boolean; accountAlerts: boolean };
const defaults: Preferences = { fundraiserUpdates: true, donationReceipts: true, communityNews: false, accountAlerts: true };
const choices: { key: keyof Preferences; title: string; detail: string }[] = [
  { key: 'fundraiserUpdates', title: 'Fundraiser updates', detail: 'Hear about updates to fundraisers you support or organize.' },
  { key: 'donationReceipts', title: 'Donation receipts', detail: 'Receive a confirmation when you make a donation.' },
  { key: 'communityNews', title: 'Community news and tips', detail: 'Get occasional GCC Foundation news, resources, and ideas.' },
  { key: 'accountAlerts', title: 'Account and security alerts', detail: 'Important notices about your account and sign-in activity.' },
];

function NotificationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const key = user ? `gcc_foundation_notification_preferences_${user.id}` : '';
  useEffect(() => {
    if (!key) return;
    try { const value = localStorage.getItem(key); if (value) setPreferences({ ...defaults, ...JSON.parse(value) }); }
    catch { setPreferences(defaults); }
    setReady(true);
  }, [key]);
  function toggle(name: keyof Preferences) {
    const next = { ...preferences, [name]: !preferences[name] };
    setPreferences(next);
    if (key) { try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Keep current preferences for this session. */ } }
    setSaved(true); window.setTimeout(() => setSaved(false), 2500);
  }
  return <div>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-[#087443]">Settings</p><h2 className="mt-1 text-2xl font-extrabold text-[#20251f]">Notifications</h2><p className="mt-2 text-sm text-[#626b64]">Choose which updates you’d like to receive.</p></div><Link href="/account/settings" className="text-sm font-bold text-[#087443] hover:underline">Account settings</Link></div>
    <div className="divide-y divide-[#edf0ec] rounded-2xl border border-[#e4e8e3] px-5">{choices.map((choice) => <label key={choice.key} className="flex cursor-pointer items-start justify-between gap-5 py-5"><span><span className="block text-sm font-bold text-[#20251f]">{choice.title}</span><span className="mt-1 block max-w-lg text-sm leading-relaxed text-[#626b64]">{choice.detail}</span></span><input type="checkbox" checked={ready && preferences[choice.key]} onChange={() => toggle(choice.key)} disabled={!ready} className="mt-1 h-5 w-5 shrink-0 accent-[#02a95c]" aria-label={choice.title}/></label>)}</div>
    <p className="mt-4 text-xs leading-relaxed text-[#818981]">These preferences are saved in this browser for this demo. Email delivery will be available when notification services are connected.</p>
    {saved && <p role="status" className="mt-3 text-sm font-semibold text-[#087443]">Notification preferences saved.</p>}
  </div>;
}

export default function NotificationsPage() { return <AccountLayout active="notifications" title="Notifications" description="Manage the updates and account notices you receive."><NotificationPreferences /></AccountLayout>; }