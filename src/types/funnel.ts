import { EditorBlock } from './editor';
import type { FunnelContext } from '@/core/contexts/FunnelContext';
import type { Block } from '@/types/editor';

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

// Add missing FunnelStepProps interface
export interface FunnelStepProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  stepNumber?: number;
  totalSteps?: number;
  isEditable?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onEdit?: () => void;
  data?: any;
}

export type FunnelStepType =
  | 'intro'
  | 'name-collect'
  | 'quiz-intro'
  | 'question-multiple'
  | 'quiz-transition'
  | 'processing'
  | 'result-intro'
  | 'result-details'
  | 'result-guide'
  | 'offer-transition'
  | 'offer-page';

// Contextual Funnel Data for editor persistence - compatible with UnifiedFunnelData
export interface ContextualFunnelData {
  id: string;
  name: string;
  description?: string;
  userId?: string;
  pages?: any[];
  steps?: FunnelStep[];
  theme?: FunnelTheme;
  settings?: FunnelSettings;
  context?: any; // Accept any to be compatible with both string and FunnelContext
  isPublished?: boolean;
  version?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

// Canonical metadata types (centralized)
export interface FunnelMetadata {
  id: string;
  name: string;
  userId?: string;
  type: 'quiz' | 'lead-gen' | 'survey' | 'other';
  category?: string;
  context?: FunnelContext;
  templateId?: string;
  status: 'draft' | 'published' | 'archived';
  config?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateFunnelInput {
  name: string;
  type?: FunnelMetadata['type'];
  category?: string;
  context?: FunnelContext;
  templateId?: string;
  status?: FunnelMetadata['status'];
  config?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UpdateFunnelInput {
  name?: string;
  type?: FunnelMetadata['type'];
  category?: string;
  status?: FunnelMetadata['status'];
  config?: Record<string, any>;
  settings?: Record<string, any>; // Alias for config
  metadata?: Record<string, any>;
  isActive?: boolean;
}

export interface ComponentInstance {
  id: string;
  funnelId: string;
  stepKey: string;
  blockId: string;
  blockType: string;
  order: number;
  properties: Record<string, any>;
  content: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface FunnelWithComponents {
  funnel: FunnelMetadata;
  components: Record<string, Block[]>; // stepKey → blocks
}

export type UnifiedFunnelData = FunnelWithComponents & { id: string; name: string };
