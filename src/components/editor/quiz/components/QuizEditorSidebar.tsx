import React, { memo, useMemo, useCallback } from 'react';
import { EditableQuizStep, ModularStep } from '../hooks/useQuizEditorState';

/**
 * 🗂️ QUIZ EDITOR SIDEBAR
 * 
 * Lista de steps navegável
 * Controles de reordenação
 * Indicadores visuais de seleção
 */

export interface QuizEditorSidebarProps {
    steps: EditableQuizStep[];
    modularSteps: ModularStep[];
    selectedId: string;
    useModularSystem: boolean;
    dragEnabled: boolean;
    isSaving: boolean;

    // Callbacks
    onSelectId: (id: string) => void;
    onReorderSteps?: (newOrder: string[]) => void;
    onDuplicateStep?: (stepId: string) => void;
    onDeleteStep?: (stepId: string) => void;
}

const STEP_TYPE_LABELS: Record<string, string> = {
    intro: '👋 Introdução',
    question: '❓ Pergunta',
    'strategic-question': '🎯 Pergunta Estratégica',
    transition: '➡️ Transição',
    'transition-result': '🔄 Transição para Resultado',
    result: '🎉 Resultado',
    offer: '💰 Oferta',
    custom: '⚙️ Personalizado'
};

const STEP_TYPE_COLORS: Record<string, string> = {
    intro: '#4F46E5',
    question: '#059669',
    'strategic-question': '#DC2626',
    transition: '#7C3AED',
    'transition-result': '#EA580C',
    result: '#0891B2',
    offer: '#CA8A04'
};

const QuizEditorSidebar: React.FC<QuizEditorSidebarProps> = memo(({
    steps,
    modularSteps,
    selectedId,
    useModularSystem,
    dragEnabled,
    isSaving,
    onSelectId,
    onReorderSteps,
    onDuplicateStep,
    onDeleteStep
}) => {
    // Current steps based on system
    const currentSteps = useMemo(() =>
        useModularSystem ? modularSteps : steps,
        [useModularSystem, modularSteps, steps]
    );

    // Get step display info
    const getStepDisplayInfo = useCallback((step: EditableQuizStep | ModularStep) => {
        const label = STEP_TYPE_LABELS[step.type] || step.type;
        const color = STEP_TYPE_COLORS[step.type] || '#6B7280';

        let title = '';
        if ('title' in step && step.title) {
            title = step.title;
        } else if ('name' in step && step.name) {
            title = step.name;
        } else if ('questionText' in step && step.questionText) {
            title = step.questionText;
        } else if ('formQuestion' in step && step.formQuestion) {
            title = step.formQuestion;
        }

        return { label, color, title };
    }, []);

    // Handle drag start
    const handleDragStart = useCallback((e: React.DragEvent, stepId: string) => {
        if (!dragEnabled) return;
        e.dataTransfer.setData('text/plain', stepId);
        e.dataTransfer.effectAllowed = 'move';
    }, [dragEnabled]);

    // Handle drag over
    const handleDragOver = useCallback((e: React.DragEvent) => {
        if (!dragEnabled) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, [dragEnabled]);

    // Handle drop
    const handleDrop = useCallback((e: React.DragEvent, targetStepId: string) => {
        if (!dragEnabled || !onReorderSteps) return;

        e.preventDefault();
        const draggedStepId = e.dataTransfer.getData('text/plain');

        if (draggedStepId === targetStepId) return;

        const currentOrder = currentSteps.map(step => step.id);
        const draggedIndex = currentOrder.indexOf(draggedStepId);
        const targetIndex = currentOrder.indexOf(targetStepId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newOrder = [...currentOrder];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedStepId);

        onReorderSteps(newOrder);
    }, [dragEnabled, currentSteps, onReorderSteps]);

    // Render step item
    const renderStepItem = useCallback((step: EditableQuizStep | ModularStep, index: number) => {
        const { label, color, title } = getStepDisplayInfo(step);
        const isSelected = selectedId === step.id;
        const isModular = 'components' in step;

        return (
            <div
                key={step.id}
                className={`sidebar-step-item ${isSelected ? 'selected' : ''} ${isModular ? 'modular' : 'traditional'}`}
                onClick={() => onSelectId(step.id)}
                draggable={dragEnabled}
                onDragStart={(e) => handleDragStart(e, step.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, step.id)}
                style={{ '--step-color': color } as React.CSSProperties}
            >
                <div className="step-indicator" style={{ backgroundColor: color }}>
                    {index + 1}
                </div>

                <div className="step-info">
                    <div className="step-label">{label}</div>
                    {title && (
                        <div className="step-title" title={title}>
                            {title.length > 30 ? `${title.substring(0, 30)}...` : title}
                        </div>
                    )}
                    {isModular && (
                        <div className="step-meta">
                            {step.components?.length || 0} componentes
                        </div>
                    )}
                </div>

                <div className="step-actions">
                    {onDuplicateStep && (
                        <button
                            className="step-action-btn duplicate"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateStep(step.id);
                            }}
                            title="Duplicar step"
                        >
                            📋
                        </button>
                    )}
                    {onDeleteStep && currentSteps.length > 1 && (
                        <button
                            className="step-action-btn delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Tem certeza que deseja excluir este step?')) {
                                    onDeleteStep(step.id);
                                }
                            }}
                            title="Excluir step"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        );
    }, [
        getStepDisplayInfo,
        selectedId,
        onSelectId,
        dragEnabled,
        handleDragStart,
        handleDragOver,
        handleDrop,
        onDuplicateStep,
        onDeleteStep,
        currentSteps.length
    ]);

    if (!currentSteps || currentSteps.length === 0) {
        return (
            <div className="quiz-editor-sidebar empty">
                <div className="sidebar-header">
                    <h3>Steps do Quiz</h3>
                </div>
                <div className="empty-state">
                    <p>Nenhum step encontrado</p>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-editor-sidebar">
            <div className="sidebar-header">
                <h3>Steps do Quiz</h3>
                <div className="sidebar-meta">
                    <span className="step-count">{currentSteps.length}</span>
                    {useModularSystem && <span className="system-badge">Modular</span>}
                    {isSaving && <span className="saving-indicator">💾 Salvando...</span>}
                </div>
            </div>

            <div className="sidebar-content">
                <div className="steps-list">
                    {currentSteps.map((step, index) => renderStepItem(step, index))}
                </div>

                {dragEnabled && (
                    <div className="drag-hint">
                        <small>💡 Arraste os steps para reordenar</small>
                    </div>
                )}
            </div>

            <div className="sidebar-footer">
                <div className="legend">
                    {Object.entries(STEP_TYPE_LABELS).map(([type, label]) => (
                        <div key={type} className="legend-item">
                            <div
                                className="legend-color"
                                style={{ backgroundColor: STEP_TYPE_COLORS[type] || '#6B7280' }}
                            />
                            <span className="legend-label">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

QuizEditorSidebar.displayName = 'QuizEditorSidebar';

export default QuizEditorSidebar;