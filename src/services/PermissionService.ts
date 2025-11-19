export type UserPermission = {
  id?: string;
  resource?: string;
  actions?: string[];
};

export const permissionService = {
  has: (_p: string) => false,
  getUserPermissions: (userId: string, funnelId?: string): UserPermission[] => [],
  hasPermission: async (_userId: string, _funnelId: string | undefined, _resource: string, _action: string) => false,
  grantPermission: async (_userId: string, _funnelId: string | undefined, _roleId: string, _expiresAt?: Date) => true,
  revokePermission: async (_userId: string, _funnelId?: string) => true,
  createInvitation: async (_funnelId: string, _email: string, _roleId: string, _expiresInHours?: number) => ({ id: 'inv-1' }),
};
