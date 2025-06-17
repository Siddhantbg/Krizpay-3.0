'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      // Add the current path as a redirect parameter
      const currentPath = window.location.pathname;
      console.log(`ProtectedRoute: No authenticated user found, redirecting to signin with redirect=${currentPath}`);
      router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);
  
  // Check for auth token in localStorage as a fallback
  useEffect(() => {
    if (!user && !loading) {
      // Check multiple sources for authentication
      const storedUser = localStorage.getItem('krizpay-auth-user');
      const authToken = document.cookie.includes('auth-token=') || 
                       document.cookie.includes('firebase-auth-token=') || 
                       document.cookie.includes('__session=');
      
      if (!storedUser && !authToken) {
        console.log('ProtectedRoute: No stored user or auth token found');
        // Add the current path as a redirect parameter
        const currentPath = window.location.pathname;
        router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      } else if (storedUser && !user) {
        console.log('ProtectedRoute: Found stored user but no active user, refreshing page to restore session');
        window.location.reload(); // Force reload to restore session
      }
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-2xl hero-gradient flex items-center justify-center animate-pulse">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-primary-purple to-primary-blue blur-xl opacity-50 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Loading...</h2>
            <p className="text-text-secondary">Verifying your authentication</p>
          </div>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Show protected content
  return <>{children}</>;
};

export default ProtectedRoute;