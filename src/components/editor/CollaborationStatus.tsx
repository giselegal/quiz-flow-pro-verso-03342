import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Eye, 
  Edit, 
  Crown, 
  UserPlus,
  Wifi,
  WifiOff
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  isOnline: boolean;
  lastSeen: string;
  cursor?: {
    x: number;
    y: number;
    color: string;
  };
}

interface CollaborationStatusProps {
  projectId: string;
}

export const CollaborationStatus: React.FC<CollaborationStatusProps> = ({ projectId }) => {
  const { profile } = useAuth();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simular colaboradores online (na implementação real, usar WebSocket/Supabase Realtime)
    const mockCollaborators: Collaborator[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        role: 'editor',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        cursor: { x: 150, y: 200, color: '#3B82F6' }
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        role: 'viewer',
        isOnline: true,
        lastSeen: new Date().toISOString(),
        cursor: { x: 300, y: 150, color: '#EF4444' }
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        role: 'admin',
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 min ago
      }
    ];

    setCollaborators(mockCollaborators);

    // Simular conexão em tempo real
    const interval = setInterval(() => {
      setCollaborators(current => 
        current.map(c => ({
          ...c,
          cursor: c.isOnline ? {
            ...c.cursor!,
            x: Math.random() * 800,
            y: Math.random() * 600
          } : undefined
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [projectId]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3" />;
      case 'editor': return <Edit className="h-3 w-3" />;
      case 'viewer': return <Eye className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'default';
      case 'viewer': return 'secondary';
      default: return 'secondary';
    }
  };

  const onlineCollaborators = collaborators.filter(c => c.isOnline);

  return (
    <div className="space-y-4">
      {/* Status de Conexão */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Conectado</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Desconectado</span>
          </>
        )}
        <Badge variant="outline" className="ml-auto">
          {onlineCollaborators.length} online
        </Badge>
      </div>

      {/* Lista de Colaboradores */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Colaboradores</h4>
          <Button variant="ghost" size="sm">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        {/* Você */}
        {profile && (
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {profile.name?.[0] || profile.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                Você ({profile.name || profile.email})
              </p>
            </div>
            <Badge variant="default" className="text-xs">
              {getRoleIcon(profile.role)}
              <span className="ml-1">{profile.role}</span>
            </Badge>
          </div>
        )}

        {/* Outros Colaboradores */}
        {collaborators.map((collaborator) => (
          <div 
            key={collaborator.id} 
            className={`flex items-center gap-2 p-2 rounded-md ${
              collaborator.isOnline ? 'bg-green-50' : 'bg-muted/50'
            }`}
          >
            <div className="relative">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {collaborator.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {collaborator.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{collaborator.name}</p>
              <p className="text-xs text-muted-foreground">
                {collaborator.isOnline 
                  ? 'Online agora' 
                  : `Visto ${new Date(collaborator.lastSeen).toLocaleTimeString()}`
                }
              </p>
            </div>
            
            <Badge variant={getRoleColor(collaborator.role) as any} className="text-xs">
              {getRoleIcon(collaborator.role)}
              <span className="ml-1">{collaborator.role}</span>
            </Badge>
          </div>
        ))}
      </div>

      {/* Cursores dos Colaboradores (para mostrar no canvas) */}
      {onlineCollaborators.map((collaborator) => 
        collaborator.cursor && (
          <div
            key={`cursor-${collaborator.id}`}
            className="absolute pointer-events-none z-50"
            style={{
              left: collaborator.cursor.x,
              top: collaborator.cursor.y,
              color: collaborator.cursor.color
            }}
          >
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: collaborator.cursor.color }}
              ></div>
              <span 
                className="text-xs font-medium px-2 py-1 rounded text-white"
                style={{ backgroundColor: collaborator.cursor.color }}
              >
                {collaborator.name}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};
