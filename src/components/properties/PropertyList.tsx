'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useProperties } from '@/hooks/useProperties';
import {
  Building2,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export function PropertyList() {
  const { properties, loading, error, refetch } = useProperties();
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredProperties = properties.filter((p) => {
    if (selectedType === 'all') return true;
    return p.type.toLowerCase() === selectedType.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            GCC Real Estate &amp; Endowment Holdings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Real Estate &amp; Property Portfolio
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Connected via secure TypeScript API client (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">api.get(&apos;/api/properties&apos;)</code>) with credentials and error handling.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Filter properties by type"
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          >
            <option value="all">All Property Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Agricultural / Land</option>
          </select>

          <button
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-xs animate-pulse">
              <div className="w-full h-48 bg-slate-200 rounded-2xl" />
              <div className="h-5 bg-slate-200 rounded-md w-3/4" />
              <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl max-w-xl mx-auto text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-rose-900">Failed to Load Properties</h2>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProperties.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 max-w-md mx-auto space-y-3">
          <Home className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Properties Found</h2>
          <p className="text-xs text-slate-500">
            No listings currently match the selected property filter.
          </p>
        </div>
      )}

      {/* Property Cards Grid */}
      {!loading && !error && filteredProperties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                <Image
                  src={prop.imageUrl || '/images/hero-home.jpg'}
                  alt={prop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                    {prop.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                    ${prop.price.toLocaleString()} {prop.currency}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {prop.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                    {prop.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-600 font-medium">
                  {prop.bedrooms !== null && prop.bedrooms !== undefined && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.bedrooms} Beds</span>
                    </div>
                  )}

                  {prop.bathrooms !== null && prop.bathrooms !== undefined && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.bathrooms} Baths</span>
                    </div>
                  )}

                  {prop.areaSqFt && (
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.areaSqFt.toLocaleString()} sqft</span>
                    </div>
                  )}

                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
