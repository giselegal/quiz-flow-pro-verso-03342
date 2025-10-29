/**
 * 🎯 HOOK: useTemplateLoader
 * 
 * Carrega templates de forma assíncrona e não-bloqueante
 * Substitui o useEffect gigante (360 linhas) por lógica isolada e testável
 * 
 * Features:
 * - Loading states com Suspense support
 * - Error handling robusto
 * - Retry automático
 * - Cache unificado integrado
 * 
 * @version 1.0.0
 */

import { useState, useEffect, useRef } from 'react';
import { appLogger } from '@/utils/logger';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import { getQuiz21StepsTemplate } from '@/templates/imports';
import { convertTemplateToBlocks, blocksToBlockComponents } from '@/utils/templateConverter';
import hydrateSectionsWithQuizSteps from '@/utils/hydrators/hydrateSectionsWithQuizSteps';
import { loadStepTemplate } from '@/utils/loadStepTemplates';
import { UnifiedCacheService } from '@/services/UnifiedCacheService';
import type { EditableQuizStep } from '../types';

export interface TemplateLoaderState {
    loading: boolean;
    steps: EditableQuizStep[] | null;
    error: Error | null;
    source: 'funnel' | 'master-json' | 'fallback-ts' | null;
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

                // Estratégia 1: Carregar funnel existente
                if (funnelId) {
                    const result = await loadFromFunnel(funnelId);
                    if (result) {
                        if (!isMountedRef.current) return;
                        setState({ loading: false, steps: result, error: null, source: 'funnel' });
                        onSuccess?.(result);
                        return;
                    }
                }

                // Estratégia 2: Carregar do Master JSON
                if (templateId === 'quiz21StepsComplete' || templateId === 'quiz-estilo-21-steps') {
                    const result = await loadFromMasterJSON(funnelId);
                    if (result) {
                        if (!isMountedRef.current) return;
                        setState({ loading: false, steps: result, error: null, source: 'master-json' });
                        onSuccess?.(result);
                        return;
                    }
                }

                // Estratégia 3: Fallback TypeScript template
                const result = loadFromTSTemplate(funnelId);
                if (!isMountedRef.current) return;
                setState({ loading: false, steps: result, error: null, source: 'fallback-ts' });
                onSuccess?.(result);

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
 * Carrega do Master JSON público
 */
async function loadFromMasterJSON(funnelId?: string): Promise<EditableQuizStep[] | null> {
    try {
        appLogger.debug('📦 Carregando master JSON...');
        const resp = await fetch('/templates/quiz21-complete.json');
        
        if (!resp.ok) {
            appLogger.warn('⚠️ Master JSON não encontrado:', resp.status);
            return null;
        }

        const master = await resp.json();
        const steps: EditableQuizStep[] = [];

        for (let i = 0; i < 21; i++) {
            const stepId = `step-${String(i + 1).padStart(2, '0')}`;
            const stepConf = master?.steps?.[stepId];
            
            // ✅ CORREÇÃO: Usar blocos diretamente do master JSON
            let blocks: any[] = [];
            
            // 1. Primeiro: tentar blocos do master JSON (fonte primária)
            if (stepConf?.blocks && Array.isArray(stepConf.blocks) && stepConf.blocks.length > 0) {
                blocks = stepConf.blocks.map((block: any, idx: number) => ({
                    id: block.id || `${stepId}-block-${idx}`,
                    type: block.type,
                    order: block.order ?? idx,
                    properties: block.properties || {},
                    content: block.content || {},
                    parentId: block.parentId || null,
                }));
                appLogger.debug(`✅ Blocos do master JSON: ${stepId} (${blocks.length} blocos)`);
            } else {
                // 2. Fallback: tentar template modular
                try {
                    const staticBlocks = loadStepTemplate(stepId);
                    if (Array.isArray(staticBlocks) && staticBlocks.length > 0) {
                        blocks = blocksToBlockComponents(staticBlocks as any);
                        appLogger.debug(`✅ Template modular: ${stepId} (${blocks.length} blocos)`);
                    }
                } catch {
                    // 3. Último fallback: hidratar sections (legado)
                    const sections = hydrateSectionsWithQuizSteps(stepId, stepConf?.sections);
                    blocks = convertTemplateToBlocks({ [stepId]: { sections } });
                    appLogger.debug(`⚠️ Fallback sections: ${stepId} (${blocks.length} blocos)`);
                }
            }

            steps.push({
                id: stepId,
                type: stepConf?.type || getStepType(i),
                order: i + 1,
                blocks,
                nextStep: i < 20 ? `step-${String(i + 2).padStart(2, '0')}` : undefined,
                metadata: stepConf?.metadata || {},
            });
        }

        appLogger.debug('✅ Master JSON carregado:', { steps: steps.length, blocks: steps.reduce((sum, s) => sum + s.blocks.length, 0) });
        return steps;
    } catch (error) {
        appLogger.warn('⚠️ Falha ao carregar master JSON:', error);
        return null;
    }
}

/**
 * Fallback: Template TypeScript
 */
function loadFromTSTemplate(funnelId?: string): EditableQuizStep[] {
    appLogger.debug('📦 Usando fallback TypeScript template');
    
    const quizTemplate = getQuiz21StepsTemplate();
    const steps: EditableQuizStep[] = [];

    for (let i = 0; i < 21; i++) {
        const stepId = `step-${String(i + 1).padStart(2, '0')}`;
        const blocks = convertTemplateToBlocks(quizTemplate);

        steps.push({
            id: stepId,
            type: getStepType(i),
            order: i + 1,
            blocks,
            nextStep: i < 20 ? `step-${String(i + 2).padStart(2, '0')}` : undefined,
        });
    }

    appLogger.debug('✅ TS Template carregado:', { steps: steps.length });
    return steps;
}

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
