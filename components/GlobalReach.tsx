'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { 
  Globe, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowUpDown,
  MapPin,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const GlobalReach: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const flagsRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1000');

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

      // Map zoom animation
      if (mapRef.current) {
        gsap.fromTo(mapRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mapRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Map parallax zoom on scroll
        gsap.to(mapRef.current, {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });

        // Connection lines animation
        const connections = mapRef.current.querySelectorAll('.connection-line');
        connections.forEach((line, index) => {
          gsap.fromTo(line,
            { strokeDasharray: '0 1000' },
            {
              strokeDasharray: '1000 0',
              duration: 2,
              delay: 0.5 + index * 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: mapRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });

        // City dots pulse animation
        const dots = mapRef.current.querySelectorAll('.city-dot');
        dots.forEach((dot, index) => {
          gsap.to(dot, {
            scale: 1.5,
            opacity: 0.7,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            delay: index * 0.2
          });
        });
      }

      // Flags stagger animation
      if (flagsRef.current) {
        const flags = flagsRef.current.children;
        gsap.fromTo(flags,
          { opacity: 0, y: 30, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.1,
            scrollTrigger: {
              trigger: flagsRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Currency ticker horizontal scroll
      if (tickerRef.current) {
        const tickerContent = tickerRef.current.querySelector('.ticker-content');
        if (tickerContent) {
          gsap.to(tickerContent, {
            x: '-50%',
            duration: 20,
            repeat: -1,
            ease: 'none'
          });

          // Ticker parallax effect
          gsap.to(tickerContent, {
            x: '-60%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          });
        }
      }

      // Calculator animation
      if (calculatorRef.current) {
        gsap.fromTo(calculatorRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: calculatorRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const majorCities = [
    { name: 'New York', x: 25, y: 35, region: 'Americas' },
    { name: 'London', x: 50, y: 30, region: 'Europe' },
    { name: 'Tokyo', x: 85, y: 40, region: 'Asia' },
    { name: 'Sydney', x: 88, y: 75, region: 'Oceania' },
    { name: 'São Paulo', x: 35, y: 70, region: 'Americas' },
    { name: 'Dubai', x: 60, y: 45, region: 'Middle East' },
    { name: 'Singapore', x: 78, y: 60, region: 'Asia' },
    { name: 'Lagos', x: 52, y: 58, region: 'Africa' }
  ];

  const currencies = [
    { code: 'USD', rate: 1.0000, change: '+0.12%' },
    { code: 'EUR', rate: 0.8456, change: '-0.08%' },
    { code: 'GBP', rate: 0.7234, change: '+0.34%' },
    { code: 'JPY', rate: 110.25, change: '-0.15%' },
    { code: 'BTC', rate: 0.000023, change: '+2.45%' },
    { code: 'ETH', rate: 0.00035, change: '+1.78%' },
    { code: 'AUD', rate: 1.3456, change: '+0.22%' },
    { code: 'CAD', rate: 1.2567, change: '-0.05%' }
  ];

  const countryFlags = [
    { country: 'United States', flag: '🇺🇸', users: '2.5M' },
    { country: 'United Kingdom', flag: '🇬🇧', users: '1.8M' },
    { country: 'Germany', flag: '🇩🇪', users: '1.2M' },
    { country: 'Japan', flag: '🇯🇵', users: '980K' },
    { country: 'Australia', flag: '🇦🇺', users: '750K' },
    { country: 'Canada', flag: '🇨🇦', users: '650K' },
    { country: 'France', flag: '🇫🇷', users: '890K' },
    { country: 'Brazil', flag: '🇧🇷', users: '1.1M' },
    { country: 'India', flag: '🇮🇳', users: '2.1M' },
    { country: 'Singapore', flag: '🇸🇬', users: '420K' }
  ];

  const regionalStats = {
    'Americas': { users: '4.2M', transactions: '125M', growth: '+18%' },
    'Europe': { users: '3.8M', transactions: '98M', growth: '+22%' },
    'Asia': { users: '5.1M', transactions: '156M', growth: '+35%' },
    'Oceania': { users: '850K', transactions: '12M', growth: '+15%' },
    'Middle East': { users: '1.2M', transactions: '28M', growth: '+42%' },
    'Africa': { users: '2.3M', transactions: '45M', growth: '+67%' }
  };

  const handleCityClick = (city: typeof majorCities[0]) => {
    setSelectedRegion(city.region);
  };

  const convertCurrency = () => {
    const baseRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const targetRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
    const result = (parseFloat(amount) * targetRate / baseRate).toFixed(2);
    return result;
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-primary-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-purple/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-16 opacity-0 translate-y-[50px]">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Global Reach</span>
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Available in 150+ countries with seamless cross-border transactions and local currency support.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary-blue" />
              <span>150+ Countries</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary-purple" />
              <span>12M+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* World Map */}
          <div className="lg:col-span-2">
            <div ref={mapRef} className="relative bg-gray-900/50 rounded-2xl p-8 border border-primary-blue/20 backdrop-blur-sm opacity-0 scale-[0.9]">
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                {/* Simplified World Map SVG */}
                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  {/* World Map Paths (simplified continents) */}
                  <path
                    d="M150 200 Q200 180 250 200 L300 220 Q350 200 400 220 L450 240 Q500 220 550 240 L600 260 Q650 240 700 260 L750 280 Q800 260 850 280 L900 300 Q950 280 1000 300 L1000 400 Q950 420 900 400 L850 380 Q800 400 750 380 L700 360 Q650 380 600 360 L550 340 Q500 360 450 340 L400 320 Q350 340 300 320 L250 300 Q200 320 150 300 Z"
                    fill="rgba(59, 130, 246, 0.1)"
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="1"
                  />
                  
                  {/* Connection Lines */}
                  <line x1="250" y1="175" x2="500" y2="150" className="connection-line" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
                  <line x1="500" y1="150" x2="850" y2="200" className="connection-line" stroke="#3B82F6" strokeWidth="2" opacity="0.6" />
                  <line x1="250" y1="175" x2="350" y2="350" className="connection-line" stroke="#A855F7" strokeWidth="2" opacity="0.6" />
                  <line x1="500" y1="150" x2="600" y2="225" className="connection-line" stroke="#1D4ED8" strokeWidth="2" opacity="0.6" />
                  <line x1="850" y1="200" x2="880" y2="375" className="connection-line" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
                  <line x1="600" y1="225" x2="780" y2="300" className="connection-line" stroke="#3B82F6" strokeWidth="2" opacity="0.6" />
                  
                  {/* City Dots */}
                  {majorCities.map((city, index) => (
                    <g key={city.name}>
                      <circle
                        cx={city.x * 10}
                        cy={city.y * 5}
                        r="8"
                        className="city-dot cursor-pointer"
                        fill="#22C55E"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        onClick={() => handleCityClick(city)}
                      />
                      <text
                        x={city.x * 10}
                        y={city.y * 5 - 15}
                        textAnchor="middle"
                        className="text-xs fill-white font-medium"
                      >
                        {city.name}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Regional Stats Overlay */}
                {selectedRegion && (
                  <div className="absolute top-4 right-4 bg-dark-card/90 backdrop-blur-md rounded-xl p-4 border border-primary-purple/30">
                    <h4 className="text-white font-semibold mb-2">{selectedRegion}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Users:</span>
                        <span className="text-white">{regionalStats[selectedRegion as keyof typeof regionalStats]?.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Transactions:</span>
                        <span className="text-white">{regionalStats[selectedRegion as keyof typeof regionalStats]?.transactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Growth:</span>
                        <span className="text-green-400">{regionalStats[selectedRegion as keyof typeof regionalStats]?.growth}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 text-xs"
                      onClick={() => setSelectedRegion(null)}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Country Flags */}
            <div ref={flagsRef} className="mt-8 grid grid-cols-5 sm:grid-cols-10 gap-4">
              {countryFlags.map((item, index) => (
                <div
                  key={item.country}
                  className="group text-center p-3 rounded-xl glass-effect border border-white/10 hover:border-primary-purple/30 transition-all duration-300 cursor-pointer opacity-0 translate-y-[30px] scale-[0.8]"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {item.flag}
                  </div>
                  <div className="text-xs text-text-secondary group-hover:text-white transition-colors duration-300">
                    {item.users}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currency Calculator */}
          <div ref={calculatorRef} className="space-y-8 opacity-0 translate-x-[50px]">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-purple/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <ArrowUpDown className="w-5 h-5 mr-2 text-primary-purple" />
                Currency Converter
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-card border border-gray-600 rounded-xl text-white focus:border-primary-purple focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">From</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-card border border-gray-600 rounded-xl text-white focus:border-primary-purple focus:outline-none transition-colors"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">To</label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-card border border-gray-600 rounded-xl text-white focus:border-primary-purple focus:outline-none transition-colors"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {convertCurrency()} {toCurrency}
                    </div>
                    <div className="text-sm text-text-secondary mt-1">
                      {amount} {fromCurrency} =
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-text-secondary">Daily Volume</div>
                    <div className="text-xl font-bold text-green-400">$2.4B</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-text-secondary">Avg. Fee</div>
                    <div className="text-xl font-bold text-blue-400">0.1%</div>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Ticker */}
        <div ref={tickerRef} className="mt-16 overflow-hidden bg-gray-900/30 rounded-2xl border border-primary-blue/20 backdrop-blur-sm">
          <div className="ticker-content flex items-center py-4 space-x-12" style={{ width: '200%' }}>
            {[...currencies, ...currencies].map((currency, index) => (
              <div key={`${currency.code}-${index}`} className="flex items-center space-x-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-purple to-primary-blue flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{currency.code.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{currency.code}</div>
                    <div className="text-xs text-text-secondary">{currency.rate}</div>
                  </div>
                  <div className={`text-sm font-medium ${currency.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {currency.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;