/**
 * Force logout utility - Emergency logout function
 * This bypasses normal logout procedures and forces a complete session reset
 */

import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { authApi } from "../services/api";

export async function forceLogout(): Promise<void> {
  console.log("=== FORCE LOGOUT INITIATED ===");
  
  try {
    // Step 1: Clear all browser storage immediately
    console.log("1. Clearing ALL browser storage...");
    localStorage.clear();
    sessionStorage.clear();
    console.log("✅ All storage cleared");
    
    // Step 2: Attempt backend logout (non-blocking)
    console.log("2. Attempting backend logout...");
    try {
      await authApi.logout();
      console.log("✅ Backend logout successful");
    } catch (error) {
      console.warn("⚠️ Backend logout failed:", error);
    }
    
    // Step 3: Attempt Firebase signout (non-blocking)
    console.log("3. Attempting Firebase signout...");
    try {
      await signOut(auth);
      console.log("✅ Firebase signout successful");
    } catch (error) {
      console.warn("⚠️ Firebase signout failed:", error);
    }
    
    // Step 4: Multiple redirect attempts
    console.log("4. Initiating redirect sequence...");
    
    // Immediate redirect attempt
    window.location.href = "/signin";
    
    // Backup redirect after delay
    setTimeout(() => {
      console.log("Backup redirect attempt...");
      window.location.replace("/signin");
    }, 500);
    
    // Final hard redirect
    setTimeout(() => {
      console.log("Final hard redirect...");
      window.location.assign("/signin");
    }, 1000);
    
  } catch (error) {
    console.error("❌ Force logout critical failure:", error);
    
    // Ultimate fallback - reload the page to signin
    try {
      window.location.href = "/signin";
    } catch (finalError) {
      console.error("Ultimate fallback failed:", finalError);
      // If all else fails, at least show the signin page
      window.open("/signin", "_self");
    }
  }
  
  console.log("=== FORCE LOGOUT COMPLETED ===");
}