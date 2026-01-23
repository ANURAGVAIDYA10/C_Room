// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { authApi } from "../services/api";
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from "../config/permissions";
import { startSessionMonitoring, stopSessionMonitoring, loadSessionConfig } from "../utils/UserIntent";
import { initCrossTabSync, cleanupCrossTabSync, broadcastLogout, broadcastLogin, onSyncMessage, SyncMessageType } from "../utils/crossTabSync";

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
  sessionReady: boolean; // NEW: Flag to indicate session is ready
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isApprover: boolean;
  isRequester: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  refreshUserData: () => Promise<void>; // Function to manually refresh user data
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
  const [sessionReady, setSessionReady] = useState(false); // NEW: Track session readiness
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [isRequester, setIsRequester] = useState(false);

  // Function to refresh user data from backend
  const refreshUserData = useCallback(async () => {
    if (currentUser) {
      try {
        console.log('AuthContext: Refreshing user data for user=', currentUser.email);
        // Since we're using JWT cookies, we don't need to pass the token
        // Just make a request to get the current user data
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/current-user`, {
          credentials: 'include', // Include JWT cookie
        });
        
        console.log('AuthContext: Current user API response status=', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('AuthContext: User data received=', userData);
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
        } else {
          console.error('AuthContext: Failed to get current user data, status=', response.status);
          const errorText = await response.text();
          console.error('AuthContext: Error response=', errorText);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
        throw error;
      }
    }
  }, [currentUser]);

  // Memoized permission checking functions
  const memoizedHasRole = useCallback((role: string) => userRole === role, [userRole]);
  const memoizedHasAnyRole = useCallback((roles: string[]) => roles.includes(userRole || ''), [userRole]);
  const memoizedHasPermission = useCallback((permission: Permission) => hasPermission(userRole, permission), [userRole]);
  const memoizedHasAnyPermission = useCallback((permissions: Permission[]) => hasAnyPermission(userRole, permissions), [userRole]);
  const memoizedHasAllPermissions = useCallback((permissions: Permission[]) => hasAllPermissions(userRole, permissions), [userRole]);

  useEffect(() => {
    // Initialize cross-tab synchronization
    console.log('AuthContext: Initializing cross-tab sync');
    initCrossTabSync();
    
    // Load session configuration from environment variables (build-time sync)
    console.log('AuthContext: Loading session configuration from environment variables');
    loadSessionConfig();
    
    // Listen for logout events from other tabs
    const cleanupLogoutListener = onSyncMessage((message) => {
      if (message.type === SyncMessageType.LOGOUT) {
        console.log('AuthContext: Logout detected from another tab');
        // Perform logout in this tab
        signOut(auth).catch(error => {
          console.error('AuthContext: Error signing out:', error);
        });
      } else if (message.type === SyncMessageType.LOGIN) {
        console.log('AuthContext: Login detected from another tab');
        // The onAuthStateChanged will handle the login
      }
    });
    
    console.log('AuthContext: Setting up onAuthStateChanged listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext: onAuthStateChanged called with user=', user);
      console.log('AuthContext: User email=', user?.email);
      console.log('AuthContext: User uid=', user?.uid);
      
      if (user) {
        try {
          console.log('AuthContext: User is signed in, getting Firebase ID token...');
          
          // Check if we're currently in invitation completion flow
          const isInInvitationFlow = window.location.pathname.includes('/complete-invitation');
          
          if (isInInvitationFlow) {
            console.log('AuthContext: In invitation flow, skipping automatic token exchange');
            // Set basic user data but don't exchange token
            setCurrentUser(user);
            setUserRole('INVITATION_IN_PROGRESS');
            setSessionReady(true);
            return;
          }
          
          // Get Firebase ID token
          const firebaseToken = await user.getIdToken();
          console.log('AuthContext: Got Firebase token, length=', firebaseToken.length);
          
          console.log('AuthContext: Exchanging Firebase token for JWT session...');
          // Exchange Firebase token for JWT session
          const response = await authApi.exchangeFirebaseToken(firebaseToken);
          console.log('AuthContext: Exchange response received:', response);
          console.log('AuthContext: Response type:', typeof response);
          console.log('AuthContext: Response keys:', Object.keys(response || {}));
          console.log('AuthContext: Has user property:', !!(response && response.user));
          
          if (response && response.user) {
            console.log('AuthContext: Token exchange successful');
            // Set user data from response
            setUserRole(response.user.role);
            setUserData(response);
            setCurrentUser(user);
            
            // Set role-based state
            setIsAdmin(response.user.role === 'ADMIN' || response.user.role === 'SUPER_ADMIN');
            setIsSuperAdmin(response.user.role === 'SUPER_ADMIN');
            setIsApprover(response.user.role === 'APPROVER');
            setIsRequester(response.user.role === 'REQUESTER');
            
            // Set department and organization info
            setUserDepartmentId(response.user.department?.id || null);
            setUserDepartmentName(response.user.department?.name || null);
            setUserOrganizationId(response.user.organization?.id || null);
            setUserOrganizationName(response.user.organization?.name || null);
            
            console.log('AuthContext: Authentication state updated successfully');
            
            // Force a refresh of the current user data to ensure everything is loaded
            await refreshUserData();
            console.log('AuthContext: User data refreshed after authentication');
            
            // SET SESSION READY - CRITICAL FOR PROPER API FLOW
            setSessionReady(true);
            console.log('AuthContext: Session ready set to true');
            
            // Start session monitoring ONLY after successful authentication
            console.log('AuthContext: Initializing session monitoring');
            startSessionMonitoring();
            
            // Broadcast login to other tabs
            broadcastLogin();
          } else if (response && response.requires_invitation === "true") {
            console.log('AuthContext: User needs to complete invitation first');
            // Redirect to complete invitation page or show appropriate message
            // For now, we'll set a flag to indicate invitation is required
            setUserRole('INVITATION_REQUIRED');
            setUserData(null);
            setCurrentUser(user); // Still set the Firebase user
            
            // Set default states
            setIsAdmin(false);
            setIsSuperAdmin(false);
            setIsApprover(false);
            setIsRequester(false);
            
            setSessionReady(true);
            console.log('AuthContext: Session ready set to true (invitation required)');
          } else {
            console.error('AuthContext: Failed to exchange token or invalid response:', response);
          }
        } catch (error) {
          console.error('AuthContext: Error exchanging Firebase token:', error);
          // Set default values if sync fails
          setUserRole('REQUESTER');
          setUserDepartmentId(null);
          setUserDepartmentName(null);
          setUserOrganizationId(null);
          setUserOrganizationName(null);
          setUserData(null);
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setIsApprover(false);
          setIsRequester(true);
        }
      } else {
        console.log('AuthContext: User is signed out - authentication check complete');
        
        // Stop session monitoring when user logs out
        stopSessionMonitoring();
        
        // Broadcast logout to other tabs
        broadcastLogout();
        
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
        
        // Authentication check is complete, even for unauthenticated users
        // sessionReady should be true to allow ProtectedRoute to redirect properly
        setSessionReady(true);
        console.log('AuthContext: Session ready set to true (unauthenticated)');
      }
      
      // Set loading to false after handling the user state
      console.log('AuthContext: Setting loading to false');
      setLoading(false);
    });

    // Cleanup function
    return () => {
      unsubscribe();
      cleanupLogoutListener();
      cleanupCrossTabSync();
    };
  }, []);

  const value = {
    currentUser,
    userRole,
    userDepartmentId,
    userDepartmentName,
    userOrganizationId,
    userOrganizationName,
    userData,
    loading,
    sessionReady, // EXPOSE sessionReady
    isAdmin,
    isSuperAdmin,
    isApprover,
    isRequester,
    hasRole: memoizedHasRole,
    hasAnyRole: memoizedHasAnyRole,
    hasPermission: memoizedHasPermission,
    hasAnyPermission: memoizedHasAnyPermission,
    hasAllPermissions: memoizedHasAllPermissions,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}