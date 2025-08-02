import React from 'react';
import { BlockDefinition } from '@/types/editor';

/**
 * ENHANCED BLOCK REGISTRY - COMPONENTES REAIS E VALIDADOS
 * ✅ APENAS componentes que existem e funcionam
 * ✅ Import manual e explícito para garantir qualidade
 * ✅ Sistema de validação em runtime
 * ❌ ZERO placebo ou phantom components
 */

// === IMPORTS MANUAIS DE COMPONENTES REAIS ===

// INLINE COMPONENTS - TESTADOS E FUNCIONAIS
import BadgeInlineBlock from '../components/editor/blocks/inline/BadgeInlineBlock';
import BeforeAfterInlineBlock from '../components/editor/blocks/inline/BeforeAfterInlineBlock';
import BenefitsInlineBlock from '../components/editor/blocks/inline/BenefitsInlineBlock';
import BonusListInlineBlock from '../components/editor/blocks/inline/BonusListInlineBlock';
import ButtonInlineBlock from '../components/editor/blocks/inline/ButtonInlineBlock';
import CTAInlineBlock from '../components/editor/blocks/inline/CTAInlineBlock';
import CharacteristicsListInlineBlock from '../components/editor/blocks/inline/CharacteristicsListInlineBlock';
import CountdownInlineBlock from '../components/editor/blocks/inline/CountdownInlineBlock';
import DividerInlineBlock from '../components/editor/blocks/inline/DividerInlineBlock';
import GuaranteeInlineBlock from '../components/editor/blocks/inline/GuaranteeInlineBlock';
import HeadingInlineBlock from '../components/editor/blocks/inline/HeadingInlineBlock';
import ImageDisplayInlineBlock from '../components/editor/blocks/inline/ImageDisplayInlineBlock';
import LoadingAnimationBlock from '../components/editor/blocks/inline/LoadingAnimationBlock';
import PricingCardInlineBlock from '../components/editor/blocks/inline/PricingCardInlineBlock';
import ProgressInlineBlock from '../components/editor/blocks/inline/ProgressInlineBlock';
import QuizOfferCTAInlineBlock from '../components/editor/blocks/inline/QuizOfferCTAInlineBlock';
import QuizOfferPricingInlineBlock from '../components/editor/blocks/inline/QuizOfferPricingInlineBlock';
import QuizStartPageInlineBlock from '../components/editor/blocks/inline/QuizStartPageInlineBlock';
import ResultCardInlineBlock from '../components/editor/blocks/inline/ResultCardInlineBlock';
import ResultHeaderInlineBlock from '../components/editor/blocks/inline/ResultHeaderInlineBlock';
import SecondaryStylesInlineBlock from '../components/editor/blocks/inline/SecondaryStylesInlineBlock';
import SpacerInlineBlock from '../components/editor/blocks/inline/SpacerInlineBlock';
import StatInlineBlock from '../components/editor/blocks/inline/StatInlineBlock';
import StepHeaderInlineBlock from '../components/editor/blocks/inline/StepHeaderInlineBlock';
import StyleCardInlineBlock from '../components/editor/blocks/inline/StyleCardInlineBlock';
import StyleCharacteristicsInlineBlock from '../components/editor/blocks/inline/StyleCharacteristicsInlineBlock';
import TestimonialCardInlineBlock from '../components/editor/blocks/inline/TestimonialCardInlineBlock';
import TestimonialsInlineBlock from '../components/editor/blocks/inline/TestimonialsInlineBlock';
import TextInlineBlock from '../components/editor/blocks/inline/TextInlineBlock';

// STANDARD BLOCKS - TESTADOS E FUNCIONAIS
import BasicTextBlock from '../components/editor/blocks/BasicTextBlock';
import CountdownTimerBlock from '../components/editor/blocks/CountdownTimerBlock';
import GuaranteeBlock from '../components/editor/blocks/GuaranteeBlock';
import MentorBlock from '../components/editor/blocks/MentorBlock';
import QuizTitleBlock from '../components/editor/blocks/QuizTitleBlock';
import SocialProofBlock from '../components/editor/blocks/SocialProofBlock';
import StatsMetricsBlock from '../components/editor/blocks/StatsMetricsBlock';
import StrategicQuestionBlock from '../components/editor/blocks/StrategicQuestionBlock';

