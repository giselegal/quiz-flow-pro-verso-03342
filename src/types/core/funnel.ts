/**
 * 🎯 CANONICAL FUNNEL TYPE DEFINITION
 * 
 * Fonte única de verdade para tipos de Funnel em todo o projeto.
 * 
 * @canonical
 */

import type { Block } from './block';
import type { QuizStep, QuizSettings } from './quiz';

// =============================================================================
// FUNNEL STATUS
// =============================================================================

export type FunnelStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export type FunnelType = 'quiz' | 'survey' | 'assessment' | 'lead-gen' | 'custom';

// =============================================================================
// FUNNEL STEP
// =============================================================================

export interface FunnelStep {
  id: string;
  order: number;
  name: string;
  type: string;
  description?: string;
  blocks: Block[];
  settings?: FunnelStepSettings;
  metadata?: Record<string, unknown>;
}

export interface FunnelStepSettings {
  showProgress?: boolean;
  showBackButton?: boolean;
  allowSkip?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  validation?: FunnelStepValidation;
}

export interface FunnelStepValidation {
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  customValidator?: string;
}

// =============================================================================
// FUNNEL CONFIG
// =============================================================================

export interface FunnelConfig {
  funnel?: {
    id?: string;
    name?: string;
    description?: string;
  };
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  behavior?: {
    showProgress?: boolean;
    showBackButton?: boolean;
    allowSkip?: boolean;
    autoSave?: boolean;
    autoSaveInterval?: number;
  };
  results?: {
    showScores?: boolean;
    showBreakdown?: boolean;
    redirectUrl?: string;
  };
  tracking?: TrackingConfig;
  theme?: FunnelTheme;
}

// =============================================================================
// TRACKING CONFIG
// =============================================================================

export interface TrackingConfig {
  enabled?: boolean;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customPixels?: PixelConfig[];
  events?: TrackingEvent[];
}

export interface PixelConfig {
  id: string;
  name: string;
  type: 'facebook' | 'google' | 'tiktok' | 'custom';
  pixelId: string;
  events?: string[];
}

export interface TrackingEvent {
  name: string;
  trigger: 'page_view' | 'step_complete' | 'quiz_complete' | 'custom';
  data?: Record<string, unknown>;
}

// =============================================================================
// FUNNEL THEME
// =============================================================================

export interface FunnelTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  buttonStyle?: 'solid' | 'outline' | 'ghost';
}

// =============================================================================
// FUNNEL METADATA
// =============================================================================

export interface FunnelMetadata {
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  author?: string;
  tags?: string[];
  category?: string;
  templateId?: string;
  analytics?: FunnelAnalytics;
}

export interface FunnelAnalytics {
  views?: number;
  starts?: number;
  completions?: number;
  conversionRate?: number;
  averageTime?: number;
  dropoffStep?: number;
}

// =============================================================================
// UNIFIED FUNNEL
// =============================================================================

export interface UnifiedFunnel {
  id: string;
  name: string;
  description?: string;
  type: FunnelType;
  status: FunnelStatus;
  version: number;
  
  // Content
  steps: FunnelStep[];
  config: FunnelConfig;
  
  // Settings
  settings?: QuizSettings;
  
  // Metadata
  metadata?: FunnelMetadata;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Owner
  userId?: string;
  
  // Flags
  isActive?: boolean;
  isTemplate?: boolean;
}

// =============================================================================
// FUNNEL DRAFT
// =============================================================================

export interface FunnelDraft {
  id: string;
  funnelId: string;
  userId: string;
  name: string;
  slug: string;
  version: number;
  status: 'draft' | 'pending_review' | 'approved';
  content: UnifiedFunnel;
  metadata?: FunnelMetadata;
  createdAt: string;
  updatedAt: string;
  lastValidatedAt?: string;
}

// =============================================================================
// FUNNEL PRODUCTION
// =============================================================================

export interface FunnelProduction {
  id: string;
  funnelId: string;
  draftId?: string;
  userId?: string;
  name: string;
  slug: string;
  version: number;
  status: 'published' | 'archived';
  content: UnifiedFunnel;
  metadata?: FunnelMetadata;
  isTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// =============================================================================
// PUBLICATION SETTINGS
// =============================================================================

export interface PublicationSettings {
  slug: string;
  isPublic: boolean;
  requireAuth: boolean;
  passwordProtected?: boolean;
  password?: string;
  expiresAt?: string;
  maxResponses?: number;
  tracking?: TrackingConfig;
  seo?: SEOSettings;
  customDomain?: string;
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  noIndex?: boolean;
}

// =============================================================================
// LEGACY COMPATIBILITY
// =============================================================================

/** @deprecated Use UnifiedFunnel */
export type Funnel = UnifiedFunnel;

/** @deprecated Use FunnelStep */
export type Step = FunnelStep;

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isFunnelStep(value: unknown): value is FunnelStep {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'blocks' in value
  );
}

export function isUnifiedFunnel(value: unknown): value is UnifiedFunnel {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'name' in value &&
    'steps' in value
  );
}
