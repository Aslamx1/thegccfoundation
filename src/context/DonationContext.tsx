'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Campaign, VolunteerPledge } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { CAMPAIGNS_DATA } from '@/data/campaigns';
import { AdminService } from '@/lib/supabase/admin-service';
import { SponsoredChild } from '@/lib/supabase/types';

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

  // Explicit refresh trigger
  refreshCampaigns: () => Promise<void>;
}

export const DONORBOX_URL = 'https://donorbox.org/gcc-foundation';

export function matchCategory(campaignCategory: string, filterCategory: string): boolean {
  if (!filterCategory || filterCategory === 'All') return true;
  const c = (campaignCategory || '').toLowerCase();
  const f = filterCategory.toLowerCase();
  if (f === 'medical' || f.includes('medic') || f.includes('health')) {
    return c.includes('med') || c.includes('health') || c.includes('surg') || c.includes('hospital') || c.includes('clinic');
  }
  if (f === 'education' || f.includes('edu') || f.includes('tuition')) {
    return c.includes('edu') || c.includes('school') || c.includes('tuition') || c.includes('scholar') || c.includes('child');
  }
  if (f === 'emergency' || f.includes('emerg') || f.includes('crisis')) {
    return c.includes('emerg') || c.includes('crisis') || c.includes('disaster') || c.includes('relief');
  }
  if (f === 'community' || f.includes('commun') || f.includes('water')) {
    return c.includes('commun') || c.includes('water') || c.includes('well') || c.includes('infra') || c.includes('agri') || c.includes('social');
  }
  return c === f || c.includes(f);
}

function toUGX(amountMinor: number, currency: string, rates: Record<string, number>) {
  const major = amountMinor / 100;
  if (currency === 'UGX') return major;
  const currencyPerUsd = rates[currency];
  const ugxPerUsd = rates.UGX;
  return currencyPerUsd && ugxPerUsd ? (major / currencyPerUsd) * ugxPerUsd : major * 3750;
}

function mapCampaign(record: any, rates: Record<string, number>): Campaign {
  const story = String(record.story || '');
  return {
    id: record.id,
    slug: record.slug,
    ownerUserId: record.organizer?.id,
    title: record.title,
    subtitle: story.slice(0, 160),
    category: record.category as Campaign['category'],
    location: {
      district: record.district || record.country || 'Uganda',
      subCounty: '',
      country: record.country === 'UG' ? 'Uganda' : (record.country || 'Uganda'),
      facilityName: record.receivingInstitution || undefined,
    },
    goalUGX: toUGX(Number(record.goalAmount || 0), record.currency || 'UGX', rates),
    raisedUGX: toUGX(Number(record.raisedAmount || 0), record.currency || 'UGX', rates),
    donorCount: Number(record.donorCount || 0),
    daysRemaining: 30,
    createdAt: record.createdAt || new Date().toISOString(),
    urgent: false,
    featured: !!record.isVerified,
    coverImage: record.coverImageUrl,
    galleryImages: [
      {
        url: record.coverImageUrl,
        caption: record.title,
        dateStamp: 'Verified Campaign Photo',
        capturedBy: 'GCC Foundation Field Staff',
      },
    ],
    payoutVerification: {
      type: 'Vetted Trustee',
      institutionName: record.receivingInstitution || 'Verified Institutional Account',
      accountNumberMasked: '',
      bankName: 'Stanbic Bank Uganda',
      verificationReference: `GCC-${record.id}`,
      complianceOfficer: 'Pauline Namukasa, FCCA (GCC Compliance Officer)',
    },
    organizer: {
      name: record.organizer?.name || 'Community Organizer',
      role: 'Organizer',
      ninOrIdMasked: '',
      verifiedBadge: !!record.organizer?.isVerified,
      relationshipToBeneficiary: '',
      phoneMasked: '',
      avatarUrl: record.organizer?.avatarUrl || '',
      residence: record.district || 'Uganda',
    },
    beneficiary: {
      name: record.title,
      storySummary: story.slice(0, 200),
    },
    fullStoryHtml: story.split(/\n\n+/).filter(Boolean),
    itemizedBudget: [],
    fieldUpdates: [],
    recentDonors: [],
    volunteerPledges: [],
  };
}

