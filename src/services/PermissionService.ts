/**
 * 🔐 PERMISSION SERVICE - Sistema de Permissões e Roles
 * 
 * Funcionalidades:
 * - Gerenciamento de roles de usuário
 * - Controle granular de permissões
 * - Sistema de convites
 * - Auditoria de ações
 */

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  level: number; // 1 = Owner, 2 = Editor, 3 = Viewer
}

export interface Permission {
  id: string;
  name: string;
  resource: 'funnel' | 'stage' | 'block' | 'settings' | 'collaboration';
  action: 'create' | 'read' | 'update' | 'delete' | 'invite' | 'manage';
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface UserPermission {
  userId: string;
  funnelId: string;
  role: UserRole;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface Invitation {
  id: string;
  funnelId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  funnelId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

class PermissionService {
  private roles: Map<string, UserRole> = new Map();
  private userPermissions: Map<string, UserPermission[]> = new Map();
  private invitations: Map<string, Invitation> = new Map();
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.initializeDefaultRoles();
  }

  /**
   * 🎯 Inicializar roles padrão
   */
  private initializeDefaultRoles(): void {
    // Owner Role
    const ownerRole: UserRole = {
      id: 'owner',
      name: 'Owner',
      level: 1,
      permissions: [
        { id: 'funnel_all', name: 'All Funnel Permissions', resource: 'funnel', action: 'manage' },
        { id: 'stage_all', name: 'All Stage Permissions', resource: 'stage', action: 'manage' },
        { id: 'block_all', name: 'All Block Permissions', resource: 'block', action: 'manage' },
        { id: 'settings_all', name: 'All Settings Permissions', resource: 'settings', action: 'manage' },
        { id: 'collaboration_all', name: 'All Collaboration Permissions', resource: 'collaboration', action: 'manage' }
      ]
    };

    // Editor Role
    const editorRole: UserRole = {
      id: 'editor',
      name: 'Editor',
      level: 2,
      permissions: [
        { id: 'funnel_read', name: 'Read Funnel', resource: 'funnel', action: 'read' },
        { id: 'funnel_update', name: 'Update Funnel', resource: 'funnel', action: 'update' },
        { id: 'stage_create', name: 'Create Stage', resource: 'stage', action: 'create' },
        { id: 'stage_read', name: 'Read Stage', resource: 'stage', action: 'read' },
        { id: 'stage_update', name: 'Update Stage', resource: 'stage', action: 'update' },
        { id: 'stage_delete', name: 'Delete Stage', resource: 'stage', action: 'delete' },
        { id: 'block_create', name: 'Create Block', resource: 'block', action: 'create' },
        { id: 'block_read', name: 'Read Block', resource: 'block', action: 'read' },
        { id: 'block_update', name: 'Update Block', resource: 'block', action: 'update' },
        { id: 'block_delete', name: 'Delete Block', resource: 'block', action: 'delete' }
      ]
    };

    // Viewer Role
    const viewerRole: UserRole = {
      id: 'viewer',
      name: 'Viewer',
      level: 3,
      permissions: [
        { id: 'funnel_read', name: 'Read Funnel', resource: 'funnel', action: 'read' },
        { id: 'stage_read', name: 'Read Stage', resource: 'stage', action: 'read' },
        { id: 'block_read', name: 'Read Block', resource: 'block', action: 'read' }
      ]
    };

    this.roles.set('owner', ownerRole);
    this.roles.set('editor', editorRole);
    this.roles.set('viewer', viewerRole);

    console.log('✅ Roles padrão inicializados');
  }

  /**
   * 🔍 Verificar permissão
   */
  async hasPermission(
    userId: string,
    funnelId: string,
    resource: Permission['resource'],
    action: Permission['action'],
    context?: Record<string, any>
  ): Promise<boolean> {
    const userPermissions = this.userPermissions.get(userId) || [];
    const funnelPermission = userPermissions.find(p => p.funnelId === funnelId && p.isActive);
    
    if (!funnelPermission) {
      console.log(`❌ Usuário ${userId} não tem permissão para funnel ${funnelId}`);
      return false;
    }

    // Verificar se a permissão expirou
    if (funnelPermission.expiresAt && funnelPermission.expiresAt < new Date()) {
      console.log(`❌ Permissão expirada para usuário ${userId}`);
      return false;
    }

    // Verificar se o role tem a permissão
    const hasRolePermission = funnelPermission.role.permissions.some(permission => 
      permission.resource === resource && 
      permission.action === action &&
      this.evaluateConditions(permission.conditions, context)
    );

    if (hasRolePermission) {
      // Log da ação
      await this.logAction(userId, funnelId, action, resource, context);
      return true;
    }

    console.log(`❌ Usuário ${userId} não tem permissão ${action} para ${resource}`);
    return false;
  }

  /**
   * 🎯 Conceder permissão
   */
  async grantPermission(
    userId: string,
    funnelId: string,
    roleId: string,
    grantedBy: string,
    expiresAt?: Date
  ): Promise<boolean> {
    const role = this.roles.get(roleId);
    if (!role) {
      console.error(`❌ Role não encontrado: ${roleId}`);
      return false;
    }

    const userPermissions = this.userPermissions.get(userId) || [];
    
    // Remover permissão existente para o mesmo funnel
    const filteredPermissions = userPermissions.filter(p => p.funnelId !== funnelId);
    
    // Adicionar nova permissão
    const newPermission: UserPermission = {
      userId,
      funnelId,
      role,
      grantedBy,
      grantedAt: new Date(),
      expiresAt,
      isActive: true
    };

    filteredPermissions.push(newPermission);
    this.userPermissions.set(userId, filteredPermissions);

    // Log da ação
    await this.logAction(grantedBy, funnelId, 'grant', 'collaboration', {
      targetUserId: userId,
      roleId,
      expiresAt
    });

    console.log(`✅ Permissão concedida: ${userId} -> ${roleId} para funnel ${funnelId}`);
    return true;
  }

  /**
   * 🚫 Revogar permissão
   */
  async revokePermission(
    userId: string,
    funnelId: string,
    revokedBy: string
  ): Promise<boolean> {
    const userPermissions = this.userPermissions.get(userId) || [];
    const permissionIndex = userPermissions.findIndex(p => p.funnelId === funnelId);
    
    if (permissionIndex === -1) {
      console.log(`❌ Permissão não encontrada para usuário ${userId} no funnel ${funnelId}`);
      return false;
    }

    // Desativar permissão
    userPermissions[permissionIndex].isActive = false;
    this.userPermissions.set(userId, userPermissions);

    // Log da ação
    await this.logAction(revokedBy, funnelId, 'revoke', 'collaboration', {
      targetUserId: userId
    });

    console.log(`🚫 Permissão revogada: ${userId} para funnel ${funnelId}`);
    return true;
  }

  /**
   * 📧 Criar convite
   */
  async createInvitation(
    funnelId: string,
    email: string,
    roleId: string,
    invitedBy: string,
    expiresInHours: number = 72
  ): Promise<Invitation> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new Error(`Role não encontrado: ${roleId}`);
    }

    const invitation: Invitation = {
      id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      funnelId,
      email,
      role,
      invitedBy,
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
      status: 'pending',
      token: this.generateInvitationToken()
    };

    this.invitations.set(invitation.id, invitation);

    // Log da ação
    await this.logAction(invitedBy, funnelId, 'invite', 'collaboration', {
      targetEmail: email,
      roleId,
      invitationId: invitation.id
    });

    console.log(`📧 Convite criado: ${email} -> ${roleId} para funnel ${funnelId}`);
    return invitation;
  }

