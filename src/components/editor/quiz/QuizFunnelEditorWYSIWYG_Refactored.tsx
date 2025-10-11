/**
 * ⚠️ ⚠️ ⚠️ DEPRECATED - NÃO USAR ⚠️ ⚠️ ⚠️
 * @deprecated Use QuizModularProductionEditor - Ver MIGRATION_EDITOR.md
 */

import React, { memo } from 'react';
import { useUnifiedCRUD } from '@/contexts';

// 🔥 NOVO: Hook central de estado
import { useQuizEditorState } from './hooks/useQuizEditorState';

// 🔥 NOVO: Componentes modulares
import QuizEditorCanvas from './components/QuizEditorCanvas';
import QuizEditorSidebar from './components/QuizEditorSidebar';
import QuizEditorToolbar from './components/QuizEditorToolbar';
import QuizEditorPropertiesPanel from './components/QuizEditorPropertiesPanel';

import './QuizEditorStyles.css';
import './styles/QuizEditorModular.css';

/**
 * 🎯 QUIZ FUNNEL EDITOR WYSIWYG - REFATORADO
 * 
 * Editor principal completamente modularizado
 * Reduzido de 1387 linhas para ~200 linhas
 * Estado centralizado no hook useQuizEditorState
 * Componentes independentes e testáveis
 */

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

