/**
 * UNIFIED SCHEMA - Based on real Supabase database structure
 * 
 * This file consolidates all database schemas into a single source of truth,
 * eliminating conflicts between multiple schema files and ensuring consistency.
 * 
 * Based on actual Supabase tables:
 * - component_instances
 * - component_types  
 * - funnel_pages
 * - funnels
 * - profiles
 * - quiz_analytics
 * - quiz_conversions
 * - quiz_results
 * - quiz_sessions
 * - quiz_step_responses
 * - quiz_users
 */

import { Database } from '../integrations/supabase/types';
import { z } from 'zod';

// =============================================================================
// SUPABASE DATABASE TYPES (Re-exported for convenience)
// =============================================================================

export type Json = Database['public']['Tables']['funnels']['Row']['settings'];

// Core table types - directly from Supabase
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type InsertProfile = Database['public']['Tables']['profiles']['Insert'];
export type UpdateProfile = Database['public']['Tables']['profiles']['Update'];

export type Funnel = Database['public']['Tables']['funnels']['Row'];
export type InsertFunnel = Database['public']['Tables']['funnels']['Insert'];
export type UpdateFunnel = Database['public']['Tables']['funnels']['Update'];

export type FunnelPage = Database['public']['Tables']['funnel_pages']['Row'];
export type InsertFunnelPage = Database['public']['Tables']['funnel_pages']['Insert'];
export type UpdateFunnelPage = Database['public']['Tables']['funnel_pages']['Update'];

export type ComponentInstance = Database['public']['Tables']['component_instances']['Row'];
export type InsertComponentInstance = Database['public']['Tables']['component_instances']['Insert'];
export type UpdateComponentInstance = Database['public']['Tables']['component_instances']['Update'];

export type ComponentType = Database['public']['Tables']['component_types']['Row'];
export type InsertComponentType = Database['public']['Tables']['component_types']['Insert'];
export type UpdateComponentType = Database['public']['Tables']['component_types']['Update'];

export type QuizUser = Database['public']['Tables']['quiz_users']['Row'];
export type InsertQuizUser = Database['public']['Tables']['quiz_users']['Insert'];
export type UpdateQuizUser = Database['public']['Tables']['quiz_users']['Update'];

export type QuizSession = Database['public']['Tables']['quiz_sessions']['Row'];
export type InsertQuizSession = Database['public']['Tables']['quiz_sessions']['Insert'];
export type UpdateQuizSession = Database['public']['Tables']['quiz_sessions']['Update'];

export type QuizResult = Database['public']['Tables']['quiz_results']['Row'];
export type InsertQuizResult = Database['public']['Tables']['quiz_results']['Insert'];
export type UpdateQuizResult = Database['public']['Tables']['quiz_results']['Update'];

export type QuizStepResponse = Database['public']['Tables']['quiz_step_responses']['Row'];
export type InsertQuizStepResponse = Database['public']['Tables']['quiz_step_responses']['Insert'];
export type UpdateQuizStepResponse = Database['public']['Tables']['quiz_step_responses']['Update'];

export type QuizAnalytics = Database['public']['Tables']['quiz_analytics']['Row'];
export type InsertQuizAnalytics = Database['public']['Tables']['quiz_analytics']['Insert'];
export type UpdateQuizAnalytics = Database['public']['Tables']['quiz_analytics']['Update'];

export type QuizConversion = Database['public']['Tables']['quiz_conversions']['Row'];
export type InsertQuizConversion = Database['public']['Tables']['quiz_conversions']['Insert'];
export type UpdateQuizConversion = Database['public']['Tables']['quiz_conversions']['Update'];

// =============================================================================
// ZOD VALIDATION SCHEMAS (Enhanced)
// =============================================================================

export const ProfileSchema = z.object({
  id: z.string().uuid('Invalid profile ID format'),
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional().nullable(),
  created_at: z.string().datetime('Invalid date format'),
  updated_at: z.string().datetime('Invalid date format'),
});

export const FunnelSchema = z.object({
  id: z.string().uuid('Invalid funnel ID format'),
  name: z.string().min(1, 'Funnel name is required').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional().nullable(),
  user_id: z.string().uuid('Invalid user ID format').optional().nullable(),
  is_published: z.boolean().optional().nullable(),
  version: z.number().int().positive('Version must be positive').optional().nullable(),
  settings: z.record(z.any()).optional().nullable(), // JSONB validation
  created_at: z.string().datetime('Invalid date format').optional().nullable(),
  updated_at: z.string().datetime('Invalid date format').optional().nullable(),
});

