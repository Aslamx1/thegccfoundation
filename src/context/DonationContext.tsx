'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, VolunteerPledge } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

interface DonationContextType {
  campaigns: Campaign[];
  activeCampaignForDonation: Campaign | null;
  isDonationModalOpen: boolean;
  openDonationModal: (campaign?: Campaign) => void;
  closeDonationModal: () => void;

  // Volunteer & Material Pledge Modal
  isPledgeModalOpen: boolean;
  activeCampaignForPledge: Campaign | null;
  openPledgeModal: (campaign: Campaign) => void;
  closePledgeModal: () => void;
  submitVolunteerPledge: (
    campaignId: string,
    pledge: Omit<VolunteerPledge, 'id' | 'datePledged' | 'status'>
  ) => Promise<{ success: boolean }>;

  // Add or update campaign dynamically from wizard or admin CMS
  addNewCampaign: (campaign: Campaign) => Promise<string>;
  updateCampaign: (campaign: Campaign) => void;

  // Search Modal
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

export const DONORBOX_URL = 'https://donorbox.org/gcc-foundation';

function toUGX(amountMinor: number, currency: string, rates: Record<string, number>) {
  const major = amountMinor / 100;
  if (currency === 'UGX') return major;
  const currencyPerUsd = rates[currency];
  const ugxPerUsd = rates.UGX;
  return currencyPerUsd && ugxPerUsd ? (major / currencyPerUsd) * ugxPerUsd : 0;
}

function mapCampaign(record: any, rates: Record<string, number>): Campaign {
  const story = String(record.story || '');
  return {
    id: record.id, slug: record.slug, ownerUserId: record.organizer?.id, title: record.title,
    subtitle: story.slice(0, 160), category: record.category as Campaign['category'], location: {
      district: record.district || record.country || 'Uganda', subCounty: '', country: record.country === 'UG' ? 'Uganda' : record.country,
      facilityName: record.receivingInstitution || undefined,
    }, goalUGX: toUGX(Number(record.goalAmount || 0), record.currency || 'UGX', rates),
    raisedUGX: toUGX(Number(record.raisedAmount || 0), record.currency || 'UGX', rates),
    donorCount: Number(record.donorCount || 0), daysRemaining: 0, createdAt: record.createdAt,
    urgent: false, featured: !!record.isVerified, coverImage: record.coverImageUrl, galleryImages: [],
    payoutVerification: { type: 'Vetted Trustee', institutionName: record.receivingInstitution || 'Not provided', accountNumberMasked: '', bankName: '', verificationReference: '', complianceOfficer: '' },
    organizer: { name: record.organizer?.name || 'Community organizer', role: 'Organizer', ninOrIdMasked: '', verifiedBadge: !!record.organizer?.isVerified, relationshipToBeneficiary: '', phoneMasked: '', avatarUrl: record.organizer?.avatarUrl || '', residence: record.district || '' },
    beneficiary: { name: record.title, storySummary: story.slice(0, 200) }, fullStoryHtml: story.split(/\n\n+/).filter(Boolean),
    itemizedBudget: [], fieldUpdates: [], recentDonors: [], volunteerPledges: [],
  };
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { rates } = useCurrency();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignForDonation, setActiveCampaignForDonation] = useState<Campaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const [activeCampaignForPledge, setActiveCampaignForPledge] = useState<Campaign | null>(null);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/campaigns?status=active&limit=50&sort=recent')
      .then(async (response) => {
        if (!response.ok) throw new Error('Campaigns are temporarily unavailable.');
        return response.json();
      })
      .then((data: any) => { if (!cancelled) setCampaigns((data.campaigns || []).map((campaign: any) => mapCampaign(campaign, rates))); })
      .catch(() => { if (!cancelled) setCampaigns([]); });
    return () => { cancelled = true; };
  }, [rates]);

  const openDonationModal = (campaign?: Campaign) => {
    setActiveCampaignForDonation(campaign || campaigns[0] || null);
    setIsDonationModalOpen(true);
  };

  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
  };

  const openPledgeModal = (campaign: Campaign) => {
    setActiveCampaignForPledge(campaign);
    setIsPledgeModalOpen(true);
  };

  const closePledgeModal = () => {
    setIsPledgeModalOpen(false);
  };

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const addNewCampaign = async (newCamp: Campaign) => {
    const res = await fetch('/api/campaigns', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      title: newCamp.title, story: newCamp.fullStoryHtml.join('\n\n'), category: newCamp.category,
      country: 'UG', district: newCamp.location.district, receivingInstitution: newCamp.location.facilityName,
      currency: 'UGX', goalAmount: Math.round(newCamp.goalUGX * 100), coverImageUrl: newCamp.coverImage,
      organizerName: user?.name, organizerEmail: user?.email,
    }) });
    const data: any = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not create campaign.');
    const list = await fetch('/api/campaigns?status=active&limit=50&sort=recent');
    if (list.ok) {
      const result: any = await list.json();
      setCampaigns((result.campaigns || []).map((campaign: any) => mapCampaign(campaign, rates)));
    }
    return data.id as string;
  };

  const updateCampaign = async (updatedCamp: Campaign) => {
    const response = await fetch(`/api/admin/campaigns/${updatedCamp.id}/details`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      title: updatedCamp.title, story: updatedCamp.fullStoryHtml.join('\n\n'), category: updatedCamp.category,
      district: updatedCamp.location.district, receivingInstitution: updatedCamp.location.facilityName,
      currency: 'UGX', goalAmount: Math.round(updatedCamp.goalUGX * 100), coverImageUrl: updatedCamp.coverImage,
    }) });
    const data: any = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not update campaign.');
    setCampaigns((prev) => prev.map((campaign) => campaign.id === updatedCamp.id ? updatedCamp : campaign));
  };

  const submitVolunteerPledge = async (
    campaignId: string,
    pledge: Omit<VolunteerPledge, 'id' | 'datePledged' | 'status'>
  ): Promise<{ success: boolean }> => {
    const newPledge: VolunteerPledge = {
      ...pledge,
      id: `vp-live-${Date.now()}`,
      datePledged: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Accepted',
    };

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            volunteerPledges: [newPledge, ...c.volunteerPledges],
          };
        }
        return c;
      })
    );

    return { success: true };
  };

  return (
    <DonationContext.Provider
      value={{
        campaigns,
        activeCampaignForDonation,
        isDonationModalOpen,
        openDonationModal,
        closeDonationModal,
        isPledgeModalOpen,
        activeCampaignForPledge,
        openPledgeModal,
        closePledgeModal,
        submitVolunteerPledge,
        addNewCampaign,
        updateCampaign,
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
}
