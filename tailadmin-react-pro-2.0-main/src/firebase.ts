// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink, signInWithPopup, GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase config - hardcoded values
// const firebaseConfig = {
//   apiKey: "AIzaSyDiLMEr0CM8wQDWpOmfKK5oEa5fm6XwszU",
//   authDomain: "sample-app-9e5fc.firebaseapp.com",
//   projectId: "sample-app-9e5fc",
//   storageBucket: "sample-app-9e5fc.firebasestorage.app",
//   messagingSenderId: "993888905229",
//   appId: "1:993888905229:web:48a6e32cdc556dca1b0d44",
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyB_DS7d2PSuA0VzMRiEF4YQ5l3mFGlkMzw",
//   authDomain: "costroom-c8200.firebaseapp.com",
//   projectId: "costroom-c8200",
//   storageBucket: "costroom-c8200.firebasestorage.app",
//   messagingSenderId: "746173029556",
//   appId: "1:746173029556:web:a3f6f4d2ba8bdbd5840be1",
//   measurementId: "G-JB48EJ7MQN"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCmA0RD0VSDxiWTl0Z2KklS1WGJ849N-xM",
  authDomain: "costroom-new.firebaseapp.com",
  projectId: "costroom-new",
  storageBucket: "costroom-new.firebasestorage.app",
  messagingSenderId: "519761599990",
  appId: "1:519761599990:web:155b52419d33e60ea37bd7",
  measurementId: "G-41HTHLW8L0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Firebase Auth instance
export const auth = getAuth(app);

// No persistence needed - using custom JWT session management
// Firebase only used for initial authentication, not session persistence

// Export email service functions and OAuth providers
export { sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink, signInWithPopup, GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword };

export default app;