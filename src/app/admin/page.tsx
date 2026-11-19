'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { Campaign, Category } from '@/types';
import { CAMPAIGNS_DATA } from '@/data/campaigns';
import {
  CHILDREN_STORAGE_KEY,
  LETTERS_STORAGE_KEY,
  FIELD_UPDATES_STORAGE_KEY,
  LEDGER_STORAGE_KEY,
  DONORS_STORAGE_KEY,
  NEWS_STORAGE_KEY,
  DEFAULT_CHILDREN,
  DEFAULT_LETTERS,
  DEFAULT_FIELD_UPDATES,
  DEFAULT_LEDGER,
  DEFAULT_DONORS,
  DEFAULT_NEWS,
  ChildProfile,
  ChildLetter,
  FieldUpdateUpload,
  LedgerTransaction,
  DonorDirectoryEntry,
  NewsMilestoneItem,
} from '@/data/ngo-portal';
import {
  LayoutDashboard,
  HeartHandshake,
  MailCheck,
  DollarSign,
  Users,
  Megaphone,
  Search,
  Plus,
  CheckCircle2,
  ExternalLink,
  Download,
  Edit3,
  Upload,
  Check,
  X,
  FileSpreadsheet,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Receipt,
  FolderUp,
  LogOut,
  Globe,
  Activity,
  Filter,
  ShieldCheck,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  Printer,
  Eye,
  FileText,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Coins,
  Send,
  Building,
  GraduationCap,
  MapPin,
  Heart,
  BadgeCheck,
  Compass,
} from 'lucide-react';

const CAMPAIGNS_STORAGE_KEY = 'gcc_foundation_admin_campaigns';

type AdminTab =
  | 'command'
  | 'children'
  | 'letters'
  | 'financials'
  | 'donors'
  | 'campaigns';

interface PayoutRow {
  id: string;
  campaignTitle: string;
  institution: string;
  bankAccount: string;
  amountUGX: number;
  status: 'Pending Review' | 'Approved' | 'Settled via EFT';
  date: string;
}

const INITIAL_PAYOUTS: PayoutRow[] = [
  {
    id: 'PAY-2026-401',
    campaignTitle: 'Emergency Open-Heart Surgery for 6-Year-Old Brenda',
    institution: 'Uganda Heart Institute Accounts Treasury',
    bankAccount: 'Stanbic Bank A/C •••• 8841',
    amountUGX: 4450000,
    status: 'Settled via EFT',
    date: '17 Nov 2026',
  },
  {
    id: 'PAY-2026-402',
    campaignTitle: 'Solar-Powered Borehole for 420 Households in Gweri',
    institution: 'Teso Hydro-Drill Engineering Services Ltd',
    bankAccount: 'Centenary Bank A/C •••• 1092',
    amountUGX: 8200000,
    status: 'Pending Review',
    date: '18 Nov 2026',
  },
  {
    id: 'PAY-2026-403',
    campaignTitle: 'Secondary School Tuition for 38 Displaced Girls',
    institution: "St. Peter's Secondary School Bursar Account",
    bankAccount: 'DFCU Bank A/C •••• 7741',
    amountUGX: 5400000,
    status: 'Approved',
    date: '18 Nov 2026',
  },
];

