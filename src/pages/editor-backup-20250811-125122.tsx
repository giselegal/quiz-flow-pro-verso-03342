// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import BrandHeader from '../components/ui/BrandHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from '../components/ui/use-toast';
import { EnhancedUniversalPropertiesPanel } from '../components/universal/EnhancedUniversalPropertiesPanel';
import { CLEAN_21_STEPS } from '../config/clean21Steps'; // 🎯 IMPORTAÇÃO DO SISTEMA DE TEMPLATES
import { getBlockComponent } from '../config/enhancedBlockRegistry';
import { useAutoSaveWithDebounce } from '../hooks/editor/useAutoSaveWithDebounce';
import { useEditorPersistence } from '../hooks/editor/useEditorPersistence';
import { useContainerProperties } from '../hooks/useContainerProperties';
import { useEditor } from '../hooks/useEditor';
import { cn } from '../lib/utils';
import { schemaDrivenFunnelService } from '../services/schemaDrivenFunnelService';
import { BlockType } from '../types/editor';
import { normalizeBlock } from '../utils/blockTypeMapping';

// Ícones Lucide
import {
  Download,
  Eye,
  EyeOff,
  Monitor,
  Plus,
  Save,
  Search,
  Smartphone,
  Tablet,
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
  mobile: { width: '375px', maxWidth: '375px' },
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
  {
    type: 'form-input',
    name: 'Campo de Entrada',
    icon: '📝',
    category: 'form',
  },
  { type: 'list', name: 'Lista', icon: '📋', category: 'text' },

  // COMPONENTES QUIZ PRINCIPAIS
  {
    type: 'options-grid',
    name: 'Grade de Opções',
    icon: '⚏',
    category: 'quiz',
  },
  {
    type: 'vertical-canvas-header',
    name: 'Cabeçalho Quiz',
    icon: '🏷️',
    category: 'quiz',
  },
  {
    type: 'quiz-question',
    name: 'Questão do Quiz',
    icon: '❓',
    category: 'quiz',
  },
  { type: 'quiz-progress', name: 'Progresso', icon: '📊', category: 'quiz' },
  { type: 'quiz-transition', name: 'Transição', icon: '🔄', category: 'quiz' },

  // COMPONENTES INLINE ESSENCIAIS
  { type: 'text-inline', name: 'Texto Inline', icon: '📝', category: 'inline' },
  {
    type: 'heading-inline',
    name: 'Título Inline',
    icon: '📰',
    category: 'inline',
  },
  {
    type: 'button-inline',
    name: 'Botão Inline',
    icon: '🔘',
    category: 'inline',
  },
  {
    type: 'badge-inline',
    name: 'Badge Inline',
    icon: '🏷️',
    category: 'inline',
  },
  {
    type: 'progress-inline',
    name: 'Progresso Inline',
    icon: '📈',
    category: 'inline',
  },
  {
    type: 'image-display-inline',
    name: 'Imagem Inline',
    icon: '🖼️',
    category: 'inline',
  },
  {
    type: 'style-card-inline',
    name: 'Card de Estilo',
    icon: '🎨',
    category: 'inline',
  },
  {
    type: 'result-card-inline',
    name: 'Card de Resultado',
    icon: '🏆',
    category: 'inline',
  },
  {
    type: 'countdown-inline',
    name: 'Countdown',
    icon: '⏱️',
    category: 'inline',
  },
  { type: 'stat-inline', name: 'Estatística', icon: '📊', category: 'inline' },
  {
    type: 'pricing-card-inline',
    name: 'Card de Preço',
    icon: '💰',
    category: 'inline',
  },

  // COMPONENTES DAS 21 ETAPAS
  {
    type: 'quiz-start-page-inline',
    name: 'Página Inicial do Quiz',
    icon: '🚀',
    category: '21-etapas',
  },
  {
    type: 'quiz-personal-info-inline',
    name: 'Informações Pessoais',
    icon: '👤',
    category: '21-etapas',
  },
  {
    type: 'quiz-experience-inline',
    name: 'Experiência',
    icon: '📚',
    category: '21-etapas',
  },
  {
    type: 'quiz-certificate-inline',
    name: 'Certificado',
    icon: '🏅',
    category: '21-etapas',
  },
  {
    type: 'quiz-leaderboard-inline',
    name: 'Ranking',
    icon: '🏆',
    category: '21-etapas',
  },

  // COMPONENTES DE RESULTADO
  {
    type: 'result-header-inline',
    name: 'Cabeçalho do Resultado',
    icon: '🎊',
    category: 'resultado',
  },
  {
    type: 'before-after-inline',
    name: 'Antes e Depois',
    icon: '🔄',
    category: 'resultado',
  },
  {
    type: 'bonus-list-inline',
    name: 'Lista de Bônus',
    icon: '🎁',
    category: 'resultado',
  },
  {
    type: 'testimonial-card-inline',
    name: 'Card de Depoimento',
    icon: '💭',
    category: 'resultado',
  },

  // COMPONENTES DE OFERTA
  {
    type: 'quiz-offer-pricing-inline',
    name: 'Preço da Oferta',
    icon: '💰',
    category: 'oferta',
  },
  {
    type: 'loading-animation',
    name: 'Animação de Carregamento',
    icon: '⏳',
    category: 'oferta',
  },

  // COMPONENTES MODERNOS
  {
    type: 'video-player',
    name: 'Player de Vídeo',
    icon: '🎬',
    category: 'media',
  },
  {
    type: 'faq-section',
    name: 'Seção de FAQ',
    icon: '❓',
    category: 'content',
  },
  {
    type: 'testimonials',
    name: 'Grade de Depoimentos',
    icon: '🌟',
    category: 'content',
  },
  { type: 'guarantee', name: 'Garantia', icon: '✅', category: 'content' },
];

