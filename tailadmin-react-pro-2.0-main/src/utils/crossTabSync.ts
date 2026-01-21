/**
 * Cross-Tab Synchronization Utility
 * Manages authentication and session state across multiple browser tabs
 * Uses BroadcastChannel API for modern browsers with localStorage fallback
 */

// Channel name for cross-tab communication
const AUTH_CHANNEL_NAME = 'auth_sync_channel';
const ACTIVITY_CHANNEL_NAME = 'activity_sync_channel';

// Message types
export enum SyncMessageType {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN',
  ACTIVITY = 'ACTIVITY',
  SESSION_TIMEOUT = 'SESSION_TIMEOUT'
}

export interface SyncMessage {
  type: SyncMessageType;
  timestamp: number;
  data?: any;
}

// BroadcastChannel instance (null if not supported)
let authChannel: BroadcastChannel | null = null;
let activityChannel: BroadcastChannel | null = null;

// Fallback using localStorage events
const STORAGE_KEY = 'auth_sync_event';
const ACTIVITY_STORAGE_KEY = 'activity_sync_event';

/**
 * Initialize cross-tab synchronization
 */
export function initCrossTabSync(): void {
  // Try to use BroadcastChannel API (modern browsers)
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      authChannel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      activityChannel = new BroadcastChannel(ACTIVITY_CHANNEL_NAME);
      console.log('[CROSS_TAB_SYNC] BroadcastChannel initialized');
    } catch (error) {
      console.warn('[CROSS_TAB_SYNC] BroadcastChannel not available, using localStorage fallback');
      authChannel = null;
      activityChannel = null;
    }
  } else {
    console.log('[CROSS_TAB_SYNC] BroadcastChannel not supported, using localStorage fallback');
  }
}

/**
 * Broadcast a message to all other tabs
 */
export function broadcastMessage(message: SyncMessage, isActivity: boolean = false): void {
  const channel = isActivity ? activityChannel : authChannel;
  const storageKey = isActivity ? ACTIVITY_STORAGE_KEY : STORAGE_KEY;
  
  // Use BroadcastChannel if available
  if (channel) {
    try {
      channel.postMessage(message);
      console.log(`[CROSS_TAB_SYNC] Broadcasted ${message.type} via BroadcastChannel`);
    } catch (error) {
      console.error('[CROSS_TAB_SYNC] Error broadcasting message:', error);
    }
  } else {
    // Fallback to localStorage event
    try {
      localStorage.setItem(storageKey, JSON.stringify(message));
      // Remove immediately to trigger event in other tabs
      localStorage.removeItem(storageKey);
      console.log(`[CROSS_TAB_SYNC] Broadcasted ${message.type} via localStorage`);
    } catch (error) {
      console.error('[CROSS_TAB_SYNC] Error using localStorage fallback:', error);
    }
  }
}

/**
 * Listen for messages from other tabs
 */
export function onSyncMessage(callback: (message: SyncMessage) => void, isActivity: boolean = false): () => void {
  const channel = isActivity ? activityChannel : authChannel;
  const storageKey = isActivity ? ACTIVITY_STORAGE_KEY : STORAGE_KEY;
  
  // BroadcastChannel listener
  const broadcastListener = (event: MessageEvent) => {
    console.log(`[CROSS_TAB_SYNC] Received ${event.data.type} via BroadcastChannel`);
    callback(event.data);
  };
  
  // localStorage listener (fallback)
  const storageListener = (event: StorageEvent) => {
    if (event.key === storageKey && event.newValue) {
      try {
        const message: SyncMessage = JSON.parse(event.newValue);
        console.log(`[CROSS_TAB_SYNC] Received ${message.type} via localStorage`);
        callback(message);
      } catch (error) {
        console.error('[CROSS_TAB_SYNC] Error parsing storage event:', error);
      }
    }
  };
  
  // Attach appropriate listener
  if (channel) {
    channel.addEventListener('message', broadcastListener);
  } else {
    window.addEventListener('storage', storageListener);
  }
  
  // Return cleanup function
  return () => {
    if (channel) {
      channel.removeEventListener('message', broadcastListener);
    } else {
      window.removeEventListener('storage', storageListener);
    }
  };
}

/**
 * Broadcast logout event to all tabs
 */
export function broadcastLogout(): void {
  broadcastMessage({
    type: SyncMessageType.LOGOUT,
    timestamp: Date.now()
  });
}

/**
 * Broadcast login event to all tabs
 */
export function broadcastLogin(): void {
  broadcastMessage({
    type: SyncMessageType.LOGIN,
    timestamp: Date.now()
  });
}

/**
 * Broadcast user activity to all tabs
 */
export function broadcastActivity(): void {
  broadcastMessage({
    type: SyncMessageType.ACTIVITY,
    timestamp: Date.now()
  }, true);
}

/**
 * Broadcast session timeout to all tabs
 */
export function broadcastSessionTimeout(): void {
  broadcastMessage({
    type: SyncMessageType.SESSION_TIMEOUT,
    timestamp: Date.now()
  });
}

/**
 * Cleanup cross-tab sync resources
 */
export function cleanupCrossTabSync(): void {
  if (authChannel) {
    authChannel.close();
    authChannel = null;
  }
  if (activityChannel) {
    activityChannel.close();
    activityChannel = null;
  }
  console.log('[CROSS_TAB_SYNC] Cleaned up');
}
