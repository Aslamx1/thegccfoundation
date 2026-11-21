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
  {
    id: 'child-05',
    name: 'Brenda Namubiru',
    age: 7,
    gender: 'Girl',
    district: 'Kawempe Division, Kampala',
    schoolAndGrade: 'Mulago Community School · Primary 2',
    monthlySponsorshipUSD: 40,
    bio: 'Brenda is an energetic young learner who survived complex cardiac therapy and is thriving. Sponsorship provides specialized nutrition and early childhood education.',
    dream: 'Wants to become a children\'s nurse',
    photoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    status: 'sponsored',
    sponsorName: 'Dr. Rebecca Nambi',
    sponsorEmail: 'rebecca.nambi@mulago.go.ug',
    sponsoredSince: 'Jan 2026',
  },
  {
    id: 'child-06',
    name: 'Brian Kiberu',
    age: 10,
    gender: 'Boy',
    district: 'Jinja District, Uganda',
    schoolAndGrade: 'Walukuba East Primary · Primary 5',
    monthlySponsorshipUSD: 35,
    bio: 'Brian loves experimental biology and gardening. Sponsorship covers his tuition, learning supplies, and daily balanced lunches.',
    dream: 'Wants to become an agricultural scientist',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    status: 'sponsored',
    sponsorName: 'Eng. Michael Otim',
    sponsorEmail: 'm.otim@tesohydro.co.ug',
    sponsoredSince: 'May 2026',
  },
  {
    id: 'child-07',
    name: 'Faith Atim',
    age: 12,
    gender: 'Girl',
    district: 'Lira District, Uganda',
    schoolAndGrade: 'Lira Model Junior School · Primary 6',
    monthlySponsorshipUSD: 38,
    bio: 'Faith is top of her debate club and passionate about environmental protection. Sponsorship provides school fees and hygiene kits.',
    dream: 'Wants to become a community magistrate & lawyer',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    status: 'sponsored',
    sponsorName: 'Grace & Andrew Kato',
    sponsorEmail: 'kato.family@diaspora.org',
    sponsoredSince: 'Aug 2026',
  },
  {
    id: 'child-08',
    name: 'Joseph Sserwadda',
    age: 8,
    gender: 'Boy',
    district: 'Masaka District, Uganda',
    schoolAndGrade: 'Villa Maria Primary · Primary 3',
    monthlySponsorshipUSD: 35,
    bio: 'Joseph is curious, kind-hearted, and loves building model cars from wire. Sponsorship secures his classroom books, uniform, and immunizations.',
    dream: 'Wants to become an electrical technician',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    status: 'available',
  },
];

