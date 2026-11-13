'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import { TEAM_MEMBERS } from '@/data/campaigns';
import {
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  CheckCircle2,
  Award,
} from 'lucide-react';

export default function OurTeamPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F6]">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-[#E5E7EB] py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-[#3D5E16] uppercase tracking-wider bg-[#F4F7EE] border border-[#CDDCB3] px-3 py-1 rounded-full">
            REAL LEADERSHIP & GOVERNANCE
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight">
            Our Executive Team & Board of Trustees
          </h1>
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            GCC Foundation is steered by licensed East African medical practitioners, forensic compliance auditors, and civil engineers dedicated to eliminating fraud in humanitarian giving.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
        <div>
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-[#3D5E16]" />
            <h2 className="font-heading font-extrabold text-xl text-gray-900">
              Executive Committee & Medical Review Board
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#AFC68A]" />
                        {member.location}
                      </span>
                      <span className="text-[#8AA95E] font-mono text-[10px]">Verified Staff</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-[#3D5E16] uppercase font-bold tracking-wider block">
                      {member.department}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-gray-900 leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-gray-700">
                      {member.role}
                    </p>
                    <p className="text-xs text-gray-800 leading-relaxed font-body pt-1">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 mt-2 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-700 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{member.credentials}</span>
                  </div>
                  <a
                    href={`mailto:${member.linkedinOrEmail}`}
                    className="flex items-center gap-1.5 text-[#3D5E16] hover:text-[#2F4812] font-semibold text-[11px]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{member.linkedinOrEmail}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board of Trustees Oversight Statement */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#3D5E16]" />
            <h3 className="font-heading font-extrabold text-xl text-gray-900">
              Independent Board of Trustees Governance
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-body">
            GCC Foundation operates under a strict deed of trust registered with the Uganda Registration Services Bureau (URSB Reg: 80020003418291). The Board meets quarterly to review all institutional escrow accounts, examine hospital payment reconciliations, and ensure that 100% of public donations reach the verified hospital, school, or community project accounts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5">
              <strong className="text-gray-900 block font-bold">Audit Committee</strong>
              <span className="text-gray-700 block mt-1">Chaired by independent KPMG-accredited CPAs.</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5">
              <strong className="text-gray-900 block font-bold">Medical Ethics Panel</strong>
              <span className="text-gray-700 block mt-1">Senior consultants from Makerere College of Health Sciences.</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl p-3.5">
              <strong className="text-gray-900 block font-bold">Community Safeguarding</strong>
              <span className="text-gray-700 block mt-1">Local Council LC1 & NGO Bureau legal liaisons.</span>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

