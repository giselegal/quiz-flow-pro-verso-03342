import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Plus, Eye, EyeOff, Download, Upload, Trash2, Monitor, Tablet, Smartphone, PlayCircle, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEditor } from '../../hooks/useEditor';
import { UniversalBlockRenderer } from './blocks/UniversalBlockRenderer';
import type { BlockData } from '../../types/blocks';
import { EditorBlock, BlockType } from '../../types/editor'; // 🎯 Importar tipos EditorBlock e BlockType
import { normalizeBlock } from '../../utils/blockTypeMapping';
import { DynamicPropertiesPanel } from './panels/DynamicPropertiesPanel';
import { EditorStatus } from './components/EditorStatus';
import { StepsPanel } from './StepsPanel';
import { ComponentsPanel } from './ComponentsPanel';
import { schemaDrivenFunnelService } from '../../services/schemaDrivenFunnelService';
import { stepTemplateService } from '../../services/stepTemplateService';
import { useToast } from '../../hooks/use-toast';

// 🎯 FUNÇÃO PARA OBTER TEMPLATE DE ETAPA USANDO STEPTEMPLATE SERVICE
const getStepTemplate = (stepId: string) => {
  try {
    console.log(`� Obtendo template da etapa "${stepId}" via stepTemplateService...`);
    
    // Converter stepId para número (etapa-1 → 1, ou "1" → 1)
    const stepNumber = typeof stepId === 'string' 
      ? parseInt(stepId.replace(/\D/g, '')) // Remove tudo que não é dígito
      : stepId;
    
    console.log(`🔧 Convertido "${stepId}" para número: ${stepNumber}`);
    
    // Usar o novo serviço que acessa os templates individuais
    const template = stepTemplateService.getStepTemplate(stepNumber);
    
    if (template && template.length > 0) {
      console.log(`✅ Template encontrado para etapa ${stepNumber}: ${template.length} blocos`);
      console.log(`🧱 Tipos de blocos:`, template.map(b => b.type));
      
      return template.map((block: any) => ({
        type: block.type,
        properties: block.properties
      }));
    }
    
    console.warn(`⚠️ Nenhum template encontrado para etapa ${stepNumber}`);
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

  // 🎯 SISTEMA UNIFICADO: Resolver conflitos entre schemaService e stepTemplateService
  useEffect(() => {
    const loadUnifiedData = async () => {
      console.log('🔄 Iniciando carregamento unificado de dados...');
      
      if (!funnelId) {
        console.log('📝 Modo padrão: Usando stepTemplateService para 21 etapas');
        // Modo padrão: usar apenas stepTemplateService
        return;
      }

      setIsLoadingFunnel(true);
      console.log('🚀 Modo funil: Carregando funil ID:', funnelId);
      
      try {
        const funnelData = await schemaDrivenFunnelService.loadFunnel(funnelId);
        
        if (!funnelData) {
          console.log('⚠️ Funil não encontrado, mantendo stepTemplateService');
          toast({
            title: 'Funil não encontrado',
            description: 'Usando templates padrão das 21 etapas',
            variant: 'default',
          });
          return;
        }

        console.log('✅ Funil carregado:', funnelData.name);
        console.log('📄 Páginas encontradas:', funnelData.pages.length);
        
        // 🔧 SOLUÇÃO: Mesclar dados do funil COM templates do stepTemplateService
        if (funnelData.pages && funnelData.pages.length > 0) {
          const firstPage = funnelData.pages[0];
          
          // Convert to EditorBlocks with proper content
          const editorBlocks: EditorBlock[] = (firstPage.blocks || []).map((block, index) => ({
            id: block.id,
            type: block.type as BlockType,
            content: {
              title: block.properties?.title || '',
              subtitle: block.properties?.subtitle || ''
            },
            order: index + 1,
            properties: block.properties,
            visible: true
          }));
          
          const editorConfig = {
            blocks: editorBlocks
          };
          
          // Usar o método do useEditor para atualizar blocos
          setConfig(editorConfig);
          
          // 🎯 UNIFICAÇÃO: Usar stepTemplateService como base e mesclar com dados do funil
          const templateSteps = stepTemplateService.getAllSteps();
          const funnelSteps: QuizStep[] = funnelData.pages.map((page, index) => {
            const templateStep = templateSteps.find(t => t.order === index + 1);
            return {
              id: page.id || `etapa-${index + 1}`,
              name: page.title || templateStep?.name || `Etapa ${index + 1}`,
              order: index + 1,
              blocksCount: page.blocks?.length || 0,
              isActive: index === 0,
              type: templateStep?.type || 'custom',
              description: templateStep?.description || `Página do funil: ${page.title || `Etapa ${index + 1}`}`,
              multiSelect: templateStep?.multiSelect
            };
          });
          
          // Preencher etapas restantes com templates se o funil tiver menos de 21 etapas
          if (funnelSteps.length < 21) {
            const remainingSteps = templateSteps
              .filter(t => t.order > funnelSteps.length)
              .map(templateStep => ({
                id: templateStep.id,
                name: templateStep.name,
                order: templateStep.order,
                blocksCount: 0,
                isActive: false,
                type: templateStep.type,
                description: templateStep.description,
                multiSelect: templateStep.multiSelect
              }));
            
            funnelSteps.push(...remainingSteps);
          }
          
          setSteps(funnelSteps);
          setSelectedStepId(funnelSteps[0]?.id || 'etapa-1');
          
          toast({
            title: 'Funil Integrado',
            description: `${funnelData.name} mesclado com templates das 21 etapas`,
          });
          
          console.log('🎯 Dados unificados: funil + templates aplicados com sucesso');
        }
        
      } catch (error) {
        console.error('❌ Erro no carregamento unificado:', error);
        console.log('🔄 Fallback: Mantendo stepTemplateService');
        toast({
          title: 'Erro ao carregar funil',
          description: 'Usando templates padrão. Verifique o ID do funil.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingFunnel(false);
      }
    };

    loadUnifiedData();
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

  // 🎯 FUNÇÃO PARA OBTER ETAPAS DO STEPTEMPLATE SERVICE (FONTE ÚNICA DE VERDADE)
  const getStepsFromService = useCallback(() => {
    try {
      console.log('🔄 Obtendo etapas do stepTemplateService...');
      const allSteps = stepTemplateService.getAllSteps();
      
      if (allSteps && allSteps.length > 0) {
        const serviceSteps: QuizStep[] = allSteps.map((stepInfo, index) => ({
          id: stepInfo.id,
          name: stepInfo.name,
          order: stepInfo.order,
          blocksCount: stepInfo.blocksCount,
          isActive: index === 0,
          type: stepInfo.type,
          description: stepInfo.description,
          multiSelect: stepInfo.multiSelect
        }));
        
        console.log(`✅ ${serviceSteps.length} etapas obtidas do stepTemplateService`);
        console.log('📊 Estatísticas:', stepTemplateService.getTemplateStats());
        return serviceSteps;
      } else {
        console.warn('⚠️ Nenhuma etapa encontrada no stepTemplateService');
        return [];
      }
    } catch (error) {
      console.error('❌ Erro ao obter etapas do stepTemplateService:', error);
      return [];
    }
  }, []);

  // Função para preservar etapas existentes e mesclar com as etapas do service
  const mergeWithServiceSteps = useCallback((existingSteps: any[] = []) => {
    // OBTER ETAPAS DO STEPTEMPLATE SERVICE como fonte da verdade
    const serviceSteps = getStepsFromService();
    
    if (serviceSteps.length === 0) {
      // Fallback caso o service falhe
      console.warn('⚠️ stepTemplateService falhou, usando fallback básico');
      return Array.from({ length: 21 }, (_, i) => ({
        id: `etapa-${i + 1}`,
        name: `Etapa ${i + 1}`,
        order: i + 1,
        blocksCount: 0,
        isActive: i === 0,
        type: 'custom',
        description: `Etapa ${i + 1} do quiz`
      }));
    }

    // Mesclar etapas do service com dados existentes preservados
    return serviceSteps.map(serviceStep => {
      const existingStep = existingSteps.find(step => step.id === serviceStep.id);
      return {
        ...serviceStep,
        blocksCount: existingStep?.blocksCount || serviceStep.blocksCount,
        isActive: existingStep?.isActive || serviceStep.isActive,
        // Preservar nome customizado se existir
        name: existingStep?.name || serviceStep.name
      };
    });
  }, [getStepsFromService]);

  // 21 Etapas do Quiz CaktoQuiz - Sistema Completo usando SERVICE (preservando dados existentes)
  const initialQuiz21Steps = useMemo(() => {
    // Se houver dados salvos, tentar recuperá-los
    const savedSteps = localStorage.getItem('quiz-steps');
    const existingSteps = savedSteps ? JSON.parse(savedSteps) : [];
    return mergeWithServiceSteps(existingSteps);
  }, [mergeWithServiceSteps]);

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

  // 🚀 CORREÇÃO: Carregar automaticamente o conteúdo da etapa inicial se estiver vazia
  useEffect(() => {
    const currentStep = steps.find(step => step.id === selectedStepId);
    if (currentStep && blocks.length === 0 && currentStep.blocksCount === 0) {
      console.log(`🎯 Inicializando conteúdo da etapa ${selectedStepId}`);
      setTimeout(() => {
        handlePopulateStep(selectedStepId);
      }, 500); // Delay para garantir que todos os hooks foram inicializados
    }
  }, [selectedStepId, steps, blocks.length]); // Removido handlePopulateStep para evitar loop infinito

  const handleAddBlock = useCallback((blockType: string) => {
    const newBlockId = addBlock(blockType as any);
    setSelectedBlockId(newBlockId);
    
    // 🎯 CORREÇÃO: Associar bloco à etapa atual
    if (newBlockId) {
      setTimeout(() => {
        const blockToUpdate = blocks.find(b => b.id === newBlockId);
        if (blockToUpdate) {
          blockToUpdate.stepId = selectedStepId;
          updateBlock(newBlockId, { ...blockToUpdate.properties, stepId: selectedStepId });
          console.log(`✅ Bloco ${blockType} adicionado à etapa ${selectedStepId}`);
        }
      }, 50);
    }
  }, [addBlock, selectedStepId, blocks, updateBlock]);

  // Função para adicionar múltiplos blocos a uma etapa específica
  const handleAddBlocksToStep = useCallback((stepId: string, blocksToAdd: any[]) => {
    console.log(`🎯 Adicionando ${blocksToAdd.length} blocos à etapa ${stepId}`);
    
    blocksToAdd.forEach((block, index) => {
      setTimeout(() => {
        try {
          const newBlockId = addBlock(block.type as any);
          if (newBlockId) {
            // 🎯 CORREÇÃO: Adicionar stepId ao bloco para filtrar por etapa
            const blockProperties = {
              ...block.properties,
              stepId: stepId // Associar bloco à etapa
            };
            updateBlock(newBlockId, blockProperties);
            
            // Também atualizar o bloco diretamente para ter stepId
            const blockToUpdate = blocks.find(b => b.id === newBlockId);
            if (blockToUpdate) {
              blockToUpdate.stepId = stepId;
            }
          }
          console.log(`✅ Bloco ${index + 1}/${blocksToAdd.length} adicionado à etapa ${stepId}: ${block.type}`);
        } catch (error) {
          console.error(`❌ Erro ao adicionar bloco ${block.type}:`, error);
        }
      }, 100 * index); // Delay entre cada bloco
    });

    // Atualizar contador de blocos da etapa
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, blocksCount: step.blocksCount + blocksToAdd.length }
        : step
    ));
  }, [addBlock, updateBlock, blocks]);

  // Função para carregar blocos específicos de cada etapa com templates detalhados
  const loadStepSpecificBlocks = useCallback((stepId: string, stepType: string) => {
    console.log(`🎯 Carregando blocos específicos para ${stepId} (tipo: ${stepType})`);
    
    // Templates específicos para cada etapa das 21 etapas
    const stepTemplates: Record<string, any[]> = {
      'intro': [
        { 
          type: 'vertical-canvas-header', 
          properties: { 
            title: 'Descubra Seu Estilo Único',
            subtitle: 'Quiz Personalizado de Descoberta de Estilo',
            description: 'Descubra qual estilo combina mais com você através deste quiz personalizado baseado em anos de experiência em consultoria de imagem.',
            showBackButton: false,
            showProgress: false
          } 
        },
        { 
          type: 'text-inline', 
          properties: { 
            content: '• São apenas 21 etapas rápidas\n• Leva menos de 5 minutos\n• Resultado personalizado instantâneo\n• Baseado em dados reais de consultoria',
            fontSize: 'medium',
            textAlign: 'left'
          } 
        },
        { 
          type: 'button-inline', 
          properties: { 
            text: 'Começar Quiz Agora',
            variant: 'primary',
            size: 'large',
            fullWidth: true
          } 
        }
      ],
      'name-input': [
        { 
          type: 'heading-inline', 
          properties: { 
            text: 'Vamos personalizar sua experiência!',
            level: 2,
            textAlign: 'center'
          } 
        },
        { 
          type: 'text-inline', 
          properties: { 
            content: 'Como podemos te chamar?',
            fontSize: 'medium',
            textAlign: 'center'
          } 
        },
        { 
          type: 'form-input', 
          properties: { 
            label: 'Seu nome',
            placeholder: 'Digite seu primeiro nome',
            required: true,
            type: 'text'
          } 
        },
        { 
          type: 'button-inline', 
          properties: { 
            text: 'Continuar',
            variant: 'primary',
            size: 'large',
            fullWidth: true
          } 
        }
      ],
      'question': [
        { 
          type: 'quiz-progress', 
          properties: { 
            currentStep: 3,
            totalSteps: 21,
            progress: 14
          } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q1',
            title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            subtitle: 'Selecione até 3 opções que mais combinam com você',
            type: 'both',
            multiSelect: 3,
            required: true
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            options: [
              {
                id: '1a',
                text: 'Conforto, leveza e praticidade no vestir.',
                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
                styleCategory: 'Natural',
                points: 1
              },
              {
                id: '1b',
                text: 'Discrição, caimento clássico e sobriedade.',
                imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
                styleCategory: 'Clássico',
                points: 1
              }
            ]
          } 
        }
      ],
      'strategic': [
        { 
          type: 'quiz-progress', 
          properties: { 
            currentStep: 14,
            totalSteps: 21,
            progress: 67
          } 
        },
        { 
          type: 'strategic-question-main', 
          properties: { 
            questionId: 's1',
            title: 'QUAL A SUA PRINCIPAL DIFICULDADE COM ROUPAS?',
            subtitle: 'Esta informação nos ajuda a personalizar sua experiência',
            type: 'strategic',
            multiSelect: 1,
            required: true
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'list',
            columns: 1,
            options: [
              {
                id: 's1a',
                text: 'Não sei o que combina comigo',
                description: 'Dificuldade em identificar cores e estilos que valorizam',
                points: 3
              },
              {
                id: 's1b',
                text: 'Sempre uso as mesmas roupas',
                description: 'Falta de variedade no guarda-roupa',
                points: 2
              }
            ]
          } 
        }
      ],
      'transition': [
        { 
          type: 'heading-inline', 
          properties: { 
            text: 'Analisando suas respostas...',
            level: 2,
            textAlign: 'center'
          } 
        },
        { 
          type: 'loading-animation', 
          properties: { 
            type: 'spinner',
            duration: 3000,
            message: 'Processando suas preferências de estilo'
          } 
        },
        { 
          type: 'text-inline', 
          properties: { 
            content: 'Preparando questões especiais para você baseadas nas suas respostas anteriores',
            textAlign: 'center',
            fontSize: 'medium'
          } 
        }
      ],
      'result': [
        { 
          type: 'result-header-inline', 
          properties: { 
            title: 'Seu Resultado Personalizado',
            subtitle: 'Baseado nas suas 19 respostas',
            showConfetti: true
          } 
        },
        { 
          type: 'result-card-inline', 
          properties: { 
            styleType: 'Contemporâneo Elegante',
            description: 'Você tem um estilo que combina modernidade com sofisticação',
            showImage: true,
            showDescription: true,
            showCharacteristics: true
          } 
        },
        { 
          type: 'before-after-inline', 
          properties: { 
            title: 'Sua Transformação',
            showComparison: true,
            beforeText: 'Antes: Insegurança com roupas',
            afterText: 'Depois: Confiança total no seu estilo'
          } 
        },
        { 
          type: 'testimonials-inline', 
          properties: { 
            title: 'Pessoas como você disseram:',
            count: 3,
            showRatings: true
          } 
        }
      ],
      'offer': [
        { 
          type: 'quiz-offer-cta-inline', 
          properties: { 
            title: 'Transforme Seu Estilo Agora!',
            subtitle: 'Oferta Especial Baseada no Seu Resultado',
            urgency: true,
            showTimer: true
          } 
        },
        { 
          type: 'quiz-offer-pricing-inline', 
          properties: { 
            originalPrice: 297,
            discountPrice: 97,
            showDiscount: true,
            highlightValue: true,
            installments: '3x de R$ 32,33'
          } 
        },
        { 
          type: 'bonus-list-inline', 
          properties: { 
            title: 'Bônus Exclusivos Inclusos:',
            showBonuses: true,
            bonuses: [
              { name: 'Guia de Cores Personalizado', value: 'R$ 97' },
              { name: 'Lista de Compras Inteligente', value: 'R$ 67' },
              { name: 'Consultoria Online 1:1', value: 'R$ 197' }
            ]
          } 
        },
        { 
          type: 'button-inline', 
          properties: { 
            text: 'Quero Transformar Meu Estilo',
            variant: 'cta',
            size: 'large',
            fullWidth: true,
            urgent: true
          } 
        }
      ]
    };

    const blocksToAdd = stepTemplates[stepType] || stepTemplates['question'];
    
    if (blocksToAdd && blocksToAdd.length > 0) {
      handleAddBlocksToStep(stepId, blocksToAdd);
      console.log(`✅ ${blocksToAdd.length} blocos detalhados adicionados à etapa ${stepId}`);
    }
  }, [handleAddBlocksToStep]);

  // Função para carregar template específico de cada questão
  const loadQuestionTemplate = useCallback((stepId: string, questionNumber: number) => {
    console.log(`🎯 Carregando template da questão ${questionNumber} para ${stepId}`);
    
    // Templates específicos para cada questão das 21 etapas
    const questionTemplates: Record<number, any[]> = {
      1: [ // Q1: Tipo de Roupa
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 3, totalSteps: 21, progress: 14 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q1',
            title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            subtitle: 'Selecione até 3 opções que mais combinam com você',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      2: [ // Q2: Personalidade
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 4, totalSteps: 21, progress: 19 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q2',
            title: 'RESUMA A SUA PERSONALIDADE:',
            subtitle: 'Escolha até 3 características que mais te definem',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      3: [ // Q3: Visual
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 5, totalSteps: 21, progress: 24 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q3',
            title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
            subtitle: 'Selecione até 3 opções',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      4: [ // Q4: Detalhes
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 6, totalSteps: 21, progress: 29 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q4',
            title: 'QUAIS DETALHES VOCÊ GOSTA?',
            subtitle: 'Escolha até 3 elementos que mais te atraem',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      5: [ // Q5: Estampas
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 7, totalSteps: 21, progress: 33 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q5',
            title: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
            subtitle: 'Selecione até 3 estampas favoritas',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      6: [ // Q6: Casacos
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 8, totalSteps: 21, progress: 38 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q6',
            title: 'QUAL CASACO É SEU FAVORITO?',
            subtitle: 'Escolha até 3 modelos',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      7: [ // Q7: Calças
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 9, totalSteps: 21, progress: 43 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q7',
            title: 'QUAL SUA CALÇA FAVORITA?',
            subtitle: 'Selecione até 3 modelos preferidos',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      8: [ // Q8: Sapatos
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 10, totalSteps: 21, progress: 48 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q8',
            title: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
            subtitle: 'Escolha até 3 tipos de sapatos',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      9: [ // Q9: Acessórios
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 11, totalSteps: 21, progress: 52 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q9',
            title: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
            subtitle: 'Selecione até 3 tipos de acessórios',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: true
          } 
        }
      ],
      10: [ // Q10: Tecidos/Valorização
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 12, totalSteps: 21, progress: 57 } 
        },
        { 
          type: 'quiz-question', 
          properties: { 
            questionId: 'q10',
            title: 'O QUE MAIS VALORIZAS NOS ACESSÓRIOS?',
            subtitle: 'Escolha até 3 características importantes',
            multiSelect: 3
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'grid',
            columns: 2,
            showImages: false
          } 
        }
      ]
    };

    const template = questionTemplates[questionNumber];
    if (template) {
      handleAddBlocksToStep(stepId, template);
      console.log(`✅ Template da questão ${questionNumber} carregado para ${stepId}`);
    }
  }, [handleAddBlocksToStep]);

  // Função para carregar templates de questões estratégicas
  const loadStrategicQuestionTemplate = useCallback((stepId: string, strategicNumber: number) => {
    console.log(`🎯 Carregando template da questão estratégica ${strategicNumber} para ${stepId}`);
    
    const strategicTemplates: Record<number, any[]> = {
      1: [ // S1: Dificuldades
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 14, totalSteps: 21, progress: 67 } 
        },
        { 
          type: 'strategic-question-main', 
          properties: { 
            questionId: 's1',
            title: 'QUAL A SUA PRINCIPAL DIFICULDADE COM ROUPAS?',
            subtitle: 'Esta informação nos ajuda a personalizar sua experiência',
            multiSelect: 1
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'list',
            columns: 1,
            showImages: false
          } 
        }
      ],
      2: [ // S2: Problemas
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 15, totalSteps: 21, progress: 71 } 
        },
        { 
          type: 'strategic-question-main', 
          properties: { 
            questionId: 's2',
            title: 'QUAL DESSES PROBLEMAS VOCÊ TEM COM MAIS FREQUÊNCIA?',
            subtitle: 'Seja honesta, isso nos ajuda a criar um resultado mais preciso',
            multiSelect: 1
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'list',
            columns: 1,
            showImages: false
          } 
        }
      ],
      3: [ // S3: Frequência "Com que roupa eu vou?"
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 16, totalSteps: 21, progress: 76 } 
        },
        { 
          type: 'strategic-question-main', 
          properties: { 
            questionId: 's3',
            title: 'COM QUE FREQUÊNCIA VOCÊ PENSA: "COM QUE ROUPA EU VOU?"',
            subtitle: 'Queremos entender seus hábitos para personalizar melhor',
            multiSelect: 1
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'list',
            columns: 1,
            showImages: false
          } 
        }
      ],
      4: [ // S4: Guia de Estilo
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 17, totalSteps: 21, progress: 81 } 
        },
        { 
          type: 'strategic-question-main', 
          properties: { 
            questionId: 's4',
            title: 'O QUE VOCÊ MAIS VALORIZA EM UM GUIA DE ESTILO?',
            subtitle: 'Isso nos ajuda a criar a melhor experiência para você',
            multiSelect: 1
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'list',
            columns: 1,
            showImages: false
          } 
        }
      ],
      5: [ // S5: Investimento
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 18, totalSteps: 21, progress: 86 } 
        },
        { 
          type: 'strategic-question-main', 
          properties: { 
            questionId: 's5',
            title: 'QUANTO VOCÊ INVESTIRIA EM UMA CONSULTORIA COMPLETA?',
            subtitle: 'Seja realista sobre seu orçamento',
            multiSelect: 1
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'list',
            columns: 1,
            showImages: false
          } 
        }
      ],
      6: [ // S6: Ajuda Imediata
        { 
          type: 'quiz-progress', 
          properties: { currentStep: 19, totalSteps: 21, progress: 90 } 
        },
        { 
          type: 'strategic-question-main', 
          properties: { 
            questionId: 's6',
            title: 'O QUE VOCÊ MAIS PRECISA DE AJUDA AGORA?',
            subtitle: 'Última pergunta! Vamos personalizar seu resultado',
            multiSelect: 1
          } 
        },
        { 
          type: 'options-grid', 
          properties: { 
            layout: 'list',
            columns: 1,
            showImages: false
          } 
        }
      ]
    };

    const template = strategicTemplates[strategicNumber];
    if (template) {
      handleAddBlocksToStep(stepId, template);
      console.log(`✅ Template da questão estratégica ${strategicNumber} carregado para ${stepId}`);
    }
  }, [handleAddBlocksToStep]);
  // Função para carregar o template completo das 21 etapas
  const handleLoadComplete21StepsTemplate = useCallback(async () => {
    try {
      console.log('🚀 Carregando template completo das 21 etapas...');
      
      // Limpar blocos existentes
      blocks.forEach(block => {
        deleteBlock(block.id);
      });
      
      // Para cada etapa, carregar os blocos específicos
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.type) {
          setTimeout(() => {
            loadStepSpecificBlocks(step.id, step.type);
          }, i * 200); // Delay para evitar conflitos
        }
      }
      
      toast({
        title: "Template das 21 Etapas Carregado!",
        description: `${steps.length} etapas foram populadas com blocos específicos.`,
      });
      
      console.log('✅ Template completo das 21 etapas carregado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao carregar template das 21 etapas:', error);
      toast({
        title: "Erro ao carregar template",
        description: "Não foi possível carregar o template completo.",
        variant: "destructive",
      });
    }
  }, [steps, blocks, deleteBlock, loadStepSpecificBlocks, toast]);

  const handleStepSelect = useCallback((stepId: string) => {
    console.log(`🎯 Selecionando etapa: ${stepId}`);
    setSelectedStepId(stepId);
    setSelectedBlockId(null); // Clear block selection when changing steps
    
    // 🔧 CORREÇÃO: Carregar automaticamente o conteúdo da etapa selecionada
    // Verificar se a etapa já tem blocos, se não tiver, popular automaticamente
    const selectedStep = steps.find(step => step.id === stepId);
    if (selectedStep && selectedStep.blocksCount === 0) {
      console.log(`📝 Etapa ${stepId} está vazia, populando automaticamente...`);
      // Carregar conteúdo da etapa automaticamente
      setTimeout(() => {
        handlePopulateStep(stepId);
      }, 100);
    } else {
      console.log(`✅ Etapa ${stepId} já tem ${selectedStep?.blocksCount || 0} blocos`);
    }
  }, [steps]); // Removido handlePopulateStep para evitar erro de dependência circular

  const handleStepAdd = useCallback(() => {
    const newStep: QuizStep = {
      id: `etapa-${Date.now()}`,
      name: `Etapa ${steps.length + 1}`,
      order: steps.length + 1,
      blocksCount: 0,
      isActive: false,
      type: 'custom',
      description: `Etapa personalizada ${steps.length + 1}`
    };
    setSteps(prev => [...prev, newStep]);
  }, [steps.length]);

  const handleStepUpdate = useCallback((stepId: string, updates: Partial<QuizStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const handleStepDelete = useCallback((stepId: string) => {
    if (steps.length <= 1) {
      alert('Não é possível excluir a última etapa');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta etapa?')) {
      setSteps(prev => prev.filter(step => step.id !== stepId));
      if (selectedStepId === stepId) {
        setSelectedStepId(steps[0]?.id || '');
      }
    }
  }, [steps, selectedStepId]);

  const handleStepDuplicate = useCallback((stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (stepToDuplicate) {
      const newStep: QuizStep = {
        ...stepToDuplicate,
        id: `etapa-${Date.now()}`,
        name: `${stepToDuplicate.name} (Cópia)`,
        order: steps.length + 1
      };
      setSteps(prev => [...prev, newStep]);
    }
  }, [steps]);

  const handleStepReorder = useCallback((draggedId: string, targetId: string) => {
    // TODO: Implement drag and drop reordering
    console.log('Reorder step', draggedId, 'to', targetId);
  }, []);

  // Handler para popular uma etapa com blocos padrão - TODAS AS 21 ETAPAS
  const handlePopulateStep = useCallback((stepId: string) => {
    console.log(`🎯 [NOVO SISTEMA] Populando etapa ${stepId} com template modular`);
    
    // 🧹 LIMPEZA: Remover blocos existentes antes de carregar novos
    console.log(`🧹 Limpando blocos existentes antes de carregar template...`);
    blocks.forEach(block => {
      if (block.type === 'guarantee' || block.type === 'Garantia') {
        console.log(`🗑️ Removendo bloco corrompido: ${block.type} (${block.id})`);
        deleteBlock(block.id);
      }
    });
    
    // Extrair número da step (etapa-1 → 1, etapa-2 → 2, etc.)
    const stepNumber = parseInt(stepId.replace('etapa-', ''));
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 21) {
      console.error(`❌ Step ID inválido: ${stepId}`);
      return;
    }
    
    console.log(`🔧 [NOVO SISTEMA] Carregando template da Step ${stepNumber}...`);
    
    try {
      // 🎯 Usar novo sistema de templates das steps
      const stepTemplate = getStepTemplate(stepNumber.toString());
      
      console.log(`🧪 [DEBUG] Template retornado:`, stepTemplate);
      console.log(`🧪 [DEBUG] Template é array?`, Array.isArray(stepTemplate));
      console.log(`🧪 [DEBUG] Template length:`, stepTemplate?.length);
      
      if (!stepTemplate || stepTemplate.length === 0) {
        console.warn(`⚠️ Template vazio para Step ${stepNumber}, usando fallback`);
        // Fallback simples
        const fallbackBlocks = [
          {
            type: 'heading-inline',
            properties: {
              content: `Etapa ${stepNumber}`,
              level: 'h2',
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 16
            }
          },
          {
            type: 'text-inline',
            properties: {
              content: `Template da etapa ${stepNumber} em desenvolvimento`,
              fontSize: 'text-lg',
              textAlign: 'text-center',
              color: '#6B7280',
              marginBottom: 32
            }
          }
        ];
        
        console.log(`🔄 Aplicando ${fallbackBlocks.length} blocos fallback...`);
        fallbackBlocks.forEach((blockData, index) => {
          const newBlockId = addBlock(blockData.type as any);
          
          setTimeout(() => {
          updateBlock(newBlockId, blockData.properties);
          console.log(`✅ Bloco fallback ${index + 1} aplicado:`, blockData.type);
        }, index * 100);
      });
      return;
    }
    
    console.log(`Template encontrado! ${stepTemplate.length} blocos para carregar`);
    console.log(`🧱 Tipos de blocos:`, stepTemplate.map(b => b.type));
       
      // 🔄 Aplicar todos os blocos do template
      stepTemplate.forEach((blockData, index) => {
        console.log(`🧱 Adicionando bloco ${index + 1}/${stepTemplate.length}:`, blockData.type);
        console.log(`🧪 [DEBUG] Dados do bloco:`, blockData);
        
        // 🛡️ VALIDAÇÃO: Garantir que não é um bloco 'guarantee' indesejado
        if (blockData.type === 'guarantee' || blockData.type === 'Garantia') {
          console.warn(`⚠️ Bloco 'guarantee' detectado no template - pulando para evitar problema`);
          return;
        }
        
        const newBlockId = addBlock(blockData.type as any);
        
        // Aplicar propriedades com delay para evitar problemas de timing
        setTimeout(() => {
          updateBlock(newBlockId, blockData.properties);
          console.log(`✅ Propriedades aplicadas para bloco ${index + 1}:`, blockData.type);
        }, index * 100);
      });
      
      // 📊 Atualizar contador de blocos da step
      const updatedBlocksCount = stepTemplate.filter(b => b.type !== 'guarantee' && b.type !== 'Garantia').length;
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === stepId 
            ? { ...step, blocksCount: updatedBlocksCount, isActive: true }
            : step
        )
      );
      
      console.log(`✅ Template da Step ${stepNumber} aplicado com sucesso! ${updatedBlocksCount} blocos adicionados`);
      
    } catch (error) {
      console.error(`❌ Erro ao aplicar template da Step ${stepNumber}:`, error);
      
      // 🚨 Fallback de emergência
      const emergencyBlocks = [
        {
          type: 'text-inline',
          properties: {
            content: `Erro ao carregar template da Etapa ${stepNumber}`,
            fontSize: 'text-lg',
            textAlign: 'text-center',
            color: '#EF4444',
            marginBottom: 16
          }
        }
      ];
      
      emergencyBlocks.forEach((blockData, index) => {
        const newBlockId = addBlock(blockData.type as any);
        setTimeout(() => {
          updateBlock(newBlockId, blockData.properties);
        }, index * 100);
      });
    }
  }, [steps, getStepTemplate, addBlock, updateBlock, setSteps, blocks, deleteBlock]);

  // Component selection handler
  const handleComponentSelect = useCallback((componentId: string) => {
    handleAddBlock(componentId);
  }, [handleAddBlock]);

  // Template loading handler para 21 etapas
  const handleTemplateLoad = useCallback((templateId: string) => {
    if (templateId === 'quiz-21-etapas') {
      console.log('🚀 Carregando template das 21 etapas...');
      
      // Importar e carregar as 21 etapas
      import('../../utils/quiz21EtapasLoader').then(({ loadQuiz21EtapasTemplate }) => {
        const template = loadQuiz21EtapasTemplate();
        
        // Converter para o formato do editor atual usando addBlock
        console.log('📦 Limpando blocos existentes...');
        
        // Limpar blocos atuais
        blocks.forEach(block => {
          deleteBlock(block.id);
        });
        
        // Adicionar cada bloco das 21 etapas
        template.blocks.forEach((templateBlock, index) => {
          const newBlock: BlockData = {
            id: templateBlock.id || `block-${Date.now()}-${index}`,
            type: templateBlock.type,
            properties: templateBlock.content || {}
          };
          
          // Usar addBlock para adicionar o bloco
          const newBlockId = addBlock(newBlock.type as any);
          
          // Atualizar as propriedades após a criação
          setTimeout(() => {
            updateBlock(newBlockId, newBlock.properties);
          }, 100);
        });
        
        console.log('✅ Template das 21 etapas carregado com sucesso!');
      }).catch(error => {
        console.error('❌ Erro ao carregar template das 21 etapas:', error);
      });
    } else if (templateId === 'quiz-21-etapas-individualizado') {
      console.log('🧩 Carregando componentes individualizados...');
      
      // Importar e carregar componentes individualizados
      import('../../utils/quiz21EtapasIndividualizado').then(({ loadQuiz21EtapasIndividualizado }) => {
        const individualizados = loadQuiz21EtapasIndividualizado();
        
        console.log('📦 Limpando blocos existentes...');
        
        // Limpar blocos atuais
        blocks.forEach(block => {
          deleteBlock(block.id);
        });
        
        // Adicionar cada componente individualizado
        individualizados.forEach((block, index) => {
          const newBlock: BlockData = {
            id: block.id || `individual-${Date.now()}-${index}`,
            type: block.type,
            properties: block.properties || {}
          };
          
          // Usar addBlock para adicionar o bloco
          const newBlockId = addBlock(newBlock.type as any);
          
          // Atualizar as propriedades após a criação
          setTimeout(() => {
            updateBlock(newBlockId, newBlock.properties);
          }, 100);
        });
        
        console.log('✅ Componentes individualizados carregados com sucesso!');
      }).catch(error => {
        console.error('❌ Erro ao carregar componentes individualizados:', error);
      });
    }
  }, [blocks, deleteBlock, addBlock]);

  const handleLoadTemplate = useCallback(async () => {
    try {
      setSelectedBlockId(null);
      
      console.log('🔄 Carregando blocos de teste básicos...');
      
      // Blocos de teste extremamente simples para garantir funcionamento
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
      
      // Normalizar e adicionar blocos um por vez
      let addedCount = 0;
      for (const block of testBlocks) {
        try {
          const normalizedBlock = normalizeBlock(block);
          console.log(`📦 Adicionando bloco ${addedCount + 1}:`, normalizedBlock.type);
          
          const newBlockId = addBlock(normalizedBlock.type as any);
          addedCount++;
          
          // Atualizar propriedades do bloco
          setTimeout(() => {
            updateBlock(newBlockId, normalizedBlock.properties);
          }, 100);
          
        } catch (blockError) {
          console.warn(`⚠️ Erro ao adicionar bloco ${block.type}:`, blockError);
        }
      }
      
      console.log(`✅ ${addedCount} blocos de teste adicionados com sucesso!`);
      
      // Toast de sucesso
      if (addedCount > 0) {
        // toast({
        //   title: "Template carregado!",
        //   description: `${addedCount} blocos foram adicionados ao editor.`,
        // });
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar template:', error);
      // toast({
      //   title: "Erro ao carregar template",
      //   description: "Não foi possível carregar os blocos de teste.",
      //   variant: "destructive",
      // });
    }
  }, [addBlock, updateBlock]);

  const handleClearAll = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar todos os blocos?')) {
      // Limpar todos os blocos
      blocks.forEach(block => {
        deleteBlock(block.id);
      });
      setSelectedBlockId(null);
      
      // 🧹 LIMPEZA ADICIONAL: Remover dados corrompidos do localStorage
      try {
        localStorage.removeItem('editor_config');
        localStorage.removeItem('quiz-steps');
        console.log('🧹 Dados do localStorage limpos');
      } catch (error) {
        console.error('❌ Erro ao limpar localStorage:', error);
      }
      
      console.log('🗑️ Todos os blocos foram removidos');
    }
  }, [blocks, deleteBlock]);

  // 🧹 FUNÇÃO ESPECIAL: Limpar apenas blocos 'guarantee' corrompidos
  const handleClearGuaranteeBlocks = useCallback(() => {
    console.log('🧹 Procurando blocos "guarantee" corrompidos...');
    
    let removedCount = 0;
    blocks.forEach(block => {
      if (block.type === 'guarantee' || block.type === 'Garantia') {
        console.log(`🗑️ Removendo bloco corrompido: ${block.type} (${block.id})`);
        deleteBlock(block.id);
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      console.log(`✅ ${removedCount} blocos "guarantee" removidos`);
      toast({
        title: 'Blocos corrompidos removidos',
        description: `${removedCount} blocos "guarantee" foram removidos do editor.`,
      });
    } else {
      console.log('✅ Nenhum bloco "guarantee" encontrado');
    }
  }, [blocks, deleteBlock, toast]);

  const handleSaveInline = useCallback((blockId: string, updates: Partial<BlockData>) => {
    updateBlock(blockId, updates.properties || {});
  }, [updateBlock]);

  const handleBlockClick = useCallback((blockId: string) => {
    if (!isPreviewing) {
      setSelectedBlockId(blockId);
    }
  }, [isPreviewing]);

  // 🎯 CORREÇÃO: Filtrar blocos apenas da etapa atual
  const sortedBlocks = useMemo(() => {
    // Filtrar blocos que pertencem à etapa atual
    const stepBlocks = blocks.filter(block => {
      // Se o bloco tem stepId, verificar se corresponde à etapa atual
      if (block.stepId) {
        return block.stepId === selectedStepId;
      }
      // Se não tem stepId, verificar se foi adicionado recentemente e assumir etapa atual
      // (para compatibilidade com blocos antigos)
      return !block.stepId; // Mostrar blocos sem stepId apenas quando não há outros blocos
    });
    
    console.log(`🧱 [FILTRO] Etapa atual: ${selectedStepId}`);
    console.log(`🧱 [FILTRO] Total de blocos: ${blocks.length}`);
    console.log(`🧱 [FILTRO] Blocos da etapa: ${stepBlocks.length}`);
    console.log(`🧱 [FILTRO] Blocos com stepId:`, blocks.filter(b => b.stepId).map(b => `${b.id}:${b.stepId}`));
    
    return [...stepBlocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [blocks, selectedStepId]);

  // Filtrar blocos por categoria e termo de busca
  const filteredBlocks = useMemo(() => {
    return AVAILABLE_BLOCKS.filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           block.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Obter categorias únicas
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(AVAILABLE_BLOCKS.map(block => block.category))];
    return cats.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'Todos' : 
             cat === '21-etapas' ? '21 Etapas' :
             cat === 'resultado' ? 'Resultado' :
             cat === 'oferta' ? 'Oferta' :
             cat === 'strategic' ? 'Estratégicos' :
             cat === 'inline' ? 'Inline' :
             cat === 'quiz' ? 'Quiz' :
             cat === 'text' ? 'Texto' :
             cat === 'media' ? 'Mídia' :
             cat === 'interactive' ? 'Interativo' :
             cat === 'layout' ? 'Layout' :
             cat === 'form' ? 'Formulário' :
             cat === 'content' ? 'Conteúdo' : cat
    }));
  }, []);

  return (
    // <DndProvider backend={HTML5Backend}>
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
                onClick={() => {
                  // 🧪 TESTE DIRETO DE TEMPLATES
                  console.log('🧪 [TESTE DIRETO] Testando stepTemplateService...');
                  try {
                    console.log('📊 Testando Step 1...');
                    const step1Template = stepTemplateService.getStepTemplate(1);
                    console.log('✅ Step 1 resultado:', step1Template);
                    
                    console.log('📊 Testando getAllSteps...');
                    const allSteps = stepTemplateService.getAllSteps();
                    console.log('✅ Todas as etapas:', allSteps);
                    
                    alert(`Teste concluído! Step 1: ${step1Template?.length || 0} blocos. Total: ${allSteps?.length || 0} etapas. Veja console para detalhes.`);
                  } catch (error) {
                    console.error('❌ Erro no teste:', error);
                    alert(`Erro: ${error.message}`);
                  }
                }}
                className="flex items-center gap-2 bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
              >
                🧪 Teste Templates
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadComplete21StepsTemplate}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 border-none"
              >
                <Download className="w-4 h-4" />
                Carregar 21 Etapas
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Blocos de Teste
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('🧪 [DEBUG] Testando sistema de templates...');
                  console.log('🧪 [DEBUG] stepTemplateService:', stepTemplateService);
                  
                  // Testar template da etapa 1
                  try {
                    const template1 = stepTemplateService.getStepTemplate(1);
                    console.log('🧪 [DEBUG] Template etapa 1:', template1);
                    
                    if (template1 && template1.length > 0) {
                      toast({
                        title: 'Template Funcionando!',
                        description: `Etapa 1 tem ${template1.length} blocos`,
                      });
                    } else {
                      toast({
                        title: 'Template Vazio',
                        description: 'Etapa 1 retornou template vazio',
                        variant: 'destructive'
                      });
                    }
                  } catch (error) {
                    console.error('🧪 [DEBUG] Erro:', error);
                    toast({
                      title: 'Erro no Template',
                      description: `Erro: ${error.message}`,
                      variant: 'destructive'
                    });
                  }
                  
                  // Testar getStepTemplate
                  const testTemplate = getStepTemplate('etapa-1');
                  console.log('🧪 [DEBUG] getStepTemplate result:', testTemplate);
                }}
                className="flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600"
              >
                🧪 Debug Templates
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
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Canvas Vazio
                          </h3>
                          <p className="text-gray-600">
                            Toque nos componentes acima para adicionar à etapa
                          </p>
                          <div className="space-y-2">
                            <Button
                              onClick={() => handlePopulateStep(selectedStepId)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Popular Etapa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedBlocks.map((block) => {
                        // Converter EditorBlock para o formato esperado pelo UniversalBlockRenderer
                        const editorBlock: EditorBlock = {
                          id: block.id,
                          type: block.type,
                          content: block.content || {},
                          order: block.order || 0,
                          stepId: block.stepId,
                          settings: block.settings
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
                              block={editorBlock}
                              isSelected={selectedBlockId === block.id}
                              onSelect={() => setSelectedBlockId(block.id)}
                              onUpdate={(updates) => updateBlock(block.id, updates)}
                              onDelete={() => deleteBlock(block.id)}
                              isPreview={isPreviewing}
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
                  onAddBlocksToStep={handleAddBlocksToStep}
                  onPopulateStep={handlePopulateStep}
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
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Canvas Vazio
                            </h3>
                            <p className="text-gray-600">
                              Adicione componentes do painel lateral ou use um template
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Button
                              onClick={() => handlePopulateStep(selectedStepId)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Popular Etapa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedBlocks.map((block) => {
                          // Converter EditorBlock para o formato esperado pelo UniversalBlockRenderer
                          const editorBlock: EditorBlock = {
                            id: block.id,
                            type: block.type,
                            content: block.content || {},
                            order: block.order || 0,
                            stepId: block.stepId,
                            settings: block.settings
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
                                block={editorBlock}
                                isSelected={selectedBlockId === block.id}
                                onSelect={() => handleBlockClick(block.id)}
                                onUpdate={(updates) => updateBlock(block.id, updates)}
                                onDelete={() => deleteBlock(block.id)}
                                isPreview={isPreviewing}
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
            <DynamicPropertiesPanel
              selectedBlock={selectedBlockId ? (() => {
                const block = blocks.find(b => b.id === selectedBlockId);
                if (!block) return null;
                // Converter EditorBlock para BlockData
                return {
                  id: block.id,
                  type: block.type,
                  properties: { ...block.content || {}, order: block.order || 0 }
                };
              })() : null}
              funnelConfig={{
                name: 'Quiz CaktoQuiz',
                description: 'Funil de Quiz com 21 etapas',
                isPublished: false,
                theme: 'default'
              }}
              onBlockPropertyChange={(key, value) => {
                if (selectedBlockId) {
                  const block = blocks.find(b => b.id === selectedBlockId);
                  if (block) {
                    updateBlock(selectedBlockId, { 
                      ...block, 
                      properties: { ...block.properties, [key]: value } 
                    });
                  }
                }
              }}
              onNestedPropertyChange={(path, value) => {
                if (selectedBlockId) {
                  const block = blocks.find(b => b.id === selectedBlockId);
                  if (block) {
                    const parts = path.split('.');
                    const lastKey = parts.pop();
                    let current = { ...block.properties };
                    let temp = current;
                    
                    // Navegar para o objeto aninhado
                    for (const key of parts) {
                      if (!temp[key]) temp[key] = {};
                      temp[key] = { ...temp[key] };
                      temp = temp[key];
                    }
                    
                    // Atualizar a propriedade
                    if (lastKey) {
                      temp[lastKey] = value;
                      updateBlock(selectedBlockId, { ...block, properties: current });
                    }
                  }
                }
              }}
              onFunnelConfigChange={(config) => {
                console.log('Configuração do funil atualizada:', config);
                // Implementar lógica para salvar a configuração do funil
              }}
              onDeleteBlock={selectedBlockId ? () => {
                deleteBlock(selectedBlockId);
                setSelectedBlockId(null);
              } : undefined}
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
    // </DndProvider>
  );
};

export default SchemaDrivenEditorResponsive;
