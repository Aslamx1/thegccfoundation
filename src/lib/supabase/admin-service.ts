import { getSupabase } from './client';
import {
  Profile,
  SponsoredChild,
  Sponsorship,
  SponsorshipMessage,
  FieldReport,
  Campaign,
  CampaignUpdate,
  UserFundraiser,
  Donation,
  EventItem,
  VolunteerLog,
  OrgSettings,
  DashboardKPIs,
  UserRole,
  AuthAuditLog,
  AuthActionType,
} from './types';

// ==============================================================================
// INITIAL / FALLBACK NGO DATA
// ==============================================================================
function notifyDataChanged(type: string) {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('gcc_data_updated', { detail: { type } }));
    } catch {}
  }
}

const INITIAL_CHILDREN: SponsoredChild[] = [
  {
    id: 'ch-init-1',
    first_name: 'Amina',
    last_name: 'Namyalo',
    age: 8,
    gender: 'Girl',
    location: 'Katwe, Kampala',
    region: 'Central Uganda',
    school_and_grade: 'Hope Junior Academy, Primary 2',
    bio: 'Amina lives with her elderly grandmother in Katwe. She loves drawing and mathematics and dreams of attending full-term primary education.',
    aspirations: 'Wants to become a pediatric nurse to treat children in need.',
    monthly_amount: 35.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    status: 'available',
    category: 'Education',
    created_at: '2026-02-10T00:00:00Z',
  },
  {
    id: 'ch-init-2',
    first_name: 'David',
    last_name: 'Ochola',
    age: 9,
    gender: 'Boy',
    location: 'Gulu Municipality',
    region: 'Northern Uganda',
    school_and_grade: 'St. Jude Primary, Primary 3',
    bio: 'David requires routine chronic asthma and allergy medication alongside primary schooling support after his family was displaced by extreme climate drought.',
    aspirations: 'Wants to become a civil engineer to construct bridges and schools.',
    monthly_amount: 40.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80',
    status: 'available',
    category: 'Medical',
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'ch-init-3',
    first_name: 'Sarah',
    last_name: 'Kiconco',
    age: 7,
    gender: 'Girl',
    location: 'Kasese District',
    region: 'Western Uganda',
    school_and_grade: 'Rwenzori Community School, Primary 1',
    bio: 'Sarah and her family lost their home and belongings during the Rwenzori river flash floods. She needs emergency nutritional care, books, and safe boarding tuition.',
    aspirations: 'Wants to be a teacher to teach children in disaster-impacted villages.',
    monthly_amount: 35.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=700&q=80',
    status: 'available',
    category: 'Emergency',
    created_at: '2026-03-15T00:00:00Z',
  },
  {
    id: 'ch-init-4',
    first_name: 'Emmanuel',
    last_name: 'Mugisha',
    age: 10,
    gender: 'Boy',
    location: 'Kamuli Rural District',
    region: 'Eastern Uganda',
    school_and_grade: 'Kamuli Primary, Primary 4',
    bio: 'Emmanuel walks 4km daily to fetch river water for his village community. He is eager to study and help his community establish solar water pumps and sanitation.',
    aspirations: 'Wants to work in environmental science and clean community water systems.',
    monthly_amount: 35.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=700&q=80',
    status: 'available',
    category: 'Community',
    created_at: '2026-04-01T00:00:00Z',
  },
];

const INITIAL_LETTERS: SponsorshipMessage[] = [];

const INITIAL_FIELD_REPORTS: FieldReport[] = [];

const INITIAL_DONATIONS: Donation[] = [];

const INITIAL_AUTH_LOGS: AuthAuditLog[] = [];

