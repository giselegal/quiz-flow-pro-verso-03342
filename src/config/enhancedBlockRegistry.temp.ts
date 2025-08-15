import React from 'react';

// Imports básicos primeiro
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import HeadingInline from '../components/blocks/inline/HeadingInline';
import TextInline from '../components/blocks/inline/TextInline';

// Registry simplificado
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  'text-inline': TextInline,
  'heading-inline': HeadingInline,
  'button-inline': ButtonInlineFixed,
};

export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return ENHANCED_BLOCK_REGISTRY[type] || null;
};

export default ENHANCED_BLOCK_REGISTRY;
