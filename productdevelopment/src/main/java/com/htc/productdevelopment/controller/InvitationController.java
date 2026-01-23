package com.htc.productdevelopment.controller;

import com.htc.productdevelopment.model.Invitation;
import com.htc.productdevelopment.model.User;
import com.htc.productdevelopment.service.InvitationService;
import com.htc.productdevelopment.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "http://localhost:5173")
public class InvitationController {

    private static final Logger logger = LoggerFactory.getLogger(InvitationController.class);

    private final InvitationService invitationService;
    private final UserService userService;

    @Autowired
    public InvitationController(InvitationService invitationService, UserService userService) {
        this.invitationService = invitationService;
        this.userService = userService;
    }

    // -------------------------------------------------------------------------
    // 1️⃣ Create invitation (Admin / Super Admin)
    // -------------------------------------------------------------------------
    @PostMapping("/create")
    public ResponseEntity<?> createInvitation(@RequestBody Map<String, Object> body) {

        try {
            String email = (String) body.get("email");
            String role = (String) body.get("role");
            Long departmentId = body.get("departmentId") != null
                    ? Long.parseLong(body.get("departmentId").toString()) : null;

            // Only Super Admin provides organization
            Long organizationId = body.get("organizationId") != null
                    ? Long.parseLong(body.get("organizationId").toString()) : null;
            
            // For now, we'll use a placeholder for invitedBy
            // In a real implementation, you would get this from the authenticated user
            Long invitedBy = null; // Placeholder - should be replaced with actual user ID

            Invitation inv = invitationService.createInvitation(
                    email,
                    role,
                    departmentId,
                    organizationId,
                    invitedBy
            );

            String invitationLink = invitationService.generateInvitationLink(inv);

            return ResponseEntity.ok(Map.of(
                    "message", "Invitation created successfully",
                    "invitationLink", invitationLink,
                    "token", inv.getToken()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // -------------------------------------------------------------------------
    // 1️⃣ Create Firebase-based invitation (Admin / Super Admin)
    // -------------------------------------------------------------------------
    @PostMapping("/create-firebase")
    public ResponseEntity<?> createFirebaseInvitation(@RequestBody Map<String, Object> body) {
        try {
            String email = (String) body.get("email");
            String role = (String) body.get("role");
            Long departmentId = body.get("departmentId") != null
                    ? Long.parseLong(body.get("departmentId").toString()) : null;

            // Only Super Admin provides organization
            Long organizationId = body.get("organizationId") != null
                    ? Long.parseLong(body.get("organizationId").toString()) : null;
            
            // For now, we'll use a placeholder for invitedBy
            // In a real implementation, you would get this from the authenticated user
            Long invitedBy = null; // Placeholder - should be replaced with actual user ID

            // Create invitation with Firebase email sending
            Invitation inv = invitationService.createInvitation(
                    email,
                    role,
                    departmentId,
                    organizationId,
                    invitedBy,
                    true // Use Firebase for email sending
            );

            String invitationLink = invitationService.generateInvitationLink(inv);

            return ResponseEntity.ok(Map.of(
                    "message", "Firebase invitation created successfully",
                    "invitationLink", invitationLink,
                    "token", inv.getToken()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    // -------------------------------------------------------------------------
    // 3️⃣ Validate invitation link before showing Google/Microsoft login
    // -------------------------------------------------------------------------
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(
            @RequestParam String token,
            @RequestParam String email
    ) {
        try {
            logger.info("Verifying invitation token: {} for email: {}", token, email);
            
            // Validate input parameters
            if (token == null || token.trim().isEmpty()) {
                logger.warn("Invalid token parameter");
                return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "error", "Invitation token is required"
                ));
            }
            
            if (email == null || email.trim().isEmpty()) {
                logger.warn("Invalid email parameter");
                return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "error", "Email is required"
                ));
            }
            
            Invitation inv = invitationService.verifyInvitation(token, email);
            
            logger.info("Invitation verified successfully. Role: {}, Dept: {}, Org: {}", 
                       inv.getRole(), inv.getDepartmentId(), inv.getOrganizationId());

            // Build response map safely handling null values
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("email", inv.getEmail() != null ? inv.getEmail() : "");
            response.put("role", inv.getRole() != null ? inv.getRole() : "REQUESTER");
            response.put("status", inv.getStatus() != null ? inv.getStatus().name() : "PENDING");
            
            // Handle potentially null departmentId
            if (inv.getDepartmentId() != null) {
                response.put("departmentId", inv.getDepartmentId());
            } else {
                response.put("departmentId", null);
            }
            
            // Handle potentially null organizationId
            if (inv.getOrganizationId() != null) {
                response.put("organizationId", inv.getOrganizationId());
            } else {
                response.put("organizationId", null);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error verifying invitation token: {} for email: {}", token, email, e);
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "error", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred"
            ));
        }
    }

    // -------------------------------------------------------------------------
    // 4️⃣ Complete invitation (after Google/Microsoft login & setting password)
    // -------------------------------------------------------------------------
    @PostMapping("/complete")
    public ResponseEntity<?> completeInvitation(@RequestBody Map<String, Object> body) {
        String email = null;
        try {
            logger.info("=== INVITATION COMPLETION ENDPOINT CALLED ===");
            
            String token = (String) body.get("token");
            email = (String) body.get("email");
            String fullName = (String) body.get("fullName");
            String password = (String) body.get("password");
            String firebaseUid = (String) body.get("firebaseUid"); // New parameter
            
            logger.info("Completing invitation for email: {} with Firebase UID: {}", email, firebaseUid);

            User created = invitationService.completeInvitation(
                    token,
                    email,
                    fullName,
                    password,
                    firebaseUid // Pass Firebase UID
            );
            
            logger.info("Invitation completed successfully for user: {} with ID: {}", created.getEmail(), created.getId());

            return ResponseEntity.ok(Map.of(
                    "message", "User account created successfully",
                    "uid", created.getUid(),
                    "email", created.getEmail()
            ));

        } catch (Exception e) {
            logger.error("Error completing invitation for email: " + email, e);
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
    
    // -------------------------------------------------------------------------
    // 5️⃣ Mark invitation as sent
    // -------------------------------------------------------------------------
    @PostMapping("/mark-sent")
    public ResponseEntity<?> markAsSent(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String token = body.get("token");
            
            if (email == null || token == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Email and token are required"
                ));
            }
            
            Invitation invitation = invitationService.getInvitationByToken(token)
                .orElseThrow(() -> new Exception("Invitation not found"));
            
            if (!invitation.getEmail().equalsIgnoreCase(email)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Email does not match invitation"
                ));
            }
            
            // Mark as sent
            invitation.setSent(true);
            invitationService.updateInvitation(invitation);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Invitation marked as sent successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
    
    // -------------------------------------------------------------------------
    // 6️⃣ Verify invitation by email only (for OAuth flow)
    // -------------------------------------------------------------------------
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyByEmail(@RequestParam String email) {
        try {
            Invitation inv = invitationService.verifyInvitationByEmail(email);
            
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", inv.getEmail(),
                    "role", inv.getRole(),
                    "departmentId", inv.getDepartmentId(),
                    "organizationId", inv.getOrganizationId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "error", e.getMessage()
            ));
        }
    }
}