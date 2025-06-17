'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase.config';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>; // Changed to redirect only
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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      setUser(user);
      setLoading(false);
      setIsRedirecting(false); // Stop redirecting state when auth state changes
      
      // Store auth state in localStorage for persistence
      if (user) {
        localStorage.setItem('krizpay-auth-user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        localStorage.removeItem('krizpay-auth-user');
      }
    });

    // Handle redirect result when app loads
    const handleRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log('Redirect sign-in successful:', result.user);
          
          // Get additional user info
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          
          // Store additional auth info if needed
          if (token) {
            localStorage.setItem('krizpay-auth-token', token);
          }
          
          // Clear any existing errors
          setError(null);
          
          // Redirect to dashboard after successful sign-in
          console.log('Redirecting to dashboard...');
          router.push('/dashboard');
        } else {
          console.log('No redirect result found');
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        setError('Failed to complete sign-in. Please try again.');
        setIsRedirecting(false);
      }
    };

    // Check for redirect result after a small delay to ensure auth is initialized
    const timeoutId = setTimeout(handleRedirectResult, 100);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [router]);

  // ONLY REDIRECT METHOD - NO POPUP TO AVOID COOP ISSUES
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      setIsRedirecting(true);
      
      console.log('Initiating Google sign-in with redirect...');
      
      // Configure provider for redirect
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        redirect_uri: window.location.origin
      });
      
      // Add additional scopes if needed
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      
      await signInWithRedirect(auth, googleProvider);
      
      // User will be redirected to Google, then back to your app
      // The result will be handled in the useEffect above
      console.log('Redirect initiated successfully');
      
    } catch (error: any) {
      console.error('Google redirect sign-in error:', error);
      setError('Failed to initiate sign-in. Please try again.');
      setIsRedirecting(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await firebaseSignOut(auth);
      
      // Clear stored auth data
      localStorage.removeItem('krizpay-auth-user');
      localStorage.removeItem('krizpay-auth-token');
      
      console.log('Sign-out successful');
      
      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      console.error('Sign-out error:', error);
      setError('Failed to sign out. Please try again.');
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
    signInWithGoogle, // Now only uses redirect (NO COOP ISSUES)
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