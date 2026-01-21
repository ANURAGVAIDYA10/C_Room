package com.htc.productdevelopment.controller;

import com.htc.productdevelopment.model.Notification;
import com.htc.productdevelopment.repository.NotificationRepository;
import com.htc.productdevelopment.service.NotificationService;
import com.htc.productdevelopment.service.UserService;
import com.htc.productdevelopment.model.User;
import com.htc.productdevelopment.utils.JwtUtil;
import com.htc.productdevelopment.utils.CookieUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    private User getCurrentUserFromToken() {
        try {
            // Get the current HTTP request
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attributes.getRequest();
            
            // Get JWT token from cookie
            String jwtToken = cookieUtil.getJwtFromCookies(request);
            
            if (jwtToken != null && !jwtToken.isEmpty()) {
                // Validate JWT token and get email
                String email = jwtUtil.getUsernameFromToken(jwtToken);
                if (email != null && jwtUtil.validateToken(jwtToken, email)) {
                    // Look up user in database
                    return userService.getUserByEmail(email).orElse(null);
                }
            }
        } catch (Exception e) {
            // Log the error but don't throw it
            e.printStackTrace();
        }
        
        return null;
    }
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private CookieUtil cookieUtil;
    
    /**
     * Get all notifications (visible to everyone)
     */
    @GetMapping
    public ResponseEntity<?> getNotifications() {
        try {
            User currentUser = getCurrentUserFromToken();
            if (currentUser != null) {
                List<Notification> notifications = notificationService.getNotificationsForUser(
                    currentUser.getId(),
                    currentUser.getRole() != null ? currentUser.getRole().name() : null,
                    currentUser.getDepartmentId(),
                    currentUser.getOrganizationId()
                );
                return ResponseEntity.ok(notifications);
            } else {
                List<Notification> notifications = notificationService.getAllNotifications();
                return ResponseEntity.ok(notifications);
            }
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error fetching notifications: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Get unread notifications count (visible to everyone)
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadNotificationsCount() {
        try {
            User currentUser = getCurrentUserFromToken();
            int unreadCount;
            if (currentUser != null) {
                unreadCount = notificationService.countUnreadNotificationsForUser(
                    currentUser.getId(),
                    currentUser.getRole() != null ? currentUser.getRole().name() : null,
                    currentUser.getDepartmentId(),
                    currentUser.getOrganizationId()
                );
            } else {
                unreadCount = notificationService.countAllUnreadNotifications();
            }

            Map<String, Integer> response = new HashMap<>();
            response.put("unreadCount", unreadCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error fetching unread count: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Mark a notification as read
     */
    @PutMapping("/{id}/mark-as-read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            if (notification == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error marking notification as read: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Mark all notifications as read (visible to everyone)
     */
    @PutMapping("/mark-all-as-read")
    public ResponseEntity<?> markAllAsRead() {
        try {
            User currentUser = getCurrentUserFromToken();
            if (currentUser != null) {
                notificationService.markAllAsRead(
                    currentUser.getId(),
                    currentUser.getRole() != null ? currentUser.getRole().name() : null,
                    currentUser.getDepartmentId(),
                    currentUser.getOrganizationId()
                );
            } else {
                notificationService.markAllAsRead();
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error marking all notifications as read: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error deleting notification: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Delete all notifications (visible to everyone)
     */
    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllNotifications() {
        try {
            notificationService.deleteAllNotifications();
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error deleting all notifications: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Test endpoint to create a notification
     */
    @PostMapping("/test")
    public ResponseEntity<?> createTestNotification(@RequestBody Map<String, String> payload) {
        try {
            Notification notification = new Notification();
            notification.setTitle(payload.getOrDefault("title", "Test Notification"));
            notification.setMessage(payload.getOrDefault("message", "This is a test notification"));
            notification.setIsRead(false);
            
            // Save the notification using the service
            Notification saved = notificationService.createGlobalNotification(notification);
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace(); // Print the full stack trace for debugging
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error creating test notification: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Test endpoint to get all notifications (no authentication required)
     */
    @GetMapping("/test/all")
    public ResponseEntity<?> getAllNotificationsTest() {
        try {
            List<Notification> notifications = notificationRepository.findAll();
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            e.printStackTrace(); // Print the full stack trace for debugging
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error fetching notifications: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Simple health check endpoint
     */
    @GetMapping("/test/health")
    public ResponseEntity<?> healthCheck() {
        try {
            // Try to execute a simple query
            long count = notificationRepository.count();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "OK");
            response.put("notificationCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Print the full stack trace for debugging
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Health check failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}