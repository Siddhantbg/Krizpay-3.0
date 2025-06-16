import './globals.css';
import type { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'KrizPay - The Future of Decentralized Finance',
  description: 'Experience lightning-fast, secure blockchain payments with KrizPay. Revolutionary DeFi solutions for the modern world with bank-grade security and global reach.',
  keywords: 'blockchain, cryptocurrency, DeFi, digital payments, fintech, KrizPay, decentralized finance, crypto wallet, payment gateway',
  authors: [{ name: 'KrizPay Technologies' }],
  creator: 'KrizPay Technologies',
  publisher: 'KrizPay Technologies',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krizpay.com',
    siteName: 'KrizPay',
    title: 'KrizPay - The Future of Decentralized Finance',
    description: 'Experience lightning-fast, secure blockchain payments with KrizPay. Revolutionary DeFi solutions for the modern world.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KrizPay - Decentralized Finance Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@krizpay',
    creator: '@krizpay',
    title: 'KrizPay - The Future of Decentralized Finance',
    description: 'Experience lightning-fast, secure blockchain payments with KrizPay.',
    images: ['/twitter-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#8B5CF6',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://krizpay.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}