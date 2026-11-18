'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useCurrency } from '@/context/CurrencyContext';
import { useDonation } from '@/context/DonationContext';
import { Campaign, Category } from '@/types';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  UserCheck,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';

export default function CreateCampaignPage() {
  const { formatUGX } = useCurrency();
  const { addNewCampaign } = useDonation();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<Category>('Medical Care');
  const [country, setCountry] = useState('Uganda');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedCountry = params.get('country');
    const selectedDistrict = params.get('district');
    if (selectedCountry) setCountry(selectedCountry);
    if (selectedDistrict) setDistrict(selectedDistrict);
  }, []);
  const [title, setTitle] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [relationship, setRelationship] = useState('Parent / Legal Guardian');
  const [district, setDistrict] = useState('Kampala');
  const [facilityName, setFacilityName] = useState('Uganda Heart Institute (Mulago Complex)');
  const [story, setStory] = useState('');
  const [goalAmount, setGoalAmount] = useState('15000000'); // 15M UGX default
  const [coverImageUrl, setCoverImageUrl] = useState(
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'
  );

  // KYC Fields
  const [organizerName, setOrganizerName] = useState('');
  const [ninNumber, setNinNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [idFileUploaded, setIdFileUploaded] = useState(false);
  const [idFileName, setIdFileName] = useState('');
  const [hospitalProformaUploaded, setHospitalProformaUploaded] = useState(false);
  const [proformaFileName, setProformaFileName] = useState('');

  // Institution Payout Destination
  const [payoutType, setPayoutType] = useState<'Direct-to-Hospital' | 'Direct-to-School' | 'Direct-to-Contractor'>('Direct-to-Hospital');
  const [institutionBank, setInstitutionBank] = useState('Stanbic Bank Uganda');
  const [institutionAccount, setInstitutionAccount] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCampaignId, setNewCampaignId] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const generatedId = `gcc-user-${Date.now().toString().slice(-4)}`;
    const parsedGoal = parseFloat(goalAmount) || 15000000;

    const createdCampaign: Campaign = {
      id: generatedId,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title || 'Community Emergency Relief Fundraiser',
      subtitle: story.slice(0, 120) || '100% of funds wired directly to verified institutional accounts.',
      category,
      location: {
        district,
        subCounty: 'Central Division',
        country,
        facilityName,
      },
      goalUGX: parsedGoal,
      raisedUGX: 0,
      donorCount: 0,
      daysRemaining: 30,
      createdAt: new Date().toISOString().split('T')[0],
      urgent: true,
      featured: false,
      coverImage: coverImageUrl,
      galleryImages: [
        {
          url: coverImageUrl,
          caption: `Documentation verified for ${beneficiaryName}`,
          dateStamp: 'Just uploaded',
          capturedBy: organizerName || 'GCC Field Officer',
        },
      ],
      payoutVerification: {
        type: payoutType,
        institutionName: facilityName,
        accountNumberMasked: institutionAccount ? `••• ${institutionAccount.slice(-4)}` : 'Stanbic Bank A/C •••• 9920',
        bankName: institutionBank,
        verificationReference: `GCC-KYC-${Math.floor(1000 + Math.random() * 9000)}`,
        complianceOfficer: 'Pauline Namukasa, FCCA',
      },
      organizer: {
        name: organizerName || 'Registered Organizer',
        role: relationship,
        ninOrIdMasked: ninNumber ? `NIN: ${ninNumber.slice(0, 4)}••••` : 'Uganda NIN: CM88••••',
        verifiedBadge: false,
        relationshipToBeneficiary: relationship,
        phoneMasked: phone ? `${phone.slice(0, 6)}••••` : '+256 7•• ••••',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        residence: district,
      },
      beneficiary: {
        name: beneficiaryName,
        storySummary: story.slice(0, 100),
        hospitalOrSchoolRef: `File #${Math.floor(1000 + Math.random() * 9000)}`,
      },
      fullStoryHtml: [
        story ||
          'This fundraiser was created on GCC Foundation with direct institutional payment safeguards. All disbursements are sent straight to the verified hospital, school, or contractor accounts.',
      ],
      itemizedBudget: [
        {
          id: 'exp-new-1',
          item: 'Primary Medical/Tuition Procedure Package',
          category: 'Procedure',
          amountUGX: parsedGoal,
          recipientEntity: facilityName,
          status: 'Estimated',
        },
      ],
      fieldUpdates: [],
      recentDonors: [],
      volunteerPledges: [],
    };

    try {
      const campaignId = await addNewCampaign(createdCampaign);
      setNewCampaignId(campaignId);
      setStep(5);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit this campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FBF9F6]">
      <Header />

      {/* Header */}
      <section className="bg-white border-b border-[#E5E7EB] py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-[#02A95C] uppercase tracking-wider bg-[#E6EED8] px-3.5 py-1 rounded-full">
            START A GCC FUNDRAISER • 0% PLATFORM FEE
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight">
            Tell your story and get verified
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Funds are wired straight to the hospital, school, or community project account.
          </p>

          {/* Stepper Indicator */}
          {step < 5 && (
            <div className="pt-4 flex items-center justify-center gap-3">
              {[
                { num: 1, label: 'Cause' },
                { num: 2, label: 'Goal' },
                { num: 3, label: 'Story & Photo' },
                { num: 4, label: 'KYC & Payout' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s.num
                        ? 'bg-[#02A95C] text-white'
                        : step > s.num
                        ? 'bg-[#E6EED8] text-[#2F4812]'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-gray-700">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Wizard Form */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        
        {/* STEP 1: Category & Beneficiary */}
        {step === 1 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
            <h2 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Step 1: Who are you fundraising for?
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Select Cause Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#02A95C]"
                >
                  <option value="Medical Care">Medical Care (Surgery, ICU, Hospital Bills)</option>
                  <option value="Education & Tuition">Education & Tuition (School Bursars)</option>
                  <option value="Emergency Relief">Emergency Relief (Disaster, Displacement)</option>
                  <option value="Clean Water Wells">Clean Water Wells (Solar Boreholes)</option>
                  <option value="Rural Agriculture">Rural Agriculture & Women Co-ops</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Beneficiary Name (Person or Community):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brenda Namubiru or Gweri Village"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#02A95C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Your Relationship:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mother, Teacher, Doctor"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">District / City:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kampala, Soroti, Tororo"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Health Facility or School Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uganda Heart Institute or St. Francis Hospital Nsambya"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!beneficiaryName.trim() || !district.trim() || !facilityName.trim() || !relationship.trim()}
                className="bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold py-3 px-6 rounded-full shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to Target Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Goal Amount */}
        {step === 2 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
            <h2 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Step 2: How much do you need to raise?
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Target Amount in Ugandan Shillings (UGX):</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold text-xs">
                    UGX
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="15000000"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    className="w-full pl-16 pr-4 py-3.5 bg-[#FBF9F6] border border-[#E5E7EB] rounded-xl text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#02A95C] tabular-nums"
                  />
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Equivalent to approximately <strong className="text-gray-800 font-semibold">{formatUGX(parseFloat(goalAmount) || 0)}</strong>.
                </span>
              </div>

              <div className="bg-[#FBF9F6] border border-[#E5E7EB] rounded-xl p-4 text-xs space-y-1.5 text-gray-600">
                <span className="font-bold text-[#02A95C] block">0% Platform Fee Guarantee</span>
                <p>
                  GCC Foundation charges 0% fees on charities. Every shilling raised goes directly to your verified hospital or school bursar account.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="border border-[#E5E7EB] text-gray-700 text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!Number.isFinite(Number(goalAmount)) || Number(goalAmount) <= 0}
                className="bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold py-3 px-6 rounded-full shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to Story & Photo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Story & Cover Photo */}
        {step === 3 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
            <h2 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Step 3: Campaign Title & Story
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Fundraiser Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Open-Heart Surgery for Brenda at Mulago"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#02A95C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Cover Photo URL (Authentic Candid Photo):</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">Full Story Narrative:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the background, diagnosis, medical recommendation, and why community help is needed..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#02A95C]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="border border-[#E5E7EB] text-gray-700 text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!title.trim() || !story.trim()}
                className="bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold py-3 px-6 rounded-full shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to KYC & Payout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: KYC & Institutional Payout */}
        {step === 4 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
            <h2 className="font-heading font-extrabold text-xl text-[#1A1A1A]">
              Step 4: Organizer Identity & Institutional Payout
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Your Full Legal Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="As shown on National ID"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Uganda NIN (National ID):</label>
                  <input
                    type="text"
                    required
                    placeholder="CM880341029•••"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Direct Bank Destination:</label>
                  <select
                    value={institutionBank}
                    onChange={(e) => setInstitutionBank(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-gray-900"
                  >
                    <option value="Stanbic Bank Uganda">Stanbic Bank Uganda</option>
                    <option value="Centenary Rural Development Bank">Centenary Bank Uganda</option>
                    <option value="DFCU Bank Uganda">DFCU Bank Uganda</option>
                    <option value="Absa Bank Uganda">Absa Bank Uganda</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">Hospital/School Account #:</label>
                  <input
                    type="text"
                    placeholder="e.g. 9030018841294"
                    value={institutionAccount}
                    onChange={(e) => setInstitutionAccount(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl text-xs text-gray-900 font-mono"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#DCE9DD] bg-[#F5F8F4] p-4 text-xs leading-relaxed text-[#20251F]">
                Upload your identification and the hospital proforma or school bursar invoice so our compliance team can complete institutional verification.
              </div>
              <div className="pt-2 space-y-4">
                <label className="block text-xs font-bold text-gray-800">Upload ID / passport file
                  <input type="file" accept="image/*,.pdf" onChange={(event) => { const file = event.target.files?.[0]; setIdFileUploaded(Boolean(file)); setIdFileName(file?.name ?? ''); }} className="mt-2 block w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs font-normal" />
                  {idFileName && <span className="mt-1 block font-normal text-[#087443]">Attached: {idFileName} ✓</span>}
                </label>
                <label className="block text-xs font-bold text-gray-800">Upload hospital proforma / school invoice
                  <input type="file" accept="image/*,.pdf" onChange={(event) => { const file = event.target.files?.[0]; setHospitalProformaUploaded(Boolean(file)); setProformaFileName(file?.name ?? ''); }} className="mt-2 block w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs font-normal" />
                  {proformaFileName && <span className="mt-1 block font-normal text-[#087443]">Attached: {proformaFileName} ✓</span>}
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="border border-[#E5E7EB] text-gray-700 text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !organizerName.trim() || !ninNumber.trim() || !institutionAccount.trim() || !idFileUploaded || !hospitalProformaUploaded}
                className="bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs font-bold py-3 px-8 rounded-full shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Publishing Fundraiser...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Publish Fundraiser</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success & Live Link */}
        {step === 5 && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 sm:p-12 shadow-card text-center space-y-6">
            <div className="w-16 h-16 bg-[#E6EED8] text-[#02A95C] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A]">
                Your fundraiser is live!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your campaign has been published on GCC Foundation and is ready to share with your friends, family, and community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/campaign/${newCampaignId}`}
                className="bg-[#02A95C] hover:bg-[#028F4D] text-white text-xs sm:text-sm font-bold py-3.5 px-8 rounded-full shadow-sm transition-all text-center w-full sm:w-auto"
              >
                View Live Fundraiser
              </Link>
              <Link
                href="/"
                className="border border-[#E5E7EB] hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold py-3.5 px-8 rounded-full transition-colors text-center w-full sm:w-auto"
              >
                Return to Discover Grid
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

