import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'ConfessIT — Anonymous Stories & Confessions',
  description:
    'Share your stories, confessions, and seek advice anonymously. A safe space to be heard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="bg-c-black text-white min-h-screen">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-6 pb-24">{children}</main>
        <AdBanner />
      </body>
    </html>
  );
}
