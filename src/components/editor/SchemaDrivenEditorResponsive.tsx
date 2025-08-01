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
import { generateRealQuestionTemplates } from '../../data/realQuizTemplates';
import { getStepTemplate, getStepInfo, STEP_TEMPLATES } from '../steps';

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

    const blocksToAdd = questionTemplates[questionNumber] || [];
    
    if (blocksToAdd && blocksToAdd.length > 0) {
      handleAddBlocksToStep(stepId, blocksToAdd);
      console.log(`✅ ${blocksToAdd.length} blocos da questão ${questionNumber} adicionados à etapa ${stepId}`);
    }
  }, [handleAddBlocksToStep]);

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

  return (
    <div className={cn('schema-driven-editor-responsive', className)}>
      {/* ...restante do componente... */}
    </div>
  );
};

export default SchemaDrivenEditorResponsive;