export default function AdminDashboardPage() {
  const { currency, setCurrency, formatUGX } = useCurrency();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('command');
  const [adminToast, setAdminToast] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const notify = (msg: string) => {
    setAdminToast(msg);
    window.setTimeout(() => setAdminToast(''), 4500);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // =========================================================================
  // STATE MANAGEMENT WITH REAL LOCALSTORAGE PERSISTENCE & API SYNC
  // =========================================================================

  // 1. Children CMS State
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CHILDREN_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_CHILDREN;
  });

  const [childFilter, setChildFilter] = useState<'all' | 'available' | 'sponsored'>('all');
  const [childSearch, setChildSearch] = useState('');
  const [showChildModal, setShowChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);

  // Child Form State
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('9');
  const [childGender, setChildGender] = useState<'Girl' | 'Boy'>('Girl');
  const [childDistrict, setChildDistrict] = useState('');
  const [childSchool, setChildSchool] = useState('');
  const [childMonthlyUSD, setChildMonthlyUSD] = useState('35');
  const [childBio, setChildBio] = useState('');
  const [childDream, setChildDream] = useState('');
  const [childPhotoUrl, setChildPhotoUrl] = useState('');
  const [childStatus, setChildStatus] = useState<'available' | 'sponsored'>('available');
  const [childSponsorName, setChildSponsorName] = useState('');
  const [childSponsorEmail, setChildSponsorEmail] = useState('');
  const [childFormError, setChildFormError] = useState('');

  // 2. Letters & Moderation State
  const [letters, setLetters] = useState<ChildLetter[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LETTERS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_LETTERS;
  });

  const [letterFilter, setLetterFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [lettersSubTab, setLettersSubTab] = useState<'letters' | 'field-uploads'>('letters');
  const [editingLetter, setEditingLetter] = useState<ChildLetter | null>(null);
  const [editingLetterText, setEditingLetterText] = useState('');

  // Field Updates State
  const [fieldUploads, setFieldUploads] = useState<FieldUpdateUpload[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(FIELD_UPDATES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_FIELD_UPDATES;
  });

  const [showFieldUploadModal, setShowFieldUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState<FieldUpdateUpload['documentType']>('Termly Report Card');
  const [uploadTargetType, setUploadTargetType] = useState<'child' | 'project'>('child');
  const [uploadTargetId, setUploadTargetId] = useState('');
  const [uploadTerm, setUploadTerm] = useState('Term 3 · 2026');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadAttachmentUrl, setUploadAttachmentUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  // 3. Donation & Financial Records (Global Giving Ledger)
  const [ledger, setLedger] = useState<LedgerTransaction[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LEDGER_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_LEDGER;
  });

  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerMethodFilter, setLedgerMethodFilter] = useState('All');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState('All');
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<LedgerTransaction | null>(null);

  // Manual Offline Entry Form State
  const [manualDonorName, setManualDonorName] = useState('');
  const [manualDonorEmail, setManualDonorEmail] = useState('');
  const [manualCampaignId, setManualCampaignId] = useState('');
  const [manualAmountUGX, setManualAmountUGX] = useState('500000');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<LedgerTransaction['paymentMethod']>('Offline Cash Receipt');
  const [manualEntryType, setManualEntryType] = useState<LedgerTransaction['entryType']>('Manual Offline Entry');
  const [manualReferenceCode, setManualReferenceCode] = useState('');
  const [manualNotes, setManualNotes] = useState('');

  // 4. Donor & Member Directory
  const [donors, setDonors] = useState<DonorDirectoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(DONORS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_DONORS;
  });

  const [donorSearch, setDonorSearch] = useState('');
  const [donorRoleFilter, setDonorRoleFilter] = useState('All');
  const [donorStatusFilter, setDonorStatusFilter] = useState('All');
  const [editingDonor, setEditingDonor] = useState<DonorDirectoryEntry | null>(null);
  const [donorNameEdit, setDonorNameEdit] = useState('');
  const [donorEmailEdit, setDonorEmailEdit] = useState('');
  const [donorPhoneEdit, setDonorPhoneEdit] = useState('');
  const [donorAddressEdit, setDonorAddressEdit] = useState('');

  // 5. Campaigns & Content Manager
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return CAMPAIGNS_DATA;
  });

  const [campaignsSubTab, setCampaignsSubTab] = useState<'projects' | 'updates'>('projects');
  const [newsList, setNewsList] = useState<NewsMilestoneItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(NEWS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_NEWS;
  });

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campTitle, setCampTitle] = useState('');
  const [campSubtitle, setCampSubtitle] = useState('');
  const [campCategory, setCampCategory] = useState<Category>('Medical Care');
  const [campDistrict, setCampDistrict] = useState('');
  const [campInstitution, setCampInstitution] = useState('');
  const [campGoalUGX, setCampGoalUGX] = useState('15000000');
  const [campCoverImage, setCampCoverImage] = useState('');
  const [campStory, setCampStory] = useState('');

  // News Publisher State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Project Milestone');
  const [newsCampaignId, setNewsCampaignId] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsSummary, setNewsSummary] = useState('');

  // Payouts State
  const [payouts, setPayouts] = useState<PayoutRow[]>(INITIAL_PAYOUTS);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(childrenList));
    } catch {}
  }, [childrenList]);

  useEffect(() => {
    try {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(letters));
    } catch {}
  }, [letters]);

  useEffect(() => {
    try {
      localStorage.setItem(FIELD_UPDATES_STORAGE_KEY, JSON.stringify(fieldUploads));
    } catch {}
  }, [fieldUploads]);

  useEffect(() => {
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
    } catch {}
  }, [ledger]);

  useEffect(() => {
    try {
      localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(donors));
    } catch {}
  }, [donors]);

  useEffect(() => {
    try {
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(newsList));
    } catch {}
  }, [newsList]);

  useEffect(() => {
    try {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
    } catch {}
  }, [campaigns]);

  // Try background sync with API if logged in, without blocking or wiping real local data
  useEffect(() => {
    let cancelled = false;
    async function trySync() {
      try {
        const [childrenRes, lettersRes, updatesRes, supportersRes, txRes] = await Promise.allSettled([
          fetch('/api/admin/children', { credentials: 'include' }),
          fetch('/api/admin/letters', { credentials: 'include' }),
          fetch('/api/admin/field-updates', { credentials: 'include' }),
          fetch('/api/admin/supporters', { credentials: 'include' }),
          fetch('/api/admin/transactions', { credentials: 'include' }),
        ]);

        if (cancelled) return;

        if (childrenRes.status === 'fulfilled' && childrenRes.value.ok) {
          const data: any = await childrenRes.value.json();
          if (Array.isArray(data.children) && data.children.length > 0) {
            setChildrenList(data.children);
          }
        }

        if (lettersRes.status === 'fulfilled' && lettersRes.value.ok) {
          const data: any = await lettersRes.value.json();
          if (Array.isArray(data.letters) && data.letters.length > 0) {
            setLetters(data.letters);
          }
        }

        if (updatesRes.status === 'fulfilled' && updatesRes.value.ok) {
          const data: any = await updatesRes.value.json();
          if (Array.isArray(data.updates) && data.updates.length > 0) {
            setFieldUploads(data.updates);
          }
        }
      } catch {
        // Silently preserve offline/local state
      }
    }
    void trySync();
    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================================
  // FINANCIAL CALCULATIONS & METRICS
  // =========================================================================

  const totalFundsMonthUGX = useMemo(() => {
    return ledger
      .filter((tx) => tx.monthTag === 'this-month')
      .reduce((sum, tx) => sum + (tx.amountUGX || 0), 0);
  }, [ledger]);

  const totalFundsYearUGX = useMemo(() => {
    return ledger
      .filter((tx) => tx.monthTag === 'this-month' || tx.monthTag === 'this-year')
      .reduce((sum, tx) => sum + (tx.amountUGX || 0), 0);
  }, [ledger]);

  const totalFundsAllTimeUGX = useMemo(() => {
    return ledger.reduce((sum, tx) => sum + (tx.amountUGX || 0), 0);
  }, [ledger]);

  const activeMonthlyRecurringDonors = useMemo(() => {
    return donors.filter(
      (d) =>
        d.accountStatus !== 'deactivated' &&
        (d.recurringPlan.toLowerCase().includes('monthly') ||
          d.recurringPlan.toLowerCase().includes('sponsor'))
    ).length;
  }, [donors]);

  const activeSponsorshipsCount = useMemo(() => {
    return childrenList.filter((c) => c.status === 'sponsored').length;
  }, [childrenList]);

  const pendingLettersCount = useMemo(() => {
    return letters.filter((l) => l.status === 'pending').length;
  }, [letters]);

  // Format Helper for Currency (UGX / USD)
  const formatAmount = (amountUGX: number) => {
    if (currency === 'USD') {
      const usd = Math.round(amountUGX / 3750);
      return `$${usd.toLocaleString()}`;
    }
    return formatUGX(amountUGX);
  };

  // Convert minor or major units for transactions
  const formatTransactionAmount = (tx: LedgerTransaction) => {
    if (tx.amountUGX) {
      return formatAmount(tx.amountUGX);
    }
    if (tx.amountMinor) {
      const ugx = tx.amountMinor / 100;
      return formatAmount(ugx);
    }
    return 'UGX 0';
  };

  // =========================================================================
  // FILTERED LISTS
  // =========================================================================

  const filteredChildren = useMemo(() => {
    const q = childSearch.trim().toLowerCase();
    return childrenList.filter((child) => {
      if (childFilter !== 'all' && child.status !== childFilter) return false;
      if (!q) return true;
      return (
        child.name.toLowerCase().includes(q) ||
        child.district.toLowerCase().includes(q) ||
        child.schoolAndGrade.toLowerCase().includes(q) ||
        (child.sponsorName && child.sponsorName.toLowerCase().includes(q))
      );
    });
  }, [childrenList, childFilter, childSearch]);

  const filteredLetters = useMemo(() => {
    const sorted = [...letters].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    });
    if (letterFilter === 'all') return sorted;
    return sorted.filter((l) => l.status === letterFilter);
  }, [letters, letterFilter]);

  const filteredLedger = useMemo(() => {
    const q = ledgerSearch.trim().toLowerCase();
    return ledger.filter((tx) => {
      if (ledgerMethodFilter !== 'All' && tx.paymentMethod !== ledgerMethodFilter) return false;
      if (ledgerTypeFilter !== 'All' && tx.entryType !== ledgerTypeFilter) return false;
      if (!q) return true;
      return (
        tx.donorName.toLowerCase().includes(q) ||
        tx.donorEmail.toLowerCase().includes(q) ||
        tx.campaignTitle.toLowerCase().includes(q) ||
        tx.receiptNumber.toLowerCase().includes(q) ||
        tx.referenceCode.toLowerCase().includes(q)
      );
    });
  }, [ledger, ledgerSearch, ledgerMethodFilter, ledgerTypeFilter]);

  const filteredDonors = useMemo(() => {
    const q = donorSearch.trim().toLowerCase();
    return donors.filter((d) => {
      if (donorRoleFilter !== 'All' && d.role !== donorRoleFilter.toLowerCase()) return false;
      if (donorStatusFilter !== 'All' && d.accountStatus !== donorStatusFilter.toLowerCase()) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.recurringPlan.toLowerCase().includes(q)
      );
    });
  }, [donors, donorSearch, donorRoleFilter, donorStatusFilter]);

  // =========================================================================
  // ACTION HANDLERS: SECTION 1 (COMMAND CENTER SHORTCUTS)
  // =========================================================================

  const handleQuickAddChild = () => {
    openAddChildModal();
    setActiveTab('children');
  };

  const handleQuickPublishUpdate = () => {
    setCampaignsSubTab('updates');
    setActiveTab('campaigns');
  };

  const handleQuickReviewLetters = () => {
    setLetterFilter('pending');
    setLettersSubTab('letters');
    setActiveTab('letters');
  };

  const handleQuickLogOffline = () => {
    setShowManualEntryModal(true);
    setActiveTab('financials');
  };

  // =========================================================================
  // ACTION HANDLERS: SECTION 2 (CHILD SPONSORSHIP CMS)
  // =========================================================================

  const openAddChildModal = () => {
    setEditingChild(null);
    setChildName('');
    setChildAge('9');
    setChildGender('Girl');
    setChildDistrict('Soroti District, Uganda');
    setChildSchool('St. Mary’s Community Primary · Primary 4');
    setChildMonthlyUSD('35');
    setChildBio('Eager young student passionate about learning, science, and community leadership.');
    setChildDream('Wants to become a pediatric physician & surgeon');
    setChildPhotoUrl('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80');
    setChildStatus('available');
    setChildSponsorName('');
    setChildSponsorEmail('');
    setChildFormError('');
    setShowChildModal(true);
  };

  const openEditChildModal = (child: ChildProfile) => {
    setEditingChild(child);
    setChildName(child.name);
    setChildAge(String(child.age));
    setChildGender(child.gender);
    setChildDistrict(child.district);
    setChildSchool(child.schoolAndGrade);
    setChildMonthlyUSD(String(child.monthlySponsorshipUSD));
    setChildBio(child.bio);
    setChildDream(child.dream);
    setChildPhotoUrl(child.photoUrl);
    setChildStatus(child.status);
    setChildSponsorName(child.sponsorName || '');
    setChildSponsorEmail(child.sponsorEmail || '');
    setChildFormError('');
    setShowChildModal(true);
  };

  const handleSaveChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      setChildFormError('Please provide the child’s full name.');
      return;
    }
    if (childStatus === 'sponsored' && (!childSponsorName.trim() || !childSponsorEmail.trim())) {
      setChildFormError('A sponsored child must have a linked sponsor name and email address.');
      return;
    }

    // Single-sponsorship lock check
    if (
      editingChild &&
      editingChild.status === 'sponsored' &&
      childStatus === 'sponsored' &&
      editingChild.sponsorEmail !== childSponsorEmail.trim()
    ) {
      if (
        !window.confirm(
          `SPONSORSHIP LOCK NOTICE: ${editingChild.name} is currently sponsored by ${editingChild.sponsorName} (${editingChild.sponsorEmail}). Are you sure you want to reassign this child to ${childSponsorName.trim()}?`
        )
      ) {
        return;
      }
    }

    const payload: ChildProfile = {
      id: editingChild ? editingChild.id : `child-${Date.now().toString().slice(-4)}`,
      name: childName.trim(),
      age: Number(childAge) || 9,
      gender: childGender,
      district: childDistrict.trim(),
      schoolAndGrade: childSchool.trim(),
      monthlySponsorshipUSD: Number(childMonthlyUSD) || 35,
      bio: childBio.trim(),
      dream: childDream.trim(),
      photoUrl:
        childPhotoUrl.trim() ||
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      status: childStatus,
      sponsorName: childStatus === 'sponsored' ? childSponsorName.trim() : undefined,
      sponsorEmail: childStatus === 'sponsored' ? childSponsorEmail.trim() : undefined,
      sponsoredSince:
        childStatus === 'sponsored'
          ? editingChild?.sponsoredSince || new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
          : undefined,
    };

    if (editingChild) {
      setChildrenList((prev) => prev.map((c) => (c.id === editingChild.id ? payload : c)));
      notify(`Updated child profile for ${payload.name}. Single-sponsorship lock verified.`);
    } else {
      setChildrenList((prev) => [payload, ...prev]);
      notify(`Added new child profile for ${payload.name} to the CMS directory.`);
    }

    // Background sync to server API if available
    try {
      if (editingChild) {
        fetch(`/api/admin/children/${editingChild.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } else {
        fetch('/api/admin/children', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }
    } catch {}

    setShowChildModal(false);
  };

  const handleToggleChildStatus = (child: ChildProfile) => {
    if (child.status === 'sponsored') {
      if (
        window.confirm(
          `Unlink sponsor for ${child.name}? This will mark the child as AVAILABLE and release the sponsorship lock.`
        )
      ) {
        const updated: ChildProfile = {
          ...child,
          status: 'available',
          sponsorName: undefined,
          sponsorEmail: undefined,
          sponsoredSince: undefined,
        };
        setChildrenList((prev) => prev.map((c) => (c.id === child.id ? updated : c)));
        notify(`${child.name} is now AVAILABLE for new sponsorship.`);
      }
    } else {
      openEditChildModal({ ...child, status: 'sponsored' });
    }
  };

  // =========================================================================
  // ACTION HANDLERS: SECTION 3 (LETTER MODERATION & FIELD UPLOADS)
  // =========================================================================

  const handleApproveLetter = (letter: ChildLetter) => {
    const updated: ChildLetter = {
      ...letter,
      status: 'approved',
    };
    setLetters((prev) => prev.map((l) => (l.id === letter.id ? updated : l)));
    notify(`Approved message from ${letter.donorName} to ${letter.childName}. Delivered to field officer.`);

    try {
      fetch(`/api/admin/letters/${letter.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      }).catch(() => {});
    } catch {}
  };

  const handleRejectLetter = (letter: ChildLetter) => {
    const reason = window.prompt(
      `Reject message from ${letter.donorName}? Enter internal staff reason (e.g. Personal contact info shared / Child protection safeguard violation):`,
      'Child protection safeguard: Contains private external contact details'
    );
    if (!reason) return;

    const updated: ChildLetter = {
      ...letter,
      status: 'rejected',
    };
    setLetters((prev) => prev.map((l) => (l.id === letter.id ? updated : l)));
    notify(`Rejected message from ${letter.donorName}. Flagged for child protection review.`);

    try {
      fetch(`/api/admin/letters/${letter.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      }).catch(() => {});
    } catch {}
  };

  const openEditLetterModal = (letter: ChildLetter) => {
    setEditingLetter(letter);
    setEditingLetterText(letter.message);
  };

  const handleSaveLetterEdit = () => {
    if (!editingLetter || !editingLetterText.trim()) return;
    const updated: ChildLetter = {
      ...editingLetter,
      message: editingLetterText.trim(),
      editedByAdmin: true,
      status: 'approved',
    };
    setLetters((prev) => prev.map((l) => (l.id === editingLetter.id ? updated : l)));
    notify(`Safety edit saved & approved for message to ${editingLetter.childName}.`);

    try {
      fetch(`/api/admin/letters/${editingLetter.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editingLetterText.trim(), status: 'approved' }),
      }).catch(() => {});
    } catch {}

    setEditingLetter(null);
  };

  // Field Uploads Handler
  const handleSaveFieldUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    let targetName = 'Child';
    if (uploadTargetType === 'child') {
      const c = childrenList.find((ch) => ch.id === uploadTargetId);
      targetName = c ? c.name : 'Sponsored Child';
    } else {
      const cp = campaigns.find((camp) => camp.id === uploadTargetId);
      targetName = cp ? cp.title : 'Field Project';
    }

    const newUpload: FieldUpdateUpload = {
      id: `fld-${Date.now().toString().slice(-4)}`,
      title: uploadTitle.trim(),
      documentType: uploadDocType,
      targetType: uploadTargetType,
      targetId: uploadTargetId || (uploadTargetType === 'child' ? childrenList[0]?.id || 'child-01' : campaigns[0]?.id || 'camp-01'),
      targetName,
      termOrPeriod: uploadTerm.trim(),
      notes: uploadNotes.trim() || 'Verified by GCC Foundation Field Desk.',
      attachmentUrl:
        uploadAttachmentUrl.trim() ||
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
      fileName: uploadFileName.trim() || `${uploadTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`,
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploadedBy: user?.name || 'Chief Operations Desk (Staff)',
    };

    setFieldUploads((prev) => [newUpload, ...prev]);
    notify(`Uploaded field record "${newUpload.title}" attached to ${targetName}.`);

    setShowFieldUploadModal(false);
    setUploadTitle('');
    setUploadNotes('');
    setUploadAttachmentUrl('');
    setUploadFileName('');
  };

  // =========================================================================
  // ACTION HANDLERS: SECTION 4 (DONATION & FINANCIAL RECORDS)
  // =========================================================================

  const handleSaveManualOfflineDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDonorName.trim() || !manualDonorEmail.trim() || !manualAmountUGX) return;

    const linkedCamp = campaigns.find((c) => c.id === manualCampaignId) || campaigns[0];
    const amountVal = Number(manualAmountUGX) || 500000;
    const receiptNum = `GCC-RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const refCode = manualReferenceCode.trim() || `VCH-OFFLINE-${Date.now().toString().slice(-6)}`;

    const newTx: LedgerTransaction = {
      id: `tx-manual-${Date.now()}`,
      receiptNumber: receiptNum,
      donorName: manualDonorName.trim(),
      donorEmail: manualDonorEmail.trim(),
      campaignId: linkedCamp.id,
      campaignTitle: linkedCamp.title,
      amountUGX: amountVal,
      paymentMethod: manualPaymentMethod,
      entryType: manualEntryType,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      monthTag: 'this-month',
      referenceCode: refCode,
      notes: manualNotes.trim() || 'Logged via Admin Command Center manual entry desk.',
    };

    // Update Ledger
    setLedger((prev) => [newTx, ...prev]);

    // Update Campaign totals
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === linkedCamp.id
          ? {
              ...c,
              raisedUGX: c.raisedUGX + amountVal,
              donorCount: c.donorCount + 1,
            }
          : c
      )
    );

    // Update Donor Directory
    setDonors((prev) => {
      const existing = prev.find((d) => d.email.toLowerCase() === manualDonorEmail.trim().toLowerCase());
      if (existing) {
        return prev.map((d) =>
          d.id === existing.id
            ? {
                ...d,
                totalDonatedUGX: d.totalDonatedUGX + amountVal,
                donationsCount: d.donationsCount + 1,
              }
            : d
        );
      }
      return [
        {
          id: `dnr-${Date.now().toString().slice(-4)}`,
          name: manualDonorName.trim(),
          email: manualDonorEmail.trim(),
          phone: '+256 700 000 000',
          address: 'Kampala, Uganda',
          totalDonatedUGX: amountVal,
          donationsCount: 1,
          recurringPlan: 'One-Time Supporter',
          joinedDate: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
          role: 'user',
          accountStatus: 'active',
        },
        ...prev,
      ];
    });

    notify(`Logged offline donation of ${formatAmount(amountVal)} from ${manualDonorName.trim()}. Receipt ${receiptNum} issued.`);
    setShowManualEntryModal(false);
    setSelectedReceiptTx(newTx);

    // Reset Form
    setManualDonorName('');
    setManualDonorEmail('');
    setManualAmountUGX('500000');
    setManualReferenceCode('');
    setManualNotes('');
  };

  // Export Tools: CSV & Excel
  const exportLedgerFile = (format: 'csv' | 'excel') => {
    const headers = [
      'Receipt Number',
      'Date',
      'Donor Name',
      'Donor Email',
      'Campaign Supported',
      'Amount UGX',
      'Payment Method',
      'Entry Type',
      'Reference Code',
      'Notes',
    ];

    const rows = filteredLedger.map((tx) => [
      `"${tx.receiptNumber}"`,
      `"${tx.date}"`,
      `"${tx.donorName}"`,
      `"${tx.donorEmail}"`,
      `"${tx.campaignTitle.replace(/"/g, '""')}"`,
      tx.amountUGX || (tx.amountMinor ? tx.amountMinor / 100 : 0),
      `"${tx.paymentMethod}"`,
      `"${tx.entryType}"`,
      `"${tx.referenceCode}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    const separator = format === 'excel' ? '\t' : ',';
    const mime =
      format === 'excel'
        ? 'data:application/vnd.ms-excel;charset=utf-8,'
        : 'data:text/csv;charset=utf-8,';
    const ext = format === 'excel' ? 'xls' : 'csv';

    const content = mime + [headers.join(separator), ...rows.map((r) => r.join(separator))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(content));
    link.setAttribute('download', `gcc_foundation_global_giving_ledger_2026.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${filteredLedger.length} financial transactions as ${ext.toUpperCase()} for annual audit.`);
  };

  // =========================================================================
  // ACTION HANDLERS: SECTION 5 (DONOR & MEMBER DIRECTORY)
  // =========================================================================

  const openEditDonor = (donor: DonorDirectoryEntry) => {
    setEditingDonor(donor);
    setDonorNameEdit(donor.name);
    setDonorEmailEdit(donor.email);
    setDonorPhoneEdit(donor.phone);
    setDonorAddressEdit(donor.address);
  };

  const handleSaveDonorEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor || !donorNameEdit.trim()) return;

    const updated: DonorDirectoryEntry = {
      ...editingDonor,
      name: donorNameEdit.trim(),
      email: donorEmailEdit.trim(),
      phone: donorPhoneEdit.trim(),
      address: donorAddressEdit.trim(),
    };

    setDonors((prev) => prev.map((d) => (d.id === editingDonor.id ? updated : d)));
    notify(`Updated supporter record for ${updated.name}.`);
    setEditingDonor(null);
  };

  const handleToggleDonorRole = (donor: DonorDirectoryEntry) => {
    const roles: Array<DonorDirectoryEntry['role']> = ['user', 'volunteer', 'admin'];
    const currentIdx = roles.indexOf(donor.role || 'user');
    const nextRole = roles[(currentIdx + 1) % roles.length];

    if (
      nextRole === 'admin' &&
      !window.confirm(`Grant FULL ADMINISTRATIVE PRIVILEGES to ${donor.name}? They will have complete command over the CMS, Ledger, and Campaigns.`)
    ) {
      return;
    }

    const updated: DonorDirectoryEntry = { ...donor, role: nextRole };
    setDonors((prev) => prev.map((d) => (d.id === donor.id ? updated : d)));
    notify(`Role for ${donor.name} changed to ${nextRole.toUpperCase()}.`);

    try {
      fetch(`/api/admin/supporters/${donor.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      }).catch(() => {});
    } catch {}
  };

  const handleToggleDonorStatus = (donor: DonorDirectoryEntry) => {
    const nextStatus = donor.accountStatus === 'active' ? 'deactivated' : 'active';
    if (
      nextStatus === 'deactivated' &&
      !window.confirm(`Deactivate account for ${donor.name}? They will not be able to sign in or send child letters.`)
    ) {
      return;
    }

    const updated: DonorDirectoryEntry = { ...donor, accountStatus: nextStatus };
    setDonors((prev) => prev.map((d) => (d.id === donor.id ? updated : d)));
    notify(`Account for ${donor.name} is now ${nextStatus.toUpperCase()}.`);

    try {
      fetch(`/api/admin/supporters/${donor.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus === 'active' }),
      }).catch(() => {});
    } catch {}
  };

  // =========================================================================
  // ACTION HANDLERS: SECTION 6 (CAMPAIGN & CONTENT MANAGER)
  // =========================================================================

  const openCreateCampaignModal = () => {
    setEditingCampaign(null);
    setCampTitle('');
    setCampSubtitle('');
    setCampCategory('Medical Care');
    setCampDistrict('Kampala, Uganda');
    setCampInstitution('Uganda Heart Institute Accounts Treasury');
    setCampGoalUGX('22500000');
    setCampCoverImage('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80');
    setCampStory('100% of donations are held in institutional escrow and disbursed directly to verified hospital accounts with itemized medical invoices.');
    setShowCampaignModal(true);
  };

  const openEditCampaignModal = (camp: Campaign) => {
    setEditingCampaign(camp);
    setCampTitle(camp.title);
    setCampSubtitle(camp.subtitle);
    setCampCategory(camp.category);
    setCampDistrict(camp.location.district);
    setCampInstitution(camp.payoutVerification?.institutionName || 'Verified Institutional Partner');
    setCampGoalUGX(String(camp.goalUGX));
    setCampCoverImage(camp.coverImage);
    setCampStory(Array.isArray(camp.fullStoryHtml) ? camp.fullStoryHtml.join('\n\n') : String(camp.fullStoryHtml || ''));
    setShowCampaignModal(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle.trim() || !campGoalUGX) return;

    const goalVal = Number(campGoalUGX) || 15000000;

    if (editingCampaign) {
      const updated: Campaign = {
        ...editingCampaign,
        title: campTitle.trim(),
        subtitle: campSubtitle.trim() || editingCampaign.subtitle,
        category: campCategory,
        goalUGX: goalVal,
        coverImage: campCoverImage.trim() || editingCampaign.coverImage,
        location: {
          ...editingCampaign.location,
          district: campDistrict.trim(),
        },
        payoutVerification: {
          ...editingCampaign.payoutVerification,
          institutionName: campInstitution.trim(),
        },
        fullStoryHtml: campStory.split(/\n\n+/).filter(Boolean),
      };
      setCampaigns((prev) => prev.map((c) => (c.id === editingCampaign.id ? updated : c)));
      notify(`Updated campaign project "${updated.title}".`);
    } else {
      const slug = campTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newCampaign: Campaign = {
        id: `gcc-${Date.now().toString().slice(-4)}`,
        slug,
        title: campTitle.trim(),
        subtitle: campSubtitle.trim() || 'Verified institutional humanitarian initiative with direct bank settlement.',
        category: campCategory,
        location: {
          district: campDistrict.trim(),
          subCounty: 'Central',
          country: 'Uganda',
          facilityName: campInstitution.trim(),
        },
        goalUGX: goalVal,
        raisedUGX: 0,
        donorCount: 0,
        daysRemaining: 45,
        createdAt: new Date().toISOString().split('T')[0],
        urgent: true,
        featured: true,
        coverImage:
          campCoverImage.trim() ||
          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [],
        payoutVerification: {
          type: 'Direct-to-Hospital',
          institutionName: campInstitution.trim(),
          accountNumberMasked: 'Stanbic Bank A/C •••• 4920',
          bankName: 'Stanbic Bank Uganda',
          verificationReference: `GCC-VER-${Date.now().toString().slice(-5)}`,
          complianceOfficer: 'Pauline Namukasa, FCCA',
        },
        organizer: {
          name: 'GCC Foundation Field Desk',
          role: 'Institutional Program Officer',
          ninOrIdMasked: 'CM900182••••••',
          verifiedBadge: true,
          relationshipToBeneficiary: 'Direct Institutional Trustee',
          phoneMasked: '+256 703 ••• 200',
          avatarUrl: '/images/gcc-logo.png',
          residence: campDistrict.trim(),
        },
        beneficiary: {
          name: campTitle.trim(),
          storySummary: campSubtitle.trim() || campTitle.trim(),
        },
        fullStoryHtml: campStory.split(/\n\n+/).filter(Boolean),
        itemizedBudget: [],
        fieldUpdates: [],
        recentDonors: [],
        volunteerPledges: [],
      };
      setCampaigns((prev) => [newCampaign, ...prev]);
      notify(`Published new fundraising campaign "${newCampaign.title}" to the public site.`);
    }

    setShowCampaignModal(false);
  };

  const handleToggleCampaignUrgent = (campId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campId ? { ...c, urgent: !c.urgent } : c))
    );
    notify('Updated campaign priority badge.');
  };

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim() || !newsCampaignId) return;

    const linkedCamp = campaigns.find((c) => c.id === newsCampaignId);
    const newItem: NewsMilestoneItem = {
      id: `news-${Date.now().toString().slice(-4)}`,
      title: newsTitle.trim(),
      category: newsCategory,
      summary: newsSummary.trim(),
      publishedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: user?.name || 'Chief Operations Desk (Staff)',
      campaignId: linkedCamp?.id,
      campaignTitle: linkedCamp?.title,
      imageUrl:
        newsImageUrl.trim() ||
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    };

    setNewsList((prev) => [newItem, ...prev]);
    notify(`Published milestone update "${newItem.title}" to supporters’ Your Impact feeds.`);

    setNewsTitle('');
    setNewsSummary('');
    setNewsImageUrl('');
  };

  // Payout Queue status update
  const handleUpdatePayout = (id: string, status: PayoutRow['status']) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    notify(`Payout voucher ${id} marked as ${status.toUpperCase()}.`);
  };

  // =========================================================================
  // NAVIGATION TABS CONFIGURATION (6 DISTINCT DEDICATED SECTIONS)
  // =========================================================================

  const navItems = [
    {
      id: 'command' as AdminTab,
      num: '01',
      label: 'Command Center',
      sub: 'Overview & Analytics',
      badge: 'Live Metrics',
      icon: LayoutDashboard,
    },
    {
      id: 'children' as AdminTab,
      num: '02',
      label: 'Child Sponsorship CMS',
      sub: 'Profiles & Sponsorship Lock',
      badge: `${childrenList.length} Children · Active`,
      icon: HeartHandshake,
    },
    {
      id: 'letters' as AdminTab,
      num: '03',
      label: 'Letter Moderation Queue',
      sub: 'Safety Checks & Field Uploads',
      badge: pendingLettersCount > 0 ? `${pendingLettersCount} Pending` : 'All Cleared',
      badgeColor: pendingLettersCount > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-800',
      icon: MailCheck,
    },
    {
      id: 'financials' as AdminTab,
      num: '04',
      label: 'Donation & Financial Records',
      sub: 'Global Ledger & Audit Export',
      badge: 'CSV / Excel Ready',
      icon: DollarSign,
    },
    {
      id: 'donors' as AdminTab,
      num: '05',
      label: 'Donor & Member Directory',
      sub: 'Supporter Database & Roles',
      badge: `${donors.length} Members`,
      icon: Users,
    },
    {
      id: 'campaigns' as AdminTab,
      num: '06',
      label: 'Campaign & Content Manager',
      sub: 'Project Creator & Broadcast',
      badge: `${campaigns.length} Projects`,
      icon: Megaphone,
    },
  ];

  // =========================================================================
  // RENDER: TAB CONTENTS
  // =========================================================================

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col font-body">
      {/* =====================================================================
          EXECUTIVE COMMAND DECK HEADER (WEBSITE ALIGNED & HIGH-AUTHORITY)
         ===================================================================== */}
      <header className="bg-[#012D19] text-white border-b border-emerald-950 sticky top-0 z-40 shadow-lg">
        {/* Top Trust & System Security Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-emerald-900/60">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#02A95C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#02A95C]"></span>
            </span>
            <span className="font-mono uppercase font-bold text-emerald-300 tracking-wider text-[11px]">
              OPERATIONS COMMAND CENTER · LIVE AUDIT ACTIVE
            </span>
            <span className="hidden md:inline text-emerald-700">|</span>
            <span className="hidden md:inline text-emerald-200/80 font-mono text-[11px]">
              256-Bit Escrow Protection · Zero Platform Fee Policy
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-emerald-200/90 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/60">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span>{currentTime || '10:00:00 UTC'}</span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 bg-emerald-950/80 p-0.5 rounded-lg border border-emerald-800/80 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setCurrency('UGX')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currency === 'UGX' ? 'bg-[#02A95C] text-white' : 'text-emerald-300 hover:text-white'
                }`}
              >
                UGX (USh)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currency === 'USD' ? 'bg-[#02A95C] text-white' : 'text-emerald-300 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/50 hover:bg-emerald-800 px-3 py-1 font-semibold text-emerald-100 text-xs transition-colors border border-emerald-700/60"
            >
              <Globe className="h-3.5 w-3.5 text-[#02A95C]" />
              <span>Public Site</span>
              <ExternalLink className="h-3 w-3 text-emerald-400" />
            </Link>
          </div>
        </div>

        {/* Main Command Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#02A95C] to-[#012D19] p-0.5 shadow-md flex items-center justify-center">
              <div className="h-full w-full rounded-2xl bg-[#012D19] flex items-center justify-center border border-emerald-400/30">
                <ShieldCheck className="h-6 w-6 text-[#02A95C]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  GCC Foundation
                </span>
                <span className="bg-[#02A95C] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Executive Operations Desk · Child Sponsorship CMS & Financial Audit
              </p>
            </div>
          </div>

          {/* Operator Status Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="block text-xs font-bold text-white">
                {user?.name || 'Chief Operations Desk'}
              </span>
              <span className="block text-[11px] font-mono text-emerald-300">
                ROLE: OPERATIONS ADMINISTRATOR
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-800/80 border border-emerald-600/60 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GCC'}
            </div>
          </div>
        </div>

        {/* Master Navigation Tabs Bar (Full-Width Responsive Dedicated Section Bar) */}
        <div className="bg-[#012414] border-t border-emerald-900 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#02A95C] text-white shadow-md'
                      : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-950/60 text-emerald-400'
                  }`}>
                    {item.num}
                  </span>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || (isActive ? 'bg-emerald-950/70 text-emerald-200' : 'bg-emerald-900 text-emerald-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN EXECUTIVE BODY
         ===================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {adminToast && (
          <div
            role="status"
            className="rounded-2xl bg-white border-l-4 border-[#02A95C] p-4 text-sm font-semibold text-gray-900 flex items-center justify-between shadow-card animate-fadeIn"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#02A95C] shrink-0" />
              <span>{adminToast}</span>
            </div>
            <button
              onClick={() => setAdminToast('')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =====================================================================
            SECTION 1: THE ADMIN COMMAND CENTER (OVERVIEW / ANALYTICS)
           ===================================================================== */}
        {activeTab === 'command' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Section Banner */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                  Executive Operations Module · 01
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                  The Admin Command Center
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Real-time financial analytics, active donor subscriptions, child sponsorship ratios, and instant operational shortcuts.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleQuickLogOffline}
                  className="rounded-full bg-[#FAF9F6] hover:bg-emerald-50 text-emerald-900 border border-emerald-200 px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4 text-[#02A95C]" />
                  <span>Log Offline Donation</span>
                </button>
                <button
                  onClick={handleQuickAddChild}
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Child Profile</span>
                </button>
              </div>
            </div>

            {/* High-Level Financial Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#02A95C]">
                    RAISED THIS MONTH
                  </span>
                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center text-[#02A95C]">
                    <Coins className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A1A1A] block tabular-nums">
                  {formatAmount(totalFundsMonthUGX)}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Current calendar month · Verified
                </span>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-600">
                    RAISED THIS YEAR
                  </span>
                  <div className="h-6 w-6 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A1A1A] block tabular-nums">
                  {formatAmount(totalFundsYearUGX)}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Fiscal Year 2026 to-date
                </span>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    TOTAL RAISED (ALL-TIME)
                  </span>
                  <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A1A1A] block tabular-nums">
                  {formatAmount(totalFundsAllTimeUGX)}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Cumulative verified ledger
                </span>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    RECURRING DONORS
                  </span>
                  <div className="h-6 w-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A1A1A] block tabular-nums">
                  {activeMonthlyRecurringDonors} Active
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Monthly pledges & child sponsors
                </span>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-subtle space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    ACTIVE SPONSORSHIPS
                  </span>
                  <div className="h-6 w-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <HeartHandshake className="h-3.5 w-3.5" />
                  </div>
                </div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#1A1A1A] block tabular-nums">
                  {activeSponsorshipsCount} / {childrenList.length}
                </span>
                <span className="text-[11px] text-gray-500 block">
                  {childrenList.filter((c) => c.status === 'available').length} awaiting · 0 double-sponsored
                </span>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">
                    Quick Action Shortcuts
                  </h2>
                  <p className="text-xs text-gray-500">
                    Execute core administrative and field workflows with one click.
                  </p>
                </div>
                <span className="font-mono text-xs text-[#02A95C] font-bold">
                  FAST-DISPATCH
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={handleQuickAddChild}
                  className="group text-left rounded-2xl border border-[#E5E7EB] bg-[#FAF9F6] hover:bg-white hover:border-[#02A95C] p-5 transition-all shadow-xs space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#02A95C] text-white flex items-center justify-center shadow-sm">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-[#02A95C] transition-colors">
                      Add New Child Profile
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Launch Child Sponsorship Wizard: verified portrait, bio, dream, and monthly USD cost.
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleQuickPublishUpdate}
                  className="group text-left rounded-2xl border border-[#E5E7EB] bg-[#FAF9F6] hover:bg-white hover:border-sky-500 p-5 transition-all shadow-xs space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-sky-600 transition-colors">
                      Publish a Project Update
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Broadcast milestone photos, engineering certificates, and progress to donor impact feeds.
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleQuickReviewLetters}
                  className="group text-left rounded-2xl border border-[#E5E7EB] bg-[#FAF9F6] hover:bg-white hover:border-amber-500 p-5 transition-all shadow-xs space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <MailCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-sm text-[#1A1A1A] group-hover:text-amber-600 transition-colors">
                        Review Pending Letters
                      </h3>
                      {pendingLettersCount > 0 && (
                        <span className="font-mono text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          {pendingLettersCount} PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Safety check incoming donor messages to sponsored children, edit for privacy, and approve delivery.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Transactions Feed */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">
                    Recent Transactions Feed
                  </h2>
                  <p className="text-xs text-gray-500">
                    Live audit stream showing who gave what, when, and to which campaign.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('financials')}
                  className="text-xs font-bold text-[#02A95C] hover:text-[#028F4D] transition-colors flex items-center gap-1"
                >
                  <span>Open Global Giving Ledger</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3 px-4">Receipt & Date</th>
                      <th className="py-3 px-4">Donor</th>
                      <th className="py-3 px-4">Campaign Supported</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {ledger.slice(0, 6).map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3 px-4 font-mono text-xs">
                          <strong className="text-gray-900 block">{tx.receiptNumber}</strong>
                          <span className="text-gray-500">{tx.date}</span>
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-gray-900 block">{tx.donorName}</strong>
                          <span className="text-xs text-gray-500">{tx.donorEmail}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-medium max-w-xs truncate">
                          {tx.campaignTitle}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-800">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#02A95C]">
                          {formatTransactionAmount(tx)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedReceiptTx(tx)}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-700 shadow-xs"
                          >
                            <Eye className="h-3 w-3 text-emerald-600" />
                            <span>Voucher</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Institutional EFT Payout Queue */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">
                      Institutional Bank EFT Payout Queue
                    </h2>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                      100% DIRECT DISBURSEMENT
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Direct bank wire settlements to verified hospital treasuries, school bursars, and borehole contractors.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3 px-4">Voucher ID & Date</th>
                      <th className="py-3 px-4">Campaign</th>
                      <th className="py-3 px-4">Receiving Institution</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3 px-4 font-mono text-xs">
                          <strong className="text-gray-900 block">{p.id}</strong>
                          <span className="text-gray-500">{p.date}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900 max-w-xs">
                          {p.campaignTitle}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">
                          <strong className="text-gray-900 block">{p.institution}</strong>
                          <span className="font-mono">{p.bankAccount}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                          {formatAmount(p.amountUGX)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                              p.status === 'Settled via EFT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'Approved'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {p.status === 'Pending Review' && (
                            <button
                              onClick={() => handleUpdatePayout(p.id, 'Approved')}
                              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs font-bold shadow-xs"
                            >
                              Approve
                            </button>
                          )}
                          {p.status === 'Approved' && (
                            <button
                              onClick={() => handleUpdatePayout(p.id, 'Settled via EFT')}
                              className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-3 py-1 text-xs font-bold shadow-xs"
                            >
                              Settle EFT
                            </button>
                          )}
                          {p.status === 'Settled via EFT' && (
                            <span className="text-xs text-emerald-700 font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            SECTION 2: CHILD SPONSORSHIP MANAGEMENT (CMS)
           ===================================================================== */}
        {activeTab === 'children' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                    Child Sponsorship CMS · Module 02
                  </span>
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    SINGLE-SPONSORSHIP LOCK ACTIVE
                  </span>
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                  Child Sponsorship Management
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Manage verified child profiles, update termly schooling and biographical details, and maintain strict single-sponsorship lock tracking to prevent double-sponsorship.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openAddChildModal}
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Child Profile</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setChildFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    childFilter === 'all'
                      ? 'bg-[#02A95C] text-white'
                      : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Children ({childrenList.length})
                </button>
                <button
                  onClick={() => setChildFilter('available')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    childFilter === 'available'
                      ? 'bg-[#02A95C] text-white'
                      : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Available ({childrenList.filter((c) => c.status === 'available').length})
                </button>
                <button
                  onClick={() => setChildFilter('sponsored')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    childFilter === 'sponsored'
                      ? 'bg-[#02A95C] text-white'
                      : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Sponsored ({childrenList.filter((c) => c.status === 'sponsored').length})
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, district, school..."
                  value={childSearch}
                  onChange={(e) => setChildSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>
            </div>

            {/* Child Profile Directory Table */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3.5 px-4">Child Profile</th>
                      <th className="py-3.5 px-4">District & School</th>
                      <th className="py-3.5 px-4">Monthly Cost</th>
                      <th className="py-3.5 px-4">Sponsorship Status</th>
                      <th className="py-3.5 px-4">Linked Sponsor (Lock)</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredChildren.map((child) => (
                      <tr key={child.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-xs">
                              <Image
                                src={child.photoUrl}
                                alt={child.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <strong className="text-gray-900 font-bold block">{child.name}</strong>
                              <span className="text-xs text-gray-500 font-mono">
                                {child.age} yrs · {child.gender}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <strong className="text-gray-800 block">{child.district}</strong>
                          <span className="text-gray-500">{child.schoolAndGrade}</span>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-gray-900 text-xs">
                          <span className="text-[#02A95C] block">${child.monthlySponsorshipUSD} / mo</span>
                          <span className="text-gray-400 font-normal">
                            ~{formatAmount(child.monthlySponsorshipUSD * 3750)}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {child.status === 'sponsored' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                              <CheckCircle2 className="h-3 w-3" />
                              SPONSORED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                              <Heart className="h-3 w-3" />
                              AVAILABLE
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-xs">
                          {child.status === 'sponsored' && child.sponsorName ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                                <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{child.sponsorName}</span>
                              </div>
                              <span className="text-gray-500 font-mono text-[11px] block truncate max-w-xs">
                                {child.sponsorEmail}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono block">
                                Since {child.sponsoredSince || '2026'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic font-mono">
                              Awaiting dedicated sponsor
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditChildModal(child)}
                              className="rounded-full border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 transition-colors shadow-xs"
                            >
                              Edit Profile
                            </button>
                            <button
                              onClick={() => handleToggleChildStatus(child)}
                              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                                child.status === 'sponsored'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {child.status === 'sponsored' ? 'Unlink' : 'Assign'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sponsorship Safeguards Banner */}
            <div className="bg-[#FAF9F6] border border-emerald-200/80 rounded-2xl p-5 flex items-start gap-3.5">
              <ShieldCheck className="h-6 w-6 text-[#02A95C] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">
                  Single-Sponsorship Integrity Guarantee
                </h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Every child profile in the GCC Foundation CMS is protected by our anti-double-sponsorship locking protocol. A child cannot be linked to more than one donor simultaneously. All termly report cards and progress letters are directly dispatched only to the verified linked sponsor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            SECTION 3: LETTER & MESSAGE MODERATION QUEUE
           ===================================================================== */}
        {activeTab === 'letters' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                  Moderation & Field Records · Module 03
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                  Letter & Message Moderation Queue
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Review incoming messages sent by donors to sponsored children for child safety and privacy protection, and upload verified termly report cards from the field.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFieldUploadModal(true)}
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Field Update</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Letters vs Field Uploads */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <button
                onClick={() => setLettersSubTab('letters')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  lettersSubTab === 'letters'
                    ? 'bg-[#012D19] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]'
                }`}
              >
                <MailCheck className="h-4 w-4" />
                <span>Incoming Donor Messages</span>
                {pendingLettersCount > 0 && (
                  <span className="bg-amber-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingLettersCount} PENDING
                  </span>
                )}
              </button>

              <button
                onClick={() => setLettersSubTab('field-uploads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  lettersSubTab === 'field-uploads'
                    ? 'bg-[#012D19] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]'
                }`}
              >
                <FolderUp className="h-4 w-4" />
                <span>Field Update Uploads ({fieldUploads.length})</span>
              </button>
            </div>

            {/* Sub-Tab 1: Letters Queue */}
            {lettersSubTab === 'letters' && (
              <div className="space-y-4">
                {/* Letter Status Filters */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLetterFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      letterFilter === 'all'
                        ? 'bg-[#02A95C] text-white'
                        : 'bg-white border border-[#E5E7EB] text-gray-700'
                    }`}
                  >
                    All Messages ({letters.length})
                  </button>
                  <button
                    onClick={() => setLetterFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      letterFilter === 'pending'
                        ? 'bg-amber-500 text-white'
                        : 'bg-white border border-[#E5E7EB] text-gray-700'
                    }`}
                  >
                    Pending Review ({pendingLettersCount})
                  </button>
                  <button
                    onClick={() => setLetterFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      letterFilter === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-[#E5E7EB] text-gray-700'
                    }`}
                  >
                    Approved & Delivered ({letters.filter((l) => l.status === 'approved').length})
                  </button>
                  <button
                    onClick={() => setLetterFilter('rejected')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      letterFilter === 'rejected'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-[#E5E7EB] text-gray-700'
                    }`}
                  >
                    Rejected ({letters.filter((l) => l.status === 'rejected').length})
                  </button>
                </div>

                {/* Letters Cards Grid */}
                <div className="space-y-3">
                  {filteredLetters.map((letter) => (
                    <div
                      key={letter.id}
                      className={`bg-white rounded-2xl border p-5 shadow-subtle space-y-3 transition-colors ${
                        letter.status === 'pending'
                          ? 'border-amber-300 ring-2 ring-amber-100'
                          : 'border-[#E5E7EB]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              letter.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : letter.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            <MailCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-sm text-gray-900 font-bold">{letter.donorName}</strong>
                              <span className="text-gray-400 font-mono text-xs">({letter.donorEmail})</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-xs font-bold text-[#02A95C] bg-emerald-50 px-2 py-0.5 rounded-md">
                                To: {letter.childName}
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400 font-mono mt-0.5 block">
                              Received {letter.createdAt} · Message ID: {letter.id}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold uppercase ${
                              letter.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : letter.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {letter.status === 'pending'
                              ? 'Pending Moderation'
                              : letter.status === 'approved'
                              ? 'Approved & Delivered'
                              : 'Rejected'}
                          </span>
                        </div>
                      </div>

                      {/* Letter Text Content */}
                      <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-4 text-xs text-gray-800 leading-relaxed font-body">
                        {letter.message}
                      </div>

                      {/* Safety Warning & Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>
                            Safety Policy: Redact external phone numbers, addresses, and social handles before field delivery.
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditLetterModal(letter)}
                            className="rounded-full border border-gray-300 bg-white hover:bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-xs flex items-center gap-1.5"
                          >
                            <Edit3 className="h-3 w-3 text-gray-500" />
                            <span>Safety Edit</span>
                          </button>

                          {letter.status !== 'approved' && (
                            <button
                              onClick={() => handleApproveLetter(letter)}
                              className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-4 py-1.5 text-xs font-bold shadow-xs flex items-center gap-1.5"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Approve & Deliver</span>
                            </button>
                          )}

                          {letter.status !== 'rejected' && (
                            <button
                              onClick={() => handleRejectLetter(letter)}
                              className="rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-1.5 text-xs font-bold shadow-xs"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Field Update Uploads */}
            {lettersSubTab === 'field-uploads' && (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-subtle space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                      Field Update Documents & Progress Reports
                    </h3>
                    <p className="text-xs text-gray-500">
                      Termly academic report cards, attendance certificates, and engineering borehole inspection logs.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFieldUploadModal(true)}
                    className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-4 py-2 text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload Document</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#FAF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider border-b border-[#E5E7EB]">
                      <tr>
                        <th className="py-3 px-4">Document Title</th>
                        <th className="py-3 px-4">Target Beneficiary</th>
                        <th className="py-3 px-4">Type & Period</th>
                        <th className="py-3 px-4">Uploaded By</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">File</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {fieldUploads.map((fld) => (
                        <tr key={fld.id} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-3.5 px-4">
                            <strong className="text-gray-900 block font-bold text-xs">{fld.title}</strong>
                            <span className="text-[11px] text-gray-500 max-w-sm truncate block">
                              {fld.notes}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-bold text-[#02A95C]">
                            {fld.targetName}
                          </td>
                          <td className="py-3.5 px-4 text-xs">
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-mono text-[11px] block w-fit">
                              {fld.documentType}
                            </span>
                            <span className="text-gray-500 text-[11px] mt-0.5 block">{fld.termOrPeriod}</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-gray-700">{fld.uploadedBy}</td>
                          <td className="py-3.5 px-4 text-xs font-mono text-gray-500">{fld.uploadedAt}</td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={fld.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700 shadow-xs"
                            >
                              <ExternalLink className="h-3 w-3 text-emerald-600" />
                              <span>View File</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            SECTION 4: DONATION & FINANCIAL RECORDS
           ===================================================================== */}
        {activeTab === 'financials' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                  Financial Accounting & Audit · Module 04
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                  Donation & Financial Records
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Searchable, filterable Global Giving Ledger of every transaction. Log offline cash/EFT donations with automated receipts, and export board reports in CSV and Excel formats.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => exportLedgerFile('csv')}
                  className="rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-[#E5E7EB] px-4 py-2.5 text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
                >
                  <Download className="h-4 w-4 text-gray-500" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportLedgerFile('excel')}
                  className="rounded-full bg-white hover:bg-gray-50 text-emerald-800 border border-emerald-300 px-4 py-2.5 text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4 text-[#02A95C]" />
                  <span>Export Excel (.xls)</span>
                </button>
                <button
                  onClick={() => setShowManualEntryModal(true)}
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log Offline Donation</span>
                </button>
              </div>
            </div>

            {/* Financial Ledger Filter Bar */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                {/* Method Filter */}
                <select
                  value={ledgerMethodFilter}
                  onChange={(e) => setLedgerMethodFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#02A95C]"
                >
                  <option value="All">All Channels</option>
                  <option value="MTN MoMo">MTN MoMo</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Direct Bank Wire (EFT)">Direct Bank Wire (EFT)</option>
                  <option value="Visa / Mastercard">Visa / Mastercard</option>
                  <option value="Offline Cash Receipt">Offline Cash Receipt</option>
                  <option value="Mobile Money Receipt (Manual)">Mobile Money Receipt (Manual)</option>
                </select>

                {/* Entry Type Filter */}
                <select
                  value={ledgerTypeFilter}
                  onChange={(e) => setLedgerTypeFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#02A95C]"
                >
                  <option value="All">All Entry Types</option>
                  <option value="Online">Online Payments</option>
                  <option value="Manual Offline Entry">Manual Offline Entries</option>
                  <option value="Adjustment">Ledger Adjustments</option>
                </select>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search receipt, donor, campaign, ref..."
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>
            </div>

            {/* Global Giving Ledger Table */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3.5 px-4">Receipt Number & Date</th>
                      <th className="py-3.5 px-4">Donor Name & Contact</th>
                      <th className="py-3.5 px-4">Campaign Allocation</th>
                      <th className="py-3.5 px-4">Method & Channel</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-center">Receipt Voucher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredLedger.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <strong className="text-gray-900 block font-bold">{tx.receiptNumber}</strong>
                          <span className="text-gray-500">{tx.date}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <strong className="text-gray-900 block font-bold text-xs">{tx.donorName}</strong>
                          <span className="text-xs text-gray-500 font-mono">{tx.donorEmail}</span>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-medium text-gray-800 max-w-xs">
                          <span className="block truncate">{tx.campaignTitle}</span>
                          <span className="text-[10px] text-gray-400 font-mono">Ref: {tx.referenceCode}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-semibold text-gray-800">
                            {tx.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                              tx.entryType === 'Manual Offline Entry'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {tx.entryType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#02A95C] text-sm">
                          {formatTransactionAmount(tx)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedReceiptTx(tx)}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700 shadow-xs"
                          >
                            <Receipt className="h-3.5 w-3.5 text-[#02A95C]" />
                            <span>Voucher</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            SECTION 5: DONOR & MEMBER DIRECTORY
           ===================================================================== */}
        {activeTab === 'donors' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                  Supporter Database · Module 05
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                  Donor & Member Directory
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Searchable database of all registered donors and supporters, lifetime contributions, contact information, role promotions, and account status toggles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold px-3 py-1.5 rounded-full">
                  {donors.length} REGISTERED SUPPORTERS
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <select
                  value={donorRoleFilter}
                  onChange={(e) => setDonorRoleFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#02A95C]"
                >
                  <option value="All">All Roles</option>
                  <option value="User">Regular Supporters (Users)</option>
                  <option value="Volunteer">Field Volunteers</option>
                  <option value="Admin">Administrators</option>
                </select>

                <select
                  value={donorStatusFilter}
                  onChange={(e) => setDonorStatusFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#02A95C]"
                >
                  <option value="All">All Account Statuses</option>
                  <option value="Active">Active Accounts</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, location..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>
            </div>

            {/* Supporter Database Table */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider border-b border-[#E5E7EB]">
                    <tr>
                      <th className="py-3.5 px-4">Supporter Name & Avatar</th>
                      <th className="py-3.5 px-4">Contact Info & City</th>
                      <th className="py-3.5 px-4">Lifetime Contributions</th>
                      <th className="py-3.5 px-4">Giving Commitment</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">User Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredDonors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-200">
                              {donor.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong className="text-gray-900 font-bold block">{donor.name}</strong>
                              <span className="text-[11px] text-gray-400 font-mono">
                                Member since {donor.joinedDate}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <strong className="text-gray-800 block font-mono">{donor.email}</strong>
                          <span className="text-gray-500 font-mono block">{donor.phone}</span>
                          <span className="text-gray-400 text-[11px] block">{donor.address}</span>
                        </td>

                        <td className="py-4 px-4 text-xs font-mono">
                          <strong className="text-[#02A95C] block font-bold text-sm">
                            {formatAmount(donor.totalDonatedUGX)}
                          </strong>
                          <span className="text-gray-500">{donor.donationsCount} gifts verified</span>
                        </td>

                        <td className="py-4 px-4 text-xs">
                          <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold block w-fit">
                            {donor.recurringPlan}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase ${
                              donor.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : donor.role === 'volunteer'
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {donor.role}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase ${
                              donor.accountStatus === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {donor.accountStatus}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditDonor(donor)}
                              className="rounded-full border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-700 shadow-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleDonorRole(donor)}
                              className="rounded-full border border-purple-200 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700 shadow-xs"
                              title="Toggle role between User, Volunteer, Admin"
                            >
                              Role
                            </button>
                            <button
                              onClick={() => handleToggleDonorStatus(donor)}
                              className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-xs ${
                                donor.accountStatus === 'active'
                                  ? 'border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700'
                                  : 'border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {donor.accountStatus === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            SECTION 6: CAMPAIGN & CONTENT MANAGER
           ===================================================================== */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#02A95C]">
                  Fundraising & Impact Broadcast · Module 06
                </span>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
                  Campaign & Content Manager
                </h1>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Create new institutional fundraising campaigns, set financial goals, upload verified cover images, and publish milestone news that broadcasts to supporters’ Your Impact feeds.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openCreateCampaignModal}
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-5 py-2.5 text-xs font-bold transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Campaign</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Campaigns vs Update Publisher */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <button
                onClick={() => setCampaignsSubTab('projects')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  campaignsSubTab === 'projects'
                    ? 'bg-[#012D19] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]'
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Active Fundraising Projects ({campaigns.length})</span>
              </button>

              <button
                onClick={() => setCampaignsSubTab('updates')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                  campaignsSubTab === 'updates'
                    ? 'bg-[#012D19] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]'
                }`}
              >
                <Megaphone className="h-4 w-4" />
                <span>Update Publisher & Broadcasts ({newsList.length})</span>
              </button>
            </div>

            {/* Sub-Tab 1: Projects List */}
            {campaignsSubTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((camp) => {
                  const percent = Math.min(100, Math.round((camp.raisedUGX / camp.goalUGX) * 100));
                  return (
                    <div
                      key={camp.id}
                      className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-subtle flex flex-col justify-between transition-all hover:border-[#02A95C]"
                    >
                      <div>
                        {/* Cover Image & Category */}
                        <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                          <Image
                            src={camp.coverImage}
                            alt={camp.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                            {camp.category}
                          </div>
                          {camp.urgent && (
                            <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                              URGENT
                            </div>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="font-heading font-bold text-base text-[#1A1A1A] line-clamp-2 leading-snug">
                            {camp.title}
                          </h3>

                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {camp.subtitle}
                          </p>

                          {/* Progress */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <strong className="text-[#02A95C] font-bold">
                                {formatAmount(camp.raisedUGX)}
                              </strong>
                              <span className="text-gray-500 font-semibold">
                                {percent}% of {formatAmount(camp.goalUGX)}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#02A95C] rounded-full transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                              <span>{camp.donorCount} verified donors</span>
                              <span>{camp.location.district}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 bg-[#FAF9F6] border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleCampaignUrgent(camp.id)}
                          className={`rounded-full px-3 py-1 text-xs font-bold border ${
                            camp.urgent
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-white text-gray-600 border-gray-200'
                          }`}
                        >
                          {camp.urgent ? 'Urgent Priority' : 'Standard Priority'}
                        </button>

                        <button
                          onClick={() => openEditCampaignModal(camp)}
                          className="rounded-full bg-white hover:bg-gray-50 border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-800 shadow-xs"
                        >
                          Edit Project
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sub-Tab 2: Update Publisher */}
            {campaignsSubTab === 'updates' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Publisher Form */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-subtle space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                      Publish Milestone Update
                    </h3>
                    <p className="text-xs text-gray-500">
                      Post milestone news, field photos, or engineering inspection certificates directly to supporters’ Your Impact feeds.
                    </p>
                  </div>

                  <form onSubmit={handlePublishNews} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Select Fundraising Campaign *
                      </label>
                      <select
                        value={newsCampaignId}
                        onChange={(e) => setNewsCampaignId(e.target.value)}
                        required
                        className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                      >
                        <option value="">-- Choose Campaign --</option>
                        {campaigns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Milestone Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tranche #2 Transferred to Hospital Treasury"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        required
                        className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newsCategory}
                          onChange={(e) => setNewsCategory(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                        >
                          <option value="Medical Milestone">Medical Milestone</option>
                          <option value="Clean Water Update">Clean Water Update</option>
                          <option value="Education Progress">Education Progress</option>
                          <option value="Emergency Response">Emergency Response</option>
                          <option value="Community Infrastructure">Community Infrastructure</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Field Photo URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={newsImageUrl}
                          onChange={(e) => setNewsImageUrl(e.target.value)}
                          className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Impact Narrative & Findings *
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe the clinical progress, engineering metrics, or bursar clearance verified in the field..."
                        value={newsSummary}
                        onChange={(e) => setNewsSummary(e.target.value)}
                        required
                        className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white py-3 text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Broadcast Update to Supporters</span>
                    </button>
                  </form>
                </div>

                {/* Published Updates Stream */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                        Live Broadcast Feed
                      </h3>
                      <p className="text-xs text-gray-500">
                        Updates published to donor accounts and public campaign timelines.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                      {newsList.length} PUBLISHED
                    </span>
                  </div>

                  <div className="space-y-4">
                    {newsList.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#E5E7EB] bg-[#FAF9F6] p-4 flex flex-col sm:flex-row gap-4"
                      >
                        {item.imageUrl && (
                          <div className="relative h-24 sm:w-32 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-300">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="128px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-[#012D19] text-white px-2 py-0.5 rounded-full uppercase">
                              {item.category}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                              {item.publishedAt}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-1">
                            <span>Author: {item.author}</span>
                            {item.campaignTitle && (
                              <span className="text-[#02A95C] font-semibold truncate max-w-xs">
                                {item.campaignTitle}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =====================================================================
          MODAL 1: ADD / EDIT CHILD WIZARD
         ===================================================================== */}
      {showChildModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#02A95C] uppercase">
                  CMS Profile Wizard
                </span>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                  {editingChild ? `Edit Profile: ${editingChild.name}` : 'Add New Child Profile'}
                </h3>
              </div>
              <button
                onClick={() => setShowChildModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {childFormError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{childFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveChild} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Grace Nakato"
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={21}
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Gender *</label>
                    <select
                      value={childGender}
                      onChange={(e) => setChildGender(e.target.value as any)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                    >
                      <option value="Girl">Girl</option>
                      <option value="Boy">Boy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">District / Location *</label>
                  <input
                    type="text"
                    required
                    value={childDistrict}
                    onChange={(e) => setChildDistrict(e.target.value)}
                    placeholder="e.g. Soroti District, Uganda"
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">School & Grade *</label>
                  <input
                    type="text"
                    required
                    value={childSchool}
                    onChange={(e) => setChildSchool(e.target.value)}
                    placeholder="e.g. St. Mary’s Primary · Primary 4"
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Monthly Cost ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min={15}
                    max={200}
                    value={childMonthlyUSD}
                    onChange={(e) => setChildMonthlyUSD(e.target.value)}
                    placeholder="35"
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Verified Portrait URL</label>
                  <input
                    type="url"
                    value={childPhotoUrl}
                    onChange={(e) => setChildPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dream / Future Ambition *</label>
                <input
                  type="text"
                  required
                  value={childDream}
                  onChange={(e) => setChildDream(e.target.value)}
                  placeholder="e.g. Wants to become a pediatric heart surgeon"
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Biographical Background *</label>
                <textarea
                  rows={3}
                  required
                  value={childBio}
                  onChange={(e) => setChildBio(e.target.value)}
                  placeholder="Family situation, academic passion, and what monthly sponsorship covers..."
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              {/* Status & Single-Sponsorship Lock */}
              <div className="bg-[#FAF9F6] border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-xs">Sponsorship Assignment Status</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildStatus('available')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        childStatus === 'available'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setChildStatus('sponsored')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        childStatus === 'sponsored'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      Sponsored
                    </button>
                  </div>
                </div>

                {childStatus === 'sponsored' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-100">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Sponsor Full Name *</label>
                      <input
                        type="text"
                        required
                        value={childSponsorName}
                        onChange={(e) => setChildSponsorName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Sponsor Email Address *</label>
                      <input
                        type="email"
                        required
                        value={childSponsorEmail}
                        onChange={(e) => setChildSponsorEmail(e.target.value)}
                        placeholder="sarah.jenkins@example.org"
                        className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowChildModal(false)}
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  Save Child Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: LETTER SAFETY & PRIVACY EDIT
         ===================================================================== */}
      {editingLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-600 uppercase">
                  Safety & Privacy Check
                </span>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Edit Message for Child Delivery
                </h3>
              </div>
              <button
                onClick={() => setEditingLetter(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              In accordance with GCC Foundation Child Protection Policy, staff must remove any phone numbers, physical addresses, external links, or inappropriate requests before delivering messages to children in the field.
            </p>

            <div>
              <label className="block font-bold text-gray-700 text-xs mb-1">
                Moderated Message Text *
              </label>
              <textarea
                rows={5}
                value={editingLetterText}
                onChange={(e) => setEditingLetterText(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-2xl p-4 text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#02A95C]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
              <button
                onClick={() => setEditingLetter(null)}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLetterEdit}
                className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2.5 text-xs font-bold text-white shadow-sm flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Save Edit & Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: FIELD UPDATE / DOCUMENT UPLOAD
         ===================================================================== */}
      {showFieldUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#02A95C] uppercase">
                  Field Update Dispatch
                </span>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Upload Termly Report / Progress Letter
                </h3>
              </div>
              <button
                onClick={() => setShowFieldUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFieldUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Term 3 Academic Report Card & Attendance Sheet"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Document Type *</label>
                  <select
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  >
                    <option value="Termly Report Card">Termly Report Card</option>
                    <option value="Field Progress Letter">Field Progress Letter</option>
                    <option value="Verified Field Photo">Verified Field Photo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Type *</label>
                  <select
                    value={uploadTargetType}
                    onChange={(e) => setUploadTargetType(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  >
                    <option value="child">Sponsored Child</option>
                    <option value="project">Fundraising Campaign</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Attach to Beneficiary *</label>
                <select
                  value={uploadTargetId}
                  onChange={(e) => setUploadTargetId(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                >
                  <option value="">-- Choose Beneficiary --</option>
                  {uploadTargetType === 'child'
                    ? childrenList.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.name} ({ch.district})
                        </option>
                      ))
                    : campaigns.map((camp) => (
                        <option key={camp.id} value={camp.id}>
                          {camp.title}
                        </option>
                      ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Term / Period</label>
                  <input
                    type="text"
                    value={uploadTerm}
                    onChange={(e) => setUploadTerm(e.target.value)}
                    placeholder="Term 3 · 2026"
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">File Name</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="report_card_2026.pdf"
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">File / Image URL</label>
                <input
                  type="url"
                  value={uploadAttachmentUrl}
                  onChange={(e) => setUploadAttachmentUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Staff Field Notes</label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Academic performance, health check remarks, or borehole inspection status..."
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowFieldUploadModal(false)}
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2.5 text-xs font-bold text-white shadow-sm flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload & Attach Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: MANUAL OFFLINE ENTRY (CASH / EFT / MOMO RECEIPT)
         ===================================================================== */}
      {showManualEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-600 uppercase">
                  Audit Ledger Entry
                </span>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Log Offline Donation / Direct Wire
                </h3>
              </div>
              <button
                onClick={() => setShowManualEntryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Log cash contributions, physical bank wire transfers, or direct field mobile money receipts so they officially count toward campaign totals and generate verifiable donor receipts.
            </p>

            <form onSubmit={handleSaveManualOfflineDonation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Campaign Supported *</label>
                <select
                  required
                  value={manualCampaignId}
                  onChange={(e) => setManualCampaignId(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                >
                  <option value="">-- Select Campaign --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Donor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eng. Michael Otim"
                    value={manualDonorName}
                    onChange={(e) => setManualDonorName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Donor Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="m.otim@example.org"
                    value={manualDonorEmail}
                    onChange={(e) => setManualDonorEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amount (UGX) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={manualAmountUGX}
                    onChange={(e) => setManualAmountUGX(e.target.value)}
                    placeholder="500000"
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Method *</label>
                  <select
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  >
                    <option value="Offline Cash Receipt">Offline Cash Receipt</option>
                    <option value="Direct Bank Wire (EFT)">Direct Bank Wire (EFT)</option>
                    <option value="Mobile Money Receipt (Manual)">Mobile Money Receipt (Manual)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Physical Receipt Book / Wire Reference Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CASH-VCH-2026-118 or EFT-STB-99201"
                  value={manualReferenceCode}
                  onChange={(e) => setManualReferenceCode(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Internal Audit Notes</label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Field office book serial number, bank branch, or purpose allocation..."
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowManualEntryModal(false)}
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2.5 text-xs font-bold text-white shadow-sm flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  <span>Log Entry & Issue Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 5: OFFICIAL PRINTABLE RECEIPT VOUCHER
         ===================================================================== */}
      {selectedReceiptTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl border border-gray-200">
            {/* Printable Receipt Area */}
            <div className="border-4 border-[#012D19] p-6 rounded-2xl bg-[#FAF9F6] space-y-4">
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b-2 border-[#012D19] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#012D19] flex items-center justify-center text-white">
                    <ShieldCheck className="h-6 w-6 text-[#02A95C]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#012D19] uppercase tracking-wider">
                      GCC Foundation
                    </h3>
                    <p className="text-[10px] font-mono text-gray-600">
                      Official Humanitarian Giving Receipt · East Africa Desk
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="block text-xs font-bold text-[#012D19]">
                    {selectedReceiptTx.receiptNumber}
                  </span>
                  <span className="text-[10px] text-gray-500">{selectedReceiptTx.date}</span>
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Received From:</span>
                  <span className="font-bold text-gray-900">{selectedReceiptTx.donorName}</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Donor Email:</span>
                  <span className="font-mono text-gray-800">{selectedReceiptTx.donorEmail}</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Campaign Purpose:</span>
                  <span className="font-bold text-[#02A95C] text-right max-w-xs">
                    {selectedReceiptTx.campaignTitle}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Payment Channel:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {selectedReceiptTx.paymentMethod} ({selectedReceiptTx.entryType})
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Reference Code:</span>
                  <span className="font-mono text-gray-700">{selectedReceiptTx.referenceCode}</span>
                </div>

                <div className="flex justify-between pt-2 items-center bg-white p-3 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-900 text-sm uppercase">Total Verified:</span>
                  <span className="font-mono font-extrabold text-xl text-[#02A95C]">
                    {formatTransactionAmount(selectedReceiptTx)}
                  </span>
                </div>
              </div>

              {/* Official Stamp & Sign */}
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-gray-500 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#02A95C]" />
                  <span>Verified 100% Direct Payout Escrow</span>
                </div>
                <span>Authorized Officer Stamp: VALID</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="rounded-full border border-gray-300 bg-white hover:bg-gray-50 px-5 py-2.5 text-xs font-bold text-gray-700 flex items-center gap-2 shadow-xs"
              >
                <Printer className="h-4 w-4 text-gray-500" />
                <span>Print Official Receipt</span>
              </button>

              <button
                onClick={() => setSelectedReceiptTx(null)}
                className="rounded-full bg-[#012D19] hover:bg-emerald-950 px-6 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 6: EDIT SUPPORTER MODAL
         ===================================================================== */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#02A95C] uppercase">
                  Member Management
                </span>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Edit Supporter Details
                </h3>
              </div>
              <button
                onClick={() => setEditingDonor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDonorEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={donorNameEdit}
                  onChange={(e) => setDonorNameEdit(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={donorEmailEdit}
                  onChange={(e) => setDonorEmailEdit(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={donorPhoneEdit}
                  onChange={(e) => setDonorPhoneEdit(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">City & Country</label>
                <input
                  type="text"
                  value={donorAddressEdit}
                  onChange={(e) => setDonorAddressEdit(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  Save Supporter Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 7: CREATE / EDIT CAMPAIGN MODAL
         ===================================================================== */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#02A95C] uppercase">
                  Campaign Studio
                </span>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                  {editingCampaign ? `Edit Project: ${editingCampaign.title}` : 'Create New Fundraising Campaign'}
                </h3>
              </div>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar-Powered Deep Water Borehole for 1,400 Families in Gweri"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Subtitle *</label>
                <input
                  type="text"
                  required
                  placeholder="100% of funds sent directly to verified contractor / hospital treasury..."
                  value={campSubtitle}
                  onChange={(e) => setCampSubtitle(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={campCategory}
                    onChange={(e) => setCampCategory(e.target.value as any)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  >
                    <option value="Medical Care">Medical Care</option>
                    <option value="Clean Water Wells">Clean Water Wells</option>
                    <option value="Education & Tuition">Education & Tuition</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="Rural Agriculture">Rural Agriculture</option>
                    <option value="Community Infrastructure">Community Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Financial Goal (UGX) *</label>
                  <input
                    type="number"
                    required
                    min={1000000}
                    step={500000}
                    placeholder="15000000"
                    value={campGoalUGX}
                    onChange={(e) => setCampGoalUGX(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">District / Field Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Soroti District, Uganda"
                    value={campDistrict}
                    onChange={(e) => setCampDistrict(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Receiving Bank/Hospital Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uganda Heart Institute Accounts Treasury"
                    value={campInstitution}
                    onChange={(e) => setCampInstitution(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Banner Cover Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={campCoverImage}
                  onChange={(e) => setCampCoverImage(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Impact Story Narrative *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full background story of the humanitarian challenge, beneficiaries, and verification steps..."
                  value={campStory}
                  onChange={(e) => setCampStory(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#02A95C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
