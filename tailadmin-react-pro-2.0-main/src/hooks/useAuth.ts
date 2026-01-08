// src/hooks/useAuth.ts
import { useAuth as useAuthContext } from '../context/AuthContext';

// Re-export the useAuth hook from the context
export const useAuth = useAuthContext;