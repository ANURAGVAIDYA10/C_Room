package com.htc.productdevelopment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SessionConfig {

    // Unified session timeout in minutes - used for both session and inactivity
    @Value("${app.session.timeout.minutes:1}")
    private int sessionTimeoutMinutes;

    public int getSessionTimeoutMinutes() {
        return sessionTimeoutMinutes;
    }

    public void setSessionTimeoutMinutes(int sessionTimeoutMinutes) {
        this.sessionTimeoutMinutes = sessionTimeoutMinutes;
    }

    // Get timeout in milliseconds (used for both session and inactivity)
    public long getSessionTimeoutMs() {
        return sessionTimeoutMinutes * 60 * 1000L;
    }

    // Alias for backward compatibility
    public long getInactivityTimeoutMs() {
        return getSessionTimeoutMs();
    }

    public int getInactivityTimeoutMinutes() {
        return getSessionTimeoutMinutes();
    }
}