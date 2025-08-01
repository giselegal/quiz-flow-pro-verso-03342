import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Plus, Eye, EyeOff, Download, Trash2, Monitor, Tablet, Smartphone, PlayCircle, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEditor } from '../../hooks/useEditor';
import { UniversalBlockRenderer } from './blocks/UniversalBlockRenderer';
import type { BlockData } from '../../types/blocks';
import { PropertyPanel } from './PropertyPanel';
import { EditorStatus } from './components/EditorStatus';
import { StepsPanel } from './StepsPanel';
import { ComponentsPanel } from './ComponentsPanel';
import { schemaDrivenFunnelService } from '../../services/schemaDrivenFunnelService';
import { useToast } from '../../hooks/use-toast';
// Templates obsoletos removidos - usando SchemaDrivenFunnelService

// Função para obter blocos de template de uma etapa específica
const getStepTemplate = (stepId: string) => {
  try {
    // Criamos um funnel temporário e extraímos os blocos da etapa solicitada
    const defaultFunnel = schemaDrivenFunnelService.createDefaultFunnel();
    const stepNumber = parseInt(stepId.replace('step-', ''));
    const page = defaultFunnel.pages.find(p => p.order === stepNumber);
    
    if (page && page.blocks) {
      return page.blocks.map(block => ({
        type: block.type,
        properties: block.properties
      }));
    }
    
    return [];
  } catch (error) {
    console.error('❌ Erro ao obter template da etapa:', error);
    return [];
  }
};

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

// Interface para as etapas do quiz
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

