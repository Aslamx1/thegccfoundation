export type UserRole = 'admin' | 'finance_manager' | 'program_coordinator' | 'donor' | 'volunteer' | 'user';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  is_active: boolean;
  is_verified?: boolean;
  giving_total: number;
  giving_count: number;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string | null;
}

export interface SponsoredChild {
  id: string;
  first_name: string;
  last_name?: string | null;
  age: number;
  gender: 'Boy' | 'Girl';
  location: string;
  region: string;
  school_and_grade: string;
  bio: string;
  aspirations: string;
  monthly_amount: number;
  currency: string;
  portrait_url: string;
  status: 'available' | 'sponsored' | 'graduated' | 'on_hold';
  category?: 'Medical' | 'Education' | 'Emergency' | 'Community' | string;
  goal_amount?: number;
  created_at: string;
  updated_at?: string;
  active_sponsorship?: Sponsorship | null;
}

export interface Sponsorship {
  id: string;
  child_id: string;
  sponsor_id?: string | null;
  sponsor_name: string;
  sponsor_email: string;
  monthly_amount: number;
  currency: string;
  status: 'active' | 'paused' | 'cancelled';
  started_at: string;
  created_at: string;
  child?: SponsoredChild;
}

export interface SponsorshipMessage {
  id: string;
  sponsorship_id?: string | null;
  child_id: string;
  child_name?: string;
  sender_id?: string | null;
  sender_name: string;
  sender_email: string;
  original_content: string;
  moderated_content?: string | null;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderation_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export interface FieldReport {
  id: string;
  title: string;
  document_type: 'Report Card' | 'Medical Checkup' | 'Field Photo' | 'Annual Progress' | 'Project Milestone' | 'Other';
  target_type: 'child' | 'project' | 'campaign';
  target_id: string;
  target_name: string;
  term_or_period: string;
  notes?: string | null;
  file_url: string;
  file_name: string;
  file_size_bytes?: number | null;
  uploaded_by: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  category: string;
  story: string;
  goal_amount: number;
  raised_amount: number;
  currency: string;
  banner_url: string;
  status: 'active' | 'draft' | 'paused' | 'completed';
  is_featured: boolean;
  donor_count: number;
  created_at: string;
  updated_at?: string;
}

export interface CampaignUpdate {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  milestone_type: string;
  image_url?: string | null;
  author_name: string;
  created_at: string;
}

export interface UserFundraiser {
  id: string;
  creator_id?: string | null;
  creator_name: string;
  creator_email: string;
  title: string;
  goal_amount: number;
  raised_amount: number;
  currency: string;
  story: string;
  banner_url?: string | null;
  status: 'pending_review' | 'approved' | 'rejected' | 'active' | 'completed';
  rejection_reason?: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Donation {
  id: string;
  campaign_id?: string | null;
  campaign_title?: string | null;
  donor_id?: string | null;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  entry_type: 'online' | 'offline';
  payment_method: string;
  payment_status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  reference_code?: string | null;
  notes?: string | null;
  receipt_status: 'sent' | 'pending' | 'failed' | 'not_applicable';
  receipt_number?: string | null;
  receipt_url?: string | null;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  capacity: number;
  registered_count: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface VolunteerLog {
  id: string;
  volunteer_name: string;
  volunteer_email: string;
  event_id?: string | null;
  activity_name: string;
  hours_spent: number;
  date_completed: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface OrgSettings {
  id: string;
  ngo_name: string;
  registration_number: string;
  physical_address: string;
  tax_id?: string | null;
  official_email: string;
  official_phone?: string | null;
  receipt_stamp_url?: string | null;
  receipt_signature_url?: string | null;
  default_currency: string;
  updated_at?: string;
}

export interface DashboardKPIs {
  totalRaisedAllTime: number;
  totalRaisedThisYear: number;
  totalRaisedThisMonth: number;
  activeRecurringDonors: number;
  activeSponsorships: number;
  pendingLetterApprovals: number;
  pendingFundraiserApprovals: number;
  totalRegisteredSupporters: number;
  currency: string;
}

export type AuthActionType = 'signup' | 'login' | 'logout';

export interface AuthAuditLog {
  id: string;
  user_id?: string | null;
  user_name: string;
  user_email: string;
  action: AuthActionType;
  ip_address?: string | null;
  user_agent?: string | null;
  status: 'success' | 'failed';
  details?: string | null;
  created_at: string;
}
