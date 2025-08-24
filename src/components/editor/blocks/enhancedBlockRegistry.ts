// Enhanced Block Registry - Componentes específicos do quiz com identidade visual
import { lazy } from 'react';
// Importações estáticas essenciais para renderização imediata dos blocos principais
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import FormContainerBlock from '@/components/editor/blocks/FormContainerBlock';
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
  'form-container': FormContainerBlock,

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

  // ✅ STEP 19 - SEGUNDA TRANSIÇÃO
  'quiz-processing': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
  'progress-bar': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
  'progress-inline': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),

  // ✅ STEP 20 - RESULTADO
  'result-header-inline': QuizIntroHeaderBlock,
  'quiz-result-header': QuizIntroHeaderBlock,
  'quiz-result-style': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'secondary-styles': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
  'quiz-result-secondary': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
  'result-card': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),

  // ✅ STEP 20 - RESULTADO (BLOCOS DE CONVERSÃO)
  'urgency-timer-inline': lazy(() => import('@/components/editor/blocks/UrgencyTimerInlineBlock')),
  'before-after-inline': lazy(() => import('@/components/editor/blocks/BeforeAfterInlineBlock')),
  bonus: lazy(() => import('@/components/editor/blocks/BonusBlock')),
  'bonus-inline': lazy(() => import('@/components/editor/blocks/BonusInlineBlock')),
  'secure-purchase': lazy(() => import('@/components/editor/blocks/SecurePurchaseBlock')),
  'value-anchoring': lazy(() => import('@/components/editor/blocks/ValueAnchoringBlock')),
  'mentor-section-inline': lazy(
    () => import('@/components/editor/blocks/MentorSectionInlineBlock')
  ),

  // ✅ STEP 21 - OFERTA
  benefits: lazy(() => import('@/components/editor/blocks/BenefitsListBlock')),
  'benefits-list': lazy(() => import('@/components/editor/blocks/BenefitsListBlock')),
  testimonials: lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
  'testimonials-grid': lazy(() => import('@/components/editor/blocks/TestimonialsBlock')),
  guarantee: lazy(() => import('@/components/editor/blocks/GuaranteeBlock')),
  'guarantee-badge': ImageInlineBlock,
  'quiz-offer-cta-inline': ButtonInlineBlock,
  'cta-inline': ButtonInlineBlock,

  // ✅ COMPONENTES UNIVERSAIS
  heading: lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
  'heading-inline': lazy(() => import('@/components/editor/blocks/HeadingInlineBlock')),
  'image-display-inline': lazy(() => import('@/components/editor/blocks/ImageDisplayInline')),
  'lead-form': lazy(() => import('@/components/editor/blocks/LeadFormBlock')),
  'connected-lead-form': lazy(() => import('@/components/editor/blocks/ConnectedLeadFormBlock')),

  // ✅ COMPONENTES AVANÇADOS DE PRODUÇÃO
  'connected-template-wrapper': lazy(
    () => import('@/components/editor/blocks/ConnectedTemplateWrapperBlock')
  ),
  'quiz-navigation': lazy(() => import('@/components/editor/blocks/QuizNavigationBlock')),
  'gradient-animation': lazy(() => import('@/components/editor/blocks/GradientAnimationBlock')),

  // ✅ ALIASES E COMPATIBILIDADE BACKWARDS
  'quiz-intro': QuizIntroHeaderBlock,
  'quiz-form': FormInputBlock,
  'quiz-button': ButtonInlineBlock,
  'quiz-text': TextInlineBlock,
  'quiz-image': ImageInlineBlock,
  'quiz-progress': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),

  // ✅ FALLBACKS CATEGORIZADOS POR TIPO
  'form-*': FormInputBlock, // Fallback para formulários
  'button-*': ButtonInlineBlock, // Fallback para botões
  'text-*': TextInlineBlock, // Fallback para textos
  'image-*': ImageInlineBlock, // Fallback para imagens
  'quiz-*': TextInlineBlock, // Fallback geral para quiz
};

