import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if all required config values are present
export function checkFirebaseConfig() {
  console.log("Checking Firebase configuration...");
  
  const requiredKeys = [
    'apiKey', 
    'authDomain', 
    'projectId'
  ];
  
  const missingKeys = requiredKeys.filter(key => 
    !firebaseConfig[key] || firebaseConfig[key] === undefined
  );
  
  if (missingKeys.length > 0) {
    console.error("Missing required Firebase configuration:", missingKeys);
    return false;
  }
  
  console.log("Firebase configuration looks good");
  return true;
}

// Initialize Firebase with error handling
export function initializeFirebase() {
  try {
    console.log("Initializing Firebase");
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // Use emulators in development if needed
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log("Connected to Firebase emulators");
    }
    
    console.log("Firebase initialized successfully");
    return { app, auth, db };
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
}