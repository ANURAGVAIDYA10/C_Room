package com.htc.productdevelopment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SessionConfig {

    // Session timeout in minutes - default is 1 minute
    @Value("${app.session.timeout.minutes:1}")
    private int sessionTimeoutMinutes;

    // Inactivity timeout in minutes - default is 1 minute
    @Value("${app.session.inactivity.timeout.minutes:1}")
    private int inactivityTimeoutMinutes;

    public int getSessionTimeoutMinutes() {
        return sessionTimeoutMinutes;
    }

    public void setSessionTimeoutMinutes(int sessionTimeoutMinutes) {
        this.sessionTimeoutMinutes = sessionTimeoutMinutes;
    }

    public int getInactivityTimeoutMinutes() {
        return inactivityTimeoutMinutes;
    }

    public void setInactivityTimeoutMinutes(int inactivityTimeoutMinutes) {
        this.inactivityTimeoutMinutes = inactivityTimeoutMinutes;
    }

    // Get timeout in milliseconds
    public long getSessionTimeoutMs() {
        return sessionTimeoutMinutes * 60 * 1000L;
    }

    // Get inactivity timeout in milliseconds
    public long getInactivityTimeoutMs() {
        return inactivityTimeoutMinutes * 60 * 1000L;
    }
}