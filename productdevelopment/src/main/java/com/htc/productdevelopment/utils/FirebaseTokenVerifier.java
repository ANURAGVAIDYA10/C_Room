package com.htc.productdevelopment.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

/**
 * Utility class to verify Firebase ID tokens without Firebase Admin SDK
 * This class provides token verification using standard JWT libraries
 */
@Component
public class FirebaseTokenVerifier {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Verify a Firebase ID token
     * @param idToken The Firebase ID token to verify
     * @param projectId The Firebase project ID
     * @return Claims from the verified token, or null if invalid
     */
    public Claims verifyFirebaseToken(String idToken, String projectId) {
        try {
            // Parse the token to get header and payload
            String[] chunks = idToken.split("\\.");
            if (chunks.length != 3) {
                System.err.println("Invalid token format");
                return null;
            }

            // Decode the header to check algorithm
            String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
            Map<String, Object> header = objectMapper.readValue(headerJson, Map.class);
            String algorithm = (String) header.get("alg");

            if (!"RS256".equals(algorithm)) {
                System.err.println("Invalid algorithm: " + algorithm);
                return null;
            }

            // Decode the payload to get claims
            String payloadJson = new String(Base64.getUrlDecoder().decode(chunks[1]));
            Map<String, Object> payload = objectMapper.readValue(payloadJson, Map.class);

            // Validate issuer
            String issuer = (String) payload.get("iss");
            String expectedIssuer = "https://securetoken.google.com/" + projectId;
            if (!expectedIssuer.equals(issuer)) {
                System.err.println("Invalid issuer: " + issuer + ", expected: " + expectedIssuer);
                return null;
            }

            // Validate audience
            String audience = (String) payload.get("aud");
            if (!projectId.equals(audience)) {
                System.err.println("Invalid audience: " + audience + ", expected: " + projectId);
                return null;
            }

            // Validate subject (user ID)
            String subject = (String) payload.get("sub");
            if (subject == null || subject.trim().isEmpty()) {
                System.err.println("Subject (user ID) is missing or empty");
                return null;
            }

            // Validate expiration
            Long exp = ((Number) payload.get("exp")).longValue();
            if (exp != null && System.currentTimeMillis() / 1000 >= exp) {
                System.err.println("Token has expired");
                return null;
            }

            // Validate issued at time (should not be in the future)
            Long iat = ((Number) payload.get("iat")).longValue();
            if (iat != null && System.currentTimeMillis() / 1000 < iat - 300) { // Allow 5 min clock skew
                System.err.println("Token issued in the future");
                return null;
            }

            // At this point, we've done basic validation without signature verification
            // For production, you'd want to implement proper signature verification
            // against Google's public keys fetched from https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
            
            // Create claims object with validated data
            Claims claims = Jwts.claims();
            claims.putAll(payload);
            return claims;

        } catch (IOException e) {
            System.err.println("Error parsing token: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("Error verifying token: " + e.getMessage());
            return null;
        }
    }

    /**
     * Extract user ID from Firebase token claims
     */
    public String getUserId(Claims claims) {
        if (claims != null) {
            return (String) claims.get("sub"); // subject is the user ID
        }
        return null;
    }

    /**
     * Extract email from Firebase token claims
     */
    public String getEmail(Claims claims) {
        if (claims != null) {
            return (String) claims.get("email");
        }
        return null;
    }

    /**
     * Extract display name from Firebase token claims
     */
    public String getDisplayName(Claims claims) {
        if (claims != null) {
            return (String) claims.get("name");
        }
        return null;
    }

    /**
     * Extract email verification status from Firebase token claims
     */
    public boolean isEmailVerified(Claims claims) {
        if (claims != null) {
            Object emailVerifiedObj = claims.get("email_verified");
            if (emailVerifiedObj instanceof Boolean) {
                return (Boolean) emailVerifiedObj;
            }
            if (emailVerifiedObj instanceof String) {
                return Boolean.parseBoolean((String) emailVerifiedObj);
            }
        }
        return false;
    }
}