// 🎯 Componente simplificado para renderizar blocos (2 containers apenas)
const SimpleBlockRenderer: React.FC<{
  block: any;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}> = ({ block, isSelected = false, onClick, onPropertyChange }) => {
  const { containerClasses, inlineStyles } = useContainerProperties(block.properties || {});
  const Component = getBlockComponent(block.type);

  if (!Component) {
    return (
      <div style={{ borderColor: '#E5DDD5' }}>
        <p>Componente não encontrado: {block.type}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'transition-all duration-200 border-transparent rounded', // 🎯 Container 1: Borda transparente por padrão
        containerClasses,
        // 🎯 Apenas borda tracejada discreta quando selecionado
        isSelected && 'border-dashed border-[#B89B7A]/60 border-2'
      )}
      style={inlineStyles}
      onClick={onClick}
    >
      {/* 🎯 Container 2: Componente Individual sem bordas extras */}
      <Component
        block={block}
        isSelected={isSelected}
        onClick={onClick}
        onPropertyChange={onPropertyChange}
      />
    </div>
  );
};

const EditorPage: React.FC = () => {
  const [location] = useLocation();
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

  const { config, addBlock, updateBlock, deleteBlock, setAllBlocks, clearAllBlocks } = useEditor();
  const { saveFunnel, isSaving, isLoading } = useEditorPersistence();

  // ===== DETECÇÃO DE MOBILE =====
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // ===== HANDLERS =====
  const blocks = config?.blocks || [];
  const sortedBlocks = blocks.sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleAddBlock = useCallback(
    (blockType: string) => {
      const newBlockId = addBlock(blockType as any);
      setSelectedComponentId(newBlockId);
      return newBlockId;
    },
    [addBlock, setSelectedComponentId]
  );

  const handleBlockClick = useCallback(
    (blockId: string) => {
      if (!isPreviewing) {
        setSelectedComponentId(blockId);
      }
    },
    [isPreviewing]
  );

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
            color: '#1f2937',
          },
        },
        {
          id: 'test-2',
          type: 'text',
          properties: {
            content:
              'Este é um exemplo de texto editável. Clique neste bloco para configurar suas propriedades.',
            textAlign: 'left',
          },
        },
        {
          id: 'test-3',
          type: 'button',
          properties: {
            content: 'Botão de Exemplo',
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            size: 'medium',
          },
        },
        {
          id: 'test-4',
          type: 'text-inline',
          properties: {
            content: 'Componente de texto inline - totalmente responsivo e editável',
          },
        },
        {
          id: 'test-5',
          type: 'heading-inline',
          properties: {
            content: 'Título Responsivo',
            level: 'h2',
            color: '#059669',
          },
        },
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
        title: 'Template Carregado',
        description: `${addedCount} blocos de teste adicionados com sucesso`,
      });
    } catch (error) {
      console.error('❌ Erro ao carregar template:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar template de teste',
        variant: 'destructive',
      });
    }
  }, [addBlock, updateBlock]);

  // ===== CARREGAR ETAPA 1 =====
  const handleLoadStep1 = useCallback(async () => {
    try {
      setSelectedComponentId(null);

      console.log('🚀 Carregando Etapa 1 do Quiz com modelo correto...');

      // Usando exatamente a estrutura do modelo fornecido
      const step1Blocks = [
        {
          id: 'quiz-intro-header-step01',
          type: 'quiz-intro-header',
          properties: {
            logoUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
            logoAlt: 'Logo Gisele Galvão',
            logoWidth: 120,
            logoHeight: 120,
            progressValue: 0,
            progressMax: 100,
            showBackButton: false,
            showProgress: false,
          },
        },
        {
          id: 'decorative-bar-step01',
          type: 'decorative-bar-inline',
          properties: {
            width: '100%',
            height: 4,
            color: '#B89B7A',
            gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
            borderRadius: 3,
            marginTop: 8,
            marginBottom: 24,
            showShadow: true,
          },
        },
        {
          id: 'main-title-step01',
          type: 'text-inline',
          properties: {
            content:
              '<span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">Chega</span> <span style="font-family: \'Playfair Display\', serif;">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">nada combina com você.</span>',
            fontSize: 'text-3xl',
            fontWeight: 'font-bold',
            fontFamily: 'Playfair Display, serif',
            textAlign: 'text-center',
            color: '#432818',
            marginBottom: 32,
            lineHeight: '1.2',
          },
        },
        {
          id: 'hero-image-step01',
          type: 'image-display-inline',
          properties: {
            src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
            alt: 'Transforme seu guarda-roupa',
            width: 600,
            height: 400,
            className: 'object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg',
            textAlign: 'text-center',
            marginBottom: 32,
          },
        },
        {
          id: 'motivation-text-step01',
          type: 'text-inline',
          properties: {
            content:
              'Em poucos minutos, descubra seu <strong style="color: #B89B7A;">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
            fontSize: 'text-xl',
            textAlign: 'text-center',
            color: '#432818',
            marginTop: 0,
            marginBottom: 40,
            lineHeight: '1.6',
          },
        },
        {
          id: 'name-input-step01',
          type: 'form-input',
          properties: {
            label: 'COMO VOCÊ GOSTARIA DE SER CHAMADA?',
            placeholder: 'Digite seu nome aqui...',
            required: true,
            inputType: 'text',
            helperText: 'Seu nome será usado para personalizar sua experiência',
            name: 'userName',
            textAlign: 'text-center',
            marginBottom: 32,
          },
        },
        {
          id: 'cta-button-step01',
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
            hoverEffect: true,
          },
        },
        {
          id: 'legal-notice-step01',
          type: 'legal-notice-inline',
          properties: {
            privacyText:
              'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
            copyrightText: '© 2025 Gisele Galvão - Todos os direitos reservados',
            showIcon: true,
            iconType: 'shield',
            textAlign: 'text-center',
            textSize: 'text-xs',
            textColor: '#6B7280',
            linkColor: '#B89B7A',
            marginTop: 24,
            marginBottom: 0,
            backgroundColor: 'transparent',
          },
        },
      ];

      // Limpar blocos existentes primeiro
      clearAllBlocks();

      let addedCount = 0;
      const newBlocks = [];

      for (const block of step1Blocks) {
        try {
          const normalizedBlock = normalizeBlock(block);
          console.log(`📦 Preparando bloco Etapa 1 ${addedCount + 1}:`, normalizedBlock.type);

          // Criar bloco completo de uma vez
          const fullBlock = {
            id: block.id,
            type: normalizedBlock.type as BlockType,
            content: normalizedBlock.content || {},
            properties: normalizedBlock.properties || {},
            order: addedCount,
          };

          newBlocks.push(fullBlock);
          addedCount++;
        } catch (blockError) {
          console.warn(`⚠️ Erro ao preparar bloco ${block.type}:`, blockError);
        }
      }

      // Adicionar todos os blocos de uma vez
      setAllBlocks(newBlocks);
      console.log(`✅ ${addedCount} blocos da Etapa 1 carregados:`, newBlocks);

      // Debug: Verificar se os blocos foram realmente adicionados
      setTimeout(() => {
        console.log('🔍 Debug - Blocos no estado após setAllBlocks:', config?.blocks);
        console.log('🔍 Debug - Primeiro bloco detalhado:', config?.blocks?.[0]);
      }, 100);

      toast({
        title: 'Etapa 1 Carregada com Modelo Correto! 🎉',
        description: `${addedCount} componentes específicos da Etapa 1 carregados com as informações e imagens do modelo`,
      });
    } catch (error) {
      console.error('❌ Erro ao carregar Etapa 1:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar Etapa 1',
        variant: 'destructive',
      });
    }
  }, [addBlock, updateBlock]);

  // ===== CARREGAR ETAPA 2 (STEP02) =====
  const handleLoadStep2 = useCallback(async () => {
    try {
      setSelectedComponentId(null);

      console.log('🚀 Carregando Etapa 2 do Quiz usando template...');

      // Usar CLEAN_21_STEPS para carregar Step02
      const step2Config = CLEAN_21_STEPS.find(s => s.stepNumber === 2);
      const step2Blocks = step2Config
        ? [
            {
              id: `step-02-title`,
              type: 'text-inline',
              properties: {
                content: step2Config.name,
                fontSize: 'text-2xl',
                fontWeight: 'font-bold',
                textAlign: 'text-center',
                color: '#432818',
                containerWidth: 'full',
                spacing: 'medium',
              },
            },
          ]
        : [];

      if (!step2Blocks || step2Blocks.length === 0) {
        throw new Error('Template da Step02 não encontrado ou vazio');
      }

      // Limpar blocos existentes primeiro
      clearAllBlocks();

      let addedCount = 0;
      const newBlocks = [];

      for (const block of step2Blocks) {
        try {
          const normalizedBlock = normalizeBlock(block);
          console.log(`📦 Preparando bloco Step02 ${addedCount + 1}:`, normalizedBlock.type);

          // Criar bloco completo de uma vez
          const fullBlock = {
            id: block.id,
            type: normalizedBlock.type as BlockType,
            content: normalizedBlock.content || {},
            properties: normalizedBlock.properties || {},
            order: addedCount,
          };

          newBlocks.push(fullBlock);
          addedCount++;
        } catch (blockError) {
          console.warn(`⚠️ Erro ao preparar bloco ${block.type}:`, blockError);
        }
      }

      // Adicionar todos os blocos de uma vez
      setAllBlocks(newBlocks);
      console.log(`✅ ${addedCount} blocos da Etapa 2 carregados:`, newBlocks);

      toast({
        title: 'Etapa 2 Carregada! 🎉',
        description: `${addedCount} componentes da Step02 carregados com propriedades configuráveis`,
      });
    } catch (error) {
      console.error('❌ Erro ao carregar Etapa 2:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar Etapa 2',
        variant: 'destructive',
      });
    }
  }, [addBlock, updateBlock, clearAllBlocks, setAllBlocks]);

  // ===== COMPONENTE FILTRADO DE COMPONENTES =====
  const filteredBlocks = AVAILABLE_BLOCKS.filter(block => {
    const matchesSearch =
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(AVAILABLE_BLOCKS.map(block => block.category)))];

  // Load funnel data if ID is provided in URL
  useEffect(() => {
    const loadFunnelData = async () => {
      if (!funnelId) return;

      setIsLoadingFunnel(true);
      try {
        console.log('🔍 Loading funnel from schema service:', funnelId);
        const schemaDrivenData = await schemaDrivenFunnelService.loadFunnel(funnelId);

        if (schemaDrivenData) {
          // Convert to editor format and load first page blocks
          const firstPage = schemaDrivenData.pages[0];
          if (firstPage && firstPage.blocks) {
            // setConfig not available in current hook
            console.log('✅ Would load funnel blocks:', firstPage.blocks.length);
          }
        } else {
          console.warn('❌ Funnel not found with ID:', funnelId);
          toast({
            title: 'Aviso',
            description: 'Funil não encontrado. Criando novo funil.',
            variant: 'default',
          });
        }
      } catch (error) {
        console.error('❌ Error loading funnel:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar funil',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingFunnel(false);
      }
    };

    loadFunnelData();
  }, [funnelId]);

  // ✅ AUTO-SAVE COM DEBOUNCE - Fase 1
  const handleAutoSave = async (data: any) => {
    // Preservar o ID original do funil carregado da URL
    const preservedId = funnelId || data.id || `funnel_${Date.now()}`;

    console.log('🔍 DEBUG - handleAutoSave:', {
      funnelId,
      dataId: data.id,
      preservedId,
      url: window.location.href,
    });

    const funnelData = {
      id: preservedId,
      name: data.title || 'Novo Funil',
      description: data.description || '',
      isPublished: false,
      version: data.version || 1,
      settings: data.settings || {},
      pages: [
        {
          id: `page_${Date.now()}`,
          pageType: 'landing',
          pageOrder: 0,
          title: data.title || 'Página Principal',
          blocks: data.blocks,
          metadata: {},
        },
      ],
    };
    await saveFunnel(funnelData);
  };

  const { forceSave } = useAutoSaveWithDebounce({
    data: config,
    onSave: handleAutoSave,
    delay: 500,
    enabled: !!config?.blocks?.length,
    showToasts: false,
  });

  // Show loading while loading funnel
  if (isLoadingFunnel || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Carregando editor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Enhanced Toolbar with Brand Header */}
      <BrandHeader />

      {/* Toolbar de Controles */}
      <div className="flex-shrink-0 border-b bg-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {funnelId && (
            <span className="text-xs bg-[#B89B7A]/20 text-[#A38A69] px-2 py-1 rounded">
              ID: {funnelId}
            </span>
          )}
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
          {/* Mobile Components Panel */}
          <div style={{ borderColor: '#E5DDD5' }}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar componentes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
                <Button onClick={handleLoadTemplate} size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex space-x-1 overflow-x-auto">
                {filteredBlocks.slice(0, 10).map(block => (
                  <Button
                    key={block.type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBlock(block.type)}
                    className="whitespace-nowrap"
                  >
                    <span className="mr-1">{block.icon}</span>
                    {block.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Canvas */}
          <div style={{ backgroundColor: '#FAF9F7' }}>
            <ScrollArea className="h-full p-4">
              <div className="bg-white rounded-lg shadow-sm min-h-96 p-6">
                {sortedBlocks.length === 0 ? (
                  <div style={{ borderColor: '#E5DDD5' }}>
                    <div className="text-center space-y-4 max-w-md">
                      <div className="w-16 h-16 mx-auto bg-[#B89B7A]/20 rounded-full flex items-center justify-center">
                        <Plus className="w-8 h-8 text-[#B89B7A]" />
                      </div>
                      <div>
                        <h3 style={{ color: '#432818' }}>Construa Seu Funil</h3>
                        <p style={{ color: '#6B4F43' }}>Selecione componentes acima para começar</p>
                        <Button onClick={handleLoadTemplate} className="mb-2">
                          <Download className="w-4 h-4 mr-2" />
                          Carregar Template
                        </Button>

                        {/* 🎯 SEÇÃO PARA CARREGAR STEPS DO FUNIL */}
                        <div style={{ backgroundColor: '#FAF9F7' }}>
                          <h4 style={{ color: '#6B4F43' }}>📋 Etapas do Quiz</h4>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={handleLoadStep1}
                              size="sm"
                              variant="outline"
                              className="w-full justify-start"
                            >
                              <span className="mr-2">1️⃣</span>
                              Step 01 - Introdução
                            </Button>
                            <Button
                              onClick={handleLoadStep2}
                              size="sm"
                              variant="outline"
                              className="w-full justify-start"
                            >
                              <span className="mr-2">2️⃣</span>
                              Step 02 - Questão 1
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedBlocks.map(block => {
                      const blockData = {
                        id: block.id,
                        type: block.type,
                        properties: block.properties || {
                          ...(block.content || {}),
                          order: block.order || 0,
                        },
                      };

                      return (
                        <div
                          key={block.id}
                          onClick={() => setSelectedComponentId(block.id)}
                          className="relative transition-all cursor-pointer" // 🎯 Bordas gerenciadas pelo SimpleBlockRenderer
                        >
                          <SimpleBlockRenderer
                            block={{
                              ...blockData,
                              content: blockData.properties || {},
                              order: 0,
                            }}
                            onClick={() => setSelectedComponentId(block.id)}
                            isSelected={selectedComponentId === block.id}
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
          {/* Components Panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div style={{ borderColor: '#E5DDD5' }}>
              <ScrollArea className="h-full">
                <div className="space-y-4 p-2">
                  <div className="p-2 border-b space-y-2">
                    <h3 className="font-semibold text-sm">Componentes</h3>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar componentes..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 text-sm"
                      />
                    </div>

                    {/* Category Filter */}
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded text-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'Todas as Categorias' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Components Grid */}
                  <div className="p-2 space-y-1">
                    {filteredBlocks.map(block => (
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
                          <div style={{ color: '#8B7355' }}>{block.category}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Canvas */}
          <ResizablePanel defaultSize={55}>
            <div style={{ backgroundColor: '#FAF9F7' }}>
              <ScrollArea className="h-full p-6">
                {/* Preview Mode Indicator */}
                <div className="text-center mb-4">
                  <div style={{ color: '#6B4F43' }}>
                    {previewMode === 'desktop' && (
                      <>
                        <Monitor className="w-4 h-4" /> Desktop (1200px)
                      </>
                    )}
                    {previewMode === 'tablet' && (
                      <>
                        <Tablet className="w-4 h-4" /> Tablet (768px)
                      </>
                    )}
                    {previewMode === 'mobile' && (
                      <>
                        <Smartphone className="w-4 h-4" /> Mobile (375px)
                      </>
                    )}
                  </div>
                </div>

                {/* Responsive Canvas Container */}
                <div className="flex justify-center">
                  <div
                    className="bg-white rounded-lg shadow-sm min-h-96 transition-all duration-300"
                    style={{
                      width: PREVIEW_DIMENSIONS[previewMode].width,
                      maxWidth: PREVIEW_DIMENSIONS[previewMode].maxWidth,
                      minWidth: previewMode === 'mobile' ? '375px' : 'auto',
                    }}
                  >
                    <div className="p-6">
                      {sortedBlocks.length === 0 ? (
                        <div style={{ borderColor: '#E5DDD5' }}>
                          <div className="text-center space-y-4 max-w-md">
                            <div className="w-16 h-16 mx-auto bg-[#B89B7A]/20 rounded-full flex items-center justify-center">
                              <Plus className="w-8 h-8 text-[#B89B7A]" />
                            </div>
                            <div>
                              <h3 style={{ color: '#432818' }}>Construa Seu Funil</h3>
                              <p style={{ color: '#6B4F43' }}>
                                Sistema completo para criar um funil de quiz de estilo pessoal
                                otimizado para conversão
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Button
                                onClick={handleLoadTemplate}
                                className="w-full mb-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Carregar Template Completo
                              </Button>

                              <p style={{ color: '#8B7355' }}>
                                Ou adicione componentes da barra lateral
                              </p>
                            </div>
                            {/* 🎯 SEÇÃO PARA CARREGAR STEPS DO FUNIL */}
                            <div style={{ backgroundColor: '#FAF9F7' }}>
                              <h4 style={{ color: '#6B4F43' }}>📋 Etapas do Quiz</h4>
                              <div className="flex flex-col gap-2">
                                <Button
                                  onClick={handleLoadStep1}
                                  size="sm"
                                  variant="outline"
                                  className="w-full justify-start"
                                >
                                  <span className="mr-2">1️⃣</span>
                                  Step 01 - Introdução
                                </Button>
                                <Button
                                  onClick={handleLoadStep2}
                                  size="sm"
                                  variant="outline"
                                  className="w-full justify-start"
                                >
                                  <span className="mr-2">2️⃣</span>
                                  Step 02 - Questão 1
                                </Button>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-[#B89B7A]/10 rounded-lg">
                              <p className="text-xs text-[#A38A69]">
                                <strong>🎯 Status:</strong> {AVAILABLE_BLOCKS.length} componentes
                                disponíveis
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {sortedBlocks.map(block => {
                            const blockData = {
                              id: block.id,
                              type: block.type,
                              properties: block.properties || {
                                ...(block.content || {}),
                                order: block.order || 0,
                              },
                            };

                            return (
                              <div
                                key={block.id}
                                className="transition-all duration-200" // 🎯 Removido ring externo - agora gerenciado pelo SimpleBlockRenderer
                              >
                                <SimpleBlockRenderer
                                  block={{
                                    ...blockData,
                                    content: blockData.properties || {},
                                    order: 0,
                                  }}
                                  isSelected={selectedComponentId === block.id}
                                  onClick={() => handleBlockClick(block.id)}
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
            <div style={{ borderColor: '#E5DDD5' }}>
              {selectedComponentId ? (
                <EnhancedUniversalPropertiesPanel
                  selectedBlock={{
                    id: selectedComponentId,
                    type: blocks.find(b => b.id === selectedComponentId)?.type || 'unknown',
                    properties: blocks.find(b => b.id === selectedComponentId)?.properties || {},
                  }}
                  onUpdate={(blockId: string, updates: any) => {
                    updateBlock(blockId, updates);
                  }}
                  onDelete={(blockId: string) => {
                    deleteBlock(blockId);
                    setSelectedComponentId(null);
                  }}
                  onClose={() => setSelectedComponentId(null)}
                />
              ) : (
                <div style={{ color: '#8B7355' }}>
                  <p className="text-sm">Selecione um bloco para editar suas propriedades</p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {/* Status Bar */}
      <div style={{ color: '#8B7355' }}>
        <div className="flex items-center space-x-4">
          <span>Total de blocos: {blocks.length}</span>
          <span>Modo: {previewMode}</span>
        </div>
        <div className="flex items-center space-x-2">
          {selectedComponentId && (
            <span className="bg-[#B89B7A]/20 text-[#A38A69] px-2 py-1 rounded">
              Selecionado: {blocks.find(b => b.id === selectedComponentId)?.type}
            </span>
          )}
          {isSaving && <span style={{ backgroundColor: '#E5DDD5' }}>Salvando...</span>}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
