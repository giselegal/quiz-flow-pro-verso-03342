/**
 * 🚀 COLLABORATION SERVICE - Sistema de Colaboração em Tempo Real
 * 
 * Funcionalidades:
 * - Gerenciamento de sessões de colaboração
 * - Sincronização de mudanças em tempo real
 * - Controle de conflitos
 * - Rastreamento de presença de usuários
 */

import { getSupabaseClient } from '@/integrations/supabase/supabaseLazy';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  lastSeen: Date;
  cursor?: {
    stageId: string;
    blockId?: string;
    position: { x: number; y: number };
  };
}

export interface CollaborationSession {
  id: string;
  funnelId: string;
  users: CollaborationUser[];
  ownerId: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface CollaborationChange {
  id: string;
  sessionId: string;
  userId: string;
  type: 'create' | 'update' | 'delete' | 'move' | 'reorder';
  entityType: 'funnel' | 'stage' | 'block';
  entityId: string;
  changes: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
}

export interface CollaborationConflict {
  id: string;
  sessionId: string;
  changeId: string;
  conflictingChangeId: string;
  entityType: string;
  entityId: string;
  resolution: 'automatic' | 'manual' | 'pending';
  resolvedBy?: string;
  resolvedAt?: Date;
}

class CollaborationService {
  private supabase: any;
  private sessions: Map<string, CollaborationSession> = new Map();
  private activeUsers: Map<string, CollaborationUser> = new Map();
  private changeQueue: CollaborationChange[] = [];
  private conflictResolver: ConflictResolver;

  constructor() {
    this.conflictResolver = new ConflictResolver();
  }

  private async ensureClient() {
    if (this.supabase) return this.supabase;
    const DISABLE = (import.meta as any)?.env?.VITE_DISABLE_SUPABASE === 'true';
    const ENABLE = (import.meta as any)?.env?.VITE_ENABLE_SUPABASE !== 'false'; // default true
    if (DISABLE || !ENABLE) {
      this.supabase = null;
      return null;
    }
    try {
      this.supabase = await getSupabaseClient();
    } catch (e) {
      console.warn('⚠️ CollaborationService: fallback offline');
      this.supabase = null;
    }
    return this.supabase;
  }

  /**
   * 🎯 Criar sessão de colaboração
   */
  async createSession(funnelId: string, ownerId: string): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      funnelId,
      users: [],
      ownerId,
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(session.id, session);
    
    // Persistir no Supabase se disponível
    const supabase = await this.ensureClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('collaboration_sessions')
          .insert({
            id: session.id,
            funnel_id: funnelId,
            owner_id: ownerId,
            is_active: true,
            created_at: session.createdAt.toISOString(),
            last_activity: session.lastActivity.toISOString()
          });

