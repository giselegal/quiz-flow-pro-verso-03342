/**
 * NOTIFICATION SERVICE - Sistema Canônico de Notificações
 * 
 * Consolida: NotificationSystemService (1 serviço)
 * 
 * Funcionalidades:
 * - Notificações em tempo real (info, success, warning, error, collaboration, system)
 * - Sistema de chat integrado com menções e reações
 * - Comentários em elementos (stages, blocks) com resolução
 * - Presença de usuários online/offline
 * - Sistema de eventos pub/sub
 * - Limpeza automática de notificações expiradas
 */

import { BaseCanonicalService, ServiceResult } from './types';
import { appLogger } from '@/lib/utils/appLogger';
import { generateNotificationId, generateChatId, generateCommentId } from '@/lib/utils/idGenerator';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'collaboration' | 'system';
export type NotificationActionType = 'navigate' | 'open' | 'accept' | 'decline' | 'dismiss';
export type CollaborationType = 'user_joined' | 'user_left' | 'change_made' | 'conflict_detected' | 'invitation_sent';

export interface Notification {
  id: string;
  type: NotificationType;
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
  type: NotificationActionType;
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

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  totalChatMessages: number;
  totalComments: number;
  unresolvedComments: number;
  activeUsers: number;
}

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

export class NotificationService extends BaseCanonicalService {
  private static instance: NotificationService;
  private notificationList: Map<string, Notification> = new Map();
  private chatMessageList: Map<string, ChatMessage[]> = new Map();
  private commentList: Map<string, Comment[]> = new Map();
  private presenceList: Map<string, PresenceUpdate> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_NOTIFICATIONS = 1000;
  private readonly MAX_MESSAGES_PER_FUNNEL = 500;
  private readonly MAX_COMMENTS_PER_FUNNEL = 500;
  
  private cleanupTimer?: NodeJS.Timeout;

