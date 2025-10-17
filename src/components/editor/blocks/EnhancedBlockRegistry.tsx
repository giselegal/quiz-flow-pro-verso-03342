/**
 * Enhanced Block Registry - Componentes específicos do quiz com identidade visual
 * 
 * Este é o arquivo canônico para o registro de blocos do editor.
 * Todos os componentes devem ser importados daqui.
 */
import { lazy, type ComponentType } from 'react';
// Importações estáticas essenciais para renderização imediata dos blocos principais
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import FormInputBlock from '@/components/editor/blocks/FormInputBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import LegalNoticeInlineBlock from '@/components/editor/blocks/LegalNoticeInlineBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import SalesHeroBlock from '@/components/editor/blocks/SalesHeroBlock';
import DecorativeBarInlineBlock from '@/components/editor/blocks/DecorativeBarInlineBlock';
// Lazy imports otimizados - Componentes Modulares do Quiz
const QuizLogoBlock = lazy(() => import('@/components/editor/blocks/QuizLogoBlock'));
const QuizProgressBlock = lazy(() => import('@/components/editor/blocks/QuizProgressBlock'));
const QuizBackButtonBlock = lazy(() => import('@/components/editor/blocks/QuizBackButtonBlock'));
const ImageDisplayInlineBlock = lazy(() => import('@/components/editor/blocks/ImageDisplayInlineBlock'));
const QuizQuestionHeaderBlock = lazy(() => import('@/components/editor/blocks/QuizQuestionHeaderBlock'));
import QuizTransitionLoaderBlock from '@/components/editor/blocks/QuizTransitionLoaderBlock';
const QuizResultHeaderBlock = lazy(() => import('@/components/editor/blocks/QuizResultHeaderBlock'));
const QuizOfferHeroBlock = lazy(() => import('@/components/editor/blocks/QuizOfferHeroBlock'));

import HeadingInlineBlock from '@/components/editor/blocks/HeadingInlineBlock';
import {
    Step20ResultHeaderBlock,
    Step20StyleRevealBlock,
    Step20UserGreetingBlock,
    Step20CompatibilityBlock,
    Step20SecondaryStylesBlock,
    Step20PersonalizedOfferBlock,
    Step20CompleteTemplateBlock
} from '@/components/editor/blocks/Step20ModularBlocks';
import { FashionAIGeneratorBlock } from '@/components/blocks/ai';

// Lazy imports para Sections V3 (Question, Transition, Offer)
const QuestionHeroSection = lazy(() => import('@/components/sections/questions').then(m => ({ default: m.QuestionHeroSection })));
const TransitionHeroSection = lazy(() => import('@/components/sections/transitions').then(m => ({ default: m.TransitionHeroSection })));
const OfferHeroSection = lazy(() => import('@/components/sections/offer').then(m => ({ default: m.OfferHeroSection })));
const StrategicQuestionBlock = lazy(() => import('@/components/editor/blocks/StrategicQuestionBlock'));

// Componentes legados (runtime otimizado - auto-contidos e performáticos)
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';

// Imports estáticos dos blocos atômicos de transição para evitar falhas de dynamic import no preview remoto
import TransitionTitleBlock from '@/components/editor/blocks/atomic/TransitionTitleBlock';
import TransitionLoaderBlock from '@/components/editor/blocks/atomic/TransitionLoaderBlock';
import TransitionTextBlock from '@/components/editor/blocks/atomic/TransitionTextBlock';
import TransitionProgressBlock from '@/components/editor/blocks/atomic/TransitionProgressBlock';
import TransitionMessageBlock from '@/components/editor/blocks/atomic/TransitionMessageBlock';

