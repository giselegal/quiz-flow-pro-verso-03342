/**
 * 🛡️ EDITOR STATE SCHEMA - Validação Zod para Estado do Editor
 * 
 * Resolve GARGALO G15 (ALTO): Estado inicial não validado
 * 
 * PROBLEMAS RESOLVIDOS:
 * - ❌ Crashes por estado corrompido no localStorage
 * - ❌ Falha silenciosa ao carregar template inválido
 * - ❌ Tipos TypeScript não garantem runtime safety
 * 
 * SOLUÇÃO:
 * - ✅ Validação runtime com Zod antes de renderizar
 * - ✅ Fallback para estado inicial seguro
 * - ✅ Mensagens de erro detalhadas
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import { z } from 'zod';
import { blockSchema } from '@/types/blockSchema';

// Schema para EditorState
export const editorStateSchema = z.object({
  currentStep: z.number().int().min(1).max(21),
  selectedBlockId: z.string().nullable(),
  isPreviewMode: z.boolean(),
  isEditing: z.boolean(),
  dragEnabled: z.boolean(),
  clipboardData: z.any().nullable(),
  stepBlocks: z.record(z.string(), z.array(blockSchema)),
  dirtySteps: z.record(z.string(), z.boolean()),
  totalSteps: z.number().int().min(1).max(50),
  funnelSettings: z.any(),
  validationErrors: z.array(z.any()),
  isDirty: z.boolean(),
  lastSaved: z.number().nullable(),
});

// Schema para Theme
export const themeSchema = z.object({
  theme: z.enum(['light', 'dark']),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  fontFamily: z.string().min(1),
  borderRadius: z.string(),
});

// Schema para Auth
export const authStateSchema = z.object({
  user: z.any().nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  error: z.string().nullable(),
});

// Schema para UI
export const uiStateSchema = z.object({
  showSidebar: z.boolean(),
  showPropertiesPanel: z.boolean(),
  activeModal: z.string().nullable(),
  toasts: z.array(z.object({
    id: z.string(),
    type: z.enum(['success', 'error', 'warning', 'info']),
    title: z.string(),
    message: z.string(),
    duration: z.number().optional(),
  })),
  isLoading: z.boolean(),
  loadingMessage: z.string(),
});

// Schema completo do SuperUnifiedState (parcial - apenas campos críticos)
export const superUnifiedStateSchema = z.object({
  funnels: z.array(z.any()),
  currentFunnel: z.any().nullable(),
  auth: authStateSchema,
  theme: themeSchema,
  editor: editorStateSchema,
  ui: uiStateSchema,
  cache: z.any(), // Cache é validado por UnifiedCacheService
  performance: z.any(), // Performance metrics são opcionais
  features: z.any(), // Feature flags são opcionais
});

export type ValidatedEditorState = z.infer<typeof editorStateSchema>;
export type ValidatedSuperUnifiedState = z.infer<typeof superUnifiedStateSchema>;

/**
 * Valida e sanitiza estado do editor
 */
export function validateEditorState(state: unknown): {
  success: boolean;
  data?: ValidatedEditorState;
  errors?: z.ZodError;
} {
  const result = editorStateSchema.safeParse(state);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

/**
 * Valida estado completo do SuperUnified
 */
export function validateSuperUnifiedState(state: unknown): {
  success: boolean;
  data?: ValidatedSuperUnifiedState;
  errors?: z.ZodError;
} {
  const result = superUnifiedStateSchema.safeParse(state);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

/**
 * Valida e retorna estado inicial seguro com fallback
 */
export function getSafeInitialState(persistedState: unknown, fallbackState: any): any {
  const validation = validateSuperUnifiedState(persistedState);
  
  if (validation.success) {
    return validation.data;
  }
  
  console.warn('⚠️ Estado persistido inválido, usando fallback:', validation.errors?.issues);
  return fallbackState;
}