// === SISTEMA DE VALIDAÇÃO ===
const validateComponent = (component: any, type: string): boolean => {
  if (!component) {
    console.warn(`❌ Componente ${type} é undefined/null`);
    return false;
  }
  
  if (typeof component !== 'function' && !React.isValidElement(component)) {
    console.warn(`❌ Componente ${type} não é uma função React válida`);
    return false;
  }
  
  console.log(`✅ Componente ${type} validado com sucesso`);
  return true;
};

// REGISTRY DE COMPONENTES REAIS - TESTADOS E FUNCIONAIS
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = (() => {
  const registry: Record<string, React.ComponentType<any>> = {};
  
  // INLINE COMPONENTS - VALIDADOS UM POR UM
  const inlineComponents = {
    // Text & Content
    'text': TextInlineBlock,
    'text-inline': TextInlineBlock,
    'heading': HeadingInlineBlock,
    'heading-inline': HeadingInlineBlock,
    
    // Interactive
    'button': ButtonInlineBlock,
    'button-inline': ButtonInlineBlock,
    'badge': BadgeInlineBlock,
    'badge-inline': BadgeInlineBlock,
    'cta': CTAInlineBlock,
    'cta-inline': CTAInlineBlock,
    
    // Media
    'image': ImageDisplayInlineBlock,
    'image-inline': ImageDisplayInlineBlock,
    
    // Layout
    'spacer': SpacerInlineBlock,
    'spacer-inline': SpacerInlineBlock,
    'divider': DividerInlineBlock,
    'divider-inline': DividerInlineBlock,
    
    // Data Display
    'stat': StatInlineBlock,
    'stat-inline': StatInlineBlock,
    'progress': ProgressInlineBlock,
    'progress-inline': ProgressInlineBlock,
    'countdown': CountdownInlineBlock,
    'countdown-inline': CountdownInlineBlock,
    
    // E-commerce
    'pricing-card': PricingCardInlineBlock,
    'pricing-card-inline': PricingCardInlineBlock,
    'testimonial-card': TestimonialCardInlineBlock,
    'testimonial-card-inline': TestimonialCardInlineBlock,
    'testimonials': TestimonialsInlineBlock,
    'testimonials-inline': TestimonialsInlineBlock,
    
    // Quiz & Results
    'style-card': StyleCardInlineBlock,
    'style-card-inline': StyleCardInlineBlock,
    'result-card': ResultCardInlineBlock,
    'result-card-inline': ResultCardInlineBlock,
    'result-header': ResultHeaderInlineBlock,
    'result-header-inline': ResultHeaderInlineBlock,
    'step-header': StepHeaderInlineBlock,
    'step-header-inline': StepHeaderInlineBlock,
    'secondary-styles': SecondaryStylesInlineBlock,
    'secondary-styles-inline': SecondaryStylesInlineBlock,
    'style-characteristics': StyleCharacteristicsInlineBlock,
    'style-characteristics-inline': StyleCharacteristicsInlineBlock,
    'characteristics-list': CharacteristicsListInlineBlock,
    'characteristics-list-inline': CharacteristicsListInlineBlock,
    'quiz-start-page': QuizStartPageInlineBlock,
    'quiz-start-page-inline': QuizStartPageInlineBlock,
    'quiz-offer-cta': QuizOfferCTAInlineBlock,
    'quiz-offer-cta-inline': QuizOfferCTAInlineBlock,
    'quiz-offer-pricing': QuizOfferPricingInlineBlock,
    'quiz-offer-pricing-inline': QuizOfferPricingInlineBlock,
    
    // Features
    'guarantee': GuaranteeInlineBlock,
    'guarantee-inline': GuaranteeInlineBlock,
    'before-after': BeforeAfterInlineBlock,
    'before-after-inline': BeforeAfterInlineBlock,
    'bonus-list': BonusListInlineBlock,
    'bonus-list-inline': BonusListInlineBlock,
    'benefits': BenefitsInlineBlock,
    'benefits-inline': BenefitsInlineBlock,
    
    // System
    'loading-animation': LoadingAnimationBlock,
  };
  
  // STANDARD BLOCKS - VALIDADOS UM POR UM
  const standardBlocks = {
    'countdown-timer': CountdownTimerBlock,
    'stats-metrics': StatsMetricsBlock,
    'mentor': MentorBlock,
    'social-proof': SocialProofBlock,
    'basic-text': BasicTextBlock,
    'guarantee-block': GuaranteeBlock,
    'quiz-title': QuizTitleBlock,
    'strategic-question': StrategicQuestionBlock,
  };
  
  // Validar e registrar componentes inline
  console.log('🔍 Validando componentes inline...');
  Object.entries(inlineComponents).forEach(([type, component]) => {
    if (validateComponent(component, type)) {
      registry[type] = component;
    }
  });
  
  // Validar e registrar standard blocks  
  console.log('🔍 Validando standard blocks...');
  Object.entries(standardBlocks).forEach(([type, component]) => {
    if (validateComponent(component, type)) {
      registry[type] = component;
    }
  });
  
  console.log(`✅ Registry criado com ${Object.keys(registry).length} componentes REAIS validados`);
  console.log('📦 Componentes registrados:', Object.keys(registry).sort());
  
  return registry;
})();

