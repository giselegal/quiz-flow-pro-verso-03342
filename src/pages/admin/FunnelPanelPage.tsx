import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  BarChart3,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Funnel {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
  pages_count?: number;
  views?: number;
  conversions?: number;
}

interface FunnelStats {
  total_funnels: number;
  active_funnels: number;
  total_views: number;
  total_conversions: number;
  conversion_rate: number;
}

const FunnelPanelPage: React.FC = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [stats, setStats] = useState<FunnelStats>({
    total_funnels: 0,
    active_funnels: 0,
    total_views: 0,
    total_conversions: 0,
    conversion_rate: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as const
  });

  // Carregar funis e estatísticas
  useEffect(() => {
    loadFunnels();
    loadStats();
  }, []);

  const loadFunnels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFunnels(data || []);
    } catch (error) {
      console.error('Erro ao carregar funis:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: funnelsData, error } = await supabase
        .from('funnels')
        .select('status');

      if (error) throw error;

      const totalFunnels = funnelsData?.length || 0;
      const activeFunnels = funnelsData?.filter(f => f.status === 'active').length || 0;

      setStats({
        total_funnels: totalFunnels,
        active_funnels: activeFunnels,
        total_views: 0, // Implementar quando houver dados de analytics
        total_conversions: 0,
        conversion_rate: 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreateFunnel = async () => {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setFunnels(prev => [data, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', status: 'draft' });
      loadStats();
    } catch (error) {
      console.error('Erro ao criar funil:', error);
    }
  };

  const handleEditFunnel = async () => {
    if (!selectedFunnel) return;

    try {
      const { data, error } = await supabase
        .from('funnels')
        .update(formData)
        .eq('id', selectedFunnel.id)
        .select()
        .single();

      if (error) throw error;

      setFunnels(prev => prev.map(f => f.id === selectedFunnel.id ? data : f));
      setIsEditDialogOpen(false);
      setSelectedFunnel(null);
      setFormData({ name: '', description: '', status: 'draft' });
      loadStats();
    } catch (error) {
      console.error('Erro ao editar funil:', error);
    }
  };

  const handleDeleteFunnel = async (funnelId: string) => {
    if (!confirm('Tem certeza que deseja excluir este funil?')) return;

    try {
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', funnelId);

      if (error) throw error;

      setFunnels(prev => prev.filter(f => f.id !== funnelId));
      loadStats();
    } catch (error) {
      console.error('Erro ao excluir funil:', error);
    }
  };

  const handleDuplicateFunnel = async (funnel: Funnel) => {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .insert([{
          name: `${funnel.name} (Cópia)`,
          description: funnel.description,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      setFunnels(prev => [data, ...prev]);
      loadStats();
    } catch (error) {
      console.error('Erro ao duplicar funil:', error);
    }
  };

  const openEditDialog = (funnel: Funnel) => {
    setSelectedFunnel(funnel);
    setFormData({
      name: funnel.name,
      description: funnel.description || '',
      status: funnel.status as 'draft' | 'active' | 'paused' | 'archived'
    });
    setIsEditDialogOpen(true);
  };

  const filteredFunnels = funnels.filter(funnel => {
    const matchesSearch = funnel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (funnel.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || funnel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'paused': return 'outline';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'draft': return 'Rascunho';
      case 'paused': return 'Pausado';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Funis</h1>
          <p className="text-gray-600 mt-1">Gerencie seus funis de conversão</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Funil
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funis</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_funnels}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funis Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_funnels}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion_rate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="paused">Pausado</SelectItem>
            <SelectItem value="archived">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Funnels List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredFunnels.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum funil encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Comece criando seu primeiro funil.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button 
                className="mt-4" 
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Funil
              </Button>
            )}
          </div>
        ) : (
          filteredFunnels.map((funnel) => (
            <Card key={funnel.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{funnel.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {funnel.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(funnel.status)}>
                    {getStatusLabel(funnel.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(funnel.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <span>{funnel.pages_count || 0} páginas</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(funnel)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicateFunnel(funnel)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteFunnel(funnel.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Funnel Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Funil</DialogTitle>
            <DialogDescription>
              Preencha as informações básicas para criar um novo funil.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Funil</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do funil"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o objetivo do funil"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="status">Status Inicial</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFunnel} disabled={!formData.name.trim()}>
              Criar Funil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Funnel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Funil</DialogTitle>
            <DialogDescription>
              Atualize as informações do funil.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome do Funil</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do funil"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o objetivo do funil"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditFunnel} disabled={!formData.name.trim()}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunnelPanelPage;