/**
 * 👥 CollaboratorAvatars - Avatares dos colaboradores online
 * 
 * Exibe os usuários que estão editando o mesmo quiz em tempo real.
 */

import React, { memo, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Users, Wifi, WifiOff } from 'lucide-react';
import type { PresenceUser } from '../hooks/useSupabasePresence';

interface CollaboratorAvatarsProps {
  collaborators: PresenceUser[];
  isConnected: boolean;
  maxVisible?: number;
  className?: string;
}

export const CollaboratorAvatars = memo(function CollaboratorAvatars({
  collaborators,
  isConnected,
  maxVisible = 4,
  className = '',
}: CollaboratorAvatarsProps) {
  const activeCollaborators = useMemo(() => 
    collaborators.filter(c => c.isActive),
    [collaborators]
  );

  const visibleCollaborators = activeCollaborators.slice(0, maxVisible);
  const remainingCount = activeCollaborators.length - maxVisible;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Status de conexão */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              ${isConnected 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }
            `}>
              {isConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isConnected ? 'Conectado ao servidor' : 'Sem conexão'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Avatares dos colaboradores */}
        {activeCollaborators.length > 0 && (
          <div className="flex items-center -space-x-2">
            {visibleCollaborators.map((collaborator) => (
              <Tooltip key={collaborator.id}>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Avatar 
                      className="w-8 h-8 border-2 cursor-pointer hover:z-10 transition-transform hover:scale-110"
                      style={{ 
                        borderColor: collaborator.color,
                        boxShadow: `0 0 0 2px ${collaborator.color}40`,
                      }}
                    >
                      <AvatarImage 
                        src={collaborator.avatar} 
                        alt={collaborator.name} 
                      />
                      <AvatarFallback 
                        style={{ backgroundColor: collaborator.color + '20', color: collaborator.color }}
                        className="text-xs font-medium"
                      >
                        {getInitials(collaborator.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Indicador de atividade */}
                    <span 
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background"
                      style={{ backgroundColor: collaborator.isActive ? '#22C55E' : '#9CA3AF' }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">{collaborator.name}</p>
                    {collaborator.currentStepId && (
                      <p className="text-muted-foreground text-xs">
                        Editando: Step {collaborator.currentStepId}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Contador de colaboradores extras */}
            {remainingCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground cursor-pointer"
                  >
                    +{remainingCount}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Mais {remainingCount} colaboradores:</p>
                    <ul className="text-xs text-muted-foreground">
                      {activeCollaborators.slice(maxVisible).map(c => (
                        <li key={c.id}>{c.name}</li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        {/* Contador total */}
        {activeCollaborators.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{activeCollaborators.length + 1}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{activeCollaborators.length + 1} usuários online (incluindo você)</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
});

export default CollaboratorAvatars;
