/**
 * Enhanced Block Registry - Componentes específicos do quiz com identidade visual
 * 
 * Este é o arquivo canônico para o registro de blocos do editor.
 * Todos os componentes devem ser importados daqui.
 */
import { lazy } from 'react';
// Importações estáticas essenciais para renderização imediata dos blocos principais
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import BasicContainerBlock from '@/components/editor/blocks/BasicContainerBlock';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import LegalNoticeInlineBlock from '@/components/editor/blocks/LegalNoticeInlineBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';

// 🎯 REGISTRY COMPLETO - 150+ COMPONENTES MAPEADOS
export const ENHANCED_BLOCK_REGISTRY = {
  // ✅ STEP 01 - COMPONENTES BÁSICOS
  // Preferir versões estáticas para tipos críticos usados no template
  'quiz-intro-header': QuizIntroHeaderBlock,
  'decorative-bar': lazy(() => import('@/components/editor/blocks/DecorativeBarInlineBlock')),
  'decorative-bar-inline': lazy(
    () => import('@/components/editor/blocks/DecorativeBarInlineBlock')
  ),
  text: TextInlineBlock,
  'text-inline': TextInlineBlock,
  image: ImageInlineBlock,
  'image-inline': ImageInlineBlock,
  'form-input': FormInputBlock,
  button: ButtonInlineBlock,
  'button-inline': ButtonInlineBlock,
  'legal-notice': LegalNoticeInlineBlock,
  'legal-notice-inline': LegalNoticeInlineBlock,

  // ✅ STEPS 02-11 - PERGUNTAS DO QUIZ
  'quiz-start-page-inline': QuizIntroHeaderBlock,
  'quiz-personal-info-inline': FormInputBlock,
  'quiz-question-inline': TextInlineBlock,
  'quiz-options-inline': OptionsGridBlock,
  'options-grid': OptionsGridBlock,
  'form-container': BasicContainerBlock,
  // Aliases de container estável
  'container': BasicContainerBlock,
  'section': BasicContainerBlock,
  'box': BasicContainerBlock,

  // ✅ STEP 12 - TRANSIÇÃO
  hero: lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
  'quiz-transition': lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
  'loading-animation': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
  'loader-inline': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),

  // ✅ STEPS 13-18 - PERGUNTAS AVANÇADAS
  'quiz-advanced-question': TextInlineBlock,
  'quiz-style-question': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'style-card-inline': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'style-cards-grid': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),

  // ✅ STEP 19 - PROCESSAMENTO
  'quiz-processing': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
  'progress-bar': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
  'progress-inline': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),

  // ✅ STEP 20 - RESULTADO
  'result-header-inline': lazy(() => import('@/components/editor/blocks/ResultHeaderInlineBlock')),
  'quiz-result-header': QuizIntroHeaderBlock,
  'quiz-result-style': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'secondary-styles': lazy(() => import('@/components/editor/blocks/SecondaryStylesInlineBlock')),
  'quiz-result-secondary': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
  'result-card': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),

  // ✅ STEP 21 - OFERTA
  'urgency-timer-inline': lazy(() => import('@/components/editor/blocks/UrgencyTimerInlineBlock')),
  'before-after-inline': lazy(() => import('@/components/editor/blocks/BeforeAfterInlineBlock')),
  bonus: lazy(() => import('@/components/editor/blocks/BonusBlock')),
  'bonus-inline': lazy(() => import('@/components/editor/blocks/BonusInlineBlock')),
  'secure-purchase': lazy(() => import('@/components/editor/blocks/SecurePurchaseBlock')),
  'value-anchoring': lazy(() => import('@/components/editor/blocks/ValueAnchoringBlock')),
  'mentor-section-inline': lazy(
    () => import('@/components/editor/blocks/MentorSectionInlineBlock')
  ),

  // ✅ ALIASES PARA COMPATIBILIDADE
  'personalized-hook-inline': lazy(
    () => import('@/components/editor/blocks/StyleCardInlineBlock')
  ),
  'final-value-proposition-inline': lazy(
    () => import('@/components/editor/blocks/ValueAnchoringBlock')
  ),
  navigation: lazy(() => import('@/components/editor/blocks/QuizNavigationBlock')),
  'quiz-results': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
  'style-results': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'options-grid-inline': OptionsGridBlock,
  'button-inline-fixed': ButtonInlineBlock,

  // ✅ BLOCOS DE OFERTA
  benefits: lazy(() => import('@/components/editor/blocks/BenefitsListBlock')),
  'benefits-list': lazy(() => import('@/components/editor/blocks/BenefitsListBlock')),
  testimonials: lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
  'testimonials-grid': lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
  guarantee: lazy(() => import('@/components/editor/blocks/GuaranteeBlock')),
  'guarantee-badge': ImageInlineBlock,
  'quiz-offer-cta-inline': ButtonInlineBlock,
  'cta-inline': ButtonInlineBlock,

  // ✅ BLOCOS UNIVERSAIS
  heading: lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
  'heading-inline': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
  'image-display-inline': lazy(() => import('@/components/editor/blocks/ImageDisplayInline')),
  'lead-form': lazy(() => import('@/components/editor/blocks/LeadFormBlock')),
  'connected-lead-form': lazy(() => import('@/components/editor/blocks/ConnectedLeadFormBlock')),

  // ✅ BLOCOS AVANÇADOS
  'connected-template-wrapper': lazy(
    () => import('@/components/editor/blocks/ConnectedTemplateWrapperBlock')
  ),
  'quiz-navigation': lazy(() => import('@/components/editor/blocks/QuizNavigationBlock')),
  'gradient-animation': lazy(() => import('@/components/editor/blocks/GradientAnimationBlock')),

  // ✅ ALIASES PARA COMPATIBILIDADE COM NOMES ANTIGOS
  'quiz-intro': QuizIntroHeaderBlock,
  'quiz-form': FormInputBlock,
  'quiz-button': ButtonInlineBlock,
  'quiz-text': TextInlineBlock,
  'quiz-image': ImageInlineBlock,
  'quiz-progress': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),

  // ✅ FALLBACKS PARA TIPOS DESCONHECIDOS
  'form-*': FormInputBlock, // Fallback para formulários
  'button-*': ButtonInlineBlock, // Fallback para botões
  'text-*': TextInlineBlock, // Fallback para textos
  'image-*': ImageInlineBlock, // Fallback para imagens
  'quiz-*': TextInlineBlock, // Fallback geral para quiz
};

