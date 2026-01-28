package com.htc.productdevelopment.utils;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Date;

/**
 * Utility class to validate user activity with additional server-side checks
 * Helps prevent session extension attacks from malicious clients
 */
@Component
public class ActivityValidationUtil {
    
    // Track recent activity requests per user to detect potential abuse
    private final Map<String, ActivityTracker> activityTrackers = new ConcurrentHashMap<>();
    
    // Maximum number of activity requests allowed per user per minute
    private static final int MAX_ACTIVITY_REQUESTS_PER_MINUTE = 30;
    
    // Time window for rate limiting (1 minute in milliseconds)
    private static final long ACTIVITY_WINDOW_MS = 60000;
    
    private static class ActivityTracker {
        private int requestCount;
        private long windowStart;
        
        public ActivityTracker() {
            this.requestCount = 1;
            this.windowStart = System.currentTimeMillis();
        }
        
        public boolean incrementAndCheckLimit() {
            long currentTime = System.currentTimeMillis();
            
            // If we're still in the same window, check the count
            if (currentTime - windowStart < ACTIVITY_WINDOW_MS) {
                requestCount++;
                return requestCount <= MAX_ACTIVITY_REQUESTS_PER_MINUTE;
            } else {
                // Start a new window
                windowStart = currentTime;
                requestCount = 1;
                return true;
            }
        }
        
        public boolean isValidActivityWindow() {
            return System.currentTimeMillis() - windowStart < ACTIVITY_WINDOW_MS;
        }
    }
    
    /**
     * Validates if an activity request from a user is legitimate
     * @param userId The user ID making the request
     * @param userAgent The user agent string from the request
     * @param clientIP The client IP address
     * @return true if the activity appears legitimate, false if suspicious
     */
    public boolean validateActivityRequest(String userId, String userAgent, String clientIP) {
        // Basic validation - all parameters should be present
        if (userId == null || userId.trim().isEmpty()) {
            return false;
        }
        
        // Check if this looks like a bot or automated request
        if (userAgent != null) {
            String lowerUserAgent = userAgent.toLowerCase();
            // Common bot indicators
            if (lowerUserAgent.contains("bot") || 
                lowerUserAgent.contains("crawler") || 
                lowerUserAgent.contains("spider") ||
                lowerUserAgent.contains("automation")) {
                return false;
            }
        }
        
        // Check activity frequency for this user
        ActivityTracker tracker = activityTrackers.computeIfAbsent(userId, k -> new ActivityTracker());
        
        // Clean up old trackers
        activityTrackers.entrySet().removeIf(entry -> 
            !entry.getValue().isValidActivityWindow());
        
        // Check if this request exceeds the rate limit
        boolean withinLimit = tracker.incrementAndCheckLimit();
        
        return withinLimit;
    }
    
    /**
     * Records a legitimate activity request
     * @param userId The user ID
     */
    public void recordLegitimateActivity(String userId) {
        // This method could be expanded to track successful activities
        // for analytics or security monitoring purposes
    }
    
    /**
     * Invalidates the activity tracker for a user (e.g., on logout)
     * @param userId The user ID to invalidate
     */
    public void invalidateUserActivityTracking(String userId) {
        activityTrackers.remove(userId);
    }
}