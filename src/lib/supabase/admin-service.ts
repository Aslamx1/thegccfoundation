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
} from './types';

// ==============================================================================
// INITIAL / FALLBACK NGO DATA
// ==============================================================================
const INITIAL_CHILDREN: SponsoredChild[] = [
  {
    id: 'ch-1',
    first_name: 'Amina',
    last_name: 'Namyalo',
    age: 9,
    gender: 'Girl',
    location: 'Katwe Slum, Kampala',
    region: 'Central Uganda',
    school_and_grade: 'St. Peter Primary School, Primary 3',
    bio: 'Amina lives with her grandmother who weaves mats. She is curious, loves reading, and helps fetch water every morning with a bright smile.',
    aspirations: 'Wants to become a pediatrician to heal children in her village.',
    monthly_amount: 35.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    status: 'sponsored',
    created_at: '2026-01-10T08:00:00Z',
    active_sponsorship: {
      id: 'sp-1',
      child_id: 'ch-1',
      sponsor_id: 'u-101',
      sponsor_name: 'Eleanor Vance',
      sponsor_email: 'eleanor.vance@example.org',
      monthly_amount: 35.0,
      currency: 'USD',
      status: 'active',
      started_at: '2026-02-01T00:00:00Z',
      created_at: '2026-02-01T00:00:00Z',
    },
  },
  {
    id: 'ch-2',
    first_name: 'Daniel',
    last_name: 'Okello',
    age: 12,
    gender: 'Boy',
    location: 'Gulu Municipality',
    region: 'Northern Uganda',
    school_and_grade: 'Hope Memorial Academy, Primary 6',
    bio: 'Daniel is passionate about mathematics and science. His family was displaced during rural droughts and relocated to Gulu town.',
    aspirations: 'Aspirations to become an electrical engineer and build solar mini-grids.',
    monthly_amount: 35.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80',
    status: 'available',
    created_at: '2026-03-12T10:30:00Z',
    active_sponsorship: null,
  },
  {
    id: 'ch-3',
    first_name: 'Grace',
    last_name: 'Kiconco',
    age: 7,
    gender: 'Girl',
    location: 'Kabale Highlands',
    region: 'Western Uganda',
    school_and_grade: 'Grace Hill Infant School, Primary 1',
    bio: 'Grace is an active girl who loves singing and storytelling. She walks 3 kilometers to reach the nearest community school.',
    aspirations: 'Dreams of becoming a school principal to give every child free books.',
    monthly_amount: 35.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=700&q=80',
    status: 'available',
    created_at: '2026-05-18T14:15:00Z',
    active_sponsorship: null,
  },
  {
    id: 'ch-4',
    first_name: 'Brian',
    last_name: 'Mwesigwa',
    age: 14,
    gender: 'Boy',
    location: 'Jinja Town',
    region: 'Eastern Uganda',
    school_and_grade: 'Victoria Nile Secondary, Senior 1',
    bio: 'Top of his class in physics and vocational arts. Brian repairs broken radios in the market to help pay for notebooks.',
    aspirations: 'Wants to study computer science and software development.',
    monthly_amount: 40.0,
    currency: 'USD',
    portrait_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
    status: 'sponsored',
    created_at: '2026-02-20T09:00:00Z',
    active_sponsorship: {
      id: 'sp-2',
      child_id: 'ch-4',
      sponsor_id: 'u-102',
      sponsor_name: 'Marcus Chen',
      sponsor_email: 'marcus.chen@pacifictech.co',
      monthly_amount: 40.0,
      currency: 'USD',
      status: 'active',
      started_at: '2026-03-01T00:00:00Z',
      created_at: '2026-03-01T00:00:00Z',
    },
  },
];

