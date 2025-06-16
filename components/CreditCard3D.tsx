'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { CreditCard, RectangleHorizontal as Chip, Wifi } from 'lucide-react';

interface CardProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  theme?: 'light' | 'dark';
  onCardInteraction?: (event: MouseEvent) => void;
}

interface MousePosition {
  x: number;
  y: number;
}

const CreditCard3D: React.FC<CardProps> = ({
  cardNumber,
  cardHolder,
  expiryDate,
  theme = 'dark',
  onCardInteraction
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animationFrameRef = useRef<number>();
  const lastMousePosition = useRef<MousePosition>({ x: 0, y: 0 });

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Throttled mouse move handler
  const throttledMouseMove = useCallback((e: MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!cardRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate rotation values with constraints
      const rotateY = Math.max(-15, Math.min(15, (mouseX / rect.width) * 30));
      const rotateX = Math.max(-15, Math.min(15, -(mouseY / rect.height) * 30));

      // Apply 3D transform
      gsap.to(cardRef.current, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        duration: 0.1,
        ease: 'power2.out'
      });

      lastMousePosition.current = { x: mouseX, y: mouseY };
      
      if (onCardInteraction) {
        onCardInteraction(e);
      }
    });
  }, [onCardInteraction]);

  // Mouse enter handler
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    
    setIsHovered(true);
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        z: -50,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isMobile]);

  // Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    
    setIsHovered(false);
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        z: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [isMobile]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !cardRef.current) return;
    
    gsap.to(cardRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out'
    });
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !cardRef.current) return;
    
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [isMobile]);

  // Initialize animations
  useEffect(() => {
    if (!cardRef.current) return;

    // Entrance animation
    const tl = gsap.timeline({
      onComplete: () => setIsLoaded(true)
    });

    tl.fromTo(cardRef.current,
      { 
        opacity: 0, 
        y: 50, 
        rotationX: -90,
        scale: 0.8
      },
      { 
        opacity: 1, 
        y: 0, 
        rotationX: 0,
        scale: 1,
        duration: 1.2, 
        ease: 'power3.out' 
      }
    );

    // Floating animation when idle
    const floatingTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatingTl.to(cardRef.current, {
      y: -10,
      duration: 3,
      ease: 'power2.inOut',
      delay: 2
    });

    return () => {
      tl.kill();
      floatingTl.kill();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Format card number with spaces
  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  // Mask card number for security
  const maskCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    const masked = cleaned.slice(0, 4) + ' •••• •••• ' + cleaned.slice(-4);
    return masked;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${isMobile ? 'w-80 h-50' : 'w-96 h-60'} mx-auto perspective-1000`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={!isMobile ? throttledMouseMove : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: '1000px' }}
    >
      {/* Card Container */}
      <div
        ref={cardRef}
        className={`
          relative w-full h-full rounded-3xl overflow-hidden cursor-pointer
          transform-gpu will-change-transform
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-purple-800/90' 
            : 'bg-gradient-to-br from-blue-500/90 via-purple-500/90 to-pink-500/90'
          }
          backdrop-blur-xl border border-white/20 shadow-2xl
          ${isHovered ? 'shadow-purple-500/25' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Animated Background Layers */}
        <div ref={backgroundRef} className="absolute inset-0 overflow-hidden rounded-3xl">
          {/* Layer 1 - Primary Wave */}
          <div className="absolute inset-0 opacity-30">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 250"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <path
                d="M0,100 Q100,50 200,100 T400,100 L400,250 L0,250 Z"
                fill="url(#wave1)"
                className="animate-pulse"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 50,0; 0,0"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

          {/* Layer 2 - Secondary Wave */}
          <div className="absolute inset-0 opacity-20">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 250"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <path
                d="M0,150 Q150,100 300,150 T600,150 L600,250 L0,250 Z"
                fill="url(#wave2)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; -100,0; 0,0"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>

          {/* Layer 3 - Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 250"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            {/* Brand Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold tracking-wider"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                KRIZPAY
              </span>
            </div>

            {/* Contactless Payment Icon */}
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white transform rotate-90" />
            </div>
          </div>

          {/* Middle Section - EMV Chip */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <Chip className="w-6 h-6 text-yellow-900" />
            </div>
            
            {/* Holographic Effect */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm animate-pulse"></div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-4">
            {/* Card Number */}
            <div 
              className="text-lg tracking-widest font-mono"
              style={{ 
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '2px'
              }}
            >
              {maskCardNumber(cardNumber)}
            </div>

            {/* Card Details */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="text-xs text-white/70 uppercase tracking-wide">
                  Card Holder
                </div>
                <div className="text-sm font-medium uppercase tracking-wide">
                  {cardHolder}
                </div>
              </div>

              <div className="space-y-1 text-right">
                <div className="text-xs text-white/70 uppercase tracking-wide">
                  Expires
                </div>
                <div className="text-sm font-medium tracking-wide">
                  {expiryDate}
                </div>
              </div>

              {/* Network Logo */}
              <div className="w-12 h-8 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div 
          className={`
            absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            ${isHovered ? 'opacity-100' : ''}
          `}
          style={{
            background: `linear-gradient(
              ${lastMousePosition.current.x + 90}deg,
              transparent 30%,
              rgba(255,255,255,0.1) 50%,
              transparent 70%
            )`
          }}
        />

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Card Shadow */}
      <div 
        className={`
          absolute inset-0 rounded-3xl transition-all duration-300 -z-10
          ${isHovered 
            ? 'bg-purple-500/20 blur-xl scale-110' 
            : 'bg-black/10 blur-lg scale-100'
          }
        `}
      />
    </div>
  );
};

export default CreditCard3D;