/**
 * Obtém o componente de bloco aprimorado com base no tipo
 * Inclui fallbacks inteligentes para tipos desconhecidos
 */
export const getEnhancedBlockComponent = (type: string) => {
  if (!type) {
    console.warn('getEnhancedBlockComponent: tipo não fornecido, usando fallback');
    return TextInlineBlock;
  }

  // Verificar se o tipo existe diretamente no registro
  if (ENHANCED_BLOCK_REGISTRY[type]) {
    return ENHANCED_BLOCK_REGISTRY[type];
  }

  // Verificar se há um alias exato para o tipo
  const normalizedType = type.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (ENHANCED_BLOCK_REGISTRY[normalizedType]) {
    console.log(`🎨 Alias: ${type} → ${normalizedType}`);
    return ENHANCED_BLOCK_REGISTRY[normalizedType];
  }

  // Verificar se há um fallback baseado em prefixo
  const prefix = type.split('-')[0];
  const fallbackKey = `${prefix}-*`;
  if (ENHANCED_BLOCK_REGISTRY[fallbackKey]) {
    console.log(`🎨 Fallback: ${type} → ${fallbackKey} (${ENHANCED_BLOCK_REGISTRY[fallbackKey].name})`);
    return ENHANCED_BLOCK_REGISTRY[fallbackKey];
  }

  // Verificar se há um fallback baseado em sufixo
  const suffix = type.split('-').pop();
  const suffixFallbackKey = `*-${suffix}`;
  if (ENHANCED_BLOCK_REGISTRY[suffixFallbackKey]) {
    console.log(`🎨 Fallback: ${type} → ${suffixFallbackKey}`);
    return ENHANCED_BLOCK_REGISTRY[suffixFallbackKey];
  }

  // Verificar se é um tipo de quiz
  if (type.includes('quiz')) {
    console.log(`🎨 Fallback: ${type} → quiz-* (TextInlineBlock)`);
    return TextInlineBlock;
  }

  // Verificar se é um tipo de texto
  if (type.includes('text') || type.includes('paragraph') || type.includes('heading')) {
    console.log(`🎨 Fallback: ${type} → text (TextInlineBlock)`);
    return TextInlineBlock;
  }

  // Verificar se é um tipo de botão
  if (type.includes('button') || type.includes('cta')) {
    console.log(`🎨 Fallback: ${type} → button (ButtonInlineBlock)`);
    return ButtonInlineBlock;
  }

  // Verificar se é um tipo de imagem
  if (type.includes('image') || type.includes('img') || type.includes('photo')) {
    console.log(`🎨 Fallback: ${type} → image (ImageInlineBlock)`);
    return ImageInlineBlock;
  }

  // Fallback final para tipos desconhecidos
  console.log(`🎨 Fallback: ${type} → style-card-inline (StyleCardInlineBlock)`);
  return ENHANCED_BLOCK_REGISTRY['style-card-inline'];
};

/**
 * Lista de componentes disponíveis para a sidebar do editor
 * Organizada por categorias para facilitar a navegação
 */
