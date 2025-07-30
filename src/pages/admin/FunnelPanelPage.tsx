import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Eye, 
  Copy, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Layout, 
  Clock, 
  Calendar,
  Star,
  Zap,
  Heart,
  Brain,
  Briefcase,
  GraduationCap,
  ShoppingCart,
  Gamepad2,
  Trophy,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useToast } from '../../hooks/use-toast';
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
    name: 'Quiz Completo: Descoberta de Estilo Pessoal (21 Etapas)',
    description: 'Funil profissional completo com 21 etapas otimizadas para descoberta do estilo pessoal. Inclui 10 questões principais + perguntas estratégicas + páginas de resultado + ofertas personalizadas. Design responsivo e pronto para produção.',
    category: 'personalidade',
    steps: 21,
    icon: Target,
    difficulty: 'medium',
    estimatedTime: 15,
    tags: ['profissional', 'completo', 'personalidade', 'conversão', 'pronto-uso'],
    stepTitles: [
      'Introdução e Coleta do Nome',
      'Questão 1: Preferência de Cores',
      'Questão 2: Estilo de Vida',
      'Questão 3: Ocasiões Especiais',
      'Questão 4: Conforto vs. Estilo',
      'Questão 5: Padrões e Texturas',
      'Questão 6: Inspiração de Moda',
      'Questão 7: Acessórios Preferidos',
      'Questão 8: Compras de Roupa',
      'Questão 9: Estilo no Trabalho',
      'Questão 10: Look Ideal',
      'Transição: Conhecendo Você Melhor',
      'Pergunta Estratégica 1: Problema Principal',
      'Pergunta Estratégica 2: Orçamento Mensal',
      'Pergunta Estratégica 3: Maior Dificuldade',
      'Pergunta Estratégica 4: Forma do Corpo',
      'Pergunta Estratégica 5: Meta Principal',
      'Transição: Quase Terminando',
      'Coleta de Contato',
      'Resultado: Análise do Estilo',
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

  // Sistema de toast unificado migrado da versão manual
  const { toast } = useToast();
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    toast({
      title: type === 'success' ? 'Sucesso' : 'Erro',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  };

  // Navegar para o editor com funil específico
  const navigateToEditor = (funnelId: string) => {
    setLocation(`/editor?id=${funnelId}`);
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

  // Criar NOVA CÓPIA do funil a partir de template (só quando duplicar)
  const createFunnelFromDBTemplate = async (templateFunnel: Funnel, isDuplicate = false) => {
    try {
      console.log('🚀 Criando funil a partir do template da base de dados (OFFLINE):', templateFunnel.name);
      
      const user = await ensureAuthenticatedUser();
      const templateType = templateFunnel.settings?.template_type;
      
      if (templateType === 'default-21-steps' && !isDuplicate) {
        // Se não for duplicação, apenas abrir o template existente
        return openDefaultTemplate();
      }
      
      if (templateType === 'default-21-steps' && isDuplicate) {
        // Para duplicação, criar novo funil com ID único
        const funnelData = schemaDrivenFunnelService.createDefaultFunnel();
        
        const newFunnel: Funnel = {
          id: 'funnel-copy-' + Date.now(),
          name: `Cópia - Quiz de Personalidade - ${new Date().toLocaleDateString('pt-BR')}`,
          description: 'Cópia personalizada do template de 21 etapas',
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
        showToast('Cópia do funil criada! (OFFLINE)');
        
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

  // Criar funil a partir de template (modo offline) - SIMPLIFICADO
  const createFunnelFromTemplate = async (template: FunnelTemplate, isDuplicate = false) => {
    console.log('🚀 Usando template:', template.name, isDuplicate ? '(NOVA CÓPIA)' : '(EDITAR TEMPLATE)');
    
    try {
      const user = await ensureAuthenticatedUser();
      
      if (template.id === 'default-quiz-funnel-21-steps') {
        if (isDuplicate) {
          // CRIAR NOVA CÓPIA com ID único
          console.log('📋 Criando NOVA CÓPIA do template de 21 etapas...');
          const funnelData = schemaDrivenFunnelService.createDefaultFunnel();
          
          const newFunnel: Funnel = {
            id: 'quiz-copy-' + Date.now(),
            name: `Quiz Personalidade - Cópia ${new Date().toLocaleDateString('pt-BR')}`,
            description: 'Cópia editável do template de 21 etapas',
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
          
          // Salvar dados completos do funil com o ID correto
          funnelData.id = newFunnel.id;
          await schemaDrivenFunnelService.saveFunnel(funnelData);
          
          setFunnels(prev => [newFunnel, ...prev]);
          showToast('Nova cópia criada com ID: ' + newFunnel.id);
          
          // Navegar para o editor da cópia
          navigateToEditor(newFunnel.id);
          
        } else {
          // EDITAR TEMPLATE ORIGINAL
          console.log('✏️ Abrindo template original para edição...');
          const templateId = 'default-quiz-funnel-21-steps';
          
          // Verificar se já existe o funil schema-driven para este template
          const existingFunnel = await schemaDrivenFunnelService.loadFunnel(templateId);
          
          if (!existingFunnel) {
            // Criar o template apenas uma vez com ID fixo
            const funnelData = schemaDrivenFunnelService.createDefaultFunnel();
            funnelData.id = templateId;
            funnelData.name = 'Template: Quiz de Personalidade (21 Etapas)';
            funnelData.description = 'Template oficial de 21 etapas';
            
            await schemaDrivenFunnelService.saveFunnel(funnelData);
          }
          
          showToast('Abrindo template para edição...');
          navigateToEditor(templateId);
        }
      } else {
        // Outros templates - sempre criar novo
        const newFunnel: Funnel = {
          id: 'funnel-' + Date.now(),
          name: `${template.name} - ${new Date().toLocaleDateString('pt-BR')}`,
          description: template.description,
          status: 'draft',
          is_published: false,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: {
            pages_count: template.steps,
            template_type: 'custom',
            based_on: template.id
          }
        };

        setFunnels(prev => [newFunnel, ...prev]);
        showToast(`Funil "${template.name}" criado!`);
        navigateToEditor(newFunnel.id);
      }

      loadStats();
      
    } catch (error) {
      console.error('❌ Erro ao usar template:', error);
      showToast('Erro ao criar funil do template.', 'error');
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

  // ✅ BUSCA AVANÇADA MELHORADA - Fase 1
  const filteredFunnels = funnels.filter(funnel => {
    // Busca avançada por nome, descrição, tags e configurações
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      funnel.name.toLowerCase().includes(searchLower) ||
      (funnel.description || '').toLowerCase().includes(searchLower) ||
      // Buscar em configurações e metadados
      JSON.stringify(funnel.settings || {}).toLowerCase().includes(searchLower) ||
      // Buscar por categoria/tipo se existir
      (funnel.settings?.template_type || '').toLowerCase().includes(searchLower) ||
      (funnel.settings?.based_on || '').toLowerCase().includes(searchLower) ||
      (funnel.settings?.category || '').toLowerCase().includes(searchLower);
    
    // Filtro de status melhorado
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = funnel.is_published === true;
    } else if (statusFilter === 'draft') {
      matchesStatus = funnel.is_published === false || funnel.status === 'draft';
    } else if (statusFilter === 'paused') {
      matchesStatus = funnel.status === 'paused';
    } else if (statusFilter === 'archived') {
      matchesStatus = funnel.status === 'archived';
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
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf7] via-[#F9F6F2] to-[#F3E8E6]">
      {/* Background Pattern com cores da marca */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #B89B7A 2px, transparent 2px), radial-gradient(circle at 75% 75%, #432818 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Aviso de Modo Offline - Redesigned com cores da marca */}
        <div className="bg-gradient-to-r from-[#aa6b5d] to-[#B89B7A] border border-[#432818]/20 rounded-xl p-5 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-semibold text-white">Modo Demonstração Ativo</h3>
              <p className="text-sm text-white/90 mt-1">
                Os templates e criação de funis estão funcionando em modo offline para demonstração. 
                Os funis criados serão salvos localmente e você pode testar a navegação para o editor.
              </p>
            </div>
          </div>
        </div>

        {/* Header - Redesigned com cores da marca */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#432818] via-[#8F7A6A] to-[#B89B7A] bg-clip-text text-transparent">
              Painel de Funis
            </h1>
            <p className="text-lg text-[#8F7A6A]">Gerencie seus funis de conversão e use templates prontos</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] hover:from-[#432818] hover:to-[#8F7A6A] text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Funil Personalizado
            </Button>
          </div>
        </div>

        {/* Stats Cards - Redesigned com cores da marca */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-[#fffaf7] border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#8F7A6A]">Total de Funis</CardTitle>
            <div className="w-10 h-10 bg-[#B89B7A]/20 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-[#B89B7A]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818]">{stats.total_funnels}</div>
            <p className="text-xs text-[#8F7A6A] mt-1">+2 este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-[#F3E8E6] border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#8F7A6A]">Funis Ativos</CardTitle>
            <div className="w-10 h-10 bg-[#aa6b5d]/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#aa6b5d]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818]">{stats.active_funnels}</div>
            <p className="text-xs text-[#8F7A6A] mt-1">+1 esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-[#fffaf7] border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#8F7A6A]">Visualizações</CardTitle>
            <div className="w-10 h-10 bg-[#B89B7A]/20 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-[#B89B7A]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818]">{stats.total_views.toLocaleString()}</div>
            <p className="text-xs text-[#8F7A6A] mt-1">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-[#F3E8E6] border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#8F7A6A]">Taxa de Conversão</CardTitle>
            <div className="w-10 h-10 bg-[#aa6b5d]/20 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-[#aa6b5d]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#432818]">{stats.conversion_rate.toFixed(1)}%</div>
            <p className="text-xs text-[#8F7A6A] mt-1">+0.5% esta semana</p>
          </CardContent>
        </Card>
      </div>

        {/* Filters - Redesigned com cores da marca */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-[#B89B7A]/20 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row lg:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8F7A6A] w-5 h-5" />
            <Input
              placeholder="🔍 Buscar por nome, descrição, tags ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A] text-base bg-white/70 backdrop-blur-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-64 lg:w-64 h-10 md:h-12 border-[#B89B7A]/30 focus:border-[#B89B7A] focus:ring-[#B89B7A]">
              <Filter className="w-5 h-5 mr-2 text-[#8F7A6A]" />
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
      </div>

        {/* Funnels List - Melhorada responsividade - Fase 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-white shadow-lg">
              <CardHeader className="space-y-3">
                <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {/* Templates Fixos - Redesigned */}
            {(!searchTerm || statusFilter === 'all') && FUNNEL_TEMPLATES.map((template) => (
              <Card 
                key={`template-${template.id}`}
                className={`group relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 ${
                  template.id === 'default-quiz-funnel-21-steps' 
                    ? 'bg-gradient-to-br from-[#F5F1EC] via-[#F0E8DC] to-[#EBE0D0] ring-2 ring-[#B89B7A] shadow-xl' 
                    : 'bg-gradient-to-br from-white to-[#F5F1EC] shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className={`text-xl font-bold flex items-center ${
                        template.id === 'default-quiz-funnel-21-steps' 
                          ? 'text-[#B89B7A]' 
                          : 'text-[#432818]'
                      }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          template.id === 'default-quiz-funnel-21-steps' 
                            ? 'bg-[#F0E8DC]' 
                            : 'bg-[#F5F1EC]'
                        }`}>
                          <template.icon className="w-5 h-5" />
                        </div>
                        <div>
                          {template.name}
                          {template.id === 'default-quiz-funnel-21-steps' && (
                            <Badge className="ml-2 bg-[#B89B7A] text-white text-xs font-semibold">
                              PRINCIPAL
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription className="text-[#6B5B4F] mt-2 leading-relaxed">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs bg-[#F0E8DC] text-[#6B5B4F] hover:bg-[#EBE0D0] transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-[#432818]">{template.steps}</div>
                      <div className="text-[#6B5B4F]">Etapas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[#432818]">{template.estimatedTime}min</div>
                      <div className="text-[#6B5B4F]">Duração</div>
                    </div>
                    <div className="text-center">
                      <Badge 
                        variant={template.difficulty === 'easy' ? 'default' : template.difficulty === 'medium' ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {template.difficulty === 'easy' ? 'Fácil' : template.difficulty === 'medium' ? 'Médio' : 'Avançado'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => openDefaultTemplate()}
                      className={`flex-1 transition-all duration-200 ${
                        template.id === 'default-quiz-funnel-21-steps'
                          ? 'bg-gradient-to-r from-[#B89B7A] to-[#9F836A] hover:from-[#9F836A] hover:to-[#8A6F5A] text-white shadow-lg'
                          : 'bg-gradient-to-r from-[#432818] to-[#331e12] hover:from-[#331e12] hover:to-[#23140c] text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {template.id === 'default-quiz-funnel-21-steps' ? 'Usar Template Completo' : 'Usar Template'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsTemplateDialogOpen(true);
                      }}
                      className="border-[#EBE0D0] hover:border-[#D9C9B8] hover:bg-[#F5F1EC] text-[#6B5B4F]"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Funis Existentes */}
            {filteredFunnels.length === 0 && !loading ? (
              <div className="col-span-full text-center py-12 bg-[#FDFBF9] border-2 border-dashed border-[#EBE0D0] rounded-lg">
                <BarChart3 className="mx-auto h-12 w-12 text-[#D9C9B8]" />
                <h3 className="mt-4 text-lg font-semibold text-[#432818]">Nenhum Funil Encontrado</h3>
                <p className="mt-2 text-sm text-[#6B5B4F]">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece criando seu primeiro funil usando um dos templates acima.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    className="mt-6 bg-gradient-to-r from-[#B89B7A] to-[#9F836A] hover:from-[#9F836A] hover:to-[#8A6F5A] text-white shadow-lg"
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
                      <div className="flex justify-between items-center text-sm text-[#6B5B4F] mb-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(funnel.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span>{funnel.settings?.pages_count || 0} páginas</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {isTemplate ? (
                          <>
                            {funnel.settings?.template_type === 'default-21-steps' ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1 border-[#EBE0D0] hover:border-[#D9C9B8] hover:bg-[#F5F1EC] text-[#6B5B4F]"
                                  onClick={() => createFunnelFromDBTemplate(funnel, false)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Usar Template
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gradient-to-r from-[#B89B7A] to-[#9F836A] hover:from-[#9F836A] hover:to-[#8A6F5A] text-white shadow-md"
                                  onClick={() => createFunnelFromDBTemplate(funnel, true)}
                                >
                                  <Copy className="w-4 h-4 mr-1" />
                                  Duplicar
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gradient-to-r from-[#B89B7A] to-[#9F836A] hover:from-[#9F836A] hover:to-[#8A6F5A] text-white shadow-md"
                                  onClick={() => createFunnelFromDBTemplate(funnel, false)}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Usar Template
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-[#EBE0D0] hover:border-[#D9C9B8] hover:bg-[#F5F1EC] text-[#6B5B4F]"
                                  onClick={() => navigateToEditor(funnel.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Visualizar
                                </Button>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="flex-1 border-[#EBE0D0] hover:border-[#D9C9B8] hover:bg-[#F5F1EC] text-[#6B5B4F]">
                              <Eye className="w-4 h-4 mr-1" />
                              Visualizar
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-[#B89B7A] to-[#9F836A] hover:from-[#9F836A] hover:to-[#8A6F5A] text-white shadow-md"
                              onClick={() => navigateToEditor(funnel.id)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editor
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-[#EBE0D0] hover:border-[#D9C9B8] hover:bg-[#F5F1EC] text-[#6B5B4F]"
                              onClick={() => openEditDialog(funnel)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-[#EBE0D0] hover:border-[#D9C9B8] hover:bg-[#F5F1EC] text-[#6B5B4F]"
                              onClick={() => handleDuplicateFunnel(funnel)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-[#EBE0D0] hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
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
                        <p className="text-xs text-[#8F7A6A] mb-3">
                          <strong>Template Completo:</strong> Funil profissional de 21 etapas pronto para uso.
                        </p>
                        <div className="text-xs text-[#6B5B4F] mb-3 space-y-1">
                          <div>🔹 <strong>Editar Template:</strong> Modifica o template base (ID: default-quiz-funnel-21-steps)</div>
                          <div>🔹 <strong>Criar Nova Cópia:</strong> Gera novo funil com ID único (ex: quiz-copy-123456)</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              createFunnelFromTemplate(template, false);
                            }}
                            className="flex-1 text-xs border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar Template
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              createFunnelFromTemplate(template, true);
                            }}
                            className="flex-1 text-xs bg-[#B89B7A] hover:bg-[#9F836A] text-white"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Criar Nova Cópia
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {template.id !== 'default-quiz-funnel-21-steps' && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          createFunnelFromTemplate(template, false);
                        }}
                        className="w-full mt-2 text-xs bg-[#B89B7A] hover:bg-[#9F836A] text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Usar Template
                      </Button>
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