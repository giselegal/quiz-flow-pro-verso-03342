import React, { memo } from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';

// 🔥 NOVO: Hook central de estado
import { useQuizEditorState } from './hooks/useQui        */
});

QuizFunnelEditorWYSIWYGStable.displayName = 'QuizFunnelEditorWYSIWYGStable';

export default QuizFunnelEditorWYSIWYGStable;State';

// 🔥 NOVO: Componentes modulares
import QuizEditorCanvas from './components/QuizEditorCanvas';
import QuizEditorSidebar from './components/QuizEditorSidebar';
import QuizEditorToolbar from './components/QuizEditorToolbar';
import QuizEditorPropertiesPanel from './components/QuizEditorPropertiesPanel';

import './QuizEditorStyles.css';
import './styles/QuizEditorModular.css';

/**
 * 🎯 QUIZ FUNNEL EDITOR WYSIWYG - REFATORADO (VERSÃO ESTÁVEL)
 * 
 * Editor principal completamente modularizado
 * Reduzido de 1387 linhas para ~200 linhas
 * Estado centralizado no hook useQuizEditorState
 * Componentes independentes e testáveis
 * 
 * Esta é a versão estável recuperada do commit a8ae4b63f
 */

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

const QuizFunnelEditorWYSIWYGStable: React.FC<QuizFunnelEditorProps> = memo(({
    funnelId,
    templateId
}) => {
    // TODO: Este arquivo está com problemas TypeScript - temporariamente desabilitado
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Editor Experimental
            </h2>
            <p className="text-gray-600 mb-4">
                Esta versão está em desenvolvimento. Use o editor principal.
            </p>
            <a
                href="/editor"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Ir para Editor Principal
            </a>
        </div>
    );

    /*
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
        isSaving,
        // hasUnsavedChanges, // TODO: Implementar
        // error, // TODO: Implementar

        // Actions
        setSelectedId,
        setSelectedBlockId,
        setPreviewMode,
        setShowPropertiesPanel,
        setDragEnabled,
        setUseModularSystem,
        // handleSave, // TODO: Implementar
        // handleReset, // TODO: Implementar
        // handleAddStep, // TODO: Implementar
        // handleUpdateStep, // TODO: Implementar
        // handleDeleteStep, // TODO: Implementar
        // handleDuplicateStep, // TODO: Implementar
        // handleReorderSteps, // TODO: Implementar
    } = useQuizEditorState();

    // Step selecionado
    const selectedStep = useModularSystem
        ? modularSteps.find(s => s.id === selectedId)
        : steps.find(s => s.id === selectedId);

    // 🔄 Early return se não houver dados
    if (!crud?.currentFunnel) {
        return (
            <div className="quiz-editor-container">
                <div className="p-8 text-center text-gray-500">
                    <h3 className="text-lg font-medium mb-2">Nenhum funil carregado</h3>
                    <p>Selecione ou crie um funil para começar a editar.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-editor-container">
                <div className="p-8 text-center text-red-500">
                    <h3 className="text-lg font-medium mb-2">Erro no Editor</h3>
                    <p>{error}</p>
                    <button
                        onClick={handleReset}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-editor-container">
            {/* 🔧 Toolbar Principal */}
            <QuizEditorToolbar
        funnelId={funnelId || ''}
        steps={steps}
        modularSteps={modularSteps}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        previewMode={previewMode}
        dragEnabled={dragEnabled}
        useModularSystem={useModularSystem}
        showPropertiesPanel={showPropertiesPanel}
        onSave={handleSave}
        onReset={handleReset}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        onToggleDrag={() => setDragEnabled(!dragEnabled)}
        onToggleModular={() => setUseModularSystem(!useModularSystem)}
        onToggleProperties={() => setShowPropertiesPanel(!showPropertiesPanel)}
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
        </div >
    );
});

QuizFunnelEditorWYSIWYGStable.displayName = 'QuizFunnelEditorWYSIWYGStable';

export default QuizFunnelEditorWYSIWYGStable;