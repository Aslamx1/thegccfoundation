'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DonorboxWidgetProps {
  campaign?: string;
  type?: string;
  enableAutoScroll?: boolean;
  className?: string;
}

export default function DonorboxWidget({ 
  campaign = 'gcc-foundation',
  type = 'donation_form',
  enableAutoScroll = true,
  className = ''
}: DonorboxWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://donorbox.org/widgets.js';
    script.async = true;
    
    script.onload = () => {
      setScriptLoaded(true);
    };
    
    script.onerror = () => {
      setScriptError(true);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && containerRef.current) {
      const widget = containerRef.current.querySelector('dbox-widget');
      if (widget) {
        widget.setAttribute('campaign', campaign);
        widget.setAttribute('type', type);
        widget.setAttribute('enable-auto-scroll', enableAutoScroll.toString());
      }
    }
  }, [scriptLoaded, campaign, type, enableAutoScroll]);

  if (scriptError) {
    return (
      <div className={`rounded-2xl bg-white p-6 border border-red-200 text-red-700 ${className}`}>
        <p className="font-semibold">Unable to load donation widget</p>
        <p className="text-sm mt-1">Please visit <a href="https://donorbox.org/gcc-foundation" target="_blank" rel="noopener noreferrer" className="underline text-[#02A95C]">donorbox.org/gcc-foundation</a> to donate.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`rounded-2xl bg-white p-6 border border-gray-100 ${className}`}
    >
      {scriptLoaded ? (
        <dbox-widget
          campaign={campaign}
          type={type}
          enable-auto-scroll={enableAutoScroll.toString()}
        />
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02A95C]"></div>
        </div>
      )}
    </div>
  );
}