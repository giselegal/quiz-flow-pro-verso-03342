export type CollaborationUser = any;
export type CollaborationChange = any;
export type CollaborationSession = { users: CollaborationUser[] };

export const collaborationService = {
  subscribe: (_cb: (s: CollaborationSession) => void) => ({ unsubscribe: () => {} }),
};
