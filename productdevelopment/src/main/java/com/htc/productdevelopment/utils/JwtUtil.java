package com.htc.productdevelopment.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private SecretKey secretKey;
    
    // Token expiration time (1 hour)
    private static final long JWT_TOKEN_VALIDITY = 60 * 60 * 1000; // 1 hour in milliseconds

    public JwtUtil(@Value("${jwt.secret:MySuperSecretKeyForHS512AlgorithmThatIsAtLeast512BitsLongAndSecure}") String jwtSecret) {
        // For HS512, we need at least 512-bit (64-byte) key
        // If the provided key is not long enough, pad it or generate a secure key
        byte[] keyBytes = jwtSecret.getBytes();
        if (keyBytes.length < 64) { // 512 bits = 64 bytes
            // Pad the key to make it at least 64 bytes
            byte[] paddedKey = new byte[64];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            // Fill the rest with a pattern to ensure it's at least 64 bytes
            for (int i = keyBytes.length; i < 64; i++) {
                paddedKey[i] = (byte) (keyBytes[i % keyBytes.length] ^ i);
            }
            this.secretKey = Keys.hmacShaKeyFor(paddedKey);
        } else {
            this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        }
    }

    // Retrieve username from JWT token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // Retrieve expiration date from JWT token
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // For retrieving any information from token we will need the secret key
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Check if the token has expired
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // Generate token for user
    public String generateToken(String username, String role, String provider, String firebaseUid) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("provider", provider);
        claims.put("firebaseUid", firebaseUid);
        return createToken(claims, username);
    }

    // While creating the token -
    // 1. Define claims of the token (who are you?)
    // 2. Build the token
    // 3. Sign it and compress if desired
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    // Validate token
    public Boolean validateToken(String token, String username) {
        final String tokenUsername = getUsernameFromToken(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }
}