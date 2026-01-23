package com.htc.productdevelopment.controller;

import com.htc.productdevelopment.dto.CreateUserRequest;
import com.htc.productdevelopment.model.User;
import com.htc.productdevelopment.model.Department;
import com.htc.productdevelopment.repository.UserRepository;
import com.htc.productdevelopment.service.UserService;

import com.htc.productdevelopment.service.InvitationService;
import com.htc.productdevelopment.service.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Date;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.htc.productdevelopment.utils.FirebaseTokenVerifier;
import com.htc.productdevelopment.utils.JwtUtil;
import com.htc.productdevelopment.utils.CookieUtil;
import com.htc.productdevelopment.utils.SessionManager;
import com.htc.productdevelopment.config.SessionConfig;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;

/**
 * Controller class for handling authentication-related API requests
 * This controller manages user authentication, registration, and role management
 */
@RestController
@RequestMapping("/api/auth")

public class AuthController {
    
    // Logger for tracking controller operations
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    // Services for handling user and authentication operations
    private final UserService userService;
    private final FirebaseTokenVerifier firebaseTokenVerifier;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final SessionManager sessionManager;
    private final UserRepository userRepository;
    private final InvitationService invitationService;
    private final OrganizationService organizationService;
    
    @Value("${firebase.project.id}")
    private String firebaseProjectId;
    
    /**
     * Constructor to initialize dependencies
     * @param userService Service for user operations
     * @param firebaseSyncService Service for Firebase synchronization
     * @param userRepository Repository for database operations
     * @param invitationService Service for invitation operations
     * @param organizationService Service for organization operations
     */
    private final SessionConfig sessionConfig;
    
    public AuthController(UserService userService, FirebaseTokenVerifier firebaseTokenVerifier, JwtUtil jwtUtil, CookieUtil cookieUtil, SessionManager sessionManager, SessionConfig sessionConfig, UserRepository userRepository, InvitationService invitationService, OrganizationService organizationService) {
        this.userService = userService;
        this.firebaseTokenVerifier = firebaseTokenVerifier;
        this.jwtUtil = jwtUtil;
        this.cookieUtil = cookieUtil;
        this.sessionManager = sessionManager;
        this.sessionConfig = sessionConfig;
        this.userRepository = userRepository;
        this.invitationService = invitationService;
        this.organizationService = organizationService;
    }
    
