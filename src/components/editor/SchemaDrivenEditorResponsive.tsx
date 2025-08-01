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
import { getInitialQuiz21EtapasTemplate } from '../../templates/quiz21EtapasTemplate';
import { normalizeBlock } from '../../utils/blockTypeMapping';
import { AdvancedPropertyPanel } from './AdvancedPropertyPanel';
import { getStepById } from './steps'; // 🎯 NOVA ARQUITETURA LIMPA
import { EditorStatus } from './components/EditorStatus';
import { StepsPanel } from './StepsPanel';
import { ComponentsPanel } from './ComponentsPanel';
import { schemaDrivenFunnelService } from '../../services/schemaDrivenFunnelService';
import { useToast } from '../../hooks/use-toast';

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
  }, [addBlock]);

  // Função para adicionar múltiplos blocos a uma etapa específica
  const handleAddBlocksToStep = useCallback((stepId: string, blocksToAdd: any[]) => {
    console.log(`🎯 Adicionando ${blocksToAdd.length} blocos à etapa ${stepId}`);
    
    blocksToAdd.forEach((block, index) => {
      setTimeout(() => {
        try {
          const newBlockId = addBlock(block.type as any);
          if (newBlockId && block.properties) {
            // Atualizar propriedades do bloco
            updateBlock(newBlockId, block.properties);
          }
          console.log(`✅ Bloco ${index + 1}/${blocksToAdd.length} adicionado: ${block.type}`);
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
  }, [addBlock, updateBlock]);

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
    
    // Extrair número da step (etapa-1 → 1, etapa-2 → 2, etc.)
    const stepNumber = parseInt(stepId.replace('etapa-', ''));
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 21) {
      console.error(`❌ Step ID inválido: ${stepId}`);
      return;
    }
    
    console.log(`🔧 [NOVO SISTEMA] Carregando template da Step ${stepNumber}...`);
    
    try {
      // 🎯 Usar novo sistema de templates das steps
      const stepTemplate = getStepTemplate(stepNumber);
      
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
        
        return;
      }
      
      console.log(`� Template encontrado! ${stepTemplate.length} blocos para carregar`);
      console.log(`🧱 Tipos de blocos:`, stepTemplate.map(b => b.type));
      
      // 🔄 Aplicar todos os blocos do template
      stepTemplate.forEach((blockData, index) => {
        console.log(`🧱 Adicionando bloco ${index + 1}/${stepTemplate.length}:`, blockData.type);
        
        const newBlockId = addBlock(blockData.type as any);
        
        // Aplicar propriedades com delay para evitar problemas de timing
        setTimeout(() => {
          updateBlock(newBlockId, blockData.properties);
          console.log(`✅ Propriedades aplicadas para bloco ${index + 1}:`, blockData.type);
        }, index * 100);
      });
      
      // 📊 Atualizar contador de blocos da step
      const updatedBlocksCount = stepTemplate.length;
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === stepId 
            ? { ...step, blocksCount: updatedBlocksCount, isActive: true }
            : step
        )
      );
      
      console.log(`✅ Template da Step ${stepNumber} aplicado com sucesso! ${stepTemplate.length} blocos adicionados`);
      
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
  }, [steps, getStepTemplate, addBlock, updateBlock, setSteps]);

  // Component selection handler
  const handleComponentSelect = useCallback((componentId: string) => {
    handleAddBlock(componentId);
  }, [handleAddBlock]);
        // ==========================================
        // ETAPA 1: INTRODUÇÃO COM COLETA DE NOME
        // ==========================================
        defaultBlocks = [
          {
            type: 'quiz-intro-header',
            properties: {
              logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
              logoAlt: 'Logo Gisele Galvão',
              logoWidth: 120,
              logoHeight: 120,
              progressValue: 0,
              progressMax: 100,
              showBackButton: false,
              showProgress: false
            }
          },
          {
            type: 'decorative-bar-inline',
            properties: {
              width: '100%',
              height: 4,
              color: '#B89B7A',
              gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
              borderRadius: 3,
              marginTop: 8,
              marginBottom: 24,
              showShadow: true
            }
          },
          {
            type: 'text-inline',
            properties: {
              content: '<span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">Chega</span> <span style="font-family: \'Playfair Display\', serif;">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">nada combina com você.</span>',
              fontSize: 'text-3xl',
              fontWeight: 'font-bold',
              fontFamily: 'Playfair Display, serif',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 32,
              lineHeight: '1.2'
            }
          },
          {
            type: 'image-display-inline',
            properties: {
              src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
              alt: 'Transforme seu guarda-roupa',
              width: 600,
              height: 400,
              className: 'object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg',
              textAlign: 'text-center',
              marginBottom: 32
            }
          },
          {
            type: 'text-inline',
            properties: {
              content: 'Em poucos minutos, descubra seu <strong style="color: #B89B7A;">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
              fontSize: 'text-xl',
              textAlign: 'text-center',
              color: '#432818',
              marginTop: 0,
              marginBottom: 40,
              lineHeight: '1.6'
            }
          },
          {
            type: 'form-input',
            properties: {
              label: 'COMO VOCÊ GOSTARIA DE SER CHAMADA?',
              placeholder: 'Digite seu nome aqui...',
              required: true,
              inputType: 'text',
              helperText: 'Seu nome será usado para personalizar sua experiência',
              name: 'userName',
              textAlign: 'text-center',
              marginBottom: 32
            }
          },
          {
            type: 'button-inline',
            properties: {
              text: '✨ Quero Descobrir meu Estilo Agora! ✨',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff',
              requiresValidInput: true,
              textAlign: 'text-center',
              borderRadius: 'rounded-full',
              padding: 'py-4 px-8',
              fontSize: 'text-lg',
              fontWeight: 'font-bold',
              boxShadow: 'shadow-xl',
              hoverEffect: true
            }
          },
          {
            type: 'legal-notice-inline',
            properties: {
              privacyText: 'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
              copyrightText: '© 2025 Gisele Galvão - Todos os direitos reservados',
              showIcon: true,
              iconType: 'shield',
              textAlign: 'text-center',
              textSize: 'text-xs',
              textColor: '#6B7280',
              linkColor: '#B89B7A',
              marginTop: 24,
              marginBottom: 0,
              backgroundColor: 'transparent'
            }
          }
        ];
      } else if (stepIndex >= 1 && stepIndex <= 10) {
        // ==========================================
        // ETAPAS 2-11: QUESTÕES PRINCIPAIS (10 QUESTÕES)
        // ==========================================
        const questionIndex = stepIndex - 1; // Ajustar para índice 0-9
        const currentProgress = 10 + (questionIndex * 5); // Progresso de 10% a 55%
        
        console.log(`📝 [DEBUG] Carregando questão para stepIndex: ${stepIndex}, questionIndex: ${questionIndex}`);
        
        // Templates específicos para cada questão do quiz
        const questionTemplates = [
          // Q1: Tipo de Roupa Favorita
          {
            id: 'q1',
            title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
            blocks: [
              {
                type: 'quiz-intro-header',
                properties: {
                  logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                  logoAlt: 'Logo Gisele Galvão',
                  logoWidth: 96,
                  logoHeight: 96,
                  progressValue: 15,
                  progressMax: 100,
                  showBackButton: true
                }
              },
              {
                type: 'heading-inline',
                properties: {
                  content: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
                  level: 'h2',
                  fontSize: 'text-2xl',
                  fontWeight: 'font-bold',
                  textAlign: 'text-center',
                  color: '#432818',
                  marginBottom: 8
                }
              },
              {
                type: 'text-inline',
                properties: {
                  content: 'Selecione até 3 opções que mais combinam com você',
                  fontSize: 'text-base',
                  textAlign: 'text-center',
                  color: '#6B7280',
                  marginBottom: 24
                }
              },
              {
                type: 'options-grid',
                properties: {
                  questionId: 'q1',
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
                  ],
                  columns: 2,
                  showImages: true,
                  multipleSelection: true,
                  maxSelections: 3,
                  minSelections: 1
                }
              }
            ]
          },
          // Q2: Personalidade
          {
            id: 'q2',
            title: 'RESUMA A SUA PERSONALIDADE:',
            blocks: [
              {
                type: 'quiz-intro-header',
                properties: {
                  logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                  logoAlt: 'Logo Gisele Galvão',
                  logoWidth: 96,
                  logoHeight: 96,
                  progressValue: 20,
                  progressMax: 100,
                  showBackButton: true
                }
              },
              {
                type: 'heading-inline',
                properties: {
                  content: 'RESUMA A SUA PERSONALIDADE:',
                  level: 'h2',
                  fontSize: 'text-2xl',
                  fontWeight: 'font-bold',
                  textAlign: 'text-center',
                  color: '#432818',
                  marginBottom: 8
                }
              },
              {
                type: 'text-inline',
                properties: {
                  content: 'Escolha até 3 características que mais te definem',
                  fontSize: 'text-base',
                  textAlign: 'text-center',
                  color: '#6B7280',
                  marginBottom: 24
                }
              },
              {
                type: 'options-grid',
                properties: {
                  questionId: 'q2',
                  options: [
                    {
                      id: '2a',
                      text: 'Autêntica e verdadeira',
                      styleCategory: 'Natural',
                      points: 1
                    },
                    {
                      id: '2b',
                      text: 'Elegante e sofisticada',
                      styleCategory: 'Elegante',
                      points: 1
                    }
                  ],
                  columns: 2,
                  showImages: false,
                  multipleSelection: true,
                  maxSelections: 3,
                  minSelections: 1
                }
              }
            ]
          },
          // Q3-Q10: Templates similares com progresso crescente
          ...Array.from({ length: 8 }, (_, i) => ({
            id: `q${i + 3}`,
            title: `QUESTÃO ${i + 3}`,
            blocks: [
              {
                type: 'quiz-intro-header',
                properties: {
                  logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                  logoAlt: 'Logo Gisele Galvão',
                  logoWidth: 96,
                  logoHeight: 96,
                  progressValue: 25 + (i * 5),
                  progressMax: 100,
                  showBackButton: true
                }
              },
              {
                type: 'heading-inline',
                properties: {
                  content: `QUESTÃO ${i + 3}`,
                  level: 'h2',
                  fontSize: 'text-2xl',
                  fontWeight: 'font-bold',
                  textAlign: 'text-center',
                  color: '#432818',
                  marginBottom: 8
                }
              },
              {
                type: 'options-grid',
                properties: {
                  questionId: `q${i + 3}`,
                  options: [
                    { id: `${i + 3}a`, text: 'Opção A', points: 1 },
                    { id: `${i + 3}b`, text: 'Opção B', points: 1 }
                  ],
                  columns: 2,
                  maxSelections: 3
                }
              }
            ]
          }))
        ];
        
        console.log(`📦 [DEBUG] Total de templates disponíveis: ${questionTemplates.length}`);
        
        const questionTemplate = questionTemplates[questionIndex];
        console.log(`🔍 [DEBUG] Template da questão ${questionIndex + 1}:`, questionTemplate ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        
        if (questionTemplate && questionTemplate.blocks && questionTemplate.blocks.length > 0) {
          console.log(`📝 Carregando questão ${questionIndex + 1}:`, questionTemplate.title);
          console.log(`🧱 [DEBUG] Número de blocos no template: ${questionTemplate.blocks.length}`);
          defaultBlocks = questionTemplate.blocks;
        } else {
          console.error(`❌ Template da questão ${questionIndex + 1} não encontrado ou sem blocos`);
          
          // Fallback para template genérico
          defaultBlocks = [
            {
              type: 'quiz-intro-header',
              properties: {
                logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
                logoAlt: 'Logo Gisele Galvão',
                logoWidth: 96,
                logoHeight: 96,
                progressValue: currentProgress,
                progressMax: 100,
                showBackButton: true
              }
            },
            {
              type: 'heading-inline',
              properties: {
                content: `Questão ${questionIndex + 1}`,
                level: 'h2',
                fontSize: 'text-2xl',
                fontWeight: 'font-bold',
                textAlign: 'text-center',
                color: '#432818',
                marginBottom: 8
              }
            },
            {
              type: 'text-inline',
              properties: {
                content: 'Template em desenvolvimento',
                fontSize: 'text-sm',
                textAlign: 'text-center',
                color: '#6B7280',
                marginBottom: 24
              }
            }
          ];
        }
      } else if (stepIndex === 11) {
        // ==========================================
        // ETAPA 12: TRANSIÇÃO PRINCIPAL
        // ==========================================
        defaultBlocks = [
          {
            type: 'quiz-intro-header',
            properties: {
              logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
              logoAlt: 'Logo Gisele Galvão',
              logoWidth: 96,
              logoHeight: 96,
              progressValue: 60,
              progressMax: 100,
              showBackButton: true
            }
          },
          {
            type: 'heading-inline',
            properties: {
              content: 'Agora vamos conhecer você melhor',
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
              content: 'Suas escolhas até agora já revelam muito sobre seu estilo. Agora vamos aprofundar para criar um perfil ainda mais preciso.',
              fontSize: 'text-lg',
              textAlign: 'text-center',
              color: '#6B7280',
              marginBottom: 32
            }
          },
          {
            type: 'progress-inline',
            properties: {
              progressValue: 60,
              progressMax: 100,
              showPercentage: true,
              color: '#B89B7A',
              backgroundColor: '#F5F5F5',
              height: 8,
              marginBottom: 32
            }
          },
          {
            type: 'button-inline',
            properties: {
              text: 'Continuar Análise',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff'
            }
          }
        ];
      } else if (stepIndex >= 12 && stepIndex <= 17) {
        // ==========================================
        // ETAPAS 13-18: QUESTÕES ESTRATÉGICAS (6 QUESTÕES)
        // ==========================================
        const strategicIndex = stepIndex - 12;
        const currentProgress = 65 + (strategicIndex * 5);
        
        const strategicQuestions = [
          'O que mais te incomoda no seu guarda-roupa atual?',
          'Quanto você gasta por mês com roupas?',
          'Qual sua maior dificuldade na hora de se vestir?',
          'O que você mais gostaria de mudar?',
          'Como você prefere receber orientação de estilo?',
          'Você estaria disposta a investir em consultoria?'
        ];
        
        defaultBlocks = [
          {
            type: 'quiz-intro-header',
            properties: {
              logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
              logoAlt: 'Logo Gisele Galvão',
              logoWidth: 96,
              logoHeight: 96,
              progressValue: currentProgress,
              progressMax: 100,
              showBackButton: true
            }
          },
          {
            type: 'heading-inline',
            properties: {
              content: strategicQuestions[strategicIndex] || 'Questão estratégica',
              level: 'h2',
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 8
            }
          },
          {
            type: 'text-inline',
            properties: {
              content: `Questão estratégica ${strategicIndex + 1} de 6`,
              fontSize: 'text-sm',
              textAlign: 'text-center',
              color: '#6B7280',
              marginBottom: 24
            }
          },
          {
            type: 'options-grid',
            properties: {
              options: [
                { id: '1', text: 'Opção A', value: 'a' },
                { id: '2', text: 'Opção B', value: 'b' },
                { id: '3', text: 'Opção C', value: 'c' },
                { id: '4', text: 'Opção D', value: 'd' }
              ],
              columns: 1,
              showImages: false,
              multipleSelection: false,
              maxSelections: 1,
              minSelections: 1,
              validationMessage: 'Selecione uma opção',
              gridGap: 12,
              responsiveColumns: true
            }
          },
          {
            type: 'button-inline',
            properties: {
              text: 'Continuar',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff',
              disabled: true,
              requiresValidSelection: true
            }
          }
        ];
      } else if (stepIndex === 18) {
        // ==========================================
        // ETAPA 19: TRANSIÇÃO FINAL
        // ==========================================
        defaultBlocks = [
          {
            type: 'quiz-intro-header',
            properties: {
              logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
              logoAlt: 'Logo Gisele Galvão',
              logoWidth: 96,
              logoHeight: 96,
              progressValue: 95,
              progressMax: 100,
              showBackButton: false
            }
          },
          {
            type: 'heading-inline',
            properties: {
              content: 'Analisando suas respostas...',
              level: 'h2',
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 16
            }
          },
          {
            type: 'progress-inline',
            properties: {
              progressValue: 95,
              progressMax: 100,
              showPercentage: true,
              animated: true,
              color: '#B89B7A',
              backgroundColor: '#F5F5F5',
              height: 12,
              marginBottom: 24
            }
          },
          {
            type: 'text-inline',
            properties: {
              content: 'Estamos criando seu perfil personalizado baseado nas suas 18 respostas...',
              fontSize: 'text-lg',
              textAlign: 'text-center',
              color: '#6B7280',
              marginBottom: 32
            }
          },
          {
            type: 'loading-animation',
            properties: {
              type: 'spinner',
              size: 'large',
              color: '#B89B7A',
              duration: 3000
            }
          },
          {
            type: 'button-inline',
            properties: {
              text: 'Ver Meu Resultado Personalizado',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff',
              delayShow: 3000
            }
          }
        ];
      } else if (stepIndex === 19) {
        // ==========================================
        // ETAPA 20: PÁGINA DE RESULTADO
        // ==========================================
        defaultBlocks = [
          {
            type: 'result-header-inline',
            properties: {
              logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
              logoAlt: 'Logo Gisele Galvão',
              logoWidth: 96,
              logoHeight: 96,
              userName: 'dinamicUserName',
              showProgress: false
            }
          },
          {
            type: 'result-card-inline',
            properties: {
              title: 'Seu Estilo Predominante',
              styleName: 'Elegante',
              percentage: 85,
              description: 'Baseado nas suas respostas, identificamos que você tem características predominantes do estilo Elegante.',
              imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
              showMatch: true,
              animateReveal: true
            }
          },
          {
            type: 'text-inline',
            properties: {
              content: `
                <div class="characteristics-list">
                  <h3 class="text-xl font-semibold mb-4 text-[#432818]">Suas principais características:</h3>
                  <ul class="space-y-3">
                    <li class="flex items-center">
                      <span class="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center text-white text-sm mr-3">✓</span>
                      Elegância natural e sofisticação
                    </li>
                    <li class="flex items-center">
                      <span class="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center text-white text-sm mr-3">✓</span>
                      Preferência por peças atemporais
                    </li>
                    <li class="flex items-center">
                      <span class="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center text-white text-sm mr-3">✓</span>
                      Valoriza qualidade sobre quantidade
                    </li>
                  </ul>
                </div>
              `,
              fontSize: 'text-base',
              textAlign: 'text-left',
              color: '#432818',
              marginBottom: 32
            }
          },
          {
            type: 'image-display-inline',
            properties: {
              src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
              alt: 'Guia de transformação do seu estilo',
              width: 600,
              height: 400,
              className: 'object-cover w-full h-auto rounded-lg mx-auto shadow-lg'
            }
          },
          {
            type: 'button-inline',
            properties: {
              text: 'QUERO TRANSFORMAR MEU GUARDA-ROUPA AGORA',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff',
              pulse: true
            }
          }
        ];
      } else if (stepIndex === 20) {
        // ==========================================
        // ETAPA 21: PÁGINA DE OFERTA
        // ==========================================
        defaultBlocks = [
          {
            type: 'heading-inline',
            properties: {
              content: 'Oferta Especial Para Você!',
              level: 'h1',
              fontSize: 'text-3xl',
              fontWeight: 'font-bold',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 16
            }
          },
          {
            type: 'text-inline',
            properties: {
              content: 'Como você tem o estilo <strong class="text-[#B89B7A]">ELEGANTE</strong> predominante, criei uma oferta especial para você transformar seu guarda-roupa.',
              fontSize: 'text-lg',
              textAlign: 'text-center',
              color: '#432818',
              marginBottom: 24
            }
          },
          {
            type: 'image-display-inline',
            properties: {
              src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_COMPLETO_PRODUTO.webp',
              alt: 'Guia Completo do Seu Estilo',
              width: 500,
              height: 400,
              className: 'object-cover w-full h-auto rounded-lg mx-auto shadow-xl'
            }
          },
          {
            type: 'countdown-inline',
            properties: {
              title: 'Esta oferta expira em:',
              targetMinutes: 15,
              showLabels: true,
              urgencyColor: 'red',
              size: 'large',
              centerAlign: true,
              onExpire: 'redirect'
            }
          },
          {
            type: 'quiz-offer-pricing-inline',
            properties: {
              originalPrice: 197,
              discountedPrice: 97,
              discountPercentage: 51,
              currency: 'BRL',
              installments: {
                number: 12,
                value: 8.83
              },
              features: [
                'Guia Completo do Seu Estilo (PDF)',
                'Análise Personalizada Detalhada',
                'Dicas de Combinações',
                'Lista de Compras Estratégicas',
                'Suporte por 30 dias'
              ],
              highlighted: true
            }
          },
          {
            type: 'button-inline',
            properties: {
              text: 'QUERO MEU GUIA PERSONALIZADO',
              variant: 'primary',
              size: 'large',
              fullWidth: true,
              backgroundColor: '#B89B7A',
              textColor: '#ffffff',
              pulse: true,
              urgency: true
            }
          }
        ];
      }

      // Adicionar os blocos usando handleAddBlocksToStep
      console.log(`🚀 [DEBUG] Iniciando adição de ${defaultBlocks.length} blocos para stepId: ${stepId}`);
      console.log(`📋 [DEBUG] Tipos de blocos a serem adicionados:`, defaultBlocks.map(b => b.type));
      handleAddBlocksToStep(stepId, defaultBlocks);
      
      console.log(`✅ [21 ETAPAS] Etapa ${stepIndex + 1} populada com ${defaultBlocks.length} blocos`);
    } catch (error) {
      console.error(`❌ Erro ao popular etapa ${stepIndex + 1}:`, error);
    }
  }, [steps, handleAddBlocksToStep]);

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
      console.log('🗑️ Todos os blocos foram removidos');
    }
  }, [blocks, deleteBlock]);

  const handleSaveInline = useCallback((blockId: string, updates: Partial<BlockData>) => {
    updateBlock(blockId, updates.properties || {});
  }, [updateBlock]);

  const handleBlockClick = useCallback((blockId: string) => {
    if (!isPreviewing) {
      setSelectedBlockId(blockId);
    }
  }, [isPreviewing]);

  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [blocks]);

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
                              onClick={handleLoadComplete21StepsTemplate}
                              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Carregar 21 Etapas
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
                              onClick={handleLoadComplete21StepsTemplate}
                              className="w-full mb-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Carregar Template Completo (21 Etapas)
                            </Button>
                            <Button
                              onClick={handleLoadTemplate}
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
                              <strong>� Status:</strong> {steps.length} etapas configuradas | {AVAILABLE_BLOCKS.length} componentes disponíveis
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
                                onClick={() => handleBlockClick(block.id)}
                                onSaveInline={handleSaveInline}
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

          <ResizableHandle withHandle />

          {/* Properties Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <AdvancedPropertyPanel
              selectedBlockId={selectedBlockId}
              properties={selectedBlockId ? blocks.find(b => b.id === selectedBlockId)?.properties || {} : {}}
              onPropertyChange={(key, value) => {
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
