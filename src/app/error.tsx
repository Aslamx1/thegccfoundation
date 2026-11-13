'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error to monitoring if needed
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] px-4 py-16 bg-[#FBF9F6]">
      <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-card text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-2xl text-[#1A1A1A]">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 font-body">
            We encountered a temporary issue while loading this page. Our team has been notified.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#02A95C] hover:bg-[#028F4D] text-white text-sm font-bold py-2.5 px-5 rounded-full shadow-sm transition-all w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-gray-700 text-sm font-bold py-2.5 px-5 rounded-full shadow-subtle transition-all w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
