/**
 * Tipos base para componentes de funil reutilizáveis
 * Permite máxima flexibilidade e reutilização entre diferentes funis
 */

// Tipos de alinhamento comuns
export type Alignment = 'left' | 'center' | 'right';

// Tipos de tamanho comuns
export type Size = 'small' | 'medium' | 'large';

// Tipos de estilo de botão
export type ButtonStyle = 'primary' | 'secondary' | 'accent' | 'outline';

// Tipos de animação de loading
export type LoadingType = 'spinning' | 'elegant' | 'dots' | 'bars';

// Tipos de dispositivo para responsividade
export type DeviceView = 'mobile' | 'tablet' | 'desktop';

// Interface base para estilos customizáveis
export interface BaseStyles {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  className?: string;
}

// Interface base para props de estilo dos componentes
export interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
  customStyles?: string;
}

// Interface base para componentes que suportam diferentes visualizações
export interface ResponsiveProps {
  deviceView?: DeviceView;
  mobileStyles?: BaseStyles;
  tabletStyles?: BaseStyles;
  desktopStyles?: BaseStyles;
}

// Interface para opções de pergunta
export interface QuestionOption {
  id: string;
  text: string;
  value: string | number;
  imageUrl?: string;
  isCorrect?: boolean;
  weight?: number;
  category?: string;
  points?: number;
  styleCategory?: string;
}

// Interface para depoimentos
export interface Testimonial {
  id?: string;
  author: string;
  role?: string;
  text: string;
  rating?: number;
  avatar?: string;
  company?: string;
  location?: string;
}

// Interface para perguntas FAQ
export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

// Interface para bônus
export interface Bonus {
  id?: string;
  title: string;
  description: string;
  value: string;
  image?: string;
  isHighlighted?: boolean;
}

// Interface para recursos/features
export interface Feature {
  id?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode | string;
  isIncluded?: boolean;
}

// Interface para estatísticas/números sociais
export interface SocialStat {
  number: string;
  label: string;
  icon?: React.ReactNode | string;
}

// Interface para progresso
export interface ProgressConfig {
  showProgress: boolean;
  currentStep?: number;
  totalSteps?: number;
  progressValue?: number; // 0-100
  progressColor?: string;
  backgroundColor?: string;
}

// Interface para configurações de vídeo
export interface VideoConfig {
  videoUrl: string;
  caption?: string;
  thumbnail?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
}

// Interface para preços
export interface PriceConfig {
  originalPrice?: string;
  currentPrice: string;
  discount?: string;
  currency?: string;
  installments?: {
    quantity: number;
    value: string;
  };
  urgencyText?: string;
  highlightSavings?: boolean;
}

// Interface base para todos os componentes de bloco
export interface BlockComponentProps extends ResponsiveProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onInteraction?: (data: any) => void;
  isVisible?: boolean;
  animationDelay?: number;
  testId?: string;
}

// Callbacks comuns
export interface InteractionCallbacks {
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: (data: any) => void;
  onChange?: (value: any) => void;
  onValidation?: (isValid: boolean) => void;
  onError?: (error: string) => void;
}
