import React from 'react';

// ✅ MISSING COMPONENTS - Fix Import Paths
import AccessibilitySkipLinkBlock from '../components/blocks/inline/AccessibilitySkipLinkBlock';
import QuizIntroHeaderBlock from '../components/editor/blocks/QuizIntroHeaderBlock';
import ImageInlineBlock from '../components/editor/blocks/ImageInlineBlock';
import LeadFormBlock from '../components/editor/blocks/LeadFormBlock';

// ✅ EXISTING COMPONENTS - Fix Import Paths  
import TextInlineBlock from '../components/editor/blocks/TextInlineBlock';
import HeadingInlineBlock from '../components/editor/blocks/HeadingInlineBlock';
import ButtonInlineBlock from '../components/editor/blocks/ButtonInlineBlock';
import DecorativeBarInlineBlock from '../components/editor/blocks/DecorativeBarInlineBlock';
import LegalNoticeInlineBlock from '../components/editor/blocks/LegalNoticeInlineBlock';
import FormInputBlock from '../components/editor/blocks/FormInputBlock';
import OptionsGridBlock from '../components/editor/blocks/OptionsGridBlock';

// ✅ ADDITIONAL INLINE COMPONENTS
import PricingInlineBlock from '../components/editor/blocks/PricingInlineBlock';
import QuizProgressBlock from '../components/editor/blocks/QuizProgressBlock';
import QuizResultsEditor from '../components/editor/blocks/QuizResultsEditor';
import StyleResultsEditor from '../components/editor/blocks/StyleResultsEditor';
import FinalStepEditor from '../components/editor/blocks/FinalStepEditor';

// ✅ COMPREHENSIVE COMPONENT REGISTRY
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ✅ BASIC COMPONENTS (Core functionality)
  'text-inline': TextInlineBlock,
  'heading-inline': HeadingInlineBlock, 
  'button-inline': ButtonInlineBlock,
  'image-inline': ImageInlineBlock,
  'decorative-bar-inline': DecorativeBarInlineBlock,
  'legal-notice-inline': LegalNoticeInlineBlock,
  
  // ✅ FORM COMPONENTS
  'form-input': FormInputBlock,
  'lead-form': LeadFormBlock,
  'options-grid': OptionsGridBlock,
  
  // ✅ QUIZ COMPONENTS  
  'quiz-intro-header': QuizIntroHeaderBlock,
  'quiz-progress': QuizProgressBlock,
  'quiz-results': QuizResultsEditor,
  'style-results': StyleResultsEditor,
  'final-step': FinalStepEditor,
  
  // ✅ PRICING & BUSINESS COMPONENTS
  'pricing-card': PricingInlineBlock,
  
  // ✅ ACCESSIBILITY COMPONENTS
  'accessibility-skip-link': AccessibilitySkipLinkBlock,
};

export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return ENHANCED_BLOCK_REGISTRY[type] || null;
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
