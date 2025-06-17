import './globals.css';
import type { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://krizpay.com'),
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
      {
        url: '/icon-512x512.png', // Fallback using your app icon
        width: 512,
        height: 512,
        alt: 'KrizPay Logo',
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
    { media: '(prefers-color-scheme: dark)', color: '#8B5CF6' },
  ],
  
  manifest: '/manifest.json',
  
  // UPDATED: Complete favicon and icon setup
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#8B5CF6',
      },
    ],
  },
  
  alternates: {
    canonical: 'https://krizpay.com',
  },
  
  // Additional metadata for better SEO
  category: 'Finance',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
  
  // App-specific metadata
  applicationName: 'KrizPay',
  appleWebApp: {
    capable: true,
    title: 'KrizPay',
    statusBarStyle: 'black-translucent',
  },
  
  // Microsoft specific
  other: {
    'msapplication-TileColor': '#8B5CF6',
    'msapplication-config': '/browserconfig.xml',
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
        {/* Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* UPDATED: Complete favicon setup for maximum compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        
        {/* Apple specific */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8B5CF6" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Microsoft specific */}
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Mobile optimization */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KrizPay" />
        
        {/* Theme colors for different browsers */}
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="msapplication-navbutton-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Security headers */}
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="preconnect" href="https://securetoken.googleapis.com" />
        
        {/* DNS prefetch for Firebase domains */}
        <link rel="dns-prefetch" href="//identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="//securetoken.googleapis.com" />
        <link rel="dns-prefetch" href="//firebaseapp.com" />
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