export const DEFAULT_LETTERS: ChildLetter[] = [
  {
    id: 'ltr-101',
    donorName: 'Sarah Jenkins',
    donorEmail: 'sarah.jenkins@example.org',
    childId: 'child-04',
    childName: 'Daniel Mukasa',
    message: 'Dear Daniel, congratulations on starting Senior 1! Keep working hard in your science classes. We are praying for your success and cheering for you every day!',
    createdAt: '18 Nov 2026',
    status: 'pending',
  },
  {
    id: 'ltr-102',
    donorName: 'Robert Henderson',
    donorEmail: 'robert.h@hendersoncharity.org',
    childId: 'child-01',
    childName: 'Grace Nakato',
    message: 'Hello Grace! We saw your wonderful mathematics test score. Remember that with dedication and curiosity, you can reach all your dreams of becoming a doctor!',
    createdAt: '17 Nov 2026',
    status: 'pending',
  },
  {
    id: 'ltr-103',
    donorName: 'Dr. Rebecca Nambi',
    donorEmail: 'rebecca.nambi@mulago.go.ug',
    childId: 'child-05',
    childName: 'Brenda Namubiru',
    message: 'Dearest Brenda, so thrilled to hear you received your new reading books! Keep reading and smiling bright.',
    createdAt: '16 Nov 2026',
    status: 'approved',
  },
  {
    id: 'ltr-104',
    donorName: 'David Kizza',
    donorEmail: 'dkizza@example.com',
    childId: 'child-02',
    childName: 'Samuel Okello',
    message: 'Hello Samuel! Best wishes for your end-of-term exams at Pece Community Primary. Keep up the high marks in science!',
    createdAt: '15 Nov 2026',
    status: 'approved',
  },
  {
    id: 'ltr-105',
    donorName: 'Mary Akello',
    donorEmail: 'mary.akello@diasporauk.com',
    childId: 'child-07',
    childName: 'Faith Atim',
    message: 'Dear Faith, your essay on environmental conservation was truly inspiring. Stand tall and keep speaking up for your community!',
    createdAt: '12 Nov 2026',
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
    notes: 'Scored 88% in Integrated Science and 84% in Mathematics. Promoted to Senior 1 with top distinction.',
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
    notes: 'Scanned handwritten letter from St. Mary’s Primary School thanking supporters for new science textbooks.',
    attachmentUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    fileName: 'grace_nakato_progress_letter.jpg',
    uploadedAt: '15 Nov 2026',
    uploadedBy: 'Moses Otim (Soroti Field Desk)',
  },
  {
    id: 'fld-203',
    title: 'Gweri Borehole 110m Aquifer Yield Test & Water Purity Certificate',
    documentType: 'Verified Field Photo',
    targetType: 'project',
    targetId: 'camp-02',
    targetName: 'Solar-Powered Borehole for 420 Households in Gweri',
    termOrPeriod: 'Tranche 2 · Nov 2026',
    notes: 'Ministry of Water certified potable drinking standard. Continuous flow yield: 4.8 cubic meters per hour.',
    attachmentUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    fileName: 'gweri_borehole_yield_certificate_2026.pdf',
    uploadedAt: '14 Nov 2026',
    uploadedBy: 'Eng. Francis Opio, PE (Field Inspector)',
  },
  {
    id: 'fld-204',
    title: 'Uganda Heart Institute Post-Operative Clinical Clearance',
    documentType: 'Termly Report Card',
    targetType: 'child',
    targetId: 'child-05',
    targetName: 'Brenda Namubiru',
    termOrPeriod: 'Post-Surgery · Nov 2026',
    notes: 'Echocardiogram reveals normal ventricular septal repair. Cleared for normal school attendance.',
    attachmentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    fileName: 'brenda_namubiru_cardiac_clearance.pdf',
    uploadedAt: '12 Nov 2026',
    uploadedBy: 'Dr. Rebecca Nambi (Mulago Liaison)',
  },
];

