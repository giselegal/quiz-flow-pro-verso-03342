import React, { memo, useCallback } from 'react';

/**
 * 🛠️ QUIZ EDITOR TOOLBAR
 * 
 * Controles principais do editor
 * Toggle entre modos edit/preview
 * Ações de salvamento e exportação
 */

export interface QuizEditorToolbarProps {
    previewMode: 'edit' | 'preview';
    useModularSystem: boolean;
    dragEnabled: boolean;
    showPropertiesPanel: boolean;
    isSaving: boolean;
    isPreviewMode: boolean;

    // Callbacks
    onSetPreviewMode: (mode: 'edit' | 'preview') => void;
    onSetUseModularSystem: (use: boolean) => void;
    onSetDragEnabled: (enabled: boolean) => void;
    onSetShowPropertiesPanel: (show: boolean) => void;
    onSave?: () => void;
    onExport?: () => void;
    onImport?: () => void;
    onAddStep?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
}

const QuizEditorToolbar: React.FC<QuizEditorToolbarProps> = memo(({
    previewMode,
    useModularSystem,
    dragEnabled,
    showPropertiesPanel,
    isSaving,
    isPreviewMode,
    onSetPreviewMode,
    onSetUseModularSystem,
    onSetDragEnabled,
    onSetShowPropertiesPanel,
    onSave,
    onExport,
    onImport,
    onAddStep,
    onUndo,
    onRedo
}) => {
    // Handle mode toggle
    const handleModeToggle = useCallback(() => {
        const newMode = previewMode === 'edit' ? 'preview' : 'edit';
        onSetPreviewMode(newMode);
    }, [previewMode, onSetPreviewMode]);

    // Handle system toggle
    const handleSystemToggle = useCallback(() => {
        onSetUseModularSystem(!useModularSystem);
    }, [useModularSystem, onSetUseModularSystem]);

    // Handle drag toggle
    const handleDragToggle = useCallback(() => {
        onSetDragEnabled(!dragEnabled);
    }, [dragEnabled, onSetDragEnabled]);

    // Handle properties panel toggle
    const handlePropertiesToggle = useCallback(() => {
        onSetShowPropertiesPanel(!showPropertiesPanel);
    }, [showPropertiesPanel, onSetShowPropertiesPanel]);

    return (
        <div className="quiz-editor-toolbar">
            {/* Left Section - Mode Controls */}
            <div className="toolbar-section left">
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${previewMode === 'edit' ? 'active' : ''}`}
                        onClick={() => onSetPreviewMode('edit')}
                        title="Modo de Edição"
                    >
                        ✏️ Editar
                    </button>
                    <button
                        className={`mode-btn ${previewMode === 'preview' ? 'active' : ''}`}
                        onClick={() => onSetPreviewMode('preview')}
                        title="Modo de Visualização"
                    >
                        👁️ Preview
                    </button>
                </div>

                <div className="system-toggle">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={useModularSystem}
                            onChange={handleSystemToggle}
                        />
                        <span className="toggle-text">
                            {useModularSystem ? '🧩 Modular' : '📄 Tradicional'}
                        </span>
                    </label>
                </div>
            </div>

            {/* Center Section - Action Controls */}
            <div className="toolbar-section center">
                {onAddStep && (
                    <button
                        className="toolbar-btn primary"
                        onClick={onAddStep}
                        title="Adicionar Step"
                    >
                        ➕ Adicionar Step
                    </button>
                )}

                <div className="action-group">
                    {onUndo && (
                        <button
                            className="toolbar-btn secondary"
                            onClick={onUndo}
                            title="Desfazer (Ctrl+Z)"
                        >
                            ↶
                        </button>
                    )}
                    {onRedo && (
                        <button
                            className="toolbar-btn secondary"
                            onClick={onRedo}
                            title="Refazer (Ctrl+Y)"
                        >
                            ↷
                        </button>
                    )}
                </div>

                <div className="drag-toggle">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={dragEnabled}
                            onChange={handleDragToggle}
                        />
                        <span className="toggle-text">
                            {dragEnabled ? '🎯 Drag On' : '🚫 Drag Off'}
                        </span>
                    </label>
                </div>
            </div>

            {/* Right Section - File & View Controls */}
            <div className="toolbar-section right">
                <div className="file-actions">
                    {onImport && (
                        <button
                            className="toolbar-btn secondary"
                            onClick={onImport}
                            title="Importar Quiz"
                        >
                            📂 Importar
                        </button>
                    )}
                    {onExport && (
                        <button
                            className="toolbar-btn secondary"
                            onClick={onExport}
                            title="Exportar Quiz"
                        >
                            📤 Exportar
                        </button>
                    )}
                    {onSave && (
                        <button
                            className={`toolbar-btn ${isSaving ? 'loading' : 'primary'}`}
                            onClick={onSave}
                            disabled={isSaving}
                            title="Salvar Quiz (Ctrl+S)"
                        >
                            {isSaving ? '💾 Salvando...' : '💾 Salvar'}
                        </button>
                    )}
                </div>

                <div className="view-controls">
                    <button
                        className={`toolbar-btn ${showPropertiesPanel ? 'active' : 'secondary'}`}
                        onClick={handlePropertiesToggle}
                        title="Painel de Propriedades"
                    >
                        ⚙️ Propriedades
                    </button>
                </div>
            </div>

            {/* Status Indicators */}
            <div className="toolbar-status">
                {isPreviewMode && (
                    <div className="status-indicator preview">
                        <span className="status-dot"></span>
                        Modo Preview
                    </div>
                )}
                {isSaving && (
                    <div className="status-indicator saving">
                        <span className="status-dot pulsing"></span>
                        Salvando alterações...
                    </div>
                )}
                {useModularSystem && (
                    <div className="status-indicator modular">
                        <span className="status-dot"></span>
                        Sistema Modular Ativo
                    </div>
                )}
            </div>
        </div>
    );
});

QuizEditorToolbar.displayName = 'QuizEditorToolbar';

export default QuizEditorToolbar;