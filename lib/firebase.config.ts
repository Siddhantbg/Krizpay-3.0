// lib/firebase.config.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
};

// Validate configuration in development
if (process.env.NODE_ENV === 'development') {
  const requiredVars = Object.entries(firebaseConfig);
  const missingVars = requiredVars.filter(([key, value]) => !value);
  
  if (missingVars.length > 0) {
    console.error('Missing Firebase configuration:', missingVars.map(([key]) => key));
    throw new Error(`Missing Firebase configuration: ${missingVars.map(([key]) => key).join(', ')}`);
  }
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Check if Firebase app is already initialized
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Configure Auth settings
  auth.useDeviceLanguage(); // Use device language for auth UI
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error(`Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Export Google Auth Provider with configuration
export const googleProvider = new GoogleAuthProvider();

// Add scopes for better user info
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Set custom parameters for better UX
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, db, storage };