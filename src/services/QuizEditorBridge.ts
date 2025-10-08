/**
 * 🌉 QUIZ EDITOR BRIDGE - Ponte entre Editor e Produção
 * 
 * Serviço que sincroniza edições do editor com o runtime de produção
 * Permite editar, salvar e substituir o funil /quiz-estilo
 * 
 * ✅ FASE 6.5: Integrado com utilitários testados (91 testes)
 */

import { QUIZ_STEPS, STEP_ORDER, type QuizStep } from '@/data/quizSteps';
import { supabase } from '@/integrations/supabase/client';
import { autoFillNextSteps } from '@/utils/autoFillNextSteps';
// @TEMP: Helper para forçar reconhecimento de tabelas recém adicionadas nos tipos gerados
type AnySupabase = typeof supabase & { from: (table: string) => any };
const supabaseAny = supabase as AnySupabase;

// ✅ FASE 4: Conversões bidirecionais testadas (600+ linhas, 32 testes)
import {
    convertStepToBlocks,
    convertBlocksToStep,
    validateRoundTrip
} from '@/utils/quizConversionUtils';

// ✅ FASE 5: Validações de integridade testadas (550+ linhas, 22 testes)
import {
    validateCompleteFunnel,
    validateStyleIds,
    validateNextStep,
    validateOfferMap,
    validateFormInput
} from '@/utils/quizValidationUtils';

interface EditorQuizStep extends QuizStep {
    id: string;
    order: number;
}

interface QuizFunnelData {
    id: string;
    name: string;
    slug: string;
    steps: EditorQuizStep[];
    isPublished: boolean;
    version: number;
    createdAt?: string;
    updatedAt?: string;
}

class QuizEditorBridge {
    private cache = new Map<string, QuizFunnelData>();
    private readonly PRODUCTION_SLUG = 'quiz-estilo';
    private readonly DRAFT_TABLE = 'quiz_drafts';
    private readonly PRODUCTION_TABLE = 'quiz_production';

    /**
     * 🎯 Carregar funil para edição (draft ou produção)
     */
    async loadFunnelForEdit(funnelId?: string): Promise<QuizFunnelData> {
        console.log('📥 Carregando funil para edição:', funnelId || 'produção');

        // Se não tem ID, carregar funil de produção atual
        if (!funnelId || funnelId === this.PRODUCTION_SLUG) {
            return this.loadProductionFunnel();
        }

        // Tentar carregar draft do Supabase
        const draft = await this.loadDraftFromDatabase(funnelId);
        if (draft) return draft;

        // Fallback: criar novo draft baseado na produção
        return this.createDraftFromProduction(funnelId);
    }

    /**
     * 📦 Carregar funil de produção (QUIZ_STEPS atual)
     */
    private loadProductionFunnel(): QuizFunnelData {
        const steps: EditorQuizStep[] = STEP_ORDER.map((stepId, index) => {
            const stepData = QUIZ_STEPS[stepId];
            return {
                id: stepId,
                order: index + 1,
                ...stepData
            };
        });

        return {
            id: 'production',
            name: 'Quiz Estilo Pessoal - Produção',
            slug: this.PRODUCTION_SLUG,
            steps,
            isPublished: true,
            version: 1
        };
    }

    /**
     * 💾 Salvar rascunho de edição
     * ✅ FASE 6.5: Validações automáticas antes de salvar
     */
    async saveDraft(funnel: QuizFunnelData): Promise<string> {
        console.log('💾 Salvando rascunho:', funnel.name);

        // 🔧 Auto-preencher nextStep se faltar (robustez extra caso editor não tenha aplicado)
        let workingSteps = funnel.steps.map(s => ({ ...s }));
        const auto = autoFillNextSteps(workingSteps.map(s => ({ id: s.id, order: s.order, nextStep: (s as any).nextStep })) as any);
        if (auto.adjusted) {
            const map = new Map(auto.steps.map(s => [s.id, s.nextStep] as const));
            workingSteps = workingSteps.map(s => ({ ...s, nextStep: map.get(s.id) }));
            console.log('🛠️ nextStep preenchido automaticamente em', auto.filledCount, 'etapas');
        }

        // ✅ FASE 5: Validar integridade completa antes de salvar usando steps pós-autoFill
        const validation = validateCompleteFunnel(workingSteps as any);

        if (!validation.isValid) {
            const errorMsg = validation.errors.map(e => e.message).join('; ');
            console.error('❌ Validação falhou:', errorMsg);
            throw new Error(`Validação falhou: ${errorMsg}`);
        }

        if (validation.warnings.length > 0) {
            console.warn('⚠️ Avisos de validação:', validation.warnings);
        }

        console.log('✅ Validação passou:', validation);

        const draftId = funnel.id === 'production' ? `draft-${Date.now()}` : funnel.id;

        const draftData = {
            id: draftId,
            name: funnel.name,
            slug: funnel.slug,
            steps: workingSteps,
            version: (funnel.version || 0) + 1,
            is_published: false,
            updated_at: new Date().toISOString()
        };

        // Salvar no Supabase
        const { error } = await supabaseAny
            .from(this.DRAFT_TABLE)
            .upsert(draftData);

        if (error) {
            console.error('❌ Erro ao salvar draft:', error);
            throw new Error(`Falha ao salvar: ${error.message}`);
        }

        // Atualizar cache
        this.cache.set(draftId, { ...funnel, steps: workingSteps as any, id: draftId });

        console.log('✅ Rascunho salvo:', draftId);
        return draftId;
    }

