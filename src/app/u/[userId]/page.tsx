'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, useAuth } from '@/context/AuthContext';
import { useDonation } from '@/context/DonationContext';
import Header from '@/components/Header';

function findLocalProfile(id: string): User | null {
  try {
    const accounts = JSON.parse(localStorage.getItem('gcc_foundation_accounts') || '{}') as Record<string, User>;
    return accounts[id] || Object.values(accounts).find((account) => account.id === id) || null;
  } catch {
    return null;
  }
}

export default function PublicProfilePage() {
  const params = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { campaigns } = useDonation();
  const profileId = params.userId;
  const [profile, setProfile] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const isOwner = user?.id === profileId;

  useEffect(() => {
    async function load() {
      if (isOwner && user) {
        setProfile(user);
        setLoaded(true);
        return;
      }
      const local = findLocalProfile(profileId);
      if (local) {
        setProfile(local);
        setLoaded(true);
        return;
      }
      try {
        const res = await fetch(`/api/auth/user/${encodeURIComponent(profileId)}`);
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.user) {
            setProfile(data.user as User);
          }
        }
      } catch {}
      setLoaded(true);
    }
    load();
  }, [isOwner, profileId, user]);

  const ownedCampaigns = campaigns.filter((campaign) => campaign.ownerUserId === profileId);
  const isVisible = isOwner || (profile?.isProfilePublic ?? true);
  const money = (amount: number) => new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9f6]">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {!loaded ? (
            <div className="h-72 animate-pulse rounded-3xl bg-white" />
          ) : !profile ? (
            <section className="rounded-3xl border border-[#e4e8e3] bg-white p-8 text-center">
              <h1 className="text-2xl font-extrabold text-[#20251f]">Profile not found</h1>
              <p className="mt-2 text-sm text-[#626b64]">We could not find a member profile matching that link.</p>
              <Link href="/" className="mt-5 inline-flex rounded-full bg-[#02a95c] px-5 py-3 text-sm font-bold text-white">
                Explore fundraisers
              </Link>
            </section>
          ) : !isVisible ? (
            <section className="rounded-3xl border border-[#e4e8e3] bg-white p-8 text-center">
              <h1 className="mt-2 text-2xl font-extrabold text-[#20251f]">This profile is private</h1>
              <p className="mt-2 text-sm text-[#626b64]">{profile.name} has chosen to keep their profile details private.</p>
              <Link href="/" className="mt-5 inline-flex rounded-full bg-[#02a95c] px-5 py-3 text-sm font-bold text-white">
                Explore fundraisers
              </Link>
            </section>
          ) : (
            <>
              <article className="overflow-hidden rounded-3xl border border-[#e4e8e3] bg-white shadow-sm">
                <div className="h-36 bg-gradient-to-r from-[#087443] via-[#02a95c] to-[#9bd8ad] sm:h-48">
                  {profile.coverImage && <img src={profile.coverImage} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="px-6 pb-8 sm:px-10">
                  <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e2f1e6] text-3xl font-extrabold text-[#087443] shadow-sm">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={`${profile.name} profile`} className="h-full w-full object-cover" />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#20251f]">{profile.name}</h1>
                      <p className="mt-1 text-sm text-[#626b64]">
                        GCC Foundation community member{profile.location ? ` · ${profile.location}` : ''}
                      </p>
                    </div>
                    {isOwner && (
                      <Link href="/account/settings" className="rounded-full border border-[#cfd6d0] px-4 py-2.5 text-sm font-bold text-[#20251f]">
                        Edit profile
                      </Link>
                    )}
                  </div>
                  {profile.bio && <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#626b64]">{profile.bio}</p>}
                  {!!profile.causes?.length && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.causes.map((cause) => (
                        <span key={cause} className="rounded-full bg-[#eaf5ed] px-3 py-1.5 text-xs font-semibold text-[#087443]">
                          {cause}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
              <section className="mt-7">
                <h2 className="text-xl font-bold text-[#20251f]">Fundraisers by {profile.name}</h2>
                {ownedCampaigns.length ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {ownedCampaigns.map((campaign) => (
                      <Link href={`/campaign/${campaign.id}`} key={campaign.id} className="overflow-hidden rounded-2xl border border-[#e4e8e3] bg-white hover:shadow-md">
                        <img src={campaign.coverImage} alt="" className="h-40 w-full object-cover" />
                        <div className="p-4">
                          <h3 className="font-bold text-[#20251f]">{campaign.title}</h3>
                          <p className="mt-2 text-sm text-[#626b64]">
                            {money(campaign.raisedUGX)} raised of {money(campaign.goalUGX)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-2xl bg-white p-5 text-sm text-[#626b64]">No public fundraisers yet.</p>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
