// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { userService } from "../services/userService";
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from "../config/permissions";
import { CacheManager, UserData as CachedUserData } from "../services/CacheManager";
import { ActivityTracker } from "../services/ActivityTracker";

// Define the user data structure
interface UserData {
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

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  userDepartmentId: number | null;
  userDepartmentName: string | null;
  userOrganizationId: number | null;
  userOrganizationName: string | null;
  userData: UserData | null; // Full user data from backend
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isApprover: boolean;
  isRequester: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  refreshUserData: (forceRefresh?: boolean) => Promise<UserData | undefined>; // Function to manually refresh user data
  signOut: () => Promise<void>; // Function to sign out user
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userDepartmentId, setUserDepartmentId] = useState<number | null>(null);
  const [userDepartmentName, setUserDepartmentName] = useState<string | null>(null);
  const [userOrganizationId, setUserOrganizationId] = useState<number | null>(null);
  const [userOrganizationName, setUserOrganizationName] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null); // Full user data from backend
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [isRequester, setIsRequester] = useState(false);

  // Function to refresh user data from backend
  const signOut = useCallback(async () => {
    try {
      // Clear any cached session data
      if (currentUser?.uid) {
        CacheManager.clearSession(currentUser.uid);
      }
      
      // Stop activity tracking
      ActivityTracker.stopTracking();
      
      // Clear login time
      localStorage.removeItem('loginTime');
      
      // Sign out from Firebase first (this handles Firebase's internal cleanup)
      await auth.signOut();
      
      // Clear only our application-specific data, preserve Firebase auth state
      // This removes cached user sessions, login time, and other app data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('user_session_') || key === 'loginTime') {
          localStorage.removeItem(key);
        }
      });
      
      // Trigger storage event to notify other tabs of auth state change
      window.dispatchEvent(new StorageEvent('storage', {
        key: '__SIGNOUT__',
        oldValue: 'logged_in',
        newValue: 'logged_out',
        url: window.location.href,
      }));
      
      // Reset all state
      setCurrentUser(null);
      setUserRole(null);
      setUserDepartmentId(null);
      setUserDepartmentName(null);
      setUserOrganizationId(null);
      setUserOrganizationName(null);
      setUserData(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setIsApprover(false);
      setIsRequester(false);
      
      console.log('AuthContext: User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, [currentUser?.uid]);
  
  // Also need to handle when user signs in to notify other tabs
  useEffect(() => {
    if (currentUser) {
      // Dispatch an event when user becomes authenticated
      window.dispatchEvent(new StorageEvent('storage', {
        key: '__SIGNIN__',
        oldValue: 'logged_out',
        newValue: 'logged_in',
        url: window.location.href,
      }));
    }
  }, [currentUser]);
  
  const refreshUserData = useCallback(async (forceRefresh = false) => {
    if (currentUser?.uid) {
      try {
        // Check if we have cached data and if refresh is needed
        if (!forceRefresh) {
          const cachedData = CacheManager.getCachedSession(currentUser.uid);
          if (cachedData) {
            console.log('AuthContext: Using cached user data for uid=', currentUser.uid);
            setUserData(cachedData);
            setUserRole(cachedData.role);
            setUserDepartmentId(cachedData.department?.id || null);
            setUserDepartmentName(cachedData.department?.name || null);
            setUserOrganizationId(cachedData.organization?.id || null);
            setUserOrganizationName(cachedData.organization?.name || null);
            setIsAdmin(cachedData.role === 'ADMIN' || cachedData.role === 'SUPER_ADMIN');
            setIsSuperAdmin(cachedData.role === 'SUPER_ADMIN');
            setIsApprover(cachedData.role === 'APPROVER');
            setIsRequester(cachedData.role === 'REQUESTER');
            return cachedData;
          }
        }
        
        console.log('AuthContext: Refreshing user data for uid=', currentUser.uid);
        const userData = await userService.getUserData(currentUser.uid);
        console.log('AuthContext: User data received=', userData);
        
        // Cache the user data
        CacheManager.storeUserSession(currentUser.uid, userData);
        
        setUserData(userData);
        setUserRole(userData.role);
        setUserDepartmentId(userData.department?.id || null);
        setUserDepartmentName(userData.department?.name || null);
        setUserOrganizationId(userData.organization?.id || null);
        setUserOrganizationName(userData.organization?.name || null);
        setIsAdmin(userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN');
        setIsSuperAdmin(userData.role === 'SUPER_ADMIN');
        setIsApprover(userData.role === 'APPROVER');
        setIsRequester(userData.role === 'REQUESTER');
        console.log('AuthContext: User role set to=', userData.role);
        
        return userData;
      } catch (error) {
        console.error("Error refreshing user data:", error);
        throw error;
      }
    }
  }, [currentUser?.uid]);

  // Memoized permission checking functions
  const memoizedHasRole = useCallback((role: string) => userRole === role, [userRole]);
  const memoizedHasAnyRole = useCallback((roles: string[]) => roles.includes(userRole || ''), [userRole]);
  const memoizedHasPermission = useCallback((permission: Permission) => hasPermission(userRole, permission), [userRole]);
  const memoizedHasAnyPermission = useCallback((permissions: Permission[]) => hasAnyPermission(userRole, permissions), [userRole]);
  const memoizedHasAllPermissions = useCallback((permissions: Permission[]) => hasAllPermissions(userRole, permissions), [userRole]);

  useEffect(() => {
    console.log('AuthContext: Setting up onAuthStateChanged listener');
    
    // Start activity tracking when component mounts
    ActivityTracker.startTracking();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthContext: onAuthStateChanged called with user=', user);
      if (user) {
        setCurrentUser(user);
        // Handle async operations without making the callback itself async
        (async () => {
          try {
            // Check if we have cached data first to avoid unnecessary backend calls
            const cachedData = CacheManager.getCachedSession(user.uid);
            
            if (!cachedData) {
              // Only auto-sync if we don't have cached data
              await userService.autoSyncUser(user.uid);
            }
            
            // Get user role and data from backend (uses cache if available)
            await refreshUserData();
          } catch (error) {
            console.error("Error fetching user data:", error);
            // If user exists in Firebase but not in backend, create a minimal user representation
            if ((error as Error).message.includes("User not found")) {
              console.log('User exists in Firebase but not in backend, setting default values');
              setUserRole('REQUESTER');
              setIsRequester(true);
              setIsAdmin(false);
              setIsSuperAdmin(false);
              setIsApprover(false);
              // Don't set user department/org to null as we want to preserve them if they were set
            } else {
              // Set default values if sync fails for other reasons
              setUserRole('REQUESTER');
              setIsRequester(true);
              setIsAdmin(false);
              setIsSuperAdmin(false);
              setIsApprover(false);
            }
            setUserDepartmentId(null);
            setUserDepartmentName(null);
            setUserOrganizationId(null);
            setUserOrganizationName(null);
            setUserData(null);
            
            // Still set loading to false even if there's an error
            console.log('AuthContext: Setting loading to false after error');
          } finally {
            // Only set loading to false after everything is done
            console.log('AuthContext: Setting loading to false');
            setLoading(false);
          }
        })();
      } else {
        // Clear activity tracker when user logs out
        ActivityTracker.stopTracking();
        
        setCurrentUser(null);
        setUserRole(null);
        setUserDepartmentId(null);
        setUserDepartmentName(null);
        setUserOrganizationId(null);
        setUserOrganizationName(null);
        setUserData(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsApprover(false);
        setIsRequester(false);
        // Clear login time when user logs out
        localStorage.removeItem('loginTime');
        // Also set loading to false for logged out users
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    });
    
    // Listen for storage events to handle cross-tab authentication changes
    const handleStorageChange = (event: StorageEvent) => {
      // Check if auth state changed in another tab
      if (event.key === '__SIGNOUT__') {
        // Handle explicit signout event from another tab
        console.log('AuthContext: Received signout event from storage');
        // Clear all session data and reset state
        // Clear all user sessions from localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('user_session_')) {
            localStorage.removeItem(key);
          }
        });
        ActivityTracker.stopTracking();
        
        setCurrentUser(null);
        setUserRole(null);
        setUserDepartmentId(null);
        setUserDepartmentName(null);
        setUserOrganizationId(null);
        setUserOrganizationName(null);
        setUserData(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setIsApprover(false);
        setIsRequester(false);
        localStorage.removeItem('loginTime');
        
        // Optionally reload the page to ensure complete cleanup
        if (window.location.pathname !== '/auth/signin') {
          window.location.href = '/auth/signin';
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      // Ensure activity tracker is stopped when context is unmounted
      ActivityTracker.stopTracking();
      // Remove storage event listener
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshUserData]);

  const value = {
    currentUser,
    userRole,
    userDepartmentId,
    userDepartmentName,
    userOrganizationId,
    userOrganizationName,
    userData,
    loading,
    isAdmin,
    isSuperAdmin,
    isApprover,
    isRequester,
    hasRole: memoizedHasRole,
    hasAnyRole: memoizedHasAnyRole,
    hasPermission: memoizedHasPermission,
    hasAnyPermission: memoizedHasAnyPermission,
    hasAllPermissions: memoizedHasAllPermissions,
    refreshUserData,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}