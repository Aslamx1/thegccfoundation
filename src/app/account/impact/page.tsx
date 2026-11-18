'use client';

import Link from 'next/link';
import AccountLayout from '@/components/AccountLayout';
import { useAuth } from '@/context/AuthContext';
import { useDonation } from '@/context/DonationContext';
import { useEffect, useMemo, useState } from 'react';

type Donation = { id: string; campaignId: string; campaignTitle: string; amountUGX: number; currencyPaid: string; date: string; isAnonymous: boolean };

function ImpactContent() {
  const { user } = useAuth();
  const { campaigns } = useDonation();
  const [donations, setDonations] = useState<Donation[]>([]);
  useEffect(() => {
    if (!user) return;
    try { setDonations(JSON.parse(localStorage.getItem(`gcc_foundation_donations_${user.id}`) || '[]') as Donation[]); }
    catch { setDonations([]); }
  }, [user]);
  const myCampaigns = useMemo(() => campaigns.filter((campaign) => campaign.ownerUserId === user?.id), [campaigns, user?.id]);
  const total = donations.reduce((sum, donation) => sum + (Number(donation.amountUGX) || 0), 0);
  const money = (amount: number) => new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount);
  return <div className="space-y-8">
    <div><h2 className="text-xl font-bold text-[#20251f]">Your impact</h2><p className="mt-1 text-sm text-[#626b64]">A summary of your giving and the verified fundraisers you have started on GCC Foundation.</p></div>
    <div className="grid gap-4 sm:grid-cols-3">
      {[['Donated', money(total)], ['Fundraisers started', String(myCampaigns.length)], ['Donations made', String(donations.length)]].map(([label, value]) => <div key={label} className="rounded-2xl bg-[#f7faf7] p-5"><p className="text-sm text-[#626b64]">{label}</p><p className="mt-2 text-2xl font-extrabold text-[#20251f]">{value}</p></div>)}
    </div>
    <section><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-[#20251f]">Your fundraisers</h3><Link href="/create/fundraiser/category" className="text-sm font-bold text-[#087443] hover:underline">Start a fundraiser</Link></div>
      {myCampaigns.length ? <div className="space-y-3">{myCampaigns.map((campaign) => <Link href={`/campaign/${campaign.id}`} key={campaign.id} className="flex items-center gap-4 rounded-2xl border border-[#e4e8e3] p-4 hover:bg-[#f7faf7]"><img src={campaign.coverImage} alt="" className="h-16 w-20 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="truncate font-bold text-[#20251f]">{campaign.title}</p><p className="mt-1 text-sm text-[#626b64]">{money(campaign.raisedUGX)} raised  -  {campaign.donorCount} supporters</p></div></Link>)}</div> : <p className="rounded-2xl bg-[#f7faf7] p-5 text-sm text-[#626b64]">Fundraisers you create will appear here.</p>}
    </section>
    <section><h3 className="mb-4 text-lg font-bold text-[#20251f]">Your donations</h3>
      {donations.length ? <div className="divide-y divide-[#edf0ec] rounded-2xl border border-[#e4e8e3]">{donations.map((donation) => <div key={donation.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold text-[#20251f]">{donation.campaignTitle}</p><p className="mt-1 text-xs text-[#626b64]">{new Date(donation.date).toLocaleDateString()}  -  {donation.isAnonymous ? 'Anonymous gift' : 'Donation'}</p></div><div className="text-right"><p className="font-bold text-[#087443]">{money(donation.amountUGX)}</p><p className="text-xs text-[#818981]">{donation.currencyPaid}</p></div></div>)}</div> : <div className="rounded-2xl bg-[#f7faf7] p-5"><p className="text-sm text-[#626b64]">Donations made through your account will appear here.</p><Link href="/#discover" className="mt-4 inline-flex rounded-full bg-[#02a95c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#087443]">Explore fundraisers</Link></div>}
    </section>
  </div>;
}

export default function ImpactPage() { return <AccountLayout active="impact" title="Your impact" description="See your giving history and the fundraisers you support."><ImpactContent /></AccountLayout>; }
