import { BlockDefinition } from '@/types/editor';
import React from 'react';
import { Type, Heading, Image, Sparkles, Grid, Clock, Award, Star, Settings } from 'lucide-react';

// Basic Inline Components
import TextInline from '../components/blocks/inline/TextInline';
import HeadingBlock from '../components/blocks/inline/HeadingBlock';
import HeadingInline from '../components/blocks/inline/HeadingInline';
import ButtonInline from '../components/blocks/inline/ButtonInline';
import ImageDisplayInlineBlockClean from '../components/blocks/inline/ImageDisplayInlineBlock.clean';
import OptionsGridInlineBlock from '../components/blocks/inline/OptionsGridInlineBlock';
import DecorativeBarInline from '../components/blocks/inline/DecorativeBarInline';
import LegalNoticeInline from '../components/blocks/inline/LegalNoticeInline';
import LoadingAnimationBlock from '../components/blocks/inline/LoadingAnimationBlock';

// Quiz Components
import QuizIntroBlock from '../components/blocks/quiz/QuizIntroBlock';
import QuizIntroHeaderBlock from '../components/blocks/quiz/QuizIntroHeaderBlock';

// Template Blocks - Wrappers para templates TSX conectados
import Step01TemplateBlock from "../components/blocks/templates/Step01TemplateBlock";

// Offer Components
import QuizOfferPricingInlineBlock from '../components/blocks/inline/QuizOfferPricingInlineBlock';
import QuizOfferCTAInlineBlock from '../components/blocks/inline/QuizOfferCTAInlineBlock';
import TestimonialsInlineBlock from '../components/blocks/inline/TestimonialsInlineBlock';
import CountdownInlineBlock from '../components/blocks/inline/CountdownInlineBlock';

// Result Components
import ResultCardInlineBlock from '../components/blocks/inline/ResultCardInlineBlock';
import SecondaryStylesInlineBlock from '../components/blocks/inline/SecondaryStylesInlineBlock';
import StyleCharacteristicsInlineBlock from '../components/blocks/inline/StyleCharacteristicsInlineBlock';
import CharacteristicsListInlineBlock from '../components/blocks/inline/CharacteristicsListInlineBlock';
import BenefitsInlineBlock from '../components/blocks/inline/BenefitsInlineBlock';

// Fallback component
const createFallbackComponent = (componentName: string) => {
  const FallbackComponent: React.FC<any> = (props) => 
    React.createElement('div', {
      className: "p-4 border border-dashed border-gray-300 rounded bg-gray-50"
    }, [
      React.createElement('div', {
        key: 'name',
        className: "text-sm font-medium text-gray-700"
      }, componentName),
      React.createElement('div', {
        key: 'desc',
        className: "text-xs text-gray-500"
      }, 'Component needs implementation'),
      props.children && React.createElement('div', {
        key: 'children',
        className: "mt-2"
      }, props.children)
    ]);
  FallbackComponent.displayName = componentName;
  return FallbackComponent;
};

// Comprehensive registry with all components needed for 21 steps
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ===== BASIC TEXT & CONTENT COMPONENTS =====
  'text-inline': TextInline,
  'heading-inline': HeadingInline,
  'heading': HeadingBlock,
  'button-inline': ButtonInline,
  'image-display-inline': ImageDisplayInlineBlockClean,
  'decorative-bar-inline': DecorativeBarInline,
  'legal-notice-inline': LegalNoticeInline,
  
  // ===== QUIZ INTRODUCTION COMPONENTS =====
  'quiz-intro': QuizIntroBlock, // Use proper QuizIntroBlock
  'quiz-intro-header': QuizIntroHeaderBlock, // Quiz header with logo and progress
  
  // ===== QUIZ INTERACTION COMPONENTS =====
  'options-grid': OptionsGridInlineBlock,
  'form-input': createFallbackComponent('FormInput'),
  'spacer-inline': createFallbackComponent('SpacerInline'),
  
  // ===== LOADING & PROGRESS COMPONENTS =====
  'loading-animation': LoadingAnimationBlock,
  'progress-inline': createFallbackComponent('ProgressInline'),
  
  // ===== RESULT COMPONENTS =====
  'result-header-inline': createFallbackComponent('ResultHeaderInline'),
  'style-card-inline': ResultCardInlineBlock,
  'style-characteristics-inline': StyleCharacteristicsInlineBlock,
  'secondary-styles-inline': SecondaryStylesInlineBlock,
  'characteristics-list-inline': CharacteristicsListInlineBlock,
  'benefits-inline': BenefitsInlineBlock,
  
  // ===== OFFER PAGE COMPONENTS =====
  'quiz-offer-pricing-inline': QuizOfferPricingInlineBlock,
  'quiz-offer-cta-inline': QuizOfferCTAInlineBlock,
  'testimonials-inline': TestimonialsInlineBlock,
  'countdown-inline': CountdownInlineBlock,
  'before-after-inline': createFallbackComponent('BeforeAfterInline'),
  'bonus-list-inline': createFallbackComponent('BonusListInline'),
  'guarantee-inline': createFallbackComponent('GuaranteeInline'),
  
  // ===== TEMPLATE WRAPPERS =====
  "step01-template": Step01TemplateBlock,
};

