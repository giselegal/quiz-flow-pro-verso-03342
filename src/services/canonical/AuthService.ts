/**
 * AUTH SERVICE - Sistema Canônico de Autenticação e Autorização
 * 
 * Consolida: SupabaseAuthService, SessionManager, PermissionManager, UserProfileService (4 serviços)
 * 
 * Funcionalidades:
 * - Autenticação via Supabase (signIn, signUp, signOut)
 * - Gerenciamento de sessões (getSession, refreshSession, validateSession)
 * - Sistema de permissões RBAC (roles: owner, editor, viewer, anonymous)
 * - Perfil de usuário (get, update, avatar upload)
 * - Listeners de mudanças de auth state
 * - Cache de permissões e perfis
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { supabase } from '@/lib/supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type UserRole = 'owner' | 'editor' | 'viewer' | 'anonymous';
export type PermissionAction = 'view' | 'edit' | 'delete' | 'publish' | 'share' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  avatarUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
  website?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
    emailDigest: boolean;
  };
  metadata?: Record<string, any>;
  updatedAt: Date;
}

export interface Permission {
  resourceType: 'funnel' | 'template' | 'result' | 'analytics';
  resourceId: string;
  userId: string;
  role: UserRole;
  actions: PermissionAction[];
  grantedBy?: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
  metadata?: Record<string, any>;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface UpdateProfileParams {
  displayName?: string;
  bio?: string;
  company?: string;
  website?: string;
  avatarUrl?: string;
  preferences?: Partial<UserProfile['preferences']>;
  metadata?: Record<string, any>;
}

export type AuthStateChangeCallback = (event: AuthChangeEvent, session: Session | null) => void;

// ============================================================================
// AUTH SERVICE
// ============================================================================

export class AuthService extends BaseCanonicalService {
  private static instance: AuthService;
  
  private currentUser: AuthUser | null = null;
  private currentSession: AuthSession | null = null;
  private profileCache: Map<string, UserProfile> = new Map();
  private permissionCache: Map<string, Permission[]> = new Map();
  private authListeners: Set<AuthStateChangeCallback> = new Set();
  
  private readonly PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly PERMISSION_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly SESSION_REFRESH_THRESHOLD = 5 * 60 * 1000; // Refresh 5 min before expiry
  
  private sessionRefreshTimer?: NodeJS.Timeout;
  private authSubscription?: { unsubscribe: () => void };

  private constructor() {
    super('AuthService', '1.0.0', { debug: false });
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing AuthService...');
    
    // Setup auth state listener
    this.setupAuthListener();
    
    // Try to restore existing session
    await this.restoreSession();
    
    // Setup session refresh timer
    this.setupSessionRefresh();
    
    this.log('AuthService initialized successfully');
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing AuthService...');
    
    // Clear timers
    if (this.sessionRefreshTimer) {
      clearInterval(this.sessionRefreshTimer);
    }
    
    // Unsubscribe from auth changes
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
    // Clear caches
    this.profileCache.clear();
    this.permissionCache.clear();
    this.authListeners.clear();
    
    // Clear current state
    this.currentUser = null;
    this.currentSession = null;
  }

  async healthCheck(): Promise<boolean> {
    if (this.state !== 'ready') return false;
    
    try {
      const { error } = await supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  /**
   * Sign up a new user
   */
  async signUp(params: SignUpParams): Promise<ServiceResult<AuthUser>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            display_name: params.displayName,
            ...params.metadata
          }
        }
      });

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: new Error('User creation failed')
        };
      }

      const authUser = this.mapSupabaseUser(data.user);

      // Create user profile
      await this.createUserProfile(authUser, params.displayName);

      if (this.options.debug) {
        this.log('User signed up:', authUser.email);
      }

      return { success: true, data: authUser };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Sign up failed')
      };
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(params: SignInParams): Promise<ServiceResult<AuthSession>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password
      });

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      if (!data.session || !data.user) {
        return {
          success: false,
          error: new Error('Authentication failed')
        };
      }

      const authUser = this.mapSupabaseUser(data.user);
      const authSession = this.mapSupabaseSession(data.session, authUser);

      this.currentUser = authUser;
      this.currentSession = authSession;

      // Update last login
      await this.updateLastLogin(authUser.id);

      if (this.options.debug) {
        this.log('User signed in:', authUser.email);
      }

      return { success: true, data: authSession };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Sign in failed')
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<ServiceResult<void>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      // Clear local state
      this.currentUser = null;
      this.currentSession = null;
      this.profileCache.clear();
      this.permissionCache.clear();

      if (this.options.debug) {
        this.log('User signed out');
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Sign out failed')
      };
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): ServiceResult<AuthUser | null> {
    return { success: true, data: this.currentUser };
  }

  /**
   * Get current session
   */
  getCurrentSession(): ServiceResult<AuthSession | null> {
    return { success: true, data: this.currentSession };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentSession !== null;
  }

  /**
   * Refresh current session
   */
  async refreshSession(): Promise<ServiceResult<AuthSession>> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      if (!data.session || !data.user) {
        return {
          success: false,
          error: new Error('Session refresh failed')
        };
      }

      const authUser = this.mapSupabaseUser(data.user);
      const authSession = this.mapSupabaseSession(data.session, authUser);

      this.currentUser = authUser;
      this.currentSession = authSession;

      if (this.options.debug) {
        this.log('Session refreshed');
      }

      return { success: true, data: authSession };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Session refresh failed')
      };
    }
  }

  // ============================================================================
  // USER PROFILE
  // ============================================================================

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<ServiceResult<UserProfile>> {
    try {
      // Check cache first
      const cached = this.profileCache.get(userId);
      if (cached) {
        return { success: true, data: cached };
      }

      // Fetch from Supabase
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      if (!data) {
        return {
          success: false,
          error: new Error('Profile not found')
        };
      }

      const profile = this.mapDatabaseProfile(data);
      
      // Cache profile
      this.profileCache.set(userId, profile);
      setTimeout(() => this.profileCache.delete(userId), this.PROFILE_CACHE_TTL);

      return { success: true, data: profile };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get profile')
      };
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: UpdateProfileParams): Promise<ServiceResult<UserProfile>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.company !== undefined) updateData.company = updates.company;
      if (updates.website !== undefined) updateData.website = updates.website;
      if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
      if (updates.preferences !== undefined) {
        updateData.preferences = updates.preferences;
      }
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      const profile = this.mapDatabaseProfile(data);
      
      // Update cache
      this.profileCache.set(userId, profile);

      if (this.options.debug) {
        this.log('Profile updated:', userId);
      }

      return { success: true, data: profile };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to update profile')
      };
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<ServiceResult<string>> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-assets')
        .upload(filePath, file);

      if (uploadError) {
        return {
          success: false,
          error: new Error(uploadError.message)
        };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('user-assets')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await this.updateUserProfile(userId, { avatarUrl: publicUrl });

      return { success: true, data: publicUrl };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to upload avatar')
      };
    }
  }

  // ============================================================================
  // PERMISSIONS & AUTHORIZATION
  // ============================================================================

  /**
   * Check if user has permission for an action
   */
  async hasPermission(
    userId: string,
    resourceType: Permission['resourceType'],
    resourceId: string,
    action: PermissionAction
  ): Promise<ServiceResult<boolean>> {
    try {
      const permissions = await this.getUserPermissions(userId, resourceType, resourceId);
      
      if (!permissions.success) {
        return permissions;
      }

      const hasPermission = permissions.data!.some(p => 
        p.actions.includes(action) &&
        (!p.expiresAt || p.expiresAt.getTime() > Date.now())
      );

      return { success: true, data: hasPermission };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to check permission')
      };
    }
  }

  /**
   * Get user permissions for a resource
   */
  async getUserPermissions(
    userId: string,
    resourceType: Permission['resourceType'],
    resourceId: string
  ): Promise<ServiceResult<Permission[]>> {
    try {
      const cacheKey = `${userId}:${resourceType}:${resourceId}`;
      
      // Check cache
      const cached = this.permissionCache.get(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }

      // Fetch from database
      const { data, error } = await (supabase as any)
        .from('permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId);

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      // Map to domain model
      const permissions = (data || []).map((p: any) => this.mapDatabasePermission(p));
      
      // Cache permissions
      this.permissionCache.set(cacheKey, permissions);
      setTimeout(() => this.permissionCache.delete(cacheKey), this.PERMISSION_CACHE_TTL);

      return { success: true, data: permissions };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get permissions')
      };
    }
  }

  /**
   * Grant permission to user
   */
  async grantPermission(
    userId: string,
    resourceType: Permission['resourceType'],
    resourceId: string,
    role: UserRole,
    grantedBy: string
  ): Promise<ServiceResult<Permission>> {
    try {
      const actions = this.getRoleActions(role);

      const permissionData = {
        user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId,
        role,
        actions,
        granted_by: grantedBy,
        granted_at: new Date().toISOString()
      };

      const { data, error } = await (supabase as any)
        .from('permissions')
        .insert(permissionData)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      const permission = this.mapDatabasePermission(data);
      
      // Invalidate cache
      const cacheKey = `${userId}:${resourceType}:${resourceId}`;
      this.permissionCache.delete(cacheKey);

      if (this.options.debug) {
        this.log(`Permission granted: ${role} to user ${userId}`);
      }

      return { success: true, data: permission };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to grant permission')
      };
    }
  }

  /**
   * Revoke permission from user
   */
  async revokePermission(
    userId: string,
    resourceType: Permission['resourceType'],
    resourceId: string
  ): Promise<ServiceResult<void>> {
    try {
      const { error } = await (supabase as any)
        .from('permissions')
        .delete()
        .eq('user_id', userId)
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId);

      if (error) {
        return {
          success: false,
          error: new Error(error.message)
        };
      }

      // Invalidate cache
      const cacheKey = `${userId}:${resourceType}:${resourceId}`;
      this.permissionCache.delete(cacheKey);

      if (this.options.debug) {
        this.log(`Permission revoked from user ${userId}`);
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to revoke permission')
      };
    }
  }

  // ============================================================================
  // AUTH STATE LISTENERS
  // ============================================================================

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    this.authListeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.authListeners.delete(callback);
    };
  }

  // ============================================================================
  // SPECIALIZED APIS
  // ============================================================================

  readonly auth = {
    signUp: (params: SignUpParams) => 
      this.signUp(params),
    
    signIn: (params: SignInParams) => 
      this.signIn(params),
    
    signOut: () => 
      this.signOut(),
    
    getCurrentUser: () => 
      this.getCurrentUser(),
    
    getCurrentSession: () => 
      this.getCurrentSession(),
    
    isAuthenticated: () => 
      this.isAuthenticated(),
    
    refreshSession: () => 
      this.refreshSession()
  };

  readonly profile = {
    get: (userId: string) => 
      this.getUserProfile(userId),
    
    update: (userId: string, updates: UpdateProfileParams) => 
      this.updateUserProfile(userId, updates),
    
    uploadAvatar: (userId: string, file: File) => 
      this.uploadAvatar(userId, file)
  };

  readonly permissions = {
    has: (userId: string, resourceType: Permission['resourceType'], resourceId: string, action: PermissionAction) => 
      this.hasPermission(userId, resourceType, resourceId, action),
    
    get: (userId: string, resourceType: Permission['resourceType'], resourceId: string) => 
      this.getUserPermissions(userId, resourceType, resourceId),
    
    grant: (userId: string, resourceType: Permission['resourceType'], resourceId: string, role: UserRole, grantedBy: string) => 
      this.grantPermission(userId, resourceType, resourceId, role, grantedBy),
    
    revoke: (userId: string, resourceType: Permission['resourceType'], resourceId: string) => 
      this.revokePermission(userId, resourceType, resourceId)
  };

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private setupAuthListener(): void {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (this.options.debug) {
        this.log('Auth state changed:', event);
      }

      // Update current state
      if (session?.user) {
        this.currentUser = this.mapSupabaseUser(session.user);
        this.currentSession = this.mapSupabaseSession(session, this.currentUser);
      } else {
        this.currentUser = null;
        this.currentSession = null;
      }

      // Notify listeners
      this.authListeners.forEach(listener => {
        try {
          listener(event, session);
        } catch (error) {
          this.error('Error in auth listener:', error);
        }
      });
    });

    this.authSubscription = {
      unsubscribe: () => data.subscription.unsubscribe()
    };
  }

  private async restoreSession(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        this.currentUser = this.mapSupabaseUser(session.user);
        this.currentSession = this.mapSupabaseSession(session, this.currentUser);
        
        if (this.options.debug) {
          this.log('Session restored:', this.currentUser.email);
        }
      }
    } catch (error) {
      if (this.options.debug) {
        this.log('Failed to restore session:', error);
      }
    }
  }

  private setupSessionRefresh(): void {
    this.sessionRefreshTimer = setInterval(async () => {
      if (!this.currentSession) return;

      const timeUntilExpiry = this.currentSession.expiresAt - Date.now();
      
      if (timeUntilExpiry < this.SESSION_REFRESH_THRESHOLD) {
        await this.refreshSession();
      }
    }, 60 * 1000); // Check every minute
  }

  private async createUserProfile(user: AuthUser, displayName?: string): Promise<void> {
    try {
      await (supabase as any).from('user_profiles').insert({
        user_id: user.id,
        email: user.email,
        display_name: displayName || user.email.split('@')[0],
        preferences: {
          theme: 'system',
          language: 'en',
          notifications: true,
          emailDigest: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      // Non-critical - profile might already exist
      if (this.options.debug) {
        this.log('Failed to create profile:', error);
      }
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await (supabase as any)
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('user_id', userId);
    } catch (error) {
      // Non-critical
      if (this.options.debug) {
        this.log('Failed to update last login:', error);
      }
    }
  }

  private mapSupabaseUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email || '',
      role: 'owner', // Default role
      displayName: user.user_metadata?.display_name,
      avatarUrl: user.user_metadata?.avatar_url,
      metadata: user.user_metadata,
      createdAt: new Date(user.created_at),
      lastLoginAt: new Date()
    };
  }

  private mapSupabaseSession(session: Session, user: AuthUser): AuthSession {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: new Date(session.expires_at! * 1000).getTime(),
      user
    };
  }

  private mapDatabaseProfile(data: any): UserProfile {
    return {
      userId: data.user_id,
      displayName: data.display_name || data.email,
      email: data.email,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      company: data.company,
      website: data.website,
      preferences: data.preferences || {
        theme: 'system',
        language: 'en',
        notifications: true,
        emailDigest: true
      },
      metadata: data.metadata,
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapDatabasePermission(data: any): Permission {
    return {
      resourceType: data.resource_type,
      resourceId: data.resource_id,
      userId: data.user_id,
      role: data.role,
      actions: data.actions,
      grantedBy: data.granted_by,
      grantedAt: new Date(data.granted_at),
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined
    };
  }

  private getRoleActions(role: UserRole): PermissionAction[] {
    switch (role) {
      case 'owner':
        return ['view', 'edit', 'delete', 'publish', 'share', 'admin'];
      case 'editor':
        return ['view', 'edit', 'publish'];
      case 'viewer':
        return ['view'];
      case 'anonymous':
        return [];
      default:
        return [];
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