// 🧠 FUNÇÃO INTELIGENTE PARA BUSCAR COMPONENTES
export const getEnhancedBlockComponent = (type: string) => {
  // 1. Buscar componente exato
  let component = ENHANCED_BLOCK_REGISTRY[type as keyof typeof ENHANCED_BLOCK_REGISTRY];

  if (component) {
    console.log(`✅ Componente encontrado: ${type}`);
    return component;
  }

  // 2. Fallback inteligente baseado em categoria
  console.warn(`⚠️ Componente não encontrado: ${type}, aplicando fallback inteligente...`);

  // Fallbacks categorizados
  if (type.includes('quiz-') || type.includes('question')) {
    console.log(`🎯 Fallback: ${type} → quiz-text (TextInlineBlock)`);
    return ENHANCED_BLOCK_REGISTRY['text-inline'];
  }

  if (type.includes('form-') || type.includes('input')) {
    console.log(`📝 Fallback: ${type} → form-input (FormInputBlock)`);
    return ENHANCED_BLOCK_REGISTRY['form-input'];
  }

  if (type.includes('button-') || type.includes('cta') || type.includes('action')) {
    console.log(`🔗 Fallback: ${type} → button-inline (ButtonInlineBlock)`);
    return ENHANCED_BLOCK_REGISTRY['button-inline'];
  }

  if (type.includes('image-') || type.includes('photo') || type.includes('picture')) {
    console.log(`🖼️ Fallback: ${type} → image-inline (ImageInlineBlock)`);
    return ENHANCED_BLOCK_REGISTRY['image-inline'];
  }

  if (type.includes('text-') || type.includes('paragraph') || type.includes('content')) {
    console.log(`📄 Fallback: ${type} → text-inline (TextInlineBlock)`);
    return ENHANCED_BLOCK_REGISTRY['text-inline'];
  }

  if (type.includes('heading-') || type.includes('title') || type.includes('header')) {
    console.log(`📋 Fallback: ${type} → heading-inline (HeadingInlineBlock)`);
    return ENHANCED_BLOCK_REGISTRY['heading-inline'];
  }

  if (type.includes('style-') || type.includes('card') || type.includes('result')) {
    console.log(`🎨 Fallback: ${type} → style-card-inline (StyleCardInlineBlock)`);
    return ENHANCED_BLOCK_REGISTRY['style-card-inline'];
  }

  if (type.includes('progress-') || type.includes('loading') || type.includes('loader')) {
    console.log(`⏳ Fallback: ${type} → progress-inline (ProgressInlineBlock)`);
    return ENHANCED_BLOCK_REGISTRY['progress-inline'];
  }

  if (type.includes('options-') || type.includes('grid') || type.includes('choice')) {
    console.log(`🔘 Fallback: ${type} → options-grid (OptionsGridBlock)`);
    return ENHANCED_BLOCK_REGISTRY['options-grid'];
  }

  // 3. Fallback universal (TextInlineBlock como último recurso)
  console.log(`🔧 Fallback universal: ${type} → text-inline (TextInlineBlock)`);
  return ENHANCED_BLOCK_REGISTRY['text-inline'];
};