    /**
     * Test endpoint for CORS debugging
     * @return Simple response to test CORS configuration
     */
    @GetMapping("/cors-test")
    public ResponseEntity<?> corsTest(@RequestHeader(value = "X-User-Activity", required = false) String userActivity) {
        logger.info("CORS test endpoint called with X-User-Activity header: {}", userActivity);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS test successful");
        response.put("userActivity", userActivity);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Complete invitation with Firebase Email-Link authentication
     * @param authorizationHeader Firebase ID token in Authorization header
     * @param requestBody Request body containing invitation token
     * @return The created user
     */
    @PostMapping("/complete-invitation")
    public ResponseEntity<?> completeInvitation(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> requestBody,
            HttpServletResponse response) {
        logger.info("Received request to complete invitation with Firebase Email-Link authentication");
        
        try {
            // Extract Firebase ID token from Authorization header
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                logger.warn("Invalid Authorization header");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid Authorization header. Bearer token is required.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String idToken = authorizationHeader.substring(7); // Remove "Bearer " prefix
            
            // Verify Firebase ID token using our custom verifier
            Claims claims = firebaseTokenVerifier.verifyFirebaseToken(idToken, firebaseProjectId);
            if (claims == null) {
                logger.error("Firebase token verification failed");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Firebase token verification failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            String firebaseEmail = firebaseTokenVerifier.getEmail(claims);
            String firebaseName = firebaseTokenVerifier.getDisplayName(claims);
            String firebaseUid = firebaseTokenVerifier.getUserId(claims);
            
            // Extract invitation token from request body
            String invitationToken = requestBody.get("token");
            if (invitationToken == null || invitationToken.isEmpty()) {
                logger.warn("Invitation token is required");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invitation token is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Complete invitation using invitation service
            User user = invitationService.completeInvitation(invitationToken, firebaseEmail, firebaseName != null ? firebaseName : "");
            
            // Set Firebase UID for the user if not already set
            if (user.getUid() == null || user.getUid().isEmpty()) {
                user.setUid(firebaseUid);
                user = userService.updateUserById(user.getId(), user);
            }
            
            // Generate JWT token for session management
            String jwtToken = jwtUtil.generateToken(firebaseEmail, user.getRole().name(), "firebase", firebaseUid);
            
            // Create and set the JWT cookie
            var jwtCookie = cookieUtil.createJwtCookie(jwtToken);
            response.addHeader("Set-Cookie", jwtCookie.toString());
            
            // Create session in session manager
            Date tokenExpiry = new Date(System.currentTimeMillis() + sessionConfig.getSessionTimeoutMs()); // Use configured timeout
            sessionManager.createSession(firebaseEmail, jwtToken, tokenExpiry);
            
            logger.info("Invitation completed successfully for user: {}", firebaseEmail);
            
            // Return user data without sensitive information
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", user);
            responseData.put("message", "Invitation completed successfully");
            responseData.put("tokenValid", true);
            
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            logger.error("Error completing invitation: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Get user role by UID
     * @param uid User ID
     * @return User role
     */
    @GetMapping("/role/{uid}")
    public ResponseEntity<?> getUserRole(@PathVariable String uid) {
        logger.info("Received request to get role for user: {}", uid);
        
        try {
            // Get user by UID
            Optional<User> userOpt = userService.getUserByUid(uid);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("role", user.getRole().name());
                
                // Create a simplified user object for serialization
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("uid", user.getUid());
                userData.put("email", user.getEmail());
                userData.put("name", user.getName());
                userData.put("avatar", user.getAvatar());
                userData.put("active", user.getActive());
                userData.put("createdAt", user.getCreatedAt());
                userData.put("updatedAt", user.getUpdatedAt());
                userData.put("role", user.getRole().name());
                
                // Include department if present
                if (user.getDepartment() != null) {
                    Map<String, Object> deptData = new HashMap<>();
                    deptData.put("id", user.getDepartment().getId());
                    deptData.put("name", user.getDepartment().getName());
                    userData.put("department", deptData);
                    responseData.put("department", deptData);
                }
                
                // Include organization if present
                if (user.getOrganization() != null) {
                    Map<String, Object> orgData = new HashMap<>();
                    orgData.put("id", user.getOrganization().getId());
                    orgData.put("name", user.getOrganization().getName());
                    userData.put("organization", orgData);
                    responseData.put("organization", orgData);
                }
                
                responseData.put("user", userData);
                
                logger.info("Role retrieved successfully for user: {}", uid);
                return ResponseEntity.ok(responseData);
            } else {
                logger.warn("User not found: {}", uid);
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "User not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (Exception e) {
            logger.error("Error getting role for user: {}", uid, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Runtime Exception: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Check if user is admin
     * @param uid User ID
     * @return Admin status
     */
    @GetMapping("/isAdmin/{uid}")
    public ResponseEntity<?> isAdmin(@PathVariable String uid) {
        logger.info("Received request to check if user is admin: {}", uid);
        
        try {
            boolean isAdmin = userService.isAdmin(uid);
            logger.info("Admin check completed for user: {}, result: {}", uid, isAdmin);
            return ResponseEntity.ok(Map.of("isAdmin", isAdmin));
        } catch (Exception e) {
            logger.error("Error checking admin status for user: {}", uid, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Check if user is regular user
     * @param uid User ID
     * @return User status
     */
    @GetMapping("/isUser/{uid}")
    public ResponseEntity<?> isUser(@PathVariable String uid) {
        logger.info("Received request to check if user is regular user: {}", uid);
        
        try {
            boolean isUser = userService.isRequester(uid);
            logger.info("User check completed for user: {}, result: {}", uid, isUser);
            return ResponseEntity.ok(Map.of("isUser", isUser));
        } catch (Exception e) {
            logger.error("Error checking user status for user: {}", uid, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Update user role
     * @param uid User ID
     * @param roleData Role data
     * @return Updated user
     */
    @PutMapping("/role/{uid}")
    public ResponseEntity<?> updateUserRole(@PathVariable String uid, @RequestBody Map<String, String> roleData) {
        logger.info("Received request to update role for user: {}", uid);
        
        try {
            String roleStr = roleData.get("role");
            
            // Validate required field
            if (roleStr == null || roleStr.isEmpty()) {
                logger.warn("Role update failed: Role is required");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Role is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Convert role string to enum
            User.Role role = User.Role.valueOf(roleStr.toUpperCase());
            
            // Update user role
            User user = userService.updateUserRole(uid, role);
            logger.info("User role updated: {} to {}", uid, role);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid role value: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid role value");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Error updating user role: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Update user avatar
     * @param uid User ID
     * @param avatarData Avatar data
     * @return Updated user
     */
    @PutMapping("/avatar/{uid}")
    public ResponseEntity<?> updateUserAvatar(@PathVariable String uid, @RequestBody Map<String, String> avatarData) {
        logger.info("Received request to update avatar for user: {}", uid);
        
        try {
            String avatar = avatarData.get("avatar");
            
            // Update user avatar
            User user = userService.updateUserAvatar(uid, avatar);
            logger.info("User avatar updated: {}", uid);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error updating user avatar: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Disable a user by setting their active status to false
     * @param uid User ID
     * @return Updated user
     */
    @PutMapping("/users/{uid}/disable")
    public ResponseEntity<?> disableUser(@PathVariable String uid) {
        logger.info("Received request to disable user: {}", uid);
        
        try {
            // Disable user
            User user = userService.disableUser(uid);
            logger.info("User disabled successfully: {}", uid);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error disabling user: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error disabling user: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Enable a user by setting their active status to true
     * @param uid User ID
     * @return Updated user
     */
    @PutMapping("/users/{uid}/enable")
    public ResponseEntity<?> enableUser(@PathVariable String uid) {
        logger.info("Received request to enable user: {}", uid);
        
        try {
            // Enable user
            User user = userService.enableUser(uid);
            logger.info("User enabled successfully: {}", uid);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error enabling user: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error enabling user: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Delete a user by UID
     * @param uid User ID
     * @return Success message
     */
    @DeleteMapping("/users/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable String uid) {
        logger.info("Received request to delete user: {}", uid);
        
        try {
            // Delete user
            userService.deleteUser(uid);
            logger.info("User deleted successfully: {}", uid);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting user: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error deleting user: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Check if user exists in Firebase or database by email
     * @param email User email
     * @return Existence status
     */
    @GetMapping("/check-user-exists")
    public ResponseEntity<?> checkUserExists(@RequestParam String email) {
        logger.info("Received request to check if user exists with email: {}", email);
        
        try {
            // Validate email parameter
            if (email == null || email.isEmpty()) {
                logger.warn("Check user exists failed: Email is required");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Email is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Basic email format validation
            if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                logger.warn("Check user exists failed: Invalid email format for email: {}", email);
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid email format");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if user exists in database only
            boolean existsInDatabase = userRepository.existsByEmail(email);
            
            // Check if email domain is likely valid
            boolean isDomainLikelyValid = true; // For now, we'll assume it's valid
            
            Map<String, Object> response = new HashMap<>();
            response.put("existsInFirebase", false); // We no longer check Firebase directly
            response.put("existsInDatabase", existsInDatabase);
            response.put("isDomainLikelyValid", isDomainLikelyValid);
            response.put("email", email);
            
            logger.info("User existence check completed for email: {}. Exists in Database: {}, Domain Likely Valid: {}", 
                       email, existsInDatabase, isDomainLikelyValid);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking if user exists with email: {}", email, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Runtime Exception: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Auto-sync user data between Firebase and database
     * @param uid User ID
     * @return Sync result
     */
    @PostMapping("/auto-sync")
    public ResponseEntity<?> autoSyncUser(@RequestParam String uid) {
        logger.info("Received request to auto-sync user with UID: {}", uid);
        
        try {
            // Validate UID parameter
            if (uid == null || uid.isEmpty()) {
                logger.warn("Auto-sync failed: UID is required");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "UID is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Get user from database by UID
            Optional<User> userOpt = userService.getUserByUid(uid);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Since we're using database as source of truth, check if user exists in database
                boolean existsInDatabase = userRepository.existsByUid(uid);
                
                if (!existsInDatabase) {
                    logger.warn("User with UID {} does not exist in Firebase", uid);
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "User does not exist in Firebase");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
                
                // Return user data
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("message", "User synced successfully");
                responseData.put("user", user);
                
                logger.info("User auto-sync completed successfully for UID: {}", uid);
                return ResponseEntity.ok(responseData);
            } else {
                // If user doesn't exist in database, create them with default role
                logger.info("User with UID {} not found in database, creating new user with default role", uid);
                try {
                    // We can't fetch user details from Firebase anymore, so we'll create a placeholder
                    // In a real scenario, you'd have a different way to get user details
                    // For now, we'll assume the user exists in Firebase and create in DB if not present
                    Optional<User> existingUser = userService.getUserByUid(uid);
                    if (!existingUser.isPresent()) {
                        // Create a default user since we can't fetch from Firebase
                        User newUser = new User();
                        newUser.setUid(uid);
                        newUser.setEmail("unknown@example.com"); // Placeholder
                        newUser.setName("Unknown User"); // Placeholder
                        newUser.setRole(User.Role.REQUESTER); // Default role
                        newUser.setActive(true);
                        User savedUser = userRepository.save(newUser);
                        
                        Map<String, Object> responseData = new HashMap<>();
                        responseData.put("message", "User created and synced successfully");
                        responseData.put("user", savedUser);
                        
                        logger.info("User created and synced successfully for UID: {}", uid);
                        return ResponseEntity.ok(responseData);
                    } else {
                        User existingUserObj = existingUser.get();
                        Map<String, Object> responseData = new HashMap<>();
                        responseData.put("message", "User already exists and synced successfully");
                        responseData.put("user", existingUserObj);
                        
                        logger.info("User already exists and synced successfully for UID: {}", uid);
                        return ResponseEntity.ok(responseData);
                    }
                } catch (Exception createException) {
                    logger.error("Error creating user with UID: {}", uid, createException);
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Failed to create user: " + createException.getMessage());
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }
        } catch (Exception e) {
            logger.error("Error auto-syncing user with UID: {}", uid, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Runtime Exception: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Exchange Firebase ID token for JWT session cookie
     * @param request HTTP request
     * @param response HTTP response
     * @param tokenRequest Contains Firebase ID token
     * @return Response with JWT cookie set
     */
    @PostMapping("/exchange-token")
    public ResponseEntity<?> exchangeFirebaseToken(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestBody Map<String, String> tokenRequest) {
        
        logger.info("=== EXCHANGE-TOKEN ENDPOINT CALLED (Enterprise-Grade Email Lookup) ===");
        logger.info("Request from IP: {}", request.getRemoteAddr());
        logger.info("User-Agent: {}", request.getHeader("User-Agent"));
        
        try {
            String firebaseIdToken = tokenRequest.get("token");
            
            if (firebaseIdToken == null || firebaseIdToken.isEmpty()) {
                logger.warn("Firebase token is required");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Firebase token is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Verifying Firebase token...");
            
            // Verify Firebase ID token using our custom verifier
            Claims claims = firebaseTokenVerifier.verifyFirebaseToken(firebaseIdToken, firebaseProjectId);
            if (claims == null) {
                logger.error("Firebase token verification failed");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Firebase token verification failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            String firebaseEmail = firebaseTokenVerifier.getEmail(claims);
            String firebaseName = firebaseTokenVerifier.getDisplayName(claims);
            String firebaseUid = firebaseTokenVerifier.getUserId(claims);
            boolean isEmailVerified = firebaseTokenVerifier.isEmailVerified(claims);
            
            logger.info("Firebase token verified successfully");
            logger.info("Email: {}", firebaseEmail);
            logger.info("Name: {}", firebaseName);
            logger.info("UID: {}", firebaseUid);
            logger.info("Email Verified: {}", isEmailVerified);
            
            if (firebaseEmail == null || firebaseUid == null) {
                logger.error("Firebase token missing required claims");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid Firebase token: missing required claims");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Check if user exists in database by EMAIL (enterprise-grade approach)
            logger.info("Checking if user exists in database by email...");
            Optional<User> existingUserOpt = userRepository.findByEmail(firebaseEmail);
            
            logger.info("User exists by email: {}", existingUserOpt.isPresent());
            
            User user;
            
            if (existingUserOpt.isPresent()) {
                logger.info("Found user by email, updating Firebase UID if needed...");
                // User exists by email, update Firebase UID if it's missing or different
                user = existingUserOpt.get();
                
                // Update Firebase UID if it's missing or different
                boolean updated = false;
                if (user.getUid() == null || !user.getUid().equals(firebaseUid)) {
                    user.setUid(firebaseUid);
                    updated = true;
                }
                
                // Update user info if changed
                if (firebaseName != null && !firebaseName.equals(user.getName())) {
                    user.setName(firebaseName);
                    updated = true;
                }
                
                if (!isEmailVerified && user.getActive()) {
                    user.setActive(isEmailVerified);
                    updated = true;
                }
                
                if (updated) {
                    user = userService.updateUserById(user.getId(), user);
                    logger.info("User updated successfully with Firebase UID: {}", firebaseUid);
                }
            } else {
                logger.info("User doesn't exist in database, but this should only happen through invitation flow");
                logger.info("Rejecting authentication - user must complete invitation first");
                
                // Don't automatically create users - they must go through invitation flow
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "User account not found. Please complete your invitation first.");
                errorResponse.put("requires_invitation", "true");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }
            
            // Generate JWT token for session management
            logger.info("Generating JWT token...");
            String jwtToken = jwtUtil.generateToken(firebaseEmail, user.getRole().name(), "firebase", firebaseUid);
            
            // Log token expiration for debugging
            Date jwtExpiry = jwtUtil.getExpirationDateFromToken(jwtToken);
            logger.info("JWT Token generated - Expires at: {} | Current time: {}", jwtExpiry, new Date());
            
            // Create and set the JWT cookie
            logger.info("Setting JWT cookie...");
            var jwtCookie = cookieUtil.createJwtCookie(jwtToken);
            response.addHeader("Set-Cookie", jwtCookie.toString());
            
            // Create session in session manager
            Date tokenExpiry = new Date(System.currentTimeMillis() + sessionConfig.getSessionTimeoutMs()); // Use configured timeout
            sessionManager.createSession(firebaseEmail, jwtToken, tokenExpiry);
            
            logger.info("Firebase token exchanged successfully using email-based lookup for user: {}", firebaseEmail);
            
            // Return user data
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", user);
            responseData.put("message", "Token exchanged successfully");
            responseData.put("tokenValid", true);
            
            logger.info("=== EXCHANGE-TOKEN COMPLETED SUCCESSFULLY (Enterprise-Grade Flow) ===");
            return ResponseEntity.ok(responseData);
            
        } catch (Exception e) {
            logger.error("=== EXCHANGE-TOKEN FAILED (Enterprise-Grade Flow) ===", e);
            logger.error("Error exchanging Firebase token: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error exchanging Firebase token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Logout endpoint to clear JWT session
     * @param request HTTP request
     * @param response HTTP response
     * @return Success response
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        logger.info("Received logout request");
        
        try {
            // Get JWT token from cookie
            String jwtToken = cookieUtil.getJwtFromCookies(request);
            
            if (jwtToken != null && !jwtToken.isEmpty()) {
                // Get username from token to clean up session
                String username = jwtUtil.getUsernameFromToken(jwtToken);
                if (username != null) {
                    // Remove session using the email (same key used for creation)
                    sessionManager.removeSession(username);
                }
            }
            
            // Clear the JWT cookie
            var clearCookie = cookieUtil.clearJwtCookie();
            response.addHeader("Set-Cookie", clearCookie.toString());
            
            logger.info("Logout successful");
            
            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "Logged out successfully");
            
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            logger.error("Error during logout: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error during logout: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get current user info based on JWT cookie
     * @param request HTTP request
     * @return Current user information
     */
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        logger.info("Received request to get current user info");
        
        try {
            // Get JWT token from cookie
            String jwtToken = cookieUtil.getJwtFromCookies(request);
            
            if (jwtToken == null || jwtToken.isEmpty()) {
                logger.warn("No JWT token found in cookies");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "No authentication token found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Validate JWT token
            String email = jwtUtil.getUsernameFromToken(jwtToken);
            if (email == null || !jwtUtil.validateToken(jwtToken, email)) {
                logger.error("Invalid or expired JWT token");
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid or expired token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Get user from database by email
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                logger.error("User not found in database: {}", email);
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "User not found in database");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            User user = userOpt.get();
            
            // Create response with user data
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("role", user.getRole().name());
            
            // Create a simplified user object for serialization
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("uid", user.getUid());
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("avatar", user.getAvatar());
            userData.put("active", user.getActive());
            userData.put("createdAt", user.getCreatedAt());
            userData.put("updatedAt", user.getUpdatedAt());
            userData.put("role", user.getRole().name());
            
            // Include department if present
            if (user.getDepartment() != null) {
                Map<String, Object> deptData = new HashMap<>();
                deptData.put("id", user.getDepartment().getId());
                deptData.put("name", user.getDepartment().getName());
                userData.put("department", deptData);
                responseData.put("department", deptData);
            }
            
            // Include organization if present
            if (user.getOrganization() != null) {
                Map<String, Object> orgData = new HashMap<>();
                orgData.put("id", user.getOrganization().getId());
                orgData.put("name", user.getOrganization().getName());
                userData.put("organization", orgData);
                responseData.put("organization", orgData);
            }
            
            responseData.put("user", userData);
            
            logger.info("Current user info retrieved successfully for: {}", email);
            return ResponseEntity.ok(responseData);
            
        } catch (Exception e) {
            logger.error("Error getting current user info: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error getting current user info: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Test endpoint to verify authentication flow
     * @return Simple success response
     */
    @GetMapping("/test-auth-flow")
    public ResponseEntity<?> testAuthFlow(HttpServletRequest request) {
        logger.info("=== TEST AUTH FLOW ENDPOINT CALLED ===");
        
        try {
            // Get JWT token from cookie
            String jwtToken = cookieUtil.getJwtFromCookies(request);
            logger.info("JWT Token present: {}", jwtToken != null);
            
            if (jwtToken != null) {
                // Validate JWT token
                String email = jwtUtil.getUsernameFromToken(jwtToken);
                logger.info("JWT Email: {}", email);
                logger.info("JWT Valid: {}", jwtUtil.validateToken(jwtToken, email));
                
                if (email != null && jwtUtil.validateToken(jwtToken, email)) {
                    // Get user from database
                    Optional<User> userOpt = userRepository.findByEmail(email);
                    logger.info("User found in DB: {}", userOpt.isPresent());
                    
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        Map<String, Object> response = new HashMap<>();
                        response.put("status", "SUCCESS");
                        response.put("message", "Authentication working correctly");
                        response.put("userEmail", user.getEmail());
                        response.put("userRole", user.getRole());
                        response.put("userId", user.getId());
                        logger.info("=== TEST AUTH FLOW SUCCESS ===");
                        return ResponseEntity.ok(response);
                    }
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "NO_SESSION");
            response.put("message", "No valid session found");
            logger.info("=== TEST AUTH FLOW - NO SESSION ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("=== TEST AUTH FLOW FAILED ===", e);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "ERROR");
            response.put("message", "Test failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}