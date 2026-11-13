'use client';

import { useState } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/AccountLayout';
import { useAuth } from '@/context/AuthContext';
import { copyTextToClipboard } from '@/lib/browser';

function ProfileDetails() {
  const { user } = useAuth();
  const [shareMessage, setShareMessage] = useState('');
  if (!user) return null;
  const profileUrl = typeof window === 'undefined' ? `/u/${user.id}` : `${window.location.origin}/u/${user.id}`;

  async function shareProfile() {
    try {
      await copyTextToClipboard(profileUrl);
      setShareMessage('Profile link copied.');
    } catch {
      setShareMessage(profileUrl);
    }
    window.setTimeout(() => setShareMessage(''), 3000);
  }

  return <div>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-xl font-bold text-[#20251f]">Your profile</h2><p className="mt-1 text-sm text-[#626b64]">A profile helps your community recognise and connect with you.</p></div>
      <span className="rounded-full bg-[#f1f4f0] px-3 py-1.5 text-xs font-bold text-[#59615b]">{user.isProfilePublic ? 'Public' : 'Private'}</span>
    </div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#e4e8e3]">
      <div className="h-32 bg-gradient-to-r from-[#087443] via-[#02a95c] to-[#a9dbb6] sm:h-40">{user.coverImage && <img src={user.coverImage} alt="Profile cover" className="h-full w-full object-cover" />}</div>
      <div className="px-5 pb-6">
        <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e2f1e6] text-2xl font-extrabold text-[#087443] shadow-sm">{user.avatar ? <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" /> : user.name.charAt(0).toUpperCase()}</div>
        <h3 className="mt-3 text-xl font-bold text-[#20251f]">{user.name}</h3>
        {user.location && <p className="mt-1 text-sm text-[#626b64]">{user.location}</p>}
        {user.isProfilePublic && user.bio && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#626b64]">{user.bio}</p>}
        {user.isProfilePublic && !!user.causes?.length && <div className="mt-4 flex flex-wrap gap-2">{user.causes.map((cause) => <span key={cause} className="rounded-full bg-[#eaf5ed] px-3 py-1.5 text-xs font-semibold text-[#087443]">{cause}</span>)}</div>}
      </div>
    </div>
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href="/account/settings" className="inline-flex rounded-full border border-[#cfd6d0] px-5 py-3 text-sm font-bold text-[#20251f] hover:bg-[#f7faf7]">Edit profile</Link>
      <Link href={`/u/${user.id}`} className="inline-flex rounded-full bg-[#02a95c] px-5 py-3 text-sm font-bold text-white hover:bg-[#087443]">View public profile</Link>
      <button type="button" onClick={shareProfile} className="inline-flex rounded-full border border-[#cfd6d0] px-5 py-3 text-sm font-bold text-[#20251f] hover:bg-[#f7faf7]">Share profile</button>
    </div>
    {shareMessage && <p role="status" className="mt-3 break-all text-sm text-[#087443]">{shareMessage}</p>}
    <p className="mt-5 text-xs leading-relaxed text-[#818981]">Profile link: {profileUrl}</p>
  </div>;
}

export default function ProfilePage() {
  return <AccountLayout active="profile" title="Profile" description="Manage and share your GCC community profile."><ProfileDetails /></AccountLayout>;
}
