'use client';

import { useEffect, useState } from 'react';
import type { PerformanceMetrics } from '@/types/interfaces';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      setIsLoading(false);
      return;
    }

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const newMetrics: Partial<PerformanceMetrics> = {};

      // Time to First Byte
      if (navigation) {
        newMetrics.ttfb = navigation.responseStart - navigation.requestStart;
      }

      // First Contentful Paint
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        newMetrics.fcp = fcp.startTime;
      }

      setMetrics(newMetrics);
      setIsLoading(false);
    };

    // Measure immediately if page is already loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Observe additional metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        }
        
        if (entry.entryType === 'first-input') {
          const fid = (entry as any).processingStart - entry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
        }
        
        if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            setMetrics(prev => ({ 
              ...prev, 
              cls: (prev.cls || 0) + (entry as any).value 
            }));
          }
        }
      });
    });

    try {
      observer.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (e) {
      console.warn('Some performance metrics are not supported');
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
      observer.disconnect();
    };
  }, []);

  const getPerformanceScore = (): number => {
    if (Object.keys(metrics).length === 0) return 0;
    
    let score = 100;
    
    // Deduct points based on metrics
    if (metrics.fcp && metrics.fcp > 2000) score -= 20;
    if (metrics.lcp && metrics.lcp > 2500) score -= 25;
    if (metrics.fid && metrics.fid > 100) score -= 20;
    if (metrics.cls && metrics.cls > 0.1) score -= 15;
    if (metrics.ttfb && metrics.ttfb > 600) score -= 20;
    
    return Math.max(0, score);
  };

  return {
    metrics,
    isLoading,
    performanceScore: getPerformanceScore()
  };
};

export default usePerformance;