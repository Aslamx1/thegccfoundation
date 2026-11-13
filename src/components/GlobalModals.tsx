'use client';

import dynamic from 'next/dynamic';
import { useDonation } from '@/context/DonationContext';
import HelpAssistant from '@/components/HelpAssistant';

const CheckoutModal = dynamic(() => import('@/components/CheckoutModal'), { ssr: false });
const MaterialPledgeModal = dynamic(() => import('@/components/MaterialPledgeModal'), { ssr: false });
const SearchModal = dynamic(() => import('@/components/SearchModal'), { ssr: false });

export default function GlobalModals() {
  const { isDonationModalOpen, isPledgeModalOpen, isSearchModalOpen } = useDonation();

  return (
    <>
      {isDonationModalOpen && <CheckoutModal />}
      {isPledgeModalOpen && <MaterialPledgeModal />}
      {isSearchModalOpen && <SearchModal />}
      <HelpAssistant />
    </>
  );
}