const INITIAL_USERS: Profile[] = [
  {
    id: 'u-1',
    email: 'admin@thegccfoundation.org',
    name: 'GCC Admin',
    role: 'admin',
    phone: '+256 700 000 000',
    location: 'Kampala, Uganda',
    avatar_url: '',
    is_active: true,
    giving_total: 0.0,
    giving_count: 0,
    created_at: '2026-01-01T00:00:00Z',
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-1',
    title: 'Clean Water Boreholes for Karamoja',
    slug: 'clean-water-boreholes-karamoja',
    category: 'Clean Water & Sanitation',
    story: 'Providing 12 deep solar-powered boreholes to drought-impacted communities across Moroto and Kotido districts in Karamoja.',
    goal_amount: 45000.0,
    raised_amount: 0.0,
    currency: 'USD',
    banner_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    is_featured: true,
    donor_count: 0,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cmp-2',
    title: 'Mulago Pediatric Oncology Emergency Ward',
    slug: 'mulago-pediatric-oncology-ward',
    category: 'Healthcare & Medical',
    story: 'Funding chemotherapy lines, sterile infant cots, and maternal care support for children battling leukemia at Mulago National Referral Hospital.',
    goal_amount: 60000.0,
    raised_amount: 0.0,
    currency: 'USD',
    banner_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    is_featured: true,
    donor_count: 0,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'cmp-3',
    title: 'High School Girls STEM Scholarships',
    slug: 'high-school-girls-stem-scholarships',
    category: 'Education & Tuition',
    story: 'Covering full boarding tuition, uniform, laptop, and science lab fees for 60 vulnerable young women across rural Eastern Uganda.',
    goal_amount: 28000.0,
    raised_amount: 0.0,
    currency: 'USD',
    banner_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    is_featured: false,
    donor_count: 0,
    created_at: '2026-04-10T00:00:00Z',
  },
];

const INITIAL_USER_FUNDRAISERS: UserFundraiser[] = [];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Annual Kampala Charity Gala & Silent Auction',
    description: 'Our flagship fundraising evening uniting partners, corporate sponsors, and grassroots leaders to benefit pediatric surgeries.',
    event_date: '2026-12-12T18:00:00Z',
    location: 'Sheraton Kampala Hotel, Victoria Hall',
    capacity: 250,
    registered_count: 0,
    status: 'upcoming',
    created_at: '2026-10-01T00:00:00Z',
  },
  {
    id: 'ev-2',
    title: 'Community Tree Planting & Watershed Protection Outreach',
    description: 'Mobilizing 100 youth volunteers to plant 3,000 indigenous saplings along the Mpologoma wetland basin.',
    event_date: '2026-11-28T08:00:00Z',
    location: 'Iganga Wetland Reserve, Eastern Region',
    capacity: 100,
    registered_count: 0,
    status: 'upcoming',
    created_at: '2026-10-15T00:00:00Z',
  },
];

const INITIAL_VOLUNTEERS: VolunteerLog[] = [];

const INITIAL_SETTINGS: OrgSettings = {
  id: 'primary',
  ngo_name: 'GCC Foundation',
  registration_number: 'NGO-REG/UG/2022/8941',
  physical_address: 'Plot 14, Jinja Road, Kampala, Uganda',
  tax_id: 'TIN-99482104-E',
  official_email: 'contact@thegccfoundation.org',
  official_phone: '+256 700 123 456',
  receipt_stamp_url: '/images/gcc-emblem.png',
  receipt_signature_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&q=80',
  default_currency: 'USD',
  updated_at: '2026-11-01T00:00:00Z',
};

// Local storage key helpers for seamless client fallback
const STORAGE_PREFIX = 'gcc_admin_store_v3_';

if (typeof window !== 'undefined') {
  try {
    const legacyKeys = [
      'donations',
      'children',
      'letters',
      'field_reports',
      'campaigns',
      'fundraisers',
      'users',
      'events',
      'volunteers',
      'org_settings',
    ];
    legacyKeys.forEach((k) => {
      localStorage.removeItem('gcc_admin_store_' + k);
      localStorage.removeItem('gcc_admin_store_v2_' + k);
    });
  } catch {}
}

function getStore<T>(key: string, initialData: T): T {
  if (typeof window === 'undefined') return initialData;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
}

function setStore<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {}
}

