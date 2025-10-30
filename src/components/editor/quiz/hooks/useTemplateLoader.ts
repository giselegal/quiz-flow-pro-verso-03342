/**
 * 🎯 HOOK: useTemplateLoader
 * 
 * Carrega templates de forma assíncrona e não-bloqueante
 * Substitui o useEffect gigante (360 linhas) por lógica isolada e testável
 * 
 * 📊 HIERARQUIA DE FONTES (ordem de prioridade):
 * 1. 🎯 Funnel existente (rascunho salvo do usuário)
 * 2. 📄 Per-Step JSONs individuais (public/templates/blocks/step-XX.json)
 * 
 * Features:
 * - Loading states com Suspense support
 * - Error handling robusto
 * - Retry automático
 * - Cache unificado integrado
 * 
 * @version 2.0.0 - Prioridade corrigida: Per-Step JSONs > Master JSON
 */

import { useState, useEffect, useRef } from 'react';
import { appLogger } from '@/utils/logger';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import { UnifiedCacheService } from '@/services/UnifiedCacheService';
import type { EditableQuizStep } from '../types';

export interface TemplateLoaderState {
    loading: boolean;
    steps: EditableQuizStep[] | null;
    error: Error | null;
    source: 'funnel' | 'per-step-json' | null;
}

export interface UseTemplateLoaderOptions {
    templateId?: string;
    funnelId?: string;
    onSuccess?: (steps: EditableQuizStep[]) => void;
    onError?: (error: Error) => void;
}

export function useTemplateLoader(options: UseTemplateLoaderOptions) {
    const { templateId, funnelId, onSuccess, onError } = options;

    const [state, setState] = useState<TemplateLoaderState>({
        loading: true,
        steps: null,
        error: null,
        source: null,
    });

    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            abortControllerRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        if (!templateId && !funnelId) {
            setState({ loading: false, steps: null, error: null, source: null });
            return;
        }

        const loadTemplate = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }));
                abortControllerRef.current = new AbortController();

                appLogger.debug('🎯 useTemplateLoader: Iniciando carregamento', { templateId, funnelId });

                // Estratégia 1: Carregar funnel existente (rascunho salvo)
                if (funnelId) {
                    const result = await loadFromFunnel(funnelId);
                    if (result) {
                        if (!isMountedRef.current) return;
                        setState({ loading: false, steps: result, error: null, source: 'funnel' });
                        onSuccess?.(result);
                        return;
                    }
                }

                // Estratégia 2: Carregar de Per-Step JSONs individuais (PRIORIDADE!)
                // Cada step tem seu próprio arquivo em public/templates/blocks/step-XX.json
                if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo-21-steps') {
                    const result = await loadFromPerStepJSONs();
                    if (result) {
                        if (!isMountedRef.current) return;
                        setState({ loading: false, steps: result, error: null, source: 'per-step-json' });
                        onSuccess?.(result);
                        return;
                    }
                }

                // Falha geral
                if (!isMountedRef.current) return;
                const err = new Error('Nenhuma fonte de template disponível (funnel ou per-step json)');
                setState({ loading: false, steps: null, error: err, source: null });
                onError?.(err);

            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                appLogger.error('❌ useTemplateLoader: Erro ao carregar template', err);

                if (!isMountedRef.current) return;
                setState({ loading: false, steps: null, error: err, source: null });
                onError?.(err);
            }
        };

        loadTemplate();
    }, [templateId, funnelId, onSuccess, onError]);

    return state;
}

// ============================================================================
// ESTRATÉGIAS DE CARREGAMENTO
// ============================================================================

/**
 * Carrega funnel existente do bridge
 */