const QuizFunnelEditorWYSIWYG: React.FC<QuizFunnelEditorProps> = memo(({
    funnelId,
    templateId
}) => {
    const crud = useUnifiedCRUD();

    // 🎯 Estado centralizado
    const {
        // Core state
        steps,
        modularSteps,
        selectedId,
        selectedBlockId,

        // UI state
        previewMode,
        showPropertiesPanel,
        dragEnabled,
        useModularSystem,

        // Editor state
        selectedComponentId,
        activeInsertDropdown,
        isSaving,
        isPreviewMode,

        // Computed
        selectedStep,
        selectedModularStep,
        currentSteps,

        // Actions
        setSelectedId,
        setSelectedBlockId,
        setPreviewMode,
        setShowPropertiesPanel,
        setDragEnabled,
        setUseModularSystem,
        setSelectedComponentId,
        setActiveInsertDropdown,
        setIsSaving,
        setIsPreviewMode,
        updateSteps,
        updateModularSteps,
        updateState,
    } = useQuizEditorState();

    // 🔧 Handlers simplificados
    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (crud.currentFunnel) {
                const updatedFunnel = {
                    ...crud.currentFunnel,
                    quizSteps: useModularSystem ? modularSteps : steps
                };
                await crud.saveFunnel(updatedFunnel);
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStep = (stepId: string, updates: any) => {
        if (useModularSystem) {
            const newSteps = modularSteps.map(step =>
                step.id === stepId ? { ...step, ...updates } : step
            );
            updateModularSteps(newSteps);
        } else {
            const newSteps = steps.map(step =>
                step.id === stepId ? { ...step, ...updates } : step
            );
            updateSteps(newSteps);
        }
    };

    const handleReorderSteps = (newOrder: string[]) => {
        if (useModularSystem) {
            const reordered = newOrder.map(id =>
                modularSteps.find(step => step.id === id)!
            ).filter(Boolean);
            updateModularSteps(reordered);
        } else {
            const reordered = newOrder.map(id =>
                steps.find(step => step.id === id)!
            ).filter(Boolean);
            updateSteps(reordered);
        }
    };

    const handleDuplicateStep = (stepId: string) => {
        if (useModularSystem) {
            const stepToDuplicate = modularSteps.find(s => s.id === stepId);
            if (stepToDuplicate) {
                const duplicated = {
                    ...stepToDuplicate,
                    id: `step-${Date.now()}`,
                    name: `${stepToDuplicate.name} (Cópia)`,
                    components: stepToDuplicate.components.map(comp => ({
                        ...comp,
                        id: `comp-${Date.now()}-${Math.random()}`
                    }))
                };
                updateModularSteps([...modularSteps, duplicated]);
            }
        } else {
            const stepToDuplicate = steps.find(s => s.id === stepId);
            if (stepToDuplicate) {
                const duplicated = {
                    ...stepToDuplicate,
                    id: `step-${Date.now()}`
                };
                updateSteps([...steps, duplicated]);
            }
        }
    };

    const handleDeleteStep = (stepId: string) => {
        if (useModularSystem) {
            const filtered = modularSteps.filter(s => s.id !== stepId);
            updateModularSteps(filtered);
            if (selectedId === stepId && filtered.length > 0) {
                setSelectedId(filtered[0].id);
            }
        } else {
            const filtered = steps.filter(s => s.id !== stepId);
            updateSteps(filtered);
            if (selectedId === stepId && filtered.length > 0) {
                setSelectedId(filtered[0].id);
            }
        }
    };

    const handleAddStep = () => {
        const newStep = {
            id: `step-${Date.now()}`,
            type: 'intro' as const,
            name: 'Novo Step',
            components: []
        };

        if (useModularSystem) {
            updateModularSteps([...modularSteps, newStep]);
        } else {
            const traditionStep = {
                id: newStep.id,
                type: 'intro' as const,
                title: 'Novo Step',
                formQuestion: 'Como posso te chamar?',
                placeholder: 'Digite seu nome',
                buttonText: 'Continuar',
                nextStep: ''
            };
            updateSteps([...steps, traditionStep]);
        }
        setSelectedId(newStep.id);
    };

    const handleExport = () => {
        const dataToExport = {
            steps: useModularSystem ? modularSteps : steps,
            metadata: {
                version: '2.0',
                system: useModularSystem ? 'modular' : 'traditional',
                exportedAt: new Date().toISOString()
            }
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-${funnelId || 'export'}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        if (data.steps) {
                            if (data.metadata?.system === 'modular') {
                                updateModularSteps(data.steps);
                                setUseModularSystem(true);
                            } else {
                                updateSteps(data.steps);
                                setUseModularSystem(false);
                            }
                            if (data.steps.length > 0) {
                                setSelectedId(data.steps[0].id);
                            }
                        }
                    } catch (error) {
                        console.error('Erro ao importar:', error);
                        alert('Erro ao importar arquivo. Verifique se o formato está correto.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return (
        <div className="quiz-editor-main">
            {/* 🛠️ Toolbar Principal */}
            <QuizEditorToolbar
                previewMode={previewMode}
                useModularSystem={useModularSystem}
                dragEnabled={dragEnabled}
                showPropertiesPanel={showPropertiesPanel}
                isSaving={isSaving}
                isPreviewMode={isPreviewMode}
                onSetPreviewMode={setPreviewMode}
                onSetUseModularSystem={setUseModularSystem}
                onSetDragEnabled={setDragEnabled}
                onSetShowPropertiesPanel={setShowPropertiesPanel}
                onSave={handleSave}
                onExport={handleExport}
                onImport={handleImport}
                onAddStep={handleAddStep}
            />

            <div className="quiz-editor-body">
                {/* 🗂️ Sidebar de Steps */}
                <QuizEditorSidebar
                    steps={steps}
                    modularSteps={modularSteps}
                    selectedId={selectedId}
                    useModularSystem={useModularSystem}
                    dragEnabled={dragEnabled}
                    isSaving={isSaving}
                    onSelectId={setSelectedId}
                    onReorderSteps={handleReorderSteps}
                    onDuplicateStep={handleDuplicateStep}
                    onDeleteStep={handleDeleteStep}
                />

                {/* 🎨 Canvas Principal */}
                <QuizEditorCanvas
                    steps={steps}
                    modularSteps={modularSteps}
                    selectedId={selectedId}
                    selectedBlockId={selectedBlockId}
                    previewMode={previewMode}
                    useModularSystem={useModularSystem}
                    dragEnabled={dragEnabled}
                    onSelectId={setSelectedId}
                    onSelectBlockId={setSelectedBlockId}
                    onUpdateStep={handleUpdateStep}
                />

                {/* ⚙️ Painel de Propriedades */}
                {showPropertiesPanel && (
                    <QuizEditorPropertiesPanel
                        selectedStep={selectedStep || null}
                        selectedBlockId={selectedBlockId}
                        isVisible={showPropertiesPanel}
                        onUpdateStep={handleUpdateStep}
                        onClose={() => setShowPropertiesPanel(false)}
                    />
                )}
            </div>
        </div>
    );
});

QuizFunnelEditorWYSIWYG.displayName = 'QuizFunnelEditorWYSIWYG';

export default QuizFunnelEditorWYSIWYG;