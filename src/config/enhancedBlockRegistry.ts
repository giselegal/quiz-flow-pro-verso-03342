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
