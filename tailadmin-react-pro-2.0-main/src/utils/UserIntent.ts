import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { authApi } from '../services/api';
import { broadcastActivity, broadcastSessionTimeout, onSyncMessage, SyncMessageType } from './crossTabSync';

/**
 * Explicit user intent tracking utility
 * No timing windows, no heuristics, no inference
 * Pure explicit intent consumption model
 */

/**
 * Marks explicit user intent for ONE request only
 * Call this ONLY on direct user interactions
 */
export function markUserIntent(): void {
  sessionStorage.setItem("USER_INTENT", Date.now().toString());
  console.log('[USER_INTENT] User intent marked at:', new Date().toISOString());
}

/**
 * Consumes user intent flag for ONE request only
 * Returns true if user intent was marked, then removes the flag
 * Returns false if no user intent was marked
 */
export function consumeUserIntent(): boolean {
  const ts = sessionStorage.getItem("USER_INTENT");
  if (!ts) {
    console.log('[USER_INTENT] No user intent found, consuming failed');
    return false;
  }
  sessionStorage.removeItem("USER_INTENT");
  console.log('[USER_INTENT] User intent consumed at:', new Date().toISOString(), 'Timestamp:', ts);
  return true;
}

// Function to track session activity
let lastActivityTime: number = Date.now();
let sessionStartTime: number = Date.now();
let inactivityCheckInterval: NodeJS.Timeout | null = null;
let hasLoggedOut: boolean = false;
let isMonitoring: boolean = false; // Track if monitoring is active
let cleanupActivityListener: (() => void) | null = null; // Cleanup for cross-tab activity listener

export function updateLastActivity(): void {
  lastActivityTime = Date.now();
  hasLoggedOut = false; // Reset logout flag on activity
  
  // Broadcast activity to other tabs (throttled to avoid spam)
  if (isMonitoring) {
    broadcastActivity();
  }
  
  console.log('[SESSION_MONITOR] Last activity updated at:', new Date().toISOString());
  console.log('[SESSION_MONITOR] Activity reset - last activity timer refreshed');
}

import { SESSION_CONFIG } from '../config/apiConfig';

// Session timeout in minutes - uses centralized configuration
const SESSION_TIMEOUT_MINUTES = SESSION_CONFIG.SESSION_TIMEOUT_MINUTES;

export function checkInactivity(): boolean {
  const now = Date.now();
  const elapsedMinutes = (now - lastActivityTime) / (1000 * 60);
  const totalSessionMinutes = (now - sessionStartTime) / (1000 * 60);
  
  console.log(`[SESSION_MONITOR] Time since last activity: ${elapsedMinutes.toFixed(2)} minutes | Total session time: ${totalSessionMinutes.toFixed(2)} minutes`);
  
  // Return true if more than SESSION_TIMEOUT_MINUTES have passed since last activity
  return elapsedMinutes >= SESSION_TIMEOUT_MINUTES;
}

// Function to handle logout on inactivity
async function handleInactivityLogout(): Promise<void> {
  if (hasLoggedOut) {
    return; // Prevent multiple logout attempts
  }

  // Stop monitoring immediately to prevent further logout attempts
  stopSessionMonitoring();

  hasLoggedOut = true;
  console.log('[SESSION_MONITOR] 🚪 Logging out user due to inactivity...');

  // Broadcast session timeout to all tabs
  broadcastSessionTimeout();

  // 1. Clear browser storage first
  sessionStorage.clear();
  localStorage.removeItem('loginTime');
  console.log('[SESSION_MONITOR] ✅ Browser storage cleared');

  // 2. Sign out from Firebase
  try {
    await signOut(auth);
    console.log('[SESSION_MONITOR] ✅ Firebase signed out');
  } catch (firebaseError) {
    console.warn('[SESSION_MONITOR] ⚠️ Failed to sign out from Firebase:', firebaseError);
    // Continue with logout even if Firebase sign out fails
  }

  // 3. Try to clear JWT session on backend (don't fail if it fails)
  try {
    await authApi.logout();
    console.log('[SESSION_MONITOR] ✅ JWT session cleared on backend');
  } catch (apiError) {
    console.warn('[SESSION_MONITOR] ⚠️ Failed to clear backend session (likely already expired):', apiError);
    // This is expected if session is already expired, so don't treat as error
  }

  console.log('[SESSION_MONITOR] ✅ User logged out successfully due to inactivity');

  // 4. Redirect to sign-in page
  window.location.href = '/signin';
}

// Function to initialize session monitoring
export function startSessionMonitoring(): void {
  // Prevent duplicate monitoring
  if (isMonitoring) {
    console.log('[SESSION_MONITOR] Session monitoring already active, skipping duplicate initialization');
    return;
  }
  
  isMonitoring = true;
  sessionStartTime = Date.now();
  lastActivityTime = Date.now();
  hasLoggedOut = false;
  
  console.log('[SESSION_MONITOR] Session monitoring started at:', new Date().toISOString());
  console.log('[SESSION_MONITOR] Initial activity time set to current time');
  console.log(`[SESSION_MONITOR] ⏱️  Inactivity timeout set to ${SESSION_TIMEOUT_MINUTES} minutes (loaded from backend configuration)`);
  
  // Clear any existing interval
  if (inactivityCheckInterval) {
    clearInterval(inactivityCheckInterval);
  }
  
  // Set up activity listeners to track user interactions
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  activityEvents.forEach(event => {
    document.addEventListener(event, updateLastActivity, { passive: true });
  });
  
  // Listen for activity from other tabs
  cleanupActivityListener = onSyncMessage((message) => {
    if (message.type === SyncMessageType.ACTIVITY) {
      // Update last activity time when activity detected in other tabs
      lastActivityTime = Date.now();
      console.log('[SESSION_MONITOR] 🔄 Activity detected in another tab');
    } else if (message.type === SyncMessageType.SESSION_TIMEOUT) {
      // Another tab triggered session timeout, logout this tab too
      console.log('[SESSION_MONITOR] ⚠️ Session timeout triggered in another tab');
      handleInactivityLogout();
    }
  }, true); // true = listen to activity channel
  
  // Set up periodic checks every 10 seconds
  inactivityCheckInterval = setInterval(() => {
    if (checkInactivity()) {
      console.log(`[SESSION_MONITOR] ⚠️ SESSION TIMEOUT - ${SESSION_TIMEOUT_MINUTES}+ minutes of inactivity detected`);
      handleInactivityLogout();
    }
  }, 10000); // Check every 10 seconds
}

// Function to stop session monitoring (useful for cleanup)
export function stopSessionMonitoring(): void {
  if (!isMonitoring) {
    console.log('[SESSION_MONITOR] Session monitoring not active, nothing to stop');
    return;
  }
  
  if (inactivityCheckInterval) {
    clearInterval(inactivityCheckInterval);
    inactivityCheckInterval = null;
  }
  
  // Clean up cross-tab activity listener
  if (cleanupActivityListener) {
    cleanupActivityListener();
    cleanupActivityListener = null;
  }
  
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  activityEvents.forEach(event => {
    document.removeEventListener(event, updateLastActivity);
  });
  
  isMonitoring = false;
  console.log('[SESSION_MONITOR] Session monitoring stopped');
}
