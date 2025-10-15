/**
 * Mock Supabase Client
 * Usado quando credenciais não estão disponíveis
 */

const mockAuthResponse = {
  data: { user: null, session: null },
  error: new Error('Supabase not configured')
};

const mockQueryResponse = {
  data: null,
  error: new Error('Supabase not configured'),
  count: null,
  status: 500,
  statusText: 'Not configured'
};

export function createMockSupabaseClient() {
  const mockAuth = {
    getSession: () => Promise.resolve(mockAuthResponse),
    getUser: () => Promise.resolve(mockAuthResponse),
    signUp: () => Promise.resolve(mockAuthResponse),
    signInWithPassword: () => Promise.resolve(mockAuthResponse),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: any) => {
      // Call immediately with no user
      setTimeout(() => callback('SIGNED_OUT', null), 0);
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }
  };

  const mockQuery = {
    select: () => mockQuery,
    insert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    eq: () => mockQuery,
    single: () => Promise.resolve(mockQueryResponse),
    then: (resolve: any) => resolve(mockQueryResponse)
  };

  const mockFrom = () => mockQuery;

  return {
    auth: mockAuth,
    from: mockFrom,
    storage: {
      from: () => ({
        upload: () => Promise.resolve(mockQueryResponse),
        download: () => Promise.resolve(mockQueryResponse),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  } as any;
}
