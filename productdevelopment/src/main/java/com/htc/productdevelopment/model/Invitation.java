package com.htc.productdevelopment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String role;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "organization_id")
    private Long organizationId;
    
    @Column(name = "invited_by")
    private Long invitedBy;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private boolean sent = false;
    
    @Column(name = "attempt_count")
    private Integer attemptCount;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "max_attempts")
    private Integer maxAttempts;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status = InvitationStatus.PENDING;
    
    @Column(name = "user_created", nullable = false)
    private Boolean userCreated = false;
    
    // Explicit getters for boolean fields
    public boolean isSent() {
        return sent;
    }
    
    // Explicit setters for boolean fields
    public void setSent(boolean sent) {
        this.sent = sent;
    }
    
    public Boolean getUserCreated() {
        return userCreated;
    }
    
    public void setUserCreated(Boolean userCreated) {
        this.userCreated = userCreated;
    }
}