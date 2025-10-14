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

// ✅ FASE 7: Adaptador bidirecional Blocks ↔ JSON v3.0
import { BlocksToJSONv3Adapter, type JSONv3Template } from '@/adapters/BlocksToJSONv3Adapter';

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
    // Campos opcionais adicionais (schema unificado)
    runtime?: any;
    results?: any;
    ui?: any;
    settings?: any;
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
            // Agrupar erros de nextStep para mensagem mais clara
            // Determinar última etapa dinamicamente (maior order; fallback pelo maior índice numérico em id)
            const lastStep = workingSteps.reduce((acc, s) => {
                if (!acc) return s;
                if ((s.order ?? 0) > (acc.order ?? 0)) return s;
                return acc;
            }, workingSteps[0]);
            const lastId = lastStep?.id;
            const missingNextStepIds = workingSteps
                .filter(s => s.id !== lastId && (s.nextStep === undefined || s.nextStep === null))
                .map(s => s.id);
            const baseMsg = validation.errors.map(e => e.message).join('; ');
            const errorMsg = missingNextStepIds.length
                ? `${baseMsg}; Etapas faltando: ${missingNextStepIds.join(', ')}`
                : baseMsg;
            console.error('❌ Validação falhou:', errorMsg, { missingNextStepIds });
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
            steps: workingSteps.map(s => ({ ...s, autoLinked: !funnel.steps.find(o => o.id === s.id)?.nextStep && s.nextStep ? true : (s as any).autoLinked })),
            version: (funnel.version || 0) + 1,
            is_published: false,
            updated_at: new Date().toISOString(),
            // Persistência opcional de runtime/results/ui (pode exigir colunas JSONB no Supabase)
            runtime: (funnel as any).runtime,
            results: (funnel as any).results,
            ui: (funnel as any).ui,
            settings: (funnel as any).settings,
        };

        // Salvar no Supabase (melhor esforço) e sempre manter cache local como fallback
        try {
            const { error } = await supabaseAny
                .from(this.DRAFT_TABLE)
                .upsert(draftData);
            if (error) {
                console.warn('⚠️ Supabase indisponível ao salvar draft. Usando cache local:', error?.message || error);
            }
        } catch (err) {
            console.warn('⚠️ Falha geral ao acessar Supabase ao salvar draft. Continuando com cache local.', err);
        }

        // Atualizar cache SEMPRE para habilitar fluxo dev/local sem backend
        this.cache.set(draftId, { ...funnel, steps: workingSteps as any, id: draftId });

        console.log('✅ Rascunho salvo (com fallback local se necessário):', draftId);
        return draftId;
    }

    /**
     * 🚀 Publicar e substituir produção
     * ✅ FASE 6.5: Validações críticas antes de publicar
     */
    async publishToProduction(funnelId: string): Promise<void> {
        console.log('🚀 Publicando para produção:', funnelId);

        // Carregar draft
        let draft = await this.loadDraftFromDatabase(funnelId);
        // Fallback em memória: em ambientes sem Supabase real, recuperar do cache local
        if (!draft) {
            const cached = this.cache.get(funnelId);
            if (cached) {
                console.warn('⚠️ Supabase indisponível ou sem dados. Usando draft do cache em memória para publicar.');
                draft = cached;
            }
        }
        if (!draft) {
            throw new Error('Draft não encontrado');
        }

        // 🔧 Garantir nextStep preenchido antes de validar/publicar
        let publishingSteps = draft.steps.map(s => ({ ...s }));
        const auto = autoFillNextSteps(publishingSteps.map(s => ({ id: s.id, order: s.order, nextStep: (s as any).nextStep })) as any);
        if (auto.adjusted) {
            const map = new Map(auto.steps.map(s => [s.id, s.nextStep] as const));
            publishingSteps = publishingSteps.map(s => ({ ...s, nextStep: map.get(s.id) }));
            console.log('🛠️ (publish) nextStep preenchido automaticamente em', auto.filledCount, 'etapas');
        }

        // ✅ FASE 5: Validação CRÍTICA antes de publicar usando steps finalizados
        const validation = validateCompleteFunnel(publishingSteps as any);

        if (!validation.isValid) {
            const errorMsg = validation.errors.map(e => e.message).join('; ');
            console.error('❌ PUBLICAÇÃO BLOQUEADA - Validação falhou:', errorMsg);
            throw new Error(`Publicação bloqueada: ${errorMsg}`);
        }

        console.log('✅ Validação passou. Publicando...');

        // Converter steps para formato QUIZ_STEPS
        const quizSteps = this.convertToQuizSteps(publishingSteps as any);

        // Salvar na tabela de produção (inclui runtime/results/ui quando disponíveis)
        const productionData = {
            slug: this.PRODUCTION_SLUG,
            steps: quizSteps,
            version: draft.version,
            published_at: new Date().toISOString(),
            source_draft_id: funnelId,
            runtime: (draft as any).runtime,
            results: (draft as any).results,
            ui: (draft as any).ui,
            settings: (draft as any).settings,
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
        console.log('🔍 QuizEditorBridge - Carregando draft:', draftId);

        const { data, error } = await supabaseAny
            .from(this.DRAFT_TABLE)
            .select('*')
            .eq('id', draftId)
            .single();

        if (error || !data) {
            console.log('⚠️ QuizEditorBridge - Draft não encontrado no DB, tentando cache');
            // Fallback em memória
            const cached = this.cache.get(draftId);
            if (cached) {
                console.log('✅ QuizEditorBridge - Draft encontrado em cache');
                return cached;
            }
            console.log('❌ QuizEditorBridge - Draft não encontrado');
            return null;
        }

        console.log('✅ QuizEditorBridge - Draft carregado do DB');
        console.log('🔍 Steps:', data.steps?.length || 0);

        // Log detalhado do primeiro bloco quiz-options encontrado
        if (Array.isArray(data.steps)) {
            for (const step of data.steps) {
                if (Array.isArray(step.blocks)) {
                    const quizOptionsBlock = step.blocks.find((b: any) =>
                        b.type === 'quiz-options' || b.type === 'options-grid'
                    );
                    if (quizOptionsBlock) {
                        console.log('🎯 Primeiro bloco quiz-options encontrado:');
                        console.log('  - Tipo:', quizOptionsBlock.type);
                        console.log('  - Content:', quizOptionsBlock.content);
                        console.log('  - Properties:', quizOptionsBlock.properties);
                        console.log('  - Options em content:', quizOptionsBlock.content?.options?.length || 0);
                        console.log('  - Options em properties:', quizOptionsBlock.properties?.options?.length || 0);
                        if (quizOptionsBlock.content?.options?.[0]) {
                            console.log('  - Primeira opção:', quizOptionsBlock.content.options[0]);
                        }
                        break;
                    }
                }
            }
        }

        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            steps: data.steps as EditorQuizStep[],
            isPublished: data.is_published || false,
            version: data.version || 1,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            // Campos opcionais
            runtime: (data as any).runtime,
            results: (data as any).results,
            ui: (data as any).ui,
            settings: (data as any).settings,
        };
    }

    /**
     * � Listar drafts disponíveis (Supabase + cache em memória)
     * Útil para o dashboard "Meus Funis" exibir rascunhos mesmo em dev sem backend real.
     */
    async listDrafts(): Promise<QuizFunnelData[]> {
        let drafts: QuizFunnelData[] = [];
        try {
            const { data } = await supabaseAny
                .from(this.DRAFT_TABLE)
                .select('*')
                .order('updated_at', { ascending: false });

            if (Array.isArray(data)) {
                drafts = data.map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    slug: d.slug,
                    steps: d.steps as EditorQuizStep[],
                    isPublished: d.is_published || false,
                    version: d.version || 1,
                    createdAt: d.created_at,
                    updatedAt: d.updated_at,
                    runtime: d.runtime,
                    results: d.results,
                    ui: d.ui,
                    settings: d.settings,
                }));
            }
        } catch {
            // Ignorar erros – usaremos cache
        }

        // Mesclar com cache em memória
        const cached = Array.from(this.cache.values());

        // Unificar por id (priorizar supabase e preencher faltantes com cache)
        const byId = new Map<string, QuizFunnelData>();
        drafts.forEach(d => byId.set(d.id, d));
        cached.forEach(c => {
            if (!byId.has(c.id)) byId.set(c.id, c);
        });

        // Ordenar por updatedAt/createdAt desc
        const list = Array.from(byId.values()).sort((a, b) => {
            const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return tb - ta;
        });
        return list;
    }

    /**
     * 🔎 Somente drafts do cache (memória) – útil em dev puro
     */
    listCachedDrafts(): QuizFunnelData[] {
        return Array.from(this.cache.values());
    }

    /**
     * �📋 Criar draft baseado na produção
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

        // Se tem funnelId, tentar carregar draft específico
        if (funnelId) {
            const draft = await this.loadDraftFromDatabase(funnelId);
            if (draft) {
                return this.convertToQuizSteps(draft.steps);
            }

            // Fallback em memória: se salvo nesta sessão
            const cached = this.cache.get(funnelId);
            if (cached) {
                return this.convertToQuizSteps(cached.steps as any);
            }
        }

        // Tentar buscar versão publicada mais recente
        const published = await this.getLatestPublished();
        if (published?.steps) {
            console.log('✅ Usando versão publicada do Supabase');
            return published.steps;
        }

        // ✅ NOVO: Fallback para templates JSON v3.0
        console.log('📚 Fallback: carregando templates JSON v3.0...');
        const v3Templates = await this.loadAllV3Templates();
        return v3Templates;
    }

    /**
     * 📦 Carregar todos os templates JSON v3.0 como fallback
     */
    private async loadAllV3Templates(): Promise<Record<string, QuizStep>> {
        const steps: Record<string, QuizStep> = {};

        console.log('📚 Carregando templates JSON v3.0...');

        for (let i = 1; i <= 21; i++) {
            const stepId = `step-${i.toString().padStart(2, '0')}`;

            try {
                // Tentar carregar template JSON v3.0 via fetch (evita dynamic import vars)
                const res = await fetch(`/templates/${stepId}-v3.json`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const v3Template: JSONv3Template = await res.json();

                // Converter sections[] para blocks[]
                const blocks = BlocksToJSONv3Adapter.jsonv3ToBlocks(v3Template);

                // Converter Block[] para EditableBlock[] (adaptar formato)
                const editableBlocks = blocks.map((b, idx) => ({
                    id: b.id,
                    type: b.type,
                    order: b.order ?? idx,
                    properties: b.properties || {},
                    content: b.content || {}
                }));

                // Inferir tipo do step baseado no stepId ou usar fallback
                const fallbackStep = QUIZ_STEPS[stepId];
                const stepType = fallbackStep?.type || 'question';

                // Converter blocks[] para QuizStep
                const stepData = convertBlocksToStep(stepId, stepType, editableBlocks);

                // Mesclar com fallback para garantir propriedades obrigatórias
                steps[stepId] = {
                    ...fallbackStep,
                    ...stepData,
                    type: stepType // garantir type definido
                } as QuizStep;

                console.log(`✅ Template ${stepId} carregado do JSON v3.0`);
            } catch (error) {
                // Fallback para QUIZ_STEPS hardcoded
                console.warn(`⚠️  Fallback para ${stepId}:`, error);
                steps[stepId] = QUIZ_STEPS[stepId];
            }
        }

        return steps;
    }

    /**
     * 📦 Buscar versão publicada mais recente
     */
    private async getLatestPublished(): Promise<{ steps: Record<string, QuizStep>; runtime?: any; results?: any; ui?: any; settings?: any } | null> {
        try {
            const { data, error } = await supabaseAny
                .from(this.PRODUCTION_TABLE)
                .select('steps, runtime, results, ui, settings')
                .eq('slug', this.PRODUCTION_SLUG)
                .order('published_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) return null;

            return {
                steps: data.steps as Record<string, QuizStep>,
                runtime: (data as any).runtime,
                results: (data as any).results,
                ui: (data as any).ui,
                settings: (data as any).settings,
            };
        } catch {
            return null;
        }
    }

    /**
     * ⚙️ Carregar configuração de runtime/resultados/ui (draft ou produção)
     */
    async loadRuntimeConfig(funnelId?: string): Promise<{ runtime?: any; results?: any; ui?: any; settings?: any } | null> {
        if (!funnelId) {
            const published = await this.getLatestPublished();
            return published ? { runtime: published.runtime, results: published.results, ui: published.ui, settings: published.settings } : null;
        }

        const draft = await this.loadDraftFromDatabase(funnelId);
        if (draft) {
            const { runtime, results, ui, settings } = draft as any;
            return { runtime, results, ui, settings };
        }

        const cached = this.cache.get(funnelId);
        if (cached) {
            const { runtime, results, ui, settings } = cached as any;
            return { runtime, results, ui, settings };
        }

        // Fallback nulo se não houver
        return null;
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

    /**
     * 📤 NOVO: Exportar funil para JSON v3.0
     * ✅ FASE 7: Conversão bidirecional Blocks → JSON v3.0
     */
    async exportToJSONv3(funnelId: string): Promise<Record<string, JSONv3Template>> {
        console.log('📤 Exportando funil para JSON v3.0:', funnelId);

        const funnel = await this.loadFunnelForEdit(funnelId);
        const templates: Record<string, JSONv3Template> = {};

        for (const step of funnel.steps) {
            try {
                // Converter blocks do step para JSON v3.0
                const blocks = convertStepToBlocks(step as any);
                const jsonTemplate = BlocksToJSONv3Adapter.blocksToJSONv3(
                    blocks as any,
                    step.id,
                    {
                        name: step.title || step.id,
                        description: `Exported from editor`,
                    }
                );

                templates[step.id] = jsonTemplate;
                console.log(`✅ Step ${step.id} exportado`);
            } catch (error) {
                console.error(`❌ Erro ao exportar ${step.id}:`, error);
            }
        }

        console.log(`✅ ${Object.keys(templates).length} steps exportados para JSON v3.0`);
        return templates;
    }

    /**
     * 📥 NOVO: Importar template JSON v3.0 para o editor
     * ✅ FASE 7: Permite carregar templates existentes
     */
    async importFromJSONv3(json: JSONv3Template, funnelId?: string): Promise<EditorQuizStep> {
        console.log('📥 Importando template JSON v3.0:', json.metadata.id);

        // Converter JSON v3.0 → Blocks
        const blocks = BlocksToJSONv3Adapter.jsonv3ToBlocks(json);

        // Inferir tipo do step do category ou do ID
        const categoryMap: Record<string, QuizStep['type']> = {
            'intro': 'intro',
            'question': 'question',
            'strategic': 'strategic-question',
            'transition': 'transition',
            'result': 'result',
            'offer': 'offer'
        };

        const stepType = categoryMap[json.metadata.category] || 'question';

        // Converter blocks[] para QuizStep
        const quizStep = convertBlocksToStep(json.metadata.id, stepType, blocks as any);

        // Criar EditorQuizStep com type garantido
        const editorStep: EditorQuizStep = {
            id: json.metadata.id,
            order: this.extractStepOrder(json.metadata.id),
            type: (quizStep.type || 'intro') as any,
            ...quizStep,
        };

        console.log('✅ Template importado:', editorStep.id);
        return editorStep;
    }

    /**
     * 🗑️ NOVO: Validar exclusão de step (cascade validation)
     * ✅ FASE 7: Evita nextStep quebrado
     */
    validateStepDeletion(stepId: string, funnel: QuizFunnelData): {
        canDelete: boolean;
        references: string[];
        errors: string[]
    } {
        console.log('🔍 Validando exclusão de step:', stepId);

        const references: string[] = [];
        const errors: string[] = [];

        // Verificar se algum step aponta para este via nextStep
        for (const step of funnel.steps) {
            if (step.nextStep === stepId) {
                references.push(step.id);
            }
        }

        if (references.length > 0) {
            errors.push(
                `Step ${stepId} está referenciado por ${references.length} step(s): ${references.join(', ')}`
            );
            errors.push('Atualize os nextStep antes de deletar.');
        }

        // Verificar se é step intermediário crítico
        const stepIndex = funnel.steps.findIndex(s => s.id === stepId);
        if (stepIndex > 0 && stepIndex < funnel.steps.length - 1) {
            const prevStep = funnel.steps[stepIndex - 1];
            const nextStep = funnel.steps[stepIndex + 1];

            console.warn(`⚠️ Deletando step intermediário. Será necessário religar ${prevStep.id} → ${nextStep.id}`);
        }

        return {
            canDelete: errors.length === 0,
            references,
            errors,
        };
    }

    /**
     * 🔧 Helper: Extrair ordem do step baseado no ID
     */
    private extractStepOrder(stepId: string): number {
        const match = stepId.match(/step-(\d+)/);
        return match ? parseInt(match[1]) : 999;
    }

    /**
     * 📥 NOVO: Importar todos os templates JSON v3.0 para criar funil
     * ✅ FASE 7: Batch import
     */
    async importAllJSONv3Templates(templates: Record<string, JSONv3Template>, funnelName: string): Promise<QuizFunnelData> {
        console.log('📥 Importando múltiplos templates JSON v3.0:', Object.keys(templates).length);

        const steps: EditorQuizStep[] = [];

        for (const [stepId, template] of Object.entries(templates)) {
            try {
                const editorStep = await this.importFromJSONv3(template);
                steps.push(editorStep);
            } catch (error) {
                console.error(`❌ Erro ao importar ${stepId}:`, error);
            }
        }

        // Ordenar steps
        steps.sort((a, b) => a.order - b.order);

        const funnel: QuizFunnelData = {
            id: `imported-${Date.now()}`,
            name: funnelName,
            slug: 'imported-funnel',
            steps,
            isPublished: false,
            version: 1,
        };

        // Salvar como draft
        const draftId = await this.saveDraft(funnel);
        funnel.id = draftId;

        console.log(`✅ ${steps.length} templates importados para funil ${draftId}`);
        return funnel;
    }
}

// Singleton
export const quizEditorBridge = new QuizEditorBridge();
export default quizEditorBridge;
