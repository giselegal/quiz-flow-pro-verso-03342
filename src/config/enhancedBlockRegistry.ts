import { Heading, Image, Minus, MousePointer, Type } from 'lucide-react';
import React from 'react';
import OptionsGridInlineBlock from '../components/blocks/inline/OptionsGridInlineBlock';
import { BlockDefinition } from '../types/editor';

/**
 * ENHANCED BLOCK REGISTRY - APENAS COMPONENTES PRINCIPAIS
 * ✅ Foco nos componentes mais usados e estáveis
 * ✅ Sem duplicatas ou imports quebrados
 * ✅ Compatível com stepTemplatesMapping atualizado
 */

// === IMPORTS DE COMPONENTES PRINCIPAIS ===

// Componentes Inline existentes
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import CountdownInlineBlock from '../components/blocks/inline/CountdownInlineBlock';
import DecorativeBarInline from '../components/blocks/inline/DecorativeBarInline';
import DividerInlineBlock from '../components/blocks/inline/DividerInlineBlock';
import HeadingInline from '../components/blocks/inline/HeadingInline';
import ImageDisplayInline from '../components/blocks/inline/ImageDisplayInline';
import LegalNoticeInline from '../components/blocks/inline/LegalNoticeInline';
import PricingCardInlineBlock from '../components/blocks/inline/PricingCardInlineBlock';
import TextInline from '../components/blocks/inline/TextInline';

// Componentes Editor Blocks
import DecorativeBarInlineBlock from '../components/editor/blocks/DecorativeBarInlineBlock';
import FinalStepEditor from '../components/editor/blocks/FinalStepEditor';
import FormContainerBlock from '../components/editor/blocks/FormContainerBlock';
import FormInputBlock from '../components/editor/blocks/FormInputBlock';
import HeadingInlineBlock from '../components/editor/blocks/HeadingInlineBlock';
import LeadFormBlock from '../components/editor/blocks/LeadFormBlock';
import LegalNoticeInlineBlock from '../components/editor/blocks/LegalNoticeInlineBlock';
import QuizIntroHeaderBlock from '../components/editor/blocks/QuizIntroHeaderBlock';
import QuizOptionBlock from '../components/editor/blocks/QuizOptionBlock';
import QuizProgressBlock from '../components/editor/blocks/QuizProgressBlock';
import QuizResultsEditor from '../components/editor/blocks/QuizResultsEditor';
import SpacerInlineBlock from '../components/editor/blocks/SpacerInlineBlock';
import StyleResultsEditor from '../components/editor/blocks/StyleResultsEditor';
import TextInlineBlock from '../components/editor/blocks/TextInlineBlock';

// Novos componentes para o Quiz
import BonusShowcaseBlock from '../components/blocks/inline/BonusShowcaseBlock';
import LoadingAnimationBlock from '../components/blocks/inline/LoadingAnimationBlock';
import ResultStyleCardBlock from '../components/blocks/inline/ResultStyleCardBlock';

// Componentes de Oferta (Etapa 21) - removidos durante limpeza
// Imports removidos durante limpeza de conflitos:
// import {
//   OfferFaqSection,
//   OfferGuaranteeSection,
//   OfferHeader,
//   OfferHeroSection,
//   OfferProblemSection,
//   OfferProductShowcase,
//   OfferSolutionSection,
// } from '../components/editor-fixed/offer';
// import Step21OfferPage from '../components/editor-fixed/step-types/Step21OfferPage';

