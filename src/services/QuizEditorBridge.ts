/**
 * 🌉 QUIZ EDITOR BRIDGE - Ponte entre Editor e Produção
 * 
 * Serviço que sincroniza edições do editor com o runtime de produção
 * Permite editar, salvar e substituir o funil /quiz-estilo
 */

import { QUIZ_STEPS, STEP_ORDER, type QuizStep } from '@/data/quizSteps';
import { supabase } from '@/integrations/supabase/client';

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
     */
    async saveDraft(funnel: QuizFunnelData): Promise<string> {
        console.log('💾 Salvando rascunho:', funnel.name);

        const draftId = funnel.id === 'production' ? `draft-${Date.now()}` : funnel.id;

        const draftData = {
            id: draftId,
            name: funnel.name,
            slug: funnel.slug,
            steps: funnel.steps,
            version: (funnel.version || 0) + 1,
            is_published: false,
            updated_at: new Date().toISOString()
        };

        // Salvar no Supabase
        const { error } = await supabase
            .from(this.DRAFT_TABLE)
            .upsert(draftData);

        if (error) {
            console.error('❌ Erro ao salvar draft:', error);
            throw new Error(`Falha ao salvar: ${error.message}`);
        }

        // Atualizar cache
        this.cache.set(draftId, { ...funnel, id: draftId });

        console.log('✅ Rascunho salvo:', draftId);
        return draftId;
    }

    /**
     * 🚀 Publicar e substituir produção
     */
    async publishToProduction(funnelId: string): Promise<void> {
        console.log('🚀 Publicando para produção:', funnelId);

        // Carregar draft
        const draft = await this.loadDraftFromDatabase(funnelId);
        if (!draft) {
            throw new Error('Draft não encontrado');
        }

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

        const { error } = await supabase
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
        const { data, error } = await supabase
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
            const { data, error } = await supabase
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
     */
    validateFunnel(funnel: QuizFunnelData): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Validar quantidade de steps
        if (funnel.steps.length !== 21) {
            errors.push(`Esperado 21 etapas, encontrado ${funnel.steps.length}`);
        }

        // Validar step 1 (intro)
        const step1 = funnel.steps.find(s => s.id === 'step-01' || s.id === 'step-1');
        if (!step1 || step1.type !== 'intro') {
            errors.push('Etapa 1 deve ser tipo "intro"');
        }

        // Validar questões (steps 2-11)
        const questions = funnel.steps.filter((s, i) => i >= 1 && i <= 10);
        questions.forEach((q, idx) => {
            if (q.type !== 'question') {
                errors.push(`Etapa ${idx + 2} deve ser tipo "question"`);
            }
            if (!q.options || q.options.length < 2) {
                errors.push(`Etapa ${idx + 2} precisa de opções`);
            }
        });

        // Validar step 20 (result)
        const step20 = funnel.steps[19];
        if (!step20 || step20.type !== 'result') {
            errors.push('Etapa 20 deve ser tipo "result"');
        }

        // Validar step 21 (offer)
        const step21 = funnel.steps[20];
        if (!step21 || step21.type !== 'offer') {
            errors.push('Etapa 21 deve ser tipo "offer"');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Singleton
export const quizEditorBridge = new QuizEditorBridge();
export default quizEditorBridge;
