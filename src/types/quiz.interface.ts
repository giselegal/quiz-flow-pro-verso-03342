export interface QuizConfig {
  domain: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  pixel: {
    facebookPixelId: string;
    googleAnalyticsId: string;
  };
  utm: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
    term: string;
  };
  scoring: {
    normalQuestionPoints: number;
    strategicQuestionPoints: number;
    autoAdvanceNormal: boolean;
    autoAdvanceStrategic: boolean;
    normalSelectionLimit: number;
    strategicSelectionLimit: number;
  };
  results: {
    showUserName: boolean;
    showPrimaryStyle: boolean;
    showSecondaryStyles: boolean;
    showPercentages: boolean;
    showStyleImages: boolean;
    showStyleGuides: boolean;
  };
}

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  value: string;
  category?: string;
  points?: {
    [styleName: string]: number;
  };
}

export interface BonusItem {
  id: string;
  title: string;
  value: string;
  description?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SimpleComponent {
  id: string;
  type:
    | 'title'
    | 'subtitle'
    | 'text'
    | 'paragraph'
    | 'image'
    | 'button'
    | 'spacer'
    | 'input'
    | 'email'
    | 'phone'
    | 'options'
    | 'progress'
    | 'logo'
    | 'video'
    | 'testimonial'
    | 'price'
    | 'countdown'
    | 'guarantee'
    | 'bonus'
    | 'faq'
    | 'social-proof'
    | 'text-inline'
    | 'badge-inline'
    | 'stat-inline'
    | 'progress-inline'
    | 'image-display'
    | 'style-card'
    | 'pricing-card'
    | 'testimonial-card'
    | 'result-card'
    | 'countdown-inline'
    | 'pricing-inline';
  data: {
    text?: string;
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    label?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    options?: QuizOption[];
    multiSelect?: boolean;
    hasImages?: boolean;
    progressValue?: number;
    showPercentage?: boolean;
    color?: string;
    backgroundColor?: string;
    videoUrl?: string;
    price?: string;
    originalPrice?: string;
    installments?: string;
    currency?: string;
    endDate?: string;
    title?: string;
    name?: string;
    role?: string;
    avatar?: string;
    testimonialAuthor?: string;
    testimonialRole?: string;
    testimonialImage?: string;
    guaranteeDays?: number;
    bonuses?: BonusItem[];
    bonusItems?: BonusItem[];
    faqs?: FaqItem[];
    faqItems?: FaqItem[];
    customerCount?: string;
    rating?: string;
    reviewCount?: string;
    socialProofCount?: number;
    socialProofText?: string;
    fontSize?: string;
    fontWeight?: string;
    variant?: string;
    maxSelections?: number;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
    [key: string]: any; // Allow additional properties
  };
  style: {
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    marginBottom?: string;
    borderRadius?: string;
    border?: string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    display?: string;
    gap?: string;
  };
}

export interface SimplePage {
  id: string;
  title: string;
  type:
    | 'intro'
    | 'question'
    | 'loading'
    | 'result'
    | 'offer'
    | 'transition'
    | 'sales'
    | 'checkout'
    | 'upsell'
    | 'thankyou'
    | 'webinar'
    | 'launch';
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: SimpleComponent[];
  questionType?: string;
  multiSelect?: number;
}

export interface ComponentProps {
  isSelected?: boolean;
  onClick?: () => void;
}

export interface QuizVariant {
  id: string;
  name: string;
  description: string;
  pages: SimplePage[];
  trafficPercent: number;
  isActive: boolean;
  createdAt?: string;
}

export interface QuizFunnel {
  id: string;
  name: string;
  pages: SimplePage[];
  variants?: QuizVariant[];
  updatedAt?: string;
  createdAt?: string;
}
// Versioning para QuizFunnel
export interface QuizVersion {
  id: string;
  version: number;
  createdAt: string;
  changes: string[];
  data: any;
}
