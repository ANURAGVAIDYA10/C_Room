package com.htc.productdevelopment.service;

import com.htc.productdevelopment.model.Invitation;
import com.htc.productdevelopment.model.User;
import com.htc.productdevelopment.model.Organization;
import com.htc.productdevelopment.repository.InvitationRepository;
import com.htc.productdevelopment.service.UserService;
import com.htc.productdevelopment.repository.OrganizationRepository;



import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final UserService userService;
    private final JavaMailSender mailSender;
    private final OrganizationRepository organizationRepository;
    private final OrganizationService organizationService;

    private final String frontendUrl;
    private final String mailUsername;

    public InvitationService(
            InvitationRepository invitationRepository,
            UserService userService,
            JavaMailSender mailSender,
            OrganizationRepository organizationRepository,
            OrganizationService organizationService,
            @Value("${app.frontend.url}") String frontendUrl,
            @Value("${spring.mail.username}") String mailUsername
    ) {
        this.invitationRepository = invitationRepository;
        this.userService = userService;
        this.mailSender = mailSender;
        this.organizationRepository = organizationRepository;
        this.organizationService = organizationService;
        this.frontendUrl = frontendUrl;
        this.mailUsername = mailUsername;
    }

    // -------------------------------------------------------------
    // 1️⃣ Create Invitation
    // -------------------------------------------------------------
    public Invitation createInvitation(String email, String role, Long deptId, Long orgId, String invitedBy) {
        return createInvitation(email, role, deptId, orgId, invitedBy, false);
    }
    
    // -------------------------------------------------------------
    // 1️⃣ Create Invitation with Firebase option
    // -------------------------------------------------------------
    public Invitation createInvitation(String email, String role, Long deptId, Long orgId, String invitedBy, boolean useFirebase) {

        Invitation inv = new Invitation();
        inv.setEmail(email.toLowerCase().trim());
        inv.setRole(role);
        inv.setDepartmentId(deptId);
        inv.setOrganizationId(orgId);
        inv.setInvitedBy(invitedBy); // Set the invited by field
        inv.setToken(UUID.randomUUID().toString());
        inv.setCreatedAt(LocalDateTime.now());
        inv.setExpiresAt(LocalDateTime.now().plusHours(48)); // 48 hours expiration
        inv.setUsed(false);
        inv.setSent(false);

        Invitation savedInvitation = invitationRepository.save(inv);
        
        // Send invitation email
        if (useFirebase) {
            sendFirebaseInvitationEmail(savedInvitation);
        } else {
            sendInvitationEmail(savedInvitation);
        }
        
        return savedInvitation;
    }

    // -------------------------------------------------------------
    // 2️⃣ Send Firebase Invitation Email
    // -------------------------------------------------------------
    private void sendFirebaseInvitationEmail(Invitation inv) {
        try {
            // The actual Firebase email sending happens on the frontend
            // We just need to mark the invitation as sent in the database
            inv.setSent(true);
            invitationRepository.save(inv);
            
            System.out.println("Firebase invitation created for: " + inv.getEmail());
        } catch (Exception e) {
            // Log error but don't fail the invitation creation
            e.printStackTrace();
        }
    }

    // -------------------------------------------------------------
    // 2️⃣ Send Invitation Email
    // -------------------------------------------------------------
    private void sendInvitationEmail(Invitation inv) {
        try {
            String invitationLink = generateInvitationLink(inv);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailUsername); // Set the "from" address to the primary email from configuration
            message.setTo(inv.getEmail());
            message.setSubject("You've been invited to join our platform");
            message.setText(
                "Hello,\n\n" +
                "You have been invited to join our platform. Please click the link below to complete your registration:\n\n" +
                invitationLink + "\n\n" +
                "This link will expire in 48 hours.\n\n" +
                "Best regards,\n" +
                "The Team"
            );
            
            mailSender.send(message);
            
            // Mark as sent in database
            inv.setSent(true);
            invitationRepository.save(inv);
        } catch (Exception e) {
            // Log error but don't fail the invitation creation
            e.printStackTrace();
        }
    }

    

    // -------------------------------------------------------------
    // 3️⃣ Generate secure invitation link
    // -------------------------------------------------------------
    public String generateInvitationLink(Invitation inv) {
        try {
            return frontendUrl + "/complete-invitation?token=" + inv.getToken() + "&email=" + java.net.URLEncoder.encode(inv.getEmail(), "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {
            // Fallback if encoding fails
            return frontendUrl + "/complete-invitation?token=" + inv.getToken() + "&email=" + inv.getEmail();
        }
    }

    // -------------------------------------------------------------
    // 4️⃣ Verify token BEFORE showing Google/Microsoft login
    // -------------------------------------------------------------
    public Invitation verifyInvitation(String token, String email) throws Exception {

        Optional<Invitation> opt = invitationRepository.findByTokenAndEmail(token, email.toLowerCase().trim());

        if (opt.isEmpty()) {
            throw new Exception("Invalid or mismatched invitation link.");
        }

        Invitation inv = opt.get();

        if (inv.isUsed()) {
            throw new Exception("This link has already been used.");
        }

        if (LocalDateTime.now().isAfter(inv.getExpiresAt())) {
            throw new Exception("This invitation link has expired.");
        }

        return inv;
    }

    // -------------------------------------------------------------
    // NEW: Complete invitation with Firebase Email-Link authentication
    // -------------------------------------------------------------
    public User completeInvitation(String token, String firebaseEmail, String firebaseName) throws Exception {
        // 1. Find invitation by token
        Optional<Invitation> opt = invitationRepository.findByToken(token);
        if (opt.isEmpty()) {
            throw new Exception("Invalid invitation token.");
        }

        Invitation inv = opt.get();

        // 2. Validate invitation
        // Check if invitation is already used
        if (inv.isUsed()) {
            throw new Exception("This invitation has already been used.");
        }

        // Check if invitation is expired
        if (LocalDateTime.now().isAfter(inv.getExpiresAt())) {
            throw new Exception("This invitation has expired.");
        }

        // Check if email matches the invitation email
        if (!inv.getEmail().equalsIgnoreCase(firebaseEmail)) {
            throw new Exception("Email mismatch. The email used for authentication does not match the invitation.");
        }

        // 3. Check if user already exists in database by email
        Optional<User> existingUserInDb = userService.getUserByEmail(firebaseEmail);
        if (existingUserInDb.isPresent()) {
            throw new Exception("User already exists in database with this email.");
        }

        // 4. Create DB user using invitation data
        User created = userService.saveUserToDB(
                null, // UID will be set after Firebase authentication
                firebaseEmail,
                firebaseName,
                parseRole(inv.getRole())
        );

        // 5. Add department if present
        if (inv.getDepartmentId() != null) {
            created.setDepartment(userService.getDepartmentFromId(inv.getDepartmentId()));
        }

        // 6. Add organization if present
        if (inv.getOrganizationId() != null) {
            created.setOrganization(userService.getOrganizationFromId(inv.getOrganizationId()));
        } else if (inv.getRole() != null && inv.getRole().equals("SUPER_ADMIN")) {
            // If role is SUPER_ADMIN and no organization is provided, assign to "Cost Room"
            Organization costRoomOrg = organizationService.getOrCreateCostRoomOrganization();
            created.setOrganization(costRoomOrg);
        }

        // 7. Save updates
        userService.updateUserById(created.getId(), created);

        // 8. Mark invitation as used
        inv.setUsed(true);
        invitationRepository.save(inv);

        return created;
    }

    // -------------------------------------------------------------
    // 5️⃣ Complete Invitation (after Google/Microsoft login & setting password)
    // -------------------------------------------------------------
    public User completeInvitation(String token, String email, String fullName, String password) throws Exception {
        // For OAuth flow, we might not have a token, so we'll verify by email
        Invitation inv;
        if (token != null && !token.isEmpty() && !token.startsWith("oauth_")) {
            // Traditional token-based verification
            inv = verifyInvitation(token, email);
        } else {
            // OAuth flow - verify by email only
            inv = verifyInvitationByEmail(email);
        }

        // 1. Check if user already exists in database by email
        Optional<User> existingUserInDb = userService.getUserByEmail(email);
        if (existingUserInDb.isPresent()) {
            throw new Exception("User already exists in database with this email. Please sign in instead of creating a new account.");
        }
        
        // 2. Check if user already exists in Firebase (stub method)
        User firebaseUser;
        boolean userAlreadyExists = false;
        try {
            throw new UnsupportedOperationException("Firebase user creation is no longer supported. Use the invitation-based flow with JWT authentication instead.");
        } catch (Exception e) {
            // Re-throw the exception
            throw e;
        }
    }
    
    private User.Role parseRole(String role) {
        try { 
            return User.Role.valueOf(role.toUpperCase()); 
        }
        catch (Exception e) { 
            return User.Role.REQUESTER; 
        }
    }
    
    // -------------------------------------------------------------
    // Get invitation by token
    // -------------------------------------------------------------
    public Optional<Invitation> getInvitationByToken(String token) {
        return invitationRepository.findByToken(token);
    }
    
    // -------------------------------------------------------------
    // Verify invitation by email only (for OAuth flow)
    // -------------------------------------------------------------
    public Invitation verifyInvitationByEmail(String email) throws Exception {
        List<Invitation> invitations = invitationRepository.findByEmailAndUsedFalseOrderByCreatedAtDesc(email.toLowerCase().trim());
        
        if (invitations.isEmpty()) {
            throw new Exception("No pending invitation found for this email.");
        }
        
        // Use the most recent invitation if multiple exist
        Invitation inv = invitations.get(0);
        
        if (LocalDateTime.now().isAfter(inv.getExpiresAt())) {
            throw new Exception("This invitation has expired.");
        }
        
        return inv;
    }
    
    // -------------------------------------------------------------
    // Update invitation
    // -------------------------------------------------------------
    public Invitation updateInvitation(Invitation invitation) {
        return invitationRepository.save(invitation);
    }
    
    // -------------------------------------------------------------
    // Delete pending invitations by email
    // -------------------------------------------------------------
    public void deletePendingInvitationsByEmail(String email) {
        List<Invitation> pendingInvitations = invitationRepository.findByEmailAndUsedFalseOrderByCreatedAtDesc(email.toLowerCase().trim());
        if (!pendingInvitations.isEmpty()) {
            invitationRepository.deleteAll(pendingInvitations);
        }
    }
}