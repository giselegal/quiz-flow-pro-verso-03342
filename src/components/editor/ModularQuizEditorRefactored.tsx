/**
 * 🎭 MODULAR QUIZ EDITOR REFACTORED
 * 
 * Editor completamente refatorado usando o novo sistema modular.
 * Resolve TODOS os 7 gargalos críticos identificados.
 * 
 * GARGALOS RESOLVIDOS:
 * ✅ #1: Estado Monolítico → Map descentralizado
 * ✅ #2: Acoplamento Produção → Adaptadores
 * ✅ #3: Reordenação Incompleta → Drag & Drop funcional
 * ✅ #4: Falta de Abstração → Tipos dedicados
 * ✅ #5: Renderização Complexa → Factory pattern
 * ✅ #6: Sem Validação → Sistema completo
 * ✅ #7: Fragmentação → Orchestrator central
 */

import React, { useState, useCallback } from 'react';
import { useEditorOrchestrator } from './orchestrator/EditorOrchestrator';
import { DragHandle } from './drag-drop/FunctionalDragDropManager';
import type { EditorStep, SupportedStepType } from './types/EditorStepTypes';
import type { QuizStep } from '@/data/quizSteps';

// 🎨 Props do editor refatorado
interface ModularQuizEditorRefactoredProps {
    initialSteps?: EditorStep[];
    onSave?: (steps: QuizStep[]) => Promise<void>;
    onStepSelect?: (stepId: string | null) => void;
    readOnly?: boolean;
    showMetrics?: boolean;
}

// 📊 Componente de métricas de performance
const PerformanceMetrics: React.FC<{ orchestrator: any }> = ({ orchestrator }) => {
    const { metrics, state } = orchestrator;

    return (
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-2">📊 Métricas de Performance</h4>
            <div className="grid grid-cols-2 gap-2">
                <div>Operações: {metrics.totalOperations}</div>
                <div>Última: {metrics.lastOperationTime.toFixed(2)}ms</div>
                <div>Média: {metrics.averageOperationTime.toFixed(2)}ms</div>
                <div>Cache hits: {metrics.validationCacheHits}</div>
                <div>Steps: {state.steps.size}</div>
                <div>Válidos: {orchestrator.getValidationSummary().valid}</div>
            </div>
        </div>
    );
};

