package com.htc.productdevelopment.service;

import com.htc.productdevelopment.utils.SessionManager;
import com.htc.productdevelopment.utils.SessionValidationCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SessionCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(SessionCleanupService.class);

    private final SessionManager sessionManager;
    private final SessionValidationCache sessionValidationCache;

    @Autowired
    public SessionCleanupService(SessionManager sessionManager, SessionValidationCache sessionValidationCache) {
        this.sessionManager = sessionManager;
        this.sessionValidationCache = sessionValidationCache;
    }

    /**
     * Scheduled task to clean up expired sessions every 5 minutes
     * This prevents memory leaks when users close browsers without logging out
     */
    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
    public void cleanupExpiredSessions() {
        logger.info("[SESSION_CLEANUP] Starting expired session cleanup...");
        
        int initialSize = sessionManager.getActiveSessionCount();
        logger.info("[SESSION_CLEANUP] Initial active sessions: {}", initialSize);
        
        sessionManager.cleanupExpiredSessions();
        
        int finalSize = sessionManager.getActiveSessionCount();
        int removedSessions = initialSize - finalSize;
        
        if (removedSessions > 0) {
            logger.info("[SESSION_CLEANUP] Removed {} expired sessions. Remaining active sessions: {}", 
                       removedSessions, finalSize);
        } else {
            logger.info("[SESSION_CLEANUP] No expired sessions to remove. Active sessions: {}", finalSize);
        }
    }

    /**
     * Scheduled task to clean up expired validation cache entries every 2 minutes
     * This prevents memory leaks in the validation cache
     */
    @Scheduled(fixedRate = 120000) // 2 minutes in milliseconds
    public void cleanupValidationCache() {
        logger.info("[VALIDATION_CACHE_CLEANUP] Starting validation cache cleanup...");
        
        int initialSize = sessionValidationCache.getCacheSize();
        logger.info("[VALIDATION_CACHE_CLEANUP] Initial validation cache size: {}", initialSize);
        
        sessionValidationCache.cleanupExpiredEntries();
        
        int finalSize = sessionValidationCache.getCacheSize();
        int removedEntries = initialSize - finalSize;
        
        if (removedEntries > 0) {
            logger.info("[VALIDATION_CACHE_CLEANUP] Removed {} expired validation cache entries. Remaining entries: {}", 
                       removedEntries, finalSize);
        } else {
            logger.info("[VALIDATION_CACHE_CLEANUP] No expired validation cache entries to remove. Entries: {}", finalSize);
        }
    }

    /**
     * Manual cleanup method that can be called when needed
     */
    public void manualCleanup() {
        logger.info("[SESSION_CLEANUP] Manual cleanup triggered");
        sessionManager.cleanupExpiredSessions();
        sessionValidationCache.clearCache();
    }
}