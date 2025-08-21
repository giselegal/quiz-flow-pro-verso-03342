import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FolderOpen, 
  Settings, 
  Users, 
  Calendar, 
  MoreHorizontal,
  Search
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  owner_name: string;
  collaborators: Array<{
    id: string;
    name: string;
    role: 'viewer' | 'editor' | 'admin';
  }>;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  type: 'quiz' | 'funnel' | 'landing';
}

export const ProjectWorkspace: React.FC = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProjects();
  }, [profile]);

  const loadUserProjects = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // Simular carregamento de projetos do usuário
      // Na implementação real, buscar do Supabase
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Quiz de Estilo Pessoal',
          description: 'Quiz completo com 21 etapas para descoberta de estilo',
          owner_id: profile.id,
          owner_name: profile.name || 'Você',
          collaborators: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'draft',
          type: 'quiz'
        },
        {
          id: '2',
          name: 'Funil de Consultoria',
          description: 'Funil de vendas para serviços de consultoria',
          owner_id: profile.id,
          owner_name: profile.name || 'Você',
          collaborators: [
            { id: '2', name: 'João Silva', role: 'editor' },
            { id: '3', name: 'Maria Santos', role: 'viewer' }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'published',
          type: 'funnel'
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'published': return 'default';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🎯';
      case 'funnel': return '🌊';
      case 'landing': return '🚀';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus quizzes, funis e landing pages
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(project.type)}</span>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      por {project.owner_name}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
              
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(project.status) as any}>
                  {project.status}
                </Badge>
                <Badge variant="outline">{project.type}</Badge>
              </div>

              {project.collaborators.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{project.collaborators.length} colaboradores</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Atualizado {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button asChild className="flex-1" size="sm">
                  <a href={`/editor-unified?project=${project.id}`}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Abrir
                  </a>
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Tente ajustar sua busca' : 'Crie seu primeiro projeto para começar'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Projeto
          </Button>
        </div>
      )}
    </div>
  );
};
