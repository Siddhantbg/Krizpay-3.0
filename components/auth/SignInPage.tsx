'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Chrome, Shield, ArrowRight, AlertCircle, ExternalLink, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

// Custom KrizPay Logo Component
const KrizPayLogo = ({ size = 24, className = "" }) => {
  return (
    <img 
      src="/KrizPay.svg" 
      alt="KrizPay Logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ filter: 'brightness(0) invert(1)' }} // Makes it white to match the design
    />
  );
};

const SignInPage: React.FC = () => {
  const { user, loading, error, signInWithGoogle, clearError, isRedirecting } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get redirect path from URL if present
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('redirect') || '/dashboard';
    
    console.log(`🎯 SignInPage: Redirect parameter is set to: ${redirectPath}`);
    
    // Redirect if already authenticated
    if (user && !loading) {
      console.log(`✅ User already authenticated (${user.email}), redirecting to: ${redirectPath}`);
      router.push(redirectPath);
      return;
    }

    // Page entrance animation (only if user is not authenticated)
    if (!user) {
      const tl = gsap.timeline();
      
      tl.fromTo('.signin-container', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )
      .fromTo('.signin-card',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
        '-=0.5'
      )
      .fromTo('.feature-item',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
      );
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('🚀 SignInPage: Starting Google sign-in...');
      clearError();
      await signInWithGoogle();
    } catch (error) {
      console.error('❌ SignInPage: Sign-in error:', error);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your data is protected with enterprise-level encryption'
    },
    {
      icon: Zap, // Keep Zap for "Lightning Fast" feature - it makes sense
      title: 'Lightning Fast',
      description: 'Process transactions in milliseconds, not minutes'
    },
    {
      icon: ArrowRight,
      title: 'Global Reach',
      description: 'Send money anywhere in the world instantly'
    }
  ];

  // Determine loading state (either general loading or redirecting)
  const isLoading = loading || isRedirecting;

  // Don't render the sign-in form if user is already authenticated
  if (user && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
            <ArrowRight className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Already Signed In</h2>
          <p className="text-text-secondary">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="signin-container relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center opacity-0">
        {/* Left Column - Branding & Features */}
        <div className="space-y-8">
          {/* Logo & Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {/* UPDATED: Purple container with your custom KrizPay logo */}
              <div className="w-12 h-12 rounded-2xl hero-gradient flex items-center justify-center shadow-lg shadow-primary-purple/20">
                <KrizPayLogo size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">KrizPay</h1>
                <p className="text-text-secondary">The Future of Finance</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Welcome to the
                <br />
                <span className="gradient-text">Next Generation</span>
                <br />
                of Payments
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed">
                Join millions of users who trust KrizPay for secure, fast, and reliable financial transactions.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-item flex items-start space-x-4 opacity-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 border border-primary-purple/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sign In Form */}
        <div className="flex justify-center lg:justify-end">
          <div className="signin-card w-full max-w-md bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-primary-purple/20 shadow-2xl opacity-0">
            <div className="space-y-8">
              {/* Header with Logo */}
              <div className="text-center space-y-4">
                {/* UPDATED: Large KrizPay logo in the sign-in card header */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center shadow-lg shadow-primary-purple/20">
                    <KrizPayLogo size={36} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white">Sign In to KrizPay</h3>
                <p className="text-text-secondary">
                  Get started with your KrizPay account
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-sm font-medium">Sign-in Error</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                    <button 
                      onClick={clearError}
                      className="text-red-300 text-xs mt-2 underline hover:text-red-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Redirecting Notice */}
              {isRedirecting && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start space-x-3">
                  <ExternalLink className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Redirecting to Google</p>
                    <p className="text-blue-300 text-sm mt-1">
                      You'll be redirected to Google's secure sign-in page...
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && !isRedirecting && (
                <div className="bg-primary-purple/10 border border-primary-purple/20 rounded-xl p-4 flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-primary-purple/30 border-t-primary-purple rounded-full animate-spin flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-primary-purple text-sm font-medium">Setting up authentication...</p>
                    <p className="text-text-secondary text-sm mt-1">
                      Please wait while we prepare your secure sign-in.
                    </p>
                  </div>
                </div>
              )}

              {/* Google Sign In Button */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                {isRedirecting ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
                    <span>Redirecting to Google...</span>
                  </div>
                ) : loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
                    <span>Getting ready...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Chrome className="w-6 h-6" />
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>

              {/* Authentication Status */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <div className="flex items-start space-x-2">
                  <ExternalLink className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 text-xs font-medium">
                      Smart Authentication Mode
                    </p>
                    <p className="text-green-300 text-xs mt-1">
                      Secure redirect authentication - No COOP issues! 🎉
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/50 text-text-secondary">
                    Powered by Firebase Auth
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-primary-purple/10 border border-primary-purple/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary-purple flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-primary-purple text-sm font-medium">Secure & Private</p>
                    <p className="text-text-secondary text-xs mt-1">
                      We use industry-standard security measures to protect your data. 
                      Your information is never shared with third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-text-secondary text-center leading-relaxed">
                By signing in, you agree to our{' '}
                <a href="#terms" className="text-primary-purple hover:text-primary-blue transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-primary-purple hover:text-primary-blue transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;