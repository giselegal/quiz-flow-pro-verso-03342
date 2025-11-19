export type CollaborationUser = {
  id?: string;
  name?: string;
  avatar?: string | null;
  isOnline?: boolean;
  lastSeen?: string | null;
  cursor?: { x: number; y: number } | null;
};

export type CollaborationChange = {
  type: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
};

export type CollaborationSession = {
  id?: string;
  users: CollaborationUser[];
};

export const collaborationService = {
  subscribe: (cb: (s: CollaborationSession) => void) => ({ unsubscribe: () => {} }),
  createSession: async (funnelId: string, userId?: string) => ({ id: `session-${funnelId}`, users: [] } as CollaborationSession),
  addUserToSession: async (sessionId: string, user: CollaborationUser, role?: string) => true,
  getSession: (sessionId: string) => ({ id: sessionId, users: [] } as CollaborationSession),
  removeUserFromSession: async (sessionId: string, userId: string) => true,
  trackChange: async (_type: string, _entityType: string, _entityId: string, _changes: Record<string, any>) => {},
  updateUserCursor: async (_sessionId: string, _userId: string, _cursor: any) => {},
};
