import { auth } from '../firebase';

// Interface for user session data
interface UserSession {
  data: any;
  timestamp: number;
  expiresAt: number;
  lastActivity: number;
}

// Interface for user data
export interface UserData {
  role: string;
  user: {
    id: number;
    uid: string;
    email: string;
    name: string;
    avatar: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    department?: {
      id: number;
      name: string;
    };
    organization?: {
      id: number;
      name: string;
    };
  };
  department?: {
    id: number;
    name: string;
  };
  organization?: {
    id: number;
    name: string;
  };
}

export class CacheManager {
  private static readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly STAGGER_OFFSET = 5 * 60 * 1000;  // 5 min buffer
  
  // Cache for general API responses
  private static apiCache = new Map<string, { data: any; timestamp: number }>();
  
  /**
   * Store user session data in localStorage
   */
  static storeUserSession(userId: string, data: UserData) {
    const session: UserSession = {
      data: data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION,
      lastActivity: Date.now()
    };
    localStorage.setItem(`user_session_${userId}`, JSON.stringify(session));
  }
  
  /**
   * Get cached session data
   */
  static getCachedSession(userId: string): UserData | null {
    const cached = localStorage.getItem(`user_session_${userId}`);
    if (cached) {
      const session: UserSession = JSON.parse(cached);
      if (Date.now() < session.expiresAt) {
        return session.data;
      }
    }
    return null;
  }
  
  /**
   * Check if cache needs refresh
   */
  static needsRefresh(userId: string): boolean {
    const cached = localStorage.getItem(`user_session_${userId}`);
    if (cached) {
      const session: UserSession = JSON.parse(cached);
      // Add user-specific offset to spread load
      const userOffset = userId.charCodeAt(0) % this.STAGGER_OFFSET;
      return Date.now() > (session.expiresAt - userOffset);
    }
    return true;
  }
  
  /**
   * Clear user session from cache
   */
  static clearSession(userId: string): void {
    localStorage.removeItem(`user_session_${userId}`);
  }
  
  /**
   * Update last activity timestamp
   */
  static updateLastActivity(userId: string): void {
    const cached = localStorage.getItem(`user_session_${userId}`);
    if (cached) {
      const session: UserSession = JSON.parse(cached);
      session.lastActivity = Date.now();
      localStorage.setItem(`user_session_${userId}`, JSON.stringify(session));
    }
  }
  
  /**
   * Get last activity timestamp
   */
  static getLastActivity(userId: string): number | null {
    const cached = localStorage.getItem(`user_session_${userId}`);
    if (cached) {
      const session: UserSession = JSON.parse(cached);
      return session.lastActivity;
    }
    return null;
  }
  
  /**
   * Clear all expired sessions
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('user_session_')) {
        try {
          const session: UserSession = JSON.parse(localStorage.getItem(key)!);
          if (now > session.expiresAt) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // If parsing fails, remove the key
          localStorage.removeItem(key);
        }
      }
    });
  }
  
  /**
   * Generic fetch with cache functionality (for Jira API and other services)
   */
  static async fetchWithCache(url: string, options: RequestInit = {}, cacheDuration: number = 5 * 60 * 1000): Promise<any> {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cached = this.apiCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      console.log(`Returning cached response for ${url}`);
      return cached.data;
    }
    
    // Make the actual fetch request
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store in cache
    this.apiCache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  }
  
  /**
   * Clear API cache
   */
  static clearApiCache(): void {
    this.apiCache.clear();
  }
  
  /**
   * Remove specific cache entry
   */
  static removeCacheEntry(url: string, options: RequestInit = {}): void {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    this.apiCache.delete(cacheKey);
  }
}