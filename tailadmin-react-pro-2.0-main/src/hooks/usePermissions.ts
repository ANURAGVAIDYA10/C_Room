// src/hooks/usePermissions.ts
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '../config/permissions';

export function usePermissions() {
  const { userRole, userData, refreshUserData } = useAuth();

  // Check if user has a specific permission
  const hasPermissionCheck = useMemo(() => (permission: Permission) => 
    hasPermission(userRole, permission), [userRole]);

  // Check if user has any of the specified permissions
  const hasAnyPermissionCheck = useMemo(() => (permissions: Permission[]) => 
    hasAnyPermission(userRole, permissions), [userRole]);

  // Check if user has all of the specified permissions
  const hasAllPermissionsCheck = useMemo(() => (permissions: Permission[]) => 
    hasAllPermissions(userRole, permissions), [userRole]);

  // Role checking functions
  const hasRole = useMemo(() => (role: string) => userRole === role, [userRole]);
  const hasAnyRole = useMemo(() => (roles: string[]) => roles.includes(userRole || ''), [userRole]);

  // Specific permission checks
  const canCreateIssue = hasPermissionCheck('CREATE_ISSUE');
  const canViewIssue = hasPermissionCheck('VIEW_ISSUE');
  const canEditIssue = hasPermissionCheck('EDIT_ISSUE');
  const canDeleteIssue = hasPermissionCheck('DELETE_ISSUE');
  const canCreateVendor = hasPermissionCheck('CREATE_VENDOR');
  const canViewVendor = hasPermissionCheck('VIEW_VENDOR');
  const canEditVendor = hasPermissionCheck('EDIT_VENDOR');
  const canDeleteVendor = hasPermissionCheck('DELETE_VENDOR');
  const canCreateAgreement = hasPermissionCheck('CREATE_AGREEMENT');
  const canViewAgreement = hasPermissionCheck('VIEW_AGREEMENT');
  const canEditAgreement = hasPermissionCheck('EDIT_AGREEMENT');
  const canDeleteAgreement = hasPermissionCheck('DELETE_AGREEMENT');
  const canSendInvitations = hasPermissionCheck('SEND_INVITATIONS');
  const canViewUsers = hasPermissionCheck('VIEW_USERS');
  const canEditUsers = hasPermissionCheck('EDIT_USERS');
  const canDeleteUsers = hasPermissionCheck('DELETE_USERS');
  const canViewReports = hasPermissionCheck('VIEW_REPORTS');
  const canViewDashboard = hasPermissionCheck('VIEW_DASHBOARD');

  return {
    userRole,
    userData,
    refreshUserData,
    hasPermission: hasPermissionCheck,
    hasAnyPermission: hasAnyPermissionCheck,
    hasAllPermissions: hasAllPermissionsCheck,
    hasRole,
    hasAnyRole,
    canCreateIssue,
    canViewIssue,
    canEditIssue,
    canDeleteIssue,
    canCreateVendor,
    canViewVendor,
    canEditVendor,
    canDeleteVendor,
    canCreateAgreement,
    canViewAgreement,
    canEditAgreement,
    canDeleteAgreement,
    canSendInvitations,
    canViewUsers,
    canEditUsers,
    canDeleteUsers,
    canViewReports,
    canViewDashboard,
  };
}