function childToCampaign(child: SponsoredChild, rates: Record<string, number>): Campaign {
  let mappedCategory: Campaign['category'] = 'Education & Tuition';
  const rawCat = (child.category || '').toLowerCase();
  if (rawCat.includes('med') || rawCat.includes('health')) mappedCategory = 'Medical Care';
  else if (rawCat.includes('emerg') || rawCat.includes('crisis')) mappedCategory = 'Emergency Relief';
  else if (rawCat.includes('commun') || rawCat.includes('water') || rawCat.includes('agri')) mappedCategory = 'Clean Water Wells';
  else mappedCategory = 'Education & Tuition';

  const monthlyUSD = Number(child.monthly_amount) || 35;
  const annualUSD = child.goal_amount ? Number(child.goal_amount) : monthlyUSD * 12;
  const goalUGX = toUGX(annualUSD * 100, child.currency || 'USD', rates) || (monthlyUSD * 12 * 3750);
  const isSponsored = child.status === 'sponsored';
  const raisedUGX = isSponsored ? goalUGX : Math.round(goalUGX * 0.35);

  const bio = child.bio || 'Verified child in need of community support.';
  const aspirations = child.aspirations ? ` Dreams: ${child.aspirations}` : '';
  const fullName = `${child.first_name} ${child.last_name || ''}`.trim();
  const title = `Support ${fullName} (${child.age} yrs) - ${child.aspirations || child.school_and_grade}`;

  const coverImg = child.portrait_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';

  return {
    id: child.id,
    slug: `child-${child.id}`,
    title,
    subtitle: `${bio.slice(0, 140)}...`,
    category: mappedCategory,
    location: {
      district: child.location || 'Kampala',
      subCounty: child.region || 'Central Region',
      country: 'Uganda',
      facilityName: child.school_and_grade,
    },
    goalUGX,
    raisedUGX,
    donorCount: isSponsored ? 1 : 0,
    daysRemaining: 45,
    createdAt: child.created_at || new Date().toISOString(),
    urgent: child.category === 'Emergency' || child.status === 'available',
    featured: true,
    coverImage: coverImg,
    galleryImages: [
      {
        url: coverImg,
        caption: `Verified portrait of ${fullName}`,
        dateStamp: 'Recently verified by GCC field staff',
        capturedBy: 'GCC Foundation Community Field Officer',
      },
    ],
    payoutVerification: {
      type: mappedCategory === 'Medical Care' ? 'Direct-to-Hospital' : 'Direct-to-School',
      institutionName: child.school_and_grade || 'Verified Institution Escrow',
      accountNumberMasked: 'Stanbic Bank Uganda A/C •••• 9102',
      bankName: 'Stanbic Bank Uganda',
      verificationReference: `GCC-SPON-${child.id.toUpperCase()}`,
      complianceOfficer: 'Pauline Namukasa, FCCA (GCC Compliance Officer)',
    },
    organizer: {
      name: 'GCC Field & Social Welfare Desk',
      role: 'Community Case Manager',
      ninOrIdMasked: 'NIN: CM880341029•••',
      verifiedBadge: true,
      relationshipToBeneficiary: 'Verified Welfare Officer',
      phoneMasked: '+256 700 ••• 000',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      residence: child.location || 'Uganda',
    },
    beneficiary: {
      name: fullName,
      age: child.age,
      storySummary: `${bio} ${aspirations}`,
      hospitalOrSchoolRef: child.school_and_grade,
    },
    fullStoryHtml: [
      bio,
      aspirations ? `Personal Aspirations: ${child.aspirations}` : '',
      `Verified location: ${child.location}, ${child.region}. Institutional Placement: ${child.school_and_grade}.`,
      '100% of contributions are managed and disbursed directly to the verified school, clinic, or welfare account. Zero middleman fees.',
    ].filter(Boolean),
    itemizedBudget: [
      {
        id: `bud-${child.id}-1`,
        item: mappedCategory === 'Medical Care' ? 'Medical checkups and required clinical care' : 'School tuition, uniform, and books (Annual)',
        category: mappedCategory === 'Medical Care' ? 'Healthcare' : 'Tuition & Supplies',
        amountUGX: Math.round(goalUGX * 0.7),
        recipientEntity: child.school_and_grade || 'Verified Institution',
        status: isSponsored ? 'Verified Paid' : 'Estimated',
      },
      {
        id: `bud-${child.id}-2`,
        item: 'Nutritional and scholastic welfare support',
        category: 'Welfare',
        amountUGX: Math.round(goalUGX * 0.3),
        recipientEntity: 'GCC Community Welfare Account',
        status: isSponsored ? 'Verified Paid' : 'Estimated',
      },
    ],
    fieldUpdates: [],
    recentDonors: isSponsored && child.active_sponsorship ? [
      {
        id: `don-${child.id}-1`,
        name: child.active_sponsorship.sponsor_name,
        amountUGX: Math.round(goalUGX),
        currencyPaid: 'USD',
        amountInOriginalCurrency: child.monthly_amount,
        timestamp: 'Active recurring sponsor',
        message: 'Proud to sponsor and walk with this child!',
        paymentMethod: 'Visa / Card',
        isRecurringMonthly: true,
      }
    ] : [],
    volunteerPledges: [],
  };
}

