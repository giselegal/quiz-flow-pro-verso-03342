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
  const [statusFilter, setStatusFilter] = useState&lt;string&gt;('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState&lt;Funnel | null&gt;(null);
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
      status: funnel.status
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
    &lt;div className="p-6 space-y-6"&gt;
      {/* Header */}
      &lt;div className="flex justify-between items-center"&gt;
        &lt;div&gt;
          &lt;h1 className="text-3xl font-bold text-gray-900"&gt;Painel de Funis&lt;/h1&gt;
          &lt;p className="text-gray-600 mt-1"&gt;Gerencie seus funis de conversão&lt;/p&gt;
        &lt;/div&gt;
        &lt;Button onClick={() => setIsCreateDialogOpen(true)}&gt;
          &lt;Plus className="w-4 h-4 mr-2" /&gt;
          Novo Funil
        &lt;/Button&gt;
      &lt;/div&gt;

      {/* Stats Cards */}
      &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"&gt;
        &lt;Card&gt;
          &lt;CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"&gt;
            &lt;CardTitle className="text-sm font-medium"&gt;Total de Funis&lt;/CardTitle&gt;
            &lt;BarChart3 className="h-4 w-4 text-muted-foreground" /&gt;
          &lt;/CardHeader&gt;
          &lt;CardContent&gt;
            &lt;div className="text-2xl font-bold"&gt;{stats.total_funnels}&lt;/div&gt;
          &lt;/CardContent&gt;
        &lt;/Card&gt;

        &lt;Card&gt;
          &lt;CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"&gt;
            &lt;CardTitle className="text-sm font-medium"&gt;Funis Ativos&lt;/CardTitle&gt;
            &lt;TrendingUp className="h-4 w-4 text-muted-foreground" /&gt;
          &lt;/CardHeader&gt;
          &lt;CardContent&gt;
            &lt;div className="text-2xl font-bold"&gt;{stats.active_funnels}&lt;/div&gt;
          &lt;/CardContent&gt;
        &lt;/Card&gt;

        &lt;Card&gt;
          &lt;CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"&gt;
            &lt;CardTitle className="text-sm font-medium"&gt;Visualizações&lt;/CardTitle&gt;
            &lt;Users className="h-4 w-4 text-muted-foreground" /&gt;
          &lt;/CardHeader&gt;
          &lt;CardContent&gt;
            &lt;div className="text-2xl font-bold"&gt;{stats.total_views.toLocaleString()}&lt;/div&gt;
          &lt;/CardContent&gt;
        &lt;/Card&gt;

        &lt;Card&gt;
          &lt;CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"&gt;
            &lt;CardTitle className="text-sm font-medium"&gt;Taxa de Conversão&lt;/CardTitle&gt;
            &lt;TrendingUp className="h-4 w-4 text-muted-foreground" /&gt;
          &lt;/CardHeader&gt;
          &lt;CardContent&gt;
            &lt;div className="text-2xl font-bold"&gt;{stats.conversion_rate.toFixed(1)}%&lt;/div&gt;
          &lt;/CardContent&gt;
        &lt;/Card&gt;
      &lt;/div&gt;

      {/* Filters */}
      &lt;div className="flex flex-col sm:flex-row gap-4"&gt;
        &lt;div className="relative flex-1"&gt;
          &lt;Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /&gt;
          &lt;Input
            placeholder="Buscar funis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          /&gt;
        &lt;/div&gt;
        &lt;Select value={statusFilter} onValueChange={setStatusFilter}&gt;
          &lt;SelectTrigger className="w-full sm:w-48"&gt;
            &lt;Filter className="w-4 h-4 mr-2" /&gt;
            &lt;SelectValue placeholder="Filtrar por status" /&gt;
          &lt;/SelectTrigger&gt;
          &lt;SelectContent&gt;
            &lt;SelectItem value="all"&gt;Todos os status&lt;/SelectItem&gt;
            &lt;SelectItem value="active"&gt;Ativo&lt;/SelectItem&gt;
            &lt;SelectItem value="draft"&gt;Rascunho&lt;/SelectItem&gt;
            &lt;SelectItem value="paused"&gt;Pausado&lt;/SelectItem&gt;
            &lt;SelectItem value="archived"&gt;Arquivado&lt;/SelectItem&gt;
          &lt;/SelectContent&gt;
        &lt;/Select&gt;
      &lt;/div&gt;

      {/* Funnels List */}
      &lt;div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"&gt;
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            &lt;Card key={i} className="animate-pulse"&gt;
              &lt;CardHeader&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-3/4"&gt;&lt;/div&gt;
                &lt;div className="h-3 bg-gray-200 rounded w-1/2"&gt;&lt;/div&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                &lt;div className="h-3 bg-gray-200 rounded w-full mb-2"&gt;&lt;/div&gt;
                &lt;div className="h-3 bg-gray-200 rounded w-2/3"&gt;&lt;/div&gt;
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          ))
        ) : filteredFunnels.length === 0 ? (
          &lt;div className="col-span-full text-center py-12"&gt;
            &lt;BarChart3 className="mx-auto h-12 w-12 text-gray-400" /&gt;
            &lt;h3 className="mt-2 text-sm font-medium text-gray-900"&gt;Nenhum funil encontrado&lt;/h3&gt;
            &lt;p className="mt-1 text-sm text-gray-500"&gt;
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Comece criando seu primeiro funil.'}
            &lt;/p&gt;
            {!searchTerm && statusFilter === 'all' && (
              &lt;Button 
                className="mt-4" 
                onClick={() => setIsCreateDialogOpen(true)}
              &gt;
                &lt;Plus className="w-4 h-4 mr-2" /&gt;
                Criar Primeiro Funil
              &lt;/Button&gt;
            )}
          &lt;/div&gt;
        ) : (
          filteredFunnels.map((funnel) => (
            &lt;Card key={funnel.id} className="hover:shadow-md transition-shadow"&gt;
              &lt;CardHeader&gt;
                &lt;div className="flex justify-between items-start"&gt;
                  &lt;div className="flex-1"&gt;
                    &lt;CardTitle className="text-lg"&gt;{funnel.name}&lt;/CardTitle&gt;
                    &lt;CardDescription className="mt-1"&gt;
                      {funnel.description || 'Sem descrição'}
                    &lt;/CardDescription&gt;
                  &lt;/div&gt;
                  &lt;Badge variant={getStatusBadgeVariant(funnel.status)}&gt;
                    {getStatusLabel(funnel.status)}
                  &lt;/Badge&gt;
                &lt;/div&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                &lt;div className="flex justify-between items-center text-sm text-gray-500 mb-4"&gt;
                  &lt;span className="flex items-center"&gt;
                    &lt;Calendar className="w-4 h-4 mr-1" /&gt;
                    {new Date(funnel.created_at).toLocaleDateString('pt-BR')}
                  &lt;/span&gt;
                  &lt;span&gt;{funnel.pages_count || 0} páginas&lt;/span&gt;
                &lt;/div&gt;
                
                &lt;div className="flex gap-2"&gt;
                  &lt;Button variant="outline" size="sm" className="flex-1"&gt;
                    &lt;Eye className="w-4 h-4 mr-1" /&gt;
                    Visualizar
                  &lt;/Button&gt;
                  &lt;Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(funnel)}
                  &gt;
                    &lt;Edit className="w-4 h-4" /&gt;
                  &lt;/Button&gt;
                  &lt;Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicateFunnel(funnel)}
                  &gt;
                    &lt;Copy className="w-4 h-4" /&gt;
                  &lt;/Button&gt;
                  &lt;Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteFunnel(funnel.id)}
                  &gt;
                    &lt;Trash2 className="w-4 h-4" /&gt;
                  &lt;/Button&gt;
                &lt;/div&gt;
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          ))
        )}
      &lt;/div&gt;

      {/* Create Funnel Dialog */}
      &lt;Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}&gt;
        &lt;DialogContent&gt;
          &lt;DialogHeader&gt;
            &lt;DialogTitle&gt;Criar Novo Funil&lt;/DialogTitle&gt;
            &lt;DialogDescription&gt;
              Preencha as informações básicas para criar um novo funil.
            &lt;/DialogDescription&gt;
          &lt;/DialogHeader&gt;
          &lt;div className="space-y-4"&gt;
            &lt;div&gt;
              &lt;Label htmlFor="name"&gt;Nome do Funil&lt;/Label&gt;
              &lt;Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do funil"
              /&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;Label htmlFor="description"&gt;Descrição (opcional)&lt;/Label&gt;
              &lt;Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o objetivo do funil"
                rows={3}
              /&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;Label htmlFor="status"&gt;Status Inicial&lt;/Label&gt;
              &lt;Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              &gt;
                &lt;SelectTrigger&gt;
                  &lt;SelectValue /&gt;
                &lt;/SelectTrigger&gt;
                &lt;SelectContent&gt;
                  &lt;SelectItem value="draft"&gt;Rascunho&lt;/SelectItem&gt;
                  &lt;SelectItem value="active"&gt;Ativo&lt;/SelectItem&gt;
                  &lt;SelectItem value="paused"&gt;Pausado&lt;/SelectItem&gt;
                &lt;/SelectContent&gt;
              &lt;/Select&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          &lt;DialogFooter&gt;
            &lt;Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}&gt;
              Cancelar
            &lt;/Button&gt;
            &lt;Button onClick={handleCreateFunnel} disabled={!formData.name.trim()}&gt;
              Criar Funil
            &lt;/Button&gt;
          &lt;/DialogFooter&gt;
        &lt;/DialogContent&gt;
      &lt;/Dialog&gt;

      {/* Edit Funnel Dialog */}
      &lt;Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}&gt;
        &lt;DialogContent&gt;
          &lt;DialogHeader&gt;
            &lt;DialogTitle&gt;Editar Funil&lt;/DialogTitle&gt;
            &lt;DialogDescription&gt;
              Atualize as informações do funil.
            &lt;/DialogDescription&gt;
          &lt;/DialogHeader&gt;
          &lt;div className="space-y-4"&gt;
            &lt;div&gt;
              &lt;Label htmlFor="edit-name"&gt;Nome do Funil&lt;/Label&gt;
              &lt;Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do funil"
              /&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;Label htmlFor="edit-description"&gt;Descrição&lt;/Label&gt;
              &lt;Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o objetivo do funil"
                rows={3}
              /&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;Label htmlFor="edit-status"&gt;Status&lt;/Label&gt;
              &lt;Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              &gt;
                &lt;SelectTrigger&gt;
                  &lt;SelectValue /&gt;
                &lt;/SelectTrigger&gt;
                &lt;SelectContent&gt;
                  &lt;SelectItem value="draft"&gt;Rascunho&lt;/SelectItem&gt;
                  &lt;SelectItem value="active"&gt;Ativo&lt;/SelectItem&gt;
                  &lt;SelectItem value="paused"&gt;Pausado&lt;/SelectItem&gt;
                  &lt;SelectItem value="archived"&gt;Arquivado&lt;/SelectItem&gt;
                &lt;/SelectContent&gt;
              &lt;/Select&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          &lt;DialogFooter&gt;
            &lt;Button variant="outline" onClick={() => setIsEditDialogOpen(false)}&gt;
              Cancelar
            &lt;/Button&gt;
            &lt;Button onClick={handleEditFunnel} disabled={!formData.name.trim()}&gt;
              Salvar Alterações
            &lt;/Button&gt;
          &lt;/DialogFooter&gt;
        &lt;/DialogContent&gt;
      &lt;/Dialog&gt;
    &lt;/div&gt;
  );
};

export default FunnelPanelPage;