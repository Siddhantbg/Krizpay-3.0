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
    // First, try to restore user from localStorage if available
    const storedUser = localStorage.getItem('krizpay-auth-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', parsedUser.email || 'Unknown email');
        // Note: This doesn't actually authenticate the user, just restores UI state
        // The actual auth state will be confirmed by onAuthStateChanged
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('krizpay-auth-user');
      }
    }

    // Handle redirect result first, before setting up auth state listener
    const handleRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log('Redirect sign-in successful:', result.user);
          
          // Get additional user info
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          
          // Set auth cookies for middleware access
          if (result.user) {
            const idToken = await result.user.getIdToken();
            document.cookie = `auth-token=${idToken}; path=/; secure; samesite=strict; max-age=3600`;
          }
          
          // Store additional auth info if needed
          if (token) {
            localStorage.setItem('krizpay-auth-token', token);
          }
          
          // Set user state immediately
          setUser(result.user);
          
          // Clear any existing errors
          setError(null);
          setIsRedirecting(false);
          
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

    // Process redirect result immediately
    handleRedirectResult();

    // Then set up the auth state listener
    // In the onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      
      // Update user state
      setUser(user);
      setLoading(false);
      
      // Update auth cookies for middleware
      if (user) {
        try {
          const idToken = await user.getIdToken();
          document.cookie = `auth-token=${idToken}; path=/; secure; samesite=strict; max-age=3600`;
        } catch (e) {
          console.error('Failed to set auth cookie:', e);
        }
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('krizpay-auth-user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        // Clear auth cookies and local storage
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('krizpay-auth-user');
        localStorage.removeItem('krizpay-auth-token');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  // ONLY REDIRECT METHOD - NO POPUP TO AVOID COOP ISSUES
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      setIsRedirecting(true);
      
      console.log('Initiating Google sign-in with redirect...');
      
      // In the signInWithGoogle function
      // Clear any existing auth data before starting a new sign-in
      localStorage.removeItem('krizpay-auth-user');
      localStorage.removeItem('krizpay-auth-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Configure provider for redirect with proper parameters
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        // Ensure redirect URI is properly set to current origin
        redirect_uri: window.location.origin,
        // Add state parameter to help with redirect handling
        state: Date.now().toString()
      });
      
      // Add additional scopes if needed
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      
      // Initiate the redirect flow
      await signInWithRedirect(auth, googleProvider);
      
      // User will be redirected to Google, then back to your app
      // The result will be handled in the useEffect above
      console.log('Redirect initiated successfully');
      
    } catch (error: any) {
      console.error('Google redirect sign-in error:', error);
      setError(`Failed to initiate sign-in: ${error.message || 'Unknown error'}`);
      setIsRedirecting(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Clear local storage and cookies first
      localStorage.removeItem('krizpay-auth-user');
      localStorage.removeItem('krizpay-auth-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Set user to null before actual signout
      setUser(null);
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      console.log('Sign-out successful');
      
      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      console.error('Sign-out error:', error);
      setError(`Failed to sign out: ${error.message || 'Unknown error'}`);
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