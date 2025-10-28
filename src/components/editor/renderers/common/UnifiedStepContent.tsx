import React, { lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { appLogger } from '@/utils/logger';
import { EditableQuizStep } from '@/components/editor/quiz/types';
import { adaptStepData } from '@/utils/StepDataAdapter';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { computeResult } from '@/utils/result/computeResult';
import type { QuizScores } from '@/hooks/useQuizState';
import { useGlobalUI } from '@/hooks/core/useGlobalState';

// Lazy load dos componentes modulares (reduz bundle inicial)
const ModularIntroStep = lazy(() => import('@/components/quiz-modular').then(m => ({ default: m.ModularIntroStep })));
const ModularQuestionStep = lazy(() => import('@/components/quiz-modular').then(m => ({ default: m.ModularQuestionStep })));
const ModularStrategicQuestionStep = lazy(() => import('@/components/quiz-modular').then(m => ({ default: m.ModularStrategicQuestionStep })));
const ModularTransitionStep = lazy(() => import('@/components/quiz-modular').then(m => ({ default: m.ModularTransitionStep })));
const ModularResultStep = lazy(() => import('@/components/quiz-modular').then(m => ({ default: m.ModularResultStep })));
const ModularOfferStep = lazy(() => import('@/components/quiz-modular').then(m => ({ default: m.ModularOfferStep })));

const StepLoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

export interface UnifiedStepContentProps {
    step: EditableQuizStep;
    isEditMode: boolean;
    isPreviewMode: boolean;
    // Preview (interatividade)
    sessionData?: Record<string, any>;
    onUpdateSessionData?: (key: string, value: any) => void;
    // Edição
    selected?: boolean;
    productionParityInEdit?: boolean;
    autoAdvanceInEdit?: boolean;
    onStepClick?: (e: React.MouseEvent, step: EditableQuizStep) => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
}

/**
 * Conteúdo unificado do Step (sem wrappers de overlay). Usado por Edit/Preview.
 */
export const UnifiedStepContent: React.FC<UnifiedStepContentProps> = memo(({
    step,
    isEditMode,
    isPreviewMode,
    sessionData = {},
    onUpdateSessionData,
    productionParityInEdit = true,
    autoAdvanceInEdit = false,
}) => {
    const { ui, togglePropertiesPanel } = useGlobalUI();

    // ✅ ORDENAR BLOCOS ANTES DE ADAPTAR - Fix para renderização fora de ordem
    const sortedStep = useMemo(() => {
        if (!step?.blocks || !Array.isArray(step.blocks)) return step;
        const sortedBlocks = [...step.blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return { ...step, blocks: sortedBlocks } as EditableQuizStep;
    }, [step]);

    // ✅ Memoizar adaptStepData para evitar recálculos desnecessários
    const stepData = useMemo(() => {
        return adaptStepData(sortedStep, { source: 'merge', editorMode: isEditMode });
    }, [sortedStep, isEditMode]);

    // Helper: extrair respostas salvas no preview (answers_<stepId> => string[])
    const getPreviewAnswers = useCallback((): Record<string, string[]> => {
        const map: Record<string, string[]> = {};
        try {
            Object.keys(sessionData || {}).forEach((k) => {
                if (k.startsWith('answers_')) {
                    const stepId = k.replace(/^answers_/, '');
                    const arr = (sessionData as any)[k];
                    if (Array.isArray(arr) && arr.length > 0) {
                        map[stepId] = arr.filter(Boolean);
                    }
                }
            });
        } catch { }
        return map;
    }, [sessionData]);

    // Provider opcional do Editor para seleção/persistência de blocos reais
    const editor = useEditor({ optional: true } as any);
    // Normaliza a chave do step para o formato step-XX (zero à esquerda)
    const stepKey = useMemo(() => {
        const id = String(step?.id || '');
        const m = id.match(/^step-(\d{1,2})$/);
        if (m) {
            const n = parseInt(m[1], 10);
            if (!isNaN(n)) return `step-${String(n).padStart(2, '0')}`;
        }
        return id;
    }, [step?.id]);

    // ✅ CORREÇÃO CRÍTICA: Memoizar estado do editor para evitar re-renders
    const editorState = useMemo(() => ({
        stepBlocks: editor?.state?.stepBlocks || {},
        selectedBlockId: editor?.state?.selectedBlockId || null,
        currentStep: editor?.state?.currentStep || 1,
    }), [
        editor?.state?.stepBlocks,
        editor?.state?.selectedBlockId,
        editor?.state?.currentStep,
    ]);

    const selectedBlockId = editorState.selectedBlockId as string | null;

    const findBlockIdByTypes = useCallback((types: string[]): string | undefined => {
        try {
            const raw = (editorState.stepBlocks as any)[stepKey];
            const blocks: any[] = Array.isArray(raw) ? raw : [];
            const lowerTypes = types.map(t => t.toLowerCase());
            const found = blocks.find?.(b => lowerTypes.includes(String(b.type || '').toLowerCase()));
            return found?.id;
        } catch {
            return undefined;
        }
    }, [editorState.stepBlocks, stepKey]);

    // Helper: busca por predicado customizado
    const findBlockId = useCallback((predicate: (b: any) => boolean): string | undefined => {
        try {
            const raw = (editorState.stepBlocks as any)[stepKey];
            const blocks: any[] = Array.isArray(raw) ? raw : [];
            const found = blocks.find?.(predicate);
            return found?.id;
        } catch {
            return undefined;
        }
    }, [editorState.stepBlocks, stepKey]);

    // Mapear IDs lógicos dos blocos para tipos reais do registry
    const resolveRealBlockId = useCallback((logicalId: string): string | undefined => {
        const normalize = (id: string): string => {
            const lower = String(id || '').toLowerCase();
            if (/-congrats$/.test(lower)) return 'result-congrats';
            if (/(^|-)result$/.test(lower)) return 'result-main';
            if (/-image$/.test(lower)) return 'result-image';
            if (/-description$/.test(lower)) return 'result-description';
            if (/-characteristics$/.test(lower)) return 'result-characteristics';
            if (/-cta$/.test(lower)) return 'result-cta';
            return lower;
        };

        const key = normalize(logicalId);
        switch (key) {
            case 'intro-header': {
                return (
                    findBlockIdByTypes(['quiz-intro-header'])
                    || findBlockIdByTypes(['quiz-logo'])
                    || findBlockIdByTypes(['decorative-bar-inline'])
                );
            }
            case 'intro-title': {
                return (
                    findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /text-inline/i.test(String(b.id)))
                );
            }
            case 'intro-image': {
                return findBlockIdByTypes(['image-display-inline']);
            }
            case 'intro-description': {
                return findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /text-description/i.test(String(b.id)));
            }
            case 'intro-form': {
                return (
                    findBlockIdByTypes(['form-input'])
                    || findBlockIdByTypes(['button-inline'])
                );
            }
            case 'intro-footer': {
                return findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /footer-text/i.test(String(b.id)));
            }

            case 'question-number':
            case 'question-text': {
                return findBlockIdByTypes(['quiz-question-header']);
            }
            case 'question-instructions': {
                return (
                    findBlockIdByTypes(['text-inline', 'paragraph', 'quiz-question-header'])
                    || undefined
                );
            }
            case 'question-options': {
                return findBlockIdByTypes(['quiz-options', 'options-grid']);
            }
            case 'question-button': {
                return findBlockIdByTypes(['quiz-navigation', 'button']);
            }

            case 'result-congrats': {
                return (
                    findBlockIdByTypes(['title', 'text-inline', 'paragraph'])
                );
            }
            case 'result-main': {
                return (
                    findBlockIdByTypes(['result-hero', 'title', 'text-inline'])
                );
            }
            case 'result-image': {
                return (
                    findBlockIdByTypes(['image-display-inline', 'image'])
                );
            }
            case 'result-description': {
                return (
                    findBlockId(b => String(b.type || '').toLowerCase() === 'text-inline' && /result|description/i.test(String(b.id)))
                    || findBlockIdByTypes(['text-inline', 'paragraph'])
                );
            }
            case 'result-characteristics': {
                return (
                    findBlockIdByTypes(['feature-list', 'list-inline', 'bullet-list'])
                    || findBlockIdByTypes(['text-inline'])
                );
            }
            case 'result-cta': {
                return (
                    findBlockIdByTypes(['button-inline', 'button', 'quiz-navigation'])
                );
            }
            default:
                return undefined;
        }
    }, [findBlockIdByTypes, findBlockId]);

    // Abrir painel de propriedades: selecionar bloco real via provider
    const handleOpenProperties = useCallback((blockId: string) => {
        // 1) Tentar resolver ID lógico para ID real (quando vindo de wrappers)
        let realId = resolveRealBlockId(blockId);

        // 2) Fallback: se já for um ID real presente nos blocos do step, usar diretamente
        if (!realId) {
            try {
                const raw = (editorState.stepBlocks as any)[stepKey];
                const blocks: any[] = Array.isArray(raw) ? raw : [];
                if (blocks.some(b => String(b.id) === String(blockId))) {
                    realId = String(blockId);
                }
            } catch { /* noop */ }
        }

        if (realId && editor?.actions?.setSelectedBlockId) {
            editor.actions.setSelectedBlockId(realId);
            try {
                if (!ui?.propertiesPanelOpen) {
                    togglePropertiesPanel();
                }
            } catch { /* noop */ }
        }
    }, [editor?.actions, resolveRealBlockId, editorState.stepBlocks, stepKey, ui?.propertiesPanelOpen, togglePropertiesPanel]);

    // Selecionar um bloco real diretamente (usado pelos steps modulares)
    const handleSelectBlock = useCallback((blockId: string) => {
        try {
            if (editor?.actions?.setSelectedBlockId) {
                editor.actions.setSelectedBlockId(blockId);
            }
            if (!ui?.propertiesPanelOpen) {
                togglePropertiesPanel();
            }
        } catch { /* noop */ }
    }, [editor?.actions, ui?.propertiesPanelOpen, togglePropertiesPanel]);

    // Helper: normalizar chave de step para formato step-XX
    const normalizeStepKey = useCallback((key: string | number): string => {
        const str = String(key);
        const m = str.match(/^step-(\d{1,2})$/);
        if (m) {
            const n = parseInt(m[1], 10);
            if (!isNaN(n)) return `step-${String(n).padStart(2, '0')}`;
        }
        // Se for apenas número, adicionar prefixo
        const num = parseInt(str, 10);
        if (!isNaN(num)) return `step-${String(num).padStart(2, '0')}`;
        return str;
    }, []);

    // Callbacks para persistência integrado com EditorProvider
    const handleEdit = useCallback(async (field: string, value: any) => {
        // 1. Atualizar metadata local para feedback imediato
        (stepData as any).metadata = {
            ...((stepData as any).metadata || {}),
            [field]: value,
        };

        // 2. Persistir no EditorStateManager para histórico e re-renderização
        if (editor?.actions?.updateBlock && stepData?.id) {
            try {
                const stepKey = normalizeStepKey(step.id || '1');
                await editor.actions.updateBlock(stepKey, stepData.id, {
                    metadata: {
                        ...((stepData as any).metadata || {}),
                        [field]: value,
                    }
                });
                appLogger.debug('✅ handleEdit persistido:', { field, value, stepKey, blockId: stepData.id });
            } catch (err) {
                appLogger.error('❌ Erro ao persistir edição:', err);
            }
        }
    }, [editor, stepData, step.id, normalizeStepKey]);

    const handleBlocksReorder = useCallback(async (stepId: string, newOrder: string[]) => {
        // 1. Persistir ordem lógica no metadata (feedback imediato)
        await handleEdit('blockOrder', newOrder);

        // 2. Persistir ordem no EditorStateManager
        if (!editor?.actions?.reorderBlocks || !editor?.state?.stepBlocks) {
            appLogger.debug('⏭️ Skip reorderBlocks: editor não disponível');
            return;
        }

        try {
            const normalizedKey = normalizeStepKey(stepId);
            const blocks: any[] = (editor.state.stepBlocks as any)[normalizedKey] || [];

            if (!Array.isArray(blocks) || blocks.length === 0) {
                appLogger.debug('⏭️ Skip reorderBlocks: sem blocos no step', normalizedKey);
                return;
            }

            // Mapear IDs lógicos para IDs reais (resolveRealBlockId ou usar direto)
            const currentOrder = blocks.map(b => String(b.id));
            const desiredOrder: string[] = [];

            for (const logicalId of newOrder) {
                const realId = resolveRealBlockId(logicalId) || logicalId;
                if (realId && currentOrder.includes(realId) && !desiredOrder.includes(realId)) {
                    desiredOrder.push(realId);
                }
            }

            // Verificar se ordem mudou
            const isSameOrder = desiredOrder.length === currentOrder.length &&
                desiredOrder.every((id, i) => id === currentOrder[i]);

            if (isSameOrder) {
                appLogger.debug('⏭️ Skip reorderBlocks: ordem já está correta');
                return;
            }

            // Aplicar reordenação sequencialmente
            const workingOrder = [...currentOrder];
            for (let newIndex = 0; newIndex < desiredOrder.length; newIndex++) {
                const targetId = desiredOrder[newIndex];
                const currentIndex = workingOrder.indexOf(targetId);

                if (currentIndex !== -1 && currentIndex !== newIndex) {
                    await editor.actions.reorderBlocks(normalizedKey, currentIndex, newIndex);
                    // Atualizar array local para próxima iteração
                    const [movedItem] = workingOrder.splice(currentIndex, 1);
                    workingOrder.splice(newIndex, 0, movedItem);
                    appLogger.debug('✅ Bloco reordenado:', { targetId, from: currentIndex, to: newIndex });
                }
            }

            appLogger.debug('✅ handleBlocksReorder concluído:', { stepId: normalizedKey, newOrder: desiredOrder });
        } catch (err) {
            appLogger.error('❌ Erro ao reordenar blocos:', err);
        }
    }, [editor, normalizeStepKey, resolveRealBlockId, handleEdit]);

    // Callback para adicionar novos blocos
    const handleAddBlock = useCallback(async (blockType: string, position?: number) => {
        if (!editor?.actions?.addBlockAtIndex && !editor?.actions?.addBlock) {
            appLogger.warn('⏭️ Skip addBlock: editor não disponível');
            return;
        }

        try {
            const normalizedKey = normalizeStepKey(step.id || '1');
            const blocks: any[] = (editor.state?.stepBlocks as any)?.[normalizedKey] || [];

            const newBlock: any = {
                id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: blockType as any,
                content: {},
                order: position ?? blocks.length,
            };

            if (position !== undefined && editor.actions.addBlockAtIndex) {
                await editor.actions.addBlockAtIndex(normalizedKey, newBlock, position);
                appLogger.debug('✅ Bloco adicionado na posição:', { blockType, position, blockId: newBlock.id });
            } else if (editor.actions.addBlock) {
                await editor.actions.addBlock(normalizedKey, newBlock);
                appLogger.debug('✅ Bloco adicionado no final:', { blockType, blockId: newBlock.id });
            }
        } catch (err) {
            appLogger.error('❌ Erro ao adicionar bloco:', err);
        }
    }, [editor, normalizeStepKey, step.id]); const renderStepComponent = () => {
        switch (step.type) {
            case 'intro': {
                return (
                    <ModularIntroStep
                        data={stepData as any}
                        blocks={(step as any)?.blocks || (editorState.stepBlocks as any)[stepKey] || []}
                        isEditable={isEditMode}
                        selectedBlockId={(selectedBlockId || undefined) as any}
                        onBlockSelect={handleSelectBlock}
                        onEdit={handleEdit}
                        onBlocksReorder={handleBlocksReorder}
                        onOpenProperties={handleOpenProperties}
                        onNameSubmit={(name: string) => {
                            if ((isEditMode && productionParityInEdit) || isPreviewMode) {
                                onUpdateSessionData?.('userName', name);
                            }
                        }}
                    />
                );
            }
            case 'question': {
                return (
                    <ModularQuestionStep
                        data={stepData as any}
                        blocks={((editorState.stepBlocks as any)[stepKey] && (editorState.stepBlocks as any)[stepKey].length > 0)
                            ? (editorState.stepBlocks as any)[stepKey]
                            : ((step as any)?.blocks || [])}
                        isEditable={isEditMode}
                        selectedBlockId={(selectedBlockId || undefined) as any}
                        onBlockSelect={handleSelectBlock}
                        currentAnswers={(sessionData as any)[`answers_${stepKey}`] || []}
                        enableAutoAdvance={isEditMode ? !!autoAdvanceInEdit : true}
                        onAnswersChange={(answers: string[]) => {
                            if ((isEditMode && productionParityInEdit) || isPreviewMode) {
                                onUpdateSessionData?.(`answers_${stepKey}`, answers);
                            }
                        }}
                        onEdit={handleEdit}
                        onBlocksReorder={handleBlocksReorder}
                        onOpenProperties={handleOpenProperties}
                    />
                );
            }
            case 'strategic-question': {
                return (
                    <ModularStrategicQuestionStep
                        data={stepData as any}
                        blocks={(step as any)?.blocks || (editorState.stepBlocks as any)[stepKey] || []}
                        isEditable={isEditMode}
                        selectedBlockId={(selectedBlockId || undefined) as any}
                        onBlockSelect={handleSelectBlock}
                        currentAnswer={(sessionData as any)[`answer_${stepKey}`] || ''}
                        onAnswerChange={(answer: string) => {
                            if ((isEditMode && productionParityInEdit) || isPreviewMode) {
                                onUpdateSessionData?.(`answer_${stepKey}`, answer);
                            }
                        }}
                        onEdit={handleEdit}
                        onBlocksReorder={handleBlocksReorder}
                        onOpenProperties={handleOpenProperties}
                    />
                );
            }
            case 'transition':
            case 'transition-result': {
                return (
                    <ModularTransitionStep
                        data={{ ...stepData, type: step.type } as any}
                        blocks={(step as any)?.blocks || (editorState.stepBlocks as any)[stepKey] || []}
                        isEditable={isEditMode}
                        enableAutoAdvance={isEditMode ? !!autoAdvanceInEdit : true}
                        selectedBlockId={(selectedBlockId || undefined) as any}
                        onBlockSelect={handleSelectBlock}
                        onOpenProperties={handleOpenProperties}
                        onComplete={() => {
                            // Mantém comportamento existente de auto-avançar quando aplicável
                            try { (editor as any)?.actions?.nextStep?.(); } catch { }
                        }}
                        onBlocksReorder={handleBlocksReorder}
                    />
                );
            }
            case 'result': {
                const answers = getPreviewAnswers();
                const { primaryStyleId, secondaryStyleIds, scores } = computeResult({ answers });
                const hasAnyScore = !!scores && Object.values(scores as any).some((v: any) => Number(v) > 0);
                const typedScores: QuizScores = hasAnyScore ? {
                    natural: (scores as any).natural || 0,
                    classico: (scores as any).classico || 0,
                    contemporaneo: (scores as any).contemporaneo || 0,
                    elegante: (scores as any).elegante || 0,
                    romantico: (scores as any).romantico || 0,
                    sexy: (scores as any).sexy || 0,
                    dramatico: (scores as any).dramatico || 0,
                    criativo: (scores as any).criativo || 0,
                } : {
                    natural: 34,
                    classico: 22,
                    contemporaneo: 18,
                    elegante: 16,
                    romantico: 6,
                    sexy: 2,
                    dramatico: 1,
                    criativo: 1,
                };

                return (
                    <ModularResultStep
                        data={stepData as any}
                        blocks={(step as any)?.blocks || (editorState.stepBlocks as any)[stepKey] || []}
                        isEditable={isEditMode}
                        onBlocksReorder={handleBlocksReorder}
                        userProfile={{
                            userName: (sessionData as any).userName || 'Visitante',
                            resultStyle: (primaryStyleId || (sessionData as any).resultStyle || (isEditMode ? 'natural' : '')) || 'natural',
                            secondaryStyles: secondaryStyleIds?.length ? secondaryStyleIds : ((sessionData as any).secondaryStyles || (isEditMode ? ['classico', 'contemporaneo'] : [])),
                            scores: Object.entries(typedScores).map(([name, score]) => ({ name, score: Number(score) })),
                        }}
                        selectedBlockId={(selectedBlockId || undefined) as any}
                        onBlockSelect={handleSelectBlock}
                        onOpenProperties={handleOpenProperties}
                    />
                );
            }
            case 'offer': {
                const answers = getPreviewAnswers();
                const { primaryStyleId, secondaryStyleIds } = computeResult({ answers });

                return (
                    <ModularOfferStep
                        data={stepData as any}
                        blocks={(step as any)?.blocks || (editorState.stepBlocks as any)[stepKey] || []}
                        isEditable={isEditMode}
                        userProfile={{
                            userName: (sessionData as any).userName || 'Visitante',
                            resultStyle: primaryStyleId || (sessionData as any).resultStyle || 'natural',
                            secondaryStyles: secondaryStyleIds?.length ? secondaryStyleIds : ((sessionData as any).secondaryStyles || []),
                        }}
                        offerKey={(sessionData as any).offerKey || 'default'}
                        onEdit={handleEdit}
                        onBlocksReorder={handleBlocksReorder}
                        selectedBlockId={(selectedBlockId || undefined) as any}
                        onBlockSelect={handleSelectBlock}
                        onOpenProperties={handleOpenProperties}
                    />
                );
            }
            default:
                return (
                    <div className="p-8 text-center bg-gray-100 rounded-lg">
                        <p className="text-gray-600">
                            Tipo de step desconhecido: <code>{(step as any).type}</code>
                        </p>
                    </div>
                );
        }
    };

    return (
        <Suspense fallback={<StepLoadingFallback />}>
            {renderStepComponent()}
        </Suspense>
    );
});

UnifiedStepContent.displayName = 'UnifiedStepContent';

export default UnifiedStepContent;
