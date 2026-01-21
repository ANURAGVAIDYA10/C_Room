import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { invitationApi, departmentApi, organizationApi, authApi } from "../services/api";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { sendFirebaseInvitationEmail } from "../services/firebaseEmailService";

interface Department {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
}

export default function SendInvitation() {
  const navigate = useNavigate();
  const { userRole, isSuperAdmin, isAdmin } = useAuth();
  const { userDepartmentId, userOrganizationId } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    role: "REQUESTER",
    departmentId: "", // Add departmentId to form data
    organizationId: "" // Only for SUPER_ADMIN
  });
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [emailValidation, setEmailValidation] = useState<{isValid: boolean, message: string, checking: boolean} | null>(null); // Add email validation state
  
  // Create stable versions of the permission checks
  const stableIsAdmin = useCallback(() => isAdmin, []);
  const stableIsSuperAdmin = useCallback(() => isSuperAdmin, []);
  const canSendInvite = useCallback(() => isSuperAdmin || isAdmin, [isSuperAdmin, isAdmin]);
  const isSuperAdminMemo = useCallback(() => isSuperAdmin, [isSuperAdmin]);
  
  // Ref for debouncing email validation
  const emailDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user has permission to access this page
  useEffect(() => {
    if (!canSendInvite()) {
      navigate("/");
    }
  }, [canSendInvite, navigate]);

  // Fetch departments and organizations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptData = await departmentApi.getAllDepartments();
        setDepartments(deptData);
        
        // Auto-select the current user's department for Admin users
        if (userDepartmentId && !isSuperAdmin) {
          setFormData(prev => ({
            ...prev,
            departmentId: userDepartmentId.toString()
          }));
        }
        
        if (isSuperAdmin) {
          const orgData = await organizationApi.getAllOrganizations();
          setOrganizations(orgData);
          
          // Auto-select the current user's organization for SUPER_ADMIN
          if (userOrganizationId) {
            setFormData(prev => ({
              ...prev,
              organizationId: userOrganizationId.toString()
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({type: "error", text: "Failed to load data: " + (error as Error).message});
      }
    };

    if (canSendInvite()) {
      fetchData();
    }
  }, [canSendInvite, isSuperAdmin, userDepartmentId, userOrganizationId]);

  // Function to validate email
  const validateEmail = async (email: string) => {
    // Clear any existing timeout
    if (emailDebounceRef.current) {
      clearTimeout(emailDebounceRef.current);
    }
    
    // If email is empty, clear validation
    if (!email) {
      setEmailValidation(null);
      return;
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidation({
        isValid: false,
        message: "Please enter a valid email address format",
        checking: false
      });
      return;
    }
    
    // Set checking state
    setEmailValidation({
      isValid: false,
      message: "Checking email...",
      checking: true
    });
    
    // Debounce the API call
    emailDebounceRef.current = setTimeout(async () => {
      try {
        const result = await authApi.checkUserExists(email);
        
        if (result.existsInFirebase) {
          setEmailValidation({
            isValid: false,
            message: "This email address is already registered in our system. Please use a different email or sign in.",
            checking: false
          });
        } else if (result.existsInDatabase) {
          setEmailValidation({
            isValid: false,
            message: "This email address is already registered in our system. Please use a different email or sign in.",
            checking: false
          });
        } else if (!result.isDomainLikelyValid) {
          setEmailValidation({
            isValid: false,
            message: "This email domain appears to be invalid or uncommon. Please check the email address or use a common email provider like Gmail, Yahoo, etc.",
            checking: false
          });
        } else {
          setEmailValidation({
            isValid: true,
            message: "This email address format is valid. A confirmation email will be sent to verify the address.",
            checking: false
          });
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setEmailValidation({
          isValid: false,
          message: "Error checking email validity. Please try again.",
          checking: false
        });
      }
    }, 500); // 500ms debounce
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate email when email field changes
    if (name === "email") {
      validateEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    // Check if email is valid before submitting
    if (emailValidation && !emailValidation.isValid) {
      setMessage({type: "error", text: "Please fix the email validation errors before submitting."});
      setLoading(false);
      return;
    }
    
    try {
      // Mark explicit user intent
      const { markUserIntent } = await import('../utils/UserIntent');
      markUserIntent();

      // Prepare invitation data for pending user creation
      const invitationData: {
        email: string;
        role: string;
        departmentId: number | null;
        organizationId?: number;
      } = {
        email: formData.email,
        role: formData.role,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null
      };

      // Add organizationId if provided
      if (formData.organizationId) {
        invitationData.organizationId = parseInt(formData.organizationId);
      } else if (!isSuperAdmin && userOrganizationId) {
        // For non-SUPER_ADMIN users, add organizationId if available
        invitationData.organizationId = userOrganizationId;
      }

      // Create the invitation record and get the token
      const response = await invitationApi.createInvitation(invitationData);

      // Send the invitation email using Firebase from the frontend
      const result = await sendFirebaseInvitationEmail(
        formData.email,
        response.data.token, // Use the actual invitation token from backend
        invitationData
      );

      if (result.success) {
        // Store email locally for verification when the link is clicked
        window.localStorage.setItem('emailForSignIn', formData.email);
        // Show success toast
        setToastMessage("Invitation sent successfully! The user will receive an email notification with instructions to complete their registration.");
        setToastType('success');
        setShowToast(true);

        // Reset form (but keep department selection for Admin users)
        setFormData(prev => ({
          ...prev,
          email: "",
          role: "REQUESTER",
          departmentId: isSuperAdmin ? "" : (userDepartmentId ? userDepartmentId.toString() : ""),
          organizationId: isSuperAdmin ? (userOrganizationId ? userOrganizationId.toString() : "") : ""
        }));

        // Clear email validation
        setEmailValidation(null);
      } else {
        throw new Error(result.message || 'Failed to send invitation email');
      }
      
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      // Show error toast
      let errorMessage = "Failed to send invitation";
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = "Invalid email address. Please check the email and try again.";
            break;
          case 'auth/unauthorized-continue-uri':
            errorMessage = "Unauthorized domain. Please contact administrator to authorize this domain in Firebase Console.";
            break;
          case 'auth/invalid-action-code':
            errorMessage = "Invalid action code. Please try again.";
            break;
          default:
            errorMessage = error.message || "Unknown Firebase error";
        }
      } else {
        errorMessage = error.message || "Unknown error occurred";
      }
      
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Only show the page to users with SEND_INVITATIONS permission
  if (!canSendInvite()) {
    return null;
  }

  return (
    <div>
      <PageMeta
        title="Invite User - Admin Dashboard"
        description="Invite new users to join the platform"
      />
      <PageBreadcrumb pageTitle="Invite User" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px]">
          <h3 className="mb-6 text-center font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Invite New User
          </h3>
          {userRole === "SUPER_ADMIN" && (
            <div className="mb-4 rounded-md bg-yellow-100 p-2 text-center text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              SUPER ADMIN: You can assign users.
              </div>
          )}
          
          <div className="mb-6 rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
            <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-100">Important Notice</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Please ensure the email address is correct. A Firebase-powered confirmation email will be sent to verify the address.
              Common email providers (Gmail, Yahoo, Outlook, etc.) are recommended.
            </p>
          </div>
          
          {showToast && (
            <div className={`mb-4 rounded-lg p-4 ${toastType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
              {toastMessage}
              <button 
                onClick={() => setShowToast(false)}
                className="float-right text-lg font-bold"
              >
                &times;
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full rounded-lg border bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900 ${
                  emailValidation 
                    ? emailValidation.isValid 
                      ? "border-green-500" 
                      : "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter email address"
              />
              {emailValidation && (
                <div className={`mt-1 text-sm ${
                  emailValidation.isValid 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {emailValidation.checking ? (
                    <span>Checking email...</span>
                  ) : (
                    <span>{emailValidation.message}</span>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role <span className="text-red-600">*</span>
                 {/* {userRole === "SUPER_ADMIN" && <span className="text-xs text-yellow-600 dark:text-yellow-400">(SUPER_ADMIN)</span>} */}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900"
              >
                <option value="REQUESTER">Requester</option>
                <option value="APPROVER">Approver</option>
                <option value="ADMIN">Admin</option>
                {userRole === "SUPER_ADMIN" && <option value="SUPER_ADMIN">Super Admin</option>}
              </select>
            </div>

            {/* Department Selection */}
            <div>
              <label htmlFor="departmentId" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department <span className="text-red-600">*</span>
              </label>
              <select
                id="departmentId"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Organization Selection (only for SUPER_ADMIN) */}
            {userRole === "SUPER_ADMIN" && (
              <div>
                <label htmlFor="organizationId" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organization <span className="text-red-600">*</span>
                </label>
                <select
                  id="organizationId"
                  name="organizationId"
                  value={formData.organizationId}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900"
                >
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? "Sending..." : "Send Invitation"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}