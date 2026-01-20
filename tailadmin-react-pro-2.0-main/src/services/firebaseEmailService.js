// Firebase Email Invitation Service
import { sendSignInLinkToEmail, auth } from '../firebase'; // Updated import
import api from './api';

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
    
    // Configure email action settings for Firebase
    const actionCodeSettings = {
      // URL where user will land after clicking the email link
      url: `${window.location.origin}/complete-invitation?token=${invitationToken}&email=${encodeURIComponent(email)}`,
      
      // Whether to handle the code in the app (false = redirect to website)
      handleCodeInApp: false,
      
      // iOS and Android settings (optional)
      iOS: {
        bundleId: 'com.yourcompany.yourapp'
      },
      android: {
        packageName: 'com.yourcompany.yourapp',
        installApp: true,
        minimumVersion: '12'
      },
      
      // Dynamic link settings
      dynamicLinkDomain: 'yourapp.page.link'
    };

    // Send the email link using Firebase
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    
    console.log('Firebase email sent successfully to:', email);
    
    // Mark invitation as sent in backend
    try {
      await api.post('/api/invitations/mark-sent', { 
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
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send invitation email'
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