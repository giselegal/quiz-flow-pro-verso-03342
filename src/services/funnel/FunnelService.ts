/**
 * 🎯 FUNNEL SERVICE (V4.1-SAAS) - SERVIÇO OFICIAL
 * 
 * ⚠️ ESTE É O ÚNICO FUNNEL SERVICE ATIVO DO SISTEMA
 * Todos os outros foram movidos para src/services/legacy/
 * 
 * Ver PLANO_CORRECAO_GARGALOS_ARQUITETURAIS.md (Fase 1)
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * RESPONSABILIDADES:
 * - ✅ Carregar funis (Supabase draft OU template base)
 * - ✅ Salvar funis (Supabase com versioning)
 * - ✅ Duplicar funis
 * - ✅ Multi-funnel support real
 * 
 * NÃO FAZ (delegado para outros serviços):
 * - ❌ Gerenciar templates base → use TemplateService
 * - ❌ Cache → use CacheService
 * - ❌ Validação de schema → use Zod (QuizSchemaZ)
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * FLUXO COMPLETO:
 * 
 * 1. LOAD:
 *    URL → FunnelResolver → loadFunnel()
 *    ├─ Existe draft no Supabase? → SIM: carrega draft
 *    └─ NÃO: carrega template base de /templates/v4/
 * 
 * 2. SAVE:
 *    Editor → saveFunnel(quiz, funnelId, draftId)
 *    ├─ draftId existe? → UPDATE (optimistic lock)
 *    └─ Novo: INSERT draft no Supabase
 * 
 * 3. DUPLICATE:
 *    duplicateFunnel(funnelId) → cria cópia independente
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MIGRATION GUIDE (para código usando services antigos):
 * 
 * ❌ ANTES:
 *    import { funnelService } from '@/services/funnelService';
 *    const funnel = await funnelService.getFunnelById(id);
 * 
 * ✅ DEPOIS:
 *    import { funnelService } from '@/services/funnel/FunnelService';
 *    const result = await funnelService.loadFunnel({ funnelId: id });
 *    const funnel = result.funnel;
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * @version 4.1.0
 * @status PRODUCTION-READY
 * @since 2025-01-13
 * @updated 2025-12-01 (Fase 1: Consolidação)
 */

import { type QuizSchema } from '@/schemas/quiz-schema.zod';
import { appLogger } from '@/lib/utils/appLogger';
import { supabase } from '@/lib/supabase';
import {
  resolveFunnel,
  type FunnelIdentifier,
  type ResolvedFunnel
} from './FunnelResolver';

/**
 * Funnel entity (negócio)
 */
export interface Funnel {
  /** Business ID */
  id: string;

  /** Template ID (base) */
  templateId: string;

  /** Draft ID (Supabase) */
  draftId?: string;

  /** Quiz data */
  quiz: QuizSchema;

  /** Metadata */
  version: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

/**
 * Load result
 */
export interface LoadFunnelResult {
  funnel: Funnel;
  resolved: ResolvedFunnel;
  source: 'supabase' | 'template' | 'cache';
}

/**
 * Save result
 */
export interface SaveFunnelResult {
  success: boolean;
  draftId: string;
  version: number;
  error?: string;
}

/**
 * Funnel Service
 * 
 * MAIN ORCHESTRATOR for funnel operations
 */
export class FunnelService {
  /**
   * Load funnel by ID
   * 
   * Strategy:
   * 1. Check if draft exists in Supabase (by funnel_id)
   * 2. If yes → load draft JSON
   * 3. If no → load template from /templates
   * 4. Return Funnel entity with quizId for persistence
   * 
   * Fixes GARGALO #1: Editor não é mais hard-coded
   * Fixes GARGALO #2: Reabre drafts corretamente
   */
  async loadFunnel(identifier: FunnelIdentifier): Promise<LoadFunnelResult> {
    appLogger.info('🎯 [FunnelService] Loading funnel', identifier);

    // 1. Resolve funnel path
    const resolved = resolveFunnel(identifier);

    // 2. Try loading from Supabase first (if not explicitly template-only)
    if (!identifier.templateId || identifier.draftId) {
      const draftResult = await this.loadDraftFromSupabase(resolved.funnelId, identifier.draftId);

      if (draftResult) {
        appLogger.info('✅ [FunnelService] Loaded from Supabase draft', {
          funnelId: resolved.funnelId,
          draftId: draftResult.draftId,
          version: draftResult.version
        });

        return {
          funnel: draftResult,
          resolved: {
            ...resolved,
            isDraft: true,
            draftId: draftResult.draftId,
            strategy: 'draft',
          },
          source: 'supabase',
        };
      }
    }

    // 3. Load from template file
    const quiz = await this.loadTemplateFromFile(resolved.templatePath);

    const funnel: Funnel = {
      id: resolved.funnelId,
      templateId: resolved.templatePath,
      quiz,
      version: 1,
    };

    appLogger.info('✅ [FunnelService] Loaded from template', {
      funnelId: resolved.funnelId,
      templatePath: resolved.templatePath,
      version: resolved.templateVersion
    });

    return {
      funnel,
      resolved,
      source: 'template',
    };
  }

