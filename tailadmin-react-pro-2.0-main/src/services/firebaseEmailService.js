// Firebase Email Invitation Service
import { sendSignInLinkToEmail, auth } from '../firebase'; // Updated import
import { invitationApi } from './api';

/**
 * Send invitation email using Firebase Email Link Authentication
 * @param {string} email - Recipient email address
 * @param {string} invitationToken - Unique invitation token
 * @param {Object} invitationData - Additional invitation data
 * @returns {Promise<Object>} Success status and message
 */
export const sendFirebaseInvitationEmail = async (email, invitationToken, invitationData = {}) => {
  try {
    console.log('Sending Firebase invitation email to:', email);
    
    // Validate inputs
    if (!email || !invitationToken) {
      throw new Error('Email and invitation token are required');
    }
    
    // Validate email format
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    // Get the current origin
    const currentOrigin = window.location.origin;
    console.log('Current origin:', currentOrigin);
    
    // Configure email action settings for Firebase
    const actionCodeSettings = {
      // URL where user will land after clicking the email link
      url: `${currentOrigin}/complete-invitation?token=${invitationToken}&email=${encodeURIComponent(email)}`,
      
      // Whether to handle the code in the app (true = handle in app, false = redirect to website)
      handleCodeInApp: true, // Must be true for email link authentication
      
      // Additional settings
      // iOS and Android settings can be added here if needed
    };
    
    console.log('Action code settings:', actionCodeSettings);

    // Send the email link using Firebase
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    console.log('Firebase email sent successfully to:', email);
    
    // Mark invitation as sent in backend
    try {
      await invitationApi.markSent({ 
        email,
        token: invitationToken 
      });
      console.log('Backend marked invitation as sent');
    } catch (backendError) {
      console.warn('Failed to mark invitation as sent in backend:', backendError);
      // Don't fail the whole process if backend update fails
    }
    
    return {
      success: true,
      message: 'Invitation email sent successfully via Firebase'
    };
    
  } catch (error) {
    console.error('Error sending Firebase invitation email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send invitation email';
    if (error.code) {
      switch (error.code) {
        case 'auth/argument-error':
          errorMessage = 'Invalid Firebase configuration. Please ensure:\n1. The domain (localhost) is authorized in Firebase Console\n2. Email link authentication is enabled\n3. The URL format is correct';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'An error occurred while sending the email.';
      }
    } else {
      errorMessage = error.message || 'An unknown error occurred.';
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code,
      message: errorMessage
    };
  }
};

/**
 * Verify if email link is for sign-in
 * @param {string} email - User's email
 * @returns {boolean} Whether email link is for sign-in
 */
export const isSignInWithEmailLink = (emailLink) => {
  return auth.isSignInWithEmailLink(emailLink);
};

/**
 * Complete sign-in with email link
 * @param {string} email - User's email
 * @param {string} emailLink - The email link clicked by user
 * @returns {Promise<Object>} Sign-in result
 */
export const signInWithEmailLink = async (email, emailLink) => {
  try {
    const result = await auth.signInWithEmailLink(email, emailLink);
    return {
      success: true,
      user: result.user,
      credential: result.credential
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  sendFirebaseInvitationEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
};