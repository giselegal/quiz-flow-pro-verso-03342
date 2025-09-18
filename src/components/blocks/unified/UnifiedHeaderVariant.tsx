import React from 'react';
import UnifiedHeaderBlock from './UnifiedHeaderBlock';
import { BlockComponentProps } from '@/types/blocks';

/**
 * 🎯 VARIANT WRAPPERS - Específicos para cada tipo de header
 * Facilitam importação e configuração automática de variantes
 */

export const QuizIntroHeaderBlock: React.FC<BlockComponentProps> = props => (
  <UnifiedHeaderBlock {...props} variant="quiz-intro" />
);

export const QuizResultHeaderBlock: React.FC<BlockComponentProps> = props => (
  <UnifiedHeaderBlock {...props} variant="quiz-result" />
);

export const OfferHeaderBlock: React.FC<BlockComponentProps> = props => (
  <UnifiedHeaderBlock {...props} variant="offer-hero" />
);

export const VerticalCanvasHeaderBlock: React.FC<BlockComponentProps> = props => (
  <UnifiedHeaderBlock {...props} variant="vertical-canvas" />
);

export const GenericHeaderBlock: React.FC<BlockComponentProps> = props => (
  <UnifiedHeaderBlock {...props} variant="generic" />
);

// Re-export do componente principal
export { default as UnifiedHeaderBlock } from './UnifiedHeaderBlock';
