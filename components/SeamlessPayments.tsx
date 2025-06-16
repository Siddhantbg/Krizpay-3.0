'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
  Zap, 
  Shield, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SeamlessPayments: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // State for statistics to prevent hydration mismatch
  const [statValues, setStatValues] = useState({
    transactions: 0,
    uptime: 0,
    speed: 0
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(headingRef.current, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Feature cards stagger animation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Card hover animations
        Array.from(cards).forEach((card) => {
          const handleMouseEnter = () => {
            gsap.to(card, {
              y: -10,
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out'
            });
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            });
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        });
      }

      // Phone mockup slide in from right
      gsap.fromTo(phoneRef.current,
        { opacity: 0, x: 100, rotateY: 15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: phoneRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Statistics counter animation - Fixed for hydration
      const transactionsCounter = { value: 0 };
      const uptimeCounter = { value: 0 };
      const speedCounter = { value: 0 };

      gsap.to(transactionsCounter, {
        value: 1000000,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          setStatValues(prev => ({
            ...prev,
            transactions: Math.ceil(transactionsCounter.value)
          }));
        },
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      gsap.to(uptimeCounter, {
        value: 99.9,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          setStatValues(prev => ({
            ...prev,
            uptime: Math.round(uptimeCounter.value * 10) / 10
          }));
        },
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      gsap.to(speedCounter, {
        value: 0.001,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          setStatValues(prev => ({
            ...prev,
            speed: Math.round(speedCounter.value * 1000) / 1000
          }));
        },
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      // Background parallax elements
      if (backgroundRef.current) {
        const shapes = backgroundRef.current.children;
        
        Array.from(shapes).forEach((shape, index) => {
          gsap.to(shape, {
            y: -50 - index * 20,
            rotation: 180 + index * 45,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1 + index * 0.3
            }
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: CreditCard,
      title: 'Card Payments',
      description: 'Accept all major credit and debit cards with instant processing and fraud protection.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Wallets',
      description: 'Seamless integration with Apple Pay, Google Pay, and other digital wallet solutions.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Globe,
      title: 'Crypto Payments',
      description: 'Accept Bitcoin, Ethereum, and 50+ cryptocurrencies with real-time conversion.',
      color: 'from-green-500 to-blue-600'
    }
  ];

  const stats = [
    { 
      value: statValues.transactions, 
      suffix: '+', 
      label: 'Transactions', 
      description: 'Processed monthly',
      format: (val: number) => val.toLocaleString()
    },
    { 
      value: statValues.uptime, 
      suffix: '%', 
      label: 'Uptime', 
      description: 'System reliability',
      format: (val: number) => val.toString()
    },
    { 
      value: statValues.speed, 
      suffix: 's', 
      label: 'Avg Speed', 
      description: 'Transaction time',
      format: (val: number) => val.toString()
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/12 w-32 h-32 rounded-full glass-effect border border-primary-purple/20">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-purple/10 to-transparent"></div>
        </div>
        <div className="absolute top-1/2 right-1/6 w-24 h-24 glass-effect border border-primary-blue/20 transform rotate-45">
          <div className="w-full h-full bg-gradient-to-br from-primary-blue/10 to-transparent"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 rounded-full glass-effect border border-secondary-purple/30">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary-purple/15 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-12">
            {/* Section Heading */}
            <div ref={headingRef} className="space-y-4 opacity-0 translate-y-[50px]">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="gradient-text">Lightning Fast</span>
                <br />
                <span className="text-white">Transactions</span>
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed">
                Experience the future of payments with our cutting-edge technology that processes transactions at the speed of light.
              </p>
            </div>

            {/* Feature Cards */}
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl glass-effect border border-white/10 hover:border-primary-purple/30 transition-all duration-300 cursor-pointer opacity-0 translate-y-[60px] scale-[0.9]"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-purple transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-purple/5 to-primary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div ref={statsRef} className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold gradient-text">
                    {stat.format(stat.value)}{stat.suffix}
                  </div>
                  <div className="space-y-1">
                    <div className="text-white font-semibold text-sm lg:text-base">
                      {stat.label}
                    </div>
                    <div className="text-text-secondary text-xs lg:text-sm">
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div ref={phoneRef} className="relative flex justify-center lg:justify-end opacity-0 translate-x-[100px] rotate-y-[15deg]">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-80 h-[640px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-dark-bg rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-4 text-white text-sm">
                      <span className="font-medium">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 border border-white/50 rounded-sm">
                          <div className="w-3/4 h-full bg-green-500 rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">KrizPay</h3>
                            <p className="text-text-secondary text-sm">Digital Wallet</p>
                          </div>
                        </div>
                        <Button size="sm" className="hero-gradient">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Balance Card */}
                    <div className="mx-6 mb-6">
                      <div className="relative p-6 rounded-2xl hero-gradient overflow-hidden">
                        <div className="relative z-10">
                          <p className="text-white/80 text-sm mb-2">Total Balance</p>
                          <p className="text-white text-3xl font-bold mb-4">$12,847.50</p>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">+12.5%</span>
                            <span className="text-white/60 text-sm">this month</span>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-6 mb-6">
                      <h4 className="text-white font-semibold mb-4">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl glass-effect border border-white/10">
                          <CreditCard className="w-6 h-6 text-primary-purple mb-2" />
                          <p className="text-white text-sm font-medium">Send Money</p>
                        </div>
                        <div className="p-4 rounded-xl glass-effect border border-white/10">
                          <Smartphone className="w-6 h-6 text-primary-blue mb-2" />
                          <p className="text-white text-sm font-medium">Pay Bills</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="px-6">
                      <h4 className="text-white font-semibold mb-4">Recent Transactions</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Coffee Shop', amount: '-$4.50', time: '2m ago', status: 'completed' },
                          { name: 'Salary Deposit', amount: '+$3,200', time: '1h ago', status: 'completed' },
                          { name: 'Online Store', amount: '-$89.99', time: '3h ago', status: 'pending' }
                        ].map((transaction, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-xl glass-effect border border-white/5">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-primary-purple/20 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-primary-purple" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{transaction.name}</p>
                                <p className="text-text-secondary text-xs">{transaction.time}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-semibold ${transaction.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                                {transaction.amount}
                              </p>
                              <p className="text-text-secondary text-xs capitalize">{transaction.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Glow Effect */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 blur-2xl -z-10 scale-110"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeamlessPayments;