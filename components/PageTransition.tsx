'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !overlayRef.current) return;

    // Page enter animation
    const tl = gsap.timeline();
    
    tl.set(overlayRef.current, { scaleX: 1 })
      .set(containerRef.current, { opacity: 0, y: 50 })
      .to(overlayRef.current, { 
        scaleX: 0, 
        duration: 0.8, 
        ease: 'power2.inOut',
        transformOrigin: 'right center'
      })
      .to(containerRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: 'power3.out' 
      }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, []);

  const handleLinkClick = (e: Event) => {
    const target = e.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.href && !target.href.startsWith('#')) {
      e.preventDefault();
      
      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = target.href;
        }
      });

      tl.to(containerRef.current, { 
        opacity: 0, 
        y: -50, 
        duration: 0.4, 
        ease: 'power2.in' 
      })
      .to(overlayRef.current, { 
        scaleX: 1, 
        duration: 0.6, 
        ease: 'power2.inOut',
        transformOrigin: 'left center'
      }, '-=0.2');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return (
    <>
      {/* Transition Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-gradient-to-r from-primary-purple to-primary-blue origin-left scale-x-0"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Page Content */}
      <div ref={containerRef} className="opacity-0">
        {children}
      </div>
    </>
  );
};

export default PageTransition;