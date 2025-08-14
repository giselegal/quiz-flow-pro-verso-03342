import React from 'react';

// ✅ MISSING COMPONENTS - Fix Import Paths
import AccessibilitySkipLinkBlock from '../components/blocks/inline/AccessibilitySkipLinkBlock';
import QuizIntroHeaderBlock from '../components/editor/blocks/QuizIntroHeaderBlock';
import ImageInlineBlock from '../components/editor/blocks/ImageInlineBlock';
import LeadFormBlock from '../components/editor/blocks/LeadFormBlock';

<<<<<<< HEAD
<<<<<<< HEAD
// Imports das etapas 20-21 (Result e Offer)
import CountdownInlineBlock from '../components/blocks/inline/CountdownInlineBlock';
import QuizOfferPricingInlineBlock from '../components/blocks/inline/QuizOfferPricingInlineBlock';
import QuizOfferCTAInlineBlock from '../components/blocks/inline/QuizOfferCTAInlineBlock';
import ResultCardInlineBlock from '../components/blocks/inline/ResultCardInlineBlock';
import TestimonialsInlineBlock from '../components/blocks/inline/TestimonialsInlineBlock';
=======
// ✅ EXISTING COMPONENTS - Fix Import Paths  
import TextInlineBlock from '../components/editor/blocks/TextInlineBlock';
import HeadingInlineBlock from '../components/editor/blocks/HeadingInlineBlock';
import ButtonInlineBlock from '../components/editor/blocks/ButtonInlineBlock';
import DecorativeBarInlineBlock from '../components/editor/blocks/DecorativeBarInlineBlock';
import LegalNoticeInlineBlock from '../components/editor/blocks/LegalNoticeInlineBlock';
import FormInputBlock from '../components/editor/blocks/FormInputBlock';
import OptionsGridBlock from '../components/editor/blocks/OptionsGridBlock';
>>>>>>> origin/copilot/fix-8af1cb0c-9277-4418-afa3-556cf126fe66

// ✅ ADDITIONAL INLINE COMPONENTS
import PricingInlineBlock from '../components/editor/blocks/PricingInlineBlock';
import QuizProgressBlock from '../components/editor/blocks/QuizProgressBlock';
import QuizResultsEditor from '../components/editor/blocks/QuizResultsEditor';
import StyleResultsEditor from '../components/editor/blocks/StyleResultsEditor';
import FinalStepEditor from '../components/editor/blocks/FinalStepEditor';

<<<<<<< HEAD
// Registry completo
=======
// Imports dos componentes que estavam faltando
import AccessibilitySkipLinkBlock from '../components/blocks/inline/AccessibilitySkipLinkBlock';
import DecorativeBarInline from '../components/blocks/inline/DecorativeBarInline';
import LegalNoticeInline from '../components/blocks/inline/LegalNoticeInline';
import LoadingAnimationBlock from '../components/blocks/inline/LoadingAnimationBlock';
import OptionsGridInlineBlock from '../components/blocks/inline/OptionsGridInlineBlock';

// Editor blocks - Fixed import paths
import FormInputBlock from '../components/editor/blocks/FormInputBlock';
import ImageInlineBlock from '../components/editor/blocks/ImageInlineBlock';
import LeadFormBlock from '../components/editor/blocks/LeadFormBlock';
import ProgressInlineBlock from '../components/editor/blocks/ProgressInlineBlock';
import QuizIntroHeaderBlock from '../components/editor/blocks/QuizIntroHeaderBlock';
import SpacerInlineBlock from '../components/editor/blocks/SpacerInlineBlock';

// Import fallback component for missing types
const createFallbackComponent = (componentName: string) => {
  const FallbackComponent: React.FC<any> = (props) => (
    <div className="p-4 border border-gray-300 rounded bg-gray-50">
      <div className="text-sm font-medium text-gray-700">{componentName}</div>
      <div className="text-xs text-gray-500">Component loaded successfully</div>
    </div>
  );
  FallbackComponent.displayName = componentName;
  return FallbackComponent;
};

