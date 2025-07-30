
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
import { EditorStatus } from './components/EditorStatus';
import { StepsPanel } from './StepsPanel';
import { ComponentsPanel } from './ComponentsPanel';
import { schemaDrivenFunnelService } from '../../services/schemaDrivenFunnelService';
import { useToast } from '../../hooks/use-toast';

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

  // 21 Etapas do Quiz CaktoQuiz - Sistema Completo
  const initialQuiz21Steps = [
    { id: 'etapa-1', name: 'Introdução', order: 1, blocksCount: 0, isActive: true, type: 'intro', description: 'Apresentação do Quiz de Estilo' },
    { id: 'etapa-2', name: 'Coleta de Nome', order: 2, blocksCount: 0, isActive: false, type: 'name-input', description: 'Captura do nome do participante' },
    { id: 'etapa-3', name: 'Q1: Tipo de Roupa', order: 3, blocksCount: 0, isActive: false, type: 'question', description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?', multiSelect: 3 },
    { id: 'etapa-4', name: 'Q2: Personalidade', order: 4, blocksCount: 0, isActive: false, type: 'question', description: 'RESUMA A SUA PERSONALIDADE:', multiSelect: 3 },
    { id: 'etapa-5', name: 'Q3: Visual', order: 5, blocksCount: 0, isActive: false, type: 'question', description: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?', multiSelect: 3 },
    { id: 'etapa-6', name: 'Q4: Detalhes', order: 6, blocksCount: 0, isActive: false, type: 'question', description: 'QUAIS DETALHES VOCÊ GOSTA?', multiSelect: 3 },
    { id: 'etapa-7', name: 'Q5: Estampas', order: 7, blocksCount: 0, isActive: false, type: 'question', description: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?', multiSelect: 3 },
    { id: 'etapa-8', name: 'Q6: Casacos', order: 8, blocksCount: 0, isActive: false, type: 'question', description: 'QUAL CASACO É SEU FAVORITO?', multiSelect: 3 },
    { id: 'etapa-9', name: 'Q7: Calças', order: 9, blocksCount: 0, isActive: false, type: 'question', description: 'QUAL SUA CALÇA FAVORITA?', multiSelect: 3 },
    { id: 'etapa-10', name: 'Q8: Sapatos', order: 10, blocksCount: 0, isActive: false, type: 'question', description: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?', multiSelect: 3 },
    { id: 'etapa-11', name: 'Q9: Acessórios', order: 11, blocksCount: 0, isActive: false, type: 'question', description: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?', multiSelect: 3 },
    { id: 'etapa-12', name: 'Q10: Tecidos', order: 12, blocksCount: 0, isActive: false, type: 'question', description: 'O QUE MAIS VALORIZAS NOS ACESSÓRIOS?', multiSelect: 3 },
    { id: 'etapa-13', name: 'Transição', order: 13, blocksCount: 0, isActive: false, type: 'transition', description: 'Análise dos resultados parciais' },
    { id: 'etapa-14', name: 'S1: Dificuldades', order: 14, blocksCount: 0, isActive: false, type: 'strategic', description: 'Principal dificuldade com roupas' },
    { id: 'etapa-15', name: 'S2: Problemas', order: 15, blocksCount: 0, isActive: false, type: 'strategic', description: 'Problemas frequentes de estilo' },
    { id: 'etapa-16', name: 'S3: Frequência', order: 16, blocksCount: 0, isActive: false, type: 'strategic', description: '"Com que roupa eu vou?" - frequência' },
    { id: 'etapa-17', name: 'S4: Guia de Estilo', order: 17, blocksCount: 0, isActive: false, type: 'strategic', description: 'O que valoriza em um guia' },
    { id: 'etapa-18', name: 'S5: Investimento', order: 18, blocksCount: 0, isActive: false, type: 'strategic', description: 'Quanto investiria em consultoria' },
    { id: 'etapa-19', name: 'S6: Ajuda Imediata', order: 19, blocksCount: 0, isActive: false, type: 'strategic', description: 'O que mais precisa de ajuda' },
    { id: 'etapa-20', name: 'Resultado', order: 20, blocksCount: 0, isActive: false, type: 'result', description: 'Página de resultado personalizada' },
    { id: 'etapa-21', name: 'Oferta', order: 21, blocksCount: 0, isActive: false, type: 'offer', description: 'Apresentação da oferta final' }
  ];

  // Steps state com as 21 etapas do quiz
  const [steps, setSteps] = useState(initialQuiz21Steps);
  const [selectedStepId, setSelectedStepId] = useState<string>('etapa-1');

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

  // Função para carregar blocos específicos de cada etapa
  const loadStepSpecificBlocks = useCallback((stepId: string, stepType: string) => {
    console.log(`🎯 Carregando blocos específicos para ${stepId} (tipo: ${stepType})`);
    
    // Definir blocos específicos para cada tipo de etapa
    const stepTemplates: Record<string, any[]> = {
      'intro': [
        { type: 'heading-inline', properties: { content: 'Descubra Seu Estilo Pessoal', level: 'h1', textAlign: 'center' } },
        { type: 'text-inline', properties: { content: 'Um quiz personalizado para descobrir o seu estilo único', textAlign: 'center' } },
        { type: 'button-inline', properties: { content: 'Começar Quiz', size: 'large' } }
      ],
      'name-input': [
        { type: 'heading-inline', properties: { content: 'Qual é o seu nome?', level: 'h2', textAlign: 'center' } },
        { type: 'form-input', properties: { label: 'Nome', placeholder: 'Digite seu nome aqui', required: true } },
        { type: 'button-inline', properties: { content: 'Continuar', size: 'medium' } }
      ],
      'question': [
        { type: 'quiz-question', properties: { question: 'Pergunta do quiz', multiSelect: true, maxSelections: 3 } },
        { type: 'options-grid', properties: { layout: 'grid', columns: 2 } },
        { type: 'quiz-progress', properties: { showPercentage: true } }
      ],
      'strategic': [
        { type: 'strategic-question-main', properties: { question: 'Questão estratégica', type: 'strategic' } },
        { type: 'options-grid', properties: { layout: 'list', columns: 1 } },
        { type: 'text-inline', properties: { content: 'Esta informação nos ajuda a personalizar sua experiência' } }
      ],
      'transition': [
        { type: 'heading-inline', properties: { content: 'Analisando suas respostas...', level: 'h2', textAlign: 'center' } },
        { type: 'loading-animation', properties: { duration: 3000 } },
        { type: 'text-inline', properties: { content: 'Preparando questões especiais para você', textAlign: 'center' } }
      ],
      'result': [
        { type: 'result-header-inline', properties: { title: 'Seu Resultado', subtitle: 'Personalizado para você' } },
        { type: 'result-card-inline', properties: { showImage: true, showDescription: true } },
        { type: 'before-after-inline', properties: { showComparison: true } },
        { type: 'testimonials-inline', properties: { count: 3 } }
      ],
      'offer': [
        { type: 'quiz-offer-cta-inline', properties: { title: 'Oferta Especial', urgency: true } },
        { type: 'quiz-offer-pricing-inline', properties: { showDiscount: true, highlightValue: true } },
        { type: 'bonus-list-inline', properties: { showBonuses: true } },
        { type: 'button-inline', properties: { content: 'Quero Aproveitar', size: 'large', style: 'cta' } }
      ]
    };

    const blocksToAdd = stepTemplates[stepType] || stepTemplates['question'];
    
    if (blocksToAdd && blocksToAdd.length > 0) {
      handleAddBlocksToStep(stepId, blocksToAdd);
      console.log(`✅ ${blocksToAdd.length} blocos adicionados à etapa ${stepId}`);
    }
  }, [handleAddBlocksToStep]);

  // Função para popular uma etapa automaticamente
  const handlePopulateStep = useCallback((stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && step.type) {
      loadStepSpecificBlocks(stepId, step.type);
    }
  }, [steps, loadStepSpecificBlocks]);
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
    setSelectedStepId(stepId);
    setSelectedBlockId(null); // Clear block selection when changing steps
  }, []);

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
