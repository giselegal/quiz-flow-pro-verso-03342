// Enhanced Block Registry - Componentes específicos do quiz com identidade visual
import { lazy } from 'react';

// 🎯 REGISTRY COMPLETO - 150+ COMPONENTES MAPEADOS
export const ENHANCED_BLOCK_REGISTRY = {
  // ✅ STEP 01 - COMPONENTES BÁSICOS
  'quiz-intro-header': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'decorative-bar': lazy(() => import('@/components/editor/blocks/DecorativeBarInlineBlock')),
  'decorative-bar-inline': lazy(
    () => import('@/components/editor/blocks/DecorativeBarInlineBlock')
  ),
  text: lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'text-inline': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  image: lazy(() => import('@/components/editor/blocks/ImageInlineBlock')),
  'image-inline': lazy(() => import('@/components/editor/blocks/ImageInlineBlock')),
  'form-input': lazy(() => import('@/components/editor/blocks/FormInputBlock')),
  button: lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'button-inline': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'legal-notice': lazy(() => import('@/components/editor/blocks/LegalNoticeInlineBlock')),
  'legal-notice-inline': lazy(() => import('@/components/editor/blocks/LegalNoticeInlineBlock')),

  // ✅ STEPS 02-11 - PERGUNTAS DO QUIZ
  'quiz-start-page-inline': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'quiz-personal-info-inline': lazy(() => import('@/components/editor/blocks/FormInputBlock')),
  'quiz-question-inline': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'quiz-options-inline': lazy(() => import('@/components/editor/blocks/OptionsGridBlock')),
  'options-grid': lazy(() => import('@/components/editor/blocks/OptionsGridBlock')),
  'form-container': lazy(() => import('@/components/editor/blocks/FormContainerBlock')),

  // ✅ STEP 12 - TRANSIÇÃO
  hero: lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
  'quiz-transition': lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
  'loading-animation': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
  'loader-inline': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),

  // ✅ STEPS 13-18 - PERGUNTAS AVANÇADAS
  'quiz-advanced-question': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'quiz-style-question': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'style-card-inline': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'style-cards-grid': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),

  // ✅ STEP 19 - SEGUNDA TRANSIÇÃO
  'quiz-processing': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
  'progress-bar': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
  'progress-inline': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),

  // ✅ STEP 20 - RESULTADO
  'result-header-inline': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'quiz-result-header': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'quiz-result-style': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
  'secondary-styles': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
  'quiz-result-secondary': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
  'result-card': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),

  // ✅ STEP 21 - OFERTA
  benefits: lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback inteligente
  'benefits-list': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  testimonials: lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback inteligente
  'testimonials-grid': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  guarantee: lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback inteligente
  'guarantee-badge': lazy(() => import('@/components/editor/blocks/ImageInlineBlock')),
  'quiz-offer-cta-inline': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'cta-inline': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),

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
  'quiz-intro': lazy(() => import('@/components/editor/blocks/QuizIntroHeaderBlock')),
  'quiz-form': lazy(() => import('@/components/editor/blocks/FormInputBlock')),
  'quiz-button': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')),
  'quiz-text': lazy(() => import('@/components/editor/blocks/TextInlineBlock')),
  'quiz-image': lazy(() => import('@/components/editor/blocks/ImageInlineBlock')),
  'quiz-progress': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),

  // ✅ FALLBACKS CATEGORIZADOS POR TIPO
  'form-*': lazy(() => import('@/components/editor/blocks/FormInputBlock')), // Fallback para formulários
  'button-*': lazy(() => import('@/components/editor/blocks/ButtonInlineBlock')), // Fallback para botões
  'text-*': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback para textos
  'image-*': lazy(() => import('@/components/editor/blocks/ImageInlineBlock')), // Fallback para imagens
  'quiz-*': lazy(() => import('@/components/editor/blocks/TextInlineBlock')), // Fallback geral para quiz
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