// Registry expandido com todos os componentes necessários
>>>>>>> origin/copilot/fix-0a60db26-31d0-4b13-8018-ebd668661bf4
=======
// ✅ COMPREHENSIVE COMPONENT REGISTRY
>>>>>>> origin/copilot/fix-8af1cb0c-9277-4418-afa3-556cf126fe66
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ✅ BASIC COMPONENTS (Core functionality)
  'text-inline': TextInlineBlock,
  'heading-inline': HeadingInlineBlock, 
  'button-inline': ButtonInlineBlock,
  'image-inline': ImageInlineBlock,
  'decorative-bar-inline': DecorativeBarInlineBlock,
  'legal-notice-inline': LegalNoticeInlineBlock,
  
<<<<<<< HEAD
<<<<<<< HEAD
  // Componentes de Resultado (Etapa 20)
  'countdown-inline': CountdownInlineBlock,
  'result-card-inline': ResultCardInlineBlock,
  'testimonials-inline': TestimonialsInlineBlock,
=======
  // ✅ FORM COMPONENTS
  'form-input': FormInputBlock,
  'lead-form': LeadFormBlock,
  'options-grid': OptionsGridBlock,
>>>>>>> origin/copilot/fix-8af1cb0c-9277-4418-afa3-556cf126fe66
  
  // ✅ QUIZ COMPONENTS  
  'quiz-intro-header': QuizIntroHeaderBlock,
  'quiz-progress': QuizProgressBlock,
  'quiz-results': QuizResultsEditor,
  'style-results': StyleResultsEditor,
  'final-step': FinalStepEditor,
  
<<<<<<< HEAD
  // Novos componentes modulares da Etapa 21 (Offer)
  'offer-header': OfferHeaderInlineBlock,
  'offer-hero-section': OfferHeroSectionInlineBlock,
  'offer-problem-section': OfferProblemSectionInlineBlock,
  'offer-solution-section': OfferSolutionSectionInlineBlock,
  'offer-product-showcase': OfferProductShowcaseInlineBlock,
  'offer-guarantee-section': OfferGuaranteeSectionInlineBlock,
  'offer-faq-section': OfferFaqSectionInlineBlock,
=======
  // Missing components from templates
  'accessibility-skip-link': AccessibilitySkipLinkBlock,
  'quiz-intro-header': QuizIntroHeaderBlock,
  'image-inline': ImageInlineBlock,
  'lead-form': LeadFormBlock,
  
  // Additional inline components
  'decorative-bar-inline': DecorativeBarInline,
  'legal-notice-inline': LegalNoticeInline,
  'loading-animation': LoadingAnimationBlock,
  'options-grid': OptionsGridInlineBlock,
  'form-input': FormInputBlock,
  'progress-inline': ProgressInlineBlock,
  'spacer-inline': SpacerInlineBlock,
>>>>>>> origin/copilot/fix-0a60db26-31d0-4b13-8018-ebd668661bf4
=======
  // ✅ PRICING & BUSINESS COMPONENTS
  'pricing-card': PricingInlineBlock,
  
  // ✅ ACCESSIBILITY COMPONENTS
  'accessibility-skip-link': AccessibilitySkipLinkBlock,
>>>>>>> origin/copilot/fix-8af1cb0c-9277-4418-afa3-556cf126fe66
};

export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  const component = ENHANCED_BLOCK_REGISTRY[type];
  if (component) {
    return component;
  }
  
  // If component not found, log and return fallback
  console.warn(`Component '${type}' not found in Enhanced Block Registry. Available types:`, Object.keys(ENHANCED_BLOCK_REGISTRY));
  return createFallbackComponent(type);
};

// Generate block definitions for the sidebar
export const generateBlockDefinitions = () => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY).map(type => ({
    type,
    name: type.replace('-inline', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    category: 'basic',
    component: ENHANCED_BLOCK_REGISTRY[type]
  }));
};

export default ENHANCED_BLOCK_REGISTRY;