  /**
   * ✅ Aceitar convite
   */
  async acceptInvitation(
    invitationId: string,
    userId: string
  ): Promise<boolean> {
    const invitation = this.invitations.get(invitationId);
    if (!invitation) {
      console.error(`❌ Convite não encontrado: ${invitationId}`);
      return false;
    }

    if (invitation.status !== 'pending') {
      console.error(`❌ Convite já foi processado: ${invitationId}`);
      return false;
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      console.error(`❌ Convite expirado: ${invitationId}`);
      return false;
    }

    // Conceder permissão
    const success = await this.grantPermission(
      userId,
      invitation.funnelId,
      invitation.role.id,
      invitation.invitedBy
    );

    if (success) {
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      
      // Log da ação
      await this.logAction(userId, invitation.funnelId, 'accept_invitation', 'collaboration', {
        invitationId,
        roleId: invitation.role.id
      });

      console.log(`✅ Convite aceito: ${invitationId} por usuário ${userId}`);
    }

    return success;
  }

  /**
   * 🚫 Recusar convite
   */
  async declineInvitation(invitationId: string, userId: string): Promise<boolean> {
    const invitation = this.invitations.get(invitationId);
    if (!invitation) return false;

    invitation.status = 'declined';
    
    // Log da ação
    await this.logAction(userId, invitation.funnelId, 'decline_invitation', 'collaboration', {
      invitationId
    });

    console.log(`🚫 Convite recusado: ${invitationId} por usuário ${userId}`);
    return true;
  }

