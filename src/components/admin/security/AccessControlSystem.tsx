import React, { createContext, useContext, useState } from 'react';

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

interface PermissionsContextType {
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  addPermission: (permission: Permission) => void;
  removePermission: (id: string) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const hasPermission = (resource: string, action: string) => {
    return permissions.some(p => p.resource === resource && p.action === action);
  };

  const addPermission = (permission: Permission) => {
    setPermissions(prev => [...prev, permission]);
  };

  const removePermission = (id: string) => {
    setPermissions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        hasPermission,
        addPermission,
        removePermission,
      }}
    >
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

const AccessControlSystem: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Sistema de Controle de Acesso</h2>
      <p style={{ color: '#6B4F43' }}>Sistema de controle de acesso em desenvolvimento...</p>
    </div>
  );
};

export default AccessControlSystem;
