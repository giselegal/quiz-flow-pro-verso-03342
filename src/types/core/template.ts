/**
 * 🎯 CANONICAL TEMPLATE TYPE DEFINITION
 * 
 * Fonte única de verdade para tipos de Template em todo o projeto.
 * 
 * @canonical
 */

import type { Block } from './block';
import type { FunnelStep, FunnelConfig, FunnelMetadata } from './funnel';
import type { QuizStep } from './quiz';

// =============================================================================
// TEMPLATE VERSION
// =============================================================================

export type TemplateVersion = 'v3' | 'v4' | 'v4.1';

// =============================================================================
// TEMPLATE STEP
// =============================================================================

export interface TemplateStep {
  id: string;
  order: number;
  name: string;
  type: string;
  description?: string;
  blocks: Block[];
  settings?: Record<string, unknown>;
  
  // Legacy compatibility
  components?: unknown[];
  template?: string;
}

// =============================================================================
// TEMPLATE V4 (Canonical)
// =============================================================================

export interface TemplateV4 {
  id: string;
  version: TemplateVersion;
  name: string;
  description?: string;
  
  // Steps with blocks
  steps: TemplateStep[];
  
  // Configuration
  config?: FunnelConfig;
  
  // Metadata
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
    author?: string;
    tags?: string[];
    category?: string;
    isTemplate?: boolean;
    schemaVersion?: string;
  };
  
  // Global settings
  settings?: {
    theme?: Record<string, unknown>;
    tracking?: Record<string, unknown>;
    behavior?: Record<string, unknown>;
  };
}

// =============================================================================
// TEMPLATE V3 (Legacy)
// =============================================================================

export interface TemplateV3 {
  id: string;
  version?: 'v3';
  name: string;
  description?: string;
  
  // Steps in V3 format
  steps: QuizStep[];
  
  // Metadata
  metadata?: {
    totalSteps?: number;
    [key: string]: unknown;
  };
}

// =============================================================================
// NORMALIZED TEMPLATE
// =============================================================================

export interface NormalizedTemplate {
  id: string;
  version: TemplateVersion;
  name: string;
  description?: string;
  steps: TemplateStep[];
  config: FunnelConfig;
  metadata: FunnelMetadata;
  
  // Computed
  totalSteps: number;
  isValid: boolean;
  validationErrors?: string[];
}

// =============================================================================
// TEMPLATE SOURCE
// =============================================================================

export type TemplateSourceType = 
  | 'local'
  | 'remote'
  | 'supabase'
  | 'indexeddb'
  | 'memory';

export interface TemplateSource {
  type: TemplateSourceType;
  priority: number;
  url?: string;
  path?: string;
}

// =============================================================================
// TEMPLATE LOADER
// =============================================================================

export interface TemplateLoaderOptions {
  templateId: string;
  version?: TemplateVersion;
  sources?: TemplateSource[];
  useCache?: boolean;
  cacheTTL?: number;
  fallbackToDefault?: boolean;
}

export interface TemplateLoaderResult {
  template: NormalizedTemplate | null;
  source: TemplateSourceType;
  fromCache: boolean;
  loadTime: number;
  errors?: string[];
}

// =============================================================================
// TEMPLATE CATALOG
// =============================================================================

export interface TemplateCatalogEntry {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  previewUrl?: string;
  author?: string;
  version: TemplateVersion;
  stepsCount: number;
  isPublic: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCatalog {
  templates: TemplateCatalogEntry[];
  categories: string[];
  tags: string[];
  totalCount: number;
}

// =============================================================================
// TEMPLATE CONVERSION
// =============================================================================

export interface TemplateConversionOptions {
  sourceVersion: TemplateVersion;
  targetVersion: TemplateVersion;
  preserveIds?: boolean;
  validateOutput?: boolean;
}

export interface TemplateConversionResult {
  success: boolean;
  template?: NormalizedTemplate;
  errors?: string[];
  warnings?: string[];
}

// =============================================================================
// TYPE ALIASES FOR COMPATIBILITY
// =============================================================================

/** Current canonical template format */
export type Template = TemplateV4;

/** @deprecated Use TemplateV4 */
export type QuizTemplate = TemplateV4;

/** @deprecated Use TemplateStep */
export type StepTemplate = TemplateStep;

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isTemplateV4(value: unknown): value is TemplateV4 {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'steps' in value &&
    ((value as TemplateV4).version === 'v4' || (value as TemplateV4).version === 'v4.1')
  );
}

export function isTemplateV3(value: unknown): value is TemplateV3 {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'steps' in value &&
    (!('version' in value) || (value as TemplateV3).version === 'v3')
  );
}

export function isNormalizedTemplate(value: unknown): value is NormalizedTemplate {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'version' in value &&
    'steps' in value &&
    'totalSteps' in value
  );
}

// =============================================================================
// NORMALIZERS
// =============================================================================

export function normalizeTemplate(raw: unknown): NormalizedTemplate | null {
  if (!raw || typeof raw !== 'object') return null;
  
  const obj = raw as Record<string, unknown>;
  
  // Detect version
  const version = (obj.version as TemplateVersion) || 'v3';
  
  // Normalize steps
  const steps = (obj.steps as unknown[]) || [];
  const normalizedSteps: TemplateStep[] = steps.map((step, index) => {
    const s = step as Record<string, unknown>;
    return {
      id: (s.id as string) || `step-${index + 1}`,
      order: (s.order as number) || index,
      name: (s.name as string) || (s.title as string) || `Step ${index + 1}`,
      type: (s.type as string) || 'custom',
      description: s.description as string,
      blocks: (s.blocks as Block[]) || [],
      settings: s.settings as Record<string, unknown>,
    };
  });
  
  return {
    id: (obj.id as string) || 'unknown',
    version,
    name: (obj.name as string) || 'Untitled',
    description: obj.description as string,
    steps: normalizedSteps,
    config: (obj.config as FunnelConfig) || {},
    metadata: (obj.metadata as FunnelMetadata) || {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    totalSteps: normalizedSteps.length,
    isValid: normalizedSteps.length > 0,
  };
}
