'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase.config';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isRedirecting: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasCheckedRedirect, setHasCheckedRedirect] = useState(false);
  const router = useRouter();

  // Set auth cookies helper function
  const setAuthCookies = async (user: User) => {
    try {
      const idToken = await user.getIdToken();
      const cookieOptions = 'path=/; max-age=3600; samesite=strict';
      
      // Set multiple cookie formats for compatibility
      document.cookie = `auth-token=${idToken}; ${cookieOptions}`;
      document.cookie = `firebase-auth-token=${idToken}; ${cookieOptions}`;
      document.cookie = `__session=${idToken}; ${cookieOptions}`;
      
      console.log('🍪 Auth cookies set successfully');
    } catch (error) {
      console.error('❌ Failed to set auth cookies:', error);
    }
  };

  // Clear auth cookies helper function
  const clearAuthCookies = () => {
    const expiredCookie = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `auth-token=; ${expiredCookie}`;
    document.cookie = `firebase-auth-token=; ${expiredCookie}`;
    document.cookie = `__session=; ${expiredCookie}`;
    
    localStorage.removeItem('krizpay-auth-user');
    localStorage.removeItem('krizpay-auth-token');
    
    console.log('🧹 Auth cookies and storage cleared');
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('🔍 AuthContext: Starting auth initialization...');

      // Only check redirect result once
      if (!hasCheckedRedirect) {
        setHasCheckedRedirect(true);
        
        try {
          console.log('🔄 Checking for redirect result...');
          const result = await getRedirectResult(auth);
          
          if (result?.user && mounted) {
            console.log('🎉 Redirect result found:', result.user.email);
            
            // Set cookies immediately
            await setAuthCookies(result.user);
            
            // Update state
            setUser(result.user);
            setError(null);
            setIsRedirecting(false);
            setLoading(false);
            
            // Get redirect path and navigate
            const params = new URLSearchParams(window.location.search);
            const redirectPath = params.get('redirect') || '/dashboard';
            
            console.log(`✅ Redirecting to: ${redirectPath}`);
            router.push(redirectPath);
            return; // Don't set up auth listener yet
          } else {
            console.log('🤷‍♂️ No redirect result found');
          }
        } catch (error: any) {
          console.error('❌ Redirect result error:', error);
          setError(`Sign-in failed: ${error.message}`);
          setIsRedirecting(false);
        }
      }

      // Set up auth state listener
      console.log('👂 Setting up auth state listener...');
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!mounted) return;

        console.log('🔔 Auth state changed:', firebaseUser?.email || 'No user');
        
        if (firebaseUser) {
          // User is signed in
          await setAuthCookies(firebaseUser);
          setUser(firebaseUser);
        } else {
          // User is signed out
          clearAuthCookies();
          setUser(null);
        }
        
        setLoading(false);
        setIsRedirecting(false);
      });

      // Clean up function
      return () => {
        console.log('🧹 Cleaning up auth listener');
        unsubscribe();
      };
    };

    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [router, hasCheckedRedirect]);

  // Use popup for better reliability, fallback to redirect
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🚀 Starting Google sign-in...');

      // Clear any existing auth data
      clearAuthCookies();

      // Try popup first (more reliable)
      try {
        console.log('🪟 Attempting popup sign-in...');
        const result = await signInWithPopup(auth, googleProvider);
        
        if (result.user) {
          console.log('✅ Popup sign-in successful:', result.user.email);
          
          // Set cookies immediately
          await setAuthCookies(result.user);
          
          // Get redirect path
          const params = new URLSearchParams(window.location.search);
          const redirectPath = params.get('redirect') || '/dashboard';
          
          console.log(`🎯 Redirecting to: ${redirectPath}`);
          
          // Force navigation to dashboard
          window.location.href = redirectPath;
          return;
        }
      } catch (popupError: any) {
        console.warn('⚠️ Popup failed, trying redirect...', popupError.message);
        
        // If popup fails, fall back to redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          console.log('🔄 Falling back to redirect method...');
          setIsRedirecting(true);
          
          // Configure provider
          googleProvider.setCustomParameters({
            prompt: 'select_account'
          });
          
          await signInWithRedirect(auth, googleProvider);
          return;
        } else {
          throw popupError;
        }
      }
      
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      setError(`Sign-in failed: ${error.message}`);
      setIsRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('👋 Signing out...');
      
      // Clear auth data first
      clearAuthCookies();
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      console.log('✅ Sign-out successful');
      router.push('/');
      
    } catch (error: any) {
      console.error('❌ Sign-out error:', error);
      setError(`Sign-out failed: ${error.message}`);
      
      // Force clear auth data even if signOut fails
      clearAuthCookies();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    clearError,
    isRedirecting,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};