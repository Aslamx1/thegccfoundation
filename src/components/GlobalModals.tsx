'use client';

import dynamic from 'next/dynamic';
import { useDonation } from '@/context/DonationContext';
import HelpAssistant from '@/components/HelpAssistant';

const MaterialPledgeModal = dynamic(() => import('@/components/MaterialPledgeModal'), { ssr: false });
const SearchModal = dynamic(() => import('@/components/SearchModal'), { ssr: false });

export default function GlobalModals() {
  const { isPledgeModalOpen, isSearchModalOpen } = useDonation();

  return (
    <>
      {isPledgeModalOpen && <MaterialPledgeModal />}
      {isSearchModalOpen && <SearchModal />}
      <HelpAssistant />
    </>
  );
}
