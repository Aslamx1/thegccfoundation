import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { DonationProvider } from '@/context/DonationContext';
import TopTrustBar from '@/components/TopTrustBar';
import Footer from '@/components/Footer';
import CheckoutModal from '@/components/CheckoutModal';
import MaterialPledgeModal from '@/components/MaterialPledgeModal';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'GCC Foundation | Vetted East African Crowdfunding & Direct Giving',
  description:
    'Institutional crowdfunding platform for Uganda and East Africa. 100% of medical and tuition donations wired directly to verified hospital and school accounts with itemized public receipt ledgers.',
  keywords: [
    'GCC Foundation',
    'Uganda donation',
    'East Africa crowdfunding',
    'Mulago hospital donation',
    'MTN Mobile Money donate',
    'Airtel Money donate',
    'vetted charity Uganda',
  ],
  icons: {
    icon: '/images/gcc-emblem.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col font-body antialiased selection:bg-[#E6EED8] selection:text-[#1F310C]">
        <CurrencyProvider>
          <DonationProvider>
            <TopTrustBar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <CheckoutModal />
            <MaterialPledgeModal />
          </DonationProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
