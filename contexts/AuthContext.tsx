'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
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
  signInWithGoogle: () => Promise<UserCredential | null>;
  signInWithGoogleRedirect: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
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
          
          // Redirect to dashboard after successful sign-in
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        setError('Failed to complete sign-in. Please try again.');
      }
    };

    handleRedirectResult();

    return () => unsubscribe();
  }, [router]);

  // Popup method (may have COOP issues)
  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Configure provider for popup
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get additional user info
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      // Store additional auth info if needed
      if (token) {
        localStorage.setItem('krizpay-auth-token', token);
      }
      
      // Redirect to dashboard after successful sign-in
      router.push('/dashboard');
      
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in was cancelled. Please try again or use the redirect method.');
          break;
        case 'auth/popup-blocked':
          setError('Pop-up was blocked. Please allow pop-ups or use the redirect method.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          // Check if it's a COOP-related error
          if (error.message.includes('Cross-Origin-Opener-Policy') || 
              error.message.includes('window.closed')) {
            setError('Browser security settings are blocking the popup. Please use the redirect sign-in method instead.');
          } else {
            setError('Failed to sign in. Please try the redirect method or try again later.');
          }
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Redirect method (recommended, no COOP issues)
  const signInWithGoogleRedirect = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Initiating Google sign-in with redirect...');
      
      // Configure provider for redirect
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        redirect_uri: window.location.origin
      });
      
      await signInWithRedirect(auth, googleProvider);
      // User will be redirected to Google, then back to your app
      // The result will be handled in the useEffect above
    } catch (error: any) {
      console.error('Google redirect sign-in error:', error);
      setError('Failed to initiate sign-in. Please try again.');
      setLoading(false);
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
    signInWithGoogle, // Popup method (with COOP handling)
    signInWithGoogleRedirect, // Redirect method (recommended)
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};