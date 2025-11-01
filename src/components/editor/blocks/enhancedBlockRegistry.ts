// Enhanced Block Registry - Centralized registry for all enhanced blocks
// This module provides a unified interface for block type management

export type BlockType = 'headline' | 'text' | 'image' | 'benefits' | 'quiz-options';

export interface BlockTypeConfig {
  type: BlockType;
  label: string;
  icon: string;
}

export const blockRegistry: Record<BlockType, BlockTypeConfig> = {
  headline: { type: 'headline', label: 'Headline', icon: '📝' },
  text: { type: 'text', label: 'Text', icon: '📄' },
  image: { type: 'image', label: 'Image', icon: '🖼️' },
  benefits: { type: 'benefits', label: 'Benefits', icon: '✨' },
  'quiz-options': { type: 'quiz-options', label: 'Quiz Options', icon: '📋' },
};

export default blockRegistry;