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
  source: 'supabase' | 'template' | 'cache' | 'blank';
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

    // 2. Handle blank canvas strategy (no funnel specified)
    if (resolved.strategy === 'blank') {
      appLogger.info('🗺️ [FunnelService] Blank canvas mode - returning empty quiz');
      const emptyQuiz = this.createBlankQuiz();
      return {
        funnel: {
          id: 'new-funnel',
          templateId: '',
          quiz: emptyQuiz,
          version: 1,
        },
        resolved,
        source: 'blank',
      };
    }

    // 3. Try loading from Supabase first (if not explicitly template-only)
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

    // 4. Load from template file
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

      // Parse content JSON (usando any para flexibilidade com schema)
      const draftData = data as any;
      const quiz = typeof draftData.content === 'string'
        ? JSON.parse(draftData.content)
        : draftData.content;

      return {
        id: draftData.funnel_id,
        templateId: draftData.template_id || draftData.slug || 'unknown',
        draftId: draftData.id,
        quiz,
        version: draftData.version || 1,
        createdAt: draftData.created_at || undefined,
        updatedAt: draftData.updated_at || undefined,
        userId: draftData.user_id,
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
   * Load template from file with bundled data fallback
   */
  private async loadTemplateFromFile(templatePath: string): Promise<QuizSchema> {
    try {
      appLogger.info('📂 [FunnelService] Loading template', { templatePath });

      // 🆕 Use bundled template data directly (no HTTP fetch needed)
      const { getCanonicalTemplate } = await import('@/config/template-paths');
      const { QuizSchemaZ } = await import('@/schemas/quiz-schema.zod');
      
      const bundledData = getCanonicalTemplate();
      appLogger.info('✅ [FunnelService] Using bundled template data');
      
      return QuizSchemaZ.parse(bundledData);
    } catch (error) {
      appLogger.warn('⚠️ [FunnelService] Template load failed, using fallback', { error });
      return this.getDefaultTemplateData();
    }
  }

  /**
   * Get default template data from TypeScript
   */
  private getDefaultTemplateData(): QuizSchema {
    return {
      version: '4.0',
      schemaVersion: '4.0',
      theme: {
        colors: {
          primary: '#B89B7A',
          primaryHover: '#A68B6A',
          primaryLight: '#F3E8D3',
          secondary: '#432818',
          background: '#FAF9F7',
          text: '#1F2937',
          border: '#E5E7EB',
        },
        fonts: {
          heading: 'Playfair Display, serif',
          body: 'Inter, system-ui, sans-serif',
        },
        spacing: { sm: 8, md: 16, lg: 24, xl: 32 },
        borderRadius: { sm: 4, md: 8, lg: 12, xl: 16 },
      },
      metadata: {
        id: 'quiz21StepsComplete',
        name: 'Quiz 21 Steps Complete',
        description: 'Template completo de quiz com 21 etapas',
        author: 'Quiz Flow Pro',
        createdAt: '2025-01-13T00:00:00.000Z',
        updatedAt: '2025-12-05T00:00:00.000Z',
        tags: ['quiz', 'estilo'],
      },
      settings: {
        scoring: {
          enabled: true,
          method: 'category-points' as const,
        },
        navigation: {
          allowBack: true,
          autoAdvance: false,
          showProgress: true,
        },
        validation: {
          required: false,
          strictMode: false,
        },
      },
      steps: [
        {
          id: 'step-1',
          title: 'Bem-vindo ao Quiz',
          type: 'intro' as const,
          order: 1,
          version: 1,
          navigation: { nextStep: 'step-2' },
          blocks: [
            { id: 'block-intro-header', type: 'intro-logo-header' as const, order: 0, properties: { title: 'Descubra Seu Estilo', subtitle: 'Responda às perguntas' } },
            { id: 'block-intro-cta', type: 'intro-button' as const, order: 1, properties: { text: 'Começar Quiz', variant: 'primary', action: 'next' } },
          ],
        },
        {
          id: 'step-2',
          title: 'Estilo de Vida',
          type: 'question' as const,
          order: 2,
          version: 1,
          navigation: { nextStep: 'step-3' },
          blocks: [
            { id: 'block-q1-header', type: 'question-title' as const, order: 0, properties: { title: 'Pergunta 1', subtitle: 'Como você descreveria seu estilo de vida?' } },
            { id: 'block-q1-options', type: 'options-grid' as const, order: 1, properties: { options: [
              { id: 'q1-modern', text: 'Moderno e dinâmico', value: 'modern:10' },
              { id: 'q1-classic', text: 'Clássico e elegante', value: 'classic:10' },
            ], multiSelect: false } },
          ],
        },
        {
          id: 'step-3',
          title: 'Resultado',
          type: 'result' as const,
          order: 3,
          version: 1,
          navigation: { nextStep: null },
          blocks: [
            { id: 'block-result-header', type: 'result-header' as const, order: 0, properties: { title: 'Seu Resultado', subtitle: 'Descobrimos seu estilo!' } },
            { id: 'block-result-cta', type: 'cta-button' as const, order: 1, properties: { text: 'Ver Recomendações', variant: 'primary', action: 'url', url: 'https://pay.kiwify.com.br/DkYC1Aj' } },
          ],
        },
      ],
      results: {
        classic: { id: 'classic', name: 'Estilo Clássico', title: 'Estilo Clássico', description: 'Elegância atemporal', category: 'style' },
        modern: { id: 'modern', name: 'Estilo Moderno', title: 'Estilo Moderno', description: 'Tendências atuais', category: 'style' },
      },
    } as QuizSchema;
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
        const { data, error } = await (supabase as any)
          .from('quiz_drafts')
          .insert({
            funnel_id: funnelId,
            slug: quiz.metadata?.id || funnelId,
            name: quiz.metadata?.name || 'Draft',
            content: quizData,
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

  /**
   * Create a blank quiz for new funnels
   */
  private createBlankQuiz(): QuizSchema {
    const now = new Date().toISOString();
    return {
      version: '4.1.0',
      schemaVersion: '4.1',
      metadata: {
        id: 'new-quiz',
        name: 'Novo Quiz',
        description: 'Quiz criado do zero',
        author: 'QuizFlow',
        createdAt: now,
        updatedAt: now,
        tags: [],
      },
      theme: {
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          background: '#FFFFFF',
          text: '#1F2937',
          border: '#E5E7EB',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
        },
        borderRadius: {
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16,
        },
      },
      settings: {
        scoring: {
          enabled: false,
          method: 'sum',
        },
        navigation: {
          allowBack: true,
          showProgress: true,
          autoAdvance: false,
        },
        validation: {
          required: false,
          strictMode: false,
        },
      },
      steps: [
        {
          id: 'step-1',
          type: 'intro',
          title: 'Bem-vindo',
          version: 1,
          blocks: [
            {
              id: 'block-1',
              type: 'intro-title',
              order: 0,
              properties: {
                text: 'Bem-vindo ao seu novo quiz!',
              },
              content: {},
              metadata: {
                editable: true,
                reorderable: true,
                reusable: true,
                deletable: true,
              },
            },
          ],
          navigation: {
            nextStep: null,
          },
          order: 1,
        },
      ],
    };
  }
}

/**
 * Singleton instance
 */
export const funnelService = new FunnelService();
