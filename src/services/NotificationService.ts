export type Notification = {
  id?: string;
  funnelId?: string;
  userId?: string;
  read?: boolean;
  type?: string;
  payload?: any;
};

export type ChatMessage = {
  id?: string;
  userId?: string;
  /** Nome canônico para exibição (Compatibilidade com CollaborationPanel). */
  userName?: string;
  /** Avatar do usuário (Compatibilidade). */
  userAvatar?: string;
  /** Texto da mensagem (forma antiga). */
  text?: string;
  /** Alias usado em alguns componentes. */
  message?: string;
  /** Timestamp ISO (Compatibilidade). */
  timestamp?: string;
  /** Campo legado */
  createdAt?: string;
};

export type Comment = {
  id?: string;
  stageId?: string;
  blockId?: string | null;
  userId?: string;
  content?: string;
  resolved?: boolean;
};

export type PresenceUpdate = {
  userId?: string;
  funnelId?: string;
  cursor?: { x: number; y: number } | null;
  isOnline?: boolean;
};

export const notificationService = {
  subscribe: (_cb: (n: Notification) => void) => ({ unsubscribe: () => { } }),
  on: (_event: string, _cb: (...args: any[]) => void) => ({ unsubscribe: () => { } }),
  off: (_event: string, _cb: (...args: any[]) => void) => { },

  getUserNotifications: (userId: string, funnelId?: string): Notification[] => [],
  getChatMessages: (funnelId?: string): ChatMessage[] => [],
  getComments: (funnelId?: string): Comment[] => [],
  getPresence: (funnelId?: string): PresenceUpdate[] => [],

  markNotificationAsRead: async (_id: string) => true,
  sendChatMessage: async (_funnelId: string, _text: string) => ({ id: 'msg-1' } as ChatMessage),
  addComment: async (_stageId: string, _blockId: string | undefined, _content: string) => ({ id: 'c-1' } as Comment),
  resolveComment: async (_commentId: string) => true,
  send: (_n: Notification) => Promise.resolve(true),
};