// === REGISTRY PRINCIPAL - SEM DUPLICATAS ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ✅ COMPONENTES PRINCIPAIS DO QUIZ

  // Text and Content
  'text-inline': TextInlineBlock,
  'heading-inline': HeadingInlineBlock,
  // 'image-display-inline': ImageDisplayInlineBlock, // ❌ TEMPORARIAMENTE DESABILITADO PARA DEBUG

  // Quiz Components - Principais
  'quiz-intro-header': QuizIntroHeaderBlock,
  'quiz-header': QuizIntroHeaderBlock, // Alias
  'form-input': FormInputBlock,
  'lead-form': LeadFormBlock, // ✅ Componente específico para multiple fields

  // Interactive Elements
  'button-inline': ButtonInlineFixed,
  'decorative-bar-inline': DecorativeBarInlineBlock,

  // Layout and Design
  divider: DividerInlineBlock,
  spacer: SpacerInlineBlock,
  'form-container': FormContainerBlock,
  // Commerce and Pricing
  'pricing-card': PricingCardInlineBlock,
  countdown: CountdownInlineBlock,

  // Legal
  'legal-notice-inline': LegalNoticeInlineBlock,

  // ✅ QUIZ ADVANCED - COMPONENTES DAS 21 ETAPAS
  'options-grid': OptionsGridInlineBlock, // Usado em 18 templates
  'quiz-option': QuizOptionBlock,
  'quiz-progress': QuizProgressBlock,
  'quiz-results': QuizResultsEditor,
  'style-results': StyleResultsEditor,
  'final-step': FinalStepEditor,

  // ✅ NOVOS COMPONENTES ESPECÍFICOS DO QUIZ
  'result-card': PricingCardInlineBlock, // Fallback para result-card → pricing card
  'result-style-card': ResultStyleCardBlock, // step-21
  'bonus-showcase': BonusShowcaseBlock, // ofertas especiais
  'loading-animation': LoadingAnimationBlock, // transições

  // ✅ COMPONENTES DE OFERTA - REMOVIDOS DURANTE LIMPEZA
  // 'step-21-offer': Step21OfferPage, // Componente principal da etapa 21
  // 'offer-header': OfferHeader,
  // 'offer-hero-section': OfferHeroSection,
  // 'offer-problem-section': OfferProblemSection,
  // 'offer-solution-section': OfferSolutionSection,
  // 'offer-product-showcase': OfferProductShowcase,
  // 'offer-guarantee-section': OfferGuaranteeSection,
  // 'offer-faq-section': OfferFaqSection,

  // ✅ COMPONENTES LEGACY (COMPATIBILIDADE)
  text: TextInline,
  heading: HeadingInline,
  button: ButtonInlineFixed,
  image: ImageDisplayInline,
  'decorative-bar': DecorativeBarInline,
  'legal-notice': LegalNoticeInline,

  // ✅ FALLBACKS PARA TIPOS NÃO IMPLEMENTADOS
  // Estes são tipos estruturais dos JSONs, não componentes visuais
  question: TextInlineBlock, // Fallback para tipo "question"
  strategicQuestion: TextInlineBlock, // Fallback para tipo "strategicQuestion"
  mainTransition: TextInlineBlock, // Fallback para tipo "mainTransition"
  result: QuizResultsEditor, // Fallback para tipo "result"
  intro: TextInlineBlock, // Fallback para tipo "intro"
  progress: QuizProgressBlock, // Fallback para tipo "progress"
};

