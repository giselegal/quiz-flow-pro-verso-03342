import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  MoreVertical,
  Filter,
  TrendingUp,
  Users,
  Target,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../../../lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Funnel {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'draft' | 'paused';
  created_at: string;
  updated_at: string;
  pages_count?: number;
  conversion_rate?: number;
  total_visitors?: number;
}

interface FunnelPage {
  id: string;
  funnel_id: string;
  name: string;
  slug: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const FunnelPanelPage: React.FC = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);
  const [newFunnel, setNewFunnel] = useState({
    name: '',
    description: '',
    status: 'draft' as const
  });
  const { toast } = useToast();

  // Função para garantir que existe um usuário autenticado
  const ensureAuthenticatedUser = async () => {
    try {
      // Verificar se já existe um usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (user) {
        return user;
      }

      // Se não há usuário autenticado, fazer login anônimo ou criar um usuário temporário
      // Para desenvolvimento, vamos usar um usuário fixo
      const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
      
      if (signInError) {
        console.warn('Erro ao fazer login anônimo:', signInError);
        // Retornar um ID fixo para desenvolvimento
        return { id: '00000000-0000-0000-0000-000000000000' };
      }

      return signInData.user;
    } catch (error) {
      console.warn('Erro na autenticação:', error);
      // Retornar um ID fixo para desenvolvimento
      return { id: '00000000-0000-0000-0000-000000000000' };
    }
  };

  // Carregar funis do Supabase
  const loadFunnels = async () => {
    try {
      setLoading(true);
      
      // Buscar funis
      const { data: funnelsData, error: funnelsError } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (funnelsError) throw funnelsError;

      // Buscar contagem de páginas para cada funil
      const funnelsWithCounts = await Promise.all(
        (funnelsData || []).map(async (funnel) => {
          const { count, error: countError } = await supabase
            .from('funnel_pages')
            .select('*', { count: 'exact', head: true })
            .eq('funnel_id', funnel.id);

          if (countError) {
            console.warn(`Erro ao contar páginas do funil ${funnel.id}:`, countError);
          }

          return {
            ...funnel,
            pages_count: count || 0,
            conversion_rate: Math.random() * 15 + 5, // Mock data
            total_visitors: Math.floor(Math.random() * 1000) + 100 // Mock data
          };
        })
      );

      setFunnels(funnelsWithCounts);
    } catch (error) {
      console.error('Erro ao carregar funis:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os funis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar novo funil
  const createFunnel = async () => {
    try {
      // Garantir que existe um usuário autenticado
      const user = await ensureAuthenticatedUser();
      
      if (!user) {
        toast({
          title: "Erro de Autenticação",
          description: "Não foi possível autenticar o usuário.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('funnels')
        .insert([{
          ...newFunnel,
          user_id: user.id,
          is_published: newFunnel.status === 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setFunnels(prev => [data, ...prev]);
      setIsCreateDialogOpen(false);
      setNewFunnel({ name: '', description: '', status: 'draft' });
      
      toast({
        title: "Sucesso",
        description: "Funil criado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar funil:', error);
      toast({
        title: "Erro",
        description: `Não foi possível criar o funil: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  // Atualizar funil
  const updateFunnel = async () => {
    if (!selectedFunnel) return;

    try {
      const { data, error } = await supabase
        .from('funnels')
        .update({
          name: selectedFunnel.name,
          description: selectedFunnel.description,
          status: selectedFunnel.status
        })
        .eq('id', selectedFunnel.id)
        .select()
        .single();

      if (error) throw error;

      setFunnels(prev => prev.map(f => f.id === selectedFunnel.id ? data : f));
      setIsEditDialogOpen(false);
      setSelectedFunnel(null);
      
      toast({
        title: "Sucesso",
        description: "Funil atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar funil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o funil.",
        variant: "destructive",
      });
    }
  };

  // Excluir funil
  const deleteFunnel = async (funnelId: string) => {
    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', funnelId);

      if (error) throw error;

      setFunnels(prev => prev.filter(f => f.id !== funnelId));
      
      toast({
        title: "Sucesso",
        description: "Funil excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir funil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o funil.",
        variant: "destructive",
      });
    }
  };

  // Duplicar funil
  const duplicateFunnel = async (funnel: Funnel) => {
o /ediotr     try {
      // Garantir que existe um usuário autenticado
      const user = await ensureAuthenticatedUser();
      
      if (!user) {
        toast({
          title: "Erro de Autenticação",
          description: "Não foi possível autenticar o usuário.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('funnels')
        .insert([{
          name: `${funnel.name} (Cópia)`,
          description: funnel.description,
          status: 'draft',
          user_id: user.id,
          is_published: false
        }])
        .select()
        .single();

      if (error) throw error;

      setFunnels(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Funil duplicado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao duplicar funil:', error);
      toast({
        title: "Erro",
        description: `Não foi possível duplicar o funil: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadFunnels();
  }, []);

  // Filtrar funis
  const filteredFunnels = funnels.filter(funnel => {
    const matchesSearch = funnel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funnel.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || funnel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'draft': return 'Rascunho';
      case 'paused': return 'Pausado';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#432818]">Painel de Funis</h1>
          <p className="text-[#8F7A6A] mt-1">Gerencie seus funis de vendas e páginas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#B89B7A] hover:bg-[#9F836A] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Funil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Funil</DialogTitle>
              <DialogDescription>
                Crie um novo funil de vendas para organizar suas páginas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Funil</Label>
                <Input
                  id="name"
                  value={newFunnel.name}
                  onChange={(e) => setNewFunnel(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Funil de Vendas Principal"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newFunnel.description}
                  onChange={(e) => setNewFunnel(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o objetivo deste funil..."
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newFunnel.status} onValueChange={(value: any) => setNewFunnel(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createFunnel} disabled={!newFunnel.name}>
                Criar Funil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Total de Funis</p>
                <p className="text-2xl font-bold text-[#432818]">{funnels.length}</p>
              </div>
              <Target className="w-8 h-8 text-[#B89B7A]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Funis Ativos</p>
                <p className="text-2xl font-bold text-[#432818]">
                  {funnels.filter(f => f.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Total de Páginas</p>
                <p className="text-2xl font-bold text-[#432818]">
                  {funnels.reduce((acc, f) => acc + (f.pages_count || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-[#B89B7A]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F7A6A]">Taxa Conversão Média</p>
                <p className="text-2xl font-bold text-[#432818]">
                  {funnels.length > 0 
                    ? (funnels.reduce((acc, f) => acc + (f.conversion_rate || 0), 0) / funnels.length).toFixed(1)
                    : '0'
                  }%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar funis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="paused">Pausado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Funis */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mx-auto"></div>
            <p className="mt-4 text-[#8F7A6A]">Carregando funis...</p>
          </div>
        </div>
      ) : filteredFunnels.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-[#B89B7A] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#432818] mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum funil encontrado' : 'Nenhum funil criado'}
            </h3>
            <p className="text-[#8F7A6A] mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando seu primeiro funil de vendas.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#B89B7A] hover:bg-[#9F836A] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Funil
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFunnels.map((funnel) => (
            <Card key={funnel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#432818] mb-1">{funnel.name}</CardTitle>
                    <Badge className={getStatusColor(funnel.status)}>
                      {getStatusText(funnel.status)}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        // Navegar para o editor com o ID do funil
                        window.location.href = `/editor/${funnel.id}`;
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar no Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedFunnel(funnel);
                        setIsEditDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Informações
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateFunnel(funnel)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteFunnel(funnel.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {funnel.description && (
                  <p className="text-sm text-[#8F7A6A] mb-4 line-clamp-2">{funnel.description}</p>
                )}
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[#432818]">{funnel.pages_count || 0}</p>
                    <p className="text-xs text-[#8F7A6A]">Páginas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[#432818]">{funnel.total_visitors || 0}</p>
                    <p className="text-xs text-[#8F7A6A]">Visitantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[#432818]">{funnel.conversion_rate?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-[#8F7A6A]">Conversão</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[#B89B7A] hover:bg-[#9F836A] text-white"
                    onClick={() => {
                      // Navegar para o editor com o ID do funil
                      window.location.href = `/editor/${funnel.id}`;
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar no Editor
                  </Button>
                </div>

                <p className="text-xs text-[#8F7A6A] mt-3">
                  Criado em {new Date(funnel.created_at).toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funil</DialogTitle>
            <DialogDescription>
              Atualize as informações do funil.
            </DialogDescription>
          </DialogHeader>
          {selectedFunnel && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome do Funil</Label>
                <Input
                  id="edit-name"
                  value={selectedFunnel.name}
                  onChange={(e) => setSelectedFunnel(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={selectedFunnel.description || ''}
                  onChange={(e) => setSelectedFunnel(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedFunnel.status} 
                  onValueChange={(value: any) => setSelectedFunnel(prev => prev ? { ...prev, status: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedFunnel(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={updateFunnel}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunnelPanelPage;