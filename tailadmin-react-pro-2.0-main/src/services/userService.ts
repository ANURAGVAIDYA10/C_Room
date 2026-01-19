import { apiCall } from './api';
import { UserData } from './CacheManager';

export const userService = {
  // Get user data by Firebase UID
  getUserData: async (uid: string): Promise<UserData> => {
    try {
      const response = await apiCall(`/api/auth/role/${uid}`);
      return response;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If the error is specifically "User not found" or status code is 400, we'll re-throw it so the calling function can handle it
      if (error instanceof Error && (error.message.includes('User not found') || (error as any).statusCode === 400)) {
        throw error;
      }
      throw error;
    }
  },

  // Auto-sync user with default role if not already in database
  autoSyncUser: async (uid: string): Promise<any> => {
    try {
      const response = await apiCall('/api/auth/auto-sync', {
        method: 'POST',
        body: JSON.stringify({ uid }),
      });
      return response;
    } catch (error) {
      // Don't throw error for auto-sync since it's not critical for basic functionality
      // This allows the app to continue working even if backend service is down
      console.warn('Warning: Could not auto-sync user (backend may be down):', error);
      // Return a default response to allow the app to continue
      return { success: true, message: 'Auto-sync failed but continuing' };
    }
  },
};