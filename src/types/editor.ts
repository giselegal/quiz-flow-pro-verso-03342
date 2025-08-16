export interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
  properties: any;
}

export type BlockType = 
  | 'text-inline'
  | 'heading-inline' 
  | 'image-display-inline'
  | 'button-inline'
  | 'options-grid'
  | 'quiz-question-inline'
  | 'form-input-inline'
  | 'spacer-inline'
  | 'divider-inline'
  | 'video-inline'
  | 'audio-inline'
  | 'countdown-inline'
  | 'progress-bar-inline'
  | 'social-share-inline'
  | 'testimonial-inline'
  | 'faq-inline'
  | 'pricing-table-inline'
  | 'contact-form-inline'
  | 'newsletter-signup-inline'
  | 'code-block-inline';
