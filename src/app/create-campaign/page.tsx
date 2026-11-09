'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useCurrency } from '@/context/CurrencyContext';
import { Category } from '@/types';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  UserCheck,
  Plus,
  Trash2,
  AlertCircle,
  Clock
} from 'lucide-react';

interface BudgetItemInput {
  item: string;
  category: string;
  amountUGX: number;
  recipientEntity: string;
}

export default function CreateCampaignPage() {
  const { formatUGX } = useCurrency();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<Category>('Medical Care');
  const [title, setTitle] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [relationship, setRelationship] = useState('Parent / Legal Guardian');
  const [district, setDistrict] = useState('Kampala');
  const [facilityName, setFacilityName] = useState('Uganda Heart Institute (Mulago Complex)');
  const [story, setStory] = useState('');

  // Itemized Budget Builder
  const [budgetItems, setBudgetItems] = useState<BudgetItemInput[]>([
    {
      item: 'Surgical Theater Pack & Consumables',
      category: 'Medical Procedure',
      amountUGX: 4500000,
      recipientEntity: 'Hospital Accounts Office',
    },
    {
      item: 'Intensive Care Unit (3 Nights)',
      category: 'Hospital Inpatient',
      amountUGX: 2800000,
      recipientEntity: 'Hospital Accounts Office',
    },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Consumables');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemRecipient, setNewItemRecipient] = useState('');

  // KYC Fields
  const [organizerName, setOrganizerName] = useState('');
  const [ninNumber, setNinNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [idFileUploaded, setIdFileUploaded] = useState(false);
  const [lc1LetterUploaded, setLc1LetterUploaded] = useState(false);
  const [hospitalProformaUploaded, setHospitalProformaUploaded] = useState(false);

  // Institution Payout Destination
  const [payoutType, setPayoutType] = useState<'Hospital' | 'School' | 'Contractor'>('Hospital');
  const [institutionBank, setInstitutionBank] = useState('Stanbic Bank Uganda');
  const [institutionAccount, setInstitutionAccount] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('');

  const totalCalculatedGoal = budgetItems.reduce((acc, curr) => acc + curr.amountUGX, 0);

  const handleAddBudgetItem = () => {
    if (!newItemName || !newItemAmount) return;
    setBudgetItems([
      ...budgetItems,
      {
        item: newItemName,
        category: newItemCategory,
        amountUGX: parseFloat(newItemAmount),
        recipientEntity: newItemRecipient || facilityName,
      },
    ]);
    setNewItemName('');
    setNewItemAmount('');
    setNewItemRecipient('');
  };

  const handleRemoveBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `GCC-KYC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionRef(ref);
      setIsSubmitting(false);
      setStep(5); // Success step
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Header */}
      <section className="bg-white border-b border-[#E5E7EB] py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <span className="text-xs font-bold text-[#3D5E16] uppercase tracking-wider bg-[#F4F7EE] border border-[#CDDCB3] px-3 py-1 rounded-full">
            INSTITUTIONAL FUNDRAISER APPLICATION
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Apply to Start a Verified Fundraiser
          </h1>
          <p className="text-xs sm:text-sm text-gray-800 max-w-xl mx-auto">
            0% platform fee. All campaigns must pass identity, hospital proforma, and institution payout verification before going live.
          </p>

          {/* Stepper Indicator */}
          {step < 5 && (
            <div className="pt-6 flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
              {[
                { num: 1, label: 'Cause & Goal' },
                { num: 2, label: 'Budget Ledger' },
                { num: 3, label: 'KYC & ID' },
                { num: 4, label: 'Payout Account' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === s.num
                        ? 'bg-[#3D5E16] text-white ring-2 ring-[#CDDCB3]'
                        : step > s.num
                        ? 'bg-[#E6EED8] text-[#2F4812]'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-gray-800">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Form Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="font-heading font-extrabold text-xl text-gray-900">
              Step 1: Category, Beneficiary & Location
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Cause Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-gray-900"
                >
                  <option value="Medical Care">Medical Care (Surgery, ICU, Pharmaceuticals)</option>
                  <option value="Education & Tuition">Education & Tuition (Secondary & Tertiary Bursars)</option>
                  <option value="Clean Water Wells">Clean Water Wells (Deep Boreholes & Reticulation)</option>
                  <option value="Emergency Relief">Emergency Relief (Disaster, Mudslides, Floods)</option>
                  <option value="Rural Agriculture">Rural Agriculture & Irrigation Co-ops</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Campaign Headline:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Pediatric Open-Heart Surgery for 7-Year-Old Brenda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Beneficiary Patient/Group Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brenda Namubiru"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Your Relationship to Beneficiary:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mother / Headmaster / Physician"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">District / Town in Uganda:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kampala / Soroti / Tororo"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Health Facility or School Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mulago Hospital / St. Francis Nsambya"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Detailed Clinical or Community Narrative:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the patient's medical condition, diagnosis, treating physician's recommendation, and why family resources are exhausted. Avoid generic filler—include specific dates, medical terms, and clinical history."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!title || !beneficiaryName}
                className="bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-6 py-3 rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to Budget Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Line-Item Budget Builder */}
        {step === 2 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Step 2: Line-Item Budget Builder
              </h2>
              <p className="text-xs text-gray-800">
                Itemize each component of the hospital proforma or supply quote. We do not approve lump-sum targets without itemized breakdowns.
              </p>
            </div>

            {/* Existing Items */}
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] text-gray-700 font-bold border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-2.5 px-4">Item & Description</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-right">Amount (UGX)</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {budgetItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{item.item}</td>
                      <td className="py-3 px-4 text-gray-800">{item.category}</td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900 tabular-nums">
                        {formatUGX(item.amountUGX)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveBudgetItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-[#F4F7EE] border-t border-[#CDDCB3] p-3 flex justify-between items-center text-xs font-bold text-[#2F4812]">
                <span>Total Calculated Goal:</span>
                <span className="font-heading font-black text-sm text-[#3D5E16] tabular-nums">
                  {formatUGX(totalCalculatedGoal)}
                </span>
              </div>
            </div>

            {/* Add New Line-Item Input */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-gray-900 block">Add Line-Item Expense:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Expense Item (e.g. ICU 5 nights)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Amount in UGX (e.g. 1500000)"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-gray-900"
                />
                <button
                  type="button"
                  onClick={handleAddBudgetItem}
                  className="bg-[#3D5E16] text-white text-xs font-bold px-4 py-2 rounded flex items-center justify-center gap-1 hover:bg-[#2F4812]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-white border border-[#E5E7EB] text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={budgetItems.length === 0}
                className="bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to KYC Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: KYC & Identity Verification */}
        {step === 3 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Step 3: Identity & Document Verification (KYC)
              </h2>
              <p className="text-xs text-gray-800">
                To prevent scam campaigns, we require authenticated copies of the organizer's National ID card and official hospital documentation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold text-gray-800 block mb-1">Organizer Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="As shown on National ID"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold text-gray-800 block mb-1">Uganda NIN (National ID #):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CM880341029KL8"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900 font-mono"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold text-gray-800 block mb-1">WhatsApp / Phone #:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 7•• ••• •••"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* Document Upload Containers */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-gray-800 block">Required Verification Documents:</span>

                {/* Upload 1: National ID */}
                <div
                  onClick={() => setIdFileUploaded(true)}
                  className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    idFileUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-[#E5E7EB] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className={`w-5 h-5 ${idFileUploaded ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div>
                      <strong className="text-xs font-bold text-gray-900 block">
                        National ID Card (Front & Back Photo)
                      </strong>
                      <span className="text-[11px] text-gray-700">PNG, JPG or PDF up to 10MB</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded ${idFileUploaded ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {idFileUploaded ? '✓ Document Uploaded' : 'Simulate Upload'}
                  </span>
                </div>

                {/* Upload 2: Hospital Proforma Invoice */}
                <div
                  onClick={() => setHospitalProformaUploaded(true)}
                  className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    hospitalProformaUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-[#E5E7EB] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-5 h-5 ${hospitalProformaUploaded ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div>
                      <strong className="text-xs font-bold text-gray-900 block">
                        Official Hospital Proforma Invoice / Doctor’s Letter
                      </strong>
                      <span className="text-[11px] text-gray-700">Must bear hospital stamp and treating physician signature</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded ${hospitalProformaUploaded ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {hospitalProformaUploaded ? '✓ Document Uploaded' : 'Simulate Upload'}
                  </span>
                </div>

                {/* Upload 3: LC1 Letter */}
                <div
                  onClick={() => setLc1LetterUploaded(true)}
                  className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    lc1LetterUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-[#E5E7EB] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={`w-5 h-5 ${lc1LetterUploaded ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div>
                      <strong className="text-xs font-bold text-gray-900 block">
                        Local Council (LC1) Chairperson Letter of Recommendation
                      </strong>
                      <span className="text-[11px] text-gray-700">Confirms residence and genuine need</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded ${lc1LetterUploaded ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {lc1LetterUploaded ? '✓ Document Uploaded' : 'Simulate Upload'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-white border border-[#E5E7EB] text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!organizerName || !ninNumber}
                className="bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to Payout Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Institutional Payout Verification */}
        {step === 4 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Step 4: Institutional Payout Destination
              </h2>
              <p className="text-xs text-gray-800">
                Specify the verified bank account where funds will be wired directly. Personal mobile money is strictly audited.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'Hospital', label: 'Hospital Bank Account' },
                  { type: 'School', label: 'School Bursar Account' },
                  { type: 'Contractor', label: 'Certified Contractor' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setPayoutType(item.type as any)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      payoutType === item.type
                        ? 'border-[#3D5E16] bg-[#F4F7EE] text-[#2F4812] ring-1 ring-[#3D5E16]'
                        : 'border-[#E5E7EB] bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Commercial Bank:</label>
                  <select
                    value={institutionBank}
                    onChange={(e) => setInstitutionBank(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-gray-900"
                  >
                    <option value="Stanbic Bank Uganda">Stanbic Bank Uganda</option>
                    <option value="Centenary Rural Development Bank">Centenary Bank Uganda</option>
                    <option value="DFCU Bank Uganda">DFCU Bank Uganda</option>
                    <option value="Absa Bank Uganda">Absa Bank Uganda</option>
                    <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                    <option value="Equity Bank Uganda">Equity Bank Uganda</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Official Account Number:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9030018841294"
                    value={institutionAccount}
                    onChange={(e) => setInstitutionAccount(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-lg text-xs text-gray-900 font-mono"
                  />
                </div>
              </div>

              {/* Legal Confirmation Notice */}
              <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-[#3D5E16] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Institutional Payout Terms</span>
                </div>
                <p className="text-[11px] text-gray-700 leading-tight">
                  By submitting this application, I consent to GCC Foundation compliance officers contacting the health facility or school to verify the proforma and wire funds directly to their official institutional treasury upon campaign funding.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-white border border-[#E5E7EB] text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-8 py-3 rounded-lg shadow flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting to Compliance Board...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#AFC68A]" />
                    <span>Submit for Compliance Vetting</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success & Review SLA Timeline */}
        {step === 5 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 sm:p-10 shadow-elevated text-center space-y-6">
            <div className="w-16 h-16 bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                APPLICATION SUBMITTED · AUDIT QUEUE
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
                Application Received for Vetting!
              </h2>
              <p className="text-xs sm:text-sm text-gray-800 max-w-md mx-auto">
                Thank you, <strong className="text-gray-900">{organizerName || 'Organizer'}</strong>. Your application has been logged with GCC Compliance Office under reference:
              </p>
              <div className="font-mono font-black text-lg text-[#3D5E16] bg-[#F4F7EE] py-2 px-4 rounded-lg inline-block border border-[#CDDCB3]">
                {submissionRef}
              </div>
            </div>

            {/* SLA Timeline */}
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-5 text-left max-w-md mx-auto space-y-3 text-xs">
              <span className="font-bold text-gray-900 block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#3D5E16]" />
                What happens next (6–12 Hours SLA):
              </span>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#3D5E16]">1.</span>
                  <span>Compliance officer Pauline Namukasa calls your phone to authenticate your National ID.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#3D5E16]">2.</span>
                  <span>Our medical officer cross-checks the proforma invoice with {facilityName || 'the hospital'}.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#3D5E16]">3.</span>
                  <span>Once cleared, your campaign goes live with an official verified badge!</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/"
                className="bg-[#3D5E16] hover:bg-[#2F4812] text-white text-xs font-bold px-6 py-3 rounded-lg shadow transition-colors"
              >
                Return to Home
              </Link>
              <Link
                href="/admin"
                className="bg-white hover:bg-gray-50 border border-[#E5E7EB] text-gray-800 text-xs font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Inspect in Auditor Portal
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
