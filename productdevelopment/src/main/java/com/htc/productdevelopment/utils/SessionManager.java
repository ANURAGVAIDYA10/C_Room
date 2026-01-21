package com.htc.productdevelopment.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.htc.productdevelopment.config.SessionConfig;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Date;

@Component
public class SessionManager {

    // Store session information (user ID to session data)
        private final ConcurrentHashMap<String, SessionData> activeSessions = new ConcurrentHashMap<>();
    
        private final SessionConfig sessionConfig;
    
        @Autowired
        public SessionManager(SessionConfig sessionConfig) {
            this.sessionConfig = sessionConfig;
        }

    // Inner class to hold session data
    public static class SessionData {
        private String userId;
        private String jwtToken;
        private Date lastActivity;
        private Date expiresAt;

        public SessionData(String userId, String jwtToken, Date expiresAt) {
            this.userId = userId;
            this.jwtToken = jwtToken;
            this.lastActivity = new Date();
            this.expiresAt = expiresAt;
        }

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        
        public String getJwtToken() { return jwtToken; }
        public void setJwtToken(String jwtToken) { this.jwtToken = jwtToken; }
        
        public Date getLastActivity() { return lastActivity; }
        public void setLastActivity(Date lastActivity) { this.lastActivity = lastActivity; }
        
        public Date getExpiresAt() { return expiresAt; }
        public void setExpiresAt(Date expiresAt) { this.expiresAt = expiresAt; }

        public boolean isExpired() {
            return new Date().after(expiresAt);
        }

        public boolean isInactiveFor(int maxInactiveMinutes) {
            long currentTime = System.currentTimeMillis();
            long lastActivityTime = lastActivity.getTime();
            return (currentTime - lastActivityTime) > (maxInactiveMinutes * 60 * 1000);
        }
    }

    // Create a new session
    public void createSession(String userId, String jwtToken, Date expiresAt) {
        SessionData sessionData = new SessionData(userId, jwtToken, expiresAt);
        activeSessions.put(userId, sessionData);
    }

    // Get session data for a user
    public SessionData getSession(String userId) {
        return activeSessions.get(userId);
    }

    // Update last activity for a session
    public void updateLastActivity(String userId) {
        SessionData sessionData = activeSessions.get(userId);
        if (sessionData != null) {
            sessionData.setLastActivity(new Date());
        }
    }

    // Refresh session (extend expiry time)
    public void refreshSession(String userId, Date newExpiryTime) {
        SessionData sessionData = activeSessions.get(userId);
        if (sessionData != null) {
            sessionData.setExpiresAt(newExpiryTime);
            sessionData.setLastActivity(new Date()); // Update last activity time
        }
    }

    // Remove a session
    public void removeSession(String userId) {
        activeSessions.remove(userId);
    }

    // Clean up expired sessions
    public void cleanupExpiredSessions() {
        activeSessions.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }

    // Check if session exists and is valid
    public boolean isSessionValid(String userId) {
        SessionData sessionData = activeSessions.get(userId);
        if (sessionData == null) {
            return false;
        }
        return !sessionData.isExpired();
    }

    // Check if session is inactive for too long (1 hour = 60 minutes)
    public boolean isSessionInactive(String userId) {
        SessionData sessionData = activeSessions.get(userId);
        if (sessionData == null) {
            return true; // No session, considered inactive
        }
        return sessionData.isInactiveFor(sessionConfig.getInactivityTimeoutMinutes()); // Use configured timeout
    }
}