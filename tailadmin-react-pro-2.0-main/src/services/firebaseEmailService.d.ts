// Type declarations for Firebase Email Service
declare module '../services/firebaseEmailService' {
  interface EmailResult {
    success: boolean;
    message?: string;
    error?: string;
  }

  export function sendFirebaseInvitationEmail(
    email: string,
    invitationToken: string,
    invitationData?: Record<string, any>
  ): Promise<EmailResult>;

  export function isSignInWithEmailLink(emailLink: string): boolean;

  export function signInWithEmailLink(
    email: string,
    emailLink: string
  ): Promise<{
    success: boolean;
    user?: any;
    credential?: any;
    error?: string;
  }>;

  const firebaseEmailService: {
    sendFirebaseInvitationEmail: typeof sendFirebaseInvitationEmail;
    isSignInWithEmailLink: typeof isSignInWithEmailLink;
    signInWithEmailLink: typeof signInWithEmailLink;
  };

  export default firebaseEmailService;
}