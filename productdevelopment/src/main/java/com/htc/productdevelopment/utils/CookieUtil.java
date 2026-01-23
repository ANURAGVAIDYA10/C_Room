package com.htc.productdevelopment.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class CookieUtil {

    @Value("${app.environment:dev}")
    private String environment;

    // Create secure JWT cookie
    public ResponseCookie createJwtCookie(String jwtToken) {
        boolean isSecure = !"dev".equalsIgnoreCase(environment);
        String sameSite = "dev".equalsIgnoreCase(environment) ? "Lax" : "Strict"; // Lax for dev to allow cross-site requests
        
        return ResponseCookie.from("JWT_TOKEN", jwtToken)
                .httpOnly(true)           // Prevent XSS attacks
                .secure(isSecure)        // HTTPS only in production
                .sameSite(sameSite)      // Use Lax for dev, Strict for prod
                .maxAge(3600)             // 1 hour in seconds
                .path("/")                // Available for entire application
                .build();
    }

    // Create cookie to clear JWT token (logout)
    public ResponseCookie clearJwtCookie() {
        boolean isSecure = !"dev".equalsIgnoreCase(environment);
        String sameSite = "dev".equalsIgnoreCase(environment) ? "Lax" : "Strict"; // Lax for dev to allow cross-site requests
        
        return ResponseCookie.from("JWT_TOKEN", "")
                .httpOnly(true)
                .secure(isSecure)
                .sameSite(sameSite)
                .maxAge(0)                // Expire immediately
                .path("/")
                .build();
    }

    // Extract JWT token from cookie
    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}