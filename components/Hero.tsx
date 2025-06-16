'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import ParallaxMouse from '@/components/ParallaxMouse';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation with stagger
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
      })
      .to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.8')
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6');

      // Parallax effect for background
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // Floating shapes animations with 3D transforms
      if (shapesRef.current) {
        const shapes = shapesRef.current.children;
        
        Array.from(shapes).forEach((shape, index) => {
          // Set initial 3D properties
          gsap.set(shape, { 
            transformStyle: 'preserve-3d',
            transformPerspective: 1000
          });

          // Continuous floating animation with 3D rotation
          gsap.to(shape, {
            y: -30,
            rotationX: 360,
            rotationY: 180,
            duration: 8 + index * 2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            delay: index * 0.3
          });

          // Parallax movement on scroll with depth
          gsap.to(shape, {
            y: -100 - index * 20,
            rotationZ: 180 + index * 90,
            z: -50 - index * 10,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1 + index * 0.2
            }
          });
        });
      }

      // Advanced button hover animations
      const buttons = buttonsRef.current?.querySelectorAll('button');
      buttons?.forEach((button) => {
        const handleMouseEnter = () => {
          gsap.to(button, {
            scale: 1.05,
            rotationY: 5,
            z: 20,
            duration: 0.3,
            ease: 'power2.out'
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            scale: 1,
            rotationY: 0,
            z: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
        };
      });

      // Refresh ScrollTrigger on window resize
      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <ParallaxMouse intensity={0.15} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={heroRef}>
        {/* Animated Background */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 bg-gradient-to-br from-primary-purple/20 via-dark-bg to-primary-blue/20"
        >
          {/* Background gradient overlays with 3D transforms */}
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-purple/10 rounded-full blur-3xl animate-pulse will-change-transform"
            data-parallax="0.5"
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse delay-1000 will-change-transform"
            data-parallax="0.8"
          ></div>
        </div>

        {/* Floating Geometric Shapes with 3D effects */}
        <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
          {/* Enhanced shapes with 3D transforms */}
          <div 
            className="absolute top-1/4 left-1/6 w-20 h-20 rounded-full glass-effect border border-primary-purple/30 will-change-transform"
            data-parallax="1.2"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-purple/20 to-transparent"></div>
          </div>
          
          <div 
            className="absolute top-1/3 right-1/4 w-16 h-16 glass-effect border border-primary-blue/30 transform rotate-45 will-change-transform"
            data-parallax="0.8"
          >
            <div className="w-full h-full bg-gradient-to-br from-primary-blue/20 to-transparent"></div>
          </div>
          
          <div 
            className="absolute bottom-1/3 left-1/3 w-12 h-12 rounded-full glass-effect border border-secondary-purple/40 will-change-transform"
            data-parallax="1.5"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary-purple/20 to-transparent"></div>
          </div>
          
          <div 
            className="absolute bottom-1/4 right-1/6 w-24 h-24 glass-effect border border-secondary-blue/30 transform rotate-12 will-change-transform"
            data-parallax="0.6"
          >
            <div className="w-full h-full bg-gradient-to-br from-secondary-blue/20 to-transparent"></div>
          </div>
          
          <div 
            className="absolute top-1/2 left-1/12 w-8 h-8 rounded-full glass-effect border border-primary-purple/50 will-change-transform"
            data-parallax="2.0"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-purple/30 to-transparent"></div>
          </div>
          
          <div 
            className="absolute top-3/4 right-1/3 w-14 h-14 glass-effect border border-primary-blue/40 transform rotate-30 will-change-transform"
            data-parallax="1.0"
          >
            <div className="w-full h-full bg-gradient-to-br from-primary-blue/20 to-transparent"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 
            ref={titleRef}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 leading-tight opacity-0 translate-y-[50px] will-change-transform"
          >
            <span className="gradient-text">KrizPay</span>
          </h1>

          {/* Tagline */}
          <p 
            ref={taglineRef}
            className="text-xl sm:text-2xl lg:text-3xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto opacity-0 translate-y-[50px] will-change-transform"
          >
            The Future of Decentralized Finance
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center opacity-0 translate-y-[50px] will-change-transform">
            <Button 
              size="lg" 
              className="hero-gradient hover:opacity-90 transition-all duration-300 text-lg px-8 py-4 glow-effect group will-change-transform"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary-purple/50 text-white hover:bg-primary-purple/10 hover:border-primary-purple transition-all duration-300 text-lg px-8 py-4 glass-effect group will-change-transform"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              View Demo
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-purple/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-purple rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </ParallaxMouse>
  );
};

export default Hero;