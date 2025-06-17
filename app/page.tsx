'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import LoadingScreen from '@/components/LoadingScreen';
import PageTransition from '@/components/PageTransition';
import SoundManager from '@/components/SoundManager';
import PerformanceMonitor from '@/components/PerformanceMonitor';
// Import the KrizPay logo components
import { KrizPayLogo } from '@/components/KrizPayLogo';

// Lazy load components for better performance
const SeamlessPayments = lazy(() => import('@/components/SeamlessPayments'));
const BlockchainSecurity = lazy(() => import('@/components/BlockchainSecurity'));
const GlobalReach = lazy(() => import('@/components/GlobalReach'));
const IndiaGrowthJourney = lazy(() => import('@/components/IndiaGrowthJourney'));
const CreditCardDemo = lazy(() => import('@/components/CreditCardDemo'));

// Enhanced Loading component with KrizPay branding
const SectionLoader = () => (
  <div className="py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Loading with KrizPay logo */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center shadow-lg shadow-primary-purple/20 animate-pulse">
            <KrizPayLogo size={32} variant="white" />
          </div>
          <div className="loading-skeleton h-12 w-3/4 mx-auto rounded-lg"></div>
          <div className="loading-skeleton h-6 w-1/2 mx-auto rounded-lg"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="loading-skeleton h-64 rounded-2xl"></div>
              <div className="loading-skeleton h-4 w-3/4 rounded"></div>
              <div className="loading-skeleton h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Loading Screen with KrizPay branding
const KrizPayLoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Large KrizPay logo */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-3xl hero-gradient flex items-center justify-center shadow-2xl shadow-primary-purple/30 animate-pulse">
            <KrizPayLogo size={80} variant="white" priority />
          </div>
        </div>

        {/* Brand text */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text">KrizPay</h1>
          <p className="text-text-secondary">The Future of Finance</p>
        </div>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-primary-purple to-primary-blue transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-text-secondary text-sm mt-2">{progress}%</p>
        </div>

        {/* Loading text */}
        <p className="text-text-secondary animate-pulse">
          Initializing secure payment infrastructure...
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Check user preference for sound
    const soundPreference = localStorage.getItem('krizpay-sound-enabled');
    setSoundEnabled(soundPreference === 'true');

    // Preload the KrizPay logo for better performance
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/KrizPay.svg';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <KrizPayLoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <PageTransition>
        <Layout>
          <main id="main-content">
            {/* Hero section loads immediately */}
            <Hero />
            
            {/* Lazy load other sections with enhanced loading states */}
            <Suspense fallback={<SectionLoader />}>
              <section id="features" aria-label="Payment features">
                <SeamlessPayments />
              </section>
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <section id="security" aria-label="Security features">
                <BlockchainSecurity />
              </section>
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <section id="card-demo" aria-label="Credit card demo">
                <CreditCardDemo />
              </section>
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <section id="global" aria-label="Global reach">
                <GlobalReach />
              </section>
            </Suspense>
            
            <Suspense fallback={<SectionLoader />}>
              <section id="growth" aria-label="India growth journey">
                <IndiaGrowthJourney />
              </section>
            </Suspense>
          </main>
        </Layout>
      </PageTransition>
      
      {/* Optional sound effects */}
      <SoundManager enabled={soundEnabled} />
      
      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
    </>
  );
}