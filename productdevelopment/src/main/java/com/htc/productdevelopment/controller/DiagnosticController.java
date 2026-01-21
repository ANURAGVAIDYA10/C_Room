package com.htc.productdevelopment.controller;

import com.htc.productdevelopment.model.User;
import com.htc.productdevelopment.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {
    
    private static final Logger logger = LoggerFactory.getLogger(DiagnosticController.class);
    
    private final UserRepository userRepository;
    
    public DiagnosticController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @GetMapping("/database-status")
    public ResponseEntity<?> checkDatabaseStatus() {
        logger.info("Checking database status");
        
        try {
            // Test database connection
            long userCount = userRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("databaseConnection", "Successful");
            response.put("userCount", userCount);
            
            logger.info("Database status check completed: {} users found", userCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking database status: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("databaseConnection", "Failed");
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        logger.info("Health check endpoint called");
        
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "UP");
            response.put("timestamp", System.currentTimeMillis());
            
            logger.info("Health check completed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error during health check: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}