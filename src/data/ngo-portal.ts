export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Girl' | 'Boy';
  district: string;
  schoolAndGrade: string;
  monthlySponsorshipUSD: number;
  bio: string;
  dream: string;
  photoUrl: string;
  status: 'available' | 'sponsored';
  sponsorName?: string;
  sponsorEmail?: string;
  sponsoredSince?: string;
}

export interface ChildLetter {
  id: string;
  donorName: string;
  donorEmail: string;
  childId: string;
  childName: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  editedByAdmin?: boolean;
}

export interface FieldUpdateUpload {
  id: string;
  title: string;
  documentType: 'Termly Report Card' | 'Field Progress Letter' | 'Verified Field Photo';
  targetType: 'child' | 'project';
  targetId: string;
  targetName: string;
  termOrPeriod: string;
  notes: string;
  attachmentUrl: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface LedgerTransaction {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  campaignId: string;
  campaignTitle: string;
  amountUGX: number;
  currencyCode?: string;
  amountMinor?: number;
  paymentMethod:
    | 'MTN MoMo'
    | 'Online'
    | 'Airtel Money'
    | 'Visa / Mastercard'
    | 'Direct Bank Wire (EFT)'
    | 'Offline Cash Receipt'
    | 'Mobile Money Receipt (Manual)';
  entryType: 'Online' | 'Manual Offline Entry' | 'Adjustment';
  date: string;
  monthTag: 'this-month' | 'this-year' | 'prior-year';
  referenceCode: string;
  notes?: string;
}

export interface DonorDirectoryEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalDonatedUGX: number;
  donationsCount: number;
  recurringPlan: string;
  joinedDate: string;
  role: 'user' | 'volunteer' | 'admin';
  accountStatus: 'active' | 'deactivated';
  contributionsByCurrency?: Array<{ currency: string; amountMinor: number }>;
}

export interface NewsMilestoneItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  publishedAt: string;
  author: string;
  campaignId?: string;
  campaignTitle?: string;
  imageUrl?: string;
}

export const CHILDREN_STORAGE_KEY = 'gcc_foundation_children_cms';
export const LETTERS_STORAGE_KEY = 'gcc_foundation_child_letters';
export const FIELD_UPDATES_STORAGE_KEY = 'gcc_foundation_field_updates';
export const LEDGER_STORAGE_KEY = 'gcc_foundation_global_ledger';
export const DONORS_STORAGE_KEY = 'gcc_foundation_donor_directory';
export const NEWS_STORAGE_KEY = 'gcc_foundation_news_milestones';

export const DEFAULT_CHILDREN: ChildProfile[] = [
  {
    id: 'child-01',
    name: 'Grace Nakato',
    age: 9,
    gender: 'Girl',
    district: 'Soroti District, Uganda',
    schoolAndGrade: 'St. Mary’s Primary School · Primary 4',
    monthlySponsorshipUSD: 35,
    bio: 'Grace loves mathematics and reading storybooks. Sponsorship covers her school tuition, hot midday meals, uniform, and routine pediatric checkups.',
    dream: 'Wants to become a pediatric heart surgeon',
    photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    status: 'available',
  },
  {
    id: 'child-02',
    name: 'Samuel Okello',
    age: 11,
    gender: 'Boy',
    district: 'Gulu District, Uganda',
    schoolAndGrade: 'Pece Community Primary · Primary 6',
    monthlySponsorshipUSD: 35,
    bio: 'Samuel is top of his class in science and helps care for his younger siblings. Sponsorship provides full termly school fees, textbooks, and medical care.',
    dream: 'Wants to become a civil & water engineer',
    photoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    status: 'available',
  },
  {
    id: 'child-03',
    name: 'Esther Namono',
    age: 8,
    gender: 'Girl',
    district: 'Mbale District, Uganda',
    schoolAndGrade: 'Elgon View Primary · Primary 3',
    monthlySponsorshipUSD: 35,
    bio: 'Esther was displaced during the Bududa mudslides and now lives with her grandmother. Sponsorship ensures uninterrupted schooling, shoes, and nutritional support.',
    dream: 'Wants to become a primary school teacher',
    photoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80',
    status: 'available',
  },
  {
    id: 'child-04',
    name: 'Daniel Mukasa',
    age: 13,
    gender: 'Boy',
    district: 'Kampala / Wakiso, Uganda',
    schoolAndGrade: 'Nsambya Community Secondary · Senior 1',
    monthlySponsorshipUSD: 45,
    bio: 'Daniel recently recovered from corrective surgery and is eager to complete his secondary education with laboratory supplies and boarding tuition.',
    dream: 'Wants to become a biomedical technician',
    photoUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
    status: 'sponsored',
    sponsorName: 'Sarah Jenkins',
    sponsorEmail: 'sarah.jenkins@example.org',
    sponsoredSince: 'Feb 2026',
  },
];