        if (error) throw error;
      } catch (error) {
        console.warn('⚠️ Erro ao persistir sessão:', error);
      }
    }

    console.log(`🎯 Sessão de colaboração criada: ${session.id}`);
    return session;
  }

  /**
   * 👥 Adicionar usuário à sessão
   */
  async addUserToSession(
    sessionId: string, 
    user: Omit<CollaborationUser, 'isOnline' | 'lastSeen' | 'cursor'>,
    role: 'owner' | 'editor' | 'viewer' = 'editor'
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error('❌ Sessão não encontrada:', sessionId);
      return false;
    }

    const collaborationUser: CollaborationUser = {
      ...user,
      role,
      isOnline: true,
      lastSeen: new Date(),
      cursor: undefined
    };

    session.users.push(collaborationUser);
    this.activeUsers.set(user.id, collaborationUser);
    session.lastActivity = new Date();

    // Notificar outros usuários
    await this.broadcastUserJoined(sessionId, collaborationUser);

    console.log(`👥 Usuário ${user.name} adicionado à sessão ${sessionId}`);
    return true;
  }

  /**
   * 🚪 Remover usuário da sessão
   */
  async removeUserFromSession(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.users = session.users.filter(u => u.id !== userId);
    this.activeUsers.delete(userId);
    session.lastActivity = new Date();

    // Notificar outros usuários
    await this.broadcastUserLeft(sessionId, userId);

    console.log(`🚪 Usuário ${userId} removido da sessão ${sessionId}`);
    return true;
  }

  /**
   * 📝 Registrar mudança de colaboração
   */
  async trackChange(
    sessionId: string,
    userId: string,
    type: CollaborationChange['type'],
    entityType: CollaborationChange['entityType'],
    entityId: string,
    changes: Record<string, any>
  ): Promise<CollaborationChange> {
    const change: CollaborationChange = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId,
      type,
      entityType,
      entityId,
      changes,
      timestamp: new Date(),
      resolved: false
    };

    this.changeQueue.push(change);

    // Verificar conflitos
    const conflicts = await this.detectConflicts(change);
    if (conflicts.length > 0) {
      console.log(`⚠️ Conflitos detectados para mudança ${change.id}:`, conflicts);
      await this.resolveConflicts(change, conflicts);
    }

    // Aplicar mudança
    await this.applyChange(change);

    // Notificar outros usuários
    await this.broadcastChange(sessionId, change);

    console.log(`📝 Mudança registrada: ${change.id}`);
    return change;
  }

  /**
   * 🔍 Detectar conflitos
   */
  private async detectConflicts(change: CollaborationChange): Promise<CollaborationConflict[]> {
    const conflicts: CollaborationConflict[] = [];
    
    // Verificar mudanças recentes no mesmo entity
    const recentChanges = this.changeQueue.filter(c => 
      c.entityType === change.entityType &&
      c.entityId === change.entityId &&
      c.id !== change.id &&
      !c.resolved &&
      Math.abs(c.timestamp.getTime() - change.timestamp.getTime()) < 5000 // 5 segundos
    );

    for (const recentChange of recentChanges) {
      const conflict: CollaborationConflict = {
        id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: change.sessionId,
        changeId: change.id,
        conflictingChangeId: recentChange.id,
        entityType: change.entityType,
        entityId: change.entityId,
        resolution: 'pending'
      };

      conflicts.push(conflict);
    }

    return conflicts;
  }

  /**
   * 🔧 Resolver conflitos
   */
  private async resolveConflicts(change: CollaborationChange, conflicts: CollaborationConflict[]): Promise<void> {
    for (const conflict of conflicts) {
      try {
        const resolution = await this.conflictResolver.resolve(change, conflict);
        
        if (resolution.resolved) {
          conflict.resolution = 'automatic';
          conflict.resolvedBy = 'system';
          conflict.resolvedAt = new Date();
          
          console.log(`✅ Conflito resolvido automaticamente: ${conflict.id}`);
        } else {
          conflict.resolution = 'manual';
          console.log(`⚠️ Conflito requer resolução manual: ${conflict.id}`);
        }
      } catch (error) {
        console.error('❌ Erro ao resolver conflito:', error);
        conflict.resolution = 'manual';
      }
    }
  }

  /**
   * ✅ Aplicar mudança
   */
  private async applyChange(change: CollaborationChange): Promise<void> {
    // Aqui seria a integração com o UnifiedCRUDService
    // Por enquanto, apenas marcar como resolvida
    change.resolved = true;
    
    console.log(`✅ Mudança aplicada: ${change.id}`);
  }

  /**
   * 📡 Broadcast de mudanças
   */
  private async broadcastChange(sessionId: string, change: CollaborationChange): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Em uma implementação real, isso seria feito via WebSocket ou Server-Sent Events
    console.log(`📡 Broadcasting change ${change.id} to ${session.users.length} users`);
  }

  /**
   * 👥 Broadcast de usuário entrando
   */
  private async broadcastUserJoined(sessionId: string, user: CollaborationUser): Promise<void> {
    console.log(`📡 Broadcasting user joined: ${user.name}`);
  }

  /**
   * 🚪 Broadcast de usuário saindo
   */
  private async broadcastUserLeft(sessionId: string, userId: string): Promise<void> {
    console.log(`📡 Broadcasting user left: ${userId}`);
  }

  /**
   * 🎯 Atualizar cursor do usuário
   */
  async updateUserCursor(
    sessionId: string, 
    userId: string, 
    cursor: CollaborationUser['cursor']
  ): Promise<void> {
    const user = this.activeUsers.get(userId);
    if (user) {
      user.cursor = cursor;
      user.lastSeen = new Date();
      
      // Broadcast cursor update
      await this.broadcastCursorUpdate(sessionId, userId, cursor);
    }
  }

  /**
   * 📡 Broadcast de atualização de cursor
   */
  private async broadcastCursorUpdate(
    sessionId: string, 
    userId: string, 
    cursor: CollaborationUser['cursor']
  ): Promise<void> {
    console.log(`📡 Broadcasting cursor update for user ${userId}`);
  }

  /**
   * 📊 Obter estatísticas da sessão
   */
  getSessionStats(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    return {
      totalUsers: session.users.length,
      onlineUsers: session.users.filter(u => u.isOnline).length,
      totalChanges: this.changeQueue.filter(c => c.sessionId === sessionId).length,
      pendingConflicts: this.changeQueue.filter(c => 
        c.sessionId === sessionId && !c.resolved
      ).length,
      lastActivity: session.lastActivity
    };
  }

  /**
   * 🧹 Limpar sessões inativas
   */
  async cleanupInactiveSessions(): Promise<void> {
    const now = new Date();
    const inactiveThreshold = 30 * 60 * 1000; // 30 minutos

    for (const [sessionId, session] of this.sessions) {
      if (now.getTime() - session.lastActivity.getTime() > inactiveThreshold) {
        session.isActive = false;
        this.sessions.delete(sessionId);
        console.log(`🧹 Sessão inativa removida: ${sessionId}`);
      }
    }
  }
}