// 🎯 REGISTRY COMPLETO - 150+ COMPONENTES MAPEADOS
export const ENHANCED_BLOCK_REGISTRY: Record<string, ComponentType<any>> = {
    // ============================================================================
    // 🏆 COMPONENTES LEGADOS (Runtime Otimizado)
    // Componentes auto-contidos e performáticos usados no quiz em produção
    // ============================================================================
    'intro-step': IntroStep,
    'intro-step-legacy': IntroStep,
    'question-step': QuestionStep,
    'question-step-legacy': QuestionStep,
    'strategic-question-step': StrategicQuestionStep,
    'strategic-question-legacy': StrategicQuestionStep,
    'transition-step': TransitionStep,
    'transition-step-legacy': TransitionStep,
    'result-step': ResultStep,
    'result-step-legacy': ResultStep,

    // ============================================================================
    // 📦 COMPONENTES MODULARES (Editor e Casos Avançados)
    // ============================================================================

    // 🧩 COMPONENTES MODULARES DO QUIZ (100% Editáveis)
    'quiz-logo': QuizLogoBlock,
    'quiz-progress-bar': QuizProgressBlock,
    'quiz-back-button': QuizBackButtonBlock,
    'quiz-question-header': QuizQuestionHeaderBlock,
    'quiz-transition-loader': QuizTransitionLoaderBlock,
    'quiz-result-header': QuizResultHeaderBlock,
    'quiz-offer-hero': QuizOfferHeroBlock,
    'image-display-inline': ImageDisplayInlineBlock,

    // ✅ STEP 01 - COMPONENTES BÁSICOS
    // Preferir versões estáticas para tipos críticos usados no template
    'quiz-intro-header': QuizIntroHeaderBlock,
    'decorative-bar': DecorativeBarInlineBlock,
    'decorative-bar-inline': DecorativeBarInlineBlock,
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
    'quiz-options': OptionsGridBlock, // ✅ Mapeamento direto para quiz-options
    'quiz-options-inline': OptionsGridBlock,
    'options-grid': OptionsGridBlock,
    'question-hero': QuestionHeroSection, // ✅ NOVO - Section para question-hero
    // Container e aliases via lazy para evitar ciclo com BasicContainerBlock
    'form-container': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),
    // Aliases de container estável
    'container': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),
    'section': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),
    'box': lazy(() => import('@/components/editor/blocks/BasicContainerBlock')),

    // ✅ SALES PAGES - HERO
    'sales-hero': SalesHeroBlock,

    // ✅ STEP 12 - TRANSIÇÃO
    hero: lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
    'quiz-transition': lazy(() => import('@/components/editor/blocks/QuizTransitionBlock')),
    'transition-hero': TransitionHeroSection, // ✅ NOVO - Section para transition-hero
    'loading-animation': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
    'loader-inline': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),

    // ✅ STEP 12 & 19 - BLOCOS ATÔMICOS DE TRANSIÇÃO (100% Modulares) - Direct imports para performance
    'transition-title': TransitionTitleBlock,
    'transition-subtitle': lazy(() => import('./TransitionSubtitleBlock')),
    'transition-image': lazy(() => import('./TransitionImageBlock')),
    'transition-description': lazy(() => import('./TransitionDescriptionBlock')),
    'transition-loader': TransitionLoaderBlock,
    'transition-text': TransitionTextBlock,
    'transition-progress': TransitionProgressBlock,
    'transition-message': TransitionMessageBlock,

    // ✅ STEPS 13-18 - PERGUNTAS AVANÇADAS
    'quiz-advanced-question': TextInlineBlock,
    'strategic-question': StrategicQuestionBlock, // ✅ NOVO - Strategic question block
    'quiz-style-question': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
    'style-card-inline': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
    'style-cards-grid': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),

    // ✅ STEP 19 - PROCESSAMENTO
    'quiz-processing': lazy(() => import('@/components/editor/blocks/LoaderInlineBlock')),
    'progress-bar': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),
    'progress-inline': lazy(() => import('@/components/editor/blocks/ProgressInlineBlock')),

    // ✅ STEP 20 - RESULTADO
    'result-header-inline': lazy(() => import('@/components/editor/blocks/ResultHeaderInlineBlock')),
    'modular-result-header': lazy(() => import('@/components/editor/modules/ModularResultHeader')),
    'quiz-result-style': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),
    'secondary-styles': lazy(() => import('@/components/editor/blocks/SecondaryStylesInlineBlock')),
    'quiz-result-secondary': lazy(() => import('@/components/editor/blocks/StyleCardsGridBlock')),
    'result-card': lazy(() => import('@/components/editor/blocks/StyleCardInlineBlock')),

    // ✅ STEP 20 - BLOCOS ATÔMICOS DE RESULTADO (100% Modulares) - Direct imports para performance
    'result-congrats': lazy(() => import('./ResultCongratsBlock')),
    'result-main': lazy(() => import('./atomic/ResultMainBlock')),
    'result-image': lazy(() => import('./atomic/ResultImageBlock')),
    'result-description': lazy(() => import('./atomic/ResultDescriptionBlock')),
    'result-header': lazy(() => import('./atomic/ResultHeaderBlock')),
    'result-characteristics': lazy(() => import('./atomic/ResultCharacteristicsBlock')),
    'result-cta': lazy(() => import('./atomic/ResultCTABlock')),
    'result-progress-bars': lazy(() => import('./ResultProgressBarsBlock')),
    'result-secondary-styles': lazy(() => import('./atomic/ResultSecondaryStylesBlock')),

    // 🤖 IA - FASHION AI GENERATOR
    'fashion-ai-generator': FashionAIGeneratorBlock,

    // 🆕 STEP 20 - Módulos Modulares
    'step20-result-header': Step20ResultHeaderBlock,
    'step20-style-reveal': Step20StyleRevealBlock,
    'step20-user-greeting': Step20UserGreetingBlock,
    'step20-compatibility': Step20CompatibilityBlock,
    'step20-secondary-styles': Step20SecondaryStylesBlock,
    'step20-personalized-offer': Step20PersonalizedOfferBlock,
    'step20-complete-template': Step20CompleteTemplateBlock,

    // ✅ STEP 21 - OFERTA
    'offer-hero': OfferHeroSection, // ✅ NOVO - Section para offer-hero
    'urgency-timer-inline': lazy(() => import('@/components/editor/blocks/UrgencyTimerInlineBlock')),
    'before-after-inline': lazy(() => import('@/components/editor/blocks/BeforeAfterInlineBlock')),
    bonus: lazy(() => import('@/components/editor/blocks/BonusBlock')),
    'bonus-inline': lazy(() => import('@/components/editor/blocks/BonusInlineBlock')),
    'secure-purchase': lazy(() => import('@/components/editor/blocks/SecurePurchaseBlock')),
    'value-anchoring': lazy(() => import('@/components/editor/blocks/ValueAnchoringBlock')),
    'mentor-section-inline': lazy(
        () => import('@/components/editor/blocks/MentorSectionInlineBlock')
    ),

    // 🎯 NOVOS COMPONENTES DE DEPOIMENTOS COM DADOS REAIS
    'testimonial-card-inline': lazy(() => import('@/components/editor/blocks/TestimonialCardInlineBlock')),
    'testimonials-carousel-inline': lazy(() => import('@/components/editor/blocks/TestimonialsCarouselInlineBlock')),

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
    heading: HeadingInlineBlock,
    'heading-inline': HeadingInlineBlock,
    // Aliases para compatibilidade com templates antigos
    headline: HeadingInlineBlock,
    'headline-inline': HeadingInlineBlock,
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
    // 🔒 Validação robusta para evitar React error #185 (element type invalid)
    const isValidReactComponent = (value: any) =>
        typeof value === 'function' || (typeof value === 'object' && value !== null && '$$typeof' in value);

    console.log(`🔍 getEnhancedBlockComponent chamado para tipo: "${type}"`);

    // 🧪 TESTE: Verificar se o registry está populado
    const registryKeys = Object.keys(ENHANCED_BLOCK_REGISTRY);
    console.log(`📊 Registry tem ${registryKeys.length} chaves:`, registryKeys.slice(0, 10));

    // 🧪 TESTE CRÍTICO: Verificar se a chave específica existe
    const hasExactKey = Object.prototype.hasOwnProperty.call(ENHANCED_BLOCK_REGISTRY, type);
    console.log(`🔑 Registry.hasOwnProperty("${type}"):`, hasExactKey);

    if (hasExactKey) {
        const component = ENHANCED_BLOCK_REGISTRY[type];
        console.log(`🎯 Componente encontrado para "${type}":`, {
            exists: !!component,
            type: typeof component,
            name: (component as any)?.name || (component as any)?.displayName || 'Sem nome'
        });
        if (isValidReactComponent(component)) {
            return component;
        }
        console.error(`❌ Componente inválido registrado para "${type}". Aplicando fallback TextInlineBlock.`);
        return TextInlineBlock;
    }

    if (!type) {
        console.warn('getEnhancedBlockComponent: tipo não fornecido, usando fallback');
        return TextInlineBlock;
    }

    console.log(`🔎 Verificando tipo exato no registry: "${type}"`);

    // Verificar se o tipo existe diretamente no registro
    if (ENHANCED_BLOCK_REGISTRY[type]) {
        console.log(`✅ Tipo exato encontrado no registry: "${type}"`);
        const comp = ENHANCED_BLOCK_REGISTRY[type];
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
    }    // Verificar se há um alias exato para o tipo
    const normalizedType = type.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (ENHANCED_BLOCK_REGISTRY[normalizedType]) {
        console.log(`🎨 Alias: ${type} → ${normalizedType}`);
        const comp = ENHANCED_BLOCK_REGISTRY[normalizedType];
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
    }

    // Verificar se há um fallback baseado em prefixo
    const prefix = type.split('-')[0];
    const fallbackKey = `${prefix}-*`;
    if (ENHANCED_BLOCK_REGISTRY[fallbackKey]) {
        const comp = ENHANCED_BLOCK_REGISTRY[fallbackKey];
        console.log(`🎨 Fallback: ${type} → ${fallbackKey} (${(comp as any).name || 'component'})`);
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
    }

    // Verificar se há um fallback baseado em sufixo
    const suffix = type.split('-').pop();
    const suffixFallbackKey = `*-${suffix}`;
    if (ENHANCED_BLOCK_REGISTRY[suffixFallbackKey]) {
        console.log(`🎨 Fallback: ${type} → ${suffixFallbackKey}`);
        const comp = ENHANCED_BLOCK_REGISTRY[suffixFallbackKey];
        return isValidReactComponent(comp) ? comp : TextInlineBlock;
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
    const finalComp = ENHANCED_BLOCK_REGISTRY['style-card-inline'];
    return isValidReactComponent(finalComp) ? finalComp : TextInlineBlock;
};

