
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  userName: string;
  email?: string; // Added email as optional property
  role?: string;  // Added role property for admin access
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');
    
    return savedName ? { 
      userName: savedName,
      ...(savedEmail && { email: savedEmail }),
      ...(savedRole && { role: savedRole })
    } : null;
  });

  const login = (name: string, email?: string) => {
    const userData: User = { 
      userName: name 
    };
    
    if (email) {
      userData.email = email;
      localStorage.setItem('userEmail', email);
    }
    
    // Preservar o status de admin caso exista
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      userData.role = savedRole;
    }
    
    setUser(userData);
    localStorage.setItem('userName', name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
