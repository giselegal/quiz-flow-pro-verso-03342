/**
 * 🎯 CANONICAL USER TYPES
 * 
 * Tipos para usuários e autenticação.
 * 
 * @canonical
 */

// =============================================================================
// USER
// =============================================================================

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  metadata?: UserMetadata;
}

export type UserRole = 'admin' | 'editor' | 'viewer' | 'guest';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserMetadata {
  timezone?: string;
  language?: string;
  preferences?: UserPreferences;
  subscription?: UserSubscription;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  emailNotifications?: boolean;
  autoSave?: boolean;
  compactMode?: boolean;
}

export interface UserSubscription {
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  startedAt: string;
  expiresAt?: string;
  features?: string[];
}

// =============================================================================
// QUIZ USER (Anonymous)
// =============================================================================

export interface QuizUser {
  id: string;
  sessionId: string;
  name?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
}

// =============================================================================
// AUTH TYPES
// =============================================================================

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  session: AuthSession | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSignUpData extends AuthCredentials {
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface AuthResetPasswordData {
  email: string;
}

export interface AuthUpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// =============================================================================
// AUTH CONTEXT
// =============================================================================

export interface AuthContextValue {
  state: AuthState;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (data: AuthSignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (data: AuthResetPasswordData) => Promise<void>;
  updatePassword: (data: AuthUpdatePasswordData) => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

// =============================================================================
// PERMISSIONS
// =============================================================================

export type Permission =
  | 'funnel:create'
  | 'funnel:read'
  | 'funnel:update'
  | 'funnel:delete'
  | 'funnel:publish'
  | 'template:create'
  | 'template:read'
  | 'template:update'
  | 'template:delete'
  | 'analytics:read'
  | 'analytics:export'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  | 'settings:read'
  | 'settings:update'
  | 'admin:access';

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      'funnel:create', 'funnel:read', 'funnel:update', 'funnel:delete', 'funnel:publish',
      'template:create', 'template:read', 'template:update', 'template:delete',
      'analytics:read', 'analytics:export',
      'user:read', 'user:update', 'user:delete',
      'settings:read', 'settings:update',
      'admin:access',
    ],
  },
  {
    role: 'editor',
    permissions: [
      'funnel:create', 'funnel:read', 'funnel:update', 'funnel:publish',
      'template:read',
      'analytics:read',
      'user:read', 'user:update',
      'settings:read',
    ],
  },
  {
    role: 'viewer',
    permissions: [
      'funnel:read',
      'template:read',
      'analytics:read',
      'user:read',
      'settings:read',
    ],
  },
  {
    role: 'guest',
    permissions: [
      'funnel:read',
      'template:read',
    ],
  },
];

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isUser(value: unknown): value is User {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'role' in value
  );
}

export function isQuizUser(value: unknown): value is QuizUser {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'sessionId' in value
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  const rolePerms = ROLE_PERMISSIONS.find(rp => rp.role === user.role);
  return rolePerms?.permissions.includes(permission) ?? false;
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(user, p));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(user, p));
}
