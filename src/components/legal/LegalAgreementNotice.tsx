import React from 'react';
import Link from 'next/link';

interface LegalAgreementNoticeProps {
  className?: string;
  actionText?: string;
}

export function LegalAgreementNotice({
  className = '',
  actionText = 'By continuing',
}: LegalAgreementNoticeProps) {
  return (
    <p className={`text-xs text-center text-gray-500 leading-relaxed ${className}`}>
      {actionText}, you are agreeing to our{' '}
      <Link
        href="/terms-and-conditions"
        className="font-medium text-gray-700 underline underline-offset-2 hover:text-[#02A95C] transition-colors"
      >
        Terms &amp; Conditions
      </Link>{' '}
      and{' '}
      <Link
        href="/privacy-policy"
        className="font-medium text-gray-700 underline underline-offset-2 hover:text-[#02A95C] transition-colors"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}
