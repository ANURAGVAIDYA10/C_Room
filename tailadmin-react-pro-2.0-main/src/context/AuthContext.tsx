// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from "../config/permissions";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [isRequester, setIsRequester] = useState(false);

  // Function to refresh user data from backend
  const refreshUserData = useCallback(async () => {
    if (currentUser?.uid) {
      try {
        console.log('AuthContext: Refreshing user data for uid=', currentUser.uid);
        
        // Import the apiCall function to get user data from backend
        const { apiCall } = await import('../services/api');
        
        const userData = await apiCall(`/api/auth/role/${currentUser.uid}`);
        console.log('AuthContext: User data received=', userData);
        
        // Set user data from backend
        setUserData(userData.user || userData);
        setUserRole(userData.role || (userData.user && userData.user.role));
        setUserDepartmentId((userData.department || (userData.user && userData.user.department))?.id || null);
        setUserDepartmentName((userData.department || (userData.user && userData.user.department))?.name || null);
        setUserOrganizationId((userData.organization || (userData.user && userData.user.organization))?.id || null);
        setUserOrganizationName((userData.organization || (userData.user && userData.user.organization))?.name || null);
        setIsAdmin((userData.role || (userData.user && userData.user.role)) === 'ADMIN' || (userData.role || (userData.user && userData.user.role)) === 'SUPER_ADMIN');
        setIsSuperAdmin((userData.role || (userData.user && userData.user.role)) === 'SUPER_ADMIN');
        setIsApprover((userData.role || (userData.user && userData.user.role)) === 'APPROVER');
        setIsRequester((userData.role || (userData.user && userData.user.role)) === 'REQUESTER');
        
        console.log('AuthContext: User role set to=', userData.role || (userData.user && userData.user.role));
      } catch (error) {
        console.error("Error refreshing user data:", error);
        throw error; // Re-throw to be caught by the calling function
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthContext: onAuthStateChanged called with user=', user);
      if (user) {
        setCurrentUser(user);
        // Handle async operations without making the callback itself async
        (async () => {
          try {
            // Auto-sync user with default role if not already in database
            const { apiCall } = await import('../services/api');
            await apiCall(`/api/auth/auto-sync?uid=${encodeURIComponent(user.uid)}`, {
              method: 'POST',
            });
            
            // Get user role and data from backend
            await refreshUserData();
          } catch (error) {
            console.error("Error fetching user data:", error);
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
            
            // Still set loading to false even if there's an error
            console.log('AuthContext: Setting loading to false after error');
          } finally {
            // Only set loading to false after everything is done
            console.log('AuthContext: Setting loading to false');
            setLoading(false);
          }
        })();
      } else {
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

    return unsubscribe;
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
    refreshUserData
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