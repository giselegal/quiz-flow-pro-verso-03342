// @ts-nocheck
import React, { memo, useMemo, Suspense } from 'react';
import { EditableQuizStep, ModularStep } from '../hooks/useQuizEditorState';

/**
 * 🎨 QUIZ EDITOR CANVAS
 * 
 * Renderiza o canvas central do editor
 * Controla alternância entre modo edição/preview
 * Renderiza steps modulares ou tradicionais
 */

// Lazy loaded components
const ModularIntroStep = React.lazy(() => import('../../quiz-estilo/ModularIntroStep'));
const ModularQuestionStep = React.lazy(() => import('../../quiz-estilo/ModularQuestionStep'));
const ModularStrategicQuestionStep = React.lazy(() => import('../../quiz-estilo/ModularStrategicQuestionStep'));
const ModularTransitionStep = React.lazy(() => import('../../quiz-estilo/ModularTransitionStep'));
const ModularResultStep = React.lazy(() => import('../../quiz-estilo/ModularResultStep'));
const ModularOfferStep = React.lazy(() => import('../../quiz-estilo/ModularOfferStep'));

const EditorIntroStep = React.lazy(() => import('../../quiz-estilo/EditorIntroStep'));
const EditorQuestionStep = React.lazy(() => import('../../quiz-estilo/EditorQuestionStep'));
const EditorStrategicQuestionStep = React.lazy(() => import('../../quiz-estilo/EditorStrategicQuestionStep'));
const EditorTransitionStep = React.lazy(() => import('../../quiz-estilo/EditorTransitionStep'));
const EditorResultStep = React.lazy(() => import('../../quiz-estilo/EditorResultStep'));
const EditorOfferStep = React.lazy(() => import('../../quiz-estilo/EditorOfferStep'));

export interface QuizEditorCanvasProps {
    steps: EditableQuizStep[];
    modularSteps: ModularStep[];
    selectedId: string;
    selectedBlockId: string;
    previewMode: 'edit' | 'preview';
    useModularSystem: boolean;
    dragEnabled: boolean;

    // Callbacks
    onSelectId: (id: string) => void;
    onSelectBlockId: (blockId: string) => void;
    onUpdateStep: (stepId: string, updates: Partial<EditableQuizStep>) => void;
    onInsertAfter?: (stepId: string) => void;
    onRemoveStep?: (stepId: string) => void;
}

const QuizEditorCanvas: React.FC<QuizEditorCanvasProps> = memo(({
    steps,
    modularSteps,
    selectedId,
    selectedBlockId,
    previewMode,
    useModularSystem,
    dragEnabled,
    onSelectId,
    onSelectBlockId,
    onUpdateStep,
    onInsertAfter,
    onRemoveStep
}) => {
    // Determine which steps to render
    const currentSteps = useMemo(() =>
        useModularSystem ? modularSteps : steps,
        [useModularSystem, modularSteps, steps]
    );

    // Component resolver for modular system
    const getModularComponent = useMemo(() => (step: EditableQuizStep) => {
        switch (step.type) {
            case 'intro':
                return ModularIntroStep;
            case 'question':
                return ModularQuestionStep;
            case 'strategic-question':
                return ModularStrategicQuestionStep;
            case 'transition':
            case 'transition-result':
                return ModularTransitionStep;
            case 'result':
                return ModularResultStep;
            case 'offer':
                return ModularOfferStep;
            default:
                return ModularIntroStep;
        }
    }, []);

    // Component resolver for preview system
    const getPreviewComponent = useMemo(() => (step: EditableQuizStep) => {
        switch (step.type) {
            case 'intro':
                return EditorIntroStep;
            case 'question':
                return EditorQuestionStep;
            case 'strategic-question':
                return EditorStrategicQuestionStep;
            case 'transition':
            case 'transition-result':
                return EditorTransitionStep;
            case 'result':
                return EditorResultStep;
            case 'offer':
                return EditorOfferStep;
            default:
                return EditorIntroStep;
        }
    }, []);

    // Render modular step
    const renderModularStep = useMemo(() => (step: EditableQuizStep, index: number) => {
        const Component = getModularComponent(step);
        const isSelected = selectedId === step.id;

        return (
            <div
                key={step.id}
                className={`quiz-editor-step ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectId(step.id)}
                data-step-id={step.id}
                data-step-index={index}
            >
                <Suspense fallback={<div className="loading-step">Carregando...</div>}>
                    <Component
                        step={step}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={onSelectBlockId}
                        onUpdateStep={(updates) => onUpdateStep(step.id, updates)}
                        dragEnabled={dragEnabled}
                        isSelected={isSelected}
                    />
                </Suspense>

                {/* Step Controls */}
                {isSelected && (
                    <div className="step-controls">
                        {onInsertAfter && (
                            <button
                                className="insert-after-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onInsertAfter(step.id);
                                }}
                            >
                                + Inserir Depois
                            </button>
                        )}
                        {onRemoveStep && steps.length > 1 && (
                            <button
                                className="remove-step-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveStep(step.id);
                                }}
                            >
                                🗑️ Remover
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }, [
        getModularComponent,
        selectedId,
        selectedBlockId,
        onSelectId,
        onSelectBlockId,
        onUpdateStep,
        dragEnabled,
        onInsertAfter,
        onRemoveStep,
        steps.length
    ]);

    // Render preview step
    const renderPreviewStep = useMemo(() => (step: EditableQuizStep, index: number) => {
        const Component = getPreviewComponent(step);

        return (
            <div
                key={step.id}
                className="quiz-preview-step"
                data-step-id={step.id}
                data-step-index={index}
            >
                <Suspense fallback={<div className="loading-step">Carregando...</div>}>
                    <Component
                        step={step}
                        isEditable={false}
                        onUpdateStep={() => { }} // Preview mode - no editing
                    />
                </Suspense>
            </div>
        );
    }, [getPreviewComponent]);

    // Render method based on mode
    const renderStep = useMemo(() =>
        previewMode === 'edit' ? renderModularStep : renderPreviewStep,
        [previewMode, renderModularStep, renderPreviewStep]
    );

    // Loading fallback
    if (!currentSteps || currentSteps.length === 0) {
        return (
            <div className="quiz-editor-canvas empty">
                <div className="empty-state">
                    <h3>Nenhum step encontrado</h3>
                    <p>Adicione um step para começar a editar seu quiz.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`quiz-editor-canvas ${previewMode}-mode ${useModularSystem ? 'modular' : 'traditional'}`}>
            <div className="canvas-content">
                {steps.map((step, index) => renderStep(step, index))}
            </div>

            {/* Canvas Info */}
            <div className="canvas-info">
                <span className="step-count">{steps.length} steps</span>
                <span className="mode-indicator">{previewMode === 'edit' ? 'Editando' : 'Visualizando'}</span>
                {useModularSystem && <span className="system-indicator">Sistema Modular</span>}
            </div>
        </div>
    );
});

QuizEditorCanvas.displayName = 'QuizEditorCanvas';

export default QuizEditorCanvas;