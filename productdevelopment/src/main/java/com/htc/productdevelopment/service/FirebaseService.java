package com.htc.productdevelopment.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class FirebaseService {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseService.class);

    @Value("${firebase.service-account-key-path:classpath:firebase-service-account.json}")
    private String serviceAccountKeyPath;

    @Value("${firebase.project.id:costroom-c8200}")
    private String projectId;

    @PostConstruct
    public void initializeFirebase() {
        try {
            InputStream serviceAccount;
            
            if (serviceAccountKeyPath.startsWith("classpath:")) {
                String path = serviceAccountKeyPath.substring("classpath:".length());
                ClassPathResource resource = new ClassPathResource(path);
                if (!resource.exists()) {
                    logger.warn("Firebase service account key file not found: {}. Skipping Firebase initialization.", path);
                    return;
                }
                serviceAccount = resource.getInputStream();
            } else {
                File file = new File(serviceAccountKeyPath);
                if (!file.exists()) {
                    logger.warn("Firebase service account key file not found: {}. Skipping Firebase initialization.", serviceAccountKeyPath);
                    return;
                }
                serviceAccount = new FileInputStream(serviceAccountKeyPath);
            }

            // Create credentials first to potentially extract project ID
            com.google.auth.oauth2.GoogleCredentials credentials = com.google.auth.oauth2.GoogleCredentials.fromStream(serviceAccount);
            
            // If project ID is not set in properties, try to extract it from the service account file
            String effectiveProjectId = projectId;
            if (effectiveProjectId == null || effectiveProjectId.trim().isEmpty()) {
                // We could extract project ID from the credentials here if needed
                effectiveProjectId = "costroom-c8200"; // fallback
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId(effectiveProjectId)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase Admin SDK initialized successfully with project ID: {}", effectiveProjectId);
            } else {
                logger.info("Firebase Admin SDK already initialized");
            }
        } catch (IOException e) {
            logger.error("Error initializing Firebase Admin SDK: {}", e.getMessage(), e);
            // Don't throw exception - allow the application to continue even if Firebase isn't configured
        } catch (Exception e) {
            logger.error("Unexpected error during Firebase initialization: {}", e.getMessage(), e);
            // Don't throw exception - allow the application to continue even if Firebase isn't configured
        }
    }

    /**
     * Delete a user from Firebase Auth by UID
     * @param uid The Firebase UID of the user to delete
     * @throws FirebaseAuthException if there's an error communicating with Firebase
     */
    public void deleteUserFromFirebase(String uid) throws FirebaseAuthException {
        logger.info("Attempting to delete user from Firebase: {}", uid);
        
        // Check if Firebase app is initialized
        if (FirebaseApp.getApps().isEmpty()) {
            logger.warn("Firebase Admin SDK not initialized. Cannot delete user from Firebase: {}", uid);
            return;
        }
        
        try {
            // Delete the user from Firebase Authentication
            FirebaseAuth.getInstance().deleteUser(uid);
            logger.info("Successfully deleted user from Firebase: {}", uid);
        } catch (FirebaseAuthException e) {
            logger.error("Error deleting user from Firebase: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Check if a user exists in Firebase Auth by UID
     * @param uid The Firebase UID to check
     * @return true if user exists, false otherwise
     */
    public boolean userExistsInFirebase(String uid) {
        try {
            UserRecord userRecord = FirebaseAuth.getInstance().getUser(uid);
            return userRecord != null;
        } catch (FirebaseAuthException e) {
            logger.warn("User does not exist in Firebase or error checking user: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get user details from Firebase Auth by UID
     * @param uid The Firebase UID of the user
     * @return UserRecord if user exists, null otherwise
     */
    public UserRecord getUserFromFirebase(String uid) {
        try {
            return FirebaseAuth.getInstance().getUser(uid);
        } catch (FirebaseAuthException e) {
            logger.warn("Error getting user from Firebase: {}", e.getMessage());
            return null;
        }
    }
}