/**
 * Lista de componentes disponíveis para a sidebar do editor
 * Organizada por categorias - APENAS COMPONENTES 100% EDITÁVEIS
 * Versão otimizada sem duplicações
 */
export const AVAILABLE_COMPONENTS = [
    // ============================================================================
    // 🧩 COMPONENTES MODULARES DO QUIZ (100% Editáveis)
    // ============================================================================
    {
        type: 'quiz-logo',
        label: 'Logo do Quiz',
        category: 'quiz',
        description: 'Logo com dimensões e estilos editáveis',
    },
    {
        type: 'quiz-progress-bar',
        label: 'Barra de Progresso',
        category: 'quiz',
        description: 'Indicador visual de progresso com estilos customizáveis',
    },
    {
        type: 'quiz-back-button',
        label: 'Botão Voltar',
        category: 'quiz',
        description: 'Navegação para etapa anterior',
    },
    {
        type: 'quiz-question-header',
        label: 'Cabeçalho de Pergunta',
        category: 'quiz',
        description: 'Título da pergunta com número do step',
    },
    {
        type: 'quiz-transition-loader',
        label: 'Loader de Transição',
        category: 'quiz',
        description: 'Animação de loading entre steps',
    },
    {
        type: 'quiz-result-header',
        label: 'Cabeçalho de Resultado',
        category: 'quiz',
        description: 'Exibição do resultado do quiz',
    },
    {
        type: 'quiz-offer-hero',
        label: 'Hero de Oferta',
        category: 'quiz',
        description: 'Seção hero para página de oferta',
    },
    {
        type: 'image-display-inline',
        label: 'Imagem Display',
        category: 'content',
        description: 'Imagem com controles completos de tamanho e estilo',
    },

    // ============================================================================
    // 🏗️ COMPONENTES ESTRUTURAIS (Layout & Containers)
    // ============================================================================
    { type: 'container', label: 'Container', category: 'layout', description: 'Container flexível com padding e estilos personalizáveis' },
    { type: 'section', label: 'Seção', category: 'layout', description: 'Seção para agrupar conteúdo' },

    // ============================================================================
    // 📝 COMPONENTES DE CONTEÚDO (Text & Media)
    // ============================================================================
    { type: 'heading', label: 'Título (H1-H6)', category: 'content', description: 'Títulos com níveis hierárquicos editáveis' },
    { type: 'text-inline', label: 'Texto', category: 'content', description: 'Parágrafo de texto com formatação completa' },
    { type: 'image-inline', label: 'Imagem', category: 'content', description: 'Imagem com URL, alt, dimensões e estilos' },
    // ❌ REMOVED: duplicate 'image-display-inline' (already defined in quiz section above)

    // ============================================================================
    // 🎨 COMPONENTES VISUAIS (Decoração)
    // ============================================================================
    { type: 'decorative-bar', label: 'Barra Decorativa', category: 'visual', description: 'Linha decorativa horizontal' },
    { type: 'gradient-animation', label: 'Gradiente Animado', category: 'visual', description: 'Fundo com gradiente animado' },

    // ============================================================================
    // 🎯 COMPONENTES DE QUIZ (Interação)
    // ============================================================================
    { type: 'quiz-intro-header', label: 'Header do Quiz', category: 'quiz', description: 'Cabeçalho com logo e título do quiz' },
    { type: 'options-grid', label: 'Grid de Opções', category: 'quiz', description: 'Grade de opções selecionáveis com imagens' },
    { type: 'question-hero', label: 'Hero de Pergunta', category: 'quiz', description: 'Seção hero para perguntas do quiz' },
    { type: 'strategic-question', label: 'Pergunta Estratégica', category: 'quiz', description: 'Pergunta com design especial' },
    { type: 'transition-hero', label: 'Hero de Transição', category: 'quiz', description: 'Tela de transição entre etapas' },
    { type: 'progress-bar', label: 'Barra de Progresso', category: 'quiz', description: 'Indicador visual de progresso' },
    { type: 'loading-animation', label: 'Animação de Loading', category: 'quiz', description: 'Loader animado' },

    // ============================================================================
    // 📋 COMPONENTES DE FORMULÁRIO (Input & Forms)
    // ============================================================================
    { type: 'form-input', label: 'Campo de Texto', category: 'forms', description: 'Input de texto com label e validação' },
    { type: 'lead-form', label: 'Formulário de Lead', category: 'forms', description: 'Formulário completo de captura' },
    { type: 'connected-lead-form', label: 'Formulário Conectado', category: 'forms', description: 'Formulário com integração de dados' },

    // ============================================================================
    // 🔘 COMPONENTES DE AÇÃO (Buttons & CTAs)
    // ============================================================================
    { type: 'button-inline', label: 'Botão', category: 'action', description: 'Botão com texto, cores e ação personalizáveis' },
    { type: 'legal-notice', label: 'Aviso Legal', category: 'action', description: 'Texto legal com checkbox' },

    // ============================================================================
    // � COMPONENTES DE TRANSIÇÃO (Steps 12 & 19) - Blocos Atômicos
    // ============================================================================
    { type: 'transition-title', label: 'Transição: Título', category: 'transition', description: 'Título da tela de transição' },
    { type: 'transition-loader', label: 'Transição: Loader', category: 'transition', description: 'Animação de loading personalizada' },
    { type: 'transition-text', label: 'Transição: Texto', category: 'transition', description: 'Texto explicativo da transição' },
    { type: 'transition-progress', label: 'Transição: Progresso', category: 'transition', description: 'Barra de progresso da análise' },
    { type: 'transition-message', label: 'Transição: Mensagem', category: 'transition', description: 'Mensagem contextual com ícone' },

    // ============================================================================
    // �📊 COMPONENTES DE RESULTADO (Step 20)
    // ============================================================================
    { type: 'result-card', label: 'Card de Resultado', category: 'result', description: 'Card com resultado do quiz' },
    { type: 'result-header-inline', label: 'Header de Resultado', category: 'result', description: 'Cabeçalho da página de resultado' },
    { type: 'style-card-inline', label: 'Card de Estilo', category: 'result', description: 'Card individual de estilo' },
    { type: 'style-cards-grid', label: 'Grid de Estilos', category: 'result', description: 'Grade de cards de estilo' },

    // 🎨 Step 20 - Blocos Atômicos
    { type: 'result-header', label: 'Resultado: Cabeçalho', category: 'result', description: 'Cabeçalho da página de resultado' },
    { type: 'result-main', label: 'Resultado: Estilo Principal', category: 'result', description: 'Card do estilo principal identificado' },
    { type: 'result-image', label: 'Resultado: Imagem', category: 'result', description: 'Imagem ilustrativa do resultado' },
    { type: 'result-description', label: 'Resultado: Descrição', category: 'result', description: 'Texto descritivo do estilo' },
    { type: 'result-characteristics', label: 'Resultado: Características', category: 'result', description: 'Lista de características do estilo' },
    { type: 'result-cta', label: 'Resultado: Call to Action', category: 'result', description: 'Botão de ação principal' },
    { type: 'result-secondary-styles', label: 'Resultado: Estilos Secundários', category: 'result', description: 'Lista de estilos compatíveis' },

    // 🆕 Step 20 - Módulos Especializados
    { type: 'step20-result-header', label: 'Step20: Header', category: 'result', description: 'Header modular do resultado' },
    { type: 'step20-style-reveal', label: 'Step20: Revelação de Estilo', category: 'result', description: 'Animação de revelação' },
    { type: 'step20-user-greeting', label: 'Step20: Saudação', category: 'result', description: 'Saudação personalizada' },
    { type: 'step20-compatibility', label: 'Step20: Compatibilidade', category: 'result', description: 'Análise de compatibilidade' },
    { type: 'step20-secondary-styles', label: 'Step20: Estilos Secundários', category: 'result', description: 'Grid de estilos secundários' },
    { type: 'step20-personalized-offer', label: 'Step20: Oferta Personalizada', category: 'result', description: 'CTA com oferta baseada no resultado' },
    { type: 'step20-complete-template', label: 'Step20: Template Completo', category: 'result', description: 'Template completo da Step 20' },

    // ============================================================================
    // 💰 COMPONENTES DE OFERTA/VENDAS (Step 21)
    // ============================================================================
    { type: 'offer-hero', label: 'Hero de Oferta', category: 'offer', description: 'Seção hero da página de oferta' },
    { type: 'sales-hero', label: 'Sales Hero', category: 'offer', description: 'Hero de vendas com proposta de valor' },
    { type: 'urgency-timer-inline', label: 'Timer de Urgência', category: 'offer', description: 'Contador regressivo' },
    { type: 'before-after-inline', label: 'Antes e Depois', category: 'offer', description: 'Comparação antes/depois' },
    { type: 'value-anchoring', label: 'Ancoragem de Valor', category: 'offer', description: 'Comparação de valores' },
    { type: 'bonus', label: 'Seção de Bônus', category: 'offer', description: 'Lista de bônus inclusos' },
    { type: 'testimonials', label: 'Grade de Depoimentos', category: 'offer', description: 'Grid de depoimentos' },
    { type: 'testimonial-card-inline', label: 'Depoimento Individual', category: 'offer', description: 'Card único de depoimento' },
    { type: 'testimonials-carousel-inline', label: 'Carrossel de Depoimentos', category: 'offer', description: 'Slider de depoimentos' },
    { type: 'guarantee', label: 'Garantia', category: 'offer', description: 'Seção de garantia' },
    { type: 'secure-purchase', label: 'Compra Segura', category: 'offer', description: 'Selos de segurança' },
    { type: 'benefits', label: 'Lista de Benefícios', category: 'offer', description: 'Lista de benefícios do produto' },
    { type: 'mentor-section-inline', label: 'Seção da Mentora', category: 'offer', description: 'Apresentação da mentora/autoridade' },

    // ============================================================================
    // 🧭 COMPONENTES DE NAVEGAÇÃO
    // ============================================================================
    { type: 'quiz-navigation', label: 'Navegação do Quiz', category: 'navigation', description: 'Barra de navegação premium' },

    // ============================================================================
    // 🤖 COMPONENTES DE IA
    // ============================================================================
    { type: 'fashion-ai-generator', label: 'Gerador de IA Fashion', category: 'ai', description: 'Geração de estilos com IA' },

    // ============================================================================
    // 🔧 COMPONENTES AVANÇADOS (Templates & Wrappers)
    // ============================================================================
    { type: 'connected-template-wrapper', label: 'Template Wrapper', category: 'advanced', description: 'Wrapper conectado para templates' },
];

