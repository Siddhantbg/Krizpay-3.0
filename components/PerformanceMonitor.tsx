'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        // Log performance metrics
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`LCP: ${entry.startTime}ms`);
        }
        
        if (entry.entryType === 'first-input') {
          console.log(`FID: ${(entry as any).processingStart - entry.startTime}ms`);
        }
        
        if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            console.log(`CLS: ${(entry as any).value}`);
          }
        }
      });
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.warn('Some performance metrics are not supported in this browser');
    }

    // Measure Time to First Byte
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        console.log(`TTFB: ${ttfb}ms`);
      }
    };

    // Measure when DOM is loaded
    if (document.readyState === 'complete') {
      measureTTFB();
    } else {
      window.addEventListener('load', measureTTFB);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('load', measureTTFB);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;