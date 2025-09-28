/**
 * 🚀 USE UNIFIED COLLABORATION - Hook de Colaboração em Tempo Real
 * 
 * Funcionalidades:
 * - Gerenciamento de sessões de colaboração
 * - Sincronização de mudanças
 * - Controle de permissões
 * - Notificações em tempo real
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { collaborationService, CollaborationSession, CollaborationUser, CollaborationChange } from '../../services/CollaborationService';
import { permissionService, UserPermission } from '../../services/PermissionService';
import { notificationService, Notification, ChatMessage, Comment, PresenceUpdate } from '../../services/NotificationService';

export interface CollaborationState {
  // Sessão
  session: CollaborationSession | null;
  isConnected: boolean;
  connectionError: string | null;
  
  // Usuários
  users: CollaborationUser[];
  activeUsers: CollaborationUser[];
  currentUser: CollaborationUser | null;
  
  // Permissões
  permissions: UserPermission[];
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canManage: boolean;
  
  // Notificações
  notifications: Notification[];
  unreadCount: number;
  
  // Chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  
  // Comentários
  comments: Comment[];
  selectedElementComments: Comment[];
  
  // Presença
  presence: PresenceUpdate[];
  userCursors: Map<string, PresenceUpdate['cursor']>;
  
  // Estados
  isLoading: boolean;
  isSaving: boolean;
  lastSync: Date | null;
  conflictCount: number;
}

export interface CollaborationActions {
  // Sessão
  createSession: (funnelId: string) => Promise<CollaborationSession>;
  joinSession: (sessionId: string, user: Omit<CollaborationUser, 'isOnline' | 'lastSeen' | 'cursor'>) => Promise<boolean>;
  leaveSession: () => Promise<boolean>;
  
  // Permissões
  grantPermission: (userId: string, roleId: string, expiresAt?: Date) => Promise<boolean>;
  revokePermission: (userId: string) => Promise<boolean>;
  createInvitation: (email: string, roleId: string, expiresInHours?: number) => Promise<any>;
  
  // Mudanças
  trackChange: (type: CollaborationChange['type'], entityType: CollaborationChange['entityType'], entityId: string, changes: Record<string, any>) => Promise<void>;
  updateCursor: (stageId: string, blockId?: string, position?: { x: number; y: number }) => Promise<void>;
  
  // Notificações
  markNotificationAsRead: (notificationId: string) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  // Chat
  sendMessage: (message: string, replyTo?: string) => Promise<ChatMessage>;
  toggleChat: () => void;
  
  // Comentários
  addComment: (stageId: string, blockId: string | undefined, content: string) => Promise<Comment>;
  resolveComment: (commentId: string) => Promise<boolean>;
  selectElement: (stageId: string, blockId?: string) => void;
  
  // Sincronização
  sync: () => Promise<void>;
  resolveConflicts: () => Promise<void>;
}

export function useUnifiedCollaboration(
  funnelId: string,
  userId: string,
  userName: string,
  userEmail: string,
  userAvatar?: string
): CollaborationState & CollaborationActions {
  
  // Estados
  const [state, setState] = useState<CollaborationState>({
    session: null,
    isConnected: false,
    connectionError: null,
    users: [],
    activeUsers: [],
    currentUser: null,
    permissions: [],
    canEdit: false,
    canDelete: false,
    canInvite: false,
    canManage: false,
    notifications: [],
    unreadCount: 0,
    chatMessages: [],
    isChatOpen: false,
    comments: [],
    selectedElementComments: [],
    presence: [],
    userCursors: new Map(),
    isLoading: true,
    isSaving: false,
    lastSync: null,
    conflictCount: 0
  });

  const [selectedElement, setSelectedElement] = useState<{ stageId: string; blockId?: string } | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventListenersRef = useRef<Map<string, Function>>(new Map());

  /**
   * 🎯 Inicializar colaboração
   */
  useEffect(() => {
    initializeCollaboration();
    return () => cleanup();
  }, [funnelId, userId]);

  /**
   * 🔄 Sincronização automática
   */
  useEffect(() => {
    if (state.isConnected) {
      startAutoSync();
    } else {
      stopAutoSync();
    }
    
    return () => stopAutoSync();
  }, [state.isConnected]);

  /**
   * 🎯 Inicializar colaboração
   */
  const initializeCollaboration = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, connectionError: null }));

      // Verificar permissões
      const permissions = permissionService.getUserPermissions(userId, funnelId);
      const canEdit = await permissionService.hasPermission(userId, funnelId, 'funnel', 'update');
      const canDelete = await permissionService.hasPermission(userId, funnelId, 'funnel', 'delete');
      const canInvite = await permissionService.hasPermission(userId, funnelId, 'collaboration', 'invite');
      const canManage = await permissionService.hasPermission(userId, funnelId, 'collaboration', 'manage');

      // Carregar notificações
      const notifications = notificationService.getUserNotifications(userId, funnelId);
      const unreadCount = notifications.filter(n => !n.read).length;

      // Carregar chat
      const chatMessages = notificationService.getChatMessages(funnelId);

      // Carregar comentários
      const comments = notificationService.getComments(funnelId);

      // Carregar presença
      const presence = notificationService.getPresence(funnelId);

      setState(prev => ({
        ...prev,
        permissions,
        canEdit,
        canDelete,
        canInvite,
        canManage,
        notifications,
        unreadCount,
        chatMessages,
        comments,
        presence,
        isLoading: false
      }));

      // Configurar listeners
      setupEventListeners();

      console.log('✅ Colaboração inicializada para funnel:', funnelId);
    } catch (error) {
      console.error('❌ Erro ao inicializar colaboração:', error);
      setState(prev => ({
        ...prev,
        connectionError: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoading: false
      }));
    }
  };

  /**
   * 📡 Configurar listeners de eventos
   */
  const setupEventListeners = () => {
    // Notificações
    const notificationListener = (notification: Notification) => {
      if (notification.userId === userId && notification.funnelId === funnelId) {
        setState(prev => ({
          ...prev,
          notifications: [notification, ...prev.notifications],
          unreadCount: prev.unreadCount + 1
        }));
      }
    };

    // Chat
    const chatListener = (message: ChatMessage) => {
      if (message.funnelId === funnelId) {
        setState(prev => ({
          ...prev,
          chatMessages: [...prev.chatMessages, message]
        }));
      }
    };

    // Comentários
    const commentListener = (comment: Comment) => {
      if (comment.funnelId === funnelId) {
        setState(prev => ({
          ...prev,
          comments: [...prev.comments, comment]
        }));
      }
    };

    // Presença
    const presenceListener = (presence: PresenceUpdate) => {
      setState(prev => {
        const updatedPresence = prev.presence.filter(p => p.userId !== presence.userId);
        if (presence.isOnline) {
          updatedPresence.push(presence);
        }
        
        return {
          ...prev,
          presence: updatedPresence
        };
      });
    };

    // Registrar listeners
    notificationService.on('notification_created', notificationListener);
    notificationService.on('chat_message', chatListener);
    notificationService.on('comment_added', commentListener);
    notificationService.on('presence_updated', presenceListener);

    // Armazenar referências para cleanup
    eventListenersRef.current.set('notification_created', notificationListener);
    eventListenersRef.current.set('chat_message', chatListener);
    eventListenersRef.current.set('comment_added', commentListener);
    eventListenersRef.current.set('presence_updated', presenceListener);
  };

  /**
   * 🧹 Cleanup
   */
  const cleanup = () => {
    stopAutoSync();
    
    // Remover listeners
    for (const [event, listener] of eventListenersRef.current) {
      notificationService.off(event, listener);
    }
    eventListenersRef.current.clear();
  };

  /**
   * 🎯 Criar sessão
   */
  const createSession = useCallback(async (funnelId: string): Promise<CollaborationSession> => {
    const session = await collaborationService.createSession(funnelId, userId);
    
    // Adicionar usuário atual
    const currentUser: CollaborationUser = {
      id: userId,
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      role: 'owner',
      isOnline: true,
      lastSeen: new Date()
    };

    await collaborationService.addUserToSession(session.id, currentUser, 'owner');
    
    setState(prev => ({
      ...prev,
      session,
      isConnected: true,
      currentUser,
      users: [currentUser],
      activeUsers: [currentUser]
    }));

    return session;
  }, [userId, userName, userEmail, userAvatar]);

  /**
   * 👥 Entrar na sessão
   */
  const joinSession = useCallback(async (
    sessionId: string, 
    user: Omit<CollaborationUser, 'isOnline' | 'lastSeen' | 'cursor'>
  ): Promise<boolean> => {
    try {
      const success = await collaborationService.addUserToSession(sessionId, user, 'editor');
      
      if (success) {
        const session = collaborationService.sessions.get(sessionId);
        if (session) {
          setState(prev => ({
            ...prev,
            session,
            isConnected: true,
            currentUser: user as CollaborationUser,
            users: session.users,
            activeUsers: session.users.filter(u => u.isOnline)
          }));
        }
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao entrar na sessão:', error);
      return false;
    }
  }, []);

  /**
   * 🚪 Sair da sessão
   */
  const leaveSession = useCallback(async (): Promise<boolean> => {
    if (!state.session) return false;
    
    try {
      const success = await collaborationService.removeUserFromSession(state.session.id, userId);
      
      if (success) {
        setState(prev => ({
          ...prev,
          session: null,
          isConnected: false,
          currentUser: null,
          users: [],
          activeUsers: []
        }));
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao sair da sessão:', error);
      return false;
    }
  }, [state.session, userId]);

  /**
   * 🔐 Conceder permissão
   */
  const grantPermission = useCallback(async (
    userId: string, 
    roleId: string, 
    expiresAt?: Date
  ): Promise<boolean> => {
    return await permissionService.grantPermission(userId, funnelId, roleId, userId, expiresAt);
  }, [funnelId, userId]);

  /**
   * 🚫 Revogar permissão
   */
  const revokePermission = useCallback(async (userId: string): Promise<boolean> => {
    return await permissionService.revokePermission(userId, funnelId, userId);
  }, [funnelId, userId]);

  /**
   * 📧 Criar convite
   */
  const createInvitation = useCallback(async (
    email: string, 
    roleId: string, 
    expiresInHours: number = 72
  ) => {
    return await permissionService.createInvitation(funnelId, email, roleId, userId, expiresInHours);
  }, [funnelId, userId]);

  /**
   * 📝 Rastrear mudança
   */
  const trackChange = useCallback(async (
    type: CollaborationChange['type'],
    entityType: CollaborationChange['entityType'],
    entityId: string,
    changes: Record<string, any>
  ): Promise<void> => {
    if (!state.session) return;
    
    try {
      setState(prev => ({ ...prev, isSaving: true }));
      
      await collaborationService.trackChange(
        state.session.id,
        userId,
        type,
        entityType,
        entityId,
        changes
      );
      
      setState(prev => ({ 
        ...prev, 
        isSaving: false, 
        lastSync: new Date() 
      }));
    } catch (error) {
      console.error('❌ Erro ao rastrear mudança:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [state.session, userId]);

  /**
   * 🎯 Atualizar cursor
   */
  const updateCursor = useCallback(async (
    stageId: string, 
    blockId?: string, 
    position?: { x: number; y: number }
  ): Promise<void> => {
    if (!state.session) return;
    
    const cursor = position ? { stageId, blockId, position } : undefined;
    await collaborationService.updateUserCursor(state.session.id, userId, cursor);
  }, [state.session, userId]);

  /**
   * 🔔 Marcar notificação como lida
   */
  const markNotificationAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    const success = await notificationService.markNotificationAsRead(notificationId);
    
    if (success) {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    }
    
    return success;
  }, []);

  /**
   * 📧 Marcar todas as notificações como lidas
   */
  const markAllNotificationsAsRead = useCallback(async (): Promise<void> => {
    const unreadNotifications = state.notifications.filter(n => !n.read);
    
    for (const notification of unreadNotifications) {
      await notificationService.markNotificationAsRead(notification.id);
    }
    
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  }, [state.notifications]);

  /**
   * 💬 Enviar mensagem
   */
  const sendMessage = useCallback(async (
    message: string, 
    replyTo?: string
  ): Promise<ChatMessage> => {
    return await notificationService.sendChatMessage(
      funnelId,
      userId,
      userName,
      userAvatar,
      message,
      replyTo
    );
  }, [funnelId, userId, userName, userAvatar]);

  /**
   * 💬 Toggle chat
   */
  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }));
  }, []);

  /**
   * 💭 Adicionar comentário
   */
  const addComment = useCallback(async (
    stageId: string, 
    blockId: string | undefined, 
    content: string
  ): Promise<Comment> => {
    return await notificationService.addComment(
      funnelId,
      stageId,
      blockId,
      userId,
      userName,
      userAvatar,
      content
    );
  }, [funnelId, userId, userName, userAvatar]);

  /**
   * ✅ Resolver comentário
   */
  const resolveComment = useCallback(async (commentId: string): Promise<boolean> => {
    return await notificationService.resolveComment(commentId, userId);
  }, [userId]);

  /**
   * 🎯 Selecionar elemento
   */
  const selectElement = useCallback((stageId: string, blockId?: string) => {
    setSelectedElement({ stageId, blockId });
    
    // Carregar comentários do elemento
    const elementComments = notificationService.getComments(funnelId, stageId, blockId);
    
    setState(prev => ({
      ...prev,
      selectedElementComments: elementComments
    }));
  }, [funnelId]);

  /**
   * 🔄 Sincronizar
   */
  const sync = useCallback(async (): Promise<void> => {
    if (!state.isConnected) return;
    
    try {
      setState(prev => ({ ...prev, isSaving: true }));
      
      // Aqui seria a lógica de sincronização com o servidor
      // Por enquanto, apenas atualizar timestamp
      
      setState(prev => ({ 
        ...prev, 
        isSaving: false, 
        lastSync: new Date() 
      }));
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [state.isConnected]);

  /**
   * 🔧 Resolver conflitos
   */
  const resolveConflicts = useCallback(async (): Promise<void> => {
    // Implementar lógica de resolução de conflitos
    console.log('🔧 Resolvendo conflitos...');
  }, []);

  /**
   * 🔄 Iniciar sincronização automática
   */
  const startAutoSync = useCallback(() => {
    if (syncIntervalRef.current) return;
    
    syncIntervalRef.current = setInterval(() => {
      sync();
    }, 30000); // 30 segundos
  }, [sync]);

  /**
   * ⏹️ Parar sincronização automática
   */
  const stopAutoSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
  }, []);

  return {
    ...state,
    createSession,
    joinSession,
    leaveSession,
    grantPermission,
    revokePermission,
    createInvitation,
    trackChange,
    updateCursor,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendMessage,
    toggleChat,
    addComment,
    resolveComment,
    selectElement,
    sync,
    resolveConflicts
  };
}
