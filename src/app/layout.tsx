import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { DonationProvider } from '@/context/DonationContext';
import { AuthProvider } from '@/context/AuthContext';
import Footer from '@/components/Footer';
import GlobalModals from '@/components/GlobalModals';


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'GCC Foundation | Vetted East African Crowdfunding & Direct Giving',
    template: '%s | GCC Foundation',
  },
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'GCC Foundation',
    title: 'GCC Foundation | Vetted East African Crowdfunding',
    description: '100% direct institutional payouts to verified hospitals and schools.',
    images: [
      {
        url: '/images/gcc-logo-full.jpg',
        width: 1200,
        height: 630,
        alt: 'GCC Foundation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GCC Foundation',
    description: 'Vetted crowdfunding for East Africa with 100% direct payouts.',
    images: ['/images/gcc-logo-full.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#02A95C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script type="module" src="https://donorbox.org/widgets.js" async></script>
      </head>
      <body className="min-h-screen flex flex-col font-body antialiased selection:bg-[#E6EED8] selection:text-[#1F310C]">
        <AuthProvider>
          <CurrencyProvider>
            <DonationProvider>
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
              <GlobalModals />
            </DonationProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

