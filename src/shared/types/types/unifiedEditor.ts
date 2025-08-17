import { QuizComponentData } from './quizBuilder';
import { Block } from './editor';

export interface UnifiedEditorState {
  activeTab: 'quiz' | 'result' | 'sales';
  isPreviewing: boolean;
  quizEditorState: {
    components: QuizComponentData[];
    stages: any[];
    previewMode?: boolean;
  };
  resultEditorState: {
    config: any;
    blocks: Block[];
  };
  salesEditorState: {
    blocks: Block[];
  };
}

export interface ResultPageConfig {
  styleType: string;
  title?: string;
  header: {
    visible: boolean;
    content: Record<string, any>;
  };
  mainContent: {
    visible: boolean;
    content: Record<string, any>;
  };
  offer: {
    hero: {
      visible: boolean;
      content: Record<string, any>;
    };
    benefits: {
      visible: boolean;
      content: Record<string, any>;
    };
    products: {
      visible: boolean;
      content: Record<string, any>;
    };
    pricing: {
      visible: boolean;
      content: Record<string, any>;
    };
    testimonials: {
      visible: boolean;
      content: Record<string, any>;
    };
    guarantee: {
      visible: boolean;
      content: Record<string, any>;
    };
  };
}