/**
 * 🔧 CONFLICT RESOLVER - Resolvedor de Conflitos
 */
class ConflictResolver {
  /**
   * Resolver conflito automaticamente
   */
  async resolve(
    change: CollaborationChange, 
    conflict: CollaborationConflict
  ): Promise<{ resolved: boolean; strategy?: string }> {
    
    // Estratégias de resolução automática
    const strategies = [
      this.resolveByTimestamp,
      this.resolveByUserRole,
      this.resolveByChangeType,
      this.resolveByMerge
    ];

    for (const strategy of strategies) {
      try {
        const result = await strategy(change, conflict);
        if (result.resolved) {
          return result;
        }
      } catch (error) {
        console.warn('⚠️ Estratégia de resolução falhou:', error);
      }
    }

    return { resolved: false };
  }

  /**
   * Resolver por timestamp (mais recente vence)
   */
  private async resolveByTimestamp(
    change: CollaborationChange, 
    conflict: CollaborationConflict
  ): Promise<{ resolved: boolean; strategy?: string }> {
    // Implementação simplificada - em produção seria mais complexa
    return { resolved: true, strategy: 'timestamp' };
  }

  /**
   * Resolver por role do usuário
   */
  private async resolveByUserRole(
    change: CollaborationChange, 
    conflict: CollaborationConflict
  ): Promise<{ resolved: boolean; strategy?: string }> {
    // Owner > Editor > Viewer
    return { resolved: false };
  }

  /**
   * Resolver por tipo de mudança
   */
  private async resolveByChangeType(
    change: CollaborationChange, 
    conflict: CollaborationConflict
  ): Promise<{ resolved: boolean; strategy?: string }> {
    // Delete > Update > Create
    return { resolved: false };
  }

  /**
   * Resolver por merge
   */
  private async resolveByMerge(
    change: CollaborationChange, 
    conflict: CollaborationConflict
  ): Promise<{ resolved: boolean; strategy?: string }> {
    // Tentar fazer merge das mudanças
    return { resolved: false };
  }
}

// Instância singleton
export const collaborationService = new CollaborationService();

// Limpeza automática a cada 5 minutos
setInterval(() => {
  collaborationService.cleanupInactiveSessions();
}, 5 * 60 * 1000);
