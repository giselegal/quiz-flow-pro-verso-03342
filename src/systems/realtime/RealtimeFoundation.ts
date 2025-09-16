/**
 * 🔄 FOUNDATION PARA COLABORAÇÃO REAL-TIME - FASE 4
 * 
 * Sistema base para colaboração futura com:
 * - WebSocket connection management
 * - Optimistic updates com rollback automático
 * - Conflict resolution strategies
 * - User presence e cursor tracking
 */

import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { intelligentCache } from '../cache/IntelligentCacheSystem';

export interface RealtimeUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  lastSeen: number;
  isActive: boolean;
}

export interface RealtimeMessage {
  id: string;
  type: 'cursor' | 'edit' | 'presence' | 'system';
  userId: string;
  timestamp: number;
  data: any;
}

export interface OptimisticUpdate {
  id: string;
  type: string;
  originalData: any;
  optimisticData: any;
  timestamp: number;
  confirmed: boolean;
  rollbackFn?: () => void;
}

interface ConflictResolution {
  strategy: 'last-write-wins' | 'merge' | 'user-choice';
  resolver?: (local: any, remote: any) => any;
}

export class RealtimeFoundation {
  private ws: WebSocket | null = null;
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' = 'disconnected';
  private users = new Map<string, RealtimeUser>();
  private pendingUpdates = new Map<string, OptimisticUpdate>();
  private messageQueue: RealtimeMessage[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: number | null = null;
  private presenceInterval: number | null = null;
  
  private eventListeners = new Map<string, Set<(data: any) => void>>();
  private conflictResolvers = new Map<string, ConflictResolution>();

  constructor(private config: {
    wsUrl?: string;
    userId: string;
    userName: string;
    heartbeatInterval?: number;
    presenceInterval?: number;
  }) {
    this.setupConflictResolvers();
  }

  /**
   * 🔌 CONEXÃO - Gerenciamento inteligente de WebSocket
   */
  async connect(): Promise<boolean> {
    if (this.connectionState === 'connected') {
      return true;
    }

    this.connectionState = 'connecting';
    
    try {
      // Simular conexão WebSocket (implementação futura)
      await this.simulateConnection();
      
      this.connectionState = 'connected';
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.startPresenceUpdates();
      this.flushMessageQueue();
      
      this.emit('connected', { userId: this.config.userId });
      return true;
      
    } catch (error) {
      console.error('[Realtime] Connection failed:', error);
      this.connectionState = 'disconnected';
      this.scheduleReconnect();
      return false;
    }
  }

  /**
   * 🔄 OPTIMISTIC UPDATES - Updates com rollback automático
   */
  async optimisticUpdate<T>(
    id: string,
    type: string,
    updateFn: (data: T) => T,
    originalData: T,
    options: {
      timeout?: number;
      rollbackFn?: () => void;
    } = {}
  ): Promise<boolean> {
    const { timeout = 5000, rollbackFn } = options;

    // Aplicar update otimista imediatamente
    const optimisticData = updateFn(originalData);
    
    const update: OptimisticUpdate = {
      id,
      type,
      originalData,
      optimisticData,
      timestamp: Date.now(),
      confirmed: false,
      rollbackFn
    };

    this.pendingUpdates.set(id, update);

    // Enviar para servidor (simulado)
    this.sendMessage({
      id: `update_${Date.now()}`,
      type: 'edit',
      userId: this.config.userId,
      timestamp: Date.now(),
      data: { updateId: id, type, optimisticData }
    });

    // Timeout para rollback automático
    PerformanceOptimizer.schedule(() => {
      const pendingUpdate = this.pendingUpdates.get(id);
      if (pendingUpdate && !pendingUpdate.confirmed) {
        this.rollbackUpdate(id);
      }
    }, timeout, 'timeout');

    return true;
  }

  /**
   * ✅ CONFIRMAR UPDATE - Confirma update otimista
   */
  confirmUpdate(updateId: string): void {
    const update = this.pendingUpdates.get(updateId);
    if (update) {
      update.confirmed = true;
      this.pendingUpdates.delete(updateId);
      
      // Invalidar cache relacionado
      intelligentCache.invalidate(`update_${updateId}`);
    }
  }

  /**
   * ↩️ ROLLBACK - Reverte update otimista
   */
  rollbackUpdate(updateId: string): void {
    const update = this.pendingUpdates.get(updateId);
    if (update) {
      if (update.rollbackFn) {
        update.rollbackFn();
      }
      
      this.pendingUpdates.delete(updateId);
      this.emit('rollback', { updateId, originalData: update.originalData });
      
      console.warn(`[Realtime] Rolled back optimistic update: ${updateId}`);
    }
  }

  /**
   * 🤝 CONFLICT RESOLUTION - Resolução de conflitos
   */
  async resolveConflict(
    type: string,
    localData: any,
    remoteData: any
  ): Promise<any> {
    const resolver = this.conflictResolvers.get(type);
    
    if (!resolver) {
      console.warn(`[Realtime] No conflict resolver for type: ${type}`);
      return remoteData; // Default: remote wins
    }

    switch (resolver.strategy) {
      case 'last-write-wins':
        return localData.timestamp > remoteData.timestamp ? localData : remoteData;
        
      case 'merge':
        return resolver.resolver ? resolver.resolver(localData, remoteData) : remoteData;
        
      case 'user-choice':
        return this.promptUserForConflictResolution(localData, remoteData);
        
      default:
        return remoteData;
    }
  }

  /**
   * 👥 PRESENCE - Gerenciamento de presença de usuários
   */
  updateUserPresence(userId: string, presence: Partial<RealtimeUser>): void {
    const existingUser = this.users.get(userId) || {
      id: userId,
      name: presence.name || 'Unknown',
      color: this.generateUserColor(userId),
      lastSeen: Date.now(),
      isActive: true
    };

    const updatedUser = { ...existingUser, ...presence, lastSeen: Date.now() };
    this.users.set(userId, updatedUser);
    
    this.emit('presence-updated', { user: updatedUser, users: Array.from(this.users.values()) });
  }

  /**
   * 🖱️ CURSOR TRACKING - Rastreamento de cursor
   */
  updateCursor(x: number, y: number): void {
    if (this.connectionState !== 'connected') return;

    this.sendMessage({
      id: `cursor_${Date.now()}`,
      type: 'cursor',
      userId: this.config.userId,
      timestamp: Date.now(),
      data: { x, y }
    });

    // Cache local do cursor
    intelligentCache.set(`cursor_${this.config.userId}`, { x, y }, {
      ttl: 10000, // 10 segundos
      priority: 'low'
    });
  }

  /**
   * 📡 EVENTOS - Sistema de eventos
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    
    this.eventListeners.get(event)!.add(callback);
    
    // Retornar função de cleanup
    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[Realtime] Event callback error for ${event}:`, error);
        }
      });
    }
  }

  /**
   * 📨 MENSAGENS - Envio de mensagens
   */
  private sendMessage(message: RealtimeMessage): void {
    if (this.connectionState !== 'connected') {
      this.messageQueue.push(message);
      return;
    }

    // Simular envio WebSocket
    PerformanceOptimizer.schedule(() => {
      console.log('[Realtime] Sending message:', message);
      
      // Simular resposta de confirmação
      if (message.type === 'edit') {
        PerformanceOptimizer.schedule(() => {
          this.confirmUpdate(message.data.updateId);
        }, 1000, 'timeout');
      }
    }, 10, 'message');
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  private async simulateConnection(): Promise<void> {
    // Simular delay de conexão
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('[Realtime] Connected (simulated)');
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Realtime] Max reconnection attempts reached');
      this.emit('connection-failed', { attempts: this.reconnectAttempts });
      return;
    }

    const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
    this.reconnectAttempts++;
    
    PerformanceOptimizer.schedule(() => {
      this.connectionState = 'reconnecting';
      this.connect();
    }, delay, 'timeout');
  }