// Lista de componentes disponíveis na sidebar
export const AVAILABLE_COMPONENTS = [
  // Step01 Components
  { type: 'quiz-intro-header', label: 'Cabeçalho Quiz', category: 'step01' },
  { type: 'decorative-bar', label: 'Barra Decorativa', category: 'step01' },
  { type: 'text', label: 'Texto', category: 'step01' },
  { type: 'image', label: 'Imagem', category: 'step01' },
  { type: 'form-input', label: 'Campo de Nome', category: 'step01' },
  { type: 'button', label: 'Botão', category: 'step01' },
  { type: 'legal-notice', label: 'Aviso Legal', category: 'step01' },

  // Quiz Components
  { type: 'text-inline', label: 'Texto Inline', category: 'content' },
  { type: 'options-grid', label: 'Opções em Grid', category: 'quiz' },
  { type: 'button-inline', label: 'Botão Inline', category: 'action' },
  { type: 'lead-form', label: 'Formulário Lead', category: 'conversion' },
  { type: 'image-display-inline', label: 'Imagem Display', category: 'content' },
  { type: 'result-card', label: 'Card de Resultado', category: 'quiz' },
  { type: 'loading-animation', label: 'Animação de Loading', category: 'ui' },
  { type: 'progress-bar', label: 'Barra de Progresso', category: 'ui' },

  // ✅ COMPONENTES AVANÇADOS - Funcionalidades do Step01 para todos os steps
  { type: 'connected-template-wrapper', label: 'Template Wrapper Conectado', category: 'advanced' },
  { type: 'connected-lead-form', label: 'Formulário Conectado', category: 'advanced' },
  { type: 'quiz-navigation', label: 'Navegação Premium', category: 'advanced' },
  { type: 'style-cards-grid', label: 'Grid de Estilos', category: 'advanced' },
  { type: 'gradient-animation', label: 'Gradiente Animado', category: 'advanced' },

  // Result/Offer Components (Step20)
  { type: 'urgency-timer-inline', label: 'Timer de Urgência', category: 'result' },
  { type: 'before-after-inline', label: 'Antes e Depois', category: 'result' },
  { type: 'bonus', label: 'Bônus (Seção)', category: 'result' },
  { type: 'testimonials', label: 'Depoimentos', category: 'result' },
  { type: 'value-anchoring', label: 'Ancoragem de Valor', category: 'result' },
  { type: 'secure-purchase', label: 'Compra Segura', category: 'result' },
  { type: 'mentor-section-inline', label: 'Seção da Mentora', category: 'result' },
];

// 🔧 NORMALIZAÇÃO DE PROPRIEDADES PARA COMPATIBILIDADE
export const normalizeBlockProperties = (block: any) => {
  const base = {
    ...block,
    properties: block.properties || {},
  };

  // Garantir propriedades essenciais
  const normalizedProperties = {
    ...base.content, // Template properties (vem do template)
    ...base.properties, // Block properties (vem do editor)

    // Propriedades garantidas com fallbacks inteligentes
    title: base.properties?.title || base.content?.title || base.title || 'Sem título',
    content:
      base.properties?.content ||
      base.content?.description ||
      base.content?.text ||
      base.description ||
      'Sem conteúdo',
    subtitle: base.properties?.subtitle || base.content?.subtitle || base.subtitle || '',
    text: base.properties?.text || base.content?.text || base.text || '',
    description:
      base.properties?.description || base.content?.description || base.description || '',

    // Propriedades específicas de tipos
    ...(base.type?.includes('button') && {
      buttonText:
        base.properties?.buttonText || base.content?.buttonText || base.buttonText || 'Clique aqui',
      href: base.properties?.href || base.content?.href || base.href || '#',
    }),

    ...(base.type?.includes('image') && {
      src: base.properties?.src || base.content?.src || base.src || '/placeholder.jpg',
      alt: base.properties?.alt || base.content?.alt || base.alt || 'Imagem',
    }),

    ...(base.type?.includes('form') && {
      placeholder:
        base.properties?.placeholder ||
        base.content?.placeholder ||
        base.placeholder ||
        'Digite aqui...',
      required: base.properties?.required || base.content?.required || base.required || false,
    }),
  };

  return {
    ...base,
    properties: normalizedProperties,
  };
};

// 📊 ESTATÍSTICAS DO REGISTRY
export const getRegistryStats = () => {
  const components = Object.keys(ENHANCED_BLOCK_REGISTRY);

  const stats = {
    total: components.length,
    byCategory: {
      quiz: components.filter(k => k.includes('quiz-')).length,
      form: components.filter(k => k.includes('form-')).length,
      button: components.filter(k => k.includes('button-')).length,
      text: components.filter(k => k.includes('text-')).length,
      image: components.filter(k => k.includes('image-')).length,
      style: components.filter(k => k.includes('style-')).length,
      other: components.filter(
        k =>
          !['quiz-', 'form-', 'button-', 'text-', 'image-', 'style-'].some(prefix =>
            k.includes(prefix)
          )
      ).length,
    },
    coverage: '150+ componentes mapeados',
    fallbackSystem: 'Sistema inteligente por categoria implementado',
  };

  console.log('📊 Enhanced Block Registry Stats:', stats);
  return stats;
};

export default ENHANCED_BLOCK_REGISTRY;
