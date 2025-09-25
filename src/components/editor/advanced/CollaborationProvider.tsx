import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Wifi, WifiOff, Eye } from 'lucide-react';

interface CollaboratorInfo {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  lastSeen: Date;
  currentStep?: number;
  editingBlock?: string;
}

interface CollaborationState {
  collaborators: CollaboratorInfo[];
  isOnline: boolean;
  currentUser: CollaboratorInfo | null;
}

interface CollaborationContextValue {
  state: CollaborationState;
  actions: {
    updateUserPresence: (stepNumber: number, blockId?: string) => void;
    addComment: (blockId: string, content: string) => void;
    resolveComment: (commentId: string) => void;
  };
}

const CollaborationContext = createContext<CollaborationContextValue | null>(null);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};

interface CollaborationProviderProps {
  children: React.ReactNode;
  userId: string;
  userName: string;
  userAvatar?: string;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  children,
  userId,
  userName,
  userAvatar,
}) => {
  const [state, setState] = useState<CollaborationState>({
    collaborators: [],
    isOnline: true,
    currentUser: {
      id: userId,
      name: userName,
      avatar: userAvatar,
      color: '#3b82f6',
      isActive: true,
      lastSeen: new Date(),
    },
  });

  // Simulate real-time collaborators
  useEffect(() => {
    const mockCollaborators: CollaboratorInfo[] = [
      {
        id: 'user-2',
        name: 'Maria Silva',
        avatar: undefined,
        color: '#ef4444',
        isActive: true,
        lastSeen: new Date(),
        currentStep: 3,
        editingBlock: 'block-123',
      },
      {
        id: 'user-3',
        name: 'João Santos',
        avatar: undefined,
        color: '#10b981',
        isActive: false,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        currentStep: 1,
      },
    ];

    setState(prev => ({
      ...prev,
      collaborators: mockCollaborators,
    }));
  }, []);

  const updateUserPresence = useCallback((stepNumber: number, blockId?: string) => {
    setState(prev => ({
      ...prev,
      currentUser: prev.currentUser ? {
        ...prev.currentUser,
        currentStep: stepNumber,
        editingBlock: blockId,
        lastSeen: new Date(),
      } : null,
    }));
  }, []);

  const addComment = useCallback((blockId: string, content: string) => {
    console.log('💬 Adding comment to block:', blockId, content);
    // Implementation would handle real comments
  }, []);

  const resolveComment = useCallback((commentId: string) => {
    console.log('✅ Resolving comment:', commentId);
    // Implementation would resolve comments
  }, []);

  const contextValue: CollaborationContextValue = {
    state,
    actions: {
      updateUserPresence,
      addComment,
      resolveComment,
    },
  };

  return (
    <CollaborationContext.Provider value={contextValue}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const CollaborationStatus: React.FC = () => {
  const { state } = useCollaboration();
  const { collaborators, isOnline, currentUser } = state;

  const activeCollaborators = collaborators.filter(c => c.isActive);
  const totalUsers = activeCollaborators.length + (currentUser ? 1 : 0);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3 px-4 py-2 bg-background/95 backdrop-blur-sm border rounded-lg">
        {/* Online Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Collaborators Count */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <Badge variant="secondary" className="text-xs">
            {totalUsers} {totalUsers === 1 ? 'usuário' : 'usuários'}
          </Badge>
        </div>

        {/* Active Collaborators */}
        <div className="flex items-center -space-x-2">
          {activeCollaborators.slice(0, 3).map((collaborator) => (
            <Tooltip key={collaborator.id}>
              <TooltipTrigger>
                <div
                  className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-semibold text-white"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.avatar ? (
                    <img 
                      src={collaborator.avatar} 
                      alt={collaborator.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    collaborator.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div className="font-medium">{collaborator.name}</div>
                  {collaborator.currentStep && (
                    <div className="text-muted-foreground">
                      Editando Step {collaborator.currentStep}
                    </div>
                  )}
                  {collaborator.editingBlock && (
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Visualizando bloco
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {activeCollaborators.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-semibold">
              +{activeCollaborators.length - 3}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};