export const FunnelPageSchema = z.object({
  id: z.string().uuid('Invalid page ID format'),
  funnel_id: z.string().uuid('Invalid funnel ID format'),
  page_type: z.enum(['intro', 'question', 'result', 'lead_form', 'transition'], {
    errorMap: () => ({ message: 'Invalid page type' })
  }),
  page_order: z.number().int().min(0, 'Page order must be non-negative'),
  title: z.string().max(255, 'Title too long').optional().nullable(),
  blocks: z.array(z.any()).min(0, 'Blocks must be an array'), // JSONB validation
  metadata: z.record(z.any()).optional().nullable(), // JSONB validation
  created_at: z.string().datetime('Invalid date format').optional().nullable(),
  updated_at: z.string().datetime('Invalid date format').optional().nullable(),
});

export const ComponentInstanceSchema = z.object({
  id: z.string().uuid('Invalid component instance ID format'),
  funnel_id: z.string().uuid('Invalid funnel ID format'),
  component_type_key: z.string().min(1, 'Component type key is required'),
  instance_key: z.string().min(1, 'Instance key is required'),
  step_number: z.number().int().min(0, 'Step number must be non-negative'),
  order_index: z.number().int().min(0, 'Order index must be non-negative'),
  properties: z.record(z.any()).default({}), // JSONB validation
  custom_styling: z.record(z.any()).optional().nullable(), // JSONB validation
  is_active: z.boolean().default(true).optional().nullable(),
  is_locked: z.boolean().default(false).optional().nullable(),
  is_template: z.boolean().default(false).optional().nullable(),
  stage_id: z.string().optional().nullable(),
  created_at: z.string().datetime('Invalid date format').optional().nullable(),
  updated_at: z.string().datetime('Invalid date format').optional().nullable(),
  created_by: z.string().uuid('Invalid creator ID format').optional().nullable(),
});

export const QuizUserSchema = z.object({
  id: z.string().uuid('Invalid quiz user ID format'),
  email: z.string().email('Invalid email format').optional().nullable(),
  name: z.string().min(1, 'Name must not be empty').max(100, 'Name too long').optional().nullable(),
  session_id: z.string().uuid('Invalid session ID format'),
  ip_address: z.unknown().optional().nullable(),
  user_agent: z.string().optional().nullable(),
  utm_source: z.string().max(255, 'UTM source too long').optional().nullable(),
  utm_medium: z.string().max(255, 'UTM medium too long').optional().nullable(),
  utm_campaign: z.string().max(255, 'UTM campaign too long').optional().nullable(),
  utm_content: z.string().max(255, 'UTM content too long').optional().nullable(),
  utm_term: z.string().max(255, 'UTM term too long').optional().nullable(),
  referrer_url: z.string().url('Invalid referrer URL format').optional().nullable(),
  created_at: z.string().datetime('Invalid date format'),
  updated_at: z.string().datetime('Invalid date format'),
});

export const QuizSessionSchema = z.object({
  id: z.string().uuid('Invalid session ID format'),
  funnel_id: z.string().uuid('Invalid funnel ID format'),
  quiz_user_id: z.string().uuid('Invalid quiz user ID format'),
  current_step: z.number().int().min(0, 'Current step must be non-negative').optional().nullable(),
  total_steps: z.number().int().min(0, 'Total steps must be non-negative').optional().nullable(),
  status: z.enum(['active', 'completed', 'abandoned', 'paused'], {
    errorMap: () => ({ message: 'Invalid session status' })
  }).optional().nullable(),
  score: z.number().min(0, 'Score must be non-negative').optional().nullable(),
  max_score: z.number().min(0, 'Max score must be non-negative').optional().nullable(),
  completed_at: z.string().datetime('Invalid date format').optional().nullable(),
  last_activity: z.string().datetime('Invalid date format'),
  metadata: z.record(z.any()).optional().nullable(), // JSONB validation
});