/**
 * Normaliza as propriedades de um bloco para garantir consistência
 * Retorna o bloco completo com propriedades normalizadas
 */
export const normalizeBlockProperties = (block: any) => {
    console.log(`🔧 normalizeBlockProperties chamado para bloco:`, {
        blockId: block?.id,
        originalType: block?.type,
        hasType: !!block?.type,
        blockKeys: Object.keys(block || {}),
        fullBlock: block
    });

    if (!block) return { type: undefined, properties: {} };

    // Garantir que properties existe
    const properties = block.properties || {};

    // Normalizar propriedades comuns
    const baseNormalized = {
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

    let normalizedProperties;

    // Normalizar propriedades específicas por tipo de bloco
    switch (block.type) {
        case 'text':
        case 'text-inline':
            normalizedProperties = {
                ...baseNormalized,
                content: block.content || properties.content || '',
                fontSize: properties.fontSize || 16,
                fontWeight: properties.fontWeight || 'normal',
                color: properties.color || '#000000',
            };
            break;
        case 'image':
        case 'image-inline':
            normalizedProperties = {
                ...baseNormalized,
                src: properties.src || '',
                alt: properties.alt || '',
                width: properties.width || 'auto',
                height: properties.height || 'auto',
            };
            break;
        case 'button':
        case 'button-inline':
            normalizedProperties = {
                ...baseNormalized,
                text: properties.text || 'Botão',
                url: properties.url || '#',
                color: properties.color || '#ffffff',
                backgroundColor: properties.backgroundColor || '#3b82f6',
            };
            break;
        default:
            normalizedProperties = baseNormalized;
            break;
    }

    // Retornar o bloco completo com propriedades normalizadas e preservar todos os campos originais
    return {
        ...block,
        type: block.type,  // Garantir que o tipo seja preservado
        properties: normalizedProperties
    };
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
