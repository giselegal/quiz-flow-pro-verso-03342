
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

interface PermissionsContextType {
  user: User | null;
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  setUser: (user: User | null) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions] = useState<Permission[]>([]);

  const hasPermission = (resource: string, action: string) => {
    if (!user) return false;
    return user.permissions.includes(`${resource}:${action}`);
  };

  return (
    <PermissionsContext.Provider value={{ user, permissions, hasPermission, setUser }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export const ProtectedComponent: React.FC<{
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ resource, action, children, fallback }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action)) {
    return fallback || null;
  }

  return <>{children}</>;
};
