
export interface Quiz {
  id: string;
  created_at?: string;
  title: string;
  description?: string;
  user_id?: string;
}

export interface Question {
  id: string;
  title: string;
  question?: string;
  type: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  multiSelect?: boolean;
}

export interface QuizQuestion {
  id: string;
  created_at?: string;
  quiz_id?: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: string[];
  points?: number;
  time_limit?: number;
  required?: boolean;
  explanation?: string;
  hint?: string;
  media_url?: string;
  media_type?: string;
  tags?: string[];
  order_index?: number;
}

export interface UserResponse {
  questionId: string;
  answerIds: string[];
}

// StyleResult is a string type representing the style name
export type StyleResult = string;

export interface StyleData {
  name: string;
  description: string;
  image?: string;
  recommendations?: string[];
  additionalStyles?: string[];
}

export interface ResultPageConfig {
  styleType: string;
  headerSection: {
    title: string;
    subtitle: string;
    image?: string;
  };
  primaryStyleSection: {
    title: string;
    description: string;
    image?: string;
  };
  secondaryStylesSection?: {
    title: string;
    styles: {
      name: string;
      description: string;
      image?: string;
    }[];
  };
  offerSection?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image?: string;
  };
}

// Add missing types for editor components
export interface QuizConfig {
  title?: string;
  description?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
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
    | "title"
    | "subtitle"
    | "text"
    | "paragraph"
    | "image"
    | "button"
    | "spacer"
    | "input"
    | "email"
    | "phone"
    | "options"
    | "progress"
    | "logo"
    | "video"
    | "testimonial"
    | "price"
    | "countdown"
    | "guarantee"
    | "bonus"
    | "faq"
    | "social-proof"
    | "text-inline"
    | "badge-inline"
    | "stat-inline"
    | "progress-inline"
    | "image-display"
    | "style-card"
    | "pricing-card"
    | "testimonial-card"
    | "result-card"
    | "countdown-inline"
    | "pricing-inline";
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
    alignment?: "left" | "center" | "right";
    size?: "small" | "medium" | "large";
    [key: string]: any;
  };
  style: {
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right";
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
    | "intro"
    | "question"
    | "loading"
    | "result"
    | "offer"
    | "transition"
    | "sales"
    | "checkout"
    | "upsell"
    | "thankyou"
    | "webinar"
    | "launch";
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
  description?: string;
  pages: SimplePage[];
  variants?: QuizVariant[];
  updatedAt?: string;
  createdAt?: string;
}

export interface QuizVersion {
  id: string;
  version: number;
  createdAt: string;
  changes: string[];
  data: any;
}

export interface Version {
  id: string;
  name: string;
  description: string;
  timestamp: number;
  createdAt: string;
  data: QuizFunnel;
}

export type ComponentType = SimpleComponent['type'];
