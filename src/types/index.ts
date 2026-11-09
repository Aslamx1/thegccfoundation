export type CurrencyCode = 'UGX' | 'KES' | 'USD';

export interface ExchangeRates {
  UGX: number; // Base (1 USD = 3750 UGX)
  KES: number; // 1 USD = 130 KES
  USD: number; // 1 USD = 1 USD
}

export type Category = 
  | 'All'
  | 'Medical Care'
  | 'Education & Tuition'
  | 'Clean Water Wells'
  | 'Emergency Relief'
  | 'Rural Agriculture'
  | 'Community Infrastructure';

export interface ExpenseItem {
  id: string;
  item: string;
  category: string;
  amountUGX: number;
  recipientEntity: string;
  status: 'Estimated' | 'Disbursed' | 'Verified Paid';
  receiptUrl?: string;
  invoiceNumber?: string;
  disbursementDate?: string;
}

export interface FieldUpdate {
  id: string;
  date: string;
  title: string;
  authorName: string;
  authorRole: string;
  content: string;
  imageUrl?: string;
  receiptUrl?: string;
  verifiedByOfficer: string;
  disbursedAmountUGX?: number;
}

export interface DonorRecord {
  id: string;
  name: string;
  amountUGX: number;
  currencyPaid: CurrencyCode;
  amountInOriginalCurrency: number;
  timestamp: string;
  message?: string;
  isAnonymous?: boolean;
  paymentMethod: 'MTN Mobile Money' | 'Airtel Money' | 'M-Pesa' | 'Visa / Card' | 'PayPal';
  isRecurringMonthly?: boolean;
}

export interface VolunteerPledge {
  id: string;
  supporterName: string;
  phoneOrEmail: string;
  pledgeType: 'Physical Supplies' | 'Professional Skills' | 'Manual Labor';
  description: string;
  datePledged: string;
  status: 'Pending Contact' | 'Accepted' | 'Fulfilled';
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: Category;
  location: {
    district: string;
    subCounty: string;
    country: string;
    facilityName?: string;
  };
  goalUGX: number;
  raisedUGX: number;
  donorCount: number;
  daysRemaining: number;
  createdAt: string;
  urgent: boolean;
  featured: boolean;
  coverImage: string;
  galleryImages: {
    url: string;
    caption: string;
    dateStamp: string;
    capturedBy: string;
  }[];
  payoutVerification: {
    type: 'Direct-to-Hospital' | 'Direct-to-School' | 'Direct-to-Contractor' | 'Vetted Trustee';
    institutionName: string;
    accountNumberMasked: string;
    bankName: string;
    verificationReference: string;
    complianceOfficer: string;
  };
  organizer: {
    name: string;
    role: string;
    ninOrIdMasked: string; // National Identification Number
    verifiedBadge: boolean;
    relationshipToBeneficiary: string;
    phoneMasked: string;
    avatarUrl: string;
    residence: string;
  };
  beneficiary: {
    name: string;
    age?: number;
    storySummary: string;
    hospitalOrSchoolRef?: string;
  };
  fullStoryHtml: string[];
  itemizedBudget: ExpenseItem[];
  fieldUpdates: FieldUpdate[];
  recentDonors: DonorRecord[];
  volunteerPledges: VolunteerPledge[];
}

export interface TeamMember {
  name: string;
  role: string;
  department: string;
  bio: string;
  location: string;
  image: string;
  credentials: string;
  linkedinOrEmail: string;
}
