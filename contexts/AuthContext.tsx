'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
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

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      setError(null);
      
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
          setError('Sign-in was cancelled. Please try again.');
          break;
        case 'auth/popup-blocked':
          setError('Pop-up was blocked. Please allow pop-ups and try again.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Failed to sign in. Please try again.');
      }
      
      return null;
    } finally {
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
    signInWithGoogle,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};