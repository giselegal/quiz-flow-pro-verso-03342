
/**
 * Mapeamento dos blocos do editor para seus respectivos componentes
 * 
 * Este arquivo mapeia os tipos de bloco para os componentes React que os renderizam.
 * Atualizado para incluir todos os componentes do sistema.
 */

import { ComponentType } from 'react';

// Blocos básicos do editor
import HeaderBlock from '@/components/editor/blocks/HeaderBlock';
import TextBlock from '@/components/editor/blocks/TextBlock';
import ImageBlock from '@/components/editor/blocks/ImageBlock';
import ButtonBlock from '@/components/editor/blocks/ButtonBlock';
import SpacerBlock from '@/components/editor/blocks/SpacerBlock';
import RichTextBlock from '@/components/editor/blocks/RichTextBlock';

// Blocos de quiz e resultado
import QuizStepBlock from '@/components/editor/blocks/QuizStepBlock';
import QuizStartPageBlock from '@/components/editor/blocks/QuizStartPageBlock';
import QuizQuestionBlock from '@/components/editor/blocks/QuizQuestionBlock';
import QuizQuestionBlockConfigurable from '@/components/editor/blocks/QuizQuestionBlockConfigurable';
import QuizResultCalculatedBlock from '@/components/editor/blocks/QuizResultCalculatedBlock';

// Blocos de estrutura e layout
import TwoColumnBlock from '@/components/editor/blocks/TwoColumnBlock';
import VideoBlock from '@/components/editor/blocks/VideoBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';

// Blocos de vendas e conversão
import BenefitsBlock from '@/components/editor/blocks/BenefitsBlock';
import TestimonialsBlock from '@/components/editor/blocks/TestimonialsBlock';
import PricingBlock from '@/components/editor/blocks/PricingBlock';
import GuaranteeBlock from '@/components/editor/blocks/GuaranteeBlock';
import CTABlock from '@/components/editor/blocks/CTABlock';

// Blocos especiais
import StyleResultBlock from '@/components/editor/blocks/StyleResultBlock';
import SecondaryStylesBlock from '@/components/editor/blocks/SecondaryStylesBlock';
import HeadlineBlock from '@/components/editor/blocks/HeadlineBlock';

export const EDITOR_BLOCKS_MAP: Record<string, ComponentType<any>> = {
  // Blocos básicos
  'header': HeaderBlock,
  'headline': HeadlineBlock,
  'text': TextBlock,
  'image': ImageBlock,
  'button': ButtonBlock,
  'spacer': SpacerBlock,
  'rich-text': RichTextBlock,
  
  // Blocos de estrutura
  'two-column': TwoColumnBlock,
  'video': VideoBlock,
  'options-grid': OptionsGridBlock,
  
  // Blocos de quiz e resultado
  'quiz-step': QuizStepBlock,
  'quiz-start-page': QuizStartPageBlock,
  'QuizStartPageBlock': QuizStartPageBlock,
  'quiz-question': QuizQuestionBlock,
  'QuizQuestionBlock': QuizQuestionBlock,
  'quiz-question-configurable': QuizQuestionBlockConfigurable,
  'QuizQuestionBlockConfigurable': QuizQuestionBlockConfigurable,
  'quiz-result-calculated': QuizResultCalculatedBlock,
  'QuizResultCalculatedBlock': QuizResultCalculatedBlock,
  
  // Blocos de vendas
  'benefits': BenefitsBlock,
  'testimonials': TestimonialsBlock,
  'pricing': PricingBlock,
  'guarantee': GuaranteeBlock,
  'cta': CTABlock,
  
  // Blocos especiais
  'style-result': StyleResultBlock,
  'secondary-styles': SecondaryStylesBlock,
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return blockType in EDITOR_BLOCKS_MAP;
};

// Helper para obter o componente de um tipo
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  return EDITOR_BLOCKS_MAP[blockType];
};

// Lista de tipos de bloco disponíveis
export const AVAILABLE_BLOCK_TYPES = Object.keys(EDITOR_BLOCKS_MAP);

// Categorias de blocos para organização na UI
export const BLOCK_CATEGORIES = {
  'content': {
    title: 'Conteúdo',
    blocks: ['header', 'headline', 'text', 'image', 'video', 'rich-text']
  },
  'layout': {
    title: 'Layout',
    blocks: ['two-column', 'spacer', 'options-grid']
  },
  'quiz': {
    title: 'Quiz',
    blocks: ['quiz-start-page', 'quiz-question', 'quiz-question-configurable', 'quiz-result-calculated']
  },
  'sales': {
    title: 'Vendas',
    blocks: ['benefits', 'testimonials', 'pricing', 'guarantee', 'cta']
  },
  'interactive': {
    title: 'Interativo',
    blocks: ['button', 'quiz-step']
  },
  'special': {
    title: 'Especiais',
    blocks: ['style-result', 'secondary-styles']
  }
};
