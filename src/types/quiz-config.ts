export interface AutoAdvanceConfig {
  enabled: boolean;
  delay: number;
}

export interface ProgressConfig {
  showProgress?: boolean;
  showProgressPercentage?: boolean;
  showProgressStepInfo?: boolean;
  progressAnimationDuration?: number;
  progressBarHeight?: number | string;
  progressBackgroundColor?: string;
}

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  spacingUnit?: number;
  fontFamily?: string;
}

export interface QuestionConfig {
  requiredSelections?: number;
  autoAdvance?: AutoAdvanceConfig | boolean;
  strategicAutoAdvance?: boolean;
  strategicAutoAdvanceDelay?: number;
}

export interface LayoutConfig {
  columns?: number | 'auto' | string;
  imageSize?: number;
  gridGap?: number;
  showImages?: boolean;
  imagePosition?: 'top' | 'left' | 'right';
  showShadows?: boolean;
}

export interface QuizConfig extends ThemeConfig, ProgressConfig, QuestionConfig {
  allowRealTimeEditing?: boolean;
  realTimeSync?: boolean;
  autoSave?: boolean;
  // Permite outras chaves desconhecidas sem quebrar TS no curto prazo
  [key: string]: unknown;
}

export interface ProcessedOptionsConfig extends LayoutConfig, ThemeConfig {
  options?: Array<{ id?: string; text?: string; imageUrl?: string; value?: string }>;
}


