'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDonation } from '@/context/DonationContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Search, X, MapPin, Building2, ArrowRight } from 'lucide-react';

export default function SearchModal() {
  const { campaigns, isSearchModalOpen, closeSearchModal } = useDonation();
  const { formatUGX } = useCurrency();
  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const results = campaigns.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.location.district.toLowerCase().includes(q) ||
      c.location.facilityName?.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5E7EB] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search by cause, hospital, city or organizer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={closeSearchModal}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Quick Filter */}
        <div className="px-5 py-3 bg-[#FBF9F6] border-b border-[#E5E7EB] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-500 font-medium whitespace-nowrap">Suggested:</span>
          {['Medical Care', 'Education', 'Clean Water', 'Emergency'].map((cat) => (
            <button
              key={cat}
              onClick={() => setQuery(cat)}
              className="px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-gray-700 hover:border-gray-400 font-medium whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            {query ? `Search Results (${results.length})` : 'Popular Verified Causes'}
          </div>

          {results.length > 0 ? (
            results.map((c) => (
              <Link
                key={c.id}
                href={`/campaign/${c.id}`}
                onClick={closeSearchModal}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#FBF9F6] transition-colors group"
              >
                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={c.coverImage} alt={c.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[#02A95C] block">
                    {c.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#02A95C] truncate transition-colors">
                    {c.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-0.5">
                    <span>{formatUGX(c.raisedUGX)} raised</span>
                    <span>•</span>
                    <span className="truncate">{c.location.facilityName || c.location.district}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#02A95C] flex-shrink-0" />
              </Link>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-gray-500">
              No matching verified causes found for "{query}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
