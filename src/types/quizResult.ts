// import { StyleResult } from './quiz';

export interface ResultPageBlock {
  id: string;
  type:
    | 'title'
    | 'subtitle'
    | 'styleResult'
    | 'image'
    | 'text'
    | 'cta'
    | 'testimonial'
    | 'bonus'
    | 'guarantee'
    | 'carousel';
  content: string;
  imageUrl?: string;
  order: number;
  settings?: Record<string, any>;
  abTestVariant?: string;
  isVisible?: boolean;

  // Additional properties for specific block types
  styleCategory?: string;
  percentage?: number;
  description?: string;
  buttonText?: string;
  url?: string;
  pixelId?: string;
  backgroundColor?: string;
  textColor?: string;
  author?: string;
  authorImage?: string;
  rating?: number;
  items?: Array<{
    id: string;
    imageUrl: string;
    caption?: string;
  }>;
}

export interface StyleResultBlock extends ResultPageBlock {
  type: 'styleResult';
  styleCategory: string;
  percentage?: number;
  description?: string;
}

export interface CTABlock extends ResultPageBlock {
  type: 'cta';
  buttonText: string;
  url: string;
  pixelId?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface TestimonialBlock extends ResultPageBlock {
  type: 'testimonial';
  author: string;
  authorImage?: string;
  rating?: number;
}

export interface CarouselBlock extends ResultPageBlock {
  type: 'carousel';
  items: {
    id: string;
    imageUrl: string;
    caption?: string;
  }[];
}

export interface ResultPage {
  id: string;
  title: string;
  blocks: ResultPageBlock[];
  settings: {
    backgroundColor?: string;
    backgroundImage?: string;
    fontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
    showSecondaryStyles?: boolean;
    abTestEnabled?: boolean;
    abTestVariants?: string[];
  };
}

export interface OfferPage {
  id: string;
  title: string;
  blocks: ResultPageBlock[];
  settings: {
    backgroundColor?: string;
    backgroundImage?: string;
    fontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
    abTestEnabled?: boolean;
    abTestVariants?: string[];
  };
}

export interface QuizFunnel {
  id: string;
  name: string;
  quizQuestions: string[];
  resultPage: ResultPage;
  offerPage?: OfferPage;
  createdAt: Date;
  updatedAt: Date;
}
