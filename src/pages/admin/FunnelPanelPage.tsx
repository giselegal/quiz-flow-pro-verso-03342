import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
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
  Calendar,
  Layout,
  Zap,
  Target,
  Heart,
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { schemaDrivenFunnelService } from '../../services/schemaDrivenFunnelService';

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

interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: number;
  icon: React.ComponentType<any>;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  tags: string[];
  stepTitles: string[];
}

// Templates de funis disponíveis
const FUNNEL_TEMPLATES: FunnelTemplate[] = [
  {
    id: 'default-quiz-funnel-21-steps',
    name: 'Funil Completo de Descoberta Pessoal',
    description: 'Funil completo para descoberta do estilo pessoal - 21 etapas modulares',
    category: 'personalidade',
    steps: 21,
    icon: Target,
    difficulty: 'medium',
    estimatedTime: 15,
    tags: ['descoberta', 'personalidade', 'completo'],
    stepTitles: [
      'Boas-vindas e Introdução',
      'Primeira Pergunta - Preferências Básicas',
      'Exploração de Interesses',
      'Análise de Comportamento',
      'Preferências de Estilo',
      'Avaliação de Personalidade',
      'Gostos e Desgostos',
      'Cenários Hipotéticos',
      'Escolhas de Vida',
      'Ambiente Ideal',
      'Relacionamentos',
      'Carreira e Trabalho',
      'Hobbies e Lazer',
      'Valores Pessoais',
      'Desafios e Medos',
      'Aspirações e Sonhos',
      'Análise Comportamental',
      'Preferências Detalhadas',
      'Consolidação de Dados',
      'Resultado Personalizado',
      'Oferta Personalizada'
    ]
  },
  {
    id: 'quick-personality-quiz',
    name: 'Quiz Rápido de Personalidade',
    description: 'Quiz curto e direto para descobrir traços básicos de personalidade',
    category: 'personalidade',
    steps: 7,
    icon: Zap,
    difficulty: 'easy',
    estimatedTime: 5,
    tags: ['rápido', 'personalidade', 'básico'],
    stepTitles: [
      'Introdução',
      'Preferências Sociais',
      'Estilo de Trabalho',
      'Tomada de Decisões',
      'Gestão de Tempo',
      'Comunicação',
      'Resultado'
    ]
  },
  {
    id: 'lifestyle-assessment',
    name: 'Avaliação de Estilo de Vida',
    description: 'Descubra qual estilo de vida combina mais com você',
    category: 'estilo-vida',
    steps: 12,
    icon: Heart,
    difficulty: 'medium',
    estimatedTime: 10,
    tags: ['estilo', 'vida', 'bem-estar'],
    stepTitles: [
      'Boas-vindas',
      'Rotina Diária',
      'Preferências Alimentares',
      'Atividade Física',
      'Relacionamentos',
      'Trabalho e Carreira',
      'Tempo Livre',
      'Viagens e Aventuras',
      'Finanças Pessoais',
      'Saúde e Bem-estar',
      'Valores e Prioridades',
      'Seu Estilo Ideal'
    ]
  },
  {
    id: 'career-guidance',
    name: 'Orientação Profissional',
    description: 'Encontre a carreira ideal baseada em suas habilidades e interesses',
    category: 'carreira',
    steps: 15,
    icon: Layout,
    difficulty: 'hard',
    estimatedTime: 20,
    tags: ['carreira', 'profissional', 'habilidades'],
    stepTitles: [
      'Introdução ao Assessment',
      'Histórico Educacional',
      'Experiências Profissionais',
      'Habilidades Técnicas',
      'Habilidades Interpessoais',
      'Interesses e Paixões',
      'Valores no Trabalho',
      'Ambiente de Trabalho Ideal',
      'Desafios Profissionais',
      'Objetivos de Carreira',
      'Estilo de Liderança',
      'Work-Life Balance',
      'Análise de Competências',
      'Recomendações de Carreira',
      'Plano de Desenvolvimento'
    ]
  }
];

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
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as 'draft' | 'active' | 'paused' | 'archived'
  });

  const [, setLocation] = useLocation();

  // Toast simples como fallback
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // TODO: Implementar toast real quando disponível
  };

  // Navegar para o editor com funil específico
  const navigateToEditor = (funnelId: string) => {
    setLocation(`/editor/${funnelId}`);
  };  // Carregar funis e estatísticas
  useEffect(() => {
    loadFunnels();
    loadStats();
  }, []);

  // Garantir que existe um usuário autenticado
  const ensureAuthenticatedUser = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (user) {
        return user;
      }

      // Se não há usuário, tentar criar um usuário anônimo temporário
      const { data: anonUser, error: anonError } = await supabase.auth.signInAnonymously();
      
      if (anonError) {
        console.error('❌ Erro ao criar usuário anônimo:', anonError);
        return null;
      }

      return anonUser.user;
    } catch (error) {
      console.error('❌ Erro de autenticação:', error);
      return null;
    }
  };

  // Criar funil a partir de template
  const createFunnelFromTemplate = async (template: FunnelTemplate) => {
    try {
      const user = await ensureAuthenticatedUser();
      if (!user) {
        showToast('Erro de autenticação. Tente novamente.', 'error');
        return;
      }

      let funnelData;
      
      if (template.id === 'default-quiz-funnel-21-steps') {
        // Usar o serviço para criar o funil padrão de 21 etapas
        funnelData = schemaDrivenFunnelService.createDefaultFunnel();
        
        // Salvar no banco de dados
        const supabaseData = {
          id: funnelData.funnel.id,
          name: funnelData.funnel.name,
          description: funnelData.funnel.description,
          status: 'draft' as const,
          user_id: user.id,
          pages_count: funnelData.pages.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('funnels')
          .upsert(supabaseData)
          .select()
          .single();

        if (error) throw error;
        
        // Salvar dados completos do funil
        await schemaDrivenFunnelService.saveFunnel(funnelData.id, funnelData);
        
        setFunnels(prev => [data, ...prev]);
        showToast('Funil padrão de 21 etapas criado com sucesso!');
        
        // Navegar para o editor
        navigateToEditor(funnelData.id);
        
      } else {
        // Criar funil baseado em outros templates
        const funnelId = `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const supabaseData = {
          id: funnelId,
          name: template.name,
          description: template.description,
          status: 'draft' as const,
          user_id: user.id,
          pages_count: template.steps,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('funnels')
          .insert(supabaseData)
          .select()
          .single();

        if (error) throw error;

        setFunnels(prev => [data, ...prev]);
        showToast(`Template "${template.name}" criado com sucesso!`);
        
        // Navegar para o editor
        navigateToEditor(funnelId);
      }

      setIsTemplateDialogOpen(false);
      loadStats();
      
    } catch (error) {
      console.error('Erro ao criar funil do template:', error);
      showToast('Erro ao criar funil do template. Tente novamente.', 'error');
    }
  };

  const loadFunnels = async () => {
    try {
      setLoading(true);
      
      // Primeiro, verificar se o funil padrão de 21 etapas existe
      const DEFAULT_FUNNEL_ID = 'default-quiz-funnel-21-steps';
      const { data: existingDefault, error: checkError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', DEFAULT_FUNNEL_ID)
        .single();

      // Se não existe, criar o funil padrão
      if (!existingDefault && checkError?.code === 'PGRST116') {
        try {
          const user = await ensureAuthenticatedUser();
          if (user) {
            const defaultFunnelData = schemaDrivenFunnelService.createDefaultFunnel();
            
            const supabaseData = {
              id: defaultFunnelData.id,
              name: defaultFunnelData.name,
              description: defaultFunnelData.description,
              status: 'active' as const,
              user_id: user.id,
              pages_count: defaultFunnelData.pages.length,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            await supabase
              .from('funnels')
              .upsert(supabaseData);
              
            // Salvar dados completos do funil
            await schemaDrivenFunnelService.saveFunnel(defaultFunnelData.id, defaultFunnelData);
            
            console.log('✅ Funil padrão de 21 etapas criado automaticamente');
          }
        } catch (error) {
          console.error('Erro ao criar funil padrão:', error);
        }
      }

      // Carregar todos os funis
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
      const user = await ensureAuthenticatedUser();
      if (!user) {
        showToast('Erro de autenticação. Tente novamente.', 'error');
        return;
      }

      const funnelId = `funnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const funnelData = {
        ...formData,
        id: funnelId,
        user_id: user.id,
        pages_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('funnels')
        .insert([funnelData])
        .select()
        .single();

      if (error) throw error;

      setFunnels(prev => [data, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', status: 'draft' });
      loadStats();
      
      showToast('Funil criado com sucesso!');
      
      // Navegar para o editor
      navigateToEditor(funnelId);
    } catch (error) {
      console.error('Erro ao criar funil:', error);
      showToast('Erro ao criar funil. Tente novamente.', 'error');
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Funis</h1>
          <p className="text-gray-600 mt-1">Gerencie seus funis de conversão e use templates prontos</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsTemplateDialogOpen(true)}
            className="bg-white border-2 border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
          >
            <Layout className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#B89B7A] hover:bg-[#9F836A] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Funil
          </Button>
        </div>
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
                    size="sm" 
                    className="flex-1 bg-[#B89B7A] hover:bg-[#9F836A] text-white"
                    onClick={() => navigateToEditor(funnel.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editor
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

      {/* Template Selection Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#432818]">Escolher Template de Funil</DialogTitle>
            <DialogDescription>
              Selecione um template pronto para começar rapidamente ou use o funil completo de 21 etapas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {FUNNEL_TEMPLATES.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    selectedTemplate?.id === template.id 
                      ? 'border-[#B89B7A] bg-[#F5F1EC]' 
                      : 'border-gray-200 hover:border-[#B89B7A]'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#B89B7A] text-white">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-[#432818]">{template.name}</CardTitle>
                          <Badge 
                            variant={template.difficulty === 'easy' ? 'secondary' : 
                                   template.difficulty === 'medium' ? 'default' : 'destructive'}
                            className="mt-1"
                          >
                            {template.difficulty === 'easy' ? 'Fácil' : 
                             template.difficulty === 'medium' ? 'Médio' : 'Avançado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-[#8F7A6A] mb-4 line-clamp-3">{template.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-[#8F7A6A]">
                        <Target className="w-4 h-4" />
                        <span>{template.steps} etapas</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8F7A6A]">
                        <Clock className="w-4 h-4" />
                        <span>~{template.estimatedTime} min</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {template.id === 'default-quiz-funnel-21-steps' && (
                      <div className="mt-3 p-3 bg-[#B89B7A]/10 rounded-lg">
                        <p className="text-xs text-[#8F7A6A]">
                          <strong>Funil Principal:</strong> Este é o funil padrão completo com 21 etapas modulares 
                          para descoberta de personalidade e estilo pessoal.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => selectedTemplate && createFunnelFromTemplate(selectedTemplate)}
              disabled={!selectedTemplate}
              className="bg-[#B89B7A] hover:bg-[#9F836A] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Funil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunnelPanelPage;