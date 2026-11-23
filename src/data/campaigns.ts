import { Campaign, TeamMember } from '@/types';

/**
 * Verified Foundation Campaigns
 * 
 * Real campaigns are uploaded and managed by GCC Foundation admins
 * through the administrative dashboard with custom goals and multi-currency support.
 */
export const CAMPAIGNS_DATA: Campaign[] = [];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Kyagulanyi Mesach',
    role: 'Foundation Manager & Co-Founder',
    department: 'Leadership & Community Outreach',
    bio: 'Leads GCC Foundation operations, youth mentorship, and community talent programs in Ndejje, Kampala, supporting vulnerable children with shelter, education, and social development.',
    location: 'Ndejje, Kampala, Uganda',
    credentials: 'GCC Foundation Leadership',
    image: '/images/hero-bg.jpg',
    linkedinOrEmail: 'mkyagulanyimesach@gmail.com',
  },
  {
    name: 'Dr. Arthur Ssekandi, MD, MMED',
    role: 'Medical Review & Clinical Vetting Advisor',
    department: 'Medical Advisory Board',
    bio: 'Consultant surgeon advising on pediatric clinical casework, healthcare referrals, and hospital partner coordination.',
    location: 'Kampala, Uganda',
    credentials: 'MBChB (Makerere), MMed Surgery, Fellow COSECSA',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    linkedinOrEmail: 'mkyagulanyimesach@gmail.com',
  },
  {
    name: 'Sarah Nakitto',
    role: 'Community Field & Welfare Officer',
    department: 'Field Verification Network',
    bio: 'Coordinates community family visits, welfare outreach, and school enrollment follow-ups for children in the community.',
    location: 'Kampala, Uganda',
    credentials: 'BA Social Work & Social Administration',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    linkedinOrEmail: 'mkyagulanyimesach@gmail.com',
  },
];

export const GCC_INSTITUTIONAL_STATS = {
  totalDisbursedUGX: 0,
  verifiedCampaignsCount: 0,
  averagePayoutTimeHours: 0,
  directInstitutionPayoutRate: '100%',
  antiFraudAuditsCompleted: 0,
  zeroFeePolicy: '0% platform fee to charities',
};