  private startHeartbeat(): void {
    const interval = this.config.heartbeatInterval || 30000; // 30 segundos
    
    this.heartbeatInterval = PerformanceOptimizer.scheduleInterval(() => {
      if (this.connectionState === 'connected') {
        this.sendMessage({
          id: `heartbeat_${Date.now()}`,
          type: 'system',
          userId: this.config.userId,
          timestamp: Date.now(),
          data: { type: 'heartbeat' }
        });
      }
    }, interval, 'timeout') as number;
  }

  private startPresenceUpdates(): void {
    const interval = this.config.presenceInterval || 5000; // 5 segundos
    
    this.presenceInterval = PerformanceOptimizer.scheduleInterval(() => {
      this.updateUserPresence(this.config.userId, {
        name: this.config.userName,
        isActive: !document.hidden
      });
    }, interval, 'timeout') as number;
  }

  private setupConflictResolvers(): void {
    // Resolver para quiz selections
    this.conflictResolvers.set('quiz-selection', {
      strategy: 'last-write-wins'
    });

    // Resolver para form data
    this.conflictResolvers.set('form-data', {
      strategy: 'merge',
      resolver: (local, remote) => ({ ...local, ...remote })
    });

    // Resolver para editor blocks
    this.conflictResolvers.set('editor-blocks', {
      strategy: 'user-choice'
    });
  }

  private generateUserColor(userId: string): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  private async promptUserForConflictResolution(localData: any, remoteData: any): Promise<any> {
    // Implementação futura: mostrar modal de resolução de conflito
    console.warn('[Realtime] User conflict resolution not implemented, using remote data');
    return remoteData;
  }

  /**
   * 🧹 CLEANUP - Limpeza de recursos
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.heartbeatInterval) {
      PerformanceOptimizer.cancelInterval(this.heartbeatInterval);
    }

    if (this.presenceInterval) {
      PerformanceOptimizer.cancelInterval(this.presenceInterval);
    }

    this.connectionState = 'disconnected';
    this.users.clear();
    this.pendingUpdates.clear();
    this.messageQueue.length = 0;
    this.eventListeners.clear();

    this.emit('disconnected', {});
  }
}

// Factory para criar instância
export const createRealtimeFoundation = (config: {
  userId: string;
  userName: string;
  wsUrl?: string;
}) => {
  return new RealtimeFoundation(config);
};

export default RealtimeFoundation;