'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, VolunteerPledge } from '@/types';
import { CAMPAIGNS_DATA } from '@/data/campaigns';
import { useAuth } from '@/context/AuthContext';

interface DonationContextType {
  campaigns: Campaign[];
  activeCampaignForDonation: Campaign | null;
  isDonationModalOpen: boolean;
  openDonationModal: (campaign: Campaign) => void;
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

  // Add new campaign dynamically from wizard
  addNewCampaign: (campaign: Campaign) => void;

  // Search Modal
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

const STORAGE_KEY = 'gcc_foundation_campaigns';
export const DONORBOX_URL = 'https://donorbox.org/gcc-foundation';

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_DATA);
  const [campaignsLoaded, setCampaignsLoaded] = useState(false);
  const [activeCampaignForDonation, setActiveCampaignForDonation] = useState<Campaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const [activeCampaignForPledge, setActiveCampaignForPledge] = useState<Campaign | null>(null);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCampaigns = localStorage.getItem(STORAGE_KEY);
      if (savedCampaigns) {
        const parsed = JSON.parse(savedCampaigns);
        if (Array.isArray(parsed)) setCampaigns(parsed as Campaign[]);
      }
    } catch {
      // Ignore unavailable or invalid storage and use the bundled campaigns.
    } finally {
      setCampaignsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!campaignsLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch {
      // Campaigns remain available for the current session if browser storage is unavailable.
    }
  }, [campaigns, campaignsLoaded]);

  const openDonationModal = (campaign: Campaign) => {
    setActiveCampaignForDonation(campaign);
    setIsDonationModalOpen(false);
    if (typeof window !== 'undefined') {
      window.location.href = DONORBOX_URL;
    }
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

  const addNewCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [{ ...newCamp, ownerUserId: user?.id }, ...prev]);
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
