package com.htc.productdevelopment.utils;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Date;

/**
 * Cache for session validation results to reduce backend load
 * Stores validation results temporarily to avoid repeated validation for the same user within a short timeframe
 */
@Component
public class SessionValidationCache {
    
    // Cache entry to store validation result and timestamp
    private static class CacheEntry {
        private final boolean isValid;
        private final long timestamp;
        
        public CacheEntry(boolean isValid) {
            this.isValid = isValid;
            this.timestamp = System.currentTimeMillis();
        }
        
        public boolean isValid() {
            return isValid;
        }
        
        public long getTimestamp() {
            return timestamp;
        }
    }
    
    // Cache to store validation results (userId -> CacheEntry)
    private final Map<String, CacheEntry> validationCache = new ConcurrentHashMap<>();
    
    // Cache timeout in milliseconds (default 30 seconds)
    private static final long CACHE_TIMEOUT_MS = 30000; // 30 seconds
    
    /**
     * Get cached validation result for a user
     * @param userId The user ID to check
     * @return Cached validation result, or null if not cached or expired
     */
    public Boolean getCachedValidation(String userId) {
        CacheEntry entry = validationCache.get(userId);
        
        if (entry == null) {
            return null;
        }
        
        // Check if cache entry is still valid
        if (System.currentTimeMillis() - entry.getTimestamp() > CACHE_TIMEOUT_MS) {
            // Entry expired, remove it
            validationCache.remove(userId);
            return null;
        }
        
        return entry.isValid();
    }
    
    /**
     * Cache a validation result
     * @param userId The user ID
     * @param isValid Whether the session is valid
     */
    public void cacheValidation(String userId, boolean isValid) {
        validationCache.put(userId, new CacheEntry(isValid));
    }
    
    /**
     * Invalidate cache for a specific user (e.g., on logout)
     * @param userId The user ID to invalidate
     */
    public void invalidateUser(String userId) {
        validationCache.remove(userId);
    }
    
    /**
     * Clear entire cache (useful for maintenance)
     */
    public void clearCache() {
        validationCache.clear();
    }
    
    /**
     * Get cache size for monitoring purposes
     */
    public int getCacheSize() {
        return validationCache.size();
    }
    
    /**
     * Clean up expired entries (should be called periodically)
     */
    public void cleanupExpiredEntries() {
        long currentTime = System.currentTimeMillis();
        validationCache.entrySet().removeIf(entry -> 
            currentTime - entry.getValue().getTimestamp() > CACHE_TIMEOUT_MS
        );
    }
}