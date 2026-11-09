'use client';

import React, { useState } from 'react';
import { useDonation } from '@/context/DonationContext';
import { X, Package, Wrench, HandHeart, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function MaterialPledgeModal() {
  const { activeCampaignForPledge, isPledgeModalOpen, closePledgeModal, submitVolunteerPledge } = useDonation();

  const [supporterName, setSupporterName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [pledgeType, setPledgeType] = useState<'Physical Supplies' | 'Professional Skills' | 'Manual Labor'>('Physical Supplies');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPledgeModalOpen || !activeCampaignForPledge) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !phoneOrEmail) return;

    setIsSubmitting(true);
    await submitVolunteerPledge(activeCampaignForPledge.id, {
      supporterName: supporterName || 'Community Volunteer',
      phoneOrEmail,
      pledgeType,
      description,
    });
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSupporterName('');
    setPhoneOrEmail('');
    setDescription('');
    closePledgeModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl overflow-hidden my-6 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#FAF9F6] border-b border-[#E5E7EB] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandHeart className="w-5 h-5 text-[#3D5E16]" />
            <div>
              <span className="font-heading font-black text-sm text-[#3D5E16] block">
                PLEDGE SUPPLIES OR VOLUNTEER TIME
              </span>
              <span className="text-[11px] text-gray-700 font-medium">
                Support without cash · Mobilize local East African resources
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-[#F4F7EE] text-[#3D5E16] border border-[#CDDCB3] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">
              Pledge Successfully Recorded!
            </h3>
            <p className="text-xs text-gray-800 max-w-sm mx-auto">
              Thank you! Your pledge has been logged to the campaign dashboard. Our local field officer will contact you at <strong className="text-gray-900">{phoneOrEmail}</strong> to coordinate logistics.
            </p>
            <button
              onClick={handleClose}
              className="bg-[#3D5E16] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow hover:bg-[#2F4812]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-lg p-3 text-xs">
              <span className="text-gray-700 block">Pledging in support of:</span>
              <span className="font-heading font-bold text-gray-900 line-clamp-1">
                {activeCampaignForPledge.title}
              </span>
            </div>

            {/* Pledge Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">What are you pledging?</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'Physical Supplies', icon: Package, desc: 'Goods, Blood, Materials' },
                  { type: 'Professional Skills', icon: Wrench, desc: 'Medical, Engineering, Legal' },
                  { type: 'Manual Labor', icon: HandHeart, desc: 'Trenching, Packing, Transport' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = pledgeType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setPledgeType(item.type as any)}
                      className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-[#3D5E16] bg-[#F4F7EE] ring-1 ring-[#3D5E16]'
                          : 'border-[#E5E7EB] bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#3D5E16]' : 'text-gray-600'}`} />
                      <span className="text-xs font-bold text-gray-900 mt-2">{item.type}</span>
                      <span className="text-[10px] text-gray-700">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-800">
                Describe your pledge in detail:
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g., 'I can donate 20 bags of cement for the borehole foundation' or 'I am an RN nurse willing to provide wound dressing post-op.'"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#3D5E16]"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Timothy Okoth"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-gray-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone or WhatsApp:</label>
                <input
                  type="text"
                  required
                  placeholder="+256 7•• ••• •••"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-gray-900"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3D5E16] hover:bg-[#2F4812] text-white font-bold text-xs py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Registering Pledge...' : 'Submit Verified Pledge'}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D5E16]" />
              <span>GCC field officers verify every material donation before dispatch.</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
