/**
 * 🚀 EDITOR MODULAR PRINCIPAL
 * 
 * Componente principal que integra todo o sistema modular.
 * Substitui o QuizFunnelEditorWYSIWYG com arquitetura completamente modular.
 */

import React, { useState, useEffect } from 'react';
import { useModularEditor } from './useModularEditor';
import { ModularDragDropProvider } from './drag-drop';
import { ModularStepRenderer, ComponentLibrary } from './visual-editor';
import { ModularPropertiesPanel } from './properties-panel';
import { SortableStepContainer } from './drag-drop';
import { createStepFromTemplate, STEP_TEMPLATES } from './factory';
import { ModularStep, ComponentType } from './types';

// 🎯 Props do editor principal
interface ModularQuizEditorProps {
    initialSteps?: ModularStep[];
    onSave?: (steps: ModularStep[]) => void;
    onPreview?: (steps: ModularStep[]) => void;
    onExport?: (data: any) => void;
    className?: string;
}

export const ModularQuizEditor: React.FC<ModularQuizEditorProps> = ({
    initialSteps = [],
    onSave,
    onPreview,
    onExport,
    className
}) => {
    // 🎛️ Estado do editor
    const {
        state,
        currentStep,
        selectedComponent,
        canUndo,
        canRedo,
        isValid,
        validationErrors,
        stepActions,
        componentActions,
        editorActions,
        utils
    } = useModularEditor(initialSteps);

    // 🎨 Estado da UI
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);
    const [showTemplates, setShowTemplates] = useState(false);

    // 💾 Auto-save
    useEffect(() => {
        if (onSave && state.steps.length > 0) {
            const timeoutId = setTimeout(() => {
                onSave(state.steps);
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [state.steps, onSave]);

    // 🎬 Handlers
    const handleAddStepFromTemplate = (templateId: string) => {
        const newStep = createStepFromTemplate(templateId);
        stepActions.addStep(newStep);
        setShowTemplates(false);
    };

    const handleAddComponent = (type: ComponentType) => {
        if (!currentStep) return;
        componentActions.addComponent(currentStep.id, type);
    };

    const handleStepReorder = (fromIndex: number, toIndex: number) => {
        stepActions.reorderSteps(fromIndex, toIndex);
    };

    const handleComponentReorder = (stepId: string, fromIndex: number, toIndex: number) => {
        componentActions.reorderComponents(stepId, fromIndex, toIndex);
    };

    const handleComponentMove = (componentId: string, fromStepId: string, toStepId: string, toIndex: number) => {
        // Implementar movimento de componente entre etapas
        const component = utils.getComponentById(fromStepId, componentId);
        if (!component) return;

        componentActions.deleteComponent(fromStepId, componentId);
        // Adicionar na nova etapa com nova ordem
        // Esta funcionalidade precisa ser implementada no hook
    };

    const handleExport = () => {
        const exportData = utils.exportData();
        if (onExport) {
            onExport(exportData);
        } else {
            // Download como JSON
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'quiz-modular.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className={`h-screen flex bg-gray-50 ${className || ''}`}>
            <ModularDragDropProvider
                onStepReorder={handleStepReorder}
                onComponentReorder={handleComponentReorder}
                onComponentMove={handleComponentMove}
            >
                {/* Sidebar esquerda */}
                {sidebarOpen && (
                    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                        {/* Header da sidebar */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Editor Modular
                                </h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ←
                                </button>
                            </div>

                            {/* Controles principais */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={editorActions.undo}
                                    disabled={!canUndo}
                                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                                    title="Desfazer"
                                >
                                    ↶
                                </button>
                                <button
                                    onClick={editorActions.redo}
                                    disabled={!canRedo}
                                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                                    title="Refazer"
                                >
                                    ↷
                                </button>
                                <button
                                    onClick={editorActions.togglePreviewMode}
                                    className={`px-3 py-1 text-sm rounded ${state.previewMode
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    👁️
                                </button>
                                <button
                                    onClick={editorActions.toggleDragMode}
                                    className={`px-3 py-1 text-sm rounded ${state.dragMode
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    title="Modo de arrastar"
                                >
                                    ↕️
                                </button>
                            </div>
                        </div>

                        {/* Lista de etapas */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Etapas ({state.steps.length})
                                </h3>
                                <button
                                    onClick={() => setShowTemplates(true)}
                                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    + Etapa
                                </button>
                            </div>

                            {state.steps.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4 text-gray-300">📋</div>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Nenhuma etapa criada ainda
                                    </p>
                                    <button
                                        onClick={() => setShowTemplates(true)}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                    >
                                        Criar primeira etapa
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {state.steps.map((step, index) => (
                                        <div
                                            key={step.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${state.currentStepId === step.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => stepActions.selectStep(step.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {step.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {step.components.length} componentes
                                                    </p>
                                                </div>
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            stepActions.duplicateStep(step.id);
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-green-600"
                                                        title="Duplicar etapa"
                                                    >
                                                        📋
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            stepActions.deleteStep(step.id);
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-red-600"
                                                        title="Excluir etapa"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Biblioteca de componentes */}
                        <div className="border-t border-gray-200">
                            <ComponentLibrary onAddComponent={handleAddComponent} />
                        </div>
                    </div>
                )}

                {/* Botão para reabrir sidebar */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="fixed left-4 top-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        →
                    </button>
                )}

                {/* Área principal de edição */}
                <div className="flex-1 flex flex-col">
                    {/* Toolbar superior */}
                    <div className="bg-white border-b border-gray-200 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Quiz Modular
                                </h1>
                                {!isValid && (
                                    <div className="flex items-center space-x-2 text-red-600">
                                        <span className="text-sm">⚠️</span>
                                        <span className="text-sm font-medium">
                                            {validationErrors.length} erro(s)
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onPreview?.(state.steps)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Visualizar
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Exportar
                                </button>
                                <button
                                    onClick={() => onSave?.(state.steps)}
                                    disabled={!isValid}
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Canvas de edição */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {currentStep ? (
                            <div className="max-w-4xl mx-auto">
                                <SortableStepContainer steps={[currentStep]}>
                                    {(step) => (
                                        <ModularStepRenderer
                                            step={step}
                                            isSelected={true}
                                            isEditing={!state.previewMode}
                                            selectedComponentId={state.selectedComponentId}
                                            onSelectStep={() => stepActions.selectStep(step.id)}
                                            onSelectComponent={componentActions.selectComponent}
                                            onUpdateComponent={(componentId, updates) =>
                                                componentActions.updateComponent(step.id, componentId, updates)
                                            }
                                            onDeleteComponent={(componentId) =>
                                                componentActions.deleteComponent(step.id, componentId)
                                            }
                                            onDuplicateComponent={(componentId) =>
                                                componentActions.duplicateComponent(step.id, componentId)
                                            }
                                            onMoveComponentUp={(componentId) =>
                                                componentActions.moveComponentUp(step.id, componentId)
                                            }
                                            onMoveComponentDown={(componentId) =>
                                                componentActions.moveComponentDown(step.id, componentId)
                                            }
                                            onAddComponent={(type, order) =>
                                                componentActions.addComponent(step.id, type, order)
                                            }
                                        />
                                    )}
                                </SortableStepContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <div className="text-6xl mb-4 text-gray-300">🎨</div>
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                                        Selecione uma etapa para editar
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Crie uma nova etapa ou selecione uma existente na sidebar.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Painel de propriedades */}
                {propertiesPanelOpen && (
                    <ModularPropertiesPanel
                        selectedStep={currentStep || null}
                        selectedComponent={selectedComponent || null}
                        onUpdateStep={(updates) => {
                            if (currentStep) {
                                stepActions.updateStep(currentStep.id, updates);
                            }
                        }}
                        onUpdateComponent={(updates) => {
                            if (currentStep && selectedComponent) {
                                componentActions.updateComponent(currentStep.id, selectedComponent.id, updates);
                            }
                        }}
                        onClose={() => setPropertiesPanelOpen(false)}
                    />
                )}

                {/* Botão para reabrir painel de propriedades */}
                {!propertiesPanelOpen && (
                    <button
                        onClick={() => setPropertiesPanelOpen(true)}
                        className="fixed right-4 top-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        ⚙️
                    </button>
                )}

                {/* Modal de templates */}
                {showTemplates && (
                    <TemplateModal
                        onSelectTemplate={handleAddStepFromTemplate}
                        onClose={() => setShowTemplates(false)}
                    />
                )}
            </ModularDragDropProvider>
        </div>
    );
};

// 📋 Modal de seleção de templates
interface TemplateModalProps {
    onSelectTemplate: (templateId: string) => void;
    onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
    onSelectTemplate,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Escolher Template de Etapa
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {STEP_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => onSelectTemplate(template.id)}
                                className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-2xl">{template.preview}</span>
                                    <h4 className="font-medium text-gray-900">
                                        {template.name}
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {template.description}
                                </p>
                                <div className="mt-2 text-xs text-gray-500">
                                    {template.components.length} componentes
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModularQuizEditor;