package com.htc.productdevelopment.config;

import com.htc.productdevelopment.interceptor.SessionInterceptor;
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
        registry.addMapping("/api/**")
            .allowedOrigins(urlConfig.getAllowedOrigins())
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Apply the session interceptor to all endpoints except public ones
        registry.addInterceptor(sessionInterceptor)
                .excludePathPatterns(
                    "/api/auth/login**",
                    "/api/auth/complete-invitation**",
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
    }
}