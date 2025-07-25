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
  user_id?: string;
  is_published?: boolean;
  version?: number;
  settings?: any;
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

  // Toast melhorado para debug
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Criar toast visual temporário
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#10B981' : '#EF4444'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: system-ui;
      font-size: 14px;
      max-width: 300px;
      transition: all 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3000);
  };

  // Navegar para o editor com funil específico
  const navigateToEditor = (funnelId: string) => {
    setLocation(`/editor/${funnelId}`);
  };  // Carregar funis e estatísticas
  useEffect(() => {
    loadFunnels();
    loadStats();
  }, []);

  // Garantir que existe um usuário autenticado (modo offline)
  const ensureAuthenticatedUser = async () => {
    console.log(' Modo offline ativado - simulando usuário');
    return {
      id: 'offline-user-' + Date.now(),
      email: 'offline@local.dev',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };
  };

  // Criar funil a partir de template da base de dados (modo offline)
  const createFunnelFromDBTemplate = async (templateFunnel: Funnel) => {
    try {
      console.log('🚀 Criando funil a partir do template da base de dados (OFFLINE):', templateFunnel.name);
      
      const user = await ensureAuthenticatedUser();
      const templateType = templateFunnel.settings?.template_type;
      
      if (templateType === 'default-21-steps') {
        // Para o template de 21 etapas, usar o serviço completo
        const funnelData = schemaDrivenFunnelService.createDefaultFunnel();
        
        const newFunnel: Funnel = {
          id: 'funnel-' + Date.now(),
          name: `Meu Quiz de Personalidade - ${new Date().toLocaleDateString('pt-BR')}`,
          description: 'Funil personalizado baseado no template de 21 etapas',
          status: 'draft',
          is_published: false,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: { 
            pages_count: funnelData.pages.length,
            template_type: 'custom',
            based_on: 'default-21-steps'
          }
        };

        // Salvar dados completos do funil
        funnelData.id = newFunnel.id;
        await schemaDrivenFunnelService.saveFunnel(funnelData);
        
        setFunnels(prev => [newFunnel, ...prev]);
        showToast('Funil criado a partir do template de 21 etapas! (OFFLINE)');
        
        // Navegar para o editor
        console.log('🧭 Navegando para o editor:', newFunnel.id);
        navigateToEditor(newFunnel.id);
        
      } else {
        // Para outros templates, criar estrutura básica
        const templateName = templateFunnel.name.replace(' (TEMPLATE)', '');
        const newFunnel: Funnel = {
          id: 'funnel-' + Date.now(),
          name: `${templateName} - ${new Date().toLocaleDateString('pt-BR')}`,
          description: `Funil personalizado baseado no template: ${templateName}`,
          status: 'draft',
          is_published: false,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: { 
            pages_count: templateFunnel.settings?.pages_count || 0,
            template_type: 'custom',
            based_on: templateType
          }
        };

        setFunnels(prev => [newFunnel, ...prev]);
        showToast(`Funil criado a partir do template! (OFFLINE)`);
        
        // Navegar para o editor
        console.log('🧭 Navegando para o editor:', newFunnel.id);
        navigateToEditor(newFunnel.id);
      }

      loadStats();
      
    } catch (error) {
      console.error('Erro ao criar funil do template:', error);
      showToast('Erro ao criar funil do template. Tente novamente.', 'error');
    }
  };

  // Criar funil a partir de template (modo offline)
  const createFunnelFromTemplate = async (template: FunnelTemplate) => {
    console.log('🚀 Criando funil a partir do template (OFFLINE):', template.name);
    
    try {
      const user = await ensureAuthenticatedUser();
      console.log('✅ Usuário autenticado (OFFLINE):', user.id);
      
      if (template.id === 'default-quiz-funnel-21-steps') {
        // Usar o serviço para criar o funil padrão de 21 etapas
        console.log('📋 Criando funil padrão de 21 etapas...');
        const funnelData = schemaDrivenFunnelService.createDefaultFunnel();
        
        console.log('💾 Dados do funil criados:', funnelData);
        
        // Criar funil em modo offline
        const newFunnel: Funnel = {
          id: 'funnel-' + Date.now(),
          name: `Meu Quiz de Personalidade - ${new Date().toLocaleDateString('pt-BR')}`,
          description: 'Funil de descoberta pessoal baseado no template de 21 etapas',
          status: 'draft',
          is_published: false,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: {
            pages_count: funnelData.pages.length,
            template_type: 'custom',
            based_on: 'default-21-steps'
          }
        };
        
        console.log('✅ Funil criado (OFFLINE):', newFunnel);
        
        // Salvar dados completos do funil com o ID correto
        funnelData.id = newFunnel.id;
        await schemaDrivenFunnelService.saveFunnel(funnelData);
        
        console.log('✅ Dados completos salvos no serviço');
        
        setFunnels(prev => [newFunnel, ...prev]);
        showToast('Funil de 21 etapas criado com sucesso! (OFFLINE)');
        
        // Navegar para o editor
        console.log('🧭 Navegando para o editor:', newFunnel.id);
        navigateToEditor(newFunnel.id);
        
      } else {
        // Criar funil baseado em outros templates
        console.log('📋 Criando funil para template:', template.name);
        
        const newFunnel: Funnel = {
          id: 'funnel-' + Date.now(),
          name: `${template.name.replace(' (TEMPLATE)', '')} - ${new Date().toLocaleDateString('pt-BR')}`,
          description: template.description,
          status: 'draft',
          is_published: false,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: {
            pages_count: template.steps,
            template_type: 'custom',
            based_on: template.id,
            category: template.category,
            difficulty: template.difficulty
          }
        };

        console.log('✅ Template personalizado criado (OFFLINE):', newFunnel);

        setFunnels(prev => [newFunnel, ...prev]);
        showToast(`Funil "${template.name}" criado com sucesso! (OFFLINE)`);
        
        // Navegar para o editor
        console.log('🧭 Navegando para o editor:', newFunnel.id);
        navigateToEditor(newFunnel.id);
      }

      loadStats();
      
    } catch (error) {
      console.error('❌ Erro ao criar funil do template:', error);
      showToast('Erro ao criar funil do template. Tente novamente.', 'error');
    }
  };

  const loadFunnels = async () => {
    try {
      console.log('📊 Carregando funis (MODO OFFLINE)...');
      setLoading(true);
      
      // Modo offline - carregar dados simulados
      console.log('🔧 Modo offline - carregando dados simulados');
      const simulatedFunnels: Funnel[] = [
        {
          id: 'demo-funnel-1',
          name: 'Funil de Demonstração',
          description: 'Este é um funil de exemplo para demonstração',
          status: 'draft',
          is_published: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'demo-user',
          settings: {
            pages_count: 5,
            template_type: 'custom'
          }
        }
      ];
      
      setFunnels(simulatedFunnels);
      console.log('✅ Funis carregados (OFFLINE):', simulatedFunnels.length);
    } catch (error) {
      console.error('❌ Erro geral ao carregar funis:', error);
      setFunnels([]);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTemplatesIfNeeded = async () => {
    // Função desabilitada no modo offline
    console.log('🔧 Templates serão criados dinamicamente no modo offline');
  };

  const loadStats = async () => {
    try {
      console.log('📊 Carregando estatísticas (MODO OFFLINE)...');
      
      // Simular estatísticas
      setStats({
        total_funnels: funnels.length,
        active_funnels: funnels.filter(f => f.is_published).length,
        total_views: 0,
        total_conversions: 0,
        conversion_rate: 0
      });
      
      console.log('✅ Estatísticas carregadas (OFFLINE)');
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreateFunnel = async () => {
    console.log('🚀 Criando funil personalizado (OFFLINE)...');
    
    try {
      const user = await ensureAuthenticatedUser();
      console.log('✅ Usuário autenticado (OFFLINE):', user.id);
      console.log('📋 Dados do formulário:', formData);

      const newFunnel: Funnel = {
        id: 'funnel-' + Date.now(),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        is_published: formData.status === 'active',
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        settings: { 
          pages_count: 0,
          template_type: 'custom'
        }
      };

      console.log('✅ Funil personalizado criado (OFFLINE):', newFunnel);

      setFunnels(prev => [newFunnel, ...prev]);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', status: 'draft' });
      loadStats();
      
      showToast('Funil criado com sucesso! (OFFLINE)');
      
      // Navegar para o editor
      console.log('🧭 Navegando para o editor:', newFunnel.id);
      navigateToEditor(newFunnel.id);
    } catch (error) {
      console.error('❌ Erro ao criar funil:', error);
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
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = funnel.is_published === true;
    } else if (statusFilter === 'draft') {
      matchesStatus = funnel.is_published === false;
    } else if (statusFilter !== 'all') {
      // Para outros filtros, manter comportamento padrão
      matchesStatus = true;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (funnel: Funnel) => {
    if (funnel.is_published) return 'default';
    return 'secondary';
  };

  const getStatusLabel = (funnel: Funnel) => {
    if (funnel.is_published) return 'Ativo';
    return 'Rascunho';
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
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#B89B7A] hover:bg-[#9F836A] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Funil Personalizado
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
        ) : (
          <>
            {/* Templates Fixos */}
            {(!searchTerm || statusFilter === 'all') && FUNNEL_TEMPLATES.map((template) => (
              <Card 
                key={`template-${template.id}`}
                className="border-2 border-[#B89B7A] bg-gradient-to-br from-[#F5F1EC] to-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#B89B7A] font-bold flex items-center">
                        <template.icon className="w-5 h-5 mr-2" />
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-gray-600">
                        {template.description}
                      </CardDescription>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge className="bg-[#B89B7A] text-white text-xs">
                          Template Pronto
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.steps} etapas
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ~{template.estimatedTime} min
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center capitalize">
                      <Layout className="w-4 h-4 mr-1" />
                      {template.category}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {template.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#B89B7A] hover:bg-[#9F836A] text-white"
                      onClick={() => createFunnelFromTemplate(template)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Usar Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Funis Existentes */}
            {filteredFunnels.length === 0 && !loading ? (
              <div className="col-span-full text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum funil encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece criando seu primeiro funil usando um dos templates acima.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Funil Personalizado
                  </Button>
                )}
              </div>
            ) : (
              filteredFunnels.map((funnel) => {
                const isTemplate = funnel.settings?.is_template === true;
                return (
                  <Card 
                    key={funnel.id} 
                    className={`hover:shadow-md transition-shadow ${isTemplate ? 'border-2 border-[#B89B7A] bg-gradient-to-br from-[#F5F1EC] to-white' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className={`text-lg ${isTemplate ? 'text-[#B89B7A] font-bold' : ''}`}>
                            {funnel.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {funnel.description || 'Sem descrição'}
                          </CardDescription>
                          {isTemplate && (
                            <div className="mt-2">
                              <Badge className="bg-[#B89B7A] text-white">
                                Template Personalizado
                              </Badge>
                            </div>
                          )}
                        </div>
                        {!isTemplate && (
                          <Badge variant={getStatusBadgeVariant(funnel)}>
                            {getStatusLabel(funnel)}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(funnel.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span>{funnel.settings?.pages_count || 0} páginas</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {isTemplate ? (
                          <>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-[#B89B7A] hover:bg-[#9F836A] text-white"
                              onClick={() => createFunnelFromDBTemplate(funnel)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Usar Template
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigateToEditor(funnel.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Visualizar
                            </Button>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </>
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