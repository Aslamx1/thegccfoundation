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
}

export interface ChildLetter {
  id: string;
  donorName: string;
  donorEmail: string;
  childId: string;
  childName: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'flagged';
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
}

export interface NewsMilestoneItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  publishedAt: string;
  author: string;
}

export const CHILDREN_STORAGE_KEY = 'gcc_foundation_children_cms';
export const LETTERS_STORAGE_KEY = 'gcc_foundation_child_letters';
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
    sponsorName: 'Sarah M. (London, UK)',
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
  },
  {
    id: 'news-02',
    title: 'Soroti Solar Borehole Reaches 110m Aquifer Depth',
    category: 'Clean Water Update',
    summary: 'Tranche 2 engineering inspection passed; 24-hour pump yield test scheduled for this week.',
    publishedAt: '14 Nov 2026',
    author: 'Eng. Francis Opio, PE',
  },
];