  /**
   * Load draft from Supabase
   * 
   * Checks:
   * - By draftId (direct)
   * - By funnel_id (latest version)
   */
  private async loadDraftFromSupabase(
    funnelId: string,
    draftId?: string
  ): Promise<Funnel | null> {
    try {
      let query = supabase
        .from('quiz_drafts')
        .select('*')
        .order('version', { ascending: false })
        .limit(1);

      if (draftId) {
        // Direct lookup by ID
        query = query.eq('id', draftId);
      } else {
        // Lookup by funnel_id (latest version)
        query = query.eq('funnel_id', funnelId);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        appLogger.info('ℹ️ [FunnelService] No draft found in Supabase', {
          funnelId,
          draftId,
          error: error?.message
        });
        return null;
      }

      // Parse quiz_data JSON
      const quiz = typeof data.quiz_data === 'string'
        ? JSON.parse(data.quiz_data)
        : data.quiz_data;

      return {
        id: data.funnel_id,
        templateId: data.template_id || 'unknown',
        draftId: data.id,
        quiz,
        version: data.version,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
      };
    } catch (error) {
      appLogger.error('❌ [FunnelService] Error loading draft from Supabase', {
        funnelId,
        draftId,
        error
      });
      return null;
    }
  }

  /**
   * Load template from file
   * 
   * ✅ SOLUÇÃO: Usar fetch com caminho absoluto da raiz do servidor
   * Arquivos em /public são servidos na raiz do servidor Vite
   */
  private async loadTemplateFromFile(templatePath: string): Promise<QuizSchema> {
    try {
      appLogger.info('📂 [FunnelService] Loading template from file', { templatePath });

      // Garantir que o caminho comece com /
      const normalizedPath = templatePath.startsWith('/') ? templatePath : `/${templatePath}`;

      console.log('🌐 [FunnelService] Fetching template:', {
        originalPath: templatePath,
        normalizedPath,
        fullUrl: `${window.location.origin}${normalizedPath}`
      });

      const response = await fetch(normalizedPath, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }).catch(fetchError => {
        console.error('❌ [FunnelService] Fetch failed:', {
          error: fetchError,
          path: normalizedPath,
          origin: window.location.origin,
          fetchError: fetchError.message
        });
        throw new Error(`Network error: Could not fetch ${normalizedPath}. ${fetchError.message}`);
      });

      console.log('📡 [FunnelService] Response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        url: response.url,
        ok: response.ok,
        headers: Array.from(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        console.error('🔥 [FunnelService] Response NOT OK:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          requestedPath: normalizedPath,
          actualUrl: response.url
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText} for ${normalizedPath}. Details: ${errorText}`);
      }

      const data = await response.json();

      console.log('✅ Template loaded successfully:', {
        path: normalizedPath,
        stepsCount: data?.steps?.length,
        metadata: data?.metadata?.name
      });

      // Validate with Zod
      const { QuizSchemaZ } = await import('@/schemas/quiz-schema.zod');
      const validated = QuizSchemaZ.parse(data);

      return validated;
    } catch (error) {
      appLogger.error('❌ [FunnelService] Error loading template', {
        templatePath,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });

      console.error('💥 [FunnelService] Template load failed:', {
        templatePath,
        error,
        suggestion: 'Make sure the dev server is running: npm run dev'
      });

      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Failed to load template ${templatePath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Save funnel to Supabase
   * 
   * Strategy:
   * - If draftId exists → UPDATE with optimistic lock
   * - If no draftId → INSERT new draft
   * 
   * Fixes GARGALO #2: Persistência fechada
   */
  async saveFunnel(
    quiz: QuizSchema,
    funnelId: string,
    draftId?: string,
    userId?: string
  ): Promise<SaveFunnelResult> {
    try {
      appLogger.info('💾 [FunnelService] Saving funnel', {
        funnelId,
        draftId,
        userId
      });

      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;

        if (!userId) {
          return {
            success: false,
            draftId: draftId || '',
            version: 0,
            error: 'User not authenticated'
          };
        }
      }

      const quizData = JSON.stringify(quiz);

      if (draftId) {
        // UPDATE existing draft with optimistic lock
        const { data: existing } = await supabase
          .from('quiz_drafts')
          .select('version')
          .eq('id', draftId)
          .single();

        const currentVersion = existing?.version || 1;
        const newVersion = currentVersion + 1;

        const { data, error } = await supabase
          .from('quiz_drafts')
          .update({
            quiz_data: quizData,
            version: newVersion,
            updated_at: new Date().toISOString(),
          })
          .eq('id', draftId)
          .eq('version', currentVersion) // Optimistic lock
          .select()
          .single();

        if (error) {
          appLogger.error('❌ [FunnelService] Update failed', { error });
          return {
            success: false,
            draftId,
            version: currentVersion,
            error: error.message
          };
        }

        appLogger.info('✅ [FunnelService] Updated draft', {
          draftId,
          version: newVersion
        });

        return {
          success: true,
          draftId: data.id,
          version: newVersion,
        };
      } else {
        // INSERT new draft
        const { data, error } = await supabase
          .from('quiz_drafts')
          .insert({
            funnel_id: funnelId,
            template_id: quiz.metadata?.id || funnelId,
            quiz_data: quizData,
            version: 1,
            user_id: userId,
          })
          .select()
          .single();

        if (error) {
          appLogger.error('❌ [FunnelService] Insert failed', { error });
          return {
            success: false,
            draftId: '',
            version: 0,
            error: error.message
          };
        }

        appLogger.info('✅ [FunnelService] Created new draft', {
          draftId: data.id,
          funnelId
        });

        return {
          success: true,
          draftId: data.id,
          version: 1,
        };
      }
    } catch (error) {
      appLogger.error('❌ [FunnelService] Save error', { error });
      return {
        success: false,
        draftId: draftId || '',
        version: 0,
        error: String(error)
      };
    }
  }

  /**
   * Duplicate funnel
   * 
   * Creates independent copy with new ID
   * 
   * Usage:
   * ```ts
   * const newFunnel = await service.duplicateFunnel('quiz21StepsComplete', 'clienteX-quiz21');
   * ```
   */
  async duplicateFunnel(
    sourceFunnelId: string,
    newFunnelId: string,
    userId?: string
  ): Promise<LoadFunnelResult> {
    appLogger.info('📋 [FunnelService] Duplicating funnel', {
      sourceFunnelId,
      newFunnelId
    });

    // 1. Load source funnel
    const source = await this.loadFunnel({ funnelId: sourceFunnelId });

    // 2. Clone quiz data
    const clonedQuiz = JSON.parse(JSON.stringify(source.funnel.quiz));

    // 3. Update metadata
    if (clonedQuiz.metadata) {
      clonedQuiz.metadata.id = newFunnelId;
      clonedQuiz.metadata.title = `${clonedQuiz.metadata.title} (Cópia)`;
    }

    // 4. Save as new funnel
    const saveResult = await this.saveFunnel(clonedQuiz, newFunnelId, undefined, userId);

    if (!saveResult.success) {
      throw new Error(`Failed to duplicate funnel: ${saveResult.error}`);
    }

    // 5. Return new funnel
    return this.loadFunnel({
      funnelId: newFunnelId,
      draftId: saveResult.draftId
    });
  }

  /**
   * Delete funnel draft
   */
  async deleteFunnel(draftId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_drafts')
        .delete()
        .eq('id', draftId);

      if (error) {
        appLogger.error('❌ [FunnelService] Delete failed', { error });
        return false;
      }

      appLogger.info('✅ [FunnelService] Deleted draft', { draftId });
      return true;
    } catch (error) {
      appLogger.error('❌ [FunnelService] Delete error', { error });
      return false;
    }
  }

  /**
   * List all funnels for user
   */
  async listFunnels(userId: string): Promise<Funnel[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_drafts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        appLogger.error('❌ [FunnelService] List failed', { error });
        return [];
      }

      return data.map((draft: any) => ({
        id: draft.funnel_id,
        templateId: draft.template_id,
        draftId: draft.id,
        quiz: typeof draft.quiz_data === 'string'
          ? JSON.parse(draft.quiz_data)
          : draft.quiz_data,
        version: draft.version,
        createdAt: draft.created_at,
        updatedAt: draft.updated_at,
        userId: draft.user_id,
      }));
    } catch (error) {
      appLogger.error('❌ [FunnelService] List error', { error });
      return [];
    }
  }
}

/**
 * Singleton instance
 */
export const funnelService = new FunnelService();
