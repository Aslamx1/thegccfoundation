'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/AccountLayout';
import { useAuth } from '@/context/AuthContext';
import { copyTextToClipboard } from '@/lib/browser';
import { CheckCircle2, MapPin, Phone, Mail, FileText } from 'lucide-react';

function ProfileDetails() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isProfilePublic, setIsProfilePublic] = useState(user?.isProfilePublic ?? true);
  const [savedNotice, setSavedNotice] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    setPhone(user.phone || '');
    setLocation(user.location || '');
    setBio(user.bio || '');
    setIsProfilePublic(user.isProfilePublic ?? true);
  }, [user]);

  if (!user) return null;
  const profileUrl =
    typeof window === 'undefined' ? `/u/${user.id}` : `${window.location.origin}/u/${user.id}`;

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name: name.trim() || user?.name,
      phone: phone.trim(),
      location: location.trim(),
      bio: bio.trim(),
      isProfilePublic,
    });
    setSavedNotice(
      'Your profile, contact details, and billing/tax receipt address have been saved.'
    );
    window.setTimeout(() => setSavedNotice(''), 4000);
  }

  async function shareProfile() {
    try {
      await copyTextToClipboard(profileUrl);
      setShareMessage('Profile link copied to clipboard.');
    } catch {
      setShareMessage(profileUrl);
    }
    window.setTimeout(() => setShareMessage(''), 3000);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#20251f]">Your Profile & Tax Receipt Details</h2>
          <p className="mt-1 text-sm text-[#626b64]">
            Manage your contact information and billing/tax address so automated tax receipts and update letters are generated accurately.
          </p>
        </div>
        <span className="rounded-full bg-[#eaf5ed] px-3.5 py-1.5 text-xs font-bold text-[#087443]">
          {isProfilePublic ? 'Public Profile' : 'Private Profile'}
        </span>
      </div>

      {/* Profile Header Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e4e8e3]">
        <div className="h-28 bg-gradient-to-r from-[#087443] via-[#02a95c] to-[#a9dbb6] sm:h-36">
          {user.coverImage && (
            <img src={user.coverImage} alt="Profile cover" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="px-5 pb-6">
          <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e2f1e6] text-2xl font-extrabold text-[#087443] shadow-sm">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <h3 className="mt-3 text-xl font-bold text-[#20251f]">{user.name}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#626b64]">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#02a95c]" />
              {user.email}
            </span>
            {user.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-[#02a95c]" />
                {user.phone}
              </span>
            )}
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#02a95c]" />
                {user.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-[#087443] flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Editable Profile & Billing/Tax Address Form */}
      <form onSubmit={handleSaveProfile} className="space-y-5 rounded-2xl border border-[#e4e8e3] bg-[#f8faf7] p-6">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#20251f]">
          <FileText className="h-4 w-4 text-[#02a95c]" />
          <span>Contact & Billing / Tax Receipt Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Legal Name (for Tax Receipts)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Namukasa"
              className="h-11 w-full rounded-xl border border-[#cfd6d0] bg-white px-3.5 text-sm focus:border-[#02a95c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 text-sm text-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Phone / WhatsApp Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+256 703 601 200"
              className="h-11 w-full rounded-xl border border-[#cfd6d0] bg-white px-3.5 text-sm focus:border-[#02a95c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Billing / Tax Receipt Address (Street, City, Country)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Plot 14 Nakasero Road, Kampala, Uganda"
              className="h-11 w-full rounded-xl border border-[#cfd6d0] bg-white px-3.5 text-sm focus:border-[#02a95c] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Community Bio & Causes You Support
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share a short note about why you support pediatric healthcare, education, or clean water..."
            className="w-full rounded-xl border border-[#cfd6d0] bg-white p-3.5 text-sm focus:border-[#02a95c] focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2.5 text-xs sm:text-sm text-[#20251f] cursor-pointer">
          <input
            type="checkbox"
            checked={isProfilePublic}
            onChange={(e) => setIsProfilePublic(e.target.checked)}
            className="h-4 w-4 accent-[#02a95c] rounded"
          />
          <span>Make my community supporter profile public</span>
        </label>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-[#02a95c] hover:bg-[#087443] px-6 py-3 text-sm font-bold text-white transition-colors"
          >
            Save Profile & Tax Details
          </button>
          <Link
            href={`/u/${user.id}`}
            className="rounded-full border border-[#cfd6d0] bg-white hover:bg-gray-50 px-5 py-3 text-sm font-bold text-[#20251f]"
          >
            View Public Profile
          </Link>
          <button
            type="button"
            onClick={shareProfile}
            className="rounded-full border border-[#cfd6d0] bg-white hover:bg-gray-50 px-5 py-3 text-sm font-bold text-[#20251f]"
          >
            Share Profile Link
          </button>
        </div>
      </form>

      {shareMessage && (
        <p role="status" className="break-all text-sm font-semibold text-[#087443]">
          {shareMessage}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AccountLayout
      active="profile"
      title="Profile & Billing Details"
      description="View and edit your name, email, phone number, and billing/tax address."
    >
      <ProfileDetails />
    </AccountLayout>
  );
}
