import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] px-4 py-16 bg-[#FBF9F6]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E6EED8] text-[#2F4812] font-heading font-black text-2xl">
          404
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1A1A1A]">
          Fundraiser Not Found
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed font-body">
          The campaign or page you are looking for doesn’t exist or has concluded. Browse our verified fundraisers to support another cause.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#02A95C] hover:bg-[#028F4D] text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-sm hover:shadow transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fundraisers</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
