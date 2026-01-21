package com.htc.productdevelopment.interceptor;

import com.htc.productdevelopment.utils.CookieUtil;
import com.htc.productdevelopment.utils.JwtUtil;
import com.htc.productdevelopment.utils.SessionManager;
import com.htc.productdevelopment.config.SessionConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Date;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final SessionManager sessionManager;
    
    @Autowired
    private SessionConfig sessionConfig; // Use field injection to avoid circular dependency

    @Autowired
    public SessionInterceptor(JwtUtil jwtUtil, CookieUtil cookieUtil, SessionManager sessionManager) {
        this.jwtUtil = jwtUtil;
        this.cookieUtil = cookieUtil;
        this.sessionManager = sessionManager;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Skip authentication for certain public endpoints
        String requestURI = request.getRequestURI();
        if (isPublicEndpoint(requestURI)) {
            return true;
        }

        // Get JWT token from cookie
        String jwtToken = cookieUtil.getJwtFromCookies(request);
        
        if (jwtToken == null || jwtToken.isEmpty()) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"No authentication token found\"}");
            return false;
        }

        // Validate JWT token
        String username = jwtUtil.getUsernameFromToken(jwtToken);
        if (username == null || !jwtUtil.validateToken(jwtToken, username)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return false;
        }

        // Check if session is valid - BUT allow grace period after token exchange
        if (!sessionManager.isSessionValid(username)) {
            // For immediate post-login requests, there might be a small timing issue
            // Let's add a grace period to handle the race condition by checking if the token is fresh
            boolean isFreshToken = isFreshToken(jwtToken);
            if (!isFreshToken) {
                // Clear the invalid token
                response.addHeader("Set-Cookie", cookieUtil.clearJwtCookie().toString());
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("{\"error\": \"Session expired\"}");
                return false;
            }
        }

        // Check if user has been inactive for too long (> 1 hour)
        if (sessionManager.isSessionInactive(username)) {
            // Clear the inactive session
            sessionManager.removeSession(username);
            response.addHeader("Set-Cookie", cookieUtil.clearJwtCookie().toString());
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"Session expired due to inactivity\"}");
            return false;
        }

        // Update last activity for the session
        sessionManager.updateLastActivity(username);

        // If token is close to expiry (within 5 minutes), refresh it
        if (shouldRefreshToken(jwtToken)) {
            // Generate new token with extended expiry
            String role = (String) jwtUtil.getClaimFromToken(jwtToken, claims -> claims.get("role"));
            String provider = (String) jwtUtil.getClaimFromToken(jwtToken, claims -> claims.get("provider"));
            String firebaseUid = (String) jwtUtil.getClaimFromToken(jwtToken, claims -> claims.get("firebaseUid"));

            String newToken = jwtUtil.generateToken(username, role, provider, firebaseUid);
            
            // Update session with new token
            Date newExpiry = new Date(System.currentTimeMillis() + sessionConfig.getSessionTimeoutMs()); // Use configured timeout
            sessionManager.refreshSession(username, newExpiry);
            
            // Set new token in response
            var newJwtCookie = cookieUtil.createJwtCookie(newToken);
            response.addHeader("Set-Cookie", newJwtCookie.toString());
        }

        return true;
    }

    // Helper method to check if token is fresh (created within last 5 seconds)
    private boolean isFreshToken(String token) {
        try {
            Date issuedAt = (Date) jwtUtil.getClaimFromToken(token, claims -> claims.getIssuedAt());
            if (issuedAt != null) {
                long currentTime = System.currentTimeMillis();
                long issuedTime = issuedAt.getTime();
                long timeDiff = currentTime - issuedTime;
                
                // If token was issued within last 10 seconds, consider it fresh
                return timeDiff <= 10000; // 10 seconds grace period
            }
        } catch (Exception e) {
            // If we can't determine issued time, return false
        }
        return false;
    }

    private boolean isPublicEndpoint(String uri) {
        // Define endpoints that don't require authentication
        return uri.startsWith("/api/auth/login") ||
               uri.startsWith("/api/auth/complete-invitation") ||
               uri.equals("/api/auth/exchange-token") ||
               uri.startsWith("/api/auth/refresh") ||
               uri.startsWith("/api/auth/public") ||
               uri.equals("/login") ||
               uri.equals("/register") ||
               uri.startsWith("/static/") ||
               uri.startsWith("/assets/") ||
               uri.startsWith("/favicon.ico") ||
               uri.startsWith("/api/auth/forgot-password") ||
               uri.startsWith("/api/auth/reset-password");
    }

    private boolean shouldRefreshToken(String token) {
        try {
            Date expiration = jwtUtil.getExpirationDateFromToken(token);
            Date now = new Date();
            long timeUntilExpiry = expiration.getTime() - now.getTime();
            
            // Refresh if token expires in less than 5 minutes
            return timeUntilExpiry < (5 * 60 * 1000); // 5 minutes in milliseconds
        } catch (Exception e) {
            return false;
        }
    }
}