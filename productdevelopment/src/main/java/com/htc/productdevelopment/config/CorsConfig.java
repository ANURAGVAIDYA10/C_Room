package com.htc.productdevelopment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Allow specific origins
        config.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://192.168.1.115:5173"
        ));
        
        // Allow all methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow all headers including our custom header
        config.setAllowedHeaders(Arrays.asList(
            "Origin", 
            "Accept", 
            "X-Requested-With", 
            "Content-Type", 
            "Access-Control-Request-Method", 
            "Access-Control-Request-Headers", 
            "Authorization", 
            "X-User-Activity"
        ));
        
        // Expose headers
        config.setExposedHeaders(Arrays.asList("Set-Cookie"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        
        return new CorsFilter(source);
    }
}