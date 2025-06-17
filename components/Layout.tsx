'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  X, 
  Shield, 
  Users, 
  TrendingUp,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Send,
  CreditCard
} from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Header animation on scroll with enhanced backdrop blur
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, 
        { 
          backgroundColor: 'rgba(15, 15, 35, 0)',
          backdropFilter: 'blur(0px)',
          borderBottomColor: 'rgba(139, 92, 246, 0)'
        },
        {
          backgroundColor: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottomColor: 'rgba(139, 92, 246, 0.2)',
          scrollTrigger: {
            trigger: document.body,
            start: 'top -100',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }

    // Enhanced scroll progress with smooth animation
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 500);
    };

    // Throttled scroll handler for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.to(menuRef.current, { 
          x: '0%', 
          duration: 0.4, 
          ease: 'power3.out',
          backdropFilter: 'blur(20px)'
        });
        document.body.style.overflow = 'hidden';
      } else {
        gsap.to(menuRef.current, { 
          x: '100%', 
          duration: 0.4, 
          ease: 'power3.in' 
        });
        document.body.style.overflow = 'unset';
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${scrollProgress}%`,
        duration: 0.1,
        ease: 'none'
      });
    }
  }, [scrollProgress]);

  const navItems = [
    { name: 'Features', href: '#features', ariaLabel: 'Navigate to Features section' },
    { name: 'Security', href: '#security', ariaLabel: 'Navigate to Security section' },
    { name: 'Card Demo', href: '#card-demo', ariaLabel: 'Navigate to Card Demo section' },
    { name: 'Global', href: '#global', ariaLabel: 'Navigate to Global section' },
    { name: 'Growth', href: '#growth', ariaLabel: 'Navigate to Growth section' },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribing(false);
    setEmail('');
    // Show success message (you can implement toast notification here)
  };

  const scrollToTop = () => {
    gsap.to(window, { 
      scrollTo: { y: 0 }, 
      duration: 1, 
      ease: 'power2.out' 
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Enhanced Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800/50 backdrop-blur-sm">
        <div 
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-primary-purple via-primary-blue to-secondary-purple transition-all duration-100 shadow-lg shadow-primary-purple/20"
          style={{ width: '0%' }}
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Enhanced Header */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 border-b border-transparent"
        role="banner"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between" role="navigation" aria-label="Main navigation">
          {/* UPDATED: Logo with KrizPay.svg */}
          <a href="/" className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center shadow-lg shadow-primary-purple/20">
              <Image
                src="/KrizPay.svg"
                alt="KrizPay Logo"
                width={24}
                height={24}
                priority
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
            <span className="text-xl font-bold gradient-text">KrizPay</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-white transition-all duration-300 hover:text-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-bg rounded-md px-3 py-2 relative group"
                aria-label={item.ariaLabel}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-purple to-primary-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* CTA Buttons with Theme Toggle and User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-primary-purple focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-bg transition-all duration-300"
                    aria-label="Sign in to your account"
                    onClick={() => window.location.href = '/signin'}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="hero-gradient hover:opacity-90 hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-bg shadow-lg shadow-primary-purple/20"
                    aria-label="Get started with KrizPay"
                    onClick={() => window.location.href = '/signin'}
                  >
                    Get Started
                  </Button>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            {!loading && user && <UserMenu />}
            <button
              className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-bg rounded-md transition-all duration-300 hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={(e) => handleKeyDown(e, () => setIsMenuOpen(!isMenuOpen))}
              aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {/* Enhanced Mobile Menu */}
        <div
          ref={menuRef}
          className="fixed top-0 right-0 bottom-0 w-80 bg-dark-card/95 backdrop-blur-xl md:hidden border-l border-dark-border translate-x-full z-50 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div className="p-6 pt-20">
            <div className="space-y-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-lg text-text-secondary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-3 py-2 hover:bg-gray-800/50"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={item.ariaLabel}
                >
                  {item.name}
                </a>
              ))}
              {!loading && !user && (
                <div className="pt-6 space-y-4">
                  <Button 
                    variant="ghost" 
                    className="w-full text-white hover:text-primary-purple focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card"
                    aria-label="Sign in to your account"
                    onClick={() => window.location.href = '/signin'}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full hero-gradient hover:opacity-90 transition-opacity focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card"
                    aria-label="Get started with KrizPay"
                    onClick={() => window.location.href = '/signin'}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main role="main">{children}</main>

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <button
          ref={scrollTopRef}
          onClick={scrollToTop}
          onKeyDown={(e) => handleKeyDown(e, scrollToTop)}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-to-r from-primary-purple to-primary-blue rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-bg will-change-transform"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {/* Enhanced Footer */}
      <footer className="bg-dark-card border-t border-dark-border" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* UPDATED: Company Info with KrizPay.svg */}
            <div className="lg:col-span-1 space-y-6">
              <a href="/" className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center shadow-lg shadow-primary-purple/20">
                  <Image
                    src="/KrizPay.svg"
                    alt="KrizPay Logo"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain brightness-0 invert"
                  />
                </div>
                <span className="text-xl font-bold gradient-text">KrizPay</span>
              </a>
              <p className="text-text-secondary text-sm leading-relaxed">
                Revolutionizing payments with blockchain technology. Fast, secure, and decentralized financial solutions for the modern world.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com/krizpay" 
                  className="text-text-secondary hover:text-primary-purple transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md p-2 hover:bg-gray-800/50"
                  aria-label="Follow KrizPay on Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={20} aria-hidden="true" />
                </a>
                <a 
                  href="https://github.com/krizpay" 
                  className="text-text-secondary hover:text-primary-purple transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md p-2 hover:bg-gray-800/50"
                  aria-label="View KrizPay on GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={20} aria-hidden="true" />
                </a>
                <a 
                  href="https://linkedin.com/company/krizpay" 
                  className="text-text-secondary hover:text-primary-purple transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md p-2 hover:bg-gray-800/50"
                  aria-label="Connect with KrizPay on LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={20} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-white font-semibold mb-6">Products</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li>
                  <a 
                    href="#wallet" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="Learn about Digital Wallet"
                  >
                    Digital Wallet
                  </a>
                </li>
                <li>
                  <a 
                    href="#gateway" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="Learn about Payment Gateway"
                  >
                    Payment Gateway
                  </a>
                </li>
                <li>
                  <a 
                    href="#defi" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="Learn about DeFi Solutions"
                  >
                    DeFi Solutions
                  </a>
                </li>
                <li>
                  <a 
                    href="#api" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="Learn about Enterprise API"
                  >
                    Enterprise API
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li>
                  <a 
                    href="#about" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="Learn about KrizPay"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a 
                    href="#careers" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="View career opportunities"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a 
                    href="#press" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="View press releases"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a 
                    href="#partners" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                    aria-label="View our partners"
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div>
              <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
              
              {/* Enhanced Newsletter Signup */}
              <form onSubmit={handleNewsletterSubmit} className="mb-8">
                <div className="space-y-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address for newsletter
                  </label>
                  <div className="relative">
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 bg-dark-bg border border-gray-600 rounded-xl text-white placeholder-text-secondary focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card transition-all duration-300"
                      aria-describedby="newsletter-description"
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-primary-purple to-primary-blue rounded-lg text-white hover:opacity-90 hover:scale-105 transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card shadow-lg shadow-primary-purple/20"
                      aria-label="Subscribe to newsletter"
                    >
                      {isSubscribing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      ) : (
                        <Send size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <p id="newsletter-description" className="text-xs text-text-secondary">
                    Get the latest updates on KrizPay features and news.
                  </p>
                </div>
              </form>

              {/* Contact Info */}
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary-purple flex-shrink-0" aria-hidden="true" />
                  <a 
                    href="mailto:hello@krizpay.com" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-1 py-0.5"
                    aria-label="Send email to KrizPay"
                  >
                    hello@krizpay.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-primary-purple flex-shrink-0" aria-hidden="true" />
                  <a 
                    href="tel:+911234567890" 
                    className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-1 py-0.5"
                    aria-label="Call KrizPay support"
                  >
                    +91 123 456 7890
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-primary-purple flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <address className="not-italic">
                    123 Tech Park, Electronic City<br />
                    Bangalore, Karnataka 560100<br />
                    India
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-dark-border">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-text-secondary">
                <p>&copy; 2024 KrizPay Technologies Pvt. Ltd. All rights reserved.</p>
              </div>
              
              {/* Legal Links */}
              <div className="flex flex-wrap items-center space-x-6 text-sm text-text-secondary">
                <a 
                  href="#privacy" 
                  className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                  aria-label="Read our Privacy Policy"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#terms" 
                  className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                  aria-label="Read our Terms of Service"
                >
                  Terms of Service
                </a>
                <a 
                  href="#cookies" 
                  className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                  aria-label="Read our Cookie Policy"
                >
                  Cookie Policy
                </a>
                <a 
                  href="#support" 
                  className="hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-card rounded-md px-2 py-1 hover:bg-gray-800/30"
                  aria-label="Get support"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Layout;