import React from 'react';
import type { Metadata } from 'next';
import { PropertyList } from '@/components/properties/PropertyList';

export const metadata: Metadata = {
  title: 'Real Estate & Property Portfolio | GCC Foundation',
  description: 'Explore GCC real estate, community assets, and endowment holdings.',
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PropertyList />
      </div>
    </div>
  );
}
