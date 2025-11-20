import React from 'react';
import UnifiedHeaderBlock from './UnifiedHeaderBlock';
import { InlineBlockProps } from '@/types/InlineBlockProps';

/**
 * 🎯 VARIANT WRAPPERS - Específicos para cada tipo de header
 * Facilitam importação e configuração automática de variantes
 */

export const QuizIntroHeaderBlock: React.FC<InlineBlockProps> = props => (
  <UnifiedHeaderBlock {...props} variant="quiz-intro" />
);

export const QuizResultHeaderBlock: React.FC<InlineBlockProps> = props => (
  <UnifiedHeaderBlock {...props} variant="quiz-result" />
);

export const OfferHeaderBlock: React.FC<InlineBlockProps> = props => (
  <UnifiedHeaderBlock {...props} variant="offer-hero" />
);

export const VerticalCanvasHeaderBlock: React.FC<InlineBlockProps> = props => (
  <UnifiedHeaderBlock {...props} variant="vertical-canvas" />
);

export const GenericHeaderBlock: React.FC<InlineBlockProps> = props => (
  <UnifiedHeaderBlock {...props} variant="generic" />
);

// Re-export do componente principal
export { default as UnifiedHeaderBlock } from './UnifiedHeaderBlock';