async function loadFromFunnel(funnelId: string): Promise<EditableQuizStep[] | null> {
    try {
        // ✅ Verificar cache primeiro
        const cache = UnifiedCacheService.getInstance();
        const cached = cache.get('funnels', funnelId);
        if (cached) {
            appLogger.debug('✅ Funnel carregado do cache:', funnelId);
            return cached as EditableQuizStep[];
        }

        appLogger.debug('📦 Carregando funnel:', funnelId);
        const draft = await quizEditorBridge.loadFunnelForEdit(funnelId);

        if (!draft || !Array.isArray(draft.steps) || draft.steps.length === 0) {
            appLogger.warn('⚠️ Funnel vazio ou inválido:', funnelId);
            return null;
        }

        const validSteps = draft.steps.map((step: any) => ({
            ...step,
            blocks: Array.isArray(step.blocks) ? step.blocks : [],
        }));

        // ✅ Salvar no cache
        cache.set('funnels', funnelId, validSteps);

        appLogger.debug('✅ Funnel carregado:', { steps: validSteps.length });
        return validSteps;
    } catch (error) {
        appLogger.warn('⚠️ Falha ao carregar funnel:', error);
        return null;
    }
}

/**
 * Carrega de Per-Step JSONs individuais (PRIORIDADE!)
 * Cada step tem seu próprio arquivo em public/templates/blocks/step-XX.json
 */
async function loadFromPerStepJSONs(): Promise<EditableQuizStep[] | null> {
    try {
        appLogger.debug('📦 Carregando per-step JSONs individuais...');
        const steps: EditableQuizStep[] = [];
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < 21; i++) {
            const stepId = `step-${String(i + 1).padStart(2, '0')}`;

            try {
                const resp = await fetch(`/templates/blocks/${stepId}.json`);
                
                if (!resp.ok) {
                    appLogger.warn(`⚠️ Per-step JSON não encontrado: ${stepId}`);
                    failCount++;
                    continue;
                }

                const stepData = await resp.json();
                
                if (!stepData || !Array.isArray(stepData.blocks) || stepData.blocks.length === 0) {
                    appLogger.warn(`⚠️ Per-step JSON inválido ou vazio: ${stepId}`);
                    failCount++;
                    continue;
                }

                // Converter blocos para formato EditableQuizStep
                const blocks = stepData.blocks.map((block: any, idx: number) => ({
                    id: block.id || `${stepId}-block-${idx}`,
                    type: block.type,
                    order: block.order ?? idx,
                    properties: block.properties || {},
                    content: block.content || {},
                    parentId: block.parentId || null,
                }));

                steps.push({
                    id: stepId,
                    type: getStepType(i),
                    order: i + 1,
                    blocks,
                    nextStep: i < 20 ? `step-${String(i + 2).padStart(2, '0')}` : undefined,
                    metadata: stepData.metadata || {},
                });

                successCount++;
                console.log(`✅ [${stepId}] Per-step JSON carregado: ${blocks.length} blocos`);

            } catch (error) {
                appLogger.warn(`⚠️ Erro ao carregar ${stepId}:`, error);
                failCount++;
            }
        }

        if (successCount === 0) {
            appLogger.warn('❌ Nenhum per-step JSON foi carregado com sucesso');
            return null;
        }

        if (failCount > 0) {
            appLogger.warn(`⚠️ ${failCount}/21 per-step JSONs falharam ao carregar`);
        }

        appLogger.debug(`✅ Per-step JSONs carregados: ${successCount}/21 steps, ${steps.reduce((sum, s) => sum + s.blocks.length, 0)} blocos`);
        return steps;

    } catch (error) {
        appLogger.warn('⚠️ Falha ao carregar per-step JSONs:', error);
        return null;
    }
}

// Master JSON e TS fallback removidos — per design: apenas 2 fontes confiáveis

/**
 * Determina o tipo do step baseado no índice
 */
function getStepType(index: number): EditableQuizStep['type'] {
    if (index === 0) return 'intro';
    if (index >= 1 && index <= 10) return 'question';
    if (index === 11) return 'transition';
    if (index >= 12 && index <= 17) return 'strategic-question';
    if (index === 18) return 'transition-result';
    if (index === 19) return 'result';
    return 'offer';
}
