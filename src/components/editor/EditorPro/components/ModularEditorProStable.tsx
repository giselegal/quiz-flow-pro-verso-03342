import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { usePureBuilder } from '@/components/editor/PureBuilderProvider';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useNotification } from '@/components/ui/Notification';
import { Block } from '@/types/editor';
import { QuizRenderer } from '@/components/core/QuizRenderer';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';

// Componentes modulares
import EditorToolbar from './EditorToolbar';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';

/**
 * 🎯 MODULAR EDITOR PRO - VERSÃO ESTÁVEL
 * 
 * Versão estável que utiliza QuizRenderer.tsx com fluxo de navegação funcional
 * Baseada na arquitetura localizada nos backups e documentação
 * 
 * Características:
 * ✅ QuizRenderer com modos editor/preview
 * ✅ useQuizFlow para navegação entre etapas  
 * ✅ Fluxo de navegação completo e funcional
 * ✅ Toggle dinâmico editor/preview
 * ✅ Sistema de propriedades integrado
 */

interface ModularEditorProStableProps {
    funnelId?: string;
    initialStep?: number;
    className?: string;
}

const ModularEditorProStable: React.FC<ModularEditorProStableProps> = ({
    funnelId = "quiz21StepsComplete",
    initialStep = 1,
    className = ""
}) => {
    // 🚀 Estado principal do editor
    const { state, actions } = usePureBuilder();
    const { showNotification } = useNotification();

    // 🎛️ Estado de modo (editor/preview)
    const [mode, setMode] = useState<'editor' | 'preview'>('editor');
    const [isFullPreview, setIsFullPreview] = useState(false);

    // 🔄 Hook de fluxo integrado para navegação funcional
    const { quizState, actions: quizActions } = useQuizFlow({
        mode: mode === 'preview' ? 'preview' : 'editor',
        onStepChange: (step: number) => {
            console.log(`🎯 ModularEditorProStable: Navegando para etapa ${step}`);
            actions.setCurrentStep(step);
        },
        initialStep: state.currentStep
    });

    // 📊 Dados da etapa atual
    const currentStepKey = `step-${state.currentStep}`;
    const currentStepBlocks = state.stepBlocks[currentStepKey] || [];
    const selectedBlock = currentStepBlocks.find(block => block.id === state.selectedBlockId);

    // 🎯 Handlers otimizados
    const handleStepChange = useCallback((step: number) => {
        if (step >= 1 && step <= 21) {
            actions.setCurrentStep(step);
            // Reset seleção ao mudar etapa
            actions.setSelectedBlockId(null);
            showNotification(`Navegando para etapa ${step}`, 'info');
        }
    }, [actions, showNotification]);

    const handleBlockClick = useCallback((blockId: string) => {
        if (mode === 'editor') {
            console.log('🎯 Block selecionado:', blockId);
            actions.setSelectedBlockId(blockId);
        }
    }, [mode, actions]);

    const toggleMode = useCallback(() => {
        const newMode = mode === 'editor' ? 'preview' : 'editor';
        setMode(newMode);
        console.log(`🔄 Modo alterado para: ${newMode}`);
        showNotification(
            newMode === 'preview' ? 'Modo Preview ativado' : 'Modo Editor ativado',
            'info'
        );
    }, [mode, showNotification]);

    const toggleFullPreview = useCallback(() => {
        setIsFullPreview(!isFullPreview);
        if (!isFullPreview) {
            setMode('preview');
        }
    }, [isFullPreview]);

    // 🎨 Componente de seleção de bloco para editor
    const handleBlockUpdate = useCallback((blockId: string, updates: Partial<Block>) => {
        console.log('🔄 Atualizando block:', blockId, updates);
        actions.updateBlock(currentStepKey, blockId, updates);
        showNotification('Bloco atualizado', 'success');
    }, [actions, currentStepKey, showNotification]);

    const handleBlockDelete = useCallback((blockId: string) => {
        console.log('🗑️ Removendo block:', blockId);
        actions.removeBlock(currentStepKey, blockId);
        if (state.selectedBlockId === blockId) {
            actions.setSelectedBlockId(null);
        }
        showNotification('Bloco removido', 'info');
    }, [actions, currentStepKey, state.selectedBlockId, showNotification]);

    const handleComponentAdd = useCallback((component: any) => {
        console.log('➕ Adicionando componente:', component);
        const newBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: component.type,
            properties: component.defaultProps || {}
        };
        actions.addBlock(currentStepKey, newBlock);
        showNotification(`Componente ${component.name} adicionado`, 'success');
    }, [actions, currentStepKey, showNotification]);

    // 🎯 Layout responsivo baseado no modo
    if (isFullPreview) {
        return (
            <div className={`modular-editor-pro-stable-full ${className}`}>
                {/* Header mínimo para fullscreen preview */}
                <div className="bg-black/90 text-white px-4 py-2 flex justify-between items-center">
                    <span className="text-sm">Preview Completo - Etapa {state.currentStep}/21</span>
                    <button
                        onClick={toggleFullPreview}
                        className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30"
                    >
                        ✕ Fechar
                    </button>
                </div>

                {/* QuizRenderer em tela cheia */}
                <div className="h-[calc(100vh-40px)]">
                    <QuizRenderer
                        mode="preview"
                        onStepChange={handleStepChange}
                        initialStep={state.currentStep}
                        blocksOverride={currentStepBlocks}
                        currentStepOverride={state.currentStep}
                        onBlockClick={handleBlockClick}
                        previewEditable={false}
                        selectedBlockId={null}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`modular-editor-pro-stable h-screen flex bg-gray-50 ${className}`}>
            {/* 📋 Sidebar de Etapas */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Etapas do Quiz</h2>
                    <p className="text-sm text-gray-600">21 etapas configuradas</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <StepSidebar
                        currentStep={state.currentStep}
                        totalSteps={21}
                        onStepChange={handleStepChange}
                        stepBlocks={state.stepBlocks}
                    />
                </div>
            </div>

            {/* 🖥️ Área Principal */}
            <div className="flex-1 flex flex-col">
                {/* 🎛️ Toolbar Principal */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Editor Modular Pro - Etapa {state.currentStep}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {currentStepBlocks.length} componentes •
                                Template: {funnelId}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Navegação de etapas */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleStepChange(state.currentStep - 1)}
                                    disabled={state.currentStep <= 1}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Anterior
                                </button>

                                <span className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded font-medium">
                                    {state.currentStep} / 21
                                </span>

                                <button
                                    onClick={() => handleStepChange(state.currentStep + 1)}
                                    disabled={state.currentStep >= 21}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Próxima →
                                </button>
                            </div>

                            {/* Toggle de modo */}
                            <button
                                onClick={toggleMode}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'preview'
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {mode === 'preview' ? '👁️ Preview' : '✏️ Editor'}
                            </button>

                            {/* Preview em tela cheia */}
                            <button
                                onClick={toggleFullPreview}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                            >
                                🔍 Preview Completo
                            </button>

                            {/* Salvar */}
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium">
                                💾 Salvar
                            </button>
                        </div>
                    </div>
                </div>

                {/* 🎨 Canvas Principal */}
                <div className="flex-1 flex min-h-0">
                    <div className="flex-1 relative">
                        {/* 🎯 NÚCLEO: QuizRenderer com modos funcionais */}
                        <div className="h-full bg-gradient-to-br from-gray-100 via-gray-50 to-white">
                            <QuizRenderer
                                mode={mode}
                                onStepChange={handleStepChange}
                                initialStep={state.currentStep}
                                blocksOverride={currentStepBlocks}
                                currentStepOverride={state.currentStep}
                                onBlockClick={handleBlockClick}
                                previewEditable={mode === 'editor'}
                                selectedBlockId={state.selectedBlockId}
                                className="h-full w-full"
                            />
                        </div>

                        {/* Indicador de modo */}
                        <div className="absolute top-4 left-4 z-50">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${mode === 'preview'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}>
                                {mode === 'preview' ? '👁️ Preview Mode' : '✏️ Edit Mode'}
                            </div>
                        </div>
                    </div>

                    {/* 🧩 Sidebar de Componentes - Só no modo editor */}
                    {mode === 'editor' && (
                        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">Biblioteca de Componentes</h3>
                                <p className="text-sm text-gray-600">Arraste para adicionar</p>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <ComponentsSidebar
                                    onComponentAdd={handleComponentAdd}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 🔧 Painel de Propriedades - Só quando há bloco selecionado */}
            {mode === 'editor' && selectedBlock && (
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Propriedades</h3>
                        <p className="text-sm text-gray-600">
                            {selectedBlock.type} • ID: {selectedBlock.id.substring(0, 8)}...
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <RegistryPropertiesPanel
                            selectedBlock={selectedBlock}
                            onUpdateBlock={(updates) => handleBlockUpdate(selectedBlock.id, updates)}
                            onDeleteBlock={() => handleBlockDelete(selectedBlock.id)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

ModularEditorProStable.displayName = 'ModularEditorProStable';

export default ModularEditorProStable;