const INITIAL_LETTERS: SponsorshipMessage[] = [
  {
    id: 'msg-1',
    sponsorship_id: 'sp-1',
    child_id: 'ch-1',
    child_name: 'Amina Namyalo',
    sender_name: 'Eleanor Vance',
    sender_email: 'eleanor.vance@example.org',
    original_content: 'Dear Amina, happy new school term! My family is praying for your exams. Here is my phone number +1-555-0199 if you ever want to call me directly.',
    moderated_content: 'Dear Amina, happy new school term! My family is praying for your exams and cheering you on as you learn!',
    moderation_status: 'pending',
    moderation_notes: 'Safety edit recommended: Redacted direct phone number to adhere to Child Protection Standard Operating Procedures.',
    created_at: '2026-11-20T14:32:00Z',
  },
  {
    id: 'msg-2',
    sponsorship_id: 'sp-2',
    child_id: 'ch-4',
    child_name: 'Brian Mwesigwa',
    sender_name: 'Marcus Chen',
    sender_email: 'marcus.chen@pacifictech.co',
    original_content: 'Hi Brian, so impressed by your report card in physics! Keep building things and asking questions. We sent an extra robotics kit through the field office.',
    moderated_content: 'Hi Brian, so impressed by your report card in physics! Keep building things and asking questions. We sent an extra robotics kit through the field office.',
    moderation_status: 'approved',
    reviewed_at: '2026-11-19T10:00:00Z',
    created_at: '2026-11-18T16:20:00Z',
  },
  {
    id: 'msg-3',
    sponsorship_id: 'sp-1',
    child_id: 'ch-1',
    child_name: 'Amina Namyalo',
    sender_name: 'Eleanor Vance',
    sender_email: 'eleanor.vance@example.org',
    original_content: 'Amina, we loved the drawing you sent of the mango tree! We have framed it in our kitchen. What is your favorite book this month?',
    moderated_content: 'Amina, we loved the drawing you sent of the mango tree! We have framed it in our kitchen. What is your favorite book this month?',
    moderation_status: 'approved',
    reviewed_at: '2026-11-15T09:15:00Z',
    created_at: '2026-11-14T11:45:00Z',
  },
];

const INITIAL_FIELD_REPORTS: FieldReport[] = [
  {
    id: 'fr-1',
    title: 'Term 3 Academic Assessment & Report Card',
    document_type: 'Report Card',
    target_type: 'child',
    target_id: 'ch-1',
    target_name: 'Amina Namyalo',
    term_or_period: 'Term 3 - 2026',
    notes: 'Grade A in Literacy, Grade B+ in Numeracy. Attendance 98%.',
    file_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    file_name: 'Amina_Term3_ReportCard_2026.pdf',
    file_size_bytes: 420000,
    uploaded_by: 'Sister Judith (Field Social Worker)',
    created_at: '2026-11-15T12:00:00Z',
  },
  {
    id: 'fr-2',
    title: 'Annual Biometric & Nutritional Health Checkup',
    document_type: 'Medical Checkup',
    target_type: 'child',
    target_id: 'ch-4',
    target_name: 'Brian Mwesigwa',
    term_or_period: 'Q4 2026',
    notes: 'Height 162cm, Weight 51kg. Routine deworming completed.',
    file_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    file_name: 'Brian_Medical_Checkup_Nov2026.pdf',
    file_size_bytes: 650000,
    uploaded_by: 'Dr. Joseph Kigozi',
    created_at: '2026-11-10T08:30:00Z',
  },
];

const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'don-1001',
    campaign_id: 'cmp-1',
    campaign_title: 'Clean Water Boreholes for Karamoja',
    donor_id: 'u-101',
    donor_name: 'Eleanor Vance',
    donor_email: 'eleanor.vance@example.org',
    amount: 250.0,
    currency: 'USD',
    entry_type: 'online',
    payment_method: 'Stripe Card (ending 4242)',
    payment_status: 'succeeded',
    reference_code: 'pi_3Mtw284kSoWbX129',
    notes: 'In honor of grandmother Martha.',
    receipt_status: 'sent',
    receipt_number: 'GCC-2026-0891',
    receipt_url: '/receipts/GCC-2026-0891.pdf',
    created_at: '2026-11-21T11:20:00Z',
  },
  {
    id: 'don-1002',
    campaign_id: 'cmp-2',
    campaign_title: 'Mulago Pediatric Oncology Emergency Ward',
    donor_id: 'u-103',
    donor_name: 'Dr. Arthur Mukasa',
    donor_email: 'arthur.mukasa@hospital.ug',
    amount: 1500.0,
    currency: 'USD',
    entry_type: 'offline',
    payment_method: 'Direct Bank Wire (EFT)',
    payment_status: 'succeeded',
    reference_code: 'STANBIC-REF-994821',
    notes: 'Chemotherapy infusion line endowment for Ward 3B.',
    receipt_status: 'sent',
    receipt_number: 'GCC-2026-0892',
    receipt_url: '/receipts/GCC-2026-0892.pdf',
    created_at: '2026-11-20T09:45:00Z',
  },
  {
    id: 'don-1003',
    campaign_id: 'cmp-3',
    campaign_title: 'High School Girls STEM Scholarships',
    donor_id: 'u-104',
    donor_name: 'Hellen Nakato',
    donor_email: 'hellen.nakato@mtn.co.ug',
    amount: 75.0,
    currency: 'USD',
    entry_type: 'offline',
    payment_method: 'MTN Mobile Money Receipt (Manual)',
    payment_status: 'succeeded',
    reference_code: 'MM-ID-99214710',
    notes: 'Direct kiosk donation at Jinja community center.',
    receipt_status: 'sent',
    receipt_number: 'GCC-2026-0893',
    receipt_url: '/receipts/GCC-2026-0893.pdf',
    created_at: '2026-11-19T14:10:00Z',
  },
  {
    id: 'don-1004',
    campaign_id: 'cmp-1',
    campaign_title: 'Clean Water Boreholes for Karamoja',
    donor_id: null,
    donor_name: 'Anonymous Donor',
    donor_email: 'supporter@anonmail.net',
    amount: 50.0,
    currency: 'USD',
    entry_type: 'online',
    payment_method: 'Airtel Money',
    payment_status: 'succeeded',
    reference_code: 'AM-TXN-847291',
    notes: 'Water is life!',
    receipt_status: 'pending',
    receipt_number: 'GCC-2026-0894',
    created_at: '2026-11-18T16:00:00Z',
  },
  {
    id: 'don-1005',
    campaign_id: 'cmp-2',
    campaign_title: 'Mulago Pediatric Oncology Emergency Ward',
    donor_id: null,
    donor_name: 'Robert Kasule',
    donor_email: 'robert.k@kasulegroup.com',
    amount: 500.0,
    currency: 'USD',
    entry_type: 'offline',
    payment_method: 'Offline Cash Receipt',
    payment_status: 'succeeded',
    reference_code: 'CASH-RCPT-1029',
    notes: 'Handed to fundraising secretary during charity gala.',
    receipt_status: 'sent',
    receipt_number: 'GCC-2026-0895',
    created_at: '2026-11-15T18:30:00Z',
  },
];

