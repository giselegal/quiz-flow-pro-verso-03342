/**
 * Comprehensive Quiz Types - Master Interface Definition
 *
 * This file consolidates all quiz-related types based on the quiz21StepsComplete.ts
 * template analysis and extends the existing type definitions.
 */

// Re-export existing style types
export type {
  StyleType,
  Style,
  QuizOption as LegacyQuizOption,
  QuizQuestion as LegacyQuizQuestion,
  QuizComponentStyle,
} from './quiz';

// ============================================================================
// Enhanced Core Quiz Interfaces
// ============================================================================

export interface Quiz {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
  settings: QuizSettings;
  template?: Template;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  stepTemplates: Record<string, StepTemplate>;
  globalSettings: TemplateSettings;
}

export interface StepTemplate {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  type: StepType;
  blocks: Block[];
  defaultProperties?: Record<string, any>;
}

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  content: BlockContent;
  properties: BlockProperties;
}

export interface Step {
  id: string;
  stepNumber: number;
  name: string;
  type: StepType;
  progress: number;
  blocks: Block[];
  navigation: StepNavigation;
  validation?: StepValidation;
  analytics?: StepAnalytics;
}

export interface Option {
  id: string;
  text: string;
  value?: string;
  imageUrl?: string;
  category?: string;
  styleCategory?: string;
  points?: Record<string, number>;
  segment?: string;
  goal?: string;
}

export interface Result {
  id: string;
  userId?: string;
  quizId: string;
  styleCategory: string;
  primaryStyle: string;
  secondaryStyles?: string[];
  scores: Record<string, number>;
  percentages: Record<string, number>;
  userAnswers: UserAnswer[];
  completedAt: Date;
  totalScore: number;
  recommendation?: string;
}

// ============================================================================
// Supporting Types
// ============================================================================

export type StepType = 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer';

export type BlockType =
  // Core blocks
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'spacer'

  // Quiz specific blocks
  | 'quiz-intro-header'
  | 'options-grid'
  | 'form-container'
  | 'quiz-question'
  | 'quiz-result'
  | 'style-result'

  // Layout blocks
  | 'text-inline'
  | 'image-display-inline'
  | 'badge-inline'
  | 'progress-inline';

export interface BlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  question?: string;
  text?: string;
  placeholder?: string;
  buttonText?: string;
  options?: Option[];
  imageUrl?: string;
  alt?: string;
  [key: string]: any;
}

export interface BlockProperties {
  // Layout properties
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  boxShadow?: string;

  // Typography properties
  fontSize?: string;
  fontWeight?: string;
  color?: string;

  // Quiz specific properties
  showImages?: boolean;
  columns?: number;
  requiredSelections?: number;
  maxSelections?: number;
  minSelections?: number;
  multipleSelection?: boolean;
  autoAdvanceOnComplete?: boolean;
  autoAdvanceDelay?: number;

  // Selection and validation
  questionId?: string;
  enableButtonOnlyWhenValid?: boolean;
  showValidationFeedback?: boolean;
  validationMessage?: string;
  progressMessage?: string;
  showSelectionCount?: boolean;

  // Styling
  selectionStyle?: 'border' | 'background' | 'shadow';
  selectedColor?: string;
  hoverColor?: string;
  gridGap?: number;
  responsiveColumns?: boolean;

  // Animation
  animation?: string;
  animationDuration?: string;

  // Score values for quiz logic
  scoreValues?: Record<string, number>;

  [key: string]: any;
}

export interface StepNavigation {
  canGoBack?: boolean;
  canGoForward?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  nextStepId?: string;
  previousStepId?: string;
}

export interface StepValidation {
  isRequired?: boolean;
  minSelections?: number;
  maxSelections?: number;
  customRules?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface StepAnalytics {
  trackingId?: string;
  events?: AnalyticsEvent[];
  goals?: string[];
}

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export interface QuizSettings {
  title: string;
  description?: string;

  // Scoring configuration
  scoring: {
    normalQuestionPoints: number;
    strategicQuestionPoints: number;
    autoAdvanceNormal: boolean;
    autoAdvanceStrategic: boolean;
    normalSelectionLimit: number;
    strategicSelectionLimit: number;
  };

  // Results configuration
  results: {
    showUserName: boolean;
    showPrimaryStyle: boolean;
    showSecondaryStyles: boolean;
    showPercentages: boolean;
    showStyleImages: boolean;
    showStyleGuides: boolean;
  };

  // SEO and meta
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Analytics
  analytics?: {
    facebookPixelId?: string;
    googleAnalyticsId?: string;
    utmParams?: Record<string, string>;
  };

  // Appearance
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

export interface TemplateSettings {
  meta: {
    name: string;
    description: string;
    version: string;
    author: string;
  };

  design: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;

    button: {
      background: string;
      textColor: string;
      borderRadius: string;
      shadow: string;
    };

    animations: {
      questionTransition: string;
      optionSelect: string;
      button: string;
    };
  };

  logic: {
    selection: {
      normal: string;
      strategic: string;
    };

    calculation: {
      method: string;
      resultado: string;
    };

    transitions: {
      betweenSteps: string;
      toResult: string;
    };
  };
}

export interface UserAnswer {
  stepId: string;
  questionId: string;
  selectedOptions: string[];
  selectedOptionDetails: {
    id: string;
    text: string;
    category?: string;
    styleCategory?: string;
    points?: Record<string, number>;
  }[];
  answeredAt: Date;
  timeSpent?: number;
}

// ============================================================================
// State Management Types
// ============================================================================

export interface QuizState {
  currentStepId: string;
  currentStepNumber: number;
  totalSteps: number;
  userName?: string;
  userAnswers: UserAnswer[];
  scores: Record<string, number>;
  progress: number;
  isCompleted: boolean;
  result?: Result;
  sessionData: Record<string, any>;
}

export interface QuizNavigation {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface QuizStateHook {
  state: QuizState;
  updateState: (updates: Partial<QuizState>) => void;
  resetState: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

export interface QuizNavigationHook {
  navigation: QuizNavigation;
  goToStep: (stepNumber: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  canAdvance: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface QuizValidationHook {
  validateStep: (stepId: string, answers: UserAnswer[]) => ValidationResult;
  validateAnswer: (answer: UserAnswer) => ValidationResult;
  getStepErrors: (stepId: string) => string[];
  isStepValid: (stepId: string) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface QuizAnalyticsHook {
  trackEvent: (event: AnalyticsEvent) => void;
  trackStepStart: (stepId: string) => void;
  trackStepComplete: (stepId: string, answers: UserAnswer[]) => void;
  trackQuizComplete: (result: Result) => void;
  getAnalytics: () => AnalyticsData;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  sessionDuration: number;
  stepTimings: Record<string, number>;
  completionRate: number;
}

// ============================================================================
// Editor Types (for the editor interface)
// ============================================================================

export interface EditorQuiz extends Quiz {
  isEditing?: boolean;
  isDraft?: boolean;
  lastSaved?: Date;
}

export interface EditorBlock extends Block {
  isSelected?: boolean;
  isEditing?: boolean;
  isDragging?: boolean;
}

export interface EditorStep extends Step {
  isActive?: boolean;
  hasErrors?: boolean;
  errorCount?: number;
}