export const DEFAULT_LETTERS: ChildLetter[] = [
  {
    id: 'ltr-101',
    donorName: 'Sarah Jenkins',
    donorEmail: 'sarah.jenkins@example.org',
    childId: 'child-04',
    childName: 'Daniel Mukasa',
    message: 'Dear Daniel, congratulations on starting Senior 1! Keep working hard in your science classes. We are cheering for you every day!',
    createdAt: '17 Nov 2026',
    status: 'pending',
  },
  {
    id: 'ltr-102',
    donorName: 'David Kizza',
    donorEmail: 'dkizza@example.com',
    childId: 'child-01',
    childName: 'Grace Nakato',
    message: 'Hello Grace! Wishing you the very best in your end-of-term mathematics exams. Your dream of becoming a doctor will come true!',
    createdAt: '16 Nov 2026',
    status: 'approved',
  },
];

export const DEFAULT_FIELD_UPDATES: FieldUpdateUpload[] = [
  {
    id: 'fld-201',
    title: 'Term 3 Academic Report Card & Attendance Sheet',
    documentType: 'Termly Report Card',
    targetType: 'child',
    targetId: 'child-04',
    targetName: 'Daniel Mukasa',
    termOrPeriod: 'Term 3 · 2026',
    notes: 'Scored 88% in Integrated Science and 84% in Mathematics. Promoted with distinction.',
    attachmentUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    fileName: 'daniel_mukasa_term3_report_2026.pdf',
    uploadedAt: '17 Nov 2026',
    uploadedBy: 'Grace Acan (Field Officer)',
  },
  {
    id: 'fld-202',
    title: 'Handwritten Thank-You Letter & Classroom Portrait',
    documentType: 'Field Progress Letter',
    targetType: 'child',
    targetId: 'child-01',
    targetName: 'Grace Nakato',
    termOrPeriod: 'Term 3 · 2026',
    notes: 'Scanned handwritten letter from St. Mary’s Primary School thanking supporters for new textbooks.',
    attachmentUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    fileName: 'grace_nakato_progress_letter.jpg',
    uploadedAt: '15 Nov 2026',
    uploadedBy: 'Moses Otim (Soroti Field Desk)',
  },
];

