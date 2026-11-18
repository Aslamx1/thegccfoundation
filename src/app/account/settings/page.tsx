'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/AccountLayout';
import { useAuth } from '@/context/AuthContext';

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Choose a valid image file.'));
      image.onload = () => {
        const scale = Math.min(1, 800 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function SettingsForm() {
  const { user, updateProfile, resetPassword, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [birthday, setBirthday] = useState(user?.birthday ?? '');
  const [language, setLanguage] = useState(user?.language ?? 'English (US)');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [editing, setEditing] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
    setBirthday(user?.birthday ?? '');
    setLanguage(user?.language ?? 'English (US)');
    setAvatar(user?.avatar ?? '');
  }, [user]);

  async function saveField(event: FormEvent, field: 'name' | 'phone' | 'birthday' | 'language' | 'avatar', value: string) {
    event.preventDefault();
    if (!user) return;
    updateProfile({ [field]: value } as Parameters<typeof updateProfile>[0]);
    setEditing('');
    setStatus('Account settings saved.');
    window.setTimeout(() => setStatus(''), 3000);
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault();
    if (!user || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      await resetPassword(user.email, newPassword);
      setNewPassword('');
      setEditing('');
      setError('');
      setStatus('Password updated successfully.');
      window.setTimeout(() => setStatus(''), 3000);
    } catch {
      setError('Could not update password. Please try again.');
    }
  }

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    try {
      const photo = await compressImage(file);
      setAvatar(photo);
      if (user) updateProfile({ avatar: photo });
      setStatus('Profile photo updated.');
      setError('');
    } catch {
      setError('That image could not be loaded. Choose another file.');
    }
  }

  function requestDeactivation() {
    if (!user) return;
    setConfirmDeactivate(false);
    logout();
  }

  function row(label: string, value: React.ReactNode, action: React.ReactNode) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0ec] py-5">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#20251f]">{label}</h3>
          <div className="mt-1 text-sm text-[#626b64]">{value}</div>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    );
  }
  const editButton = (key: string, label = 'Edit') => (
    <button
      type="button"
      onClick={() => setEditing(editing === key ? '' : key)}
      className="rounded-full border border-[#cfd6d0] px-4 py-2 text-sm font-bold text-[#20251f] hover:bg-[#f7faf7]"
    >
      {editing === key ? 'Cancel' : label}
    </button>
  );
  const saveButton = (
    <button className="rounded-full bg-[#02a95c] px-4 py-2 text-sm font-bold text-white hover:bg-[#087443]">
      Save
    </button>
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#087443]">Settings</p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#20251f]">Account</h2>
        </div>
        <Link href="/account/notifications" className="text-sm font-bold text-[#087443] hover:underline">
          Notification settings
        </Link>
      </div>
      <div className="divide-y divide-[#edf0ec]">
        {row(
          'Profile photo',
          <span className="flex items-center gap-3">
            {avatar ? (
              <img src={avatar} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf5ed] text-xl font-bold text-[#087443]">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <label className="cursor-pointer rounded-full border border-[#cfd6d0] px-4 py-2 text-sm font-bold text-[#20251f] hover:bg-[#f7faf7]">
              Upload photo
              <input type="file" accept="image/*" onChange={uploadPhoto} className="sr-only" />
            </label>
          </span>,
          <span className="text-sm text-[#818981]">JPG or PNG</span>
        )}
        {row(
          'Name',
          editing === 'name' ? (
            <form onSubmit={(event) => saveField(event, 'name', name)} className="flex flex-wrap gap-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={80}
                className="h-10 rounded-lg border border-[#cfd6d0] px-3 text-sm"
              />
              {saveButton}
            </form>
          ) : (
            name
          ),
          editButton('name')
        )}
        {row(
          'Verification phone number',
          editing === 'phone' ? (
            <form onSubmit={(event) => saveField(event, 'phone', phone)} className="flex flex-wrap gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+256 700 000 000"
                className="h-10 rounded-lg border border-[#cfd6d0] px-3 text-sm"
              />
              {saveButton}
            </form>
          ) : (
            phone || 'No phone number'
          ),
          editButton('phone', phone ? 'Edit' : 'Add')
        )}
        {row('Email address', user?.email ?? '', <span className="text-xs font-semibold text-[#087443]">Verified</span>)}
        {row(
          'Birthday',
          editing === 'birthday' ? (
            <form onSubmit={(event) => saveField(event, 'birthday', birthday)} className="flex flex-wrap gap-2">
              <input
                type="date"
                value={birthday}
                onChange={(event) => setBirthday(event.target.value)}
                className="h-10 rounded-lg border border-[#cfd6d0] px-3 text-sm"
              />
              {saveButton}
            </form>
          ) : birthday ? (
            new Date(`${birthday}T00:00:00`).toLocaleDateString()
          ) : (
            'Add your birthday'
          ),
          editButton('birthday', birthday ? 'Edit' : 'Add')
        )}
        {row(
          'Password',
          editing === 'password' ? (
            <form onSubmit={savePassword} className="flex flex-wrap gap-2">
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New password (min 6 chars)"
                minLength={6}
                required
                className="h-10 rounded-lg border border-[#cfd6d0] px-3 text-sm"
              />
              {saveButton}
            </form>
          ) : (
            '••••••••••••'
          ),
          editButton('password')
        )}
        {row(
          'Preferred communications language',
          editing === 'language' ? (
            <form onSubmit={(event) => saveField(event, 'language', language)} className="flex flex-wrap gap-2">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-10 rounded-lg border border-[#cfd6d0] bg-white px-3 text-sm"
              >
                {['English (US)', 'English (UK)', 'Swahili', 'French'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              {saveButton}
            </form>
          ) : (
            language
          ),
          editButton('language')
        )}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {status && <p role="status" className="mt-4 rounded-xl bg-[#eaf5ed] p-3 text-sm text-[#087443]">{status}</p>}
      <section className="mt-9 border-t border-[#edf0ec] pt-7">
        <h3 className="text-lg font-bold text-[#20251f]">Public profile</h3>
        <p className="mt-1 text-sm text-[#626b64]">View your public community profile and fundraisers.</p>
        <Link href="/account/profile" className="mt-4 inline-flex rounded-full border border-[#cfd6d0] px-5 py-2.5 text-sm font-bold text-[#20251f] hover:bg-[#f7faf7]">
          View profile
        </Link>
      </section>
      <section className="mt-9 border-t border-[#edf0ec] pt-7">
        <h3 className="text-lg font-bold text-[#20251f]">Deactivate account</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#626b64]">
          If you deactivate your account, you will be signed out and your fundraisers will be paused until you contact GCC Foundation support.
        </p>
        <button
          type="button"
          onClick={() => setConfirmDeactivate(true)}
          className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
        >
          Deactivate account
        </button>
      </section>
      {confirmDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="deactivate-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 id="deactivate-title" className="text-lg font-bold text-[#20251f]">Deactivate your account?</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#626b64]">
              Are you sure you want to deactivate your GCC Foundation account? You will be signed out immediately.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirmDeactivate(false)} className="rounded-full border border-[#cfd6d0] px-4 py-2 text-sm font-bold">
                Cancel
              </button>
              <button onClick={requestDeactivation} className="rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AccountLayout active="settings" title="Account settings" description="Manage your account details, profile, and communications.">
      <SettingsForm />
    </AccountLayout>
  );
}
