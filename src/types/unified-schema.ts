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
// ZOD VALIDATION SCHEMAS
// =============================================================================

export const ProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const FunnelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  user_id: z.string().optional().nullable(),
  is_published: z.boolean().optional().nullable(),
  version: z.number().optional().nullable(),
  settings: z.any().optional().nullable(), // JSONB
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const FunnelPageSchema = z.object({
  id: z.string(),
  funnel_id: z.string(),
  page_type: z.string(),
  page_order: z.number(),
  title: z.string().optional().nullable(),
  blocks: z.any(), // JSONB
  metadata: z.any().optional().nullable(), // JSONB
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

export const ComponentInstanceSchema = z.object({
  id: z.string(),
  funnel_id: z.string(),
  component_type_key: z.string(),
  instance_key: z.string(),
  step_number: z.number(),
  order_index: z.number(),
  properties: z.any(), // JSONB
  custom_styling: z.any().optional().nullable(), // JSONB
  is_active: z.boolean().optional().nullable(),
  is_locked: z.boolean().optional().nullable(),
  is_template: z.boolean().optional().nullable(),
  stage_id: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
});

export const QuizUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional().nullable(),
  name: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  utm_content: z.string().optional().nullable(),
  utm_term: z.string().optional().nullable(),
  referrer_url: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const QuizSessionSchema = z.object({
  id: z.string(),
  funnel_id: z.string(),
  quiz_user_id: z.string(),
  current_step: z.number().optional().nullable(),
  total_steps: z.number().optional().nullable(),
  status: z.string().optional().nullable(),
  score: z.number().optional().nullable(),
  max_score: z.number().optional().nullable(),
  completed_at: z.string().optional().nullable(),
  last_activity: z.string(),
  metadata: z.any().optional().nullable(), // JSONB
});

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
// UTILITY FUNCTIONS
// =============================================================================

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateFunnel = (data: unknown): Funnel | null => {
  try {
    return FunnelSchema.parse(data) as Funnel;
  } catch {
    return null;
  }
};

export const validateFunnelPage = (data: unknown): FunnelPage | null => {
  try {
    return FunnelPageSchema.parse(data) as FunnelPage;
  } catch {
    return null;
  }
};

export const validateQuizUser = (data: unknown): QuizUser | null => {
  try {
    return QuizUserSchema.parse(data) as QuizUser;
  } catch {
    return null;
  }
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