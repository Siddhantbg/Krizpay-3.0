'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Building2,
  Calendar,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const IndiaGrowthJourney: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

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

      // Map animation
      if (mapRef.current) {
        gsap.fromTo(mapRef.current,
          { scale: 0.8, opacity: 0 },
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

        // State regions animation with stagger
        const states = mapRef.current.querySelectorAll('.state-region');
        gsap.fromTo(states,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            stagger: 0.3,
            scrollTrigger: {
              trigger: mapRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Pulse animation for active states
        const activeStates = mapRef.current.querySelectorAll('.state-active');
        gsap.to(activeStates, {
          scale: 1.1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          stagger: 0.5
        });
      }

      // Roadmap timeline animation
      if (roadmapRef.current) {
        const phases = roadmapRef.current.querySelectorAll('.phase-card');
        gsap.fromTo(phases,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: roadmapRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Progress indicators
        const progressBars = roadmapRef.current.querySelectorAll('.progress-bar');
        progressBars.forEach((bar, index) => {
          const width = index === 0 ? '100%' : index === 1 ? '60%' : '0%';
          gsap.to(bar, {
            width: width,
            duration: 1.5,
            delay: 0.5 + index * 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: roadmapRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          });
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stateData = {
    'Tamil Nadu': {
      phase: 1,
      status: 'active',
      city: 'Chennai',
      timeline: '2024 Q1-Q2',
      users: '100K',
      transactions: '500K',
      merchants: '2,500',
      strategy: 'Phase 1 Launch Region - Focus on fintech adoption and digital payment infrastructure',
      segments: ['E-commerce', 'Retail', 'Food & Beverage'],
      progress: 85
    },
    'Karnataka': {
      phase: 2,
      status: 'planned',
      city: 'Bangalore',
      timeline: '2024 Q3',
      users: '150K',
      transactions: '750K',
      merchants: '3,200',
      strategy: 'Tech Hub Partnership Zone - Leverage startup ecosystem and tech talent',
      segments: ['Tech Startups', 'IT Services', 'Digital Commerce'],
      progress: 40
    },
    'Delhi NCR': {
      phase: 2,
      status: 'planned',
      city: 'New Delhi',
      timeline: '2024 Q4',
      users: '200K',
      transactions: '1.2M',
      merchants: '5,000',
      strategy: 'Capital Region Expansion - Target government and enterprise sectors',
      segments: ['Government', 'Enterprise', 'Financial Services'],
      progress: 25
    },
    'Bihar': {
      phase: 3,
      status: 'future',
      city: 'Patna',
      timeline: '2025 Q2',
      users: '80K',
      transactions: '300K',
      merchants: '1,800',
      strategy: 'Future Growth Market - Focus on financial inclusion and rural penetration',
      segments: ['Agriculture', 'Rural Commerce', 'Microfinance'],
      progress: 5
    }
  };

  const roadmapPhases = [
    {
      phase: 1,
      title: 'Foundation Phase',
      period: '2024 Q1-Q2',
      status: 'active',
      states: ['Tamil Nadu'],
      targets: {
        users: '100K',
        transactions: '500K',
        revenue: 'Pre-revenue'
      },
      milestones: [
        'Platform launch in Chennai',
        'Regulatory compliance setup',
        'Initial merchant onboarding',
        'User acquisition campaigns'
      ]
    },
    {
      phase: 2,
      title: 'Expansion Phase',
      period: '2024 Q3-Q4',
      status: 'planned',
      states: ['Karnataka', 'Delhi NCR'],
      targets: {
        users: '250K',
        transactions: '1.2M',
        revenue: 'Revenue positive'
      },
      milestones: [
        'Bangalore tech hub launch',
        'Delhi NCR market entry',
        'Enterprise partnerships',
        'Advanced features rollout'
      ]
    },
    {
      phase: 3,
      title: 'Scale Phase',
      period: '2025+',
      status: 'future',
      states: ['Bihar', 'Maharashtra', 'Gujarat', 'West Bengal'],
      targets: {
        users: '1M+',
        transactions: '5M+',
        revenue: 'Profitability'
      },
      milestones: [
        'Pan-India expansion',
        'Rural market penetration',
        'International remittances',
        'IPO preparation'
      ]
    }
  ];

  const handleStateClick = (stateName: string) => {
    setSelectedState(selectedState === stateName ? null : stateName);
  };

  const getStateColor = (stateName: string) => {
    const state = stateData[stateName as keyof typeof stateData];
    if (!state) return '#192231';
    
    switch (state.status) {
      case 'active':
        return 'url(#activeGradient)';
      case 'planned':
        return 'url(#plannedGradient)';
      case 'future':
        return 'url(#futureGradient)';
      default:
        return '#192231';
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'planned':
        return <Target className="w-5 h-5 text-blue-400" />;
      case 'future':
        return <Calendar className="w-5 h-5 text-purple-400" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-primary-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-16 opacity-0 translate-y-[50px]">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Building India's <span className="gradient-text">Next-Gen</span>
            <br />Payment Network
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Starting with key financial hubs, expanding nationwide with a strategic focus on digital transformation and financial inclusion.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <span>4 States Targeted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>1M+ Users Goal</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>10K+ Merchants</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Interactive India Map */}
          <div ref={mapRef} className="opacity-0 scale-[0.8]">
            <div className="bg-gray-900/50 rounded-2xl p-8 border border-primary-purple/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">India Expansion Map</h3>
              
              <div className="relative">
                <svg viewBox="0 0 400 500" className="w-full h-96">
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                    <linearGradient id="plannedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="futureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6B7280" />
                      <stop offset="100%" stopColor="#4B5563" />
                    </linearGradient>
                  </defs>

                  {/* India Outline (Simplified) */}
                  <path
                    d="M100 50 Q150 40 200 60 L250 80 Q300 70 350 90 L380 120 Q390 150 380 180 L370 220 Q360 250 350 280 L340 320 Q330 350 320 380 L300 420 Q280 450 250 460 L200 470 Q150 460 120 440 L90 410 Q70 380 80 350 L90 320 Q100 290 110 260 L120 220 Q110 190 100 160 L90 120 Q95 85 100 50 Z"
                    fill="#192231"
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="2"
                    className="india-outline"
                  />

                  {/* Tamil Nadu */}
                  <circle
                    cx="280"
                    cy="380"
                    r="25"
                    fill={getStateColor('Tamil Nadu')}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="state-region state-active cursor-pointer opacity-0 scale-[0.5]"
                    onClick={() => handleStateClick('Tamil Nadu')}
                    onMouseEnter={() => setHoveredState('Tamil Nadu')}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="280" y="385" textAnchor="middle" className="text-xs fill-white font-medium pointer-events-none">TN</text>

                  {/* Karnataka */}
                  <circle
                    cx="240"
                    cy="340"
                    r="22"
                    fill={getStateColor('Karnataka')}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="state-region cursor-pointer opacity-0 scale-[0.5]"
                    onClick={() => handleStateClick('Karnataka')}
                    onMouseEnter={() => setHoveredState('Karnataka')}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="240" y="345" textAnchor="middle" className="text-xs fill-white font-medium pointer-events-none">KA</text>

                  {/* Delhi NCR */}
                  <circle
                    cx="200"
                    cy="150"
                    r="20"
                    fill={getStateColor('Delhi NCR')}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="state-region cursor-pointer opacity-0 scale-[0.5]"
                    onClick={() => handleStateClick('Delhi NCR')}
                    onMouseEnter={() => setHoveredState('Delhi NCR')}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="200" y="155" textAnchor="middle" className="text-xs fill-white font-medium pointer-events-none">DL</text>

                  {/* Bihar */}
                  <circle
                    cx="250"
                    cy="200"
                    r="18"
                    fill={getStateColor('Bihar')}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="state-region cursor-pointer opacity-0 scale-[0.5]"
                    onClick={() => handleStateClick('Bihar')}
                    onMouseEnter={() => setHoveredState('Bihar')}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text x="250" y="205" textAnchor="middle" className="text-xs fill-white font-medium pointer-events-none">BR</text>
                </svg>

                {/* State Details Popup */}
                {(selectedState || hoveredState) && (
                  <div className="absolute top-4 right-4 bg-dark-card/95 backdrop-blur-md rounded-xl p-4 border border-primary-purple/30 min-w-64">
                    {(() => {
                      const state = stateData[(selectedState || hoveredState) as keyof typeof stateData];
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold">{selectedState || hoveredState}</h4>
                            <div className="flex items-center space-x-1">
                              {getPhaseIcon(state.status)}
                              <span className="text-xs text-text-secondary">Phase {state.phase}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-secondary">City:</span>
                              <span className="text-white">{state.city}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Timeline:</span>
                              <span className="text-white">{state.timeline}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Target Users:</span>
                              <span className="text-green-400">{state.users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Transactions:</span>
                              <span className="text-blue-400">{state.transactions}/month</span>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-700">
                              <p className="text-xs text-text-secondary mb-2">Strategy:</p>
                              <p className="text-xs text-white leading-relaxed">{state.strategy}</p>
                            </div>
                            
                            <div className="pt-2">
                              <p className="text-xs text-text-secondary mb-1">Target Segments:</p>
                              <div className="flex flex-wrap gap-1">
                                {state.segments.map((segment, index) => (
                                  <span key={index} className="text-xs bg-primary-purple/20 text-primary-purple px-2 py-1 rounded">
                                    {segment}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-text-secondary">Progress:</span>
                                <span className="text-white">{state.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-primary-purple to-primary-blue h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${state.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {selectedState && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-3 text-xs w-full"
                              onClick={() => setSelectedState(null)}
                            >
                              Close Details
                            </Button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
                  <span className="text-xs text-text-secondary">Active</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <span className="text-xs text-text-secondary">Planned</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-500 to-gray-600"></div>
                  <span className="text-xs text-text-secondary">Future</span>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Roadmap */}
          <div ref={roadmapRef} className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Growth Roadmap</h3>
            
            {roadmapPhases.map((phase, index) => (
              <div
                key={phase.phase}
                className="phase-card relative bg-gray-900/50 rounded-2xl p-6 border border-primary-blue/20 backdrop-blur-sm opacity-0 -translate-x-[50px]"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      phase.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      phase.status === 'planned' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {getPhaseIcon(phase.status)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-white">{phase.title}</h4>
                      <span className="text-sm text-text-secondary">{phase.period}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text">{phase.targets.users}</div>
                        <div className="text-xs text-text-secondary">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text">{phase.targets.transactions}</div>
                        <div className="text-xs text-text-secondary">Transactions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold gradient-text">{phase.targets.revenue}</div>
                        <div className="text-xs text-text-secondary">Revenue</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-text-secondary mb-2">Key Milestones:</p>
                      <ul className="space-y-1">
                        {phase.milestones.map((milestone, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-white">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-text-secondary mb-2">Target States:</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.states.map((state, idx) => (
                          <span key={idx} className="text-xs bg-primary-purple/20 text-primary-purple px-2 py-1 rounded">
                            {state}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="progress-bar bg-gradient-to-r from-primary-purple to-primary-blue h-2 rounded-full"
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Call to Action */}
            <div className="mt-8 text-center">
              <Button className="hero-gradient hover:opacity-90 transition-opacity">
                <TrendingUp className="w-4 h-4 mr-2" />
                Join Our Growth Journey
              </Button>
              <p className="text-sm text-text-secondary mt-2">
                Be part of India's fintech revolution
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndiaGrowthJourney;