'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ParallaxMouseProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

const ParallaxMouse: React.FC<ParallaxMouseProps> = ({ 
  children, 
  intensity = 0.1, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get all parallax elements
    elementsRef.current = Array.from(
      containerRef.current.querySelectorAll('[data-parallax]')
    ) as HTMLElement[];

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage from center
      const xPercent = (clientX - innerWidth / 2) / (innerWidth / 2);
      const yPercent = (clientY - innerHeight / 2) / (innerHeight / 2);

      elementsRef.current.forEach((element, index) => {
        const depth = parseFloat(element.dataset.parallax || '1');
        const moveX = xPercent * intensity * depth * 50;
        const moveY = yPercent * intensity * depth * 50;

        gsap.to(element, {
          x: moveX,
          y: moveY,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    };

    const handleMouseLeave = () => {
      elementsRef.current.forEach(element => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ParallaxMouse;