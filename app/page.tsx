'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import LoadingScreen from '@/components/LoadingScreen';
import PageTransition from '@/components/PageTransition';
import SoundManager from '@/components/SoundManager';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// Lazy load components for better performance
const SeamlessPayments = lazy(() => import('@/components/SeamlessPayments'));
const BlockchainSecurity = lazy(() => import('@/components/BlockchainSecurity'));
const GlobalReach = lazy(() => import('@/components/GlobalReach'));
const IndiaGrowthJourney = lazy(() => import('@/components/IndiaGrowthJourney'));
const CreditCardDemo = lazy(() => import('@/components/CreditCardDemo'));

// Loading component
const SectionLoader = () => (
  <div className="py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="loading-skeleton h-12 w-3/4 mx-auto rounded-lg"></div>
        <div className="loading-skeleton h-6 w-1/2 mx-auto rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="loading-skeleton h-64 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Check user preference for sound
    const soundPreference = localStorage.getItem('krizpay-sound-enabled');
    setSoundEnabled(soundPreference === 'true');
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
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
            
            {/* Lazy load other sections */}
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