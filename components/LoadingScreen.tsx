'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Zap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const tl = gsap.timeline({
      onComplete: () => {
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              onComplete();
            }
          }, 500);
        }
      }
    });

    // Logo animation
    if (logoRef.current) {
      tl.fromTo(logoRef.current, 
        { scale: 0, rotation: -180, opacity: 0 },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: 'back.out(1.7)' 
        }
      );
    }

    // Text animation
    if (textRef.current) {
      tl.fromTo(textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );
    }

    // Progress bar animation
    const progressTl = gsap.timeline({ repeat: -1 });
    if (progressRef.current) {
      progressTl.to(progressRef.current, {
        scaleX: 1,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: function() {
          if (isMounted) {
            setProgress(Math.round(this.progress() * 100));
          }
        }
      })
      .to(progressRef.current, {
        scaleX: 0,
        duration: 0.5,
        ease: 'power2.in'
      });
    }

    // Exit animation after 3 seconds
    const exitTimeout = setTimeout(() => {
      if (isMounted) {
        progressTl.kill();
        setProgress(100);
        
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'power2.inOut'
          });
        }
      }
    }, 3000);

    return () => {
      isMounted = false;
      tl.kill();
      progressTl.kill();
      clearTimeout(exitTimeout);
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-dark-bg flex items-center justify-center"
    >
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <div ref={logoRef} className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl hero-gradient flex items-center justify-center relative overflow-hidden">
            <Zap className="w-12 h-12 text-white z-10" />
            
            {/* Rotating background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-purple via-primary-blue to-primary-purple animate-spin opacity-50"></div>
            
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-purple to-primary-blue animate-pulse opacity-30"></div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-gradient-to-r from-primary-purple to-primary-blue blur-xl opacity-50 animate-pulse"></div>
        </div>

        {/* Brand Text */}
        <div ref={textRef} className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text">KrizPay</h1>
          <p className="text-gray-400">Loading the future of finance...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-gradient-to-r from-primary-purple to-primary-blue origin-left scale-x-0"
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-400">{progress}%</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;