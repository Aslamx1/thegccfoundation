'use client';

import React, { useEffect, useRef } from 'react';

interface DonorboxWidgetProps {
  campaign?: string;
  type?: string;
  enableAutoScroll?: boolean;
  className?: string;
}

const DONORBOX_SCRIPT_SRC = 'https://donorbox.org/widgets.js';

export default function DonorboxWidget({
  campaign = 'gcc-foundation',
  type = 'donation_form',
  enableAutoScroll = true,
  className = '',
}: DonorboxWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Render <dbox-widget> with attributes in place before/during custom element upgrade
    if (containerRef.current) {
      containerRef.current.innerHTML = `<dbox-widget campaign="${campaign}" type="${type}" enable-auto-scroll="${enableAutoScroll}"></dbox-widget>`;
    }

    // 2. Ensure the Donorbox module script is loaded once in document.head
    const existingScript = document.querySelector(`script[src="${DONORBOX_SCRIPT_SRC}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = DONORBOX_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [campaign, type, enableAutoScroll]);

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl bg-white p-4 sm:p-6 border border-gray-100 flex justify-center min-h-[420px] ${className}`}
    />
  );
}