// Fallback component for missing components
const FallbackComponent: React.ComponentType<any> = ({ block, ...props }) => 
  React.createElement('div', 
    { 
      className: "p-4 border border-dashed border-gray-300 rounded text-center text-gray-500",
      ...props 
    },
    [
      React.createElement('div', 
        { key: 'type', className: 'font-medium' }, 
        `Component: ${block?.type || 'unknown'}`
      ),
      React.createElement('div', 
        { key: 'msg', className: 'text-xs mt-1' }, 
        'Available in registry but needs proper implementation'
      )
    ]
  );

export const getBlockComponent = (type: string): React.ComponentType<any> => {
  const component = ENHANCED_BLOCK_REGISTRY[type];
  if (component) {
    return component;
  }
  
  console.warn(`Component '${type}' not found in Enhanced Block Registry. Available types:`, Object.keys(ENHANCED_BLOCK_REGISTRY));
  return FallbackComponent;
};

export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

export const blockTypeExists = (type: string): boolean => {
  return type in ENHANCED_BLOCK_REGISTRY;
};

export const generateBlockDefinitions = (): BlockDefinition[] => {
  const definitions: BlockDefinition[] = [
    {
      type: "text-inline",
      name: "TextInline",
      label: "Texto",
      category: "Conteúdo",
      description: "Bloco de texto editável",
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY["text-inline"],
      properties: {},
      defaultProps: { content: "Digite seu texto aqui..." },
    },
    {
      type: "heading-inline",
      name: "HeadingInline",
      label: "Título",
      category: "Conteúdo",
      description: "Título com diferentes tamanhos",
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY["heading-inline"],
      properties: {},
      defaultProps: { text: "Seu título aqui", level: "h2" },
    },
    {
      type: "button-inline",
      name: "ButtonInline",
      label: "Botão",
      category: "Interação",
      description: "Botão clicável",
      icon: Settings,
      component: ENHANCED_BLOCK_REGISTRY["button-inline"],
      properties: {},
      defaultProps: { text: "Clique aqui", variant: "primary" },
    },
    {
      type: "image-display-inline",
      name: "ImageDisplayInlineBlockClean",
      label: "Imagem",
      category: "Mídia",
      description: "Exibição de imagens",
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY["image-display-inline"],
      properties: {},
      defaultProps: { src: "", alt: "Imagem" },
    },
    {
      type: "options-grid",
      name: "OptionsGridInlineBlock",
      label: "Grade de Opções",
      category: "Quiz",
      description: "Grade de opções para quiz",
      icon: Grid,
      component: ENHANCED_BLOCK_REGISTRY["options-grid"],
      properties: {},
      defaultProps: { options: [] },
    },
    {
      type: "quiz-intro",
      name: "QuizIntro",
      label: "Introdução do Quiz",
      category: "Quiz",
      description: "Componente de introdução do quiz",
      icon: Sparkles,
      component: ENHANCED_BLOCK_REGISTRY["quiz-intro"],
      properties: {},
      defaultProps: { title: "Quiz de Estilo Pessoal" },
    },
    {
      type: "loading-animation",
      name: "LoadingAnimationBlock",
      label: "Animação de Carregamento",
      category: "UI",
      description: "Animação de carregamento",
      icon: Clock,
      component: ENHANCED_BLOCK_REGISTRY["loading-animation"],
      properties: {},
      defaultProps: { message: "Carregando..." },
    },
    {
      type: "step01-template",
      name: "Step01TemplateBlock",
      label: "Template Etapa 1",
      category: "Templates",
      description: "Template conectado da Etapa 1",
      icon: Sparkles,
      component: ENHANCED_BLOCK_REGISTRY["step01-template"],
      properties: {},
      defaultProps: { stepNumber: 1, stepName: "Quiz de Estilo Pessoal" },
    }
  ];

  // Add definitions for all registered components
  Object.keys(ENHANCED_BLOCK_REGISTRY).forEach(type => {
    if (!definitions.find(def => def.type === type)) {
      definitions.push({
        type,
        name: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        label: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        category: type.includes('quiz') ? 'Quiz' : type.includes('offer') ? 'Oferta' : 'Outros',
        description: `Componente ${type}`,
        icon: Star,
        component: ENHANCED_BLOCK_REGISTRY[type],
        properties: {},
        defaultProps: {},
      });
    }
  });

  return definitions;
};

export default ENHANCED_BLOCK_REGISTRY;