// ==============================================================================
// SERVICE IMPLEMENTATION
// ==============================================================================
export const AdminService = {
  // ----------------------------------------------------------------------------
  // 1. Overview & Dashboard KPIs
  // ----------------------------------------------------------------------------
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: donations } = await supabase
          .from('donations')
          .select('amount, payment_status, created_at')
          .eq('payment_status', 'succeeded');

        const { count: activeSponsorships } = await supabase
          .from('sponsorships')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        const { count: pendingLetters } = await supabase
          .from('sponsorship_messages')
          .select('*', { count: 'exact', head: true })
          .eq('moderation_status', 'pending');

        const { count: pendingFundraisers } = await supabase
          .from('user_fundraisers')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending_review');

        const { count: totalSupporters } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const now = new Date();
        const thisYear = now.getUTCFullYear();
        const thisMonth = now.getUTCMonth();

        let totalAllTime = 0;
        let totalYear = 0;
        let totalMonth = 0;

        (donations || []).forEach((d) => {
          const amt = Number(d.amount) || 0;
          totalAllTime += amt;
          const dt = new Date(d.created_at);
          if (dt.getUTCFullYear() === thisYear) {
            totalYear += amt;
            if (dt.getUTCMonth() === thisMonth) {
              totalMonth += amt;
            }
          }
        });

        return {
          totalRaisedAllTime: totalAllTime,
          totalRaisedThisYear: totalYear,
          totalRaisedThisMonth: totalMonth,
          activeRecurringDonors: activeSponsorships || 0,
          activeSponsorships: activeSponsorships || 0,
          pendingLetterApprovals: pendingLetters || 0,
          pendingFundraiserApprovals: pendingFundraisers || 0,
          totalRegisteredSupporters: totalSupporters || 0,
          currency: 'USD',
        };
      } catch (err) {
        console.warn('Falling back to local data store for KPIs:', err);
      }
    }

    // Local fallback
    const donations = getStore<Donation[]>('donations', INITIAL_DONATIONS);
    const children = getStore<SponsoredChild[]>('children', INITIAL_CHILDREN);
    const letters = getStore<SponsorshipMessage[]>('letters', INITIAL_LETTERS);
    const fundraisers = getStore<UserFundraiser[]>('fundraisers', INITIAL_USER_FUNDRAISERS);
    const users = getStore<Profile[]>('users', INITIAL_USERS);

    const now = new Date();
    const thisYear = now.getUTCFullYear();
    const thisMonth = now.getUTCMonth();

    let totalAllTime = 0;
    let totalYear = 0;
    let totalMonth = 0;

    donations
      .filter((d) => d.payment_status === 'succeeded')
      .forEach((d) => {
        totalAllTime += d.amount;
        const dt = new Date(d.created_at);
        if (dt.getUTCFullYear() === thisYear) {
          totalYear += d.amount;
          if (dt.getUTCMonth() === thisMonth) {
            totalMonth += d.amount;
          }
        }
      });

    const activeSponsorshipCount = children.filter((c) => c.status === 'sponsored').length;
    const pendingLettersCount = letters.filter((l) => l.moderation_status === 'pending').length;
    const pendingFundraisersCount = fundraisers.filter((f) => f.status === 'pending_review').length;

    return {
      totalRaisedAllTime: totalAllTime,
      totalRaisedThisYear: totalYear,
      totalRaisedThisMonth: totalMonth,
      activeRecurringDonors: activeSponsorshipCount,
      activeSponsorships: activeSponsorshipCount,
      pendingLetterApprovals: pendingLettersCount,
      pendingFundraiserApprovals: pendingFundraisersCount,
      totalRegisteredSupporters: users.filter((u) => u.role === "donor" || (u.giving_total && u.giving_total > 0)).length,
      currency: 'USD',
    };
  },

  // ----------------------------------------------------------------------------
  // 2. Child Sponsorship CMS
  // ----------------------------------------------------------------------------
  async getChildren(): Promise<SponsoredChild[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('sponsored_children')
          .select('*, sponsorships(*)')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((child: any) => ({
            ...child,
            active_sponsorship: child.sponsorships?.find((s: any) => s.status === 'active') || null,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch children failed, using local store:', err);
      }
    }
    return getStore<SponsoredChild[]>('children', INITIAL_CHILDREN);
  },

  async createChild(
    child: Omit<SponsoredChild, 'id' | 'created_at' | 'active_sponsorship'>
  ): Promise<SponsoredChild> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('sponsored_children')
          .insert(child)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase create child failed, saving locally:', err);
      }
    }

    const items = getStore<SponsoredChild[]>('children', INITIAL_CHILDREN);
    const newChild: SponsoredChild = {
      ...child,
      id: `ch-${Date.now()}`,
      created_at: new Date().toISOString(),
      active_sponsorship: null,
    };
    items.unshift(newChild);
    setStore('children', items);
    notifyDataChanged('children');
    return newChild;
  },

  async updateChild(id: string, updates: Partial<SponsoredChild>): Promise<SponsoredChild> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { active_sponsorship, ...cleanedUpdates } = updates;
        const { data, error } = await supabase
          .from('sponsored_children')
          .update(cleanedUpdates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase update child failed, updating locally:', err);
      }
    }

    const items = getStore<SponsoredChild[]>('children', INITIAL_CHILDREN);
    const index = items.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Child not found');
    const updated = { ...items[index], ...updates, updated_at: new Date().toISOString() };
    items[index] = updated;
    setStore('children', items);
    notifyDataChanged('children');
    return updated;
  },

  async deleteChild(id: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('sponsored_children').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete child failed:', err);
      }
    }
    const items = getStore<SponsoredChild[]>('children', INITIAL_CHILDREN);
    const filtered = items.filter((c) => c.id !== id);
    setStore('children', filtered);
    notifyDataChanged('children');
  },

  async linkSponsorship(
    childId: string,
    sponsor: { name: string; email: string; monthlyAmount: number }
  ): Promise<Sponsorship> {
    const children = getStore<SponsoredChild[]>('children', INITIAL_CHILDREN);
    const childIndex = children.findIndex((c) => c.id === childId);
    if (childIndex === -1) throw new Error('Child not found');

    if (children[childIndex].status === 'sponsored') {
      throw new Error('This child already has an active sponsorship. Unlink the current sponsor before assigning a new one.');
    }

    const newSponsorship: Sponsorship = {
      id: `sp-${Date.now()}`,
      child_id: childId,
      sponsor_name: sponsor.name,
      sponsor_email: sponsor.email,
      monthly_amount: sponsor.monthlyAmount || children[childIndex].monthly_amount,
      currency: children[childIndex].currency || 'USD',
      status: 'active',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    children[childIndex].status = 'sponsored';
    children[childIndex].active_sponsorship = newSponsorship;
    setStore('children', children);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('sponsorships').insert(newSponsorship);
        await supabase.from('sponsored_children').update({ status: 'sponsored' }).eq('id', childId);
      } catch (err) {
        console.warn('Supabase link sponsorship failed, saved locally:', err);
      }
    }

    return newSponsorship;
  },

  async unlinkSponsorship(childId: string): Promise<void> {
    const children = getStore<SponsoredChild[]>('children', INITIAL_CHILDREN);
    const childIndex = children.findIndex((c) => c.id === childId);
    if (childIndex === -1) throw new Error('Child not found');

    children[childIndex].status = 'available';
    children[childIndex].active_sponsorship = null;
    setStore('children', children);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('sponsorships')
          .update({ status: 'cancelled' })
          .eq('child_id', childId)
          .eq('status', 'active');
        await supabase.from('sponsored_children').update({ status: 'available' }).eq('id', childId);
      } catch (err) {
        console.warn('Supabase unlink sponsorship failed:', err);
      }
    }
  },

  async uploadStorageFile(bucket: string, file: File, pathPrefix = ''): Promise<string> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${pathPrefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });
        if (!error) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
          return data.publicUrl;
        }
      } catch (err) {
        console.warn(`Supabase storage upload failed for bucket ${bucket}:`, err);
      }
    }

    // Fallback: create an object URL or read as Data URL for browser preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  },

  // ----------------------------------------------------------------------------
  // 3. Letter & Field Report Moderation
  // ----------------------------------------------------------------------------
  async getLetters(): Promise<SponsorshipMessage[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('sponsorship_messages')
          .select('*, sponsored_children(first_name, last_name)')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((item: any) => ({
            ...item,
            child_name: item.sponsored_children
              ? `${item.sponsored_children.first_name} ${item.sponsored_children.last_name || ''}`.trim()
              : 'Sponsored Child',
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch letters failed:', err);
      }
    }
    return getStore<SponsorshipMessage[]>('letters', INITIAL_LETTERS);
  },

  async moderateLetter(
    id: string,
    action: { status: 'approved' | 'rejected'; moderatedContent?: string; moderationNotes?: string }
  ): Promise<SponsorshipMessage> {
    const letters = getStore<SponsorshipMessage[]>('letters', INITIAL_LETTERS);
    const index = letters.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Letter not found');

    const updated: SponsorshipMessage = {
      ...letters[index],
      moderation_status: action.status,
      moderated_content: action.moderatedContent !== undefined ? action.moderatedContent : letters[index].moderated_content,
      moderation_notes: action.moderationNotes || letters[index].moderation_notes,
      reviewed_at: new Date().toISOString(),
    };

    letters[index] = updated;
    setStore('letters', letters);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('sponsorship_messages')
          .update({
            moderation_status: action.status,
            moderated_content: updated.moderated_content,
            moderation_notes: updated.moderation_notes,
            reviewed_at: updated.reviewed_at,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase moderate letter failed:', err);
      }
    }

    return updated;
  },

  async getFieldReports(): Promise<FieldReport[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('field_reports')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch field reports failed:', err);
      }
    }
    return getStore<FieldReport[]>('field_reports', INITIAL_FIELD_REPORTS);
  },

  async uploadFieldReport(
    report: Omit<FieldReport, 'id' | 'created_at'>
  ): Promise<FieldReport> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('field_reports')
          .insert(report)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase upload field report failed:', err);
      }
    }

    const items = getStore<FieldReport[]>('field_reports', INITIAL_FIELD_REPORTS);
    const newReport: FieldReport = {
      ...report,
      id: `fr-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    items.unshift(newReport);
    setStore('field_reports', items);
    return newReport;
  },

  // ----------------------------------------------------------------------------
  // 4. Donations & Financial Ledger
  // ----------------------------------------------------------------------------
  async getDonations(): Promise<Donation[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch donations failed:', err);
      }
    }
    return getStore<Donation[]>('donations', INITIAL_DONATIONS);
  },

  async logOfflineDonation(
    payload: Omit<Donation, 'id' | 'created_at' | 'entry_type' | 'payment_status' | 'receipt_status' | 'receipt_number'>
  ): Promise<Donation> {
    const receiptNum = `GCC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: Donation = {
      ...payload,
      id: `don-${Date.now()}`,
      entry_type: 'offline',
      payment_status: 'succeeded',
      receipt_status: 'sent',
      receipt_number: receiptNum,
      receipt_url: `/receipts/${receiptNum}.pdf`,
      created_at: new Date().toISOString(),
    };

    const items = getStore<Donation[]>('donations', INITIAL_DONATIONS);
    items.unshift(newDonation);
    setStore('donations', items);

    // Update campaign raised total if linked
    if (payload.campaign_id) {
      const campaigns = getStore<Campaign[]>('campaigns', INITIAL_CAMPAIGNS);
      const cIndex = campaigns.findIndex((c) => c.id === payload.campaign_id);
      if (cIndex !== -1) {
        campaigns[cIndex].raised_amount += payload.amount;
        campaigns[cIndex].donor_count += 1;
        setStore('campaigns', campaigns);
      }
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('donations').insert(newDonation);
      } catch (err) {
        console.warn('Supabase log offline donation failed:', err);
      }
    }

    return newDonation;
  },

  async resendReceipt(donationId: string): Promise<boolean> {
    const items = getStore<Donation[]>('donations', INITIAL_DONATIONS);
    const index = items.findIndex((d) => d.id === donationId);
    if (index === -1) return false;

    items[index].receipt_status = 'sent';
    setStore('donations', items);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('donations').update({ receipt_status: 'sent' }).eq('id', donationId);
      } catch (err) {
        console.warn('Supabase resend receipt failed:', err);
      }
    }
    return true;
  },

  // ----------------------------------------------------------------------------
  // 5. Donor & Staff Directory
  // ----------------------------------------------------------------------------
  async getUsers(): Promise<Profile[]> {
    // 1. Fetch live registered accounts from server API
    try {
      const res = await fetch('/api/auth/registered-users', { credentials: 'include' });
      if (res.ok) {
        const json = (await res.json()) as any;
        if (json.users && Array.isArray(json.users) && json.users.length > 0) {
          const localUsers = getStore<Profile[]>('users', INITIAL_USERS);
          const serverEmails = new Set(json.users.map((u: any) => (u.email || '').toLowerCase()));
          const localRemain = localUsers.filter(
            (u) => !serverEmails.has((u.email || '').toLowerCase())
          );
          return [...json.users, ...localRemain];
        }
      }
    } catch {}

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch users failed:', err);
      }
    }
    return getStore<Profile[]>('users', INITIAL_USERS);
  },

  async updateUserRole(userId: string, newRole: UserRole): Promise<Profile> {
    const users = getStore<Profile[]>('users', INITIAL_USERS);
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index].role = newRole;
    users[index].updated_at = new Date().toISOString();
    setStore('users', users);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      } catch (err) {
        console.warn('Supabase update user role failed:', err);
      }
    }
    return users[index];
  },

  async toggleUserStatus(userId: string, isActive: boolean): Promise<Profile> {
    const users = getStore<Profile[]>('users', INITIAL_USERS);
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index].is_active = isActive;
    users[index].updated_at = new Date().toISOString();
    setStore('users', users);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('profiles').update({ is_active: isActive }).eq('id', userId);
      } catch (err) {
        console.warn('Supabase toggle user status failed:', err);
      }
    }
    return users[index];
  },

  // ----------------------------------------------------------------------------
  // 6. Campaigns & Peer Fundraisers
  // ----------------------------------------------------------------------------
  async getCampaigns(): Promise<Campaign[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch campaigns failed:', err);
      }
    }
    return getStore<Campaign[]>('campaigns', INITIAL_CAMPAIGNS);
  },

  async createCampaign(campaign: Omit<Campaign, 'id' | 'raised_amount' | 'donor_count' | 'created_at'>): Promise<Campaign> {
    const newCamp: Campaign = {
      ...campaign,
      id: `cmp-${Date.now()}`,
      raised_amount: 0,
      donor_count: 0,
      created_at: new Date().toISOString(),
    };

    const items = getStore<Campaign[]>('campaigns', INITIAL_CAMPAIGNS);
    items.unshift(newCamp);
    setStore('campaigns', items);
    notifyDataChanged('campaigns');

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('campaigns').insert(newCamp);
      } catch (err) {
        console.warn('Supabase create campaign failed:', err);
      }
    }
    return newCamp;
  },

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const items = getStore<Campaign[]>('campaigns', INITIAL_CAMPAIGNS);
    const index = items.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Campaign not found');

    const updated = { ...items[index], ...updates, updated_at: new Date().toISOString() };
    items[index] = updated;
    setStore('campaigns', items);
    notifyDataChanged('campaigns');

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('campaigns').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase update campaign failed:', err);
      }
    }
    return updated;
  },

  async postCampaignUpdate(
    update: Omit<CampaignUpdate, 'id' | 'created_at'>
  ): Promise<CampaignUpdate> {
    const newUpdate: CampaignUpdate = {
      ...update,
      id: `cupd-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const updates = getStore<CampaignUpdate[]>('campaign_updates', []);
    updates.unshift(newUpdate);
    setStore('campaign_updates', updates);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('campaign_updates').insert(newUpdate);
      } catch (err) {
        console.warn('Supabase post campaign update failed:', err);
      }
    }
    return newUpdate;
  },

  async getUserFundraisers(): Promise<UserFundraiser[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_fundraisers')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch user fundraisers failed:', err);
      }
    }
    return getStore<UserFundraiser[]>('fundraisers', INITIAL_USER_FUNDRAISERS);
  },

  async moderateUserFundraiser(
    id: string,
    decision: { status: 'approved' | 'rejected'; rejectionReason?: string; isFeatured?: boolean }
  ): Promise<UserFundraiser> {
    const items = getStore<UserFundraiser[]>('fundraisers', INITIAL_USER_FUNDRAISERS);
    const index = items.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Fundraiser not found');

    const updated: UserFundraiser = {
      ...items[index],
      status: decision.status,
      rejection_reason: decision.rejectionReason || null,
      is_featured: decision.isFeatured !== undefined ? decision.isFeatured : items[index].is_featured,
      updated_at: new Date().toISOString(),
    };

    items[index] = updated;
    setStore('fundraisers', items);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('user_fundraisers')
          .update({
            status: decision.status,
            rejection_reason: decision.rejectionReason || null,
            is_featured: updated.is_featured,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase moderate fundraiser failed:', err);
      }
    }
    return updated;
  },

  // ----------------------------------------------------------------------------
  // 7. Events, Volunteers & Settings
  // ----------------------------------------------------------------------------
  async getEvents(): Promise<EventItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch events failed:', err);
      }
    }
    return getStore<EventItem[]>('events', INITIAL_EVENTS);
  },

  async createEvent(event: Omit<EventItem, 'id' | 'registered_count' | 'created_at'>): Promise<EventItem> {
    const newEvent: EventItem = {
      ...event,
      id: `ev-${Date.now()}`,
      registered_count: 0,
      created_at: new Date().toISOString(),
    };

    const items = getStore<EventItem[]>('events', INITIAL_EVENTS);
    items.push(newEvent);
    setStore('events', items);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('events').insert(newEvent);
      } catch (err) {
        console.warn('Supabase create event failed:', err);
      }
    }
    return newEvent;
  },

  async getVolunteerLogs(): Promise<VolunteerLog[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('volunteer_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch volunteer logs failed:', err);
      }
    }
    return getStore<VolunteerLog[]>('volunteers', INITIAL_VOLUNTEERS);
  },

  async approveVolunteerLog(id: string, status: 'approved' | 'rejected'): Promise<VolunteerLog> {
    const items = getStore<VolunteerLog[]>('volunteers', INITIAL_VOLUNTEERS);
    const index = items.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Volunteer log not found');

    items[index].status = status;
    setStore('volunteers', items);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('volunteer_logs').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase approve volunteer log failed:', err);
      }
    }
    return items[index];
  },

  async getOrgSettings(): Promise<OrgSettings> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('organization_settings')
          .select('*')
          .eq('id', 'primary')
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch org settings failed:', err);
      }
    }
    return getStore<OrgSettings>('org_settings', INITIAL_SETTINGS);
  },

  async updateOrgSettings(updates: Partial<OrgSettings>): Promise<OrgSettings> {
    const current = getStore<OrgSettings>('org_settings', INITIAL_SETTINGS);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    setStore('org_settings', updated);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('organization_settings')
          .update(updates)
          .eq('id', 'primary');
      } catch (err) {
        console.warn('Supabase update org settings failed:', err);
      }
    }
    return updated;
  },

  async sendBroadcastAnnouncement(broadcast: {
    title: string;
    targetAudience: string;
    message: string;
  }): Promise<{ success: boolean; deliveredCount: number }> {
    // In a real environment, this invokes a Supabase Edge Function or Resend/Twilio dispatch
    const users = getStore<Profile[]>('users', INITIAL_USERS);
    const recipients = broadcast.targetAudience === 'All Supporters'
      ? users.length
      : broadcast.targetAudience === 'Child Sponsors'
      ? 2
      : Math.max(1, Math.floor(users.length * 0.4));

    return {
      success: true,
      deliveredCount: recipients,
    };
  },

  // ----------------------------------------------------------------------------
  // 8. Authentication & Session Audit Logs
  // ----------------------------------------------------------------------------
  async getAuthAuditLogs(): Promise<AuthAuditLog[]> {
    // 1. Try fetching from server API (which reads KV / Memory / DB)
    try {
      const res = await fetch('/api/auth/audit-logs', { credentials: 'include' });
      if (res.ok) {
        const json = (await res.json()) as any;
        if (json.logs && Array.isArray(json.logs) && json.logs.length > 0) {
          return json.logs;
        }
      }
    } catch {}

    // 2. Try Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('auth_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch auth_audit_logs failed, using local store:', err);
      }
    }

    return getStore<AuthAuditLog[]>('auth_audit_logs', INITIAL_AUTH_LOGS);
  },

  async recordAuthEvent(
    event: Omit<AuthAuditLog, 'id' | 'created_at'>
  ): Promise<AuthAuditLog> {
    const newEntry: AuthAuditLog = {
      ...event,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      created_at: new Date().toISOString(),
    };

    // Try posting to server
    try {
      await fetch('/api/auth/record-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
        credentials: 'include',
      });
    } catch {}

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('auth_audit_logs').insert(newEntry);
      } catch {}
    }

    // Update local store
    const items = getStore<AuthAuditLog[]>('auth_audit_logs', INITIAL_AUTH_LOGS);
    const updated = [newEntry, ...items].slice(0, 200);
    setStore('auth_audit_logs', updated);
    return newEntry;
  },
};