// Enhanced block validation with specific types
export const EditorBlockSchema = z.object({
  id: z.string().min(1, 'Block ID is required'),
  type: z.enum([
    'text', 'image', 'video', 'audio', 'button', 'input', 'select', 
    'quiz-question', 'quiz-result', 'form', 'layout', 'divider'
  ], {
    errorMap: () => ({ message: 'Invalid block type' })
  }),
  properties: z.record(z.any()).default({}),
  styling: z.record(z.any()).optional(),
  order: z.number().int().min(0, 'Order must be non-negative'),
});

// Runtime validation functions with better error handling
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} => {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errorMessage = result.error.errors.map(err => err.message).join(', ');
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Validation error' 
    };
  }
};

// =============================================================================
// BUSINESS LOGIC TYPES
// =============================================================================

export interface AutoSaveState {
  enabled: boolean;
  lastSaved?: Date;
  hasUnsavedChanges: boolean;
  pendingChanges: number;
  errorCount: number;
  interval?: number;
}

export interface FunnelVersion {
  id: string;
  version: number;
  name: string;
  createdAt: Date;
  data: any;
  isAutoSave?: boolean;
  description?: string;
}

export interface EditorBlock {
  id: string;
  type: string;
  properties: Record<string, any>;
  styling?: Record<string, any>;
  order: number;
}

export interface QuizConfiguration {
  allowRetake: boolean;
  showResults: boolean;
  shuffleQuestions: boolean;
  showProgressBar: boolean;
  passingScore: number;
  timeLimit?: number;
}

export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

// =============================================================================
// ENHANCED UTILITY FUNCTIONS
// =============================================================================

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Enhanced validation functions with proper error handling
export const validateFunnel = (data: unknown): { valid: boolean; data?: Funnel; errors?: string[] } => {
  const result = safeValidate(FunnelSchema, data);
  if (result.success) {
    return { valid: true, data: result.data as Funnel };
  }
  return { valid: false, errors: [result.error || 'Validation failed'] };
};

export const validateFunnelPage = (data: unknown): { valid: boolean; data?: FunnelPage; errors?: string[] } => {
  const result = safeValidate(FunnelPageSchema, data);
  if (result.success) {
    return { valid: true, data: result.data as FunnelPage };
  }
  return { valid: false, errors: [result.error || 'Validation failed'] };
};

export const validateQuizUser = (data: unknown): { valid: boolean; data?: QuizUser; errors?: string[] } => {
  const result = safeValidate(QuizUserSchema, data);
  if (result.success) {
    return { valid: true, data: result.data as QuizUser };
  }
  return { valid: false, errors: [result.error || 'Validation failed'] };
};

export const validateQuizSession = (data: unknown): { valid: boolean; data?: QuizSession; errors?: string[] } => {
  const result = safeValidate(QuizSessionSchema, data);
  if (result.success) {
    return { valid: true, data: result.data as QuizSession };
  }
  return { valid: false, errors: [result.error || 'Validation failed'] };
};

export const validateEditorBlock = (data: unknown): { valid: boolean; data?: EditorBlock; errors?: string[] } => {
  const result = safeValidate(EditorBlockSchema, data);
  if (result.success) {
    return { valid: true, data: result.data as EditorBlock };
  }
  return { valid: false, errors: [result.error || 'Validation failed'] };
};

// =============================================================================
// CONSTANTS
// =============================================================================

export const TABLE_NAMES = {
  PROFILES: 'profiles',
  FUNNELS: 'funnels',
  FUNNEL_PAGES: 'funnel_pages',
  COMPONENT_INSTANCES: 'component_instances',
  COMPONENT_TYPES: 'component_types',
  QUIZ_USERS: 'quiz_users',
  QUIZ_SESSIONS: 'quiz_sessions',
  QUIZ_RESULTS: 'quiz_results',
  QUIZ_STEP_RESPONSES: 'quiz_step_responses',
  QUIZ_ANALYTICS: 'quiz_analytics',
  QUIZ_CONVERSIONS: 'quiz_conversions',
} as const;

export const FUNNEL_PAGE_TYPES = {
  INTRO: 'intro',
  QUESTION: 'question',
  RESULT: 'result',
  LEAD_FORM: 'lead_form',
  TRANSITION: 'transition',
} as const;

export const QUIZ_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  PAUSED: 'paused',
} as const;

export const COMPONENT_CATEGORIES = {
  LAYOUT: 'layout',
  INPUT: 'input',
  DISPLAY: 'display',
  MEDIA: 'media',
  QUIZ: 'quiz',
  FORM: 'form',
} as const;