
import { EditorBlock } from './editor';

export interface FunnelStep {
  id: string;
  type: 'quiz-question' | 'result-page' | 'offer-page' | 'form' | 'content';
  title: string;
  blocks: EditorBlock[];
  settings?: {
    showProgressBar?: boolean;
    autoAdvance?: boolean;
    timeLimit?: number;
  };
}

export interface FunnelTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface FunnelSettings {
  showProgressBar: boolean;
  autoAdvance: boolean;
  enableHistory: boolean;
  analyticsEnabled: boolean;
}

export interface FunnelConfig {
  steps: FunnelStep[];
  theme: FunnelTheme;
  settings: FunnelSettings;
}

export interface FunnelStepConfig extends FunnelStep {
  // Extended configuration for steps
  validation?: {
    required?: boolean;
    minAnswers?: number;
    maxAnswers?: number;
  };
  navigation?: {
    allowBack?: boolean;
    allowSkip?: boolean;
  };
}