export const DEFAULT_LEDGER: LedgerTransaction[] = [
  {
    id: 'tx-9001',
    receiptNumber: 'GCC-RCP-2026-9001',
    donorName: 'Grace & Andrew Kato',
    donorEmail: 'kato.family@diaspora.org',
    campaignId: 'camp-01',
    campaignTitle: 'Emergency Open-Heart Surgery for 6-Year-Old Brenda',
    amountUGX: 4450000,
    paymentMethod: 'Direct Bank Wire (EFT)',
    entryType: 'Online',
    date: '18 Nov 2026',
    monthTag: 'this-month',
    referenceCode: 'EFT-STB-UG-884129',
    notes: 'Direct diaspora wire for pediatric cardiac theatre kit',
  },
  {
    id: 'tx-9002',
    receiptNumber: 'GCC-RCP-2026-9002',
    donorName: 'Dr. Rebecca Nambi',
    donorEmail: 'rebecca.nambi@mulago.go.ug',
    campaignId: 'camp-02',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    amountUGX: 1850000,
    paymentMethod: 'MTN MoMo',
    entryType: 'Online',
    date: '16 Nov 2026',
    monthTag: 'this-month',
    referenceCode: 'MOMO-UG-7749201',
    notes: 'Monthly recurring pledge + borehole equipment contribution',
  },
  {
    id: 'tx-9003',
    receiptNumber: 'GCC-RCP-2026-9003',
    donorName: 'Sarah Jenkins',
    donorEmail: 'sarah.jenkins@example.org',
    campaignId: 'camp-03',
    campaignTitle: 'Secondary School Tuition for 38 Displaced Girls',
    amountUGX: 3200000,
    paymentMethod: 'Visa / Mastercard',
    entryType: 'Online',
    date: '12 Nov 2026',
    monthTag: 'this-month',
    referenceCode: 'STRIPE-UK-992014',
    notes: 'Child sponsorship & girls dormitory bursar settlement',
  },
  {
    id: 'tx-9004',
    receiptNumber: 'GCC-RCP-2026-8840',
    donorName: 'Eng. Michael Otim',
    donorEmail: 'm.otim@tesohydro.co.ug',
    campaignId: 'camp-02',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    amountUGX: 3500000,
    paymentMethod: 'Offline Cash Receipt',
    entryType: 'Manual Offline Entry',
    date: '14 Sep 2026',
    monthTag: 'this-year',
    referenceCode: 'CASH-VCH-2026-114',
    notes: 'Logged from Soroti field office physical receipt book #114',
  },
];

export const DEFAULT_DONORS: DonorDirectoryEntry[] = [
  {
    id: 'dnr-01',
    name: 'Dr. Rebecca Nambi',
    email: 'rebecca.nambi@mulago.go.ug',
    phone: '+256 772 310 944',
    address: 'Plot 14 Nakasero Hill, Kampala, Uganda',
    totalDonatedUGX: 4850000,
    donationsCount: 6,
    recurringPlan: 'Monthly ($50 / mo)',
    joinedDate: 'Jan 2026',
    role: 'user',
    accountStatus: 'active',
  },
  {
    id: 'dnr-02',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.org',
    phone: '+44 7700 900412',
    address: '28 Kensington High St, London, UK',
    totalDonatedUGX: 9200000,
    donationsCount: 11,
    recurringPlan: 'Child Sponsor ($45 / mo)',
    joinedDate: 'Feb 2026',
    role: 'user',
    accountStatus: 'active',
  },
  {
    id: 'dnr-03',
    name: 'Eng. Michael Otim',
    email: 'm.otim@tesohydro.co.ug',
    phone: '+256 701 882 190',
    address: 'Soroti Main Street, Soroti, Uganda',
    totalDonatedUGX: 3500000,
    donationsCount: 4,
    recurringPlan: 'One-Time Supporter',
    joinedDate: 'May 2026',
    role: 'volunteer',
    accountStatus: 'active',
  },
  {
    id: 'dnr-04',
    name: 'Grace & Andrew Kato',
    email: 'kato.family@diaspora.org',
    phone: '+1 (617) 555-0194',
    address: '410 Massachusetts Ave, Boston, MA, USA',
    totalDonatedUGX: 12400000,
    donationsCount: 8,
    recurringPlan: 'Monthly ($100 / mo)',
    joinedDate: 'Aug 2026',
    role: 'admin',
    accountStatus: 'active',
  },
];

export const DEFAULT_NEWS: NewsMilestoneItem[] = [
  {
    id: 'news-01',
    title: 'Uganda Heart Institute Pediatric Bypass Kit Disbursed via Direct EFT',
    category: 'Medical Milestone',
    summary: 'USh 4,450,000 settled directly to UHI Treasury (Ref: EFT-STB-UG-884129) for infant cardiac care.',
    publishedAt: '16 Nov 2026',
    author: 'Pauline Namukasa, FCCA',
    campaignTitle: 'Emergency Open-Heart Surgery for 6-Year-Old Brenda',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-02',
    title: 'Soroti Solar Borehole Reaches 110m Aquifer Depth',
    category: 'Clean Water Update',
    summary: 'Tranche 2 engineering inspection passed; 24-hour pump yield test scheduled for this week.',
    publishedAt: '14 Nov 2026',
    author: 'Eng. Francis Opio, PE',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  },
];
