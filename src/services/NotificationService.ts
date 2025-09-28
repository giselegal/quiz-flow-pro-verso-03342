/**
 * 🔔 NOTIFICATION SERVICE - Sistema de Notificações em Tempo Real
 * 
 * Funcionalidades:
 * - Notificações em tempo real
 * - Sistema de chat integrado
 * - Alertas de mudanças
 * - Comentários em elementos
 */

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'collaboration' | 'system';
  title: string;
  message: string;
  userId: string;
  funnelId: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  action?: NotificationAction;
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  type: 'navigate' | 'open' | 'accept' | 'decline' | 'dismiss';
  label: string;
  url?: string;
  data?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  funnelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  replyTo?: string;
  mentions?: string[];
  reactions?: ChatReaction[];
}

export interface ChatReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface Comment {
  id: string;
  funnelId: string;
  stageId?: string;
  blockId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  replies?: Comment[];
}

export interface PresenceUpdate {
  userId: string;
  userName: string;
  userAvatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  cursor?: {
    stageId: string;
    blockId?: string;
    position: { x: number; y: number };
  };
}

class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();
  private comments: Map<string, Comment[]> = new Map();
  private presence: Map<string, PresenceUpdate> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeService();
  }

  /**
   * 🎯 Inicializar serviço
   */
  private initializeService(): void {
    console.log('✅ NotificationService inicializado');
    
    // Limpeza automática de notificações expiradas
    setInterval(() => {
      this.cleanupExpiredNotifications();
    }, 5 * 60 * 1000); // 5 minutos
  }

  /**
   * 🔔 Criar notificação
   */
  async createNotification(
    type: Notification['type'],
    title: string,
    message: string,
    userId: string,
    funnelId: string,
    action?: NotificationAction,
    metadata?: Record<string, any>,
    expiresInMinutes?: number
  ): Promise<Notification> {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      userId,
      funnelId,
      read: false,
      createdAt: new Date(),
      action,
      metadata
    };

    if (expiresInMinutes) {
      notification.expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    }

    this.notifications.set(notification.id, notification);

    // Emitir evento
    this.emit('notification_created', notification);

    console.log(`🔔 Notificação criada: ${notification.id} para usuário ${userId}`);
    return notification;
  }

  /**
   * 📧 Enviar notificação de colaboração
   */
  async sendCollaborationNotification(
    type: 'user_joined' | 'user_left' | 'change_made' | 'conflict_detected' | 'invitation_sent',
    funnelId: string,
    targetUserId: string,
    data: Record<string, any>
  ): Promise<void> {
    const notifications = {
      user_joined: {
        title: 'Novo colaborador',
        message: `${data.userName} entrou na sessão de colaboração`
      },
      user_left: {
        title: 'Colaborador saiu',
        message: `${data.userName} saiu da sessão de colaboração`
      },
      change_made: {
        title: 'Mudança detectada',
        message: `${data.userName} fez uma alteração em ${data.entityType}`
      },
      conflict_detected: {
        title: 'Conflito detectado',
        message: 'Foi detectado um conflito que requer sua atenção'
      },
      invitation_sent: {
        title: 'Convite enviado',
        message: `Convite enviado para ${data.email}`
      }
    };

    const notifData = notifications[type];
    if (notifData) {
      await this.createNotification(
        'collaboration',
        notifData.title,
        notifData.message,
        targetUserId,
        funnelId,
        undefined,
        data
      );
    }
  }

  /**
   * 💬 Enviar mensagem de chat
   */
  async sendChatMessage(
    funnelId: string,
    userId: string,
    userName: string,
    userAvatar: string | undefined,
    message: string,
    replyTo?: string
  ): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      funnelId,
      userId,
      userName,
      userAvatar,
      message,
      timestamp: new Date(),
      edited: false,
      replyTo,
      mentions: this.extractMentions(message),
      reactions: []
    };

    const funnelMessages = this.chatMessages.get(funnelId) || [];
    funnelMessages.push(chatMessage);
    this.chatMessages.set(funnelId, funnelMessages);

    // Emitir evento
    this.emit('chat_message', chatMessage);

    // Enviar notificações para usuários mencionados
    if (chatMessage.mentions && chatMessage.mentions.length > 0) {
      for (const mentionedUserId of chatMessage.mentions) {
        await this.createNotification(
          'collaboration',
          'Você foi mencionado',
          `${userName} mencionou você no chat`,
          mentionedUserId,
          funnelId,
          undefined,
          { messageId: chatMessage.id, userName }
        );
      }
    }

    console.log(`💬 Mensagem de chat enviada: ${chatMessage.id}`);
    return chatMessage;
  }

  /**
   * 💭 Adicionar comentário
   */
  async addComment(
    funnelId: string,
    stageId: string | undefined,
    blockId: string | undefined,
    userId: string,
    userName: string,
    userAvatar: string | undefined,
    content: string
  ): Promise<Comment> {
    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      funnelId,
      stageId,
      blockId,
      userId,
      userName,
      userAvatar,
      content,
      timestamp: new Date(),
      edited: false,
      resolved: false,
      replies: []
    };

    const funnelComments = this.comments.get(funnelId) || [];
    funnelComments.push(comment);
    this.comments.set(funnelId, funnelComments);

    // Emitir evento
    this.emit('comment_added', comment);

    console.log(`💭 Comentário adicionado: ${comment.id}`);
    return comment;
  }

  /**
   * ✅ Resolver comentário
   */
  async resolveComment(
    commentId: string,
    resolvedBy: string
  ): Promise<boolean> {
    for (const [funnelId, comments] of this.comments) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.resolved = true;
        comment.resolvedBy = resolvedBy;
        comment.resolvedAt = new Date();

        // Emitir evento
        this.emit('comment_resolved', comment);

        console.log(`✅ Comentário resolvido: ${commentId}`);
        return true;
      }
    }

    return false;
  }

  /**
   * 👥 Atualizar presença
   */
  async updatePresence(
    userId: string,
    userName: string,
    userAvatar: string | undefined,
    isOnline: boolean,
    cursor?: PresenceUpdate['cursor']
  ): Promise<void> {
    const presence: PresenceUpdate = {
      userId,
      userName,
      userAvatar,
      isOnline,
      lastSeen: new Date(),
      cursor
    };

    this.presence.set(userId, presence);

    // Emitir evento
    this.emit('presence_updated', presence);

    console.log(`👥 Presença atualizada: ${userId} - ${isOnline ? 'online' : 'offline'}`);
  }

  /**
   * 📊 Obter notificações do usuário
   */
  getUserNotifications(userId: string, funnelId?: string): Notification[] {
    const userNotifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId);

    if (funnelId) {
      return userNotifications.filter(n => n.funnelId === funnelId);
    }

    return userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * 📧 Marcar notificação como lida
   */
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
      this.emit('notification_read', notification);
      return true;
    }
    return false;
  }

  /**
   * 💬 Obter mensagens de chat
   */
  getChatMessages(funnelId: string, limit: number = 50): ChatMessage[] {
    const messages = this.chatMessages.get(funnelId) || [];
    return messages
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-limit);
  }

  /**
   * 💭 Obter comentários
   */
  getComments(funnelId: string, stageId?: string, blockId?: string): Comment[] {
    const comments = this.comments.get(funnelId) || [];
    
    if (stageId) {
      return comments.filter(c => c.stageId === stageId);
    }
    
    if (blockId) {
      return comments.filter(c => c.blockId === blockId);
    }
    
    return comments;
  }

  /**
   * 👥 Obter presença dos usuários
   */
  getPresence(funnelId: string): PresenceUpdate[] {
    return Array.from(this.presence.values())
      .filter(p => p.isOnline)
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  /**
   * 🔍 Extrair menções da mensagem
   */
  private extractMentions(message: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(message)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  /**
   * 📡 Sistema de eventos
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Erro no listener do evento ${event}:`, error);
        }
      });
    }
  }

  /**
   * 🧹 Limpar notificações expiradas
   */
  private cleanupExpiredNotifications(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [id, notification] of this.notifications) {
      if (notification.expiresAt && notification.expiresAt < now) {
        this.notifications.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 ${cleanedCount} notificações expiradas removidas`);
    }
  }

  /**
   * 📊 Estatísticas
   */
  getStats(funnelId?: string) {
    const stats = {
      totalNotifications: 0,
      unreadNotifications: 0,
      totalChatMessages: 0,
      totalComments: 0,
      activeUsers: 0
    };

    // Notificações
    const notifications = Array.from(this.notifications.values());
    if (funnelId) {
      stats.totalNotifications = notifications.filter(n => n.funnelId === funnelId).length;
      stats.unreadNotifications = notifications.filter(n => n.funnelId === funnelId && !n.read).length;
    } else {
      stats.totalNotifications = notifications.length;
      stats.unreadNotifications = notifications.filter(n => !n.read).length;
    }

    // Chat
    if (funnelId) {
      stats.totalChatMessages = (this.chatMessages.get(funnelId) || []).length;
      stats.totalComments = (this.comments.get(funnelId) || []).length;
    } else {
      stats.totalChatMessages = Array.from(this.chatMessages.values())
        .reduce((sum, messages) => sum + messages.length, 0);
      stats.totalComments = Array.from(this.comments.values())
        .reduce((sum, comments) => sum + comments.length, 0);
    }

    // Usuários ativos
    stats.activeUsers = Array.from(this.presence.values())
      .filter(p => p.isOnline).length;

    return stats;
  }
}

// Instância singleton
export const notificationService = new NotificationService();