// 🎭 Componente principal do editor refatorado
export const ModularQuizEditorRefactored: React.FC<ModularQuizEditorRefactoredProps> = ({
    initialSteps = [],
    onSave,
    onStepSelect,
    readOnly = false,
    showMetrics = false
}) => {
    // 🎭 Orchestrator central - resolve GARGALO #7
    const orchestrator = useEditorOrchestrator(initialSteps, {
        enableValidation: true,
        enableAutoSave: true,
        enableDragDrop: !readOnly,
        enableMetrics: showMetrics
    });

    const { state, renderStep, addStep, deleteStep, selectStep, save } = orchestrator;

    // 🎯 Estados locais mínimos
    const [isAddingStep, setIsAddingStep] = useState(false);
    const [addStepType, setAddStepType] = useState<SupportedStepType>('intro');

    // ➕ Adicionar novo step
    const handleAddStep = useCallback(async () => {
        setIsAddingStep(true);
        try {
            const newStep = await addStep(addStepType);
            selectStep(newStep.id);
            onStepSelect?.(newStep.id);
        } catch (error) {
            console.error('Erro ao adicionar step:', error);
        } finally {
            setIsAddingStep(false);
        }
    }, [addStep, addStepType, selectStep, onStepSelect]);

    // 🗑️ Deletar step
    const handleDeleteStep = useCallback(async (stepId: string) => {
        if (confirm('Tem certeza que deseja excluir este step?')) {
            await deleteStep(stepId);
        }
    }, [deleteStep]);

    // 💾 Salvar
    const handleSave = useCallback(async () => {
        await save();
        if (onSave) {
            const exportedSteps = orchestrator.export();
            await onSave(exportedSteps);
        }
    }, [save, onSave, orchestrator]);

    // 🎨 Renderizar lista de steps ordenada
    const orderedSteps = orchestrator.store.getStepsByOrder();

    return (
        <div className="flex h-screen bg-gray-50">

            {/* 📋 SIDEBAR - Lista de Steps */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">

                {/* 🎯 Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Quiz Editor Modular
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {state.steps.size} steps • {state.hasUnsavedChanges ? 'Não salvo' : 'Salvo'}
                    </p>
                </div>

                {/* ➕ Adicionar Step */}
                {!readOnly && (
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex gap-2">
                            <select
                                value={addStepType}
                                onChange={(e) => setAddStepType(e.target.value as SupportedStepType)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="intro">Introdução</option>
                                <option value="question">Pergunta</option>
                                <option value="result">Resultado</option>
                                <option value="transition">Transição</option>
                                <option value="offer">Oferta</option>
                                <option value="strategic_question">Pergunta Estratégica</option>
                            </select>
                            <button
                                onClick={handleAddStep}
                                disabled={isAddingStep}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                            >
                                {isAddingStep ? '...' : '+'}
                            </button>
                        </div>
                    </div>
                )}

                {/* 📋 Lista de Steps - resolve GARGALO #1 com Map */}
                <div className="flex-1 overflow-y-auto">
                    {orderedSteps.map((step: any, index: number) => (
                        <div
                            key={step.id}
                            className={`
                p-3 border-b border-gray-100 cursor-pointer transition-colors
                ${state.selectedStepId === step.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
              `}
                            onClick={() => {
                                selectStep(step.id);
                                onStepSelect?.(step.id);
                            }}
                        >
                            <div className="flex items-center gap-2">

                                {/* 🖱️ Drag Handle - resolve GARGALO #3 */}
                                {!readOnly && (
                                    <DragHandle
                                        stepId={step.id}
                                        stepType={step.type}
                                        onDragStart={orchestrator.store.reorderStep}
                                    />
                                )}

                                {/* 📝 Info do Step */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
                                            {step.type}
                                        </span>
                                        {step.meta.validationState === 'invalid' && (
                                            <span className="text-xs text-red-600">⚠️</span>
                                        )}
                                        {step.meta.hasUnsavedChanges && (
                                            <span className="text-xs text-orange-600">●</span>
                                        )}
                                    </div>
                                    <p className="font-medium text-sm text-gray-900 truncate mt-1">
                                        {step.data.title || `Step ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {step.data.subtitle || 'Sem subtítulo'}
                                    </p>
                                </div>

                                {/* 🗑️ Delete Button */}
                                {!readOnly && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteStep(step.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {orderedSteps.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <p>Nenhum step criado ainda.</p>
                            <p className="text-sm mt-1">Clique no botão + para adicionar.</p>
                        </div>
                    )}
                </div>

                {/* 📊 Métricas (se habilitado) */}
                {showMetrics && (
                    <div className="p-4 border-t border-gray-200">
                        <PerformanceMetrics orchestrator={orchestrator} />
                    </div>
                )}

                {/* 💾 Actions */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={state.isLoading || !state.hasUnsavedChanges}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                            {state.isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            onClick={() => orchestrator.validateAll()}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                            Validar
                        </button>
                    </div>
                </div>

            </div>

            {/* 🎨 MAIN AREA - Step Preview/Editor */}
            <div className="flex-1 flex flex-col">

                {/* 🎯 Header */}
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            {state.selectedStepId ? (
                                <h3 className="text-lg font-medium text-gray-900">
                                    Editando Step
                                </h3>
                            ) : (
                                <h3 className="text-lg font-medium text-gray-900">
                                    Selecione um step para editar
                                </h3>
                            )}
                        </div>

                        {/* 🔍 Navegação de Steps */}
                        {state.selectedStepId && (
                            <div className="flex gap-2">
                                <button
                                    onClick={orchestrator.selectPreviousStep}
                                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    ← Anterior
                                </button>
                                <button
                                    onClick={orchestrator.selectNextStep}
                                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    Próximo →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 🎭 Área de Renderização - resolve GARGALO #5 com Factory */}
                <div className="flex-1 overflow-y-auto p-6">
                    {state.selectedStepId ? (
                        <div className="max-w-2xl mx-auto">
                            {/* Renderiza usando o Factory Pattern */}
                            {renderStep(state.selectedStepId, {
                                readOnly,
                                isEditing: !readOnly
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <p className="text-xl mb-2">👆</p>
                                <p>Selecione um step na barra lateral</p>
                                <p className="text-sm mt-1">para visualizar e editar</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default ModularQuizEditorRefactored;