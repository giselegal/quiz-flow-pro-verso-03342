export type Notification = any;
export type ChatMessage = any;
export type Comment = any;
export type PresenceUpdate = any;

export const notificationService = {
  subscribe: (_cb: (n: Notification) => void) => ({ unsubscribe: () => {} }),
  send: (_n: Notification) => Promise.resolve(true),
};
