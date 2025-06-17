// lib/auth.ts
import { 
  signInWithRedirect, 
  getRedirectResult, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.config';

// Use redirect instead of popup to avoid COOP issues
export const signInWithGoogle = async () => {
  try {
    console.log('Initiating Google sign-in with redirect...');
    await signInWithRedirect(auth, googleProvider);
    // User will be redirected to Google, then back to your app
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Handle the redirect result when user returns
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('Redirect sign-in successful:', result.user);
      return result.user;
    }
    return null;
  } catch (error: any) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

// Fallback to popup with better error handling
export const signInWithGooglePopup = async () => {
  try {
    console.log('Attempting popup sign-in...');
    
    // Set custom parameters to avoid COOP issues
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      // Add this to potentially help with COOP
      redirect_uri: window.location.origin
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Popup sign-in successful:', result.user);
    return result.user;
  } catch (error: any) {
    console.error('Popup sign-in error:', error);
    
    // If popup fails due to COOP, fallback to redirect
    if (error.code === 'auth/popup-blocked' || 
        error.code === 'auth/popup-closed-by-user' ||
        error.message.includes('Cross-Origin-Opener-Policy')) {
      console.log('Popup blocked, falling back to redirect...');
      return signInWithGoogle(); // Use redirect instead
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('Sign-out successful');
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};