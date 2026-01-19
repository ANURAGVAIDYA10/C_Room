import { auth } from '../firebase';
import { CacheManager } from './CacheManager';

export class ActivityTracker {
  private static readonly TIMEOUT_DURATION = 60 * 60 * 1000; // 1 hour
  private static timeoutId: NodeJS.Timeout | null = null;
  private static isActive = false;
  
  /**
   * Start tracking user activity
   */
  static startTracking(): void {
    if (this.isActive) return;
    
    // Track user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), { passive: true, capture: true });
    });
    
    this.resetTimer();
    this.isActive = true;
  }
  
  /**
   * Stop tracking user activity
   */
  static stopTracking(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isActive = false;
  }
  
  /**
   * Reset the inactivity timer
   */
  static resetTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      this.handleTimeout();
    }, this.TIMEOUT_DURATION);
  }
  
  /**
   * Handle inactivity timeout
   */
  static async handleTimeout(): Promise<void> {
    try {
      // Get current user ID
      const userId = auth.currentUser?.uid;
      
      // Clear cache and session data
      if (userId) {
        CacheManager.clearSession(userId);
      }
      
      // Sign out from Firebase
      await auth.signOut();
      
      // Clear all localStorage
      localStorage.clear();
      
      // Redirect to sign in page
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during timeout handling:', error);
      // Ensure redirect happens even if sign out fails
      window.location.href = '/signin';
    }
  }
  
  /**
   * Clear timer (used when user explicitly logs out)
   */
  static clearTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}