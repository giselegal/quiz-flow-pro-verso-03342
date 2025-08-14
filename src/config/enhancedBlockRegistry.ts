import React from 'react';

// Imports básicos primeiro
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import HeadingInline from '../components/blocks/inline/HeadingInline';
import TextInline from '../components/blocks/inline/TextInline';

// Imports dos componentes que estavam faltando
import AccessibilitySkipLinkBlock from '../components/blocks/inline/AccessibilitySkipLinkBlock';
import DecorativeBarInline from '../components/blocks/inline/DecorativeBarInline';
import LegalNoticeInline from '../components/blocks/inline/LegalNoticeInline';
import LoadingAnimationBlock from '../components/blocks/inline/LoadingAnimationBlock';
import OptionsGridInlineBlock from '../components/blocks/inline/OptionsGridInlineBlock';

// Editor blocks
import FormInputBlock from '../components/editor/blocks/FormInputBlock';
import ImageInlineBlock from '../components/editor/blocks/ImageInlineBlock';
import LeadFormBlock from '../components/editor/blocks/LeadFormBlock';
import ProgressInlineBlock from '../components/editor/blocks/ProgressInlineBlock';
import QuizIntroHeaderBlock from '../components/editor/blocks/QuizIntroHeaderBlock';
import SpacerInlineBlock from '../components/editor/blocks/SpacerInlineBlock';

// Registry expandido com todos os componentes necessários
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  'text-inline': TextInline,
  'heading-inline': HeadingInline,
  'button-inline': ButtonInlineFixed,
  
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
