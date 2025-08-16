// BlockType utility for type casting
import { BlockType as EditorBlockType } from './editor';

export const isValidBlockType = (type: string): type is EditorBlockType => {
  const validTypes: EditorBlockType[] = [
    'headline',
    'text',
    'image',
    'button',
    'spacer',
    'text-inline',
    'image-inline',
    'image-display-inline',
    'badge-inline',
    'progress-inline',
    'stat-inline',
    'countdown-inline',
    'spacer-inline',
    'heading-inline',
    'button-inline',
    'input-field',
    'form-input',
    'legal-notice-inline',
    'quiz-intro-header',
    'quiz-start-page-inline',
    'quiz-question-inline',
    'quiz-result-inline',
    'quiz-offer-cta-inline',
    'step-header-inline',
    'step01-intro',
    'style-result',
    'style-card-inline',
    'result-card-inline',
    'result-header-inline',
    'secondary-styles',
    'secondaryStylesTitle',
    'two-column',
    'form-container',
    'options-grid',
    'hero-section',
    'hero',
    'header',
    'carousel',
    'decorative-bar-inline',
    'accessibility-skip-link',
    'animation-block',
    'loading-animation',
    'benefits',
    'benefitsList',
    'testimonials',
    'testimonial',
    'testimonial-card-inline',
    'testimonialsSection',
    'pricing',
    'pricing-card-inline',
    'guarantee',
    'cta',
    'offerHero',
    'products',
    'video',
    'icon',
    'faq',
    'custom-code'
  ];
  
  return validTypes.includes(type as EditorBlockType);
};

export const toBlockType = (type: string): EditorBlockType => {
  if (isValidBlockType(type)) {
    return type;
  }
  console.warn(`⚠️ Invalid BlockType: ${type}, defaulting to 'text'`);
  return 'text';
};

export type { EditorBlockType as BlockType };