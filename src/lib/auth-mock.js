// Este arquivo fornece uma implementação de autenticação mock para contornar
// erros relacionados à autenticação durante o build

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      return true; // Permitir acesso a todas as rotas durante o build
    },
  },
  providers: [], // Sem provedores reais
};

// Mock da sessão de usuário para build
export function auth() {
  return {
    auth: {
      user: {
        name: 'Build User',
        email: 'build@example.com',
        role: 'admin',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

// Mock para useSession
export function useSession() {
  return {
    data: {
      user: {
        name: 'Build User',
        email: 'build@example.com',
        role: 'admin',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    status: 'authenticated',
    update: () => Promise.resolve(true),
  };
}