/**
 * Obter componente por tipo (com fallbacks inteligentes)
 */
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  // DEBUG: Log do tipo sendo buscado
  console.log(`🔍 Buscando componente para tipo: "${type}"`);

  // Primeiro: buscar componente direto
  let component = ENHANCED_BLOCK_REGISTRY[type];

  if (component) {
    console.log(`✅ Componente encontrado diretamente: ${type}`);
    return component;
  }

  // Segundo: tentar fallbacks inteligentes
  const fallbacks: Record<string, string> = {
    // Mapeamentos alternativos comuns
    text: 'text-inline',
    heading: 'heading-inline',
    image: 'image-display-inline',
    button: 'button-inline',
    'decorative-bar': 'decorative-bar-inline',
    'legal-notice': 'legal-notice-inline',

    // Quiz específicos
    'quiz-header': 'quiz-intro-header',
    intro: 'text-inline',
    form: 'form-input',
    'lead-form': 'lead-form', // ✅ Mantém mapeamento direto
    options: 'options-grid',

    // Tipos estruturais → componentes visuais
    question: 'text-inline',
    strategicQuestion: 'options-grid',
    mainTransition: 'text-inline',
    result: 'quiz-results',
    progress: 'quiz-progress',
  };

  const fallbackType = fallbacks[type];
  if (fallbackType) {
    component = ENHANCED_BLOCK_REGISTRY[fallbackType];
    if (component) {
      console.log(`🔄 Fallback usado: ${type} → ${fallbackType}`);
      return component;
    }
  }

  // Terceiro: fallback genérico baseado em categoria
  if (type.includes('text') || type.includes('title') || type.includes('content')) {
    console.log(`📝 Fallback genérico: ${type} → text-inline`);
    return ENHANCED_BLOCK_REGISTRY['text-inline'];
  }

  if (type.includes('button') || type.includes('cta') || type.includes('action')) {
    console.log(`🔘 Fallback genérico: ${type} → button-inline`);
    return ENHANCED_BLOCK_REGISTRY['button-inline'];
  }

  if (type.includes('image') || type.includes('photo') || type.includes('picture')) {
    console.log(`🖼️ Fallback genérico: ${type} → image-display-inline`);
    return ENHANCED_BLOCK_REGISTRY['image-display-inline'];
  }

  if (type.includes('quiz') || type.includes('question') || type.includes('option')) {
    console.log(`❓ Fallback genérico: ${type} → options-grid`);
    return ENHANCED_BLOCK_REGISTRY['options-grid'];
  }

  // Último: fallback final para texto
  console.warn(`⚠️ Componente não encontrado, usando fallback final: ${type} → text-inline`);
  console.log('📋 Componentes disponíveis:', Object.keys(ENHANCED_BLOCK_REGISTRY));

  return ENHANCED_BLOCK_REGISTRY['text-inline'] || null;
};

/**
 * Listar todos os tipos disponíveis
 */
export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

/**
 * Alias para compatibilidade com editorBlocksMapping
 */
export const getAllBlockTypes = getAvailableBlockTypes;

/**
 * Verificar se um tipo de bloco existe
 */
export const blockTypeExists = (type: string): boolean => {
  return type in ENHANCED_BLOCK_REGISTRY;
};

/**
 * Gerar definições de blocos para o sidebar
 */
export const generateBlockDefinitions = (): BlockDefinition[] => {
  return [
    {
      type: 'text-inline',
      name: 'Texto',
      icon: Type,
      category: 'content',
      description: 'Adicionar texto formatado',
      component: TextInline,
      label: 'Texto',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'heading-inline',
      name: 'Título',
      icon: Heading,
      category: 'content',
      description: 'Adicionar título',
      component: HeadingInline,
      label: 'Título',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'button-inline',
      name: 'Botão',
      icon: MousePointer,
      category: 'interactive',
      description: 'Botão clicável',
      component: ButtonInlineFixed,
      label: 'Botão',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'image-display-inline',
      name: 'Imagem',
      icon: Image,
      category: 'media',
      description: 'Exibir imagem',
      component: ImageDisplayInline,
      label: 'Imagem',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'decorative-bar-inline',
      name: 'Barra Decorativa',
      icon: Minus,
      category: 'design',
      description: 'Barra decorativa colorida',
      component: DecorativeBarInline,
      label: 'Barra Decorativa',
      properties: {},
      defaultProps: {},
    },
  ];
};

/**
 * Obter definição de um bloco específico (para compatibilidade)
 */
export const getBlockDefinition = (type: string) => {
  const definitions = generateBlockDefinitions();
  return definitions.find(def => def.type === type) || null;
};

/**
 * Obter estatísticas do registry
 */
export const getRegistryStats = () => {
  const types = Object.keys(ENHANCED_BLOCK_REGISTRY);
  const definitions = generateBlockDefinitions();
  const categories = Array.from(new Set(definitions.map(def => def.category)));

  return {
    totalBlocks: types.length,
    categories,
    types,
  };
};

export default ENHANCED_BLOCK_REGISTRY;
