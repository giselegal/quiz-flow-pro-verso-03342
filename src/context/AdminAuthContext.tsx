import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  email: string;
  authenticated: boolean;
  loginTime: Date;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Automaticamente autenticar como admin (acesso livre)
    const autoLogin = () => {
      const user: AdminUser = {
        email: 'admin@local.dev',
        authenticated: true,
        loginTime: new Date(),
      };
      setAdminUser(user);
    };

    autoLogin();
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Sempre retorna sucesso (acesso livre)
    const user: AdminUser = {
      email: email || 'admin@local.dev',
      authenticated: true,
      loginTime: new Date(),
    };
    setAdminUser(user);
    return true;
  };

  const adminLogout = () => {
    // Não faz logout real, apenas simula
    console.log('Logout simulado - acesso continua livre');
  };

  const isAdminAuthenticated = true; // Sempre autenticado

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
