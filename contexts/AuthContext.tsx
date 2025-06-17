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
        // Set initial user state from localStorage to prevent flicker
        // Create a partial user object and cast it to unknown first, then to User to avoid TypeScript errors
        const partialUser = {
          uid: parsedUser.uid,
          email: parsedUser.email,
          displayName: parsedUser.displayName,
          photoURL: parsedUser.photoURL,
          emailVerified: false,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => { throw new Error('Not implemented'); },
          getIdToken: async () => '',
          getIdTokenResult: async () => ({ token: '', claims: {}, expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null }),
          reload: async () => {},
          toJSON: () => ({})
        };
        
        // Cast to unknown first, then to User as suggested by the error message
        setUser(partialUser as unknown as User);
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
            document.cookie = `firebase-auth-token=${idToken}; path=/; secure; samesite=strict; max-age=3600`;
            document.cookie = `__session=${idToken}; path=/; secure; samesite=strict; max-age=3600`;
          }
          
          // Store additional auth info if needed
          if (token) {
            localStorage.setItem('krizpay-auth-token', token);
          }
          
          // Store user info in localStorage for persistence
          localStorage.setItem('krizpay-auth-user', JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          }));
          
          // Set user state immediately
          setUser(result.user);
          
          // Clear any existing errors
          setError(null);
          setIsRedirecting(false);
          
          // Get redirect path from URL if present
          const params = new URLSearchParams(window.location.search);
          const redirectPath = params.get('redirect') || '/dashboard';
          
          // Redirect after successful sign-in
          console.log(`Redirecting to: ${redirectPath}`);
          router.push(redirectPath);
        } else {
          console.log('No redirect result found');
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        setError(`Failed to complete sign-in: ${error.message || 'Unknown error'}`);
        setIsRedirecting(false);
        setLoading(false);
      }
    };

    // Process redirect result immediately
    handleRedirectResult();

    // Then set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      
      // Update user state
      setUser(user);
      setLoading(false);
      
      // Update auth cookies and localStorage
      if (user) {
        try {
          const idToken = await user.getIdToken();
          // Set multiple cookies for better compatibility
          document.cookie = `auth-token=${idToken}; path=/; secure; samesite=strict; max-age=3600`;
          document.cookie = `firebase-auth-token=${idToken}; path=/; secure; samesite=strict; max-age=3600`;
          document.cookie = `__session=${idToken}; path=/; secure; samesite=strict; max-age=3600`;
          
          // Store auth state in localStorage for persistence
          localStorage.setItem('krizpay-auth-user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }));
        } catch (e) {
          console.error('Failed to set auth cookie:', e);
        }
      } else {
        // Clear auth cookies and local storage
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
      
      // Clear any existing auth data before starting a new sign-in
      localStorage.removeItem('krizpay-auth-user');
      localStorage.removeItem('krizpay-auth-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Get the current URL to extract any redirect parameter
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('redirect');
      
      // Configure provider for redirect with proper parameters
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        // Ensure redirect URI is properly set to current origin
        redirect_uri: window.location.origin,
        // Add state parameter to help with redirect handling
        // Include the redirect path in the state if available
        state: redirectPath ? `redirect=${redirectPath}` : Date.now().toString()
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
      setLoading(false); // Ensure loading state is reset on error
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signing out user...');
      
      // Clear local storage and cookies first
      localStorage.removeItem('krizpay-auth-user');
      localStorage.removeItem('krizpay-auth-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
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
      
      // Ensure localStorage and cookies are cleared even if Firebase signOut fails
      localStorage.removeItem('krizpay-auth-user');
      localStorage.removeItem('krizpay-auth-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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