// === UTILITÁRIOS E HELPER FUNCTIONS ===

// Componente de fallback para casos de erro
const createFallbackComponent = (blockType: string) => {
  return ({ block, ...props }: any) => {
    return React.createElement('div', {
      className: 'p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50'
    }, React.createElement('div', {
      className: 'text-center'
    }, [
      React.createElement('div', {
        className: 'text-red-600 font-medium',
        key: 'title'
      }, `⚠️ ${blockType}`),
      React.createElement('div', {
        className: 'text-xs text-red-500 mt-1',
        key: 'subtitle'
      }, 'Componente não encontrado'),
      React.createElement('div', {
        className: 'text-xs text-gray-500 mt-2',
        key: 'info'
      }, `ID: ${block?.id || 'N/A'} | Props: ${Object.keys(props).length}`)
    ]));
  };
};

// Função para obter componente com fallback inteligente
export const getEnhancedComponent = (blockType: string) => {
  const component = ENHANCED_BLOCK_REGISTRY[blockType];
  
  if (component) {
    console.log(`✅ Componente encontrado: ${blockType}`);
    return component;
  }
  
  // Tentativa de mapeamento inteligente
  const normalizedType = blockType.toLowerCase().replace(/[-_\s]/g, '');
  const fallbackComponent = Object.entries(ENHANCED_BLOCK_REGISTRY).find(([key]) => 
    key.toLowerCase().replace(/[-_\s]/g, '').includes(normalizedType) ||
    normalizedType.includes(key.toLowerCase().replace(/[-_\s]/g, ''))
  );
  
  if (fallbackComponent) {
    console.log(`🔄 Fallback mapping: ${blockType} -> ${fallbackComponent[0]}`);
    return fallbackComponent[1];
  }
  
  // Último recurso: componente de fallback
  console.warn(`⚠️ Componente não encontrado: ${blockType}. Usando fallback.`);
  return createFallbackComponent(blockType);
};

// Estatísticas do registry
export const getRegistryStats = () => {
  const totalComponents = Object.keys(ENHANCED_BLOCK_REGISTRY).length;
  const activeComponents = Object.values(ENHANCED_BLOCK_REGISTRY).filter(Boolean).length;
  
  return {
    total: totalComponents,
    active: activeComponents,
    coverage: `${Math.round((activeComponents / totalComponents) * 100)}%`,
    components: Object.keys(ENHANCED_BLOCK_REGISTRY).sort()
  };
};

// Auto-generate block definitions
export const generateBlockDefinitions = (): BlockDefinition[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY).map(blockType => ({
    type: blockType,
    name: blockType.charAt(0).toUpperCase() + blockType.slice(1).replace(/[-_]/g, ' '),
    description: `Componente ${blockType} validado`,
    category: getBlockCategory(blockType),
    icon: 'Square' as any,
    component: ENHANCED_BLOCK_REGISTRY[blockType],
    properties: {},
    label: blockType,
    defaultProps: {}
  }));
};

// Categorização inteligente
const getBlockCategory = (blockType: string): string => {
  if (blockType.includes('quiz')) return 'Quiz';
  if (blockType.includes('text') || blockType.includes('heading')) return 'Text';
  if (blockType.includes('image') || blockType.includes('video')) return 'Media';
  if (blockType.includes('button') || blockType.includes('cta')) return 'Interactive';
  if (blockType.includes('pricing') || blockType.includes('product')) return 'E-commerce';
  if (blockType.includes('testimonial') || blockType.includes('review')) return 'Social Proof';
  if (blockType.includes('spacer') || blockType.includes('divider')) return 'Layout';
  return 'Content';
};

export default ENHANCED_BLOCK_REGISTRY;