  /**
   * 📊 Obter permissões do usuário
   */
  getUserPermissions(userId: string, funnelId?: string): UserPermission[] {
    const userPermissions = this.userPermissions.get(userId) || [];
    
    if (funnelId) {
      return userPermissions.filter(p => p.funnelId === funnelId);
    }
    
    return userPermissions;
  }

  /**
   * 👥 Obter usuários do funnel
   */
  getFunnelUsers(funnelId: string): UserPermission[] {
    const allUsers: UserPermission[] = [];
    
    for (const userPermissions of this.userPermissions.values()) {
      const funnelPermission = userPermissions.find(p => p.funnelId === funnelId && p.isActive);
      if (funnelPermission) {
        allUsers.push(funnelPermission);
      }
    }
    
    return allUsers;
  }

  /**
   * 🔍 Avaliar condições de permissão
   */
  private evaluateConditions(
    conditions: PermissionCondition[] | undefined,
    context: Record<string, any> = {}
  ): boolean {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every(condition => {
      const value = context[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'contains':
          return typeof value === 'string' && value.includes(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(value);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(value);
        default:
          return false;
      }
    });
  }

  /**
   * 📝 Log de ação
   */
  private async logAction(
    userId: string,
    funnelId: string,
    action: string,
    resource: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      funnelId,
      action,
      resource,
      resourceId: details.resourceId || 'unknown',
      details,
      timestamp: new Date()
    };

    this.auditLogs.push(auditLog);
    
    // Manter apenas os últimos 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }
  }

  /**
   * 🔑 Gerar token de convite
   */
  private generateInvitationToken(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * 📊 Obter logs de auditoria
   */
  getAuditLogs(funnelId?: string, userId?: string): AuditLog[] {
    let logs = this.auditLogs;
    
    if (funnelId) {
      logs = logs.filter(log => log.funnelId === funnelId);
    }
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * 🧹 Limpar convites expirados
   */
  async cleanupExpiredInvitations(): Promise<void> {
    const now = new Date();
    
    for (const [id, invitation] of this.invitations) {
      if (invitation.expiresAt < now && invitation.status === 'pending') {
        invitation.status = 'expired';
        console.log(`🧹 Convite expirado removido: ${id}`);
      }
    }
  }
}

// Instância singleton
export const permissionService = new PermissionService();

// Limpeza automática a cada hora
setInterval(() => {
  permissionService.cleanupExpiredInvitations();
}, 60 * 60 * 1000);