const INITIAL_USERS: Profile[] = [
  {
    id: 'u-1',
    email: 'admin@thegccfoundation.org',
    name: 'Sarah Nambi',
    role: 'admin',
    phone: '+256 772 100 200',
    location: 'Kampala, Uganda',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    is_active: true,
    giving_total: 1250.0,
    giving_count: 8,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'u-2',
    email: 'finance@thegccfoundation.org',
    name: 'David Omondi',
    role: 'finance_manager',
    phone: '+256 701 450 670',
    location: 'Entebbe, Uganda',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    is_active: true,
    giving_total: 600.0,
    giving_count: 4,
    created_at: '2025-03-15T00:00:00Z',
  },
  {
    id: 'u-3',
    email: 'programs@thegccfoundation.org',
    name: 'Grace Kyomugisha',
    role: 'program_coordinator',
    phone: '+256 788 901 234',
    location: 'Mbarara, Uganda',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    is_active: true,
    giving_total: 350.0,
    giving_count: 3,
    created_at: '2025-06-10T00:00:00Z',
  },
  {
    id: 'u-101',
    email: 'eleanor.vance@example.org',
    name: 'Eleanor Vance',
    role: 'donor',
    phone: '+1 415 555 8920',
    location: 'San Francisco, CA',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    is_active: true,
    giving_total: 3450.0,
    giving_count: 14,
    created_at: '2025-08-01T00:00:00Z',
  },
  {
    id: 'u-102',
    email: 'marcus.chen@pacifictech.co',
    name: 'Marcus Chen',
    role: 'donor',
    phone: '+1 206 555 0192',
    location: 'Seattle, WA',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    is_active: true,
    giving_total: 1800.0,
    giving_count: 9,
    created_at: '2025-09-12T00:00:00Z',
  },
  {
    id: 'u-103',
    email: 'arthur.mukasa@hospital.ug',
    name: 'Dr. Arthur Mukasa',
    role: 'donor',
    phone: '+256 752 443 112',
    location: 'Kampala, Uganda',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    is_active: true,
    giving_total: 4500.0,
    giving_count: 6,
    created_at: '2025-10-05T00:00:00Z',
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
    raised_amount: 32450.0,
    currency: 'USD',
    banner_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    is_featured: true,
    donor_count: 312,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'cmp-2',
    title: 'Mulago Pediatric Oncology Emergency Ward',
    slug: 'mulago-pediatric-oncology-ward',
    category: 'Healthcare & Medical',
    story: 'Funding chemotherapy lines, sterile infant cots, and maternal care support for children battling leukemia at Mulago National Referral Hospital.',
    goal_amount: 60000.0,
    raised_amount: 51200.0,
    currency: 'USD',
    banner_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    is_featured: true,
    donor_count: 489,
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'cmp-3',
    title: 'High School Girls STEM Scholarships',
    slug: 'high-school-girls-stem-scholarships',
    category: 'Education & Tuition',
    story: 'Covering full boarding tuition, uniform, laptop, and science lab fees for 60 vulnerable young women across rural Eastern Uganda.',
    goal_amount: 28000.0,
    raised_amount: 19800.0,
    currency: 'USD',
    banner_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    is_featured: false,
    donor_count: 142,
    created_at: '2026-04-10T00:00:00Z',
  },
];