const AVAILABLE_BLOCKS = [
  // === COMPONENTES BÁSICOS ===
  { type: 'heading', name: 'Título', icon: '📝', category: 'text' },
  { type: 'text', name: 'Texto', icon: '📄', category: 'text' },
  { type: 'image', name: 'Imagem', icon: '🖼️', category: 'media' },
  { type: 'button', name: 'Botão', icon: '🔘', category: 'interactive' },
  { type: 'cta', name: 'Call to Action', icon: '🎯', category: 'interactive' },
  { type: 'spacer', name: 'Espaçador', icon: '➖', category: 'layout' },
  { type: 'form-input', name: 'Campo de Entrada', icon: '📝', category: 'form' },
  { type: 'list', name: 'Lista', icon: '📋', category: 'text' },

  // === COMPONENTES QUIZ PRINCIPAIS ===
  { type: 'options-grid', name: 'Grade de Opções', icon: '⚏', category: 'quiz' },
  { type: 'vertical-canvas-header', name: 'Cabeçalho Quiz', icon: '🏷️', category: 'quiz' },
  { type: 'quiz-question', name: 'Questão do Quiz', icon: '❓', category: 'quiz' },
  { type: 'quiz-progress', name: 'Progresso', icon: '📊', category: 'quiz' },
  { type: 'quiz-transition', name: 'Transição', icon: '🔄', category: 'quiz' },

  // === COMPONENTES INLINE ESSENCIAIS ===
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

  // === COMPONENTES DAS 21 ETAPAS DO QUIZ ===
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

  // === COMPONENTES DE RESULTADO (ETAPA 20) ===
  { type: 'result-header-inline', name: 'Cabeçalho do Resultado', icon: '🎊', category: 'resultado' },
  { type: 'before-after-inline', name: 'Antes e Depois', icon: '🔄', category: 'resultado' },
  { type: 'bonus-list-inline', name: 'Lista de Bônus', icon: '🎁', category: 'resultado' },
  { type: 'step-header-inline', name: 'Cabeçalho de Etapa', icon: '📌', category: 'resultado' },
  { type: 'testimonial-card-inline', name: 'Card de Depoimento', icon: '💭', category: 'resultado' },
  { type: 'testimonials-inline', name: 'Depoimentos', icon: '🗣️', category: 'resultado' },

  // === COMPONENTES DE OFERTA (ETAPA 21) ===
  { type: 'quiz-offer-pricing-inline', name: 'Preço da Oferta', icon: '💰', category: 'oferta' },
  { type: 'loading-animation', name: 'Animação de Carregamento', icon: '⏳', category: 'oferta' },

  // === COMPONENTES MODERNOS ===
  { type: 'video-player', name: 'Player de Vídeo', icon: '🎬', category: 'media' },
  { type: 'faq-section', name: 'Seção de FAQ', icon: '❓', category: 'content' },
  { type: 'testimonials', name: 'Grade de Depoimentos', icon: '🌟', category: 'content' },
  { type: 'guarantee', name: 'Garantia', icon: '✅', category: 'content' },

  // === COMPONENTES ESTRATÉGICOS ===
  { type: 'strategic-question-image', name: 'Questão Estratégica com Imagem', icon: '🎯', category: 'strategic' },
  { type: 'strategic-question-main', name: 'Questão Estratégica Principal', icon: '🎪', category: 'strategic' },
  { type: 'strategic-question-inline', name: 'Questão Estratégica Inline', icon: '🎲', category: 'strategic' },
];

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId,
  className
}) => {
  const { config, addBlock, updateBlock, deleteBlock, saveConfig, setConfig } = useEditor();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingFunnel, setIsLoadingFunnel] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { toast } = useToast();

  // Carregar dados do funil quando funnelId mudar
  useEffect(() => {
    const loadFunnelData = async () => {
      if (!funnelId) {
        console.log('📝 Nenhum funnelId fornecido, usando dados padrão');
        return;
      }

      setIsLoadingFunnel(true);
      console.log('🚀 Carregando funil com ID:', funnelId);
      
      try {
        const funnelData = await schemaDrivenFunnelService.loadFunnel(funnelId);
        
        if (!funnelData) {
          console.log('⚠️ Funil não encontrado');
          
          toast({
            title: 'Funil não encontrado',
            description: 'O funil solicitado não existe',
            variant: 'destructive',
          });
          return;
        }

        console.log('✅ Funil carregado:', funnelData.name);
        console.log('📄 Páginas encontradas:', funnelData.pages.length);
        
        // Converter dados do funil para o formato do editor
        if (funnelData.pages && funnelData.pages.length > 0) {
          const firstPage = funnelData.pages[0];
          
          const editorConfig = {
            blocks: firstPage.blocks || []
          };
          
          // Usar o método do useEditor para atualizar
          setConfig(editorConfig);
          
          // Atualizar steps baseado nas páginas
          const funnelSteps: QuizStep[] = funnelData.pages.map((page, index) => ({
            id: page.id,
            name: page.title || `Etapa ${index + 1}`,
            order: index + 1,
            blocksCount: page.blocks?.length || 0,
            isActive: index === 0,
            type: 'custom',
            description: `Página do funil: ${page.title || `Etapa ${index + 1}`}`
          }));
          
          setSteps(funnelSteps);
          setSelectedStepId(funnelSteps[0]?.id || 'etapa-1');
          
          toast({
            title: 'Funil Carregado',
            description: `${funnelData.name} - ${funnelData.pages.length} páginas`,
          });
        }
        
      } catch (error) {
        console.error('❌ Erro ao carregar funil:', error);
        toast({
          title: 'Erro ao carregar funil',
          description: 'Verifique se o ID do funil está correto',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingFunnel(false);
      }
    };

    loadFunnelData();
  }, [funnelId, setConfig, toast]);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Safe access to blocks with fallback
  const blocks = config?.blocks || [];

  // Função para preservar etapas existentes e mesclar com as 21 etapas
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

    // Mesclar etapas existentes com as 21 etapas padrão
    return baseQuiz21Steps.map(baseStep => {
      const existingStep = existingSteps.find(step => step.id === baseStep.id);
      return {
        ...baseStep,
        blocksCount: existingStep?.blocksCount || 0,
        isActive: existingStep?.isActive || (baseStep.id === 'etapa-1'),
        // Preservar nome customizado se existir
        name: existingStep?.name || baseStep.name
      };
    });
  }, []);

  // 21 Etapas do Quiz CaktoQuiz - Sistema Completo (preservando dados existentes)
  const initialQuiz21Steps = useMemo(() => {
    // Se houver dados salvos, tentar recuperá-los
    const savedSteps = localStorage.getItem('quiz-steps');
    const existingSteps = savedSteps ? JSON.parse(savedSteps) : [];
    return mergeWith21Steps(existingSteps);
  }, [mergeWith21Steps]);

  // Steps state com as 21 etapas do quiz
  const [steps, setSteps] = useState(initialQuiz21Steps);
  const [selectedStepId, setSelectedStepId] = useState<string>('etapa-1');

  // 🚀 SUPABASE: Dados do quiz atual para integração
  const currentStep = steps.find(step => step.id === selectedStepId);
  const currentStepNumber = currentStep?.order || 1;
  const currentQuizSessionId = 'quiz-session-' + Date.now(); // Gerar ID real da sessão
  const currentUserName = 'Editor User'; // Pegar nome real do usuário

  // Salvar automaticamente o estado das etapas
  useEffect(() => {
    localStorage.setItem('quiz-steps', JSON.stringify(steps));
  }, [steps]);

  // 🚀 Listener para navegação entre steps via eventos
  useEffect(() => {
    const handleNavigateToStep = (event: CustomEvent) => {
      const { stepId, source } = event.detail;
      console.log(`🎯 Navegando para ${stepId} (origem: ${source})`);
      
      // Verificar se a step existe
      const targetStep = steps.find(step => step.id === stepId);
      if (targetStep) {
        setSelectedStepId(stepId);
        console.log(`✅ Navegação para ${stepId} concluída`);
      } else {
        console.warn(`⚠️ Step ${stepId} não encontrada`);
      }
    };

    window.addEventListener('navigate-to-step', handleNavigateToStep as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to-step', handleNavigateToStep as EventListener);
    };
  }, [steps]);

  // Atualizar contador de blocos das etapas quando blocos mudarem
  useEffect(() => {
    if (blocks.length > 0) {
      setSteps(prev => prev.map(step => {
        if (step.id === selectedStepId) {
          return { ...step, blocksCount: blocks.length };
        }
        return step;
      }));
    }
  }, [blocks.length, selectedStepId]);

  // 🚀 TEMPLATE FIXO: Carregar template automaticamente quando trocar de etapa
  useEffect(() => {
    const templateBlocks = getStepTemplate(selectedStepId);
    if (templateBlocks.length > 0 && blocks.length === 0) {
      console.log(`🎯 Carregando template da etapa ${selectedStepId} (${templateBlocks.length} blocos)`);
      
      const blocksToLoad = templateBlocks.map((template, index) => ({
        id: `${selectedStepId}-block-${index + 1}`,
        type: template.type,
        content: template.properties,
        order: index + 1
      }));
      
      setConfig({ blocks: blocksToLoad });
      
      // Atualizar contador de blocos da etapa
      setSteps(prev => prev.map(step => 
        step.id === selectedStepId 
          ? { ...step, blocksCount: templateBlocks.length }
          : step
      ));
    }
  }, [selectedStepId, blocks.length, setConfig]);

  const handleAddBlock = useCallback((blockType: string) => {
    const newBlockId = addBlock(blockType as any);
    setSelectedBlockId(newBlockId);
  }, [addBlock]);

  // Template loading function
  const handleTemplateLoad = useCallback(() => {
    console.log('🔄 Carregando template básico...');
    const basicTemplate = [
      { type: 'heading-inline', properties: { content: 'Título de Exemplo', level: 'h2' } },
      { type: 'text-inline', properties: { content: 'Texto de exemplo para demonstração' } }
    ];
    
    basicTemplate.forEach((template, index) => {
      setTimeout(() => {
        const newBlockId = addBlock(template.type as any);
        updateBlock(newBlockId, template.properties);
      }, index * 100);
    });
  }, [addBlock, updateBlock]);

  // Component selection handler
  const handleComponentSelect = useCallback((componentId: string) => {
    handleAddBlock(componentId);
  }, [handleAddBlock]);

  // Step management handlers
  const handleStepSelect = useCallback((stepId: string) => {
    console.log(`🎯 Selecionando etapa: ${stepId}`);
    setSelectedStepId(stepId);
    setSelectedBlockId(null); // Clear block selection when switching steps
    
    // Load saved blocks for this step
    const savedBlocks = localStorage.getItem(`step-blocks-${stepId}`);
    if (savedBlocks) {
      try {
        const parsedBlocks = JSON.parse(savedBlocks);
        setConfig({ blocks: parsedBlocks });
      } catch (error) {
        console.error('Erro ao carregar blocos da etapa:', error);
      }
    } else {
      // Clear canvas for new step
      setConfig({ blocks: [] });
    }
  }, [setConfig]);

  const handleStepAdd = useCallback(() => {
    const maxOrder = Math.max(...steps.map(s => s.order), 0);
    const newStep: QuizStep = {
      id: `etapa-${Date.now()}`,
      name: `Nova Etapa ${maxOrder + 1}`,
      order: maxOrder + 1,
      blocksCount: 0,
      isActive: false,
      type: 'custom',
      description: 'Etapa personalizada criada pelo usuário'
    };
    setSteps(prev => [...prev, newStep]);
  }, [steps]);

  const handleStepUpdate = useCallback((stepId: string, updates: Partial<QuizStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const handleStepDelete = useCallback((stepId: string) => {
    if (steps.length <= 1) {
      console.warn('Não é possível deletar a última etapa');
      return;
    }
    
    setSteps(prev => prev.filter(step => step.id !== stepId));
    
    // If deleting current step, select the first remaining step
    if (selectedStepId === stepId) {
      const remainingSteps = steps.filter(step => step.id !== stepId);
      if (remainingSteps.length > 0) {
        setSelectedStepId(remainingSteps[0].id);
      }
    }
    
    // Remove saved blocks for this step
    localStorage.removeItem(`step-blocks-${stepId}`);
  }, [steps, selectedStepId]);

  const handleStepDuplicate = useCallback((stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (!stepToDuplicate) return;
    
    const maxOrder = Math.max(...steps.map(s => s.order), 0);
    const newStep: QuizStep = {
      ...stepToDuplicate,
      id: `etapa-${Date.now()}`,
      name: `${stepToDuplicate.name} (Cópia)`,
      order: maxOrder + 1,
      isActive: false
    };
    
    setSteps(prev => [...prev, newStep]);
    
    // Copy blocks from original step
    const originalBlocks = localStorage.getItem(`step-blocks-${stepId}`);
    if (originalBlocks) {
      localStorage.setItem(`step-blocks-${newStep.id}`, originalBlocks);
    }
  }, [steps]);

  const handleStepReorder = useCallback((draggedId: string, targetId: string) => {
    const draggedIndex = steps.findIndex(step => step.id === draggedId);
    const targetIndex = steps.findIndex(step => step.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newSteps = [...steps];
    const [draggedStep] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(targetIndex, 0, draggedStep);
    
    // Update order numbers
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    
    setSteps(reorderedSteps);
  }, [steps]);

  // Save current step blocks when switching steps
  useEffect(() => {
    if (selectedStepId && blocks.length > 0) {
      localStorage.setItem(`step-blocks-${selectedStepId}`, JSON.stringify(blocks));
    }
  }, [selectedStepId, blocks]);

  const handleClearAll = useCallback(() => {
    setConfig({ blocks: [] });
    setSelectedBlockId(null);
    
    // Clear saved blocks for current step
    if (selectedStepId) {
      localStorage.removeItem(`step-blocks-${selectedStepId}`);
    }
  }, [setConfig, selectedStepId]);

  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [blocks]);

  return (
    <div className={cn('h-full flex flex-col bg-gray-50', className)}>
      {/* Loading Indicator */}
      {isLoadingFunnel && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando funil{funnelId ? `: ${funnelId}` : ''}...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Editor Visual {funnelId ? `- ${funnelId}` : 'das 21 Etapas'}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/demo', '_blank')}
              className="flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              Demo Interativo
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleTemplateLoad}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Blocos de Teste
            </Button>
            
            {/* Preview Mode Buttons */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className="h-8 px-2"
                title="Preview Desktop"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
                className="h-8 px-2"
                title="Preview Tablet"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className="h-8 px-2"
                title="Preview Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            {blocks.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Tudo
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewing(!isPreviewing)}
              className="flex items-center gap-2"
            >
              {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreviewing ? 'Editar' : 'Visualizar'}
            </Button>
            <Button onClick={saveConfig} size="sm">
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isMobile ? (
        /* Mobile Layout - Vertical Stack */
        <div className="flex-1 flex flex-col">
          {/* Mobile Components Panel - Horizontal */}
          <div className="flex-shrink-0 border-b border-gray-200">
            <ComponentsPanel
              onComponentSelect={handleComponentSelect}
              onTemplateLoad={handleTemplateLoad}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              layout="horizontal"
              className="h-auto"
            />
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
                        <div className="space-y-2">
                          <Button
                            onClick={handleTemplateLoad}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Carregar Blocos de Teste
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedBlocks.map((block) => {
                      // Para blocos do funil, usar properties diretamente
                      // Para blocos do editor antigo, converter content para properties  
                      const blockData: BlockData = {
                        id: block.id,
                        type: block.type,
                        properties: block.properties || { ...block.content || {}, order: block.order || 0 }
                      };

                      return (
                        <div
                          key={block.id}
                          onClick={() => setSelectedBlockId(block.id)}
                          className={cn(
                            'relative p-4 rounded-lg border-2 transition-all cursor-pointer',
                            selectedBlockId === block.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <UniversalBlockRenderer
                            block={blockData}
                            isSelected={selectedBlockId === block.id}
                            onSelect={() => setSelectedBlockId(block.id)}
                            onUpdate={(properties) => updateBlock(block.id, properties)}
                            onDelete={() => deleteBlock(block.id)}
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
                  onStepUpdate={handleStepUpdate}
                  onStepDelete={handleStepDelete}
                  onStepDuplicate={handleStepDuplicate}
                  onStepReorder={handleStepReorder}
                  className="p-2"
                />
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Components Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-r border-gray-200 overflow-hidden">
              <ScrollArea className="h-full">
                <ComponentsPanel
                  onComponentSelect={handleComponentSelect}
                  onTemplateLoad={handleTemplateLoad}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  className="p-2"
                  layout="vertical"
                />
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

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
                                onClick={handleTemplateLoad}
                                variant="outline"
                                className="w-full"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Carregar Blocos de Teste
                              </Button>
                              <p className="text-sm text-gray-500 text-center">
                                Ou arraste componentes da barra lateral
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                              <div className="text-left">
                                <p className="font-medium mb-2">📊 Estrutura Completa:</p>
                                <ul className="space-y-1">
                                  <li>• 1 página de introdução</li>
                                  <li>• 1 coleta de nome</li>
                                  <li>• 10 questões principais</li>
                                  <li>• 6 questões estratégicas</li>
                                  <li>• 1 transição</li>
                                  <li>• 1 página de resultado</li>
                                  <li>• 1 página de oferta</li>
                                </ul>
                              </div>
                              <div className="text-left">
                                <p className="font-medium mb-2">🎯 Recursos Inclusos:</p>
                                <ul className="space-y-1">
                                  <li>• Cálculos automáticos</li>
                                  <li>• Progress tracking</li>
                                  <li>• Transições suaves</li>
                                  <li>• Questões estratégicas</li>
                                  <li>• Personalização completa</li>
                                  <li>• Sistema de ofertas</li>
                                </ul>
                              </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-700">
                                <strong>Status:</strong> {steps.length} etapas configuradas | {AVAILABLE_BLOCKS.length} componentes disponíveis
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Cada etapa pode ser populada individualmente através do menu de contexto (⋯)
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {sortedBlocks.map((block) => {
                            // Para blocos do funil, usar properties diretamente
                            // Para blocos do editor antigo, converter content para properties
                            const blockData: BlockData = {
                              id: block.id,
                              type: block.type,
                              properties: block.properties || { ...block.content || {}, order: block.order || 0 }
                            };

                            return (
                              <div
                                key={block.id}
                                className={cn(
                                  'transition-all duration-200',
                                  selectedBlockId === block.id && !isPreviewing && 
                                  'ring-2 ring-blue-500 rounded-lg'
                                )}
                              >
                                <UniversalBlockRenderer
                                  block={blockData}
                                  isSelected={selectedBlockId === block.id}
                                  onSelect={() => setSelectedBlockId(block.id)}
                                  onUpdate={(properties) => updateBlock(block.id, properties)}
                                  onDelete={() => deleteBlock(block.id)}
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

          <ResizableHandle withHandle />

          {/* Properties Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <PropertyPanel
              selectedBlock={selectedBlockId ? blocks.find(b => b.id === selectedBlockId) : null}
              onUpdateBlock={(id: string, updates: any) => {
                updateBlock(id, updates);
              }}
              onDeleteBlock={(id: string) => {
                deleteBlock(id);
                setSelectedBlockId(null);
              }}
              onClose={() => setSelectedBlockId(null)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
        
      {/* Editor Status Bar */}
      <div className="flex-shrink-0">
        <EditorStatus
          selectedBlockId={selectedBlockId || undefined}
          historyCount={10} // TODO: Get from property history
          currentHistoryIndex={5} // TODO: Get from property history
          canUndo={true} // TODO: Get from property history
          canRedo={false} // TODO: Get from property history
          lastAction="Propriedade alterada" // TODO: Get from property history
          totalBlocks={blocks.length}
          previewMode={previewMode}
        />
      </div>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
