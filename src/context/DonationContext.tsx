'use client';

import React, { createContext, useContext, useState } from 'react';
import { Campaign, DonorRecord, VolunteerPledge } from '@/types';
import { CAMPAIGNS_DATA } from '@/data/campaigns';

interface DonationContextType {
  campaigns: Campaign[];
  activeCampaignForDonation: Campaign | null;
  isDonationModalOpen: boolean;
  openDonationModal: (campaign: Campaign) => void;
  closeDonationModal: () => void;
  processDonation: (
    campaignId: string,
    donorData: Omit<DonorRecord, 'id' | 'timestamp'>
  ) => Promise<{ success: boolean; txRef: string }>;

  // Volunteer & Material Pledge Modal
  isPledgeModalOpen: boolean;
  activeCampaignForPledge: Campaign | null;
  openPledgeModal: (campaign: Campaign) => void;
  closePledgeModal: () => void;
  submitVolunteerPledge: (
    campaignId: string,
    pledge: Omit<VolunteerPledge, 'id' | 'datePledged' | 'status'>
  ) => Promise<{ success: boolean }>;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_DATA);
  const [activeCampaignForDonation, setActiveCampaignForDonation] = useState<Campaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const [activeCampaignForPledge, setActiveCampaignForPledge] = useState<Campaign | null>(null);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);

  const openDonationModal = (campaign: Campaign) => {
    setActiveCampaignForDonation(campaign);
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

  const processDonation = async (
    campaignId: string,
    donorData: Omit<DonorRecord, 'id' | 'timestamp'>
  ): Promise<{ success: boolean; txRef: string }> => {
    // Generate simulated banking transaction reference
    const txRef = `GCC-TXN-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const newRecord: DonorRecord = {
      ...donorData,
      id: `dn-live-${Date.now()}`,
      timestamp: 'Just now',
    };

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            raisedUGX: c.raisedUGX + donorData.amountUGX,
            donorCount: c.donorCount + 1,
            recentDonors: [newRecord, ...c.recentDonors],
          };
        }
        return c;
      })
    );

    // Update active campaign if currently viewed
    if (activeCampaignForDonation && activeCampaignForDonation.id === campaignId) {
      setActiveCampaignForDonation((prev) =>
        prev
          ? {
              ...prev,
              raisedUGX: prev.raisedUGX + donorData.amountUGX,
              donorCount: prev.donorCount + 1,
              recentDonors: [newRecord, ...prev.recentDonors],
            }
          : null
      );
    }

    return { success: true, txRef };
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
        processDonation,
        isPledgeModalOpen,
        activeCampaignForPledge,
        openPledgeModal,
        closePledgeModal,
        submitVolunteerPledge,
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