function adminCampaignToCampaign(camp: any, rates: Record<string, number>): Campaign {
  let mappedCategory: Campaign['category'] = 'Education & Tuition';
  const rawCat = (camp.category || '').toLowerCase();
  if (rawCat.includes('med') || rawCat.includes('health')) mappedCategory = 'Medical Care';
  else if (rawCat.includes('emerg') || rawCat.includes('crisis')) mappedCategory = 'Emergency Relief';
  else if (rawCat.includes('water') || rawCat.includes('well')) mappedCategory = 'Clean Water Wells';
  else if (rawCat.includes('agri')) mappedCategory = 'Rural Agriculture';
  else if (rawCat.includes('commun') || rawCat.includes('infra')) mappedCategory = 'Community Infrastructure';
  else mappedCategory = 'Education & Tuition';

  const goalUSD = Number(camp.goal_amount) || 5000;
  const raisedUSD = Number(camp.raised_amount) || 0;
  const goalUGX = toUGX(goalUSD * 100, camp.currency || 'USD', rates) || (goalUSD * 3750);
  const raisedUGX = toUGX(raisedUSD * 100, camp.currency || 'USD', rates) || 0;

  const bannerImg = camp.banner_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80';

  return {
    id: camp.id,
    slug: camp.slug || `camp-${camp.id}`,
    title: camp.title,
    subtitle: String(camp.story || '').slice(0, 160),
    category: mappedCategory,
    location: {
      district: 'Uganda',
      subCounty: '',
      country: 'Uganda',
    },
    goalUGX,
    raisedUGX,
    donorCount: Number(camp.donor_count || 0),
    daysRemaining: 30,
    createdAt: camp.created_at || new Date().toISOString(),
    urgent: camp.status === 'active' && mappedCategory === 'Emergency Relief',
    featured: !!camp.is_featured,
    coverImage: bannerImg,
    galleryImages: [
      {
        url: bannerImg,
        caption: camp.title,
        dateStamp: 'Verified Campaign Photo',
        capturedBy: 'GCC Foundation Field Staff',
      },
    ],
    payoutVerification: {
      type: mappedCategory === 'Medical Care' ? 'Direct-to-Hospital' : 'Direct-to-Contractor',
      institutionName: 'Verified Institutional Recipient',
      accountNumberMasked: 'Stanbic Bank Uganda A/C •••• 4821',
      bankName: 'Stanbic Bank Uganda',
      verificationReference: `GCC-CMP-${camp.id.toUpperCase()}`,
      complianceOfficer: 'Pauline Namukasa, FCCA (GCC Compliance Officer)',
    },
    organizer: {
      name: 'GCC Foundation Program Operations',
      role: 'GCC Lead Project Coordinator',
      ninOrIdMasked: 'NIN: CM880341029•••',
      verifiedBadge: true,
      relationshipToBeneficiary: 'Direct Program Lead',
      phoneMasked: '+256 700 ••• 000',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      residence: 'Kampala, Uganda',
    },
    beneficiary: {
      name: camp.title,
      storySummary: String(camp.story || '').slice(0, 200),
    },
    fullStoryHtml: String(camp.story || '').split(/\n\n+/).filter(Boolean),
    itemizedBudget: [],
    fieldUpdates: [],
    recentDonors: [],
    volunteerPledges: [],
  };
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { rates } = useCurrency();
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_DATA);
  const [activeCampaignForDonation, setActiveCampaignForDonation] = useState<Campaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const [activeCampaignForPledge, setActiveCampaignForPledge] = useState<Campaign | null>(null);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const loadAllCampaigns = useCallback(async () => {
    try {
      const baseMap = new Map<string, Campaign>();

      // 1. Base verified campaigns
      CAMPAIGNS_DATA.forEach((c) => baseMap.set(c.id, c));

      // 2. Admin campaigns (Supabase / localStorage)
      try {
        const adminCamps = await AdminService.getCampaigns();
        (adminCamps || []).forEach((ac) => {
          if (ac && ac.id) {
            baseMap.set(ac.id, adminCampaignToCampaign(ac, rates));
          }
        });
      } catch (err) {
        console.warn('Failed loading admin campaigns:', err);
      }

      // 3. Admin child sponsorships (Supabase / localStorage)
      try {
        const adminChildren = await AdminService.getChildren();
        (adminChildren || []).forEach((ch) => {
          if (ch && ch.id) {
            baseMap.set(ch.id, childToCampaign(ch, rates));
          }
        });
      } catch (err) {
        console.warn('Failed loading admin children:', err);
      }

      // 4. Server API campaigns
      try {
        const res = await fetch('/api/campaigns?status=active&limit=50&sort=recent');
        if (res.ok) {
          const data = (await res.json()) as any;
          (data.campaigns || []).forEach((c: any) => {
            if (c && c.id) {
              baseMap.set(c.id, mapCampaign(c, rates));
            }
          });
        }
      } catch {}

      const merged = Array.from(baseMap.values());
      // Sort so newest items appear at the top
      merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      setCampaigns(merged);
    } catch (err) {
      console.warn('Load all campaigns error, falling back to base:', err);
      setCampaigns(CAMPAIGNS_DATA);
    }
  }, [rates]);

  useEffect(() => {
    loadAllCampaigns();

    const handleSync = () => {
      loadAllCampaigns();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('gcc_data_updated', handleSync);
      window.addEventListener('storage', handleSync);
      return () => {
        window.removeEventListener('gcc_data_updated', handleSync);
        window.removeEventListener('storage', handleSync);
      };
    }
  }, [loadAllCampaigns]);

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
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newCamp.title,
        story: newCamp.fullStoryHtml.join('\n\n'),
        category: newCamp.category,
        country: 'UG',
        district: newCamp.location.district,
        receivingInstitution: newCamp.location.facilityName,
        currency: 'UGX',
        goalAmount: Math.round(newCamp.goalUGX * 100),
        coverImageUrl: newCamp.coverImage,
        organizerName: user?.name,
        organizerEmail: user?.email,
      }),
    });
    const data: any = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not create campaign.');
    await loadAllCampaigns();
    return data.id as string;
  };

  const updateCampaign = async (updatedCamp: Campaign) => {
    const response = await fetch(`/api/admin/campaigns/${updatedCamp.id}/details`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedCamp.title,
        story: updatedCamp.fullStoryHtml.join('\n\n'),
        category: updatedCamp.category,
        district: updatedCamp.location.district,
        receivingInstitution: updatedCamp.location.facilityName,
        currency: 'UGX',
        goalAmount: Math.round(updatedCamp.goalUGX * 100),
        coverImageUrl: updatedCamp.coverImage,
      }),
    });
    const data: any = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not update campaign.');
    setCampaigns((prev) => prev.map((campaign) => (campaign.id === updatedCamp.id ? updatedCamp : campaign)));
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
            volunteerPledges: [newPledge, ...(c.volunteerPledges || [])],
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
        refreshCampaigns: loadAllCampaigns,
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
