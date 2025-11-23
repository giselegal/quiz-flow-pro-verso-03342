import React, { createContext, useContext, ReactNode } from 'react';

interface CollaborationContextType {
  isCollaborating: boolean;
  collaborators: any[];
  startCollaboration: () => void;
  stopCollaboration: () => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const CollaborationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollaborating, setIsCollaborating] = React.useState(false);
  const [collaborators] = React.useState<any[]>([]);

  const startCollaboration = () => {
    setIsCollaborating(true);
  };

  const stopCollaboration = () => {
    setIsCollaborating(false);
  };

  return (
    <CollaborationContext.Provider value={{ 
      isCollaborating, 
      collaborators, 
      startCollaboration, 
      stopCollaboration 
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};
