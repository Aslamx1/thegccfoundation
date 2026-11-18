'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDonation } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { Campaign, Category } from '@/types';
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
  DollarSign,
  Users,
  FileText,
  HeartHandshake,
  MailCheck,
  Search,
  Plus,
  CheckCircle2,
  ExternalLink,
  Download,
  Edit3,
  Upload,
  Check,
  X,
  LayoutDashboard,
  Sparkles,
  FileSpreadsheet,
  Lock,
  UserCheck,
  UserX,
  Receipt,
  FolderUp,
  Megaphone,
  LogOut,
  Globe,
  Terminal,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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
    institution: 'St. Peter\'s Secondary School Bursar Account',
    bankAccount: 'DFCU Bank A/C •••• 7741',
    amountUGX: 5400000,
    status: 'Approved',
    date: '18 Nov 2026',
  },
];

export default function AdminDashboardPage() {
  const { campaigns, addNewCampaign, updateCampaign } = useDonation();
  const { formatUGX } = useCurrency();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('command');
  const [adminToast, setAdminToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const notify = (msg: string) => {
    setAdminToast(msg);
    window.setTimeout(() => setAdminToast(''), 4500);
  };

  // ================= STATE: 1. COMMAND CENTER & PAYOUTS =================
  const [payouts, setPayouts] = useState<PayoutRow[]>(INITIAL_PAYOUTS);

  // ================= STATE: 2. CHILD SPONSORSHIP MANAGEMENT (CMS) =================
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(DEFAULT_CHILDREN);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [showChildForm, setShowChildForm] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('9');
  const [childGender, setChildGender] = useState<'Girl' | 'Boy'>('Girl');
  const [childDistrict, setChildDistrict] = useState('Soroti District, Uganda');
  const [childSchool, setChildSchool] = useState('');
  const [childMonthlyUSD, setChildMonthlyUSD] = useState('35');
  const [childBio, setChildBio] = useState('');
  const [childDream, setChildDream] = useState('');
  const [childPhotoUrl, setChildPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
  );
  const [childStatus, setChildStatus] = useState<'available' | 'sponsored'>('available');
  const [childSponsorName, setChildSponsorName] = useState('');
  const [childSponsorEmail, setChildSponsorEmail] = useState('');
  const [childFormError, setChildFormError] = useState('');

  // ================= STATE: 3. LETTER MODERATION & FIELD UPLOADS =================
  const [letters, setLetters] = useState<ChildLetter[]>(DEFAULT_LETTERS);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [editingLetterText, setEditingLetterText] = useState('');
  const [letterFilter, setLetterFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const [fieldUploads, setFieldUploads] = useState<FieldUpdateUpload[]>(DEFAULT_FIELD_UPDATES);
  const [showFieldUploadForm, setShowFieldUploadForm] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState<FieldUpdateUpload['documentType']>('Termly Report Card');
  const [uploadTargetType, setUploadTargetType] = useState<'child' | 'project'>('child');
  const [uploadTargetId, setUploadTargetId] = useState('child-04');
  const [uploadTerm, setUploadTerm] = useState('Term 3 · 2026');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadAttachmentUrl, setUploadAttachmentUrl] = useState(
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
  );
  const [uploadFileName, setUploadFileName] = useState('term3_report_card_batch.pdf');

  // ================= STATE: 4. DONATION & FINANCIAL RECORDS =================
  const [ledger, setLedger] = useState<LedgerTransaction[]>(DEFAULT_LEDGER);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerMethodFilter, setLedgerMethodFilter] = useState('All');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState('All');
  const [showManualEntryForm, setShowManualEntryForm] = useState(false);
  const [manualDonorName, setManualDonorName] = useState('');
  const [manualDonorEmail, setManualDonorEmail] = useState('');
  const [manualCampaignId, setManualCampaignId] = useState('');
  const [manualAmountUGX, setManualAmountUGX] = useState('500000');
  const [manualPaymentMethod, setManualPaymentMethod] =
    useState<LedgerTransaction['paymentMethod']>('Offline Cash Receipt');
  const [manualEntryType, setManualEntryType] =
    useState<LedgerTransaction['entryType']>('Manual Offline Entry');
  const [manualReferenceCode, setManualReferenceCode] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<LedgerTransaction | null>(null);

  // ================= STATE: 5. DONOR & MEMBER DIRECTORY =================
  const [donors, setDonors] = useState<DonorDirectoryEntry[]>(DEFAULT_DONORS);
  const [donorSearch, setDonorSearch] = useState('');
  const [donorRoleFilter, setDonorRoleFilter] = useState('All');
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [editingDonor, setEditingDonor] = useState<DonorDirectoryEntry | null>(null);
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorEmail, setNewDonorEmail] = useState('');
  const [newDonorPhone, setNewDonorPhone] = useState('');
  const [newDonorAddress, setNewDonorAddress] = useState('');
  const [newDonorAmount, setNewDonorAmount] = useState('250000');
  const [newDonorPlan, setNewDonorPlan] = useState('One-Time Supporter');
  const [newDonorRole, setNewDonorRole] = useState<'user' | 'volunteer' | 'admin'>('user');

  // ================= STATE: 6. CAMPAIGN & CONTENT MANAGER =================
  const [newsList, setNewsList] = useState<NewsMilestoneItem[]>(DEFAULT_NEWS);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Project Milestone');
  const [newsCampaignId, setNewsCampaignId] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState(
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  );
  const [newsSummary, setNewsSummary] = useState('');

  const [showCampaignEditor, setShowCampaignEditor] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campTitle, setCampTitle] = useState('');
  const [campSubtitle, setCampSubtitle] = useState('');
  const [campCategory, setCampCategory] = useState<Category>('Medical Care');
  const [campDistrict, setCampDistrict] = useState('Kampala, Uganda');
  const [campInstitution, setCampInstitution] = useState('Uganda Heart Institute Accounts Treasury');
  const [campGoalUGX, setCampGoalUGX] = useState('15000000');
  const [campCoverImage, setCampCoverImage] = useState(
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80'
  );
  const [campStory, setCampStory] = useState('');
  const [campaignStatuses, setCampaignStatuses] = useState<Record<string, 'active' | 'paused'>>({});
  const [campaignVerified, setCampaignVerified] = useState<Record<string, boolean>>({});

  // Load persisted data from localStorage
  useEffect(() => {
    try {
      const savedChildren = localStorage.getItem(CHILDREN_STORAGE_KEY);
      if (savedChildren) setChildrenList(JSON.parse(savedChildren));

      const savedLetters = localStorage.getItem(LETTERS_STORAGE_KEY);
      if (savedLetters) setLetters(JSON.parse(savedLetters));

      const savedField = localStorage.getItem(FIELD_UPDATES_STORAGE_KEY);
      if (savedField) setFieldUploads(JSON.parse(savedField));

      const savedLedger = localStorage.getItem(LEDGER_STORAGE_KEY);
      if (savedLedger) setLedger(JSON.parse(savedLedger));

      const savedDonors = localStorage.getItem(DONORS_STORAGE_KEY);
      if (savedDonors) setDonors(JSON.parse(savedDonors));

      const savedNews = localStorage.getItem(NEWS_STORAGE_KEY);
      if (savedNews) setNewsList(JSON.parse(savedNews));
    } catch {}
  }, []);

  // Combined transactions (Global Ledger + Campaign Recent Donors)
  const combinedTransactions = useMemo<LedgerTransaction[]>(() => {
    const campaignTxs: LedgerTransaction[] = campaigns.flatMap((c, cIdx) =>
      c.recentDonors.map((d, dIdx) => ({
        id: `camp-tx-${c.id}-${d.id}`,
        receiptNumber: `GCC-RCP-2026-${1000 + cIdx * 100 + dIdx}`,
        donorName: d.isAnonymous ? 'Anonymous Supporter' : d.name,
        donorEmail: 'verified.supporter@thegccfoundation.com',
        campaignId: c.id,
        campaignTitle: c.title,
        amountUGX: d.amountUGX,
        paymentMethod:
          d.paymentMethod === 'MTN Mobile Money'
            ? 'MTN MoMo'
            : d.paymentMethod === 'Airtel Money'
            ? 'Airtel Money'
            : 'Visa / Mastercard',
        entryType: 'Online',
        date: d.timestamp,
        monthTag: 'this-month',
        referenceCode: `TX-${d.id.toUpperCase()}`,
        notes: d.message || 'Direct online campaign contribution',
      }))
    );
    return [...ledger, ...campaignTxs];
  }, [ledger, campaigns]);

  // High-Level Financial Metrics
  const allTimeRaisedUGX = useMemo(() => {
    const campaignSum = campaigns.reduce((sum, c) => sum + c.raisedUGX, 0);
    const manualOfflineSum = ledger
      .filter((tx) => tx.entryType !== 'Online')
      .reduce((sum, tx) => sum + tx.amountUGX, 0);
    return campaignSum + manualOfflineSum;
  }, [campaigns, ledger]);

  const thisMonthRaisedUGX = useMemo(() => {
    return combinedTransactions
      .filter((tx) => tx.monthTag === 'this-month')
      .reduce((sum, tx) => sum + tx.amountUGX, 0);
  }, [combinedTransactions]);

  const thisYearRaisedUGX = useMemo(() => {
    return combinedTransactions
      .filter((tx) => tx.monthTag === 'this-month' || tx.monthTag === 'this-year')
      .reduce((sum, tx) => sum + tx.amountUGX, 0);
  }, [combinedTransactions]);

  const activeMonthlyRecurringDonors = useMemo(
    () =>
      donors.filter(
        (d) =>
          d.accountStatus !== 'deactivated' &&
          (d.recurringPlan.toLowerCase().includes('monthly') ||
            d.recurringPlan.toLowerCase().includes('sponsor'))
      ).length,
    [donors]
  );

  const activeSponsorshipsCount = useMemo(
    () => childrenList.filter((c) => c.status === 'sponsored').length,
    [childrenList]
  );

  // Filtered Lists
  const filteredLedger = useMemo(() => {
    const q = ledgerSearch.trim().toLowerCase();
    return combinedTransactions.filter((tx) => {
      if (ledgerMethodFilter !== 'All' && tx.paymentMethod !== ledgerMethodFilter) return false;
      if (ledgerTypeFilter !== 'All' && tx.entryType !== ledgerTypeFilter) return false;
      if (!q) return true;
      return (
        tx.donorName.toLowerCase().includes(q) ||
        tx.campaignTitle.toLowerCase().includes(q) ||
        tx.receiptNumber.toLowerCase().includes(q) ||
        tx.referenceCode.toLowerCase().includes(q)
      );
    });
  }, [combinedTransactions, ledgerSearch, ledgerMethodFilter, ledgerTypeFilter]);

  const filteredDonors = useMemo(() => {
    const q = donorSearch.trim().toLowerCase();
    return donors.filter((d) => {
      if (donorRoleFilter !== 'All' && (d.role || 'user') !== donorRoleFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.recurringPlan.toLowerCase().includes(q)
      );
    });
  }, [donors, donorSearch, donorRoleFilter]);

  const filteredLetters = useMemo(() => {
    const sorted = [...letters].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    });
    if (letterFilter === 'all') return sorted;
    return sorted.filter((l) => l.status === letterFilter);
  }, [letters, letterFilter]);

  // ================= HANDLERS: QUICK ACTIONS =================
  const triggerQuickActionAddChild = () => {
    openAddChild();
    setActiveTab('children');
  };

  const triggerQuickActionPublishUpdate = () => {
    setActiveTab('campaigns');
  };

  const triggerQuickActionReviewLetters = () => {
    setLetterFilter('pending');
    setActiveTab('letters');
  };

  // ================= HANDLERS: MODULE 2 (CHILD CMS & SPONSORSHIP TRACKING) =================
  const openAddChild = () => {
    setEditingChild(null);
    setChildName('');
    setChildAge('9');
    setChildGender('Girl');
    setChildDistrict('Soroti District, Uganda');
    setChildSchool('St. Mary\'s Primary · Primary 4');
    setChildMonthlyUSD('35');
    setChildBio('');
    setChildDream('');
    setChildPhotoUrl(
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
    );
    setChildStatus('available');
    setChildSponsorName('');
    setChildSponsorEmail('');
    setChildFormError('');
    setShowChildForm(true);
  };

  const openEditChild = (child: ChildProfile) => {
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
    setShowChildForm(true);
  };

  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    nameSetter?: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (nameSetter) nameSetter(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChild = (e: React.FormEvent) => {
    e.preventDefault();
    setChildFormError('');
    if (!childName.trim()) return;

    if (childStatus === 'sponsored' && !childSponsorName.trim()) {
      setChildFormError(
        'Please specify the linked Sponsor Donor Name when marking a child as Sponsored so sponsorship tracking stays accurate.'
      );
      return;
    }

    const record: ChildProfile = {
      id: editingChild ? editingChild.id : `child-${Date.now()}`,
      name: childName.trim(),
      age: Number(childAge) || 9,
      gender: childGender,
      district: childDistrict.trim(),
      schoolAndGrade: childSchool.trim(),
      monthlySponsorshipUSD: Number(childMonthlyUSD) || 35,
      bio: childBio.trim(),
      dream: childDream.trim() || 'Wants to complete education and serve the community',
      photoUrl: childPhotoUrl.trim(),
      status: childStatus,
      sponsorName: childStatus === 'sponsored' ? childSponsorName.trim() : undefined,
      sponsorEmail: childStatus === 'sponsored' ? childSponsorEmail.trim() : undefined,
      sponsoredSince:
        childStatus === 'sponsored'
          ? editingChild?.sponsoredSince ||
            new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
          : undefined,
    };

    const next = editingChild
      ? childrenList.map((c) => (c.id === editingChild.id ? record : c))
      : [record, ...childrenList];

    setChildrenList(next);
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setShowChildForm(false);
    setEditingChild(null);
    notify(
      editingChild
        ? `Updated child profile for ${record.name}.`
        : `Added ${record.name} to the Child Sponsorship Directory.`
    );
  };

  const assignSponsorToChild = (child: ChildProfile, donor: DonorDirectoryEntry) => {
    if (child.status === 'sponsored' && child.sponsorName) {
      notify(
        `Double-sponsorship prevented: ${child.name} is already sponsored by ${child.sponsorName}.`
      );
      return;
    }
    const next = childrenList.map((c) =>
      c.id === child.id
        ? {
            ...c,
            status: 'sponsored' as const,
            sponsorName: donor.name,
            sponsorEmail: donor.email,
            sponsoredSince: new Date().toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric',
            }),
          }
        : c
    );
    setChildrenList(next);
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    notify(`Linked sponsor ${donor.name} to ${child.name}.`);
  };

  const unlinkChildSponsor = (childId: string) => {
    const next = childrenList.map((c) =>
      c.id === childId
        ? {
            ...c,
            status: 'available' as const,
            sponsorName: undefined,
            sponsorEmail: undefined,
            sponsoredSince: undefined,
          }
        : c
    );
    setChildrenList(next);
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    notify('Child sponsorship unlinked and status returned to Available.');
  };

  // ================= HANDLERS: MODULE 3 (LETTERS & FIELD UPLOADS) =================
  const startEditingLetter = (letter: ChildLetter) => {
    setEditingLetterId(letter.id);
    setEditingLetterText(letter.message);
  };

  const saveEditedLetter = (id: string) => {
    if (!editingLetterText.trim()) return;
    const next = letters.map((l) =>
      l.id === id ? { ...l, message: editingLetterText.trim(), editedByAdmin: true } : l
    );
    setLetters(next);
    try {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setEditingLetterId(null);
    notify('Message edited for child safety & privacy compliance.');
  };

  const moderateLetter = (id: string, status: ChildLetter['status']) => {
    const next = letters.map((l) => (l.id === id ? { ...l, status } : l));
    setLetters(next);
    try {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    notify(
      status === 'approved'
        ? 'Letter approved and queued for field delivery.'
        : 'Letter rejected and held from field delivery.'
    );
  };

  const handleFieldUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadNotes.trim()) return;

    const targetName =
      uploadTargetType === 'child'
        ? childrenList.find((c) => c.id === uploadTargetId)?.name || 'Sponsored Child'
        : campaigns.find((c) => c.id === uploadTargetId)?.title || 'Community Project';

    const newUpload: FieldUpdateUpload = {
      id: `fld-${Date.now()}`,
      title: uploadTitle.trim(),
      documentType: uploadDocType,
      targetType: uploadTargetType,
      targetId: uploadTargetId,
      targetName,
      termOrPeriod: uploadTerm.trim() || 'Term 3 · 2026',
      notes: uploadNotes.trim(),
      attachmentUrl: uploadAttachmentUrl.trim(),
      fileName: uploadFileName.trim() || 'field_update_attachment.pdf',
      uploadedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      uploadedBy: 'NGO Field Officer',
    };

    const next = [newUpload, ...fieldUploads];
    setFieldUploads(next);
    try {
      localStorage.setItem(FIELD_UPDATES_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setUploadTitle('');
    setUploadNotes('');
    setShowFieldUploadForm(false);
    notify(`Uploaded ${newUpload.documentType} for ${targetName} and broadcast to donor feeds.`);
  };

  // ================= HANDLERS: MODULE 4 (DONATION & FINANCIAL RECORDS) =================
  const handleManualLedgerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(manualAmountUGX);
    if (!manualDonorName.trim() || !amount || amount <= 0) return;

    const targetCamp = campaigns.find((c) => c.id === manualCampaignId) || campaigns[0];
    const receiptNum = `GCC-RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: receiptNum,
      donorName: manualDonorName.trim(),
      donorEmail: manualDonorEmail.trim() || 'offline.receipt@thegccfoundation.com',
      campaignId: targetCamp?.id || 'general-fund',
      campaignTitle: targetCamp?.title || 'General Institutional Fund',
      amountUGX: amount,
      paymentMethod: manualPaymentMethod,
      entryType: manualEntryType,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      monthTag: 'this-month',
      referenceCode: manualReferenceCode.trim() || `MAN-${Date.now().toString().slice(-6)}`,
      notes: manualNotes.trim() || 'Logged by Admin Finance Desk',
    };

    const nextLedger = [newTx, ...ledger];
    setLedger(nextLedger);
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(nextLedger));
    } catch {}

    if (targetCamp) {
      updateCampaign({
        ...targetCamp,
        raisedUGX: targetCamp.raisedUGX + amount,
        donorCount: targetCamp.donorCount + 1,
      });
    }

    setManualDonorName('');
    setManualDonorEmail('');
    setManualAmountUGX('500000');
    setManualReferenceCode('');
    setManualNotes('');
    setShowManualEntryForm(false);
    setSelectedReceiptTx(newTx);
    notify(`Logged ${formatUGX(amount)} (${manualPaymentMethod}) and generated receipt ${receiptNum}.`);
  };

  const exportTransactions = (format: 'csv' | 'excel') => {
    const headers = [
      'Receipt Number',
      'Date',
      'Supporter Name',
      'Supporter Email',
      'Campaign',
      'Amount (UGX)',
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
      `"${tx.campaignTitle}"`,
      tx.amountUGX,
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

    const content =
      mime + [headers.join(separator), ...rows.map((r) => r.join(separator))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(content));
    link.setAttribute('download', `gcc_foundation_financial_ledger_2026.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${filteredLedger.length} financial records as ${ext.toUpperCase()}.`);
  };

  // ================= HANDLERS: MODULE 5 (DONOR & MEMBER DIRECTORY) =================
  const openEditDonorModal = (donor: DonorDirectoryEntry) => {
    setEditingDonor(donor);
    setNewDonorName(donor.name);
    setNewDonorEmail(donor.email);
    setNewDonorPhone(donor.phone);
    setNewDonorAddress(donor.address);
    setNewDonorAmount(String(donor.totalDonatedUGX));
    setNewDonorPlan(donor.recurringPlan);
    setNewDonorRole(donor.role || 'user');
    setShowAddDonor(true);
  };

  const handleSaveDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorName.trim() || !newDonorEmail.trim()) return;

    if (editingDonor) {
      const updated: DonorDirectoryEntry = {
        ...editingDonor,
        name: newDonorName.trim(),
        email: newDonorEmail.trim(),
        phone: newDonorPhone.trim() || editingDonor.phone,
        address: newDonorAddress.trim() || editingDonor.address,
        totalDonatedUGX: Number(newDonorAmount) || 0,
        recurringPlan: newDonorPlan,
        role: newDonorRole,
      };
      const next = donors.map((d) => (d.id === editingDonor.id ? updated : d));
      setDonors(next);
      try {
        localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      notify(`Updated member profile for ${updated.name}.`);
    } else {
      const entry: DonorDirectoryEntry = {
        id: `dnr-${Date.now()}`,
        name: newDonorName.trim(),
        email: newDonorEmail.trim(),
        phone: newDonorPhone.trim() || '+256 703 601 200',
        address: newDonorAddress.trim() || 'Kampala, Uganda',
        totalDonatedUGX: Number(newDonorAmount) || 0,
        donationsCount: 1,
        recurringPlan: newDonorPlan,
        joinedDate: 'Nov 2026',
        role: newDonorRole,
        accountStatus: 'active',
      };
      const next = [entry, ...donors];
      setDonors(next);
      try {
        localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      notify(`Added supporter ${entry.name} to the directory.`);
    }

    setEditingDonor(null);
    setNewDonorName('');
    setNewDonorEmail('');
    setNewDonorPhone('');
    setNewDonorAddress('');
    setShowAddDonor(false);
  };

  const changeDonorRole = (id: string, role: 'user' | 'volunteer' | 'admin') => {
    const next = donors.map((d) => (d.id === id ? { ...d, role } : d));
    setDonors(next);
    try {
      localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    const target = donors.find((d) => d.id === id);
    notify(`Updated role for ${target?.name || 'member'} to ${role.toUpperCase()}.`);
  };

  const toggleDonorAccountStatus = (id: string) => {
    const next = donors.map((d) =>
      d.id === id
        ? {
            ...d,
            accountStatus: (d.accountStatus === 'deactivated' ? 'active' : 'deactivated') as
              | 'active'
              | 'deactivated',
          }
        : d
    );
    setDonors(next);
    try {
      localStorage.setItem(DONORS_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    const target = next.find((d) => d.id === id);
    notify(
      `Account for ${target?.name} is now ${target?.accountStatus?.toUpperCase()}.`
    );
  };

  // ================= HANDLERS: MODULE 6 (CAMPAIGN & CONTENT MANAGER) =================
  const openCreateCampaignEditor = () => {
    setEditingCampaign(null);
    setCampTitle('');
    setCampSubtitle('');
    setCampCategory('Medical Care');
    setCampDistrict('Kampala, Uganda');
    setCampInstitution('Uganda Heart Institute Accounts Treasury');
    setCampGoalUGX('15000000');
    setCampCoverImage(
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80'
    );
    setCampStory('');
    setShowCampaignEditor(true);
  };

  const openEditCampaignEditor = (camp: Campaign) => {
    setEditingCampaign(camp);
    setCampTitle(camp.title);
    setCampSubtitle(camp.subtitle);
    setCampCategory(camp.category);
    setCampDistrict(`${camp.location.district}, ${camp.location.country}`);
    setCampInstitution(camp.payoutVerification.institutionName);
    setCampGoalUGX(String(camp.goalUGX));
    setCampCoverImage(camp.coverImage);
    setCampStory(camp.fullStoryHtml.join('\n\n'));
    setShowCampaignEditor(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle.trim()) return;

    if (editingCampaign) {
      const updated: Campaign = {
        ...editingCampaign,
        title: campTitle.trim(),
        subtitle: campSubtitle.trim() || editingCampaign.subtitle,
        category: campCategory,
        goalUGX: Number(campGoalUGX) || editingCampaign.goalUGX,
        coverImage: campCoverImage.trim() || editingCampaign.coverImage,
        location: {
          ...editingCampaign.location,
          district: campDistrict.split(',')[0]?.trim() || editingCampaign.location.district,
        },
        payoutVerification: {
          ...editingCampaign.payoutVerification,
          institutionName: campInstitution.trim() || editingCampaign.payoutVerification.institutionName,
        },
        fullStoryHtml: campStory
          .split(/\n\n+/)
          .map((p) => p.trim())
          .filter(Boolean),
      };
      updateCampaign(updated);
      notify(`Updated campaign "${updated.title}".`);
    } else {
      const slug = campTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newCampaign: Campaign = {
        id: `camp-admin-${Date.now()}`,
        slug,
        title: campTitle.trim(),
        subtitle:
          campSubtitle.trim() ||
          'Verified institutional fundraiser with 100% direct bank settlement.',
        category: campCategory,
        location: {
          district: campDistrict.split(',')[0]?.trim() || 'Kampala',
          subCounty: 'Central Division',
          country: 'Uganda',
          facilityName: campInstitution.trim(),
        },
        goalUGX: Number(campGoalUGX) || 15000000,
        raisedUGX: 0,
        donorCount: 0,
        daysRemaining: 45,
        createdAt: new Date().toISOString().split('T')[0],
        urgent: true,
        featured: true,
        coverImage:
          campCoverImage.trim() ||
          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80',
        galleryImages: [],
        payoutVerification: {
          type: 'Direct-to-Hospital',
          institutionName: campInstitution.trim() || 'Verified Partner Institution',
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
          relationshipToBeneficiary: 'Direct Institutional Partner',
          phoneMasked: '+256 703 ••• 200',
          avatarUrl: '/images/gcc-logo.png',
          residence: campDistrict.trim(),
        },
        beneficiary: {
          name: campTitle.trim(),
          storySummary: campSubtitle.trim() || campTitle.trim(),
        },
        fullStoryHtml: campStory
          .split(/\n\n+/)
          .map((p) => p.trim())
          .filter(Boolean),
        itemizedBudget: [],
        fieldUpdates: [],
        recentDonors: [],
        volunteerPledges: [],
      };
      addNewCampaign(newCampaign);
      notify(`Published new campaign "${newCampaign.title}" to the public site.`);
    }

    setShowCampaignEditor(false);
    setEditingCampaign(null);
  };

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;
    const linkedCamp = campaigns.find((c) => c.id === newsCampaignId);
    const item: NewsMilestoneItem = {
      id: `news-${Date.now()}`,
      title: newsTitle.trim(),
      category: newsCategory,
      summary: newsSummary.trim(),
      publishedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      author: 'GCC Staff Operations',
      campaignId: linkedCamp?.id,
      campaignTitle: linkedCamp?.title,
      imageUrl: newsImageUrl.trim() || undefined,
    };
    const next = [item, ...newsList];
    setNewsList(next);
    try {
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(next));
    } catch {}

    if (linkedCamp) {
      updateCampaign({
        ...linkedCamp,
        fieldUpdates: [
          {
            id: `fu-${Date.now()}`,
            date: item.publishedAt,
            title: item.title,
            authorName: 'GCC Field Operations',
            authorRole: 'Verified Program Officer',
            content: item.summary,
            imageUrl: item.imageUrl,
            verifiedByOfficer: 'Pauline Namukasa, FCCA',
          },
          ...linkedCamp.fieldUpdates,
        ],
      });
    }

    setNewsTitle('');
    setNewsSummary('');
    notify('Milestone update published and broadcast to supporters\' Your Impact feeds!');
  };

  const updatePayout = (id: string, status: PayoutRow['status']) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    notify(`Payout voucher ${id} marked as ${status}.`);
  };

  const navItems = [
    {
      id: 'command',
      code: 'MOD-01',
      label: 'Command Center',
      sub: 'Overview & Live Telemetry',
      icon: LayoutDashboard,
    },
    {
      id: 'children',
      code: 'MOD-02',
      label: 'Child Sponsorship CMS',
      sub: `${childrenList.length} Profiles · Sponsorship Lock`,
      icon: HeartHandshake,
    },
    {
      id: 'letters',
      code: 'MOD-03',
      label: 'Moderation & Field Files',
      sub: `${letters.filter((l) => l.status === 'pending').length} Pending Review`,
      icon: MailCheck,
    },
    {
      id: 'financials',
      code: 'MOD-04',
      label: 'Donation & Ledger',
      sub: 'Global Records & CSV/XLS',
      icon: DollarSign,
    },
    {
      id: 'donors',
      code: 'MOD-05',
      label: 'Supporter Directory',
      sub: `${donors.length} Members & Roles`,
      icon: Users,
    },
    {
      id: 'campaigns',
      code: 'MOD-06',
      label: 'Campaign & Content',
      sub: 'Project Creator & Broadcast',
      icon: FileText,
    },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'command':
        return (
          <div className="space-y-6">
            {/* High-Level Financial Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                label="RAISED THIS MONTH"
                value={formatUGX(thisMonthRaisedUGX)}
                sub="Current calendar month"
                iconColor="text-[#02A95C]"
                bgColor="bg-white"
              />
              <MetricCard
                label="RAISED THIS YEAR (2026)"
                value={formatUGX(thisYearRaisedUGX)}
                sub="Fiscal year-to-date"
                iconColor="text-sky-500"
                bgColor="bg-white"
              />
              <MetricCard
                label="TOTAL RAISED (ALL-TIME)"
                value={formatUGX(allTimeRaisedUGX)}
                sub="100% Direct Institutional Escrow"
                iconColor="text-amber-500"
                bgColor="bg-white"
              />
              <MetricCard
                label="MONTHLY RECURRING DONORS"
                value={activeMonthlyRecurringDonors.toString()}
                sub="Active monthly pledges"
                iconColor="text-purple-500"
                bgColor="bg-white"
              />
              <MetricCard
                label="ACTIVE SPONSORSHIPS"
                value={`${activeSponsorshipsCount} / ${childrenList.length}`}
                sub={`${childrenList.filter((c) => c.status === 'available').length} awaiting sponsor`}
                iconColor="text-rose-500"
                bgColor="bg-white"
              />
            </div>

            {/* Quick Action Shortcuts */}
            <SectionCard title="Quick Action Shortcuts" subtitle="Execute staff operations across child profiles, field broadcasts, and message moderation.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <QuickActionButton
                  onClick={triggerQuickActionAddChild}
                  icon={<HeartHandshake className="h-5 w-5" />}
                  title="Add New Child Profile"
                  description="Launch the Child Sponsorship Wizard to upload a verified portrait, bio, dream, and monthly cost."
                  iconBg="bg-[#02A95C]"
                />
                <QuickActionButton
                  onClick={triggerQuickActionPublishUpdate}
                  icon={<Megaphone className="h-5 w-5" />}
                  title="Publish a Project Update"
                  description="Broadcast verified field milestones, photos, and news directly to donors' Your Impact feeds."
                  iconBg="bg-sky-500"
                />
                <QuickActionButton
                  onClick={triggerQuickActionReviewLetters}
                  icon={<MailCheck className="h-5 w-5" />}
                  title={`Review Pending Letters (${letters.filter((l) => l.status === 'pending').length})`}
                  description="Inspect, edit for safety/privacy, and approve incoming donor messages to sponsored children."
                  iconBg="bg-amber-500"
                />
              </div>
            </SectionCard>

            {/* Recent Transactions Feed */}
            <SectionCard title="Recent Transactions Feed" subtitle="Real-time feed showing who gave what, when, and to which campaign." action={<button onClick={() => setActiveTab('financials')} className="text-xs font-bold text-[#02A95C] hover:underline">OPEN GLOBAL GIVING LEDGER →</button>}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FBF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Receipt & Date</th>
                      <th className="py-3 px-4">Donor</th>
                      <th className="py-3 px-4">Campaign Supported</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {combinedTransactions.slice(0, 8).map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FBF9F6]">
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <strong className="text-gray-900 block">{tx.receiptNumber}</strong>
                          <span className="text-gray-500">{tx.date}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="font-bold text-gray-900 block">{tx.donorName}</strong>
                          <span className="text-xs text-gray-500">{tx.donorEmail}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-700 font-medium">{tx.campaignTitle}</td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-semibold text-gray-700">
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#02A95C]">
                          {formatUGX(tx.amountUGX)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Institutional EFT Payouts */}
            <SectionCard title="Institutional Bank EFT Payout Queue" subtitle="Approve and settle direct bank wires to verified hospital treasuries, school bursars, and borehole contractors." badge={<span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-bold text-emerald-800">ESCROW VERIFIED</span>}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FBF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Voucher ID & Date</th>
                      <th className="py-3 px-4">Campaign</th>
                      <th className="py-3 px-4">Receiving Institution</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FBF9F6]">
                        <td className="py-4 px-4 font-mono text-xs">
                          <strong className="text-gray-900 block">{p.id}</strong>
                          <span className="text-gray-500">{p.date}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900 max-w-xs">
                          {p.campaignTitle}
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-600">
                          <strong className="text-gray-900 block">{p.institution}</strong>
                          <span className="font-mono">{p.bankAccount}</span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-gray-900">
                          {formatUGX(p.amountUGX)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
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
                        <td className="py-4 px-4 text-right space-x-2">
                          {p.status === 'Pending Review' && (
                            <button
                              type="button"
                              onClick={() => updatePayout(p.id, 'Approved')}
                              className="rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1.5 text-xs font-bold"
                            >
                              Approve
                            </button>
                          )}
                          {p.status !== 'Settled via EFT' && (
                            <button
                              type="button"
                              onClick={() => updatePayout(p.id, 'Settled via EFT')}
                              className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] text-white px-3.5 py-1.5 text-xs font-bold"
                            >
                              Settle EFT Wire
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        );

      case 'children':
        return (
          <div className="space-y-6">
            <SectionCardHeader
              title="Child Sponsorship Management (CMS)"
              subtitle="Child Profile Directory, Add/Edit Child Wizard, and Sponsorship Tracking with double-sponsorship protection."
              action={
                <button onClick={openAddChild} className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-5 py-2.5 text-xs font-bold text-white">
                  <Plus className="h-4 w-4" />
                  <span>ADD NEW CHILD PROFILE</span>
                </button>
              }
            />

            {showChildForm && (
              <FormCard title={editingChild ? `Edit Child Wizard: ${editingChild.name}` : 'Add New Child Wizard'} onClose={() => setShowChildForm(false)}>
                {childFormError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm font-semibold text-red-700 mb-4">
                    {childFormError}
                  </div>
                )}
                <form onSubmit={handleSaveChild} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Child's Full Name" required>
                      <input type="text" required value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="e.g. Grace Nakato" className="input-field" />
                    </FormField>
                    <FormField label="Age" required>
                      <input type="number" required min="1" max="19" value={childAge} onChange={(e) => setChildAge(e.target.value)} className="input-field" />
                    </FormField>
                    <FormField label="Gender" required>
                      <select value={childGender} onChange={(e) => setChildGender(e.target.value as 'Girl' | 'Boy')} className="input-field">
                        <option value="Girl">Girl</option>
                        <option value="Boy">Boy</option>
                      </select>
                    </FormField>
                    <FormField label="District / Location" required>
                      <input type="text" required value={childDistrict} onChange={(e) => setChildDistrict(e.target.value)} placeholder="Soroti District, Uganda" className="input-field" />
                    </FormField>
                    <FormField label="School & Grade Level" required>
                      <input type="text" required value={childSchool} onChange={(e) => setChildSchool(e.target.value)} placeholder="St. Mary's Primary · Primary 4" className="input-field" />
                    </FormField>
                    <FormField label="Monthly Sponsorship Cost (USD)" required>
                      <input type="number" required min="10" value={childMonthlyUSD} onChange={(e) => setChildMonthlyUSD(e.target.value)} className="input-field" />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Child's Dream / Goal" required>
                      <input type="text" required value={childDream} onChange={(e) => setChildDream(e.target.value)} placeholder="Wants to become a pediatric heart surgeon" className="input-field" />
                    </FormField>
                    <FormField label="Sponsorship Status" required>
                      <select value={childStatus} onChange={(e) => setChildStatus(e.target.value as 'available' | 'sponsored')} className="input-field font-bold">
                        <option value="available">Available</option>
                        <option value="sponsored">Sponsored</option>
                      </select>
                    </FormField>
                    <FormField label="Verified Portrait (Upload or URL)">
                      <div className="flex items-center gap-2">
                        <input type="text" value={childPhotoUrl} onChange={(e) => setChildPhotoUrl(e.target.value)} className="input-field flex-1" />
                        <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                          <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, setChildPhotoUrl)} className="hidden" />
                        </label>
                      </div>
                    </FormField>
                  </div>

                  {childStatus === 'sponsored' && (
                    <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <FormField label="Linked Sponsor Donor Name" required>
                        <input type="text" required value={childSponsorName} onChange={(e) => setChildSponsorName(e.target.value)} placeholder="e.g. Sarah Jenkins" className="input-field" />
                      </FormField>
                      <FormField label="Linked Sponsor Email">
                        <input type="email" value={childSponsorEmail} onChange={(e) => setChildSponsorEmail(e.target.value)} placeholder="sarah.jenkins@example.org" className="input-field" />
                      </FormField>
                      <FormField label="Quick-Fill from Supporter Directory">
                        <select onChange={(e) => {
                          const found = donors.find((d) => d.id === e.target.value);
                          if (found) {
                            setChildSponsorName(found.name);
                            setChildSponsorEmail(found.email);
                          }
                        }} defaultValue="" className="input-field">
                          <option value="" disabled>Select existing donor...</option>
                          {donors.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.email})
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </div>
                  )}

                  <FormField label="Biographical Details & Sponsorship Needs" required fullWidth>
                    <textarea rows={3} required value={childBio} onChange={(e) => setChildBio(e.target.value)} placeholder="Describe the child's story, school needs, and how monthly sponsorship supports them..." className="input-field" />
                  </FormField>

                  <button type="submit" className="w-full rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-3 text-sm font-bold text-white">
                    {editingChild ? 'SAVE CHILD PROFILE CHANGES' : 'PUBLISH CHILD PROFILE'}
                  </button>
                </form>
              </FormCard>
            )}

            <DataTable>
              <thead className="bg-[#FBF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Child Profile</th>
                  <th className="py-3.5 px-4">Location & School</th>
                  <th className="py-3.5 px-4">Dream / Goals</th>
                  <th className="py-3.5 px-4">Monthly Cost</th>
                  <th className="py-3.5 px-4">Status & Sponsorship Tracking</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {childrenList.map((child) => (
                  <tr key={child.id} className="hover:bg-[#FBF9F6] align-top">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={child.photoUrl} alt={child.name} className="h-14 w-14 rounded-xl object-cover shrink-0 bg-gray-100" />
                        <div>
                          <strong className="font-bold text-sm text-gray-900 block">{child.name}</strong>
                          <span className="text-xs text-gray-500">{child.age} yrs · {child.gender}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">
                      <strong className="text-gray-900 block">{child.district}</strong>
                      <span>{child.schoolAndGrade}</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600 max-w-xs">
                      <span className="font-semibold text-[#02A95C] block">{child.dream}</span>
                      <span className="line-clamp-2 text-gray-500 mt-0.5">{child.bio}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-gray-900">${child.monthlySponsorshipUSD}/mo</td>
                    <td className="py-4 px-4">
                      {child.status === 'sponsored' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 text-sky-800 px-2.5 py-0.5 font-mono text-[10px] font-bold">
                            <Lock className="h-3 w-3" />
                            <span>Sponsored (Locked)</span>
                          </span>
                          <p className="text-xs font-bold text-gray-900">Sponsor: {child.sponsorName || 'Assigned Donor'}</p>
                          {child.sponsorEmail && <p className="text-[11px] text-gray-500">{child.sponsorEmail}</p>}
                          {child.sponsoredSince && <p className="text-[10px] text-gray-400">Since {child.sponsoredSince}</p>}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-mono text-[10px] font-bold">Available</span>
                          <div>
                            <select onChange={(e) => { const donor = donors.find((d) => d.id === e.target.value); if (donor) assignSponsorToChild(child, donor); }} defaultValue="" className="input-field h-8 text-xs">
                              <option value="" disabled>+ Link Sponsor Donor...</option>
                              {donors.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                            </select>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-y-1.5">
                      <button onClick={() => openEditChild(child)} className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      {child.status === 'sponsored' && (
                        <button onClick={() => unlinkChildSponsor(child.id)} className="block ml-auto rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800">
                          Unlink Sponsor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        );

      case 'letters':
        return (
          <div className="space-y-6">
            <SectionCardHeader
              title="Incoming Donor Messages & Safety Moderation Queue"
              subtitle="Pending messages appear first. Review, edit for child privacy/safety, and Approve or Reject before field delivery."
              action={
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button key={status} onClick={() => setLetterFilter(status)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase ${letterFilter === status ? 'bg-[#02A95C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {status}
                    </button>
                  ))}
                </div>
              }
            />

            <SectionCard>
              <div className="space-y-4">
                {filteredLetters.map((letter) => (
                  <div key={letter.id} className="rounded-xl border border-gray-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold uppercase text-[10px] ${letter.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : letter.status === 'rejected' || letter.status === 'flagged' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                          {letter.status === 'pending' ? 'Pending Safety Check' : letter.status === 'approved' ? 'Approved for Field Delivery' : 'Rejected / Held'}
                        </span>
                        {letter.editedByAdmin && <span className="rounded-full bg-sky-50 text-sky-700 px-2 py-0.5 font-mono text-[10px] font-bold">Edited by Admin for Safety</span>}
                        <span className="font-semibold text-gray-800">From: {letter.donorName} ({letter.donorEmail})</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-bold text-[#02A95C]">To Sponsored Child: {letter.childName}</span>
                        <span className="text-gray-400">• {letter.createdAt}</span>
                      </div>

                      {editingLetterId === letter.id ? (
                        <div className="space-y-2">
                          <textarea rows={3} value={editingLetterText} onChange={(e) => setEditingLetterText(e.target.value)} className="w-full rounded-xl border border-[#02A95C] bg-white p-3 text-sm" />
                          <div className="flex items-center gap-2">
                            <button onClick={() => saveEditedLetter(letter.id)} className="rounded-full bg-[#02A95C] px-4 py-1.5 text-xs font-bold text-white">Save Safety Edit</button>
                            <button onClick={() => setEditingLetterId(null)} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-3.5 italic">"{letter.message}"</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button onClick={() => startEditingLetter(letter)} className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white hover:bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-700">
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      {letter.status !== 'approved' && <button onClick={() => moderateLetter(letter.id, 'approved')} className="inline-flex items-center gap-1 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white"><Check className="h-3.5 w-3.5" /><span>Approve</span></button>}
                      {letter.status !== 'rejected' && <button onClick={() => moderateLetter(letter.id, 'rejected')} className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 text-xs font-bold text-red-700"><X className="h-3.5 w-3.5" /><span>Reject</span></button>}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Field Update Uploads */}
            <SectionCardHeader
              title="Field Update Uploads (Report Cards, Photos & Progress Letters)"
              subtitle="Upload batch termly report cards, verified field photos, and progress letters from the field and attach them to specific children or projects."
              action={
                <button onClick={() => setShowFieldUploadForm((v) => !v)} className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-5 py-2.5 text-xs font-bold text-white">
                  <FolderUp className="h-4 w-4" />
                  <span>{showFieldUploadForm ? 'CLOSE UPLOAD FORM' : 'UPLOAD FIELD REPORT'}</span>
                </button>
              }
            />

            {showFieldUploadForm && (
              <FormCard title="Upload Field Report" onClose={() => setShowFieldUploadForm(false)}>
                <form onSubmit={handleFieldUploadSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Document / Batch Title" required>
                      <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g. Term 3 Academic Report Card" className="input-field" />
                    </FormField>
                    <FormField label="Upload Type" required>
                      <select value={uploadDocType} onChange={(e) => setUploadDocType(e.target.value as FieldUpdateUpload['documentType'])} className="input-field">
                        <option value="Termly Report Card">Termly Report Card</option>
                        <option value="Field Progress Letter">Field Progress Letter</option>
                        <option value="Verified Field Photo">Verified Field Photo</option>
                      </select>
                    </FormField>
                    <FormField label="Term / Reporting Period">
                      <input type="text" value={uploadTerm} onChange={(e) => setUploadTerm(e.target.value)} placeholder="Term 3 · 2026" className="input-field" />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Attach To" required>
                      <select value={uploadTargetType} onChange={(e) => { const nextType = e.target.value as 'child' | 'project'; setUploadTargetType(nextType); setUploadTargetId(nextType === 'child' ? childrenList[0]?.id || 'child-01' : campaigns[0]?.id || 'camp-01'); }} className="input-field">
                        <option value="child">Sponsored Child</option>
                        <option value="project">Fundraising Project</option>
                      </select>
                    </FormField>
                    <FormField label={`Select ${uploadTargetType === 'child' ? 'Child' : 'Project'}`} required>
                      <select value={uploadTargetId} onChange={(e) => setUploadTargetId(e.target.value)} className="input-field">
                        {uploadTargetType === 'child' ? childrenList.map((c) => (<option key={c.id} value={c.id}>{c.name} ({c.district})</option>)) : campaigns.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                      </select>
                    </FormField>
                    <FormField label="File / Scan Upload" required>
                      <div className="flex items-center gap-2">
                        <input type="text" value={uploadFileName} onChange={(e) => setUploadFileName(e.target.value)} placeholder="report_card.pdf" className="input-field flex-1" />
                        <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Browse</span>
                          <input type="file" accept="image/*,.pdf" onChange={(e) => handleImageFileUpload(e, setUploadAttachmentUrl, setUploadFileName)} className="hidden" />
                        </label>
                      </div>
                    </FormField>
                  </div>

                  <FormField label="Teacher / Field Officer Progress Notes" required fullWidth>
                    <textarea rows={2} required value={uploadNotes} onChange={(e) => setUploadNotes(e.target.value)} placeholder="Summarize academic grades, health checkup notes, or field progress..." className="input-field" />
                  </FormField>

                  <button type="submit" className="w-full rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-3 text-sm font-bold text-white">ATTACH & BROADCAST FIELD UPLOAD</button>
                </form>
              </FormCard>
            )}

            <SectionCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldUploads.map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-mono text-[10px] font-bold">{item.documentType}</span>
                        <span className="text-xs font-bold text-gray-800">Attached to: {item.targetName}</span>
                        <span className="text-xs text-gray-400">• {item.termOrPeriod}</span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.notes}</p>
                      <p className="text-[11px] text-gray-400 font-mono">File: {item.fileName} · Uploaded {item.uploadedAt} by {item.uploadedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        );

      case 'financials':
        return (
          <div className="space-y-6">
            <SectionCardHeader
              title="Global Giving Ledger & Financial Records"
              subtitle="Searchable, filterable database of every transaction across the organization, offline manual entry, receipt generator, and CSV/Excel accounting export."
              action={
                <div className="flex flex-wrap items-center gap-2.5">
                  <button onClick={() => setShowManualEntryForm((v) => !v)} className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /><span>{showManualEntryForm ? 'CLOSE OFFLINE FORM' : 'LOG OFFLINE DONATION'}</span></button>
                  <button onClick={() => exportTransactions('csv')} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 hover:bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700"><Download className="h-3.5 w-3.5" /><span>EXPORT CSV</span></button>
                  <button onClick={() => exportTransactions('excel')} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-900"><FileSpreadsheet className="h-3.5 w-3.5" /><span>EXPORT EXCEL (.XLS)</span></button>
                </div>
              }
            />

            {showManualEntryForm && (
              <FormCard title="Manual Offline Donation Entry & Financial Adjustment" subtitle="Updates campaign totals & generates receipt" onClose={() => setShowManualEntryForm(false)}>
                <form onSubmit={handleManualLedgerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Donor Name" required><input type="text" required value={manualDonorName} onChange={(e) => setManualDonorName(e.target.value)} placeholder="e.g. Centenary Bank Wire / Walk-in Donor" className="input-field" /></FormField>
                    <FormField label="Donor Email (for Receipt)"><input type="email" value={manualDonorEmail} onChange={(e) => setManualDonorEmail(e.target.value)} placeholder="donor@example.org" className="input-field" /></FormField>
                    <FormField label="Target Campaign" required>
                      <select value={manualCampaignId || campaigns[0]?.id || ''} onChange={(e) => setManualCampaignId(e.target.value)} className="input-field">
                        {campaigns.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                      </select>
                    </FormField>
                    <FormField label="Amount (UGX)" required><input type="number" required min="1000" value={manualAmountUGX} onChange={(e) => setManualAmountUGX(e.target.value)} className="input-field" /></FormField>
                    <FormField label="Payment Channel" required>
                      <select value={manualPaymentMethod} onChange={(e) => setManualPaymentMethod(e.target.value as LedgerTransaction['paymentMethod'])} className="input-field">
                        <option value="Offline Cash Receipt">Offline Cash Receipt</option>
                        <option value="Direct Bank Wire (EFT)">Direct Bank Wire (EFT)</option>
                        <option value="Mobile Money Receipt (Manual)">Mobile Money Receipt (Manual)</option>
                        <option value="MTN MoMo">MTN MoMo</option>
                        <option value="Airtel Money">Airtel Money</option>
                      </select>
                    </FormField>
                    <FormField label="Entry Classification" required>
                      <select value={manualEntryType} onChange={(e) => setManualEntryType(e.target.value as LedgerTransaction['entryType'])} className="input-field">
                        <option value="Manual Offline Entry">Manual Offline Entry</option>
                        <option value="Adjustment">Adjustment</option>
                      </select>
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Bank / Cash / MoMo Reference Number"><input type="text" value={manualReferenceCode} onChange={(e) => setManualReferenceCode(e.target.value)} placeholder="e.g. CASH-VCH-2026-205 or EFT-99201" className="input-field" /></FormField>
                    <FormField label="Accounting & Audit Notes"><input type="text" value={manualNotes} onChange={(e) => setManualNotes(e.target.value)} placeholder="Physical receipt book # or bank credit advice note..." className="input-field" /></FormField>
                  </div>
                  <button type="submit" className="w-full rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-3 text-sm font-bold text-white">RECORD TRANSACTION & GENERATE RECEIPT</button>
                </form>
              </FormCard>
            )}

            {selectedReceiptTx && (
              <div className="rounded-xl border-2 border-[#02A95C] bg-emerald-50/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2"><Receipt className="h-4 w-4 text-[#02A95C]" /><span className="font-mono text-xs font-bold uppercase tracking-wider text-[#02A95C]">Official Tax-Deductible Receipt Generated ({selectedReceiptTx.receiptNumber})</span></div>
                  <p className="text-sm font-bold text-gray-900">Donor: {selectedReceiptTx.donorName} · Amount: {formatUGX(selectedReceiptTx.amountUGX)} ({selectedReceiptTx.paymentMethod})</p>
                  <p className="text-xs text-gray-600">Campaign: {selectedReceiptTx.campaignTitle} · Ref: {selectedReceiptTx.referenceCode} · Date: {selectedReceiptTx.date}</p>
                </div>
                <button onClick={() => setSelectedReceiptTx(null)} className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shrink-0">Dismiss Receipt</button>
              </div>
            )}

            <SectionCard>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="relative"><Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" /><input type="search" value={ledgerSearch} onChange={(e) => setLedgerSearch(e.target.value)} placeholder="Search donor, receipt #, campaign, or ref..." className="input-field pl-10" /></div>
                <select value={ledgerMethodFilter} onChange={(e) => setLedgerMethodFilter(e.target.value)} className="input-field"><option value="All">All Payment Channels</option><option value="MTN MoMo">MTN MoMo</option><option value="Airtel Money">Airtel Money</option><option value="Visa / Mastercard">Visa / Mastercard</option><option value="Direct Bank Wire (EFT)">Direct Bank Wire (EFT)</option><option value="Offline Cash Receipt">Offline Cash Receipt</option><option value="Mobile Money Receipt (Manual)">Mobile Money Receipt (Manual)</option></select>
                <select value={ledgerTypeFilter} onChange={(e) => setLedgerTypeFilter(e.target.value)} className="input-field"><option value="All">All Entry Types (Online + Offline)</option><option value="Online">Online</option><option value="Manual Offline Entry">Manual Offline Entry</option><option value="Adjustment">Adjustment</option></select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FBF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider">
                    <tr><th className="py-3.5 px-4">Receipt & Date</th><th className="py-3.5 px-4">Supporter</th><th className="py-3.5 px-4">Campaign</th><th className="py-3.5 px-4">Channel & Type</th><th className="py-3.5 px-4 text-right">Amount</th><th className="py-3.5 px-4 text-right">Receipt</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLedger.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FBF9F6]">
                        <td className="py-3.5 px-4 font-mono text-xs"><strong className="text-gray-900 block">{tx.receiptNumber}</strong><span className="text-gray-500">{tx.date}</span></td>
                        <td className="py-3.5 px-4"><strong className="font-bold text-gray-900 block">{tx.donorName}</strong><span className="text-xs font-mono text-gray-500">{tx.referenceCode}</span></td>
                        <td className="py-3.5 px-4 text-gray-700 max-w-xs"><span className="font-medium block">{tx.campaignTitle}</span>{tx.notes && <span className="text-[11px] text-gray-400">{tx.notes}</span>}</td>
                        <td className="py-3.5 px-4"><span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-gray-700 block w-fit">{tx.paymentMethod}</span><span className="text-[10px] font-mono font-bold text-[#02A95C] uppercase mt-0.5 block">{tx.entryType}</span></td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#02A95C]">{formatUGX(tx.amountUGX)}</td>
                        <td className="py-3.5 px-4 text-right"><button onClick={() => setSelectedReceiptTx(tx)} className="rounded-full border border-gray-300 hover:bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">Receipt</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        );

      case 'donors':
        return (
          <div className="space-y-6">
            <SectionCardHeader
              title="Donor & Member Directory (Supporter Database & User Management)"
              subtitle="Searchable supporter database with lifetime contributions, contact details, role promotion (User / Volunteer / Admin), and account activation controls."
              action={
                <button onClick={() => { setEditingDonor(null); setNewDonorName(''); setNewDonorEmail(''); setNewDonorPhone(''); setNewDonorAddress(''); setShowAddDonor((v) => !v); }} className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /><span>{showAddDonor ? 'CLOSE MEMBER FORM' : 'ADD MEMBER RECORD'}</span></button>
              }
            />

            {showAddDonor && (
              <FormCard title={editingDonor ? `Edit User Details: ${editingDonor.name}` : 'Add New Supporter / Member'} onClose={() => { setShowAddDonor(false); setEditingDonor(null); }}>
                <form onSubmit={handleSaveDonor} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input type="text" required placeholder="Full Name" value={newDonorName} onChange={(e) => setNewDonorName(e.target.value)} className="input-field" />
                    <input type="email" required placeholder="Email Address" value={newDonorEmail} onChange={(e) => setNewDonorEmail(e.target.value)} className="input-field" />
                    <input type="text" placeholder="Phone (+256...)" value={newDonorPhone} onChange={(e) => setNewDonorPhone(e.target.value)} className="input-field" />
                    <input type="text" placeholder="Billing / Tax Address" value={newDonorAddress} onChange={(e) => setNewDonorAddress(e.target.value)} className="input-field" />
                    <input type="number" placeholder="Lifetime Donated (UGX)" value={newDonorAmount} onChange={(e) => setNewDonorAmount(e.target.value)} className="input-field" />
                    <select value={newDonorPlan} onChange={(e) => setNewDonorPlan(e.target.value)} className="input-field"><option>One-Time Supporter</option><option>Monthly ($35 / mo)</option><option>Monthly ($50 / mo)</option><option>Child Sponsor ($45 / mo)</option><option>Major Institutional Donor</option></select>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2"><label className="text-xs font-bold text-gray-700">System Role:</label><select value={newDonorRole} onChange={(e) => setNewDonorRole(e.target.value as 'user' | 'volunteer' | 'admin')} className="input-field h-9 w-auto"><option value="user">Supporter (User)</option><option value="volunteer">Trusted Volunteer</option><option value="admin">NGO Staff Admin</option></select></div>
                    <button type="submit" className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-2 text-xs font-bold text-white">{editingDonor ? 'UPDATE MEMBER' : 'SAVE MEMBER'}</button>
                  </div>
                </form>
              </FormCard>
            )}

            <SectionCard>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 max-w-md"><Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" /><input type="search" value={donorSearch} onChange={(e) => setDonorSearch(e.target.value)} placeholder="Search supporters by name, email, city, or plan..." className="input-field pl-10" /></div>
                <select value={donorRoleFilter} onChange={(e) => setDonorRoleFilter(e.target.value)} className="input-field"><option value="All">All Roles</option><option value="user">Supporters (User)</option><option value="volunteer">Volunteers</option><option value="admin">Admins</option></select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FBF9F6] text-gray-600 font-semibold text-xs uppercase tracking-wider">
                    <tr><th className="py-3.5 px-4">Supporter & Status</th><th className="py-3.5 px-4">Contact & Tax Address</th><th className="py-3.5 px-4">Giving Plan & Lifetime</th><th className="py-3.5 px-4">Role Assignment</th><th className="py-3.5 px-4 text-right">User Management</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDonors.map((d) => {
                      const isDeactivated = d.accountStatus === 'deactivated';
                      return (
                        <tr key={d.id} className={`hover:bg-[#FBF9F6] ${isDeactivated ? 'opacity-60 bg-gray-50' : ''}`}>
                          <td className="py-4 px-4"><div className="flex items-center gap-2"><strong className="font-bold text-gray-900">{d.name}</strong><span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${isDeactivated ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>{isDeactivated ? 'Deactivated' : 'Active'}</span></div><span className="text-xs text-gray-500 block">{d.email}</span><span className="text-[11px] text-gray-400">Joined {d.joinedDate}</span></td>
                          <td className="py-4 px-4 text-xs text-gray-600"><span className="block font-semibold text-gray-800">{d.phone}</span><span>{d.address}</span></td>
                          <td className="py-4 px-4"><span className="rounded-full bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-mono text-xs font-bold">{d.recurringPlan}</span><span className="font-mono font-bold text-gray-900 block mt-1">{formatUGX(d.totalDonatedUGX)} ({d.donationsCount} gifts)</span></td>
                          <td className="py-4 px-4"><select value={d.role || 'user'} onChange={(e) => changeDonorRole(d.id, e.target.value as 'user' | 'volunteer' | 'admin')} className="input-field h-8 w-full max-w-xs"><option value="user">User / Donor</option><option value="volunteer">Volunteer</option><option value="admin">Admin</option></select></td>
                          <td className="py-4 px-4 text-right space-x-2"><button onClick={() => openEditDonorModal(d)} className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100"><Edit3 className="h-3 w-3" /><span>Edit</span></button><button onClick={() => toggleDonorAccountStatus(d.id)} className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${isDeactivated ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>{isDeactivated ? (<><UserCheck className="h-3 w-3" /><span>Activate</span></>) : (<><UserX className="h-3 w-3" /><span>Deactivate</span></>)}</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        );

      case 'campaigns':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Update Publisher */}
              <SectionCard className="lg:col-span-5">
                <div className="mb-4"><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#02A95C]">Instant Impact Broadcast</span><h2 className="font-heading font-bold text-lg text-gray-900">Update Publisher (Milestones & Field Stories)</h2><p className="text-xs text-gray-500">Post milestone updates, field photos, and news stories that broadcast directly to the Your Impact feeds of donors.</p></div>

                <form onSubmit={handlePublishNews} className="space-y-4">
                  <FormField label="Headline / Milestone Title" required><input type="text" required value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="e.g. Nsambya Neonatal ICU Incubator #2 Installed" className="input-field" /></FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Category"><select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} className="input-field"><option>Project Milestone</option><option>Medical Verification</option><option>Clean Water Update</option><option>Education Bursar Settlement</option><option>Emergency Relief Dispatch</option></select></FormField>
                    <FormField label="Link to Project"><select value={newsCampaignId} onChange={(e) => setNewsCampaignId(e.target.value)} className="input-field"><option value="">All Supporters (General Feed)</option>{campaigns.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}</select></FormField>
                  </div>
                  <FormField label="Field Photo (Upload or URL)">
                    <div className="flex items-center gap-2"><input type="text" value={newsImageUrl} onChange={(e) => setNewsImageUrl(e.target.value)} placeholder="https://..." className="input-field flex-1" /><label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"><Upload className="h-3.5 w-3.5" /><span>Upload</span><input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, setNewsImageUrl)} className="hidden" /></label></div>
                  </FormField>
                  <FormField label="Update Story & Institutional EFT Reference" required fullWidth><textarea rows={3} required value={newsSummary} onChange={(e) => setNewsSummary(e.target.value)} placeholder="Describe the field milestone, hospital receipt reference, or community impact..." className="input-field" /></FormField>
                  <button type="submit" className="w-full rounded-full bg-gray-900 hover:bg-gray-800 py-3 text-xs font-bold text-[#02A95C]">BROADCAST UPDATE TO SUPPORTERS' IMPACT FEEDS</button>
                </form>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">Broadcast History ({newsList.length})</h3>
                  {newsList.map((n) => (
                    <div key={n.id} className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono"><span className="font-bold text-[#02A95C]">{n.category}</span><span className="text-gray-400">{n.publishedAt}</span></div>
                      <h4 className="font-bold text-xs text-gray-900">{n.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{n.summary}</p>
                      {n.campaignTitle && <p className="text-[11px] font-mono font-semibold text-gray-700">Project: {n.campaignTitle}</p>}
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Right Column: Project Creator / Editor */}
              <SectionCard className="lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#02A95C]">Project Creator & Editor</span><h2 className="font-heading font-bold text-lg text-gray-900">Public Fundraising Campaigns ({campaigns.length})</h2><p className="text-xs text-gray-500">Create new campaigns, set financial goals, write impact stories, upload banner images, or edit active projects.</p></div>
                  <button onClick={openCreateCampaignEditor} className="inline-flex items-center gap-1.5 rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /><span>CREATE CAMPAIGN</span></button>
                </div>

                {showCampaignEditor && (
                  <FormCard title={editingCampaign ? `Edit Project: ${editingCampaign.title}` : 'Create New Fundraising Project'} onClose={() => { setShowCampaignEditor(false); setEditingCampaign(null); }}>
                    <form onSubmit={handleSaveCampaign} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField label="Campaign Title" required><input type="text" required value={campTitle} onChange={(e) => setCampTitle(e.target.value)} placeholder="e.g. Solar Borehole for 300 Families in Lira" className="input-field" /></FormField>
                        <FormField label="Category" required><select value={campCategory} onChange={(e) => setCampCategory(e.target.value as Category)} className="input-field"><option value="Medical Care">Medical Care</option><option value="Education & Tuition">Education & Tuition</option><option value="Clean Water Wells">Clean Water Wells</option><option value="Emergency Relief">Emergency Relief</option><option value="Rural Agriculture">Rural Agriculture</option><option value="Community Infrastructure">Community Infrastructure</option></select></FormField>
                        <FormField label="Financial Goal (UGX)" required><input type="number" required min="100000" value={campGoalUGX} onChange={(e) => setCampGoalUGX(e.target.value)} className="input-field" /></FormField>
                        <FormField label="District / Location" required><input type="text" required value={campDistrict} onChange={(e) => setCampDistrict(e.target.value)} placeholder="Lira District, Uganda" className="input-field" /></FormField>
                        <FormField label="Receiving Institution (Direct EFT)" required><input type="text" required value={campInstitution} onChange={(e) => setCampInstitution(e.target.value)} placeholder="Hospital Treasury / School Bursar" className="input-field" /></FormField>
                        <FormField label="Banner Image (Upload or URL)"><div className="flex items-center gap-2"><input type="text" value={campCoverImage} onChange={(e) => setCampCoverImage(e.target.value)} className="input-field flex-1" /><label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"><Upload className="h-3.5 w-3.5" /><span>Upload</span><input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, setCampCoverImage)} className="hidden" /></label></div></FormField>
                      </div>
                      <FormField label="Short Subtitle"><input type="text" value={campSubtitle} onChange={(e) => setCampSubtitle(e.target.value)} placeholder="Brief one-sentence summary of the verified need..." className="input-field" /></FormField>
                      <FormField label="Full Impact Story" required fullWidth><textarea rows={4} required value={campStory} onChange={(e) => setCampStory(e.target.value)} placeholder="Write the full impact story, beneficiary background, and direct institutional disbursement plan..." className="input-field" /></FormField>
                      <button type="submit" className="w-full rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-6 py-3 text-sm font-bold text-white">{editingCampaign ? 'SAVE CAMPAIGN CHANGES' : 'PUBLISH CAMPAIGN TO PUBLIC SITE'}</button>
                    </form>
                  </FormCard>
                )}

                <div className="space-y-3">
                  {campaigns.map((c) => {
                    const status = campaignStatuses[c.id] || 'active';
                    const verified = campaignVerified[c.id] ?? true;
                    return (
                      <div key={c.id} className="rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <img src={c.coverImage} alt={c.title} className="h-16 w-20 rounded-xl object-cover shrink-0 bg-gray-100" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap"><span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">{c.category}</span><span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{status}</span>{verified && <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">Verified</span>}</div>
                            <Link href={`/campaigns/${encodeURIComponent(c.slug)}`} className="font-bold text-sm text-gray-900 hover:text-[#02A95C] flex items-center gap-1"><span>{c.title}</span><ExternalLink className="h-3.5 w-3.5 text-gray-400" /></Link>
                            <p className="text-xs text-gray-500 font-mono">{formatUGX(c.raisedUGX)} / {formatUGX(c.goalUGX)} · {c.payoutVerification.institutionName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button onClick={() => openEditCampaignEditor(c)} className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Edit3 className="h-3 w-3" /><span>Edit</span></button>
                          <button onClick={() => setCampaignVerified((prev) => ({ ...prev, [c.id]: !verified }))} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">{verified ? 'Revoke Badge' : 'Verify Badge'}</button>
                          <button onClick={() => setCampaignStatuses((prev) => ({ ...prev, [c.id]: status === 'active' ? 'paused' : 'active' }))} className="rounded-full bg-gray-900 hover:bg-gray-800 px-3 py-1.5 text-xs font-bold text-white">{status === 'active' ? 'Pause' : 'Activate'}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Mobile Sidebar Toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-full bg-white shadow-lg p-2 border border-gray-200"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />}

      <div className="flex flex-col lg:flex-row">
        {/* =====================================================================
            SIDEBAR - Matches Website Design
           ===================================================================== */}
        <aside className={`lg:w-72 w-full lg:flex-none flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          {/* Brand Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#02A95C] flex items-center justify-center text-white">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xl text-gray-900">GCC Admin</span>
                  <span className="h-2 w-2 rounded-full bg-[#02A95C] animate-pulse" />
                </div>
                <p className="text-xs text-gray-500 font-mono">INTERNAL OPERATIONS CONSOLE</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">Executive Operations Modules</p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setActiveTab(item.id as AdminTab); setSidebarOpen(false); }}
                    className={`group w-full text-left flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all ${isActive ? 'bg-emerald-50 border border-emerald-200 text-[#02A95C] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-[#02A95C] text-white' : 'bg-gray-100 text-gray-500 group-hover:text-[#02A95C] group-hover:bg-emerald-50'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-[#02A95C]">{item.code}</span>
                        <span className="text-xs font-bold truncate">{item.label}</span>
                      </div>
                      <span className="hidden lg:block text-[11px] text-gray-400 truncate">{item.sub}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="rounded-xl bg-white border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#02A95C]">Active Operator</span>
                <span className="font-mono text-[10px] text-gray-500">ROLE: ADMIN</span>
              </div>
              <p className="text-xs font-bold text-gray-900 truncate mt-1">{user?.name || 'GCC Operations Director'}</p>
              <p className="text-[11px] font-mono text-gray-400 truncate">{user?.email || 'admin@thegccfoundation.com'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"><Globe className="h-3.5 w-3.5 text-[#02A95C]" /><span>Public Site</span></Link>
              <button onClick={() => logout()} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition-colors"><LogOut className="h-3.5 w-3.5" /><span>Sign Out</span></button>
            </div>
          </div>
        </aside>

        {/* =====================================================================
            MAIN CONTENT - Matches Website Design
           ===================================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F6]">
          {/* Top Telemetry Bar */}
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-[#02A95C]" />
              <div>
                <h1 className="font-heading font-bold text-lg sm:text-xl text-gray-900">
                  {navItems.find((n) => n.id === activeTab)?.code} // {navItems.find((n) => n.id === activeTab)?.label.toUpperCase()}
                </h1>
                <p className="text-xs text-gray-500">Direct Institutional Escrow · Real-Time Uganda & Diaspora Operations</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button onClick={triggerQuickActionAddChild} className="rounded-full border border-gray-300 bg-white hover:bg-gray-50 px-3.5 py-2 text-xs font-bold text-[#02A95C] transition-colors">+ ADD CHILD PROFILE</button>
              <button onClick={() => { setShowManualEntryForm(true); setActiveTab('financials'); }} className="rounded-full border border-gray-300 bg-white hover:bg-gray-50 px-3.5 py-2 text-xs font-bold text-amber-600 transition-colors">+ LOG OFFLINE GIFT</button>
              <button onClick={() => { openCreateCampaignEditor(); setActiveTab('campaigns'); }} className="rounded-full bg-[#02A95C] hover:bg-[#028F4D] px-4 py-2 text-xs font-bold text-white transition-colors flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /><span>NEW CAMPAIGN</span></button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {adminToast && (
              <div role="status" className="rounded-xl bg-white border-l-4 border-[#02A95C] p-4 text-sm font-medium text-gray-900 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-[#02A95C] shrink-0" /><span>{adminToast}</span></div>
                <button onClick={() => setAdminToast('')} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
              </div>
            )}

            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

// ================= REUSABLE UI COMPONENTS =================

function MetricCard({ label, value, sub, iconColor, bgColor }: { label: string; value: string; sub: string; iconColor: string; bgColor: string }) {
  return (
    <div className={`${bgColor} border border-gray-200 rounded-2xl p-5 space-y-1.5`}>
      <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${iconColor}`}>{label}</span>
      <span className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 block tabular-nums">{value}</span>
      <span className="text-[11px] text-gray-500 block">{sub}</span>
    </div>
  );
}

function SectionCard({ title, subtitle, action, badge, children }: { title: string; subtitle?: string; action?: React.ReactNode; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">{badge && badge}{action && action}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SectionCardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">{action}</div>
      </div>
    </div>
  );
}

function FormCard({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading font-bold text-lg text-gray-900">{title}</h3>
        <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-gray-800">Cancel</button>
      </div>
      {subtitle && <span className="text-[11px] font-mono font-semibold text-[#02A95C] mb-4 block">{subtitle}</span>}
      {children}
    </div>
  );
}

function FormField({ label, required, children, fullWidth }: { label: string; required?: boolean; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={`${fullWidth ? 'sm:col-span-2' : ''}`}>
      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-[#02A95C]">*</span>}
      </label>
      {children}
    </div>
  );
}

function DataTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function QuickActionButton({ onClick, icon, title, description, iconBg }: { onClick: () => void; icon: React.ReactNode; title: string; description: string; iconBg: string }) {
  return (
    <button onClick={onClick} className="group text-left rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-900 hover:text-white p-5 transition-all space-y-2">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-white ${iconBg}`}>{icon}</div>
      <strong className="block font-heading font-bold text-sm">{title}</strong>
      <span className="block text-xs text-gray-500 group-hover:text-gray-300 leading-relaxed">{description}</span>
    </button>
  );
}