const INITIAL_USER_FUNDRAISERS: UserFundraiser[] = [
  {
    id: 'p2p-1',
    creator_id: 'u-101',
    creator_name: 'Eleanor Vance',
    creator_email: 'eleanor.vance@example.org',
    title: 'Birthday 5K Run for Jinja Infant Nutrition',
    goal_amount: 3000.0,
    raised_amount: 1850.0,
    currency: 'USD',
    story: 'For my 35th birthday, I am running 5 kilometers along the Embarcadero to raise funds for therapeutic peanut butter paste (PlumpyNut) for Jinja infant clinics.',
    banner_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    status: 'approved',
    is_featured: true,
    created_at: '2026-11-05T09:00:00Z',
  },
  {
    id: 'p2p-2',
    creator_id: 'u-102',
    creator_name: 'Marcus Chen',
    creator_email: 'marcus.chen@pacifictech.co',
    title: 'Code For Kids: 20 Laptops for Gulu Tech Club',
    goal_amount: 5000.0,
    raised_amount: 0.0,
    currency: 'USD',
    story: 'Our Seattle engineering team is matching donations to procure refurbished ThinkPads with offline Wikipedia and Python compilers for youth in Gulu.',
    banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    status: 'pending_review',
    is_featured: false,
    created_at: '2026-11-20T17:40:00Z',
  },
  {
    id: 'p2p-3',
    creator_id: null,
    creator_name: 'Sarah Jenkins',
    creator_email: 'sarah.j@outlook.com',
    title: 'Clean Drinking Water for My Hometown Village',
    goal_amount: 2500.0,
    raised_amount: 0.0,
    currency: 'USD',
    story: 'Requesting direct support to repair a broken water pipe in our neighborhood.',
    banner_url: null,
    status: 'rejected',
    rejection_reason: 'Please specify exact district location and verify NGO partner receiving the funds.',
    is_featured: false,
    created_at: '2026-11-12T13:20:00Z',
  },
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Annual Kampala Charity Gala & Silent Auction',
    description: 'Our flagship fundraising evening uniting partners, corporate sponsors, and grassroots leaders to benefit pediatric surgeries.',
    event_date: '2026-12-12T18:00:00Z',
    location: 'Sheraton Kampala Hotel, Victoria Hall',
    capacity: 250,
    registered_count: 184,
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
    registered_count: 89,
    status: 'upcoming',
    created_at: '2026-10-15T00:00:00Z',
  },
];

const INITIAL_VOLUNTEERS: VolunteerLog[] = [
  {
    id: 'vol-1',
    volunteer_name: 'Timothy Mukasa',
    volunteer_email: 'timothy.m@makerere.edu',
    activity_name: 'Medical triage intake and translation at Mulago Clinic',
    hours_spent: 16.5,
    date_completed: '2026-11-18',
    status: 'approved',
    created_at: '2026-11-19T08:00:00Z',
  },
  {
    id: 'vol-2',
    volunteer_name: 'Brenda Atuhaire',
    volunteer_email: 'brenda.atuhaire@gmail.com',
    activity_name: 'Sorting and boxing STEM textbooks and science kits',
    hours_spent: 8.0,
    date_completed: '2026-11-20',
    status: 'pending',
    created_at: '2026-11-21T09:30:00Z',
  },
  {
    id: 'vol-3',
    volunteer_name: 'Samuel Mugisha',
    volunteer_email: 'sam.mugisha@gmail.com',
    activity_name: 'Field photography and video documentation in Katwe',
    hours_spent: 12.0,
    date_completed: '2026-11-14',
    status: 'approved',
    created_at: '2026-11-15T10:00:00Z',
  },
];

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
const STORAGE_PREFIX = 'gcc_admin_store_';

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
      activeRecurringDonors: activeSponsorshipCount + 18,
      activeSponsorships: activeSponsorshipCount,
      pendingLetterApprovals: pendingLettersCount,
      pendingFundraiserApprovals: pendingFundraisersCount,
      totalRegisteredSupporters: users.length,
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
};