  private constructor() {
    super('NotificationService', '1.0.0', { debug: false });
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('Initializing NotificationService...');
    
    // Start cleanup timer
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredNotifications();
    }, this.CLEANUP_INTERVAL);
    
    this.log('NotificationService initialized successfully');
  }

  protected async onDispose(): Promise<void> {
    this.log('Disposing NotificationService...');
    
    // Stop cleanup timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    // Clear all data
    this.notificationList.clear();
    this.chatMessageList.clear();
    this.commentList.clear();
    this.presenceList.clear();
    this.eventListeners.clear();
  }

  async healthCheck(): Promise<boolean> {
    return this.state === 'ready';
  }

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  /**
   * Create a new notification
   */
  createNotification(params: {
    type: NotificationType;
    title: string;
    message: string;
    userId: string;
    funnelId: string;
    action?: NotificationAction;
    metadata?: Record<string, any>;
    expiresInMinutes?: number;
  }): ServiceResult<Notification> {
    try {
      const notification: Notification = {
        id: generateNotificationId(),
        type: params.type,
        title: params.title,
        message: params.message,
        userId: params.userId,
        funnelId: params.funnelId,
        read: false,
        createdAt: new Date(),
        action: params.action,
        metadata: params.metadata,
      };

      if (params.expiresInMinutes) {
        notification.expiresAt = new Date(Date.now() + params.expiresInMinutes * 60 * 1000);
      }

      this.notificationList.set(notification.id, notification);
      this.pruneNotifications();

      // Emit event
      this.emit('notification_created', notification);

      if (this.options.debug) {
        this.log(`Notification created: ${notification.id} for user ${params.userId}`);
      }

      return { success: true, data: notification };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to create notification'),
      };
    }
  }

  /**
   * Send collaboration notification
   */
  sendCollaborationNotification(
    type: CollaborationType,
    funnelId: string,
    targetUserId: string,
    data: Record<string, any>,
  ): ServiceResult<Notification> {
    const templates: Record<CollaborationType, { title: string; message: string }> = {
      user_joined: {
        title: 'Novo colaborador',
        message: `${data.userName} entrou na sessão de colaboração`,
      },
      user_left: {
        title: 'Colaborador saiu',
        message: `${data.userName} saiu da sessão de colaboração`,
      },
      change_made: {
        title: 'Mudança detectada',
        message: `${data.userName} fez uma alteração em ${data.entityType}`,
      },
      conflict_detected: {
        title: 'Conflito detectado',
        message: 'Foi detectado um conflito que requer sua atenção',
      },
      invitation_sent: {
        title: 'Convite enviado',
        message: `Convite enviado para ${data.email}`,
      },
    };

    const template = templates[type];
    if (!template) {
      return {
        success: false,
        error: new Error(`Unknown collaboration type: ${type}`),
      };
    }

    return this.createNotification({
      type: 'collaboration',
      title: template.title,
      message: template.message,
      userId: targetUserId,
      funnelId,
      metadata: data,
    });
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId: string, funnelId?: string): ServiceResult<Notification[]> {
    try {
      let notifications = Array.from(this.notificationList.values())
        .filter(n => n.userId === userId);

      if (funnelId) {
        notifications = notifications.filter(n => n.funnelId === funnelId);
      }

      notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return { success: true, data: notifications };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get notifications'),
      };
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): ServiceResult<void> {
    const notification = this.notificationList.get(notificationId);
    if (!notification) {
      return {
        success: false,
        error: new Error('Notification not found'),
      };
    }

    notification.read = true;
    this.emit('notification_read', notification);

    return { success: true, data: undefined };
  }

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string, funnelId?: string): ServiceResult<number> {
    try {
      let count = 0;
      
      for (const notification of this.notificationList.values()) {
        if (notification.userId === userId && !notification.read) {
          if (!funnelId || notification.funnelId === funnelId) {
            notification.read = true;
            count++;
          }
        }
      }

      if (this.options.debug) {
        this.log(`Marked ${count} notifications as read for user ${userId}`);
      }

      return { success: true, data: count };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to mark notifications as read'),
      };
    }
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): ServiceResult<void> {
    const deleted = this.notificationList.delete(notificationId);
    if (!deleted) {
      return {
        success: false,
        error: new Error('Notification not found'),
      };
    }

    this.emit('notification_deleted', { notificationId });
    return { success: true, data: undefined };
  }

  // ============================================================================
  // CHAT MESSAGES
  // ============================================================================

  /**
   * Send chat message
   */
  sendMessage(params: {
    funnelId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    message: string;
    replyTo?: string;
  }): ServiceResult<ChatMessage> {
    try {
      const chatMessage: ChatMessage = {
        id: generateChatId(),
        funnelId: params.funnelId,
        userId: params.userId,
        userName: params.userName,
        userAvatar: params.userAvatar,
        message: params.message,
        timestamp: new Date(),
        edited: false,
        replyTo: params.replyTo,
        mentions: this.extractMentions(params.message),
        reactions: [],
      };

      const funnelMessages = this.chatMessageList.get(params.funnelId) || [];
      funnelMessages.push(chatMessage);
      this.chatMessageList.set(params.funnelId, funnelMessages);
      this.pruneMessages(params.funnelId);

      // Emit event
      this.emit('chat_message', chatMessage);

      // Send notifications for mentions
      if (chatMessage.mentions && chatMessage.mentions.length > 0) {
        for (const mentionedUserId of chatMessage.mentions) {
          this.createNotification({
            type: 'collaboration',
            title: 'Você foi mencionado',
            message: `${params.userName} mencionou você no chat`,
            userId: mentionedUserId,
            funnelId: params.funnelId,
            metadata: { messageId: chatMessage.id, userName: params.userName },
          });
        }
      }

      if (this.options.debug) {
        this.log(`Chat message sent: ${chatMessage.id}`);
      }

      return { success: true, data: chatMessage };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to send message'),
      };
    }
  }

  /**
   * Get chat messages for a funnel
   */
  getMessages(funnelId: string, limit: number = 50): ServiceResult<ChatMessage[]> {
    try {
      const messages = this.chatMessageList.get(funnelId) || [];
      const sortedMessages = messages
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(-limit);

      return { success: true, data: sortedMessages };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get messages'),
      };
    }
  }

  /**
   * Add reaction to message
   */
  addReaction(messageId: string, funnelId: string, emoji: string, userId: string): ServiceResult<void> {
    const messages = this.chatMessageList.get(funnelId);
    if (!messages) {
      return {
        success: false,
        error: new Error('Funnel not found'),
      };
    }

    const message = messages.find(m => m.id === messageId);
    if (!message) {
      return {
        success: false,
        error: new Error('Message not found'),
      };
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions?.find(
      r => r.emoji === emoji && r.userId === userId,
    );

    if (existingReaction) {
      return {
        success: false,
        error: new Error('User already reacted with this emoji'),
      };
    }

    if (!message.reactions) {
      message.reactions = [];
    }

    message.reactions.push({
      emoji,
      userId,
      timestamp: new Date(),
    });

    this.emit('reaction_added', { messageId, emoji, userId });

    return { success: true, data: undefined };
  }

  // ============================================================================
  // COMMENTS
  // ============================================================================

  /**
   * Add comment to a stage or block
   */
  addComment(params: {
    funnelId: string;
    stageId?: string;
    blockId?: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
  }): ServiceResult<Comment> {
    try {
      const comment: Comment = {
        id: generateCommentId(),
        funnelId: params.funnelId,
        stageId: params.stageId,
        blockId: params.blockId,
        userId: params.userId,
        userName: params.userName,
        userAvatar: params.userAvatar,
        content: params.content,
        timestamp: new Date(),
        edited: false,
        resolved: false,
        replies: [],
      };

      const funnelComments = this.commentList.get(params.funnelId) || [];
      funnelComments.push(comment);
      this.commentList.set(params.funnelId, funnelComments);
      this.pruneComments(params.funnelId);

      // Emit event
      this.emit('comment_added', comment);

      if (this.options.debug) {
        this.log(`Comment added: ${comment.id}`);
      }

      return { success: true, data: comment };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to add comment'),
      };
    }
  }

  /**
   * Get comments for a funnel, stage, or block
   */
  getComments(funnelId: string, stageId?: string, blockId?: string): ServiceResult<Comment[]> {
    try {
      let comments = this.commentList.get(funnelId) || [];

      if (stageId) {
        comments = comments.filter(c => c.stageId === stageId);
      }

      if (blockId) {
        comments = comments.filter(c => c.blockId === blockId);
      }

      return { success: true, data: comments };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get comments'),
      };
    }
  }

  /**
   * Resolve a comment
   */
  resolveComment(commentId: string, resolvedBy: string): ServiceResult<void> {
    for (const comments of this.commentList.values()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.resolved = true;
        comment.resolvedBy = resolvedBy;
        comment.resolvedAt = new Date();

        this.emit('comment_resolved', comment);

        if (this.options.debug) {
          this.log(`Comment resolved: ${commentId}`);
        }

        return { success: true, data: undefined };
      }
    }

    return {
      success: false,
      error: new Error('Comment not found'),
    };
  }

  /**
   * Edit a comment
   */
  editComment(commentId: string, newContent: string): ServiceResult<void> {
    for (const comments of this.commentList.values()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.content = newContent;
        comment.edited = true;
        comment.editedAt = new Date();

        this.emit('comment_edited', comment);

        return { success: true, data: undefined };
      }
    }

    return {
      success: false,
      error: new Error('Comment not found'),
    };
  }

  // ============================================================================
  // PRESENCE
  // ============================================================================

  /**
   * Update user presence
   */
  updatePresence(params: {
    userId: string;
    userName: string;
    userAvatar?: string;
    isOnline: boolean;
    cursor?: PresenceUpdate['cursor'];
  }): ServiceResult<void> {
    try {
      const presence: PresenceUpdate = {
        userId: params.userId,
        userName: params.userName,
        userAvatar: params.userAvatar,
        isOnline: params.isOnline,
        lastSeen: new Date(),
        cursor: params.cursor,
      };

      this.presenceList.set(params.userId, presence);

      // Emit event
      this.emit('presence_updated', presence);

      if (this.options.debug) {
        this.log(`Presence updated: ${params.userId} - ${params.isOnline ? 'online' : 'offline'}`);
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to update presence'),
      };
    }
  }

  /**
   * Get online users
   */
  getOnlineUsers(): ServiceResult<PresenceUpdate[]> {
    try {
      const onlineUsers = Array.from(this.presenceList.values())
        .filter(p => p.isOnline)
        .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());

      return { success: true, data: onlineUsers };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get online users'),
      };
    }
  }

  /**
   * Get user presence
   */
  getUserPresence(userId: string): ServiceResult<PresenceUpdate | null> {
    try {
      const presence = this.presenceList.get(userId) || null;
      return { success: true, data: presence };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get user presence'),
      };
    }
  }

  // ============================================================================
  // EVENTS
  // ============================================================================

  /**
   * Subscribe to events
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          appLogger.error(`Error in event listener for ${event}:`, { data: [error] });
        }
      });
    }
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  /**
   * Get notification statistics
   */
  getStats(funnelId?: string): ServiceResult<NotificationStats> {
    try {
      const stats: NotificationStats = {
        totalNotifications: 0,
        unreadNotifications: 0,
        totalChatMessages: 0,
        totalComments: 0,
        unresolvedComments: 0,
        activeUsers: 0,
      };

      // Notifications
      const notifications = Array.from(this.notificationList.values());
      if (funnelId) {
        const funnelNotifs = notifications.filter(n => n.funnelId === funnelId);
        stats.totalNotifications = funnelNotifs.length;
        stats.unreadNotifications = funnelNotifs.filter(n => !n.read).length;
      } else {
        stats.totalNotifications = notifications.length;
        stats.unreadNotifications = notifications.filter(n => !n.read).length;
      }

      // Chat messages
      if (funnelId) {
        stats.totalChatMessages = (this.chatMessageList.get(funnelId) || []).length;
      } else {
        stats.totalChatMessages = Array.from(this.chatMessageList.values())
          .reduce((sum, messages) => sum + messages.length, 0);
      }

      // Comments
      if (funnelId) {
        const funnelComments = this.commentList.get(funnelId) || [];
        stats.totalComments = funnelComments.length;
        stats.unresolvedComments = funnelComments.filter(c => !c.resolved).length;
      } else {
        const allComments = Array.from(this.commentList.values()).flat();
        stats.totalComments = allComments.length;
        stats.unresolvedComments = allComments.filter(c => !c.resolved).length;
      }

      // Active users
      stats.activeUsers = Array.from(this.presenceList.values())
        .filter(p => p.isOnline).length;

      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Failed to get stats'),
      };
    }
  }

  // ============================================================================
  // SPECIALIZED APIS
  // ============================================================================

  readonly notifications = {
    create: (params: Parameters<NotificationService['createNotification']>[0]) => 
      this.createNotification(params),
    
    sendCollaboration: (
      type: CollaborationType,
      funnelId: string,
      targetUserId: string,
      data: Record<string, any>,
    ) => this.sendCollaborationNotification(type, funnelId, targetUserId, data),
    
    get: (userId: string, funnelId?: string) => 
      this.getUserNotifications(userId, funnelId),
    
    markAsRead: (notificationId: string) => 
      this.markAsRead(notificationId),
    
    markAllAsRead: (userId: string, funnelId?: string) => 
      this.markAllAsRead(userId, funnelId),
    
    delete: (notificationId: string) => 
      this.deleteNotification(notificationId),
  };

  readonly chat = {
    send: (params: Parameters<NotificationService['sendMessage']>[0]) => 
      this.sendMessage(params),
    
    get: (funnelId: string, limit?: number) => 
      this.getMessages(funnelId, limit),
    
    addReaction: (messageId: string, funnelId: string, emoji: string, userId: string) => 
      this.addReaction(messageId, funnelId, emoji, userId),
  };

  readonly comments = {
    add: (params: Parameters<NotificationService['addComment']>[0]) => 
      this.addComment(params),
    
    get: (funnelId: string, stageId?: string, blockId?: string) => 
      this.getComments(funnelId, stageId, blockId),
    
    resolve: (commentId: string, resolvedBy: string) => 
      this.resolveComment(commentId, resolvedBy),
    
    edit: (commentId: string, newContent: string) => 
      this.editComment(commentId, newContent),
  };

  readonly presence = {
    update: (params: Parameters<NotificationService['updatePresence']>[0]) => 
      this.updatePresence(params),
    
    getOnline: () => 
      this.getOnlineUsers(),
    
    getUser: (userId: string) => 
      this.getUserPresence(userId),
  };

  readonly stats = {
    get: (funnelId?: string) => 
      this.getStats(funnelId),
  };

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Extract mentions from message (@username)
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
   * Cleanup expired notifications
   */
  private cleanupExpiredNotifications(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [id, notification] of this.notificationList) {
      if (notification.expiresAt && notification.expiresAt < now) {
        this.notificationList.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0 && this.options.debug) {
      this.log(`Cleaned up ${cleanedCount} expired notifications`);
    }
  }

  /**
   * Prune notifications to max limit
   */
  private pruneNotifications(): void {
    if (this.notificationList.size > this.MAX_NOTIFICATIONS) {
      const sorted = Array.from(this.notificationList.entries())
        .sort((a, b) => b[1].createdAt.getTime() - a[1].createdAt.getTime());
      
      const toKeep = sorted.slice(0, this.MAX_NOTIFICATIONS);
      this.notificationList = new Map(toKeep);
    }
  }

  /**
   * Prune messages for a funnel
   */
  private pruneMessages(funnelId: string): void {
    const messages = this.chatMessageList.get(funnelId);
    if (messages && messages.length > this.MAX_MESSAGES_PER_FUNNEL) {
      const pruned = messages.slice(-this.MAX_MESSAGES_PER_FUNNEL);
      this.chatMessageList.set(funnelId, pruned);
    }
  }

  /**
   * Prune comments for a funnel
   */
  private pruneComments(funnelId: string): void {
    const comments = this.commentList.get(funnelId);
    if (comments && comments.length > this.MAX_COMMENTS_PER_FUNNEL) {
      const pruned = comments.slice(-this.MAX_COMMENTS_PER_FUNNEL);
      this.commentList.set(funnelId, pruned);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
