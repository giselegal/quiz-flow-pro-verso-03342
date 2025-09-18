// Simplified exports - only working components
// This file is kept minimal to avoid build errors

// Block components that actually exist
export { default as QuizResultCalculatedBlock } from './QuizResultCalculatedBlock';
export { default as UniversalBlockRenderer } from './UniversalBlockRenderer';
export type { UniversalBlockRendererProps } from './UniversalBlockRenderer';

// Novos componentes da Gisele Galvão
export { default as MentorSectionInlineBlock } from './MentorSectionInlineBlock';
export { default as TestimonialCardInlineBlock } from './TestimonialCardInlineBlock';
export { default as TestimonialsCarouselInlineBlock } from './TestimonialsCarouselInlineBlock';

// Export empty object to make this a valid module
export { };
