// src/config/permissions.ts

// Define permission types
export type Permission = 
  | 'CREATE_ISSUE'
  | 'VIEW_ISSUE'
  | 'EDIT_ISSUE'
  | 'DELETE_ISSUE'
  | 'CREATE_VENDOR'
  | 'VIEW_VENDOR'
  | 'EDIT_VENDOR'
  | 'DELETE_VENDOR'
  | 'CREATE_AGREEMENT'
  | 'VIEW_AGREEMENT'
  | 'EDIT_AGREEMENT'
  | 'DELETE_AGREEMENT'
  | 'SEND_INVITATIONS'
  | 'VIEW_USERS'
  | 'EDIT_USERS'
  | 'DELETE_USERS'
  | 'VIEW_REPORTS'
  | 'VIEW_DASHBOARD';

// Define role-based permissions
const rolePermissions: Record<string, Permission[]> = {
  'REQUESTER': [
    'CREATE_ISSUE',
    'VIEW_ISSUE',
    'CREATE_VENDOR',
    'VIEW_VENDOR',
    'CREATE_AGREEMENT',
    'VIEW_AGREEMENT'
  ],
  'APPROVER': [
    'CREATE_ISSUE',
    'VIEW_ISSUE',
    'EDIT_ISSUE',
    'VIEW_VENDOR',
    'VIEW_AGREEMENT'
  ],
  'ADMIN': [
    'CREATE_ISSUE',
    'VIEW_ISSUE',
    'EDIT_ISSUE',
    'DELETE_ISSUE',
    'CREATE_VENDOR',
    'VIEW_VENDOR',
    'EDIT_VENDOR',
    'DELETE_VENDOR',
    'CREATE_AGREEMENT',
    'VIEW_AGREEMENT',
    'EDIT_AGREEMENT',
    'DELETE_AGREEMENT',
    'SEND_INVITATIONS',
    'VIEW_USERS',
    'EDIT_USERS',
    'VIEW_REPORTS',
    'VIEW_DASHBOARD'
  ],
  'SUPER_ADMIN': [
    'CREATE_ISSUE',
    'VIEW_ISSUE',
    'EDIT_ISSUE',
    'DELETE_ISSUE',
    'CREATE_VENDOR',
    'VIEW_VENDOR',
    'EDIT_VENDOR',
    'DELETE_VENDOR',
    'CREATE_AGREEMENT',
    'VIEW_AGREEMENT',
    'EDIT_AGREEMENT',
    'DELETE_AGREEMENT',
    'SEND_INVITATIONS',
    'VIEW_USERS',
    'EDIT_USERS',
    'DELETE_USERS',
    'VIEW_REPORTS',
    'VIEW_DASHBOARD'
  ]
};

// Check if a role has a specific permission
export function hasPermission(role: string | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: string | null, permissions: Permission[]): boolean {
  if (!role) return false;
  const rolePerms = rolePermissions[role] || [];
  return permissions.some(permission => rolePerms.includes(permission));
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(role: string | null, permissions: Permission[]): boolean {
  if (!role) return false;
  const rolePerms = rolePermissions[role] || [];
  return permissions.every(permission => rolePerms.includes(permission));
}

// Get all permissions for a role
export function getRolePermissions(role: string): Permission[] {
  return rolePermissions[role] || [];
}