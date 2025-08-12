// @ts-nocheck
export type QuizComponentType =
  | 'header'
  | 'section'
  | 'columns'
  | 'headline'
  | 'text'
  | 'image'
  | 'multipleChoice'
  | 'singleChoice'
  | 'scale'
  | 'openEnded'
  | 'date'
  | 'benefitsList'
  | 'faq'
  | 'quizResult'
  | 'stageCover'
  | 'stageQuestion'
  | 'stageResult'
  | 'button'
  | 'choice'
  | 'result'
  | 'divider'
  | 'spacer'
  | 'video'
  | 'cta';

export interface QuizComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  paddingY?: string;
  paddingX?: string;
  // Add any other style properties here
}

export interface QuizStage {
  id: string;
  title: string;
  order: number;
  type: 'cover' | 'question' | 'result' | 'strategic' | 'welcome';
  isEnabled?: boolean;
  componentId?: string;
  config?: Record<string, any>; // Add config property to fix errors
}

export interface QuizComponentLayout {
  columns: 1 | 2 | 3 | 4;
  direction: 'vertical' | 'horizontal';
}

export interface QuizComponentData {
  id: string;
  type: QuizComponentType;
  order: number;
  stageId?: string;
  content?: any;
  data?: {
    [key: string]: any;
    title?: string;
    subtitle?: string;
    text?: string;
    imageUrl?: string;
    alt?: string;
    question?: string;
    options?: string[];
    stageTitle?: string;
    stageNumber?: number;

    // Question properties
    autoAdvance?: boolean;
    minSelections?: number;
    maxSelections?: number;
    multiSelect?: number;
    required?: boolean;
    displayType?: 'text' | 'image' | 'both';
    imageSize?: 'small' | 'medium' | 'large';
    layout?: QuizComponentLayout;
    optionImages?: string[];
    optionStyleCategories?: string[];
    backgroundColorQuestion?: string;
    textColorQuestion?: string;
    selectionIndicator?: 'border' | 'checkbox' | 'highlight';

    // Cover properties
    buttonText?: string;
    backgroundColor?: string;
    textColor?: string;

    // Result properties
    resultLayout?: 'classic' | 'modern' | 'minimal';
    primaryStyleTitle?: string;
    secondaryStylesTitle?: string;
    showPercentages?: boolean;
    showDescriptions?: boolean;
    callToActionText?: string;
    callToActionUrl?: string;
    offerImageUrl?: string;
    authorImageUrl?: string;
    accentColor?: string;
  };
  style?: QuizComponentStyle;
}

export interface QuizBuilderState {
  components: QuizComponentData[];
  stages: QuizStage[];
  activeStageId?: string;
}

export interface QuizTemplate {
  id: string;
  title: string;
  type: string;
  progress: number;
  multiSelect?: number;
  blocks: any[];
  validationRules?: any;
  scoringEnabled?: boolean;
}
