// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, sendSignInLinkToEmail } from "firebase/auth";

// Firebase config - hardcoded values
const firebaseConfig = {
  apiKey: "AIzaSyDiLMEr0CM8wQDWpOmfKK5oEa5fm6XwszU",
  authDomain: "sample-app-9e5fc.firebaseapp.com",
  projectId: "sample-app-9e5fc",
  storageBucket: "sample-app-9e5fc.firebasestorage.app",
  messagingSenderId: "993888905229",
  appId: "1:993888905229:web:48a6e32cdc556dca1b0d44",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Firebase Auth instance
export const auth = getAuth(app);

// No persistence needed - using custom JWT session management
// Firebase only used for initial authentication, not session persistence

// Export email service functions
export { sendSignInLinkToEmail };

export default app;