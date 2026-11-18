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
    institution: 'St. Peter’s Secondary School Bursar Account',
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
  const [campInstitution, setCampInstitution] = useState('Uganda Heart Institute Treasury');
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
    setChildSchool('St. Mary’s Primary · Primary 4');
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
    notify('Milestone update published and broadcast to supporters’ Your Impact feeds!');
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B1120] text-slate-900 font-sans">
      {/* =====================================================================
          DEDICATED ENTERPRISE STAFF SIDEBAR (COMPLETELY DISTINCT FROM USER UI)
         ===================================================================== */}
      <aside className="w-full lg:w-72 bg-[#070B14] border-b lg:border-b-0 lg:border-r border-slate-800 text-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Console Brand Header */}
          <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black tracking-widest uppercase text-white">
                    GCC // OPS-CONSOLE
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  INTERNAL STAFF WORKSPACE v2.6
                </p>
              </div>
            </div>
          </div>

          {/* 6 Module Command Navigation */}
          <div className="p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              Executive Operations Modules
            </p>
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={`group w-full text-left flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all shrink-0 lg:shrink ${
                      isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-emerald-400">{item.code}</span>
                        <span className="text-xs font-bold truncate">{item.label}</span>
                      </div>
                      <span className="hidden lg:block text-[11px] text-slate-400 truncate">
                        {item.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: Operator Session & Public Site Link */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#05080F]">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                Active Operator
              </span>
              <span className="font-mono text-[10px] text-slate-500">ROLE: ADMIN</span>
            </div>
            <p className="text-xs font-bold text-white truncate mt-1">
              {user?.name || 'GCC Operations Director'}
            </p>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {user?.email || 'admin@thegccfoundation.com'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 hover:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>Public Site</span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/40 hover:bg-red-900/50 px-3 py-2 text-xs font-bold text-red-300 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          RIGHT WORKSPACE: ENTERPRISE COMMAND DECK
         ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F1F5F9]">
        {/* Top Telemetry Bar */}
        <header className="bg-[#0F172A] text-white border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-emerald-400" />
            <div>
              <h1 className="font-mono text-sm sm:text-base font-bold tracking-tight text-white">
                {navItems.find((n) => n.id === activeTab)?.code} //{' '}
                {navItems.find((n) => n.id === activeTab)?.label.toUpperCase()}
              </h1>
              <p className="text-xs text-slate-400">
                Direct Institutional Escrow · Real-Time Uganda & Diaspora Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={triggerQuickActionAddChild}
              className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-mono font-bold text-emerald-400 transition-colors"
            >
              + ADD CHILD PROFILE
            </button>
            <button
              type="button"
              onClick={() => {
                setShowManualEntryForm(true);
                setActiveTab('financials');
              }}
              className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-mono font-bold text-amber-300 transition-colors"
            >
              + LOG OFFLINE GIFT
            </button>
            <button
              type="button"
              onClick={() => {
                openCreateCampaignEditor();
                setActiveTab('campaigns');
              }}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-mono font-bold text-slate-950 transition-colors flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>NEW CAMPAIGN</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {adminToast && (
            <div
              role="status"
              className="rounded-xl bg-slate-900 text-white border-l-4 border-emerald-400 px-5 py-3.5 text-xs sm:text-sm font-mono flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{adminToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setAdminToast('')}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* =====================================================================
              1. THE ADMIN COMMAND CENTER (OVERVIEW / ANALYTICS)
             ===================================================================== */}
          {activeTab === 'command' && (
            <div className="space-y-6">
              {/* High-Level Financial Metrics Cards (Dark Slate Command Strip) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#0F172A] text-white border border-slate-800 rounded-xl p-5 space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    RAISED THIS MONTH
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-white block tabular-nums">
                    {formatUGX(thisMonthRaisedUGX)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">Current calendar month</span>
                </div>

                <div className="bg-[#0F172A] text-white border border-slate-800 rounded-xl p-5 space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-sky-400">
                    RAISED THIS YEAR (2026)
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-white block tabular-nums">
                    {formatUGX(thisYearRaisedUGX)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">Fiscal year-to-date</span>
                </div>

                <div className="bg-[#0F172A] text-white border border-slate-800 rounded-xl p-5 space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    TOTAL RAISED (ALL-TIME)
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-emerald-400 block tabular-nums">
                    {formatUGX(allTimeRaisedUGX)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    100% Direct Institutional Escrow
                  </span>
                </div>

                <div className="bg-[#0F172A] text-white border border-slate-800 rounded-xl p-5 space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-400">
                    MONTHLY RECURRING DONORS
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-white block">
                    {activeMonthlyRecurringDonors}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Active monthly pledges
                  </span>
                </div>

                <div className="bg-[#0F172A] text-white border border-slate-800 rounded-xl p-5 space-y-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    ACTIVE SPONSORSHIPS
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-white block">
                    {activeSponsorshipsCount} / {childrenList.length}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {childrenList.filter((c) => c.status === 'available').length} awaiting sponsor
                  </span>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-slate-900">
                      Quick Action Shortcuts
                    </h2>
                    <p className="text-xs text-slate-500">
                      Execute staff operations across child profiles, field broadcasts, and message moderation.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-[11px] font-mono font-bold text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>DIRECT DISPATCH</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={triggerQuickActionAddChild}
                    className="group text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white p-5 transition-all space-y-2"
                  >
                    <div className="h-9 w-9 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <strong className="block font-mono text-sm font-bold">
                      Add New Child Profile
                    </strong>
                    <span className="block text-xs text-slate-500 group-hover:text-slate-300 leading-relaxed">
                      Launch the Child Sponsorship Wizard to upload a verified portrait, bio, dream, and monthly cost.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerQuickActionPublishUpdate}
                    className="group text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white p-5 transition-all space-y-2"
                  >
                    <div className="h-9 w-9 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <strong className="block font-mono text-sm font-bold">
                      Publish a Project Update
                    </strong>
                    <span className="block text-xs text-slate-500 group-hover:text-slate-300 leading-relaxed">
                      Broadcast verified field milestones, photos, and news directly to donors’ Your Impact feeds.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={triggerQuickActionReviewLetters}
                    className="group text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white p-5 transition-all space-y-2"
                  >
                    <div className="h-9 w-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center">
                      <MailCheck className="h-5 w-5" />
                    </div>
                    <strong className="block font-mono text-sm font-bold">
                      Review Pending Letters ({letters.filter((l) => l.status === 'pending').length})
                    </strong>
                    <span className="block text-xs text-slate-500 group-hover:text-slate-300 leading-relaxed">
                      Inspect, edit for safety/privacy, and approve incoming donor messages to sponsored children.
                    </span>
                  </button>
                </div>
              </div>

              {/* Recent Transactions Feed */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-slate-900">
                      Recent Transactions Feed
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time feed showing who gave what, when, and to which campaign.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('financials')}
                    className="text-xs font-mono font-bold text-emerald-700 hover:underline"
                  >
                    OPEN GLOBAL GIVING LEDGER →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900 text-slate-300 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Receipt & Date</th>
                        <th className="py-3 px-4">Donor</th>
                        <th className="py-3 px-4">Campaign Supported</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {combinedTransactions.slice(0, 8).map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-mono text-xs">
                            <strong className="text-slate-900 block">{tx.receiptNumber}</strong>
                            <span className="text-slate-400">{tx.date}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <strong className="font-bold text-slate-900 block">{tx.donorName}</strong>
                            <span className="text-xs text-slate-500">{tx.donorEmail}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">{tx.campaignTitle}</td>
                          <td className="py-3.5 px-4">
                            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                              {tx.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                            {formatUGX(tx.amountUGX)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Institutional EFT Payouts */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-slate-900">
                      Institutional Bank EFT Payout Queue
                    </h2>
                    <p className="text-xs text-slate-500">
                      Approve and settle direct bank wires to verified hospital treasuries, school bursars, and borehole contractors.
                    </p>
                  </div>
                  <span className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
                    ESCROW VERIFIED
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900 text-slate-300 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Voucher ID & Date</th>
                        <th className="py-3 px-4">Campaign</th>
                        <th className="py-3 px-4">Receiving Institution</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {payouts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-4 px-4 font-mono text-xs">
                            <strong className="text-slate-900 block">{p.id}</strong>
                            <span className="text-slate-400">{p.date}</span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-900 max-w-xs">
                            {p.campaignTitle}
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-600">
                            <strong className="text-slate-900 block">{p.institution}</strong>
                            <span className="font-mono">{p.bankAccount}</span>
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                            {formatUGX(p.amountUGX)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold ${
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
                                className="rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1.5 text-xs font-mono font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {p.status !== 'Settled via EFT' && (
                              <button
                                type="button"
                                onClick={() => updatePayout(p.id, 'Settled via EFT')}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-mono font-bold"
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
              </div>
            </div>
          )}

          {/* =====================================================================
              2. CHILD SPONSORSHIP MANAGEMENT (CMS)
             ===================================================================== */}
          {activeTab === 'children' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-mono font-bold text-base uppercase tracking-wider text-slate-900">
                    Child Sponsorship Management (CMS)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Child Profile Directory, Add/Edit Child Wizard, and Sponsorship Tracking with double-sponsorship protection.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddChild}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-mono font-bold text-emerald-400 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>ADD NEW CHILD PROFILE</span>
                </button>
              </div>

              {showChildForm && (
                <form
                  onSubmit={handleSaveChild}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono font-bold text-sm uppercase text-slate-900">
                      {editingChild ? `Edit Child Wizard: ${editingChild.name}` : 'Add New Child Wizard'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowChildForm(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  {childFormError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                      {childFormError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Child’s Full Name</label>
                      <input
                        type="text"
                        required
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="e.g. Grace Nakato"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="19"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={childGender}
                        onChange={(e) => setChildGender(e.target.value as 'Girl' | 'Boy')}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      >
                        <option value="Girl">Girl</option>
                        <option value="Boy">Boy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">District / Location</label>
                      <input
                        type="text"
                        required
                        value={childDistrict}
                        onChange={(e) => setChildDistrict(e.target.value)}
                        placeholder="Soroti District, Uganda"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">School & Grade Level</label>
                      <input
                        type="text"
                        required
                        value={childSchool}
                        onChange={(e) => setChildSchool(e.target.value)}
                        placeholder="St. Mary’s Primary · Primary 4"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Monthly Sponsorship Cost (USD)
                      </label>
                      <input
                        type="number"
                        required
                        min="10"
                        value={childMonthlyUSD}
                        onChange={(e) => setChildMonthlyUSD(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Child’s Dream / Goal
                      </label>
                      <input
                        type="text"
                        required
                        value={childDream}
                        onChange={(e) => setChildDream(e.target.value)}
                        placeholder="Wants to become a pediatric heart surgeon"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sponsorship Status
                      </label>
                      <select
                        value={childStatus}
                        onChange={(e) => setChildStatus(e.target.value as 'available' | 'sponsored')}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold"
                      >
                        <option value="available">Available</option>
                        <option value="sponsored">Sponsored</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Verified Portrait (Upload or URL)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={childPhotoUrl}
                          onChange={(e) => setChildPhotoUrl(e.target.value)}
                          className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, setChildPhotoUrl)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {childStatus === 'sponsored' && (
                    <div className="rounded-lg bg-sky-50 border border-sky-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-bold text-sky-950 mb-1">
                          Linked Sponsor Donor Name
                        </label>
                        <input
                          type="text"
                          required
                          value={childSponsorName}
                          onChange={(e) => setChildSponsorName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="h-10 w-full rounded-lg border border-sky-200 bg-white px-3 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-sky-950 mb-1">
                          Linked Sponsor Email
                        </label>
                        <input
                          type="email"
                          value={childSponsorEmail}
                          onChange={(e) => setChildSponsorEmail(e.target.value)}
                          placeholder="sarah.jenkins@example.org"
                          className="h-10 w-full rounded-lg border border-sky-200 bg-white px-3 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-sky-950 mb-1">
                          Quick-Fill from Supporter Directory
                        </label>
                        <select
                          onChange={(e) => {
                            const found = donors.find((d) => d.id === e.target.value);
                            if (found) {
                              setChildSponsorName(found.name);
                              setChildSponsorEmail(found.email);
                            }
                          }}
                          defaultValue=""
                          className="h-10 w-full rounded-lg border border-sky-200 bg-white px-3 text-xs"
                        >
                          <option value="" disabled>
                            Select existing donor...
                          </option>
                          {donors.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Biographical Details & Sponsorship Needs
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={childBio}
                      onChange={(e) => setChildBio(e.target.value)}
                      placeholder="Describe the child’s story, school needs, and how monthly sponsorship supports them..."
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-mono font-bold text-white"
                  >
                    {editingChild ? 'SAVE CHILD PROFILE CHANGES' : 'PUBLISH CHILD PROFILE'}
                  </button>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900 text-slate-300 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-3.5 px-4">Child Profile</th>
                      <th className="py-3.5 px-4">Location & School</th>
                      <th className="py-3.5 px-4">Dream / Goals</th>
                      <th className="py-3.5 px-4">Monthly Cost</th>
                      <th className="py-3.5 px-4">Status & Sponsorship Tracking</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {childrenList.map((child) => (
                      <tr key={child.id} className="hover:bg-slate-50 align-top">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={child.photoUrl}
                              alt={child.name}
                              className="h-14 w-14 rounded-lg object-cover shrink-0 bg-slate-100"
                            />
                            <div>
                              <strong className="font-bold text-sm text-slate-900 block">
                                {child.name}
                              </strong>
                              <span className="text-xs text-slate-500">
                                {child.age} yrs · {child.gender}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600">
                          <strong className="text-slate-900 block">{child.district}</strong>
                          <span>{child.schoolAndGrade}</span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">
                          <span className="font-semibold text-emerald-700 block">{child.dream}</span>
                          <span className="line-clamp-2 text-slate-500 mt-0.5">{child.bio}</span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          ${child.monthlySponsorshipUSD}/mo
                        </td>
                        <td className="py-4 px-4">
                          {child.status === 'sponsored' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 text-sky-800 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">
                                <Lock className="h-3 w-3" />
                                <span>Sponsored (Locked)</span>
                              </span>
                              <p className="text-xs font-bold text-slate-900">
                                Sponsor: {child.sponsorName || 'Assigned Donor'}
                              </p>
                              {child.sponsorEmail && (
                                <p className="text-[11px] text-slate-500">{child.sponsorEmail}</p>
                              )}
                              {child.sponsoredSince && (
                                <p className="text-[10px] text-slate-400">
                                  Since {child.sponsoredSince}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <span className="inline-block rounded-md bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">
                                Available
                              </span>
                              <div>
                                <select
                                  defaultValue=""
                                  onChange={(e) => {
                                    const donor = donors.find((d) => d.id === e.target.value);
                                    if (donor) assignSponsorToChild(child, donor);
                                  }}
                                  className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-[11px] text-slate-700"
                                >
                                  <option value="" disabled>
                                    + Link Sponsor Donor...
                                  </option>
                                  {donors.map((d) => (
                                    <option key={d.id} value={d.id}>
                                      {d.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right space-y-1.5">
                          <button
                            type="button"
                            onClick={() => openEditChild(child)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          {child.status === 'sponsored' && (
                            <button
                              type="button"
                              onClick={() => unlinkChildSponsor(child.id)}
                              className="block ml-auto rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1 text-[11px] font-mono font-bold text-amber-800"
                            >
                              Unlink Sponsor
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              3. LETTER & MESSAGE MODERATION QUEUE + FIELD UPDATE UPLOADS
             ===================================================================== */}
          {activeTab === 'letters' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-mono font-bold text-base uppercase tracking-wider text-slate-900">
                      Incoming Donor Messages & Safety Moderation Queue
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pending messages appear first. Review, edit for child privacy/safety, and Approve or Reject before field delivery.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setLetterFilter(status)}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold uppercase ${
                          letterFilter === status
                            ? 'bg-slate-900 text-emerald-400'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredLetters.map((letter) => (
                    <div
                      key={letter.id}
                      className="rounded-xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-2.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-mono font-bold uppercase text-[10px] ${
                              letter.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : letter.status === 'rejected' || letter.status === 'flagged'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {letter.status === 'pending'
                              ? 'Pending Safety Check'
                              : letter.status === 'approved'
                              ? 'Approved for Field Delivery'
                              : 'Rejected / Held'}
                          </span>
                          {letter.editedByAdmin && (
                            <span className="rounded-md bg-sky-50 text-sky-700 px-2 py-0.5 font-mono text-[10px] font-bold">
                              Edited by Admin for Safety
                            </span>
                          )}
                          <span className="font-semibold text-slate-800">
                            From: {letter.donorName} ({letter.donorEmail})
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="font-bold text-emerald-700">
                            To Sponsored Child: {letter.childName}
                          </span>
                          <span className="text-slate-400">• {letter.createdAt}</span>
                        </div>

                        {editingLetterId === letter.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={editingLetterText}
                              onChange={(e) => setEditingLetterText(e.target.value)}
                              className="w-full rounded-lg border border-emerald-500 bg-white p-3 text-xs sm:text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => saveEditedLetter(letter.id)}
                                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-mono font-bold text-white"
                              >
                                Save Safety Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingLetterId(null)}
                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold text-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3.5 italic">
                            “{letter.message}”
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditingLetter(letter)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-mono font-bold text-slate-700"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        {letter.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => moderateLetter(letter.id, 'approved')}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-mono font-bold text-white"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {letter.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => moderateLetter(letter.id, 'rejected')}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 text-xs font-mono font-bold text-red-700"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Update Uploads */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-mono font-bold text-base uppercase tracking-wider text-slate-900">
                      Field Update Uploads (Report Cards, Photos & Progress Letters)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Upload batch termly report cards, verified field photos, and progress letters from the field and attach them to specific children or projects.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFieldUploadForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-mono font-bold text-emerald-400 shrink-0"
                  >
                    <FolderUp className="h-4 w-4" />
                    <span>{showFieldUploadForm ? 'CLOSE UPLOAD FORM' : 'UPLOAD FIELD REPORT'}</span>
                  </button>
                </div>

                {showFieldUploadForm && (
                  <form
                    onSubmit={handleFieldUploadSubmit}
                    className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Document / Batch Title
                        </label>
                        <input
                          type="text"
                          required
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="e.g. Term 3 Academic Report Card"
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Upload Type
                        </label>
                        <select
                          value={uploadDocType}
                          onChange={(e) =>
                            setUploadDocType(e.target.value as FieldUpdateUpload['documentType'])
                          }
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        >
                          <option value="Termly Report Card">Termly Report Card</option>
                          <option value="Field Progress Letter">Field Progress Letter</option>
                          <option value="Verified Field Photo">Verified Field Photo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Term / Reporting Period
                        </label>
                        <input
                          type="text"
                          value={uploadTerm}
                          onChange={(e) => setUploadTerm(e.target.value)}
                          placeholder="Term 3 · 2026"
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Attach To
                        </label>
                        <select
                          value={uploadTargetType}
                          onChange={(e) => {
                            const nextType = e.target.value as 'child' | 'project';
                            setUploadTargetType(nextType);
                            setUploadTargetId(
                              nextType === 'child'
                                ? childrenList[0]?.id || 'child-01'
                                : campaigns[0]?.id || 'camp-01'
                            );
                          }}
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        >
                          <option value="child">Sponsored Child</option>
                          <option value="project">Fundraising Project</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Select {uploadTargetType === 'child' ? 'Child' : 'Project'}
                        </label>
                        <select
                          value={uploadTargetId}
                          onChange={(e) => setUploadTargetId(e.target.value)}
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        >
                          {uploadTargetType === 'child'
                            ? childrenList.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.district})
                                </option>
                              ))
                            : campaigns.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          File / Scan Upload
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={uploadFileName}
                            onChange={(e) => setUploadFileName(e.target.value)}
                            placeholder="report_card.pdf"
                            className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                          />
                          <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Browse</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) =>
                                handleImageFileUpload(e, setUploadAttachmentUrl, setUploadFileName)
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Teacher / Field Officer Progress Notes
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={uploadNotes}
                        onChange={(e) => setUploadNotes(e.target.value)}
                        placeholder="Summarize academic grades, health checkup notes, or field progress..."
                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-mono font-bold text-white"
                    >
                      ATTACH & BROADCAST FIELD UPLOAD
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fieldUploads.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-md bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">
                            {item.documentType}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Attached to: {item.targetName}
                          </span>
                          <span className="text-xs text-slate-400">• {item.termOrPeriod}</span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.notes}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          File: {item.fileName} · Uploaded {item.uploadedAt} by {item.uploadedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              4. DONATION & FINANCIAL RECORDS (GLOBAL GIVING LEDGER)
             ===================================================================== */}
          {activeTab === 'financials' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="font-mono font-bold text-base uppercase tracking-wider text-slate-900">
                    Global Giving Ledger & Financial Records
                  </h2>
                  <p className="text-xs text-slate-500">
                    Searchable, filterable database of every transaction across the organization, offline manual entry, receipt generator, and CSV/Excel accounting export.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowManualEntryForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-mono font-bold text-emerald-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{showManualEntryForm ? 'CLOSE OFFLINE FORM' : 'LOG OFFLINE DONATION'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => exportTransactions('csv')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 px-4 py-2 text-xs font-mono font-bold text-slate-700"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>EXPORT CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => exportTransactions('excel')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 text-xs font-mono font-bold text-emerald-900"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>EXPORT EXCEL (.XLS)</span>
                  </button>
                </div>
              </div>

              {showManualEntryForm && (
                <form
                  onSubmit={handleManualLedgerSubmit}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono font-bold text-sm uppercase text-slate-900">
                      Manual Offline Donation Entry & Financial Adjustment
                    </h3>
                    <span className="text-[11px] font-mono font-semibold text-emerald-700">
                      Updates campaign totals & generates receipt
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Donor Name</label>
                      <input
                        type="text"
                        required
                        value={manualDonorName}
                        onChange={(e) => setManualDonorName(e.target.value)}
                        placeholder="e.g. Centenary Bank Wire / Walk-in Donor"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Donor Email (for Receipt)</label>
                      <input
                        type="email"
                        value={manualDonorEmail}
                        onChange={(e) => setManualDonorEmail(e.target.value)}
                        placeholder="donor@example.org"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Campaign</label>
                      <select
                        value={manualCampaignId || campaigns[0]?.id || ''}
                        onChange={(e) => setManualCampaignId(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      >
                        {campaigns.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Amount (UGX)</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        value={manualAmountUGX}
                        onChange={(e) => setManualAmountUGX(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Payment Channel</label>
                      <select
                        value={manualPaymentMethod}
                        onChange={(e) =>
                          setManualPaymentMethod(
                            e.target.value as LedgerTransaction['paymentMethod']
                          )
                        }
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      >
                        <option value="Offline Cash Receipt">Offline Cash Receipt</option>
                        <option value="Direct Bank Wire (EFT)">Direct Bank Wire (EFT)</option>
                        <option value="Mobile Money Receipt (Manual)">Mobile Money Receipt (Manual)</option>
                        <option value="MTN MoMo">MTN MoMo</option>
                        <option value="Airtel Money">Airtel Money</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Entry Classification</label>
                      <select
                        value={manualEntryType}
                        onChange={(e) =>
                          setManualEntryType(e.target.value as LedgerTransaction['entryType'])
                        }
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      >
                        <option value="Manual Offline Entry">Manual Offline Entry</option>
                        <option value="Adjustment">Adjustment</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bank / Cash / MoMo Reference Number
                      </label>
                      <input
                        type="text"
                        value={manualReferenceCode}
                        onChange={(e) => setManualReferenceCode(e.target.value)}
                        placeholder="e.g. CASH-VCH-2026-205 or EFT-99201"
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Accounting & Audit Notes
                      </label>
                      <input
                        type="text"
                        value={manualNotes}
                        onChange={(e) => setManualNotes(e.target.value)}
                        placeholder="Physical receipt book # or bank credit advice note..."
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-mono font-bold text-white"
                  >
                    RECORD TRANSACTION & GENERATE RECEIPT
                  </button>
                </form>
              )}

              {selectedReceiptTx && (
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-emerald-700" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Official Tax-Deductible Receipt Generated ({selectedReceiptTx.receiptNumber})
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Donor: {selectedReceiptTx.donorName} · Amount: {formatUGX(selectedReceiptTx.amountUGX)} ({selectedReceiptTx.paymentMethod})
                    </p>
                    <p className="text-xs text-slate-600">
                      Campaign: {selectedReceiptTx.campaignTitle} · Ref: {selectedReceiptTx.referenceCode} · Date: {selectedReceiptTx.date}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptTx(null)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-mono font-bold text-slate-700 shrink-0"
                  >
                    Dismiss Receipt
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="search"
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    placeholder="Search donor, receipt #, campaign, or ref..."
                    className="h-10 w-full rounded-lg border border-slate-300 pl-10 pr-4 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <select
                  value={ledgerMethodFilter}
                  onChange={(e) => setLedgerMethodFilter(e.target.value)}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm"
                >
                  <option value="All">All Payment Channels</option>
                  <option value="MTN MoMo">MTN MoMo</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Visa / Mastercard">Visa / Mastercard</option>
                  <option value="Direct Bank Wire (EFT)">Direct Bank Wire (EFT)</option>
                  <option value="Offline Cash Receipt">Offline Cash Receipt</option>
                  <option value="Mobile Money Receipt (Manual)">Mobile Money Receipt (Manual)</option>
                </select>
                <select
                  value={ledgerTypeFilter}
                  onChange={(e) => setLedgerTypeFilter(e.target.value)}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm"
                >
                  <option value="All">All Entry Types (Online + Offline)</option>
                  <option value="Online">Online</option>
                  <option value="Manual Offline Entry">Manual Offline Entry</option>
                  <option value="Adjustment">Adjustment</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900 text-slate-300 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-3.5 px-4">Receipt & Date</th>
                      <th className="py-3.5 px-4">Supporter</th>
                      <th className="py-3.5 px-4">Campaign</th>
                      <th className="py-3.5 px-4">Channel & Type</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredLedger.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <strong className="text-slate-900 block">{tx.receiptNumber}</strong>
                          <span className="text-slate-400">{tx.date}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="font-bold text-slate-900 block">{tx.donorName}</strong>
                          <span className="text-xs font-mono text-slate-500">{tx.referenceCode}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                          <span className="font-medium block">{tx.campaignTitle}</span>
                          {tx.notes && <span className="text-[11px] text-slate-400">{tx.notes}</span>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-700 block w-fit">
                            {tx.paymentMethod}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase mt-0.5 block">
                            {tx.entryType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                          {formatUGX(tx.amountUGX)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptTx(tx)}
                            className="rounded-lg border border-slate-300 hover:bg-slate-100 px-3 py-1 text-xs font-mono font-bold text-slate-700"
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              5. DONOR & MEMBER DIRECTORY (SUPPORTER DATABASE & USER MANAGEMENT)
             ===================================================================== */}
          {activeTab === 'donors' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-mono font-bold text-base uppercase tracking-wider text-slate-900">
                    Donor & Member Directory (Supporter Database & User Management)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Searchable supporter database with lifetime contributions, contact details, role promotion (User / Volunteer / Admin), and account activation controls.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDonor(null);
                    setNewDonorName('');
                    setNewDonorEmail('');
                    setNewDonorPhone('');
                    setNewDonorAddress('');
                    setShowAddDonor((v) => !v);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-mono font-bold text-emerald-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{showAddDonor ? 'CLOSE MEMBER FORM' : 'ADD MEMBER RECORD'}</span>
                </button>
              </div>

              {showAddDonor && (
                <form
                  onSubmit={handleSaveDonor}
                  className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4"
                >
                  <h3 className="font-mono font-bold text-sm uppercase text-slate-900">
                    {editingDonor ? `Edit User Details: ${editingDonor.name}` : 'Add New Supporter / Member'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={newDonorName}
                      onChange={(e) => setNewDonorName(e.target.value)}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={newDonorEmail}
                      onChange={(e) => setNewDonorEmail(e.target.value)}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Phone (+256...)"
                      value={newDonorPhone}
                      onChange={(e) => setNewDonorPhone(e.target.value)}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Billing / Tax Address"
                      value={newDonorAddress}
                      onChange={(e) => setNewDonorAddress(e.target.value)}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Lifetime Donated (UGX)"
                      value={newDonorAmount}
                      onChange={(e) => setNewDonorAmount(e.target.value)}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                    />
                    <select
                      value={newDonorPlan}
                      onChange={(e) => setNewDonorPlan(e.target.value)}
                      className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                    >
                      <option>One-Time Supporter</option>
                      <option>Monthly ($35 / mo)</option>
                      <option>Monthly ($50 / mo)</option>
                      <option>Child Sponsor ($45 / mo)</option>
                      <option>Major Institutional Donor</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-700">System Role:</label>
                      <select
                        value={newDonorRole}
                        onChange={(e) =>
                          setNewDonorRole(e.target.value as 'user' | 'volunteer' | 'admin')
                        }
                        className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold"
                      >
                        <option value="user">Supporter (User)</option>
                        <option value="volunteer">Trusted Volunteer</option>
                        <option value="admin">NGO Staff Admin</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-6 py-2 text-xs font-mono font-bold text-white"
                    >
                      {editingDonor ? 'UPDATE MEMBER' : 'SAVE MEMBER'}
                    </button>
                  </div>
                </form>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="search"
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    placeholder="Search supporters by name, email, city, or plan..."
                    className="h-10 w-full rounded-lg border border-slate-300 pl-10 pr-4 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <select
                  value={donorRoleFilter}
                  onChange={(e) => setDonorRoleFilter(e.target.value)}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm"
                >
                  <option value="All">All Roles</option>
                  <option value="user">Supporters (User)</option>
                  <option value="volunteer">Volunteers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900 text-slate-300 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-3.5 px-4">Supporter & Status</th>
                      <th className="py-3.5 px-4">Contact & Tax Address</th>
                      <th className="py-3.5 px-4">Giving Plan & Lifetime</th>
                      <th className="py-3.5 px-4">Role Assignment</th>
                      <th className="py-3.5 px-4 text-right">User Management</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDonors.map((d) => {
                      const isDeactivated = d.accountStatus === 'deactivated';
                      return (
                        <tr
                          key={d.id}
                          className={`hover:bg-slate-50 ${isDeactivated ? 'opacity-60 bg-slate-50' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <strong className="font-bold text-slate-900">{d.name}</strong>
                              <span
                                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                                  isDeactivated
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {isDeactivated ? 'Deactivated' : 'Active'}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 block">{d.email}</span>
                            <span className="text-[11px] text-slate-400">Joined {d.joinedDate}</span>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-600">
                            <span className="block font-semibold text-slate-800">{d.phone}</span>
                            <span>{d.address}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="rounded-md bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-mono text-xs font-bold">
                              {d.recurringPlan}
                            </span>
                            <span className="font-mono font-bold text-slate-900 block mt-1">
                              {formatUGX(d.totalDonatedUGX)} ({d.donationsCount} gifts)
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={d.role || 'user'}
                              onChange={(e) =>
                                changeDonorRole(
                                  d.id,
                                  e.target.value as 'user' | 'volunteer' | 'admin'
                                )
                              }
                              className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-mono font-bold text-slate-800"
                            >
                              <option value="user">User / Donor</option>
                              <option value="volunteer">Volunteer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => openEditDonorModal(d)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleDonorAccountStatus(d.id)}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-mono font-bold ${
                                isDeactivated
                                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-700 hover:bg-red-100'
                              }`}
                            >
                              {isDeactivated ? (
                                <>
                                  <UserCheck className="h-3 w-3" />
                                  <span>Activate</span>
                                </>
                              ) : (
                                <>
                                  <UserX className="h-3 w-3" />
                                  <span>Deactivate</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              6. CAMPAIGN & CONTENT MANAGER (PROJECT CREATOR/EDITOR & UPDATE PUBLISHER)
             ===================================================================== */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Update Publisher */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                      Instant Impact Broadcast
                    </span>
                    <h2 className="font-mono font-bold text-base uppercase text-slate-900">
                      Update Publisher (Milestones & Field Stories)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Post milestone updates, field photos, and news stories that broadcast directly to the Your Impact feeds of donors.
                    </p>
                  </div>

                  <form onSubmit={handlePublishNews} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Headline / Milestone Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        placeholder="e.g. Nsambya Neonatal ICU Incubator #2 Installed"
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                        <select
                          value={newsCategory}
                          onChange={(e) => setNewsCategory(e.target.value)}
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        >
                          <option>Project Milestone</option>
                          <option>Medical Verification</option>
                          <option>Clean Water Update</option>
                          <option>Education Bursar Settlement</option>
                          <option>Emergency Relief Dispatch</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Link to Project
                        </label>
                        <select
                          value={newsCampaignId}
                          onChange={(e) => setNewsCampaignId(e.target.value)}
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        >
                          <option value="">All Supporters (General Feed)</option>
                          {campaigns.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Field Photo (Upload or URL)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newsImageUrl}
                          onChange={(e) => setNewsImageUrl(e.target.value)}
                          placeholder="https://..."
                          className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, setNewsImageUrl)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Update Story & Institutional EFT Reference
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newsSummary}
                        onChange={(e) => setNewsSummary(e.target.value)}
                        placeholder="Describe the field milestone, hospital receipt reference, or community impact..."
                        className="w-full rounded-lg border border-slate-300 p-3 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 py-3 text-xs font-mono font-bold text-emerald-400 transition-colors"
                    >
                      BROADCAST UPDATE TO SUPPORTERS’ IMPACT FEEDS
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                      Broadcast History ({newsList.length})
                    </h3>
                    {newsList.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-emerald-700">{n.category}</span>
                          <span className="text-slate-400">{n.publishedAt}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{n.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{n.summary}</p>
                        {n.campaignTitle && (
                          <p className="text-[11px] font-mono font-semibold text-slate-700">
                            Project: {n.campaignTitle}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Project Creator / Editor */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                        Project Creator & Editor
                      </span>
                      <h2 className="font-mono font-bold text-base uppercase text-slate-900">
                        Public Fundraising Campaigns ({campaigns.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Create new campaigns, set financial goals, write impact stories, upload banner images, or edit active projects.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={openCreateCampaignEditor}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-mono font-bold text-emerald-400 hover:bg-slate-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>CREATE CAMPAIGN</span>
                    </button>
                  </div>

                  {showCampaignEditor && (
                    <form
                      onSubmit={handleSaveCampaign}
                      className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-mono font-bold text-sm uppercase text-slate-900">
                          {editingCampaign
                            ? `Edit Project: ${editingCampaign.title}`
                            : 'Create New Fundraising Project'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowCampaignEditor(false)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Campaign Title
                          </label>
                          <input
                            type="text"
                            required
                            value={campTitle}
                            onChange={(e) => setCampTitle(e.target.value)}
                            placeholder="e.g. Solar Borehole for 300 Families in Lira"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Category
                          </label>
                          <select
                            value={campCategory}
                            onChange={(e) => setCampCategory(e.target.value as Category)}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                          >
                            <option value="Medical Care">Medical Care</option>
                            <option value="Education & Tuition">Education & Tuition</option>
                            <option value="Clean Water Wells">Clean Water Wells</option>
                            <option value="Emergency Relief">Emergency Relief</option>
                            <option value="Rural Agriculture">Rural Agriculture</option>
                            <option value="Community Infrastructure">Community Infrastructure</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Financial Goal (UGX)
                          </label>
                          <input
                            type="number"
                            required
                            min="100000"
                            value={campGoalUGX}
                            onChange={(e) => setCampGoalUGX(e.target.value)}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            District / Location
                          </label>
                          <input
                            type="text"
                            required
                            value={campDistrict}
                            onChange={(e) => setCampDistrict(e.target.value)}
                            placeholder="Lira District, Uganda"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Receiving Institution (Direct EFT)
                          </label>
                          <input
                            type="text"
                            required
                            value={campInstitution}
                            onChange={(e) => setCampInstitution(e.target.value)}
                            placeholder="Hospital Treasury / School Bursar"
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Banner Image (Upload or URL)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={campCoverImage}
                              onChange={(e) => setCampCoverImage(e.target.value)}
                              className="h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-xs"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                              <Upload className="h-3.5 w-3.5" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileUpload(e, setCampCoverImage)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Short Subtitle
                        </label>
                        <input
                          type="text"
                          value={campSubtitle}
                          onChange={(e) => setCampSubtitle(e.target.value)}
                          placeholder="Brief one-sentence summary of the verified need..."
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Impact Story
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={campStory}
                          onChange={(e) => setCampStory(e.target.value)}
                          placeholder="Write the full impact story, beneficiary background, and direct institutional disbursement plan..."
                          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-mono font-bold text-white"
                      >
                        {editingCampaign ? 'SAVE CAMPAIGN CHANGES' : 'PUBLISH CAMPAIGN TO PUBLIC SITE'}
                      </button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {campaigns.map((c) => {
                      const status = campaignStatuses[c.id] || 'active';
                      const verified = campaignVerified[c.id] ?? true;
                      return (
                        <div
                          key={c.id}
                          className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3.5">
                            <img
                              src={c.coverImage}
                              alt={c.title}
                              className="h-16 w-20 rounded-lg object-cover shrink-0 bg-slate-100"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                                  {c.category}
                                </span>
                                <span
                                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                                    status === 'active'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {status}
                                </span>
                                {verified && (
                                  <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/campaign/${c.id}`}
                                className="font-bold text-sm text-slate-900 hover:text-emerald-700 flex items-center gap-1"
                              >
                                <span>{c.title}</span>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                              </Link>
                              <p className="text-xs text-slate-500 font-mono">
                                {formatUGX(c.raisedUGX)} / {formatUGX(c.goalUGX)} ·{' '}
                                {c.payoutVerification.institutionName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <button
                              type="button"
                              onClick={() => openEditCampaignEditor(c)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCampaignVerified((prev) => ({ ...prev, [c.id]: !verified }))
                              }
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50"
                            >
                              {verified ? 'Revoke Badge' : 'Verify Badge'}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCampaignStatuses((prev) => ({
                                  ...prev,
                                  [c.id]: status === 'active' ? 'paused' : 'active',
                                }))
                              }
                              className="rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-mono font-bold text-white"
                            >
                              {status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