export const AVAILABLE_COMPONENTS = [
  // ✅ STEP 01 - COMPONENTES BÁSICOS
  { type: 'quiz-intro-header', label: 'Cabeçalho Quiz', category: 'step01' },
  { type: 'decorative-bar', label: 'Barra Decorativa', category: 'step01' },
  { type: 'text', label: 'Texto', category: 'step01' },
  { type: 'image', label: 'Imagem', category: 'step01' },
  { type: 'form-input', label: 'Campo de Nome', category: 'step01' },
  { type: 'button', label: 'Botão', category: 'step01' },
  { type: 'legal-notice', label: 'Aviso Legal', category: 'step01' },

  // ✅ COMPONENTES UNIVERSAIS
  { type: 'text-inline', label: 'Texto Inline', category: 'content' },
  { type: 'options-grid', label: 'Opções em Grid', category: 'quiz' },
  { type: 'button-inline', label: 'Botão Inline', category: 'action' },
  { type: 'lead-form', label: 'Formulário Lead', category: 'conversion' },
  { type: 'image-display-inline', label: 'Imagem Display', category: 'content' },
  { type: 'result-card', label: 'Card de Resultado', category: 'quiz' },
  { type: 'loading-animation', label: 'Animação de Loading', category: 'ui' },
  { type: 'progress-bar', label: 'Barra de Progresso', category: 'ui' },

  // ✅ COMPONENTES AVANÇADOS
  { type: 'connected-template-wrapper', label: 'Template Wrapper Conectado', category: 'advanced' },
  { type: 'connected-lead-form', label: 'Formulário Conectado', category: 'advanced' },
  { type: 'quiz-navigation', label: 'Navegação Premium', category: 'advanced' },
  { type: 'style-cards-grid', label: 'Grid de Estilos', category: 'advanced' },
  { type: 'style-card-inline', label: 'Card de Estilo (Único)', category: 'advanced' },
  { type: 'gradient-animation', label: 'Gradiente Animado', category: 'advanced' },

  // ✅ COMPONENTES DE RESULTADO
  { type: 'urgency-timer-inline', label: 'Timer de Urgência', category: 'result' },
  { type: 'before-after-inline', label: 'Antes e Depois', category: 'result' },
  { type: 'bonus', label: 'Bônus (Seção)', category: 'result' },
  { type: 'testimonials', label: 'Depoimentos', category: 'result' },
  { type: 'value-anchoring', label: 'Ancoragem de Valor', category: 'result' },
  { type: 'secure-purchase', label: 'Compra Segura', category: 'result' },
  { type: 'mentor-section-inline', label: 'Seção da Mentora', category: 'result' },
];

/**
 * Normaliza as propriedades de um bloco para garantir consistência
 */
export const normalizeBlockProperties = (block: any) => {
  if (!block) return {};

  // Garantir que properties existe
  const properties = block.properties || {};

  // Normalizar propriedades comuns
  const normalized = {
    ...properties,
    // Garantir que backgroundColor seja uma string válida
    backgroundColor: properties.backgroundColor || '',
    // Garantir que textAlign seja uma string válida
    textAlign: properties.textAlign || 'left',
    // Garantir que padding seja um número ou string válida
    padding: properties.padding || 0,
    // Garantir que margin seja um número ou string válida
    margin: properties.margin || 0,
    // Garantir que borderRadius seja um número ou string válida
    borderRadius: properties.borderRadius || 0,
    // Garantir que boxShadow seja uma string válida
    boxShadow: properties.boxShadow || 'none',
  };

  // Normalizar propriedades específicas por tipo de bloco
  switch (block.type) {
    case 'text':
    case 'text-inline':
      return {
        ...normalized,
        content: block.content || properties.content || '',
        fontSize: properties.fontSize || 16,
        fontWeight: properties.fontWeight || 'normal',
        color: properties.color || '#000000',
      };
    case 'image':
    case 'image-inline':
      return {
        ...normalized,
        src: properties.src || '',
        alt: properties.alt || '',
        width: properties.width || 'auto',
        height: properties.height || 'auto',
      };
    case 'button':
    case 'button-inline':
      return {
        ...normalized,
        text: properties.text || 'Botão',
        url: properties.url || '#',
        color: properties.color || '#ffffff',
        backgroundColor: properties.backgroundColor || '#3b82f6',
      };
    default:
      return normalized;
  }
};

/**
 * Obtém estatísticas do registro de blocos
 */
export const getRegistryStats = () => {
  const totalComponents = Object.keys(ENHANCED_BLOCK_REGISTRY).length;
  const staticComponents = Object.values(ENHANCED_BLOCK_REGISTRY).filter(
    (comp) => typeof comp === 'function' && !(comp as any).$$typeof
  ).length;
  const lazyComponents = totalComponents - staticComponents;

  const categoryCounts = AVAILABLE_COMPONENTS.reduce((acc, comp) => {
    const category = comp.category || 'uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const wildcardPatterns = Object.keys(ENHANCED_BLOCK_REGISTRY).filter((key) => key.includes('*'));

  return {
    totalComponents,
    staticComponents,
    lazyComponents,
    categoryCounts,
    wildcardPatterns,
    availableComponentsCount: AVAILABLE_COMPONENTS.length,
  };
};

export default ENHANCED_BLOCK_REGISTRY;
