-- ==============================================================================
-- GCC FOUNDATION - SUPABASE ADMIN & CORE NGO PRODUCTION SCHEMA
-- ==============================================================================
-- Includes all required tables, constraints, functions, RLS policies, and Storage buckets.

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. User Profiles Table (`public.profiles`)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    name text not null,
    role text not null default 'donor' check (role in ('admin', 'finance_manager', 'program_coordinator', 'donor', 'volunteer', 'user')),
    phone text,
    location text,
    avatar_url text,
    is_active boolean not null default true,
    giving_total numeric(12,2) not null default 0.00,
    giving_count integer not null default 0,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Index for role lookup and fast search
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);

-- Trigger to auto-create profile on Supabase auth.users sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'donor'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper function to check if the current user has administrative permissions
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  if auth.uid() is null then
    return false;
  end if;
  
  select role into user_role from public.profiles where id = auth.uid();
  return user_role in ('admin', 'finance_manager', 'program_coordinator');
end;
$$ language plpgsql security definer stable;

-- ------------------------------------------------------------------------------
-- 3. Child Sponsorship CMS (`public.sponsored_children`)
-- ------------------------------------------------------------------------------
create table if not exists public.sponsored_children (
    id uuid primary key default uuid_generate_v4(),
    first_name text not null,
    last_name text,
    age integer not null check (age >= 1 and age <= 25),
    gender text not null check (gender in ('Boy', 'Girl')),
    location text not null,
    region text not null default 'Uganda',
    school_and_grade text not null,
    bio text not null,
    aspirations text not null,
    monthly_amount numeric(10,2) not null default 35.00,
    currency text not null default 'USD',
    portrait_url text not null,
    status text not null default 'available' check (status in ('available', 'sponsored', 'graduated', 'on_hold')),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_children_status on public.sponsored_children(status);

-- ------------------------------------------------------------------------------
-- 4. Active Sponsorships (`public.sponsorships`)
-- ------------------------------------------------------------------------------
create table if not exists public.sponsorships (
    id uuid primary key default uuid_generate_v4(),
    child_id uuid not null references public.sponsored_children(id) on delete cascade,
    sponsor_id uuid references public.profiles(id) on delete set null,
    sponsor_name text not null,
    sponsor_email text not null,
    monthly_amount numeric(10,2) not null default 35.00,
    currency text not null default 'USD',
    status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
    started_at timestamptz not null default timezone('utc'::text, now()),
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- Crucial: Prevent duplicate active sponsorships for the same child
create unique index if not exists unique_active_child_sponsorship 
on public.sponsorships(child_id) 
where status = 'active';

create index if not exists idx_sponsorships_sponsor on public.sponsorships(sponsor_id);

-- ------------------------------------------------------------------------------
-- 5. Letter & Message Queue (`public.sponsorship_messages`)
-- ------------------------------------------------------------------------------
create table if not exists public.sponsorship_messages (
    id uuid primary key default uuid_generate_v4(),
    sponsorship_id uuid references public.sponsorships(id) on delete set null,
    child_id uuid not null references public.sponsored_children(id) on delete cascade,
    sender_id uuid references public.profiles(id) on delete set null,
    sender_name text not null,
    sender_email text not null,
    original_content text not null,
    moderated_content text,
    moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected')),
    moderation_notes text,
    reviewed_by uuid references public.profiles(id) on delete set null,
    reviewed_at timestamptz,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_messages_status on public.sponsorship_messages(moderation_status);
create index if not exists idx_messages_child on public.sponsorship_messages(child_id);

-- ------------------------------------------------------------------------------
-- 6. Field Reports & Progress Updates (`public.field_reports`)
-- ------------------------------------------------------------------------------
create table if not exists public.field_reports (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    document_type text not null check (document_type in ('Report Card', 'Medical Checkup', 'Field Photo', 'Annual Progress', 'Project Milestone', 'Other')),
    target_type text not null check (target_type in ('child', 'project', 'campaign')),
    target_id uuid not null,
    target_name text not null,
    term_or_period text not null,
    notes text,
    file_url text not null,
    file_name text not null,
    file_size_bytes bigint,
    uploaded_by text not null default 'Staff Admin',
    created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_field_reports_target on public.field_reports(target_type, target_id);

-- ------------------------------------------------------------------------------
-- 7. Campaigns & Impact Feeds (`public.campaigns` and `public.campaign_updates`)
-- ------------------------------------------------------------------------------
create table if not exists public.campaigns (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text not null unique,
    category text not null,
    story text not null,
    goal_amount numeric(12,2) not null,
    raised_amount numeric(12,2) not null default 0.00,
    currency text not null default 'USD',
    banner_url text not null,
    status text not null default 'active' check (status in ('active', 'draft', 'paused', 'completed')),
    is_featured boolean not null default false,
    donor_count integer not null default 0,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.campaign_updates (
    id uuid primary key default uuid_generate_v4(),
    campaign_id uuid not null references public.campaigns(id) on delete cascade,
    title text not null,
    content text not null,
    milestone_type text not null default 'Project Update',
    image_url text,
    author_name text not null default 'Foundation Staff',
    created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_campaign_updates_cid on public.campaign_updates(campaign_id);

-- ------------------------------------------------------------------------------
-- 8. Peer-to-Peer Fundraisers (`public.user_fundraisers`)
-- ------------------------------------------------------------------------------
create table if not exists public.user_fundraisers (
    id uuid primary key default uuid_generate_v4(),
    creator_id uuid references public.profiles(id) on delete set null,
    creator_name text not null,
    creator_email text not null,
    title text not null,
    goal_amount numeric(12,2) not null,
    raised_amount numeric(12,2) not null default 0.00,
    currency text not null default 'USD',
    story text not null,
    banner_url text,
    status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected', 'active', 'completed')),
    rejection_reason text,
    is_featured boolean not null default false,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_user_fundraisers_status on public.user_fundraisers(status);

-- ------------------------------------------------------------------------------
-- 9. Donations & Financial Ledger (`public.donations`)
-- ------------------------------------------------------------------------------
create table if not exists public.donations (
    id uuid primary key default uuid_generate_v4(),
    campaign_id uuid references public.campaigns(id) on delete set null,
    campaign_title text,
    donor_id uuid references public.profiles(id) on delete set null,
    donor_name text not null,
    donor_email text not null,
    amount numeric(12,2) not null,
    currency text not null default 'USD',
    entry_type text not null default 'online' check (entry_type in ('online', 'offline')),
    payment_method text not null, -- 'Stripe Card', 'MTN Mobile Money', 'Airtel Money', 'Direct Bank Wire (EFT)', 'Cash'
    payment_status text not null default 'succeeded' check (payment_status in ('succeeded', 'pending', 'failed', 'refunded')),
    reference_code text,
    notes text,
    receipt_status text not null default 'sent' check (receipt_status in ('sent', 'pending', 'failed', 'not_applicable')),
    receipt_number text unique,
    receipt_url text,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_donations_created_at on public.donations(created_at desc);
create index if not exists idx_donations_status on public.donations(payment_status);
create index if not exists idx_donations_donor_email on public.donations(donor_email);

-- Trigger to update campaign total and donor count upon succeeded donation
create or replace function public.sync_donation_totals()
returns trigger as $$
begin
  if (new.payment_status = 'succeeded' and (tg_op = 'INSERT' or old.payment_status != 'succeeded')) then
    if new.campaign_id is not null then
      update public.campaigns
      set 
        raised_amount = raised_amount + new.amount,
        donor_count = donor_count + 1,
        updated_at = timezone('utc'::text, now())
      where id = new.campaign_id;
    end if;

    if new.donor_id is not null then
      update public.profiles
      set 
        giving_total = giving_total + new.amount,
        giving_count = giving_count + 1,
        updated_at = timezone('utc'::text, now())
      where id = new.donor_id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_donation_insert_sync on public.donations;
create trigger on_donation_insert_sync
  after insert or update on public.donations
  for each row execute function public.sync_donation_totals();

-- ------------------------------------------------------------------------------
-- 10. Events & Volunteer Management (`public.events`, `public.volunteer_logs`)
-- ------------------------------------------------------------------------------
create table if not exists public.events (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    event_date timestamptz not null,
    location text not null,
    capacity integer not null default 50,
    registered_count integer not null default 0,
    status text not null default 'upcoming' check (status in ('upcoming', 'in_progress', 'completed', 'cancelled')),
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.volunteer_logs (
    id uuid primary key default uuid_generate_v4(),
    volunteer_name text not null,
    volunteer_email text not null,
    event_id uuid references public.events(id) on delete set null,
    activity_name text not null,
    hours_spent numeric(6,2) not null check (hours_spent > 0),
    date_completed date not null default current_date,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 11. Organization Document & System Settings (`public.organization_settings`)
-- ------------------------------------------------------------------------------
create table if not exists public.organization_settings (
    id text primary key default 'primary',
    ngo_name text not null default 'GCC Foundation',
    registration_number text not null default 'NGO-REG/UG/2022/8941',
    physical_address text not null default 'Plot 14, Jinja Road, Kampala, Uganda',
    tax_id text default 'TIN-99482104-E',
    official_email text not null default 'contact@thegccfoundation.org',
    official_phone text default '+256 700 123 456',
    receipt_stamp_url text default '/images/gcc-emblem.png',
    receipt_signature_url text,
    default_currency text not null default 'USD',
    updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Insert default organization settings if not present
insert into public.organization_settings (id, ngo_name, registration_number, physical_address, official_email)
values ('primary', 'GCC Foundation', 'NGO-REG/UG/2022/8941', 'Plot 14, Jinja Road, Kampala, Uganda', 'contact@thegccfoundation.org')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 12. STORAGE BUCKETS CONFIGURATION
-- ------------------------------------------------------------------------------
-- Creates the required storage buckets in Supabase Storage if they do not exist
insert into storage.buckets (id, name, public)
values 
  ('child-portraits', 'child-portraits', true),
  ('campaign-banners', 'campaign-banners', true),
  ('field-reports', 'field-reports', true),
  ('receipts', 'receipts', false),
  ('org-assets', 'org-assets', true)
on conflict (id) do nothing;

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.sponsored_children enable row level security;
alter table public.sponsorships enable row level security;
alter table public.sponsorship_messages enable row level security;
alter table public.field_reports enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_updates enable row level security;
alter table public.user_fundraisers enable row level security;
alter table public.donations enable row level security;
alter table public.events enable row level security;
alter table public.volunteer_logs enable row level security;
alter table public.organization_settings enable row level security;

-- PROFILES
create policy "Admins have full access to profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users can view their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- SPONSORED CHILDREN
create policy "Admins have full access to sponsored children"
on public.sponsored_children for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can view available or sponsored children"
on public.sponsored_children for select
using (status in ('available', 'sponsored'));

-- SPONSORSHIPS
create policy "Admins have full access to sponsorships"
on public.sponsorships for all
using (public.is_admin())
with check (public.is_admin());

create policy "Donors can view their own sponsorships"
on public.sponsorships for select
using (auth.uid() = sponsor_id);

-- SPONSORSHIP MESSAGES / LETTERS
create policy "Admins have full access to sponsorship messages"
on public.sponsorship_messages for all
using (public.is_admin())
with check (public.is_admin());

create policy "Donors can view their own sent messages"
on public.sponsorship_messages for select
using (auth.uid() = sender_id);

create policy "Donors can insert letters to their sponsored child"
on public.sponsorship_messages for insert
with check (auth.uid() = sender_id or sender_id is null);

-- FIELD REPORTS
create policy "Admins have full access to field reports"
on public.field_reports for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can view non-restricted field reports"
on public.field_reports for select
using (true);

-- CAMPAIGNS & UPDATES
create policy "Admins have full access to campaigns"
on public.campaigns for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can view active campaigns"
on public.campaigns for select
using (status in ('active', 'completed'));

create policy "Admins have full access to campaign updates"
on public.campaign_updates for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can view campaign updates"
on public.campaign_updates for select
using (true);

-- USER FUNDRAISERS
create policy "Admins have full access to user fundraisers"
on public.user_fundraisers for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users can create and view their own fundraisers"
on public.user_fundraisers for all
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

create policy "Public can view approved fundraisers"
on public.user_fundraisers for select
using (status in ('approved', 'active', 'completed'));

-- DONATIONS & LEDGER
create policy "Admins have full access to donations"
on public.donations for all
using (public.is_admin())
with check (public.is_admin());

create policy "Donors can view their own donations"
on public.donations for select
using (auth.uid() = donor_id or donor_email = (select email from auth.users where id = auth.uid()));

create policy "Public can insert donations"
on public.donations for insert
with check (true);

-- EVENTS & VOLUNTEERS
create policy "Admins have full access to events"
on public.events for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can view upcoming events"
on public.events for select
using (true);

create policy "Admins have full access to volunteer logs"
on public.volunteer_logs for all
using (public.is_admin())
with check (public.is_admin());

create policy "Volunteers can log their hours"
on public.volunteer_logs for insert
with check (true);

-- ORGANIZATION SETTINGS
create policy "Admins can update organization settings"
on public.organization_settings for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public can view organization settings"
on public.organization_settings for select
using (true);

-- ------------------------------------------------------------------------------
-- 14. STORAGE POLICIES
-- ------------------------------------------------------------------------------
-- Child portraits bucket
create policy "Public can view child portraits"
on storage.objects for select
using (bucket_id = 'child-portraits');

create policy "Admins can upload and manage child portraits"
on storage.objects for all
using (bucket_id = 'child-portraits' and public.is_admin())
with check (bucket_id = 'child-portraits' and public.is_admin());

-- Campaign banners bucket
create policy "Public can view campaign banners"
on storage.objects for select
using (bucket_id = 'campaign-banners');

create policy "Admins can upload campaign banners"
on storage.objects for all
using (bucket_id = 'campaign-banners' and public.is_admin())
with check (bucket_id = 'campaign-banners' and public.is_admin());

-- Field reports bucket
create policy "Public can view field reports"
on storage.objects for select
using (bucket_id = 'field-reports');

create policy "Admins can manage field reports storage"
on storage.objects for all
using (bucket_id = 'field-reports' and public.is_admin())
with check (bucket_id = 'field-reports' and public.is_admin());

-- Org assets bucket
create policy "Public can view org assets"
on storage.objects for select
using (bucket_id = 'org-assets');

create policy "Admins can upload org assets"
on storage.objects for all
using (bucket_id = 'org-assets' and public.is_admin())
with check (bucket_id = 'org-assets' and public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. Authentication & Session Audit Logs (`public.auth_audit_logs`)
-- ------------------------------------------------------------------------------
create table if not exists public.auth_audit_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id text,
    user_name text not null,
    user_email text not null,
    action text not null check (action in ('signup', 'login', 'logout')),
    ip_address text,
    user_agent text,
    status text not null default 'success' check (status in ('success', 'failed')),
    details text,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_auth_logs_created_at on public.auth_audit_logs(created_at desc);
create index if not exists idx_auth_logs_user_email on public.auth_audit_logs(user_email);
create index if not exists idx_auth_logs_action on public.auth_audit_logs(action);

alter table public.auth_audit_logs enable row level security;

create policy "Admins can view auth audit logs"
on public.auth_audit_logs for select
to authenticated
using (public.is_admin());

create policy "Service or app can insert auth audit logs"
on public.auth_audit_logs for insert
to anon, authenticated
with check (true);
