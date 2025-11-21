/**
 * 🚀 COLLABORATION PANEL - Interface de Colaboração em Tempo Real
 * 
 * Funcionalidades:
 * - Lista de usuários online
 * - Chat integrado
 * - Sistema de comentários
 * - Notificações
 * - Controle de permissões
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  MessageCircle,
  Bell,
  Settings,
  UserPlus,
  Crown,
  Edit,
  Eye,
  MoreHorizontal,
  Send,
  X,
  Check,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useUnifiedCollaboration } from '@/hooks/core/useUnifiedCollaboration';
import type { CollaborationUser } from '@/services/CollaborationService';
import type { ChatMessage } from '@/services/NotificationService';

interface CollaborationPanelProps {
  funnelId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Tipos agora importados de serviços centrais (unificação de modelo de colaboração)

// Subcomponentes memoizados para reduzir re-render do painel principal
const UsersList: React.FC<{ users: CollaborationUser[]; canManage: boolean; currentUserId: string; onSelect: (id: string) => void; canInvite: boolean; onInvite: () => void; activeCount: number }>
  = React.memo(({ users, canManage, currentUserId, onSelect, canInvite, onInvite, activeCount }) => {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Usuários Online ({activeCount})</h3>
            {canInvite && (
              <button
                onClick={onInvite}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4" />
                <span>Convidar</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="text-gray-600 font-medium">{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{user.name}</span>
                  {user.role === 'owner' && <Crown className="w-4 h-4 text-yellow-500" />}
                  {user.role === 'editor' && <Edit className="w-4 h-4 text-blue-500" />}
                  {user.role === 'viewer' && <Eye className="w-4 h-4 text-gray-500" />}
                </div>
                <div className="text-sm text-gray-500">
                  {user.role === 'owner' ? 'Proprietário' : user.role === 'editor' ? 'Editor' : 'Visualizador'}
                </div>
              </div>
              {canManage && user.id && user.id !== currentUserId && onSelect && (
                <button onClick={() => onSelect(user.id!)} className="p-1 hover:bg-gray-200 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  });

const ChatMessages: React.FC<{ messages: ChatMessage[] }> = React.memo(({ messages }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-3">
    {messages.map(message => (
      <div key={message.id} className="flex space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          {message.userAvatar ? (
            <img src={message.userAvatar} alt={message.userName || 'Usuário'} className="w-8 h-8 rounded-full" />
          ) : (
            <span className="text-gray-600 text-sm">{(message.userName || 'U').charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{message.userName || 'Anônimo'}</span>
            <span className="text-xs text-gray-500">{message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : '--:--'}</span>
          </div>
          <div className="text-sm text-gray-700 mt-1">{message.message}</div>
        </div>
      </div>
    ))}
  </div>
));

const CommentsList: React.FC<{ comments: any[]; canEdit: boolean; onResolve: (id: string) => void }> = React.memo(({ comments, canEdit, onResolve }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {comments.map(comment => (
      <div key={comment.id} className="border rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            {comment.userAvatar ? (
              <img src={comment.userAvatar} alt={comment.userName} className="w-6 h-6 rounded-full" />
            ) : (
              <span className="text-gray-600 text-xs">{comment.userName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <span className="font-medium text-sm">{comment.userName}</span>
          <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
          {comment.resolved && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Resolvido</span>
          )}
        </div>
        <div className="text-sm text-gray-700 mb-2">{comment.content}</div>
        {!comment.resolved && canEdit && (
          <button onClick={() => onResolve(comment.id)} className="text-xs text-blue-600 hover:text-blue-800">
            Marcar como resolvido
          </button>
        )}
      </div>
    ))}
  </div>
));

const NotificationsList: React.FC<{ notifications: any[]; unreadCount: number; onMarkAll: () => void; onMarkOne: (id: string) => void }> = React.memo(({ notifications, unreadCount, onMarkAll, onMarkOne }) => (
  <div className="h-full flex flex-col">
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Notificações</h3>
        {unreadCount > 0 && (
          <button onClick={onMarkAll} className="text-sm text-blue-600 hover:text-blue-800">Marcar todas como lidas</button>
        )}
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhuma notificação</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-3 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'warning' ? 'bg-yellow-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  {notification.action && (
                    <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">{notification.action.label}</button>
                  )}
                </div>
                {!notification.read && (
                  <button onClick={() => onMarkOne(notification.id)} className="p-1 hover:bg-gray-200 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
));

const SettingsPanel: React.FC<{ isConnected: boolean; lastSync: Date | null; conflictCount: number; canEdit: boolean; canDelete: boolean; canInvite: boolean; canManage: boolean; isSaving: boolean; sync: () => Promise<void>; resolveConflicts: () => Promise<void>; leaveSession: () => Promise<boolean>; }> = React.memo((props) => {
  const { isConnected, lastSync, conflictCount, canEdit, canDelete, canInvite, canManage, isSaving, sync, resolveConflicts, leaveSession } = props;
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b"><h3 className="font-medium">Configurações de Colaboração</h3></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h4 className="font-medium mb-3">Status da Sessão</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-sm">Conectado</span><span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>{isConnected ? 'Sim' : 'Não'}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Última sincronização</span><span className="text-sm text-gray-500">{lastSync ? lastSync.toLocaleString() : 'Nunca'}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Conflitos pendentes</span><span className={`text-sm ${conflictCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{conflictCount}</span></div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Suas Permissões</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-sm">Editar</span><span className={`text-sm ${canEdit ? 'text-green-600' : 'text-red-600'}`}>{canEdit ? 'Sim' : 'Não'}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Excluir</span><span className={`text-sm ${canDelete ? 'text-green-600' : 'text-red-600'}`}>{canDelete ? 'Sim' : 'Não'}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Convidar</span><span className={`text-sm ${canInvite ? 'text-green-600' : 'text-red-600'}`}>{canInvite ? 'Sim' : 'Não'}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">Gerenciar</span><span className={`text-sm ${canManage ? 'text-green-600' : 'text-red-600'}`}>{canManage ? 'Sim' : 'Não'}</span></div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Ações</h4>
          <div className="space-y-2">
            <button onClick={sync} disabled={isSaving} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Sincronizando...' : 'Sincronizar Agora'}</button>
            {conflictCount > 0 && <button onClick={resolveConflicts} className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Resolver Conflitos ({conflictCount})</button>}
            <button onClick={leaveSession} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Sair da Sessão</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export function CollaborationPanel({
  funnelId,
  userId,
  userName,
  userEmail,
  userAvatar,
  isOpen,
  onClose,
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'comments' | 'notifications' | 'settings'>('users');
  const [chatMessage, setChatMessage] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');

  const {
    // Estado
    session,
    isConnected,
    users,
    activeUsers,
    currentUser,
    permissions,
    canEdit,
    canDelete,
    canInvite,
    canManage,
    notifications,
    unreadCount,
    chatMessages,
    isChatOpen,
    comments,
    selectedElementComments,
    presence,
    userCursors,
    isLoading,
    isSaving,
    lastSync,
    conflictCount,

    // Ações
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
    resolveConflicts,
  } = useUnifiedCollaboration(funnelId, userId, userName, userEmail, userAvatar);

  // Inicializar sessão se não estiver conectado
  useEffect(() => {
    if (!isConnected && !isLoading) {
      createSession(funnelId);
    }
  }, [isConnected, isLoading, createSession, funnelId]);

  // Handlers
  const handleSendMessage = useCallback(async () => {
    if (!chatMessage.trim()) return;
    await sendMessage(chatMessage);
    setChatMessage('');
  }, [chatMessage, sendMessage]);

  const handleAddComment = useCallback(async () => {
    if (!commentContent.trim()) return;
    await addComment('current-stage', undefined, commentContent);
    setCommentContent('');
  }, [commentContent, addComment]);

  const handleInviteUser = useCallback(async () => {
    if (!inviteEmail.trim()) return;
    await createInvitation(inviteEmail, inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
  }, [inviteEmail, inviteRole, createInvitation]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  }, []);

  // Memoizar coleções para evitar recomputação em cada render
  const memoActiveUsers = useMemo(() => activeUsers, [activeUsers]);
  const memoChatMessages = useMemo(() => chatMessages, [chatMessages]);
  const memoComments = useMemo(() => comments, [comments]);
  const memoNotifications = useMemo(() => notifications, [notifications]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Colaboração</h2>
            {isConnected && (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Conectado</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'chat', label: 'Chat', icon: MessageCircle },
            { id: 'comments', label: 'Comentários', icon: MessageCircle },
            { id: 'notifications', label: 'Notificações', icon: Bell },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {id === 'notifications' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Usuários */}
          {activeTab === 'users' && (
            <UsersList
              users={memoActiveUsers as CollaborationUser[]}
              canManage={canManage}
              currentUserId={userId}
              onSelect={setSelectedUser}
              canInvite={canInvite}
              onInvite={() => setShowInviteModal(true)}
              activeCount={memoActiveUsers.length}
            />
          )}

          {/* Chat */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              <ChatMessages messages={memoChatMessages as ChatMessage[]} />
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comentários */}
          {activeTab === 'comments' && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b"><h3 className="font-medium">Comentários</h3></div>
              <CommentsList comments={memoComments} canEdit={canEdit} onResolve={resolveComment} />
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddComment)}
                    placeholder="Adicionar comentário..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentContent.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notifications' && (
            <NotificationsList
              notifications={memoNotifications}
              unreadCount={unreadCount}
              onMarkAll={markAllNotificationsAsRead}
              onMarkOne={markNotificationAsRead}
            />
          )}

          {/* Configurações */}
          {activeTab === 'settings' && (
            <SettingsPanel
              isConnected={isConnected}
              lastSync={lastSync}
              conflictCount={conflictCount}
              canEdit={canEdit}
              canDelete={canDelete}
              canInvite={canInvite}
              canManage={canManage}
              isSaving={isSaving}
              sync={sync}
              resolveConflicts={resolveConflicts}
              leaveSession={leaveSession}
            />
          )}
        </div>
      </div>

      {/* Modal de Convite */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Convidar Usuário</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Função</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Visualizador</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleInviteUser}
                disabled={!inviteEmail.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Enviar Convite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