export const DEFAULT_LEDGER: LedgerTransaction[] = [
  {
    id: 'tx-9001',
    receiptNumber: 'GCC-RCP-2026-9001',
    donorName: 'GCC Board of Trustees Seed Fund',
    donorEmail: 'trustees@gccfoundation.org',
    campaignId: 'camp-01',
    campaignTitle: 'Emergency Open-Heart Surgery for 6-Year-Old Brenda',
    amountUGX: 5000000,
    paymentMethod: 'Direct Bank Wire (EFT)',
    entryType: 'Manual Offline Entry',
    date: '18 Nov 2026',
    monthTag: 'this-month',
    referenceCode: 'EFT-STB-UG-884129',
    notes: 'Initial institutional trustee seed allocation deposited into hospital escrow',
  },
  {
    id: 'tx-9002',
    receiptNumber: 'GCC-RCP-2026-9002',
    donorName: 'Soroti Community Launch Offering',
    donorEmail: 'soroti.field@gccfoundation.org',
    campaignId: 'camp-02',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    amountUGX: 1200000,
    paymentMethod: 'Offline Cash Receipt',
    entryType: 'Manual Offline Entry',
    date: '16 Nov 2026',
    monthTag: 'this-month',
    referenceCode: 'CASH-VCH-2026-101',
    notes: 'Physical cash collection from Gweri community borehole ground-breaking ceremony',
  },
  {
    id: 'tx-9003',
    receiptNumber: 'GCC-RCP-2026-9003',
    donorName: 'Dr. Rebecca Nambi',
    donorEmail: 'rebecca.nambi@mulago.go.ug',
    campaignId: 'camp-01',
    campaignTitle: 'Emergency Open-Heart Surgery for 6-Year-Old Brenda',
    amountUGX: 750000,
    paymentMethod: 'MTN MoMo',
    entryType: 'Manual Offline Entry',
    date: '12 Nov 2026',
    monthTag: 'this-month',
    referenceCode: 'MOMO-UG-7749201',
    notes: 'Direct mobile money contribution logged from medical staff liaison pledge',
  },
  {
    id: 'tx-9004',
    receiptNumber: 'GCC-RCP-2026-8840',
    donorName: 'Eng. Michael Otim',
    donorEmail: 'm.otim@tesohydro.co.ug',
    campaignId: 'camp-02',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    amountUGX: 1500000,
    paymentMethod: 'Direct Bank Wire (EFT)',
    entryType: 'Manual Offline Entry',
    date: '14 Sep 2026',
    monthTag: 'this-year',
    referenceCode: 'DFCU-EFT-99201',
    notes: 'Engineering technical survey donation for deep aquifer borehole project',
  },
  {
    id: 'tx-9005',
    receiptNumber: 'GCC-RCP-2026-8720',
    donorName: 'Pastor Emmanuel Mukasa',
    donorEmail: 'emmanuel.mukasa@jinjaheritage.org',
    campaignId: 'camp-03',
    campaignTitle: 'Secondary School Tuition for 38 Displaced Girls',
    amountUGX: 600000,
    paymentMethod: 'Offline Cash Receipt',
    entryType: 'Manual Offline Entry',
    date: '02 Aug 2026',
    monthTag: 'this-year',
    referenceCode: 'CASH-VCH-2026-088',
    notes: 'Community education bursar support collected from church fellowship',
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
  {
    id: 'dnr-05',
    name: 'David Kizza',
    email: 'dkizza@example.com',
    phone: '+256 752 994 102',
    address: 'Ntinda Ministers Village, Kampala, Uganda',
    totalDonatedUGX: 2950000,
    donationsCount: 5,
    recurringPlan: 'Monthly ($35 / mo)',
    joinedDate: 'Mar 2026',
    role: 'volunteer',
    accountStatus: 'active',
  },
  {
    id: 'dnr-06',
    name: 'Mary Akello',
    email: 'mary.akello@diasporauk.com',
    phone: '+44 7911 204918',
    address: 'Didsbury Village, Manchester, UK',
    totalDonatedUGX: 3750000,
    donationsCount: 4,
    recurringPlan: 'Child Sponsor ($38 / mo)',
    joinedDate: 'Jun 2026',
    role: 'user',
    accountStatus: 'active',
  },
  {
    id: 'dnr-07',
    name: 'Dr. Zainab Al-Hassan',
    email: 'zainab.alhassan@emirateshealth.ae',
    phone: '+971 50 812 4490',
    address: 'Al Wasl Road, Jumeirah, Dubai, UAE',
    totalDonatedUGX: 8200000,
    donationsCount: 3,
    recurringPlan: 'Quarterly Patron ($1,000 / qtr)',
    joinedDate: 'Sep 2026',
    role: 'user',
    accountStatus: 'active',
  },
  {
    id: 'dnr-08',
    name: 'Pastor Emmanuel Mukasa',
    email: 'emmanuel.mukasa@jinjaheritage.org',
    phone: '+256 782 441 098',
    address: 'Njeru Town Council, Jinja, Uganda',
    totalDonatedUGX: 2400000,
    donationsCount: 3,
    recurringPlan: 'Community Ambassador',
    joinedDate: 'Jul 2026',
    role: 'volunteer',
    accountStatus: 'active',
  },
];

export const DEFAULT_NEWS: NewsMilestoneItem[] = [
  {
    id: 'news-01',
    title: 'Uganda Heart Institute Pediatric Bypass Kit Disbursed via Direct EFT',
    category: 'Medical Milestone',
    summary: 'USh 4,450,000 settled directly to UHI Treasury (Ref: EFT-STB-UG-884129) for infant cardiac theatre consumables.',
    publishedAt: '16 Nov 2026',
    author: 'Pauline Namukasa, FCCA',
    campaignTitle: 'Emergency Open-Heart Surgery for 6-Year-Old Brenda',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-02',
    title: 'Soroti Solar Borehole Reaches 110m Aquifer Depth',
    category: 'Clean Water Update',
    summary: 'Tranche 2 engineering inspection passed; 24-hour continuous yield pump test certified potable drinking standard.',
    publishedAt: '14 Nov 2026',
    author: 'Eng. Francis Opio, PE',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'news-03',
    title: '38 Secondary School Tuition Bursaries Cleared for Term 3',
    category: 'Education Progress',
    summary: 'Bursary payments cleared directly to St. Peter’s Secondary and Rock View Girls Academy for displaced girls.',
    publishedAt: '11 Nov 2026',
    author: 'Grace Acan (Field Officer)',
    campaignTitle: 'Secondary School Tuition for 38 Displaced Girls',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  },
];
