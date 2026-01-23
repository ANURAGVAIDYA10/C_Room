package com.htc.productdevelopment.config;

import com.htc.productdevelopment.interceptor.SessionInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for web-related settings.
 * This class configures CORS (Cross-Origin Resource Sharing) and session interceptors for the application.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);
    
    private final SessionInterceptor sessionInterceptor;
    private final UrlConfig urlConfig;
    
    @Autowired
    public WebConfig(SessionInterceptor sessionInterceptor, UrlConfig urlConfig) {
        this.sessionInterceptor = sessionInterceptor;
        this.urlConfig = urlConfig;
    }

    /**
     * Configures CORS mappings for API endpoints.
     * Allows cross-origin requests from the frontend application.
     * Uses centralized URL configuration to prevent CORS issues.
     * 
     * @param registry the CORS registry to configure
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        logger.info("=== CORS CONFIGURATION STARTING ===");
        logger.info("Configuring CORS for /api/** endpoints");
        logger.info("Allowed origins: {}", (Object[]) urlConfig.getAllowedOrigins());
        logger.info("Current thread: {}", Thread.currentThread().getName());
        
        registry.addMapping("/api/**")
            .allowedOrigins(urlConfig.getAllowedOrigins())
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Origin", "Accept", "X-Requested-With", "Content-Type", "Access-Control-Request-Method", "Access-Control-Request-Headers", "Authorization", "X-User-Activity")  // Explicitly list all headers including our custom one
            .exposedHeaders("Set-Cookie")  // Explicitly expose Set-Cookie header
            .allowCredentials(true);
            
        logger.info("CORS configuration completed for /api/**");
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        logger.info("Configuring SessionInterceptor");
        
        // Apply the session interceptor to all endpoints except public ones
        registry.addInterceptor(sessionInterceptor)
                .excludePathPatterns(
                    "/api/auth/login**",
                    "/api/auth/complete-invitation**",
                    "/api/invitations/verify**",  // Add invitation verification to exclusions
                    "/api/invitations/complete**", // Add invitation completion to exclusions
                    "/api/auth/exchange-token",
                    "/api/auth/exchange-token/**",  // Add these to exclude exchange-token from session validation
                    "/api/auth/refresh**",
                    "/api/auth/public**",
                    "/login**",
                    "/register**",
                    "/static/**",
                    "/assets/**",
                    "/favicon.ico",
                    "/api/auth/forgot-password**",
                    "/api/auth/reset-password**",
                    "/**/*.png",
                    "/**/*.jpg",
                    "/**/*.jpeg",
                    "/**/*.gif",
                    "/**/*.css",
                    "/**/*.js"
                );
                
        logger.info("SessionInterceptor configured with exclusions");
    }
}