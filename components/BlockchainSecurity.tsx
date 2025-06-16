'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  Key, 
  Eye, 
  Fingerprint,
  Server,
  Zap,
  Globe
} from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BlockchainSecurity: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const blockchainRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // State for code content to prevent hydration mismatch
  const [codeContent, setCodeContent] = useState('');

  const codeText = `{
  "security": {
    "encryption": "AES-256",
    "authentication": "multi-factor",
    "blockchain": {
      "consensus": "proof-of-stake",
      "immutable": true,
      "decentralized": true
    },
    "compliance": ["SOC2", "ISO27001", "PCI-DSS"]
  }
}`;

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

      // Security features animation with icon transformation
      if (featuresRef.current) {
        const features = featuresRef.current.children;
        
        gsap.fromTo(features,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Icon transformation animations (Lock to CheckCircle)
        Array.from(features).forEach((feature, index) => {
          const lockIcon = feature.querySelector('.lock-icon');
          const checkIcon = feature.querySelector('.check-icon');
          
          if (lockIcon && checkIcon) {
            gsap.to(lockIcon, {
              opacity: 0,
              scale: 0,
              rotation: 180,
              duration: 0.5,
              delay: 1 + index * 0.2,
              ease: 'power2.in',
              scrollTrigger: {
                trigger: feature,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
              }
            });

            gsap.to(checkIcon, {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.5,
              delay: 1.3 + index * 0.2,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: feature,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
              }
            });
          }
        });
      }

      // Blockchain visualization - blocks build up one by one
      if (blockchainRef.current) {
        const blocks = blockchainRef.current.querySelectorAll('.blockchain-block');
        const connections = blockchainRef.current.querySelectorAll('.blockchain-connection');

        blocks.forEach((block, index) => {
          gsap.to(block, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.3,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: blockchainRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          });

          // Animate connections after blocks
          if (index < connections.length) {
            gsap.to(connections[index], {
              scaleX: 1,
              duration: 0.4,
              delay: (index * 0.3) + 0.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: blockchainRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
              }
            });
          }
        });

        // Continuous glow animation for active blocks
        gsap.to(blocks, {
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          stagger: 0.2
        });
      }

      // Code snippet typing animation - Fixed for hydration
      if (codeRef.current) {
        let currentText = '';
        const chars = codeText.split('');
        
        chars.forEach((char, index) => {
          gsap.to({}, {
            duration: 0.03,
            delay: index * 0.03,
            onComplete: () => {
              currentText += char;
              setCodeContent(currentText);
            },
            scrollTrigger: {
              trigger: codeRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          });
        });

        // Cursor blink effect
        const cursor = codeRef.current.querySelector('.cursor');
        if (cursor) {
          gsap.to(cursor, {
            opacity: 0,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
          });
        }
      }

      // Background parallax security badges
      if (backgroundRef.current) {
        const badges = backgroundRef.current.children;
        
        Array.from(badges).forEach((badge, index) => {
          // Floating animation
          gsap.to(badge, {
            y: -30,
            duration: 4 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            delay: index * 0.5
          });

          // Parallax scroll effect
          gsap.to(badge, {
            y: -80 - index * 30,
            rotation: 180 + index * 60,
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
  }, [codeText]);

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description: 'Military-grade AES-256 encryption protects all data in transit and at rest.',
      icon: Key
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'Biometric and hardware-based authentication for maximum security.',
      icon: Fingerprint
    },
    {
      title: 'Zero-Knowledge Architecture',
      description: 'We never see your private keys or sensitive financial information.',
      icon: Eye
    },
    {
      title: 'Immutable Ledger',
      description: 'Blockchain technology ensures transaction history cannot be altered.',
      icon: Server
    },
    {
      title: 'Real-time Monitoring',
      description: 'AI-powered fraud detection monitors transactions 24/7.',
      icon: Globe
    },
    {
      title: 'Instant Recovery',
      description: 'Secure backup and recovery systems protect against data loss.',
      icon: Zap
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg overflow-hidden">
      {/* Background Security Badges */}
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/6 left-1/12 w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <Shield className="w-10 h-10 text-green-500/50" />
        </div>
        <div className="absolute top-1/3 right-1/8 w-16 h-16 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center transform rotate-12">
          <Lock className="w-8 h-8 text-green-400/50" />
        </div>
        <div className="absolute bottom-1/4 left-1/6 w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Key className="w-12 h-12 text-emerald-500/50" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 w-18 h-18 rounded-xl bg-green-600/10 border border-green-600/20 flex items-center justify-center transform -rotate-12">
          <Fingerprint className="w-9 h-9 text-green-600/50" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Content */}
          <div className="space-y-12">
            {/* Section Heading */}
            <div ref={headingRef} className="space-y-6 opacity-0 translate-y-[50px]">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-green-400">Bank-Grade</span>
                <br />
                <span className="text-white">Security</span>
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed">
                Your assets are protected by enterprise-level security protocols and cutting-edge blockchain technology.
              </p>
            </div>

            {/* Security Features */}
            <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-gray-900/50 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 backdrop-blur-sm opacity-0 translate-y-[60px] scale-[0.9]"
                >
                  <div className="space-y-4">
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <Lock className="lock-icon w-6 h-6 text-white absolute" />
                      <CheckCircle className="check-icon w-6 h-6 text-white absolute opacity-0 scale-0 -rotate-180" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Blockchain Visualization & Code */}
          <div className="space-y-12">
            {/* Blockchain Visualization */}
            <div ref={blockchainRef} className="relative">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Blockchain Network</h3>
              <div className="relative bg-gray-900/50 rounded-2xl p-8 border border-green-500/20 backdrop-blur-sm">
                {/* Blockchain Blocks */}
                <div className="flex flex-col space-y-6">
                  {[1, 2, 3, 4].map((block, index) => (
                    <div key={block} className="flex items-center">
                      <div className="blockchain-block relative w-20 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg opacity-0 scale-0 translate-y-[50px]">
                        <div className="text-white font-mono text-sm font-bold">#{block}</div>
                        <div className="absolute inset-0 rounded-lg bg-green-400/20 animate-pulse"></div>
                      </div>
                      
                      {index < 3 && (
                        <div className="blockchain-connection flex-1 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600 mx-4 relative origin-left scale-x-0">
                          <div className="absolute inset-0 bg-green-400/50 animate-pulse"></div>
                        </div>
                      )}
                      
                      <div className="flex-1 ml-4">
                        <div className="text-white text-sm font-semibold">
                          Block {block}
                        </div>
                        <div className="text-green-400 text-xs font-mono">
                          Hash: {Math.random().toString(36).substring(2, 10)}...
                        </div>
                        <div className="text-text-secondary text-xs">
                          {index === 0 ? 'Genesis Block' : `${Math.floor(Math.random() * 100)} transactions`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Network Status */}
                <div className="mt-8 pt-6 border-t border-green-500/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-green-400 text-lg font-bold">99.99%</div>
                      <div className="text-text-secondary text-xs">Uptime</div>
                    </div>
                    <div>
                      <div className="text-green-400 text-lg font-bold">2.3s</div>
                      <div className="text-text-secondary text-xs">Block Time</div>
                    </div>
                    <div>
                      <div className="text-green-400 text-lg font-bold">1,247</div>
                      <div className="text-text-secondary text-xs">Nodes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Snippet */}
            <div ref={codeRef} className="relative">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">API Security</h3>
              <div className="relative bg-gray-900 rounded-2xl p-6 border border-green-500/20 font-mono text-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-text-secondary text-xs">security-config.json</div>
                </div>
                
                <div className="relative">
                  <pre className="text-green-400 leading-relaxed whitespace-pre-wrap">{codeContent}</pre>
                  <span className="cursor inline-block w-2 h-5 bg-green-400 ml-1"></span>
                </div>

                {/* Glowing effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSecurity;