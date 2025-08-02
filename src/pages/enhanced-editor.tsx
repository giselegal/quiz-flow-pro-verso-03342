import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';
import { ComponentsSidebar } from '../components/editor/sidebar/ComponentsSidebar';
import { EditPreview } from '../components/editor/preview/EditPreview';
import { DynamicPropertiesPanel } from '../components/editor/panels/DynamicPropertiesPanel';
import { EditorToolbar } from '../components/editor/toolbar/EditorToolbar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import { useEditor } from '../hooks/useEditor';
import { useEditorPersistence } from '../hooks/editor/useEditorPersistence';
import { useAutoSaveWithDebounce } from '../hooks/editor/useAutoSaveWithDebounce';
import { toast } from '../components/ui/use-toast';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { EditorQuizProvider } from '../contexts/EditorQuizContext';
import { schemaDrivenFunnelService } from '../services/schemaDrivenFunnelService';
import { UniversalBlockRenderer } from '../components/editor/blocks/UniversalBlockRenderer';
import { normalizeBlock } from '../utils/blockTypeMapping';

// Ícones Lucide
import { 
  Plus, Eye, EyeOff, Download, Upload, Trash2, 
  Monitor, Tablet, Smartphone, PlayCircle, ExternalLink,
  Search, Filter, Grid, List, Settings, Save,
  Copy, Scissors, Home, ArrowLeft, ArrowRight
} from 'lucide-react';

// ===== INTERFACES E TIPOS =====
interface QuizStep {
  id: string;
  name: string;
  order: number;
  blocksCount: number;
  isActive: boolean;
  type: string;
  description: string;
  multiSelect?: number;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

const PREVIEW_DIMENSIONS = {
  desktop: { width: '100%', maxWidth: '1200px' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' }
};

// ===== COMPONENTES DISPONÍVEIS =====
const AVAILABLE_BLOCKS = [
  // COMPONENTES BÁSICOS
  { type: 'heading', name: 'Título', icon: '📝', category: 'text' },
  { type: 'text', name: 'Texto', icon: '📄', category: 'text' },
  { type: 'image', name: 'Imagem', icon: '🖼️', category: 'media' },
  { type: 'button', name: 'Botão', icon: '🔘', category: 'interactive' },
  { type: 'cta', name: 'Call to Action', icon: '🎯', category: 'interactive' },
  { type: 'spacer', name: 'Espaçador', icon: '➖', category: 'layout' },
  { type: 'form-input', name: 'Campo de Entrada', icon: '📝', category: 'form' },
  { type: 'list', name: 'Lista', icon: '📋', category: 'text' },

  // COMPONENTES QUIZ PRINCIPAIS
  { type: 'options-grid', name: 'Grade de Opções', icon: '⚏', category: 'quiz' },
  { type: 'vertical-canvas-header', name: 'Cabeçalho Quiz', icon: '🏷️', category: 'quiz' },
  { type: 'quiz-question', name: 'Questão do Quiz', icon: '❓', category: 'quiz' },
  { type: 'quiz-progress', name: 'Progresso', icon: '📊', category: 'quiz' },
  { type: 'quiz-transition', name: 'Transição', icon: '🔄', category: 'quiz' },

  // COMPONENTES INLINE ESSENCIAIS
  { type: 'text-inline', name: 'Texto Inline', icon: '📝', category: 'inline' },
  { type: 'heading-inline', name: 'Título Inline', icon: '📰', category: 'inline' },
  { type: 'button-inline', name: 'Botão Inline', icon: '🔘', category: 'inline' },
  { type: 'badge-inline', name: 'Badge Inline', icon: '🏷️', category: 'inline' },
  { type: 'progress-inline', name: 'Progresso Inline', icon: '📈', category: 'inline' },
  { type: 'image-display-inline', name: 'Imagem Inline', icon: '🖼️', category: 'inline' },
  { type: 'style-card-inline', name: 'Card de Estilo', icon: '🎨', category: 'inline' },
  { type: 'result-card-inline', name: 'Card de Resultado', icon: '🏆', category: 'inline' },
  { type: 'countdown-inline', name: 'Countdown', icon: '⏱️', category: 'inline' },
  { type: 'stat-inline', name: 'Estatística', icon: '📊', category: 'inline' },
  { type: 'pricing-card-inline', name: 'Card de Preço', icon: '💰', category: 'inline' },

  // COMPONENTES DAS 21 ETAPAS DO QUIZ
  { type: 'quiz-start-page-inline', name: 'Página Inicial do Quiz', icon: '🚀', category: '21-etapas' },
  { type: 'quiz-personal-info-inline', name: 'Informações Pessoais', icon: '👤', category: '21-etapas' },
  { type: 'quiz-experience-inline', name: 'Experiência', icon: '📚', category: '21-etapas' },
  { type: 'quiz-certificate-inline', name: 'Certificado', icon: '🏅', category: '21-etapas' },
  { type: 'quiz-leaderboard-inline', name: 'Ranking', icon: '🏆', category: '21-etapas' },
  { type: 'quiz-badges-inline', name: 'Badges', icon: '🎖️', category: '21-etapas' },
  { type: 'quiz-evolution-inline', name: 'Evolução', icon: '📈', category: '21-etapas' },
  { type: 'quiz-networking-inline', name: 'Networking', icon: '🤝', category: '21-etapas' },
  { type: 'quiz-development-plan-inline', name: 'Plano de Desenvolvimento', icon: '📋', category: '21-etapas' },
  { type: 'quiz-goals-dashboard-inline', name: 'Dashboard de Metas', icon: '🎯', category: '21-etapas' },
  { type: 'quiz-final-results-inline', name: 'Resultados Finais', icon: '🏁', category: '21-etapas' },
  { type: 'quiz-offer-cta-inline', name: 'CTA de Oferta', icon: '💎', category: '21-etapas' },

  // COMPONENTES DE RESULTADO (ETAPA 20)
  { type: 'result-header-inline', name: 'Cabeçalho do Resultado', icon: '🎊', category: 'resultado' },
  { type: 'before-after-inline', name: 'Antes e Depois', icon: '🔄', category: 'resultado' },
  { type: 'bonus-list-inline', name: 'Lista de Bônus', icon: '🎁', category: 'resultado' },
  { type: 'step-header-inline', name: 'Cabeçalho de Etapa', icon: '📌', category: 'resultado' },
  { type: 'testimonial-card-inline', name: 'Card de Depoimento', icon: '💭', category: 'resultado' },
  { type: 'testimonials-inline', name: 'Depoimentos', icon: '🗣️', category: 'resultado' },

  // COMPONENTES DE OFERTA (ETAPA 21)
  { type: 'quiz-offer-pricing-inline', name: 'Preço da Oferta', icon: '💰', category: 'oferta' },
  { type: 'loading-animation', name: 'Animação de Carregamento', icon: '⏳', category: 'oferta' },

  // COMPONENTES MODERNOS
  { type: 'video-player', name: 'Player de Vídeo', icon: '🎬', category: 'media' },
  { type: 'faq-section', name: 'Seção de FAQ', icon: '❓', category: 'content' },
  { type: 'testimonials', name: 'Grade de Depoimentos', icon: '🌟', category: 'content' },
  { type: 'guarantee', name: 'Garantia', icon: '✅', category: 'content' },

  // COMPONENTES ESTRATÉGICOS
  { type: 'strategic-question-image', name: 'Questão Estratégica com Imagem', icon: '🎯', category: 'strategic' },
  { type: 'strategic-question-main', name: 'Questão Estratégica Principal', icon: '🎪', category: 'strategic' },
  { type: 'strategic-question-inline', name: 'Questão Estratégica Inline', icon: '🎲', category: 'strategic' },
];

// ===== COMPONENTE PRINCIPAL =====
const EnhancedEditorPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isLoadingFunnel, setIsLoadingFunnel] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);
  
  // Extract funnel ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const funnelId = urlParams.get('id');
  
  const { config, addBlock, updateBlock, deleteBlock, setConfig } = useEditor();
  const { saveFunnel, loadFunnel, isSaving, isLoading } = useEditorPersistence();

  // ===== SISTEMA DE 21 ETAPAS =====
  const mergeWith21Steps = useCallback((existingSteps: any[] = []) => {
    const baseQuiz21Steps = [
      { id: 'etapa-1', name: 'Introdução', order: 1, type: 'intro', description: 'Apresentação do Quiz de Estilo' },
      { id: 'etapa-2', name: 'Coleta de Nome', order: 2, type: 'name-input', description: 'Captura do nome do participante' },
      { id: 'etapa-3', name: 'Q1: Tipo de Roupa', order: 3, type: 'question', description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?', multiSelect: 3 },
      { id: 'etapa-4', name: 'Q2: Personalidade', order: 4, type: 'question', description: 'RESUMA A SUA PERSONALIDADE:', multiSelect: 3 },
      { id: 'etapa-5', name: 'Q3: Visual', order: 5, type: 'question', description: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?', multiSelect: 3 },
      { id: 'etapa-6', name: 'Q4: Detalhes', order: 6, type: 'question', description: 'QUAIS DETALHES VOCÊ GOSTA?', multiSelect: 3 },
      { id: 'etapa-7', name: 'Q5: Estampas', order: 7, type: 'question', description: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?', multiSelect: 3 },
      { id: 'etapa-8', name: 'Q6: Casacos', order: 8, type: 'question', description: 'QUAL CASACO É SEU FAVORITO?', multiSelect: 3 },
      { id: 'etapa-9', name: 'Q7: Calças', order: 9, type: 'question', description: 'QUAL SUA CALÇA FAVORITA?', multiSelect: 3 },
      { id: 'etapa-10', name: 'Q8: Sapatos', order: 10, type: 'question', description: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?', multiSelect: 3 },
      { id: 'etapa-11', name: 'Q9: Acessórios', order: 11, type: 'question', description: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?', multiSelect: 3 },
      { id: 'etapa-12', name: 'Q10: Tecidos', order: 12, type: 'question', description: 'O QUE MAIS VALORIZAS NOS ACESSÓRIOS?', multiSelect: 3 },
      { id: 'etapa-13', name: 'Transição', order: 13, type: 'transition', description: 'Análise dos resultados parciais' },
      { id: 'etapa-14', name: 'S1: Dificuldades', order: 14, type: 'strategic', description: 'Principal dificuldade com roupas' },
      { id: 'etapa-15', name: 'S2: Problemas', order: 15, type: 'strategic', description: 'Problemas frequentes de estilo' },
      { id: 'etapa-16', name: 'S3: Frequência', order: 16, type: 'strategic', description: '"Com que roupa eu vou?" - frequência' },
      { id: 'etapa-17', name: 'S4: Guia de Estilo', order: 17, type: 'strategic', description: 'O que valoriza em um guia' },
      { id: 'etapa-18', name: 'S5: Investimento', order: 18, type: 'strategic', description: 'Quanto investiria em consultoria' },
      { id: 'etapa-19', name: 'S6: Ajuda Imediata', order: 19, type: 'strategic', description: 'O que mais precisa de ajuda' },
      { id: 'etapa-20', name: 'Resultado', order: 20, type: 'result', description: 'Página de resultado personalizada' },
      { id: 'etapa-21', name: 'Oferta', order: 21, type: 'offer', description: 'Apresentação da oferta final' }
    ];

    return baseQuiz21Steps.map(baseStep => {
      const existingStep = existingSteps.find(step => step.id === baseStep.id);
      return {
        ...baseStep,
        blocksCount: existingStep?.blocksCount || 0,
        isActive: existingStep?.isActive || (baseStep.id === 'etapa-1'),
        name: existingStep?.name || baseStep.name
      };
    });
  }, []);

  const initialQuiz21Steps = useMemo(() => {
    const savedSteps = localStorage.getItem('quiz-steps');
    const existingSteps = savedSteps ? JSON.parse(savedSteps) : [];
    return mergeWith21Steps(existingSteps);
  }, [mergeWith21Steps]);

  const [steps, setSteps] = useState(initialQuiz21Steps);
  const [selectedStepId, setSelectedStepId] = useState<string>('etapa-1');

  // ===== DETECÇÃO DE MOBILE =====
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // ===== CARREGAMENTO DE FUNIL =====
  useEffect(() => {
    const loadFunnelData = async () => {
      if (!funnelId) return;
      
      setIsLoadingFunnel(true);
      try {
        console.log('🔍 Loading funnel from schema service:', funnelId);
        const schemaDrivenData = await schemaDrivenFunnelService.loadFunnel(funnelId);
        
        if (schemaDrivenData) {
          const firstPage = schemaDrivenData.pages[0];
          if (firstPage && firstPage.blocks) {
            setConfig({
              blocks: firstPage.blocks,
              title: firstPage.title,
              description: schemaDrivenData.description
            });
            console.log('✅ Loaded funnel blocks:', firstPage.blocks.length);
          }
        } else {
          console.warn('❌ Funnel not found with ID:', funnelId);
          toast({
            title: "Aviso",
            description: "Funil não encontrado. Criando novo funil.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('❌ Error loading funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar funil",
          variant: "destructive"
        });
      } finally {
        setIsLoadingFunnel(false);
      }
    };

    loadFunnelData();
  }, [funnelId, setConfig]);
  
  // ===== AUTO-SAVE =====
  const handleAutoSave = async (data: any) => {
    const preservedId = funnelId || data.id || `funnel_${Date.now()}`;
    
    const funnelData = {
      id: preservedId,
      name: data.title || 'Novo Funil',
      description: data.description || '',
      isPublished: false,
      version: data.version || 1,
      settings: data.settings || {},
      pages: [{
        id: `page_${Date.now()}`,
        pageType: 'landing',
        pageOrder: 0,
        title: data.title || 'Página Principal',
        blocks: data.blocks,
        metadata: {}
      }]
    };

    await saveFunnel(funnelData);
  };
  
  const { forceSave } = useAutoSaveWithDebounce({
    data: config,
    onSave: handleAutoSave,
    delay: 500,
    enabled: !!config?.blocks?.length,
    showToasts: false
  });

  // ===== HANDLERS =====
  const blocks = config?.blocks || [];
  const sortedBlocks = blocks.sort((a, b) => (a.order || 0) - (b.order || 0));

  const currentStep = steps.find(step => step.id === selectedStepId);
  const currentStepNumber = currentStep?.order || 1;
  const currentQuizSessionId = 'quiz-session-' + Date.now();
  const currentUserName = 'Editor User';

  const handleAddBlock = useCallback((blockType: string) => {
    const newBlockId = addBlock(blockType as any);
    setSelectedComponentId(newBlockId);
    return newBlockId;
  }, [addBlock, setSelectedComponentId]);

  const handleStepSelect = useCallback((stepId: string) => {
    setSelectedStepId(stepId);
    setSelectedComponentId(null);
  }, []);

  const handleStepAdd = useCallback(() => {
    const newStep: QuizStep = {
      id: `etapa-${steps.length + 1}`,
      name: `Nova Etapa ${steps.length + 1}`,
      order: steps.length + 1,
      blocksCount: 0,
      isActive: false,
      type: 'custom',
      description: 'Nova etapa personalizada'
    };
    setSteps([...steps, newStep]);
  }, [steps]);

  const handleBlockClick = useCallback((blockId: string) => {
    if (!isPreviewing) {
      setSelectedComponentId(blockId);
    }
  }, [isPreviewing]);

  const handleLoadTemplate = useCallback(async () => {
    try {
      setSelectedComponentId(null);
      
      console.log('🔄 Carregando blocos de teste básicos...');
      
      const testBlocks = [
        { 
          id: 'test-1',
          type: 'heading', 
          properties: { 
            content: 'Bem-vindo ao Editor Visual das 21 Etapas',
            level: 'h1',
            textAlign: 'center',
            color: '#1f2937'
          } 
        },
        { 
          id: 'test-2',
          type: 'text', 
          properties: { 
            content: 'Este é um exemplo de texto editável. Clique neste bloco para configurar suas propriedades.',
            textAlign: 'left'
          } 
        },
        { 
          id: 'test-3',
          type: 'button', 
          properties: { 
            content: 'Botão de Exemplo',
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            size: 'medium'
          } 
        },
        { 
          id: 'test-4',
          type: 'text-inline', 
          properties: { 
            content: 'Componente de texto inline - totalmente responsivo e editável'
          } 
        },
        { 
          id: 'test-5',
          type: 'heading-inline', 
          properties: { 
            content: 'Título Responsivo',
            level: 'h2',
            color: '#059669'
          } 
        }
      ];
      
      let addedCount = 0;
      for (const block of testBlocks) {
        try {
          const normalizedBlock = normalizeBlock(block);
          console.log(`📦 Adicionando bloco ${addedCount + 1}:`, normalizedBlock.type);
          
          const newBlockId = addBlock(normalizedBlock.type as any);
          addedCount++;
          
          setTimeout(() => {
            updateBlock(newBlockId, normalizedBlock.properties);
          }, 100);
          
        } catch (blockError) {
          console.warn(`⚠️ Erro ao adicionar bloco ${block.type}:`, blockError);
        }
      }
      
      toast({
        title: "Template Carregado",
        description: `${addedCount} blocos de teste adicionados com sucesso`,
      });
      
    } catch (error) {
      console.error('❌ Erro ao carregar template:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar template de teste",
        variant: "destructive"
      });
    }
  }, [addBlock, updateBlock]);

  // ===== COMPONENTE STEPS PANEL =====
  const StepsPanel: React.FC<{
    steps: QuizStep[];
    selectedStepId: string;
    onStepSelect: (stepId: string) => void;
    onStepAdd: () => void;
    className?: string;
  }> = ({ steps, selectedStepId, onStepSelect, onStepAdd, className }) => (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="font-semibold text-sm">Etapas (21)</h3>
        <Button onClick={onStepAdd} size="sm" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {steps.map((step) => (
          <Button
            key={step.id}
            variant={selectedStepId === step.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onStepSelect(step.id)}
            className="w-full justify-start text-left"
          >
            <div className="flex-1">
              <div className="font-medium">{step.name}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
              {step.blocksCount}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  // ===== COMPONENTE FILTRADO DE COMPONENTES =====
  const filteredBlocks = AVAILABLE_BLOCKS.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(AVAILABLE_BLOCKS.map(block => block.category))];

  const ComponentsPanel: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("space-y-4", className)}>
      <div className="p-2 border-b space-y-2">
        <h3 className="font-semibold text-sm">Componentes</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded text-sm"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Todas as Categorias' : category}
            </option>
          ))}
        </select>
      </div>
      
      {/* Template Buttons */}
      <div className="p-2 space-y-2">
        <Button
          onClick={handleLoadTemplate}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Carregar Template de Teste
        </Button>
      </div>
      
      {/* Components Grid */}
      <div className="p-2 space-y-1">
        {filteredBlocks.map((block) => (
          <Button
            key={block.type}
            variant="outline"
            size="sm"
            onClick={() => handleAddBlock(block.type)}
            className="w-full justify-start text-left"
          >
            <span className="mr-2">{block.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-xs">{block.name}</div>
              <div className="text-xs text-gray-500">{block.category}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  // ===== RENDER LOADING =====
  if (isLoadingFunnel || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Carregando editor...</span>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <EditorQuizProvider>
      <div className="flex flex-col h-screen bg-background">
        {/* Enhanced Toolbar */}
        <div className="flex-shrink-0 border-b bg-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={() => setLocation('/')} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold">Editor de Funil</h1>
              {funnelId && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  ID: {funnelId}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Preview Mode Selector */}
            <div className="flex items-center space-x-1 border rounded">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={() => setIsPreviewing(!isPreviewing)}
              variant={isPreviewing ? 'default' : 'outline'}
              size="sm"
            >
              {isPreviewing ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewing ? 'Editar' : 'Preview'}
            </Button>
            
            <Button onClick={() => forceSave()} disabled={isSaving} size="sm">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
        
        {/* Layout Responsivo */}
        {isMobile ? (
          /* Mobile Layout - Vertical Stack */
          <div className="flex-1 flex flex-col">
            {/* Mobile Components Panel - Horizontal */}
            <div className="flex-shrink-0 border-b border-gray-200 p-2">
              <ComponentsPanel />
            </div>

            {/* Mobile Steps Panel - Horizontal */}
            <div className="flex-shrink-0 border-b border-gray-200 p-2">
              <div className="flex space-x-2 overflow-x-auto">
                {steps.map((step) => (
                  <Button
                    key={step.id}
                    variant={selectedStepId === step.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStepSelect(step.id)}
                    className="whitespace-nowrap"
                  >
                    {step.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStepAdd}
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Canvas */}
            <div className="flex-1 bg-gray-50 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="bg-white rounded-lg shadow-sm min-h-96 p-6">
                  {sortedBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <div className="text-center space-y-4 max-w-md">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Editor das 21 Etapas do Quiz CaktoQuiz
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Selecione componentes acima para começar a construir sua etapa
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedBlocks.map((block) => {
                        const blockData = {
                          id: block.id,
                          type: block.type,
                          properties: block.properties || { ...block.content || {}, order: block.order || 0 }
                        };

                        return (
                          <div
                            key={block.id}
                            onClick={() => setSelectedComponentId(block.id)}
                            className={cn(
                              'relative p-4 rounded-lg border-2 transition-all cursor-pointer',
                              selectedComponentId === block.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <UniversalBlockRenderer
                              block={blockData}
                              stepNumber={currentStepNumber}
                              quizSessionId={currentQuizSessionId}
                              userName={currentUserName}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          /* Desktop Layout - Horizontal Panels */
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Steps Panel */}
            <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
              <div className="h-full border-r border-gray-200 overflow-hidden">
                <ScrollArea className="h-full">
                  <StepsPanel
                    steps={steps}
                    selectedStepId={selectedStepId}
                    onStepSelect={handleStepSelect}
                    onStepAdd={handleStepAdd}
                    className="p-2"
                  />
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Components Panel */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full border-r border-gray-200 overflow-hidden">
                <ScrollArea className="h-full">
                  <ComponentsPanel className="p-2" />
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Canvas */}
            <ResizablePanel defaultSize={42}>
              <div className="h-full bg-gray-50 overflow-hidden">
                <ScrollArea className="h-full p-6">
                  {/* Preview Mode Indicator */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-white rounded-md px-3 py-1 text-sm text-gray-600 shadow-sm border">
                      {previewMode === 'desktop' && <><Monitor className="w-4 h-4" /> Desktop (1200px)</>}
                      {previewMode === 'tablet' && <><Tablet className="w-4 h-4" /> Tablet (768px)</>}
                      {previewMode === 'mobile' && <><Smartphone className="w-4 h-4" /> Mobile (375px)</>}
                    </div>
                  </div>
                  
                  {/* Responsive Canvas Container */}
                  <div className="flex justify-center">
                    <div 
                      className="bg-white rounded-lg shadow-sm min-h-96 transition-all duration-300"
                      style={{
                        width: PREVIEW_DIMENSIONS[previewMode].width,
                        maxWidth: PREVIEW_DIMENSIONS[previewMode].maxWidth,
                        minWidth: previewMode === 'mobile' ? '375px' : 'auto'
                      }}
                    >
                      <div className="p-6">
                        {sortedBlocks.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <div className="text-center space-y-4 max-w-md">
                              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                <Plus className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  Editor das 21 Etapas do Quiz CaktoQuiz
                                </h3>
                                <p className="text-gray-600 mb-4">
                                  Sistema completo para criar um funil de quiz de estilo pessoal otimizado para conversão
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Button
                                  onClick={handleLoadTemplate}
                                  className="w-full mb-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Carregar Blocos de Teste
                                </Button>
                                <p className="text-sm text-gray-500 text-center">
                                  Ou arraste componentes da barra lateral
                                </p>
                              </div>
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-700">
                                  <strong>🎯 Status:</strong> {steps.length} etapas configuradas | {AVAILABLE_BLOCKS.length} componentes disponíveis
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {sortedBlocks.map((block) => {
                              const blockData = {
                                id: block.id,
                                type: block.type,
                                properties: block.properties || { ...block.content || {}, order: block.order || 0 }
                              };

                              return (
                                <div
                                  key={block.id}
                                  className={cn(
                                    'transition-all duration-200',
                                    selectedComponentId === block.id && !isPreviewing && 
                                    'ring-2 ring-blue-500 rounded-lg'
                                  )}
                                >
                                  <UniversalBlockRenderer
                                    block={blockData}
                                    isSelected={selectedComponentId === block.id}
                                    onClick={() => handleBlockClick(block.id)}
                                    disabled={isPreviewing}
                                    stepNumber={currentStepNumber}
                                    quizSessionId={currentQuizSessionId}
                                    userName={currentUserName}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Properties Panel */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <DynamicPropertiesPanel
                selectedBlock={selectedComponentId ? {
                  id: selectedComponentId,
                  type: blocks.find(b => b.id === selectedComponentId)?.type || '',
                  properties: blocks.find(b => b.id === selectedComponentId)?.properties || {}
                } : null}
                funnelConfig={{
                  name: 'Novo Funil',
                  description: '',
                  isPublished: false,
                  theme: 'default'
                }}
                onBlockPropertyChange={(key: string, value: any) => {
                  if (selectedComponentId) {
                    const block = blocks.find(b => b.id === selectedComponentId);
                    if (block) {
                      updateBlock(selectedComponentId, { 
                        ...block, 
                        properties: { ...block.properties, [key]: value } 
                      });
                    }
                  }
                }}
                onNestedPropertyChange={(path: string, value: any) => {
                  if (selectedComponentId) {
                    const currentBlock = blocks.find(b => b.id === selectedComponentId);
                    if (currentBlock) {
                      const pathParts = path.split('.');
                      const newProperties = { ...currentBlock.properties };
                      
                      // Criar estrutura aninhada se necessário
                      let target = newProperties;
                      for (let i = 0; i < pathParts.length - 1; i++) {
                        if (!target[pathParts[i]]) {
                          target[pathParts[i]] = {};
                        }
                        target = target[pathParts[i]];
                      }
                      target[pathParts[pathParts.length - 1]] = value;
                      
                      updateBlock(selectedComponentId, { 
                        ...currentBlock,
                        properties: newProperties 
                      });
                    }
                  }
                }}
                onFunnelConfigChange={(configUpdates: any) => {
                  // Para agora, não fazemos nada com configurações do funil
                  console.log('Config do funil atualizada:', configUpdates);
                }}
                onDeleteBlock={selectedComponentId ? () => {
                  deleteBlock(selectedComponentId);
                  setSelectedComponentId(null);
                } : undefined}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        
        {/* Status Bar */}
        <div className="flex-shrink-0 border-t bg-white px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>Total de blocos: {blocks.length}</span>
            <span>Etapa atual: {currentStep?.name || 'Nenhuma'}</span>
            <span>Modo: {previewMode}</span>
          </div>
          <div className="flex items-center space-x-2">
            {selectedComponentId && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Selecionado: {blocks.find(b => b.id === selectedComponentId)?.type}
              </span>
            )}
            {isSaving && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                Salvando...
              </span>
            )}
          </div>
        </div>
      </div>
    </EditorQuizProvider>
  );
};

export default EnhancedEditorPage;
