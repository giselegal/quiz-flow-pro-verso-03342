
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [user, setUser] = useState<User | null>(null);

  // Safe localStorage access with useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('userName');
      const savedEmail = localStorage.getItem('userEmail');
      const savedRole = localStorage.getItem('userRole');
      
      if (savedName) {
        setUser({ 
          userName: savedName,
          ...(savedEmail && { email: savedEmail }),
          ...(savedRole && { role: savedRole })
        });
      }
    }
  }, []);

  const login = (name: string, email?: string) => {
    const userData: User = { 
      userName: name 
    };
    
    if (email) {
      userData.email = email;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', email);
      }
    }
    
    // Preservar o status de admin caso exista
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('userRole');
      if (savedRole) {
        userData.role = savedRole;
      }
      localStorage.setItem('userName', name);
    }
    
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
    }
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