    /**
     * 🚀 Publicar e substituir produção
     * ✅ FASE 6.5: Validações críticas antes de publicar
     */
    async publishToProduction(funnelId: string): Promise<void> {
        console.log('🚀 Publicando para produção:', funnelId);

        // Carregar draft
        const draft = await this.loadDraftFromDatabase(funnelId);
        if (!draft) {
            throw new Error('Draft não encontrado');
        }

        // ✅ FASE 5: Validação CRÍTICA antes de publicar
        const validation = validateCompleteFunnel(draft.steps as any);

        if (!validation.isValid) {
            const errorMsg = validation.errors.map(e => e.message).join('; ');
            console.error('❌ PUBLICAÇÃO BLOQUEADA - Validação falhou:', errorMsg);
            throw new Error(`Publicação bloqueada: ${errorMsg}`);
        }

        console.log('✅ Validação passou. Publicando...');

        // Converter steps para formato QUIZ_STEPS
        const quizSteps = this.convertToQuizSteps(draft.steps);

        // Salvar na tabela de produção
        const productionData = {
            slug: this.PRODUCTION_SLUG,
            steps: quizSteps,
            version: draft.version,
            published_at: new Date().toISOString(),
            source_draft_id: funnelId
        };

        const { error } = await supabaseAny
            .from(this.PRODUCTION_TABLE)
            .upsert(productionData);

        if (error) {
            console.error('❌ Erro ao publicar:', error);
            throw new Error(`Falha na publicação: ${error.message}`);
        }

        // Invalidar cache
        this.cache.clear();

        console.log('✅ Publicado com sucesso! Versão:', draft.version);
    }

    /**
     * 🔄 Converter steps editáveis para formato QUIZ_STEPS
     */
    private convertToQuizSteps(steps: EditorQuizStep[]): Record<string, QuizStep> {
        const quizSteps: Record<string, QuizStep> = {};

        steps.forEach(step => {
            const { id, order, ...stepData } = step;
            quizSteps[id] = stepData;
        });

        return quizSteps;
    }

    /**
     * 📂 Carregar draft do banco
     */
    private async loadDraftFromDatabase(draftId: string): Promise<QuizFunnelData | null> {
        const { data, error } = await supabaseAny
            .from(this.DRAFT_TABLE)
            .select('*')
            .eq('id', draftId)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            steps: data.steps as EditorQuizStep[],
            isPublished: data.is_published || false,
            version: data.version || 1,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
    }

    /**
     * 📋 Criar draft baseado na produção
     */
    private createDraftFromProduction(draftId: string): QuizFunnelData {
        const production = this.loadProductionFunnel();

        return {
            ...production,
            id: draftId,
            name: `${production.name} - Rascunho`,
            isPublished: false
        };
    }

    /**
     * 🎯 Carregar funil para runtime (usado pelo QuizApp)
     */
    async loadForRuntime(funnelId?: string): Promise<Record<string, QuizStep>> {
        console.log('🎯 Carregando para runtime:', funnelId || 'produção');

        // Se não tem funnelId, usar produção
        if (!funnelId) {
            // Tentar buscar versão publicada mais recente
            const published = await this.getLatestPublished();
            return published || QUIZ_STEPS;
        }

        // Carregar draft específico (preview)
        const draft = await this.loadDraftFromDatabase(funnelId);
        if (draft) {
            return this.convertToQuizSteps(draft.steps);
        }

        // Fallback para produção
        return QUIZ_STEPS;
    }

    /**
     * 📦 Buscar versão publicada mais recente
     */
    private async getLatestPublished(): Promise<Record<string, QuizStep> | null> {
        try {
            const { data, error } = await supabaseAny
                .from(this.PRODUCTION_TABLE)
                .select('steps')
                .eq('slug', this.PRODUCTION_SLUG)
                .order('published_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) return null;

            return data.steps as Record<string, QuizStep>;
        } catch {
            return null;
        }
    }

    /**
     * 📊 Validar integridade do funil
     * ✅ FASE 6.5: Usa validações testadas (22 testes, 100% confiáveis)
     */
    validateFunnel(funnel: QuizFunnelData): { valid: boolean; errors: string[]; warnings: string[] } {
        console.log('🔍 Validando funil com utils testados...');

        // ✅ FASE 5: Usar validateCompleteFunnel (testado com 22 testes)
        const validation = validateCompleteFunnel(funnel.steps as any);

        const errors = validation.errors.map(e => e.message);
        const warnings = validation.warnings.map(w => w.message);

        console.log('✅ Validação completa:', {
            valid: validation.isValid,
            errors: errors.length,
            warnings: warnings.length
        });

        return {
            valid: validation.isValid,
            errors,
            warnings
        };
    }
}

// Singleton
export const quizEditorBridge = new QuizEditorBridge();
export default quizEditorBridge;
