import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
// 🚀 PURE BUILDER SYSTEM - Hook unificado otimizado
import { usePureBuilder } from '@/components/editor/PureBuilderProvider';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useNotification } from '@/components/ui/Notification';
import { Block } from '@/types/editor';

// Novos componentes modernos
import FunnelNavbar from './FunnelNavbar';
import ModernStepSidebar from './ModernStepSidebar';
import HorizontalToolbar from './HorizontalToolbar';
import ExpandedCanvas from './ExpandedCanvas';
import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';

interface ModernModularEditorProProps {
    className?: string;
}

/**
 * ModularEditorPro Modernizado - Inspirado em editores profissionais
 * Arquitetura: Navbar Superior + Layout Multi-Painel Otimizado
 */
const ModernModularEditorPro: React.FC<ModernModularEditorProProps> = ({
    className = ''
}) => {
    // 🎯 Estados principais
    const [currentMode, setCurrentMode] = useState<'builder' | 'flow' | 'design' | 'leads' | 'settings'>('builder');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // 🔄 Pure Builder System Integration
    const {
        currentStep,
        steps,
        blocks,
        selectedBlock: activeBlock,
        addBlock,
        updateBlock,
        deleteBlock,
        selectBlock,
        addStep,
        deleteStep,
        renameStep,
        duplicateStep,
        switchToStep,
        undo,
        redo,
        canUndo: builderCanUndo,
        canRedo: builderCanRedo,
        saveProject,
        isLoading,
        error
    } = usePureBuilder();

    // 📊 Scheduler otimizado
    const { scheduleTask } = useOptimizedScheduler();
    const { showNotification } = useNotification();

    // 🔄 Sincronizar estados de undo/redo
    useEffect(() => {
        setCanUndo(builderCanUndo);
        setCanRedo(builderCanRedo);
    }, [builderCanUndo, builderCanRedo]);

    // 🎯 Handlers para Navbar
    const handleModeChange = useCallback((mode: string) => {
        setCurrentMode(mode as typeof currentMode);
        showNotification(`Modo alterado para: ${mode}`, 'info');
    }, [showNotification]);

    const handleSave = useCallback(async () => {
        try {
            await saveProject();
            showNotification('Projeto salvo com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao salvar projeto', 'error');
            console.error('Erro no save:', error);
        }
    }, [saveProject, showNotification]);

    const handlePublish = useCallback(() => {
        showNotification('Funcionalidade de publicação em desenvolvimento', 'info');
        // TODO: Implementar lógica de publicação
    }, [showNotification]);

    const handlePreview = useCallback(() => {
        showNotification('Funcionalidade de preview em desenvolvimento', 'info');
        // TODO: Implementar lógica de preview
    }, [showNotification]);

    const handleUndo = useCallback(() => {
        scheduleTask('undo', () => {
            undo();
            showNotification('Ação desfeita', 'info');
        });
    }, [undo, scheduleTask, showNotification]);

    const handleRedo = useCallback(() => {
        scheduleTask('redo', () => {
            redo();
            showNotification('Ação refeita', 'info');
        });
    }, [redo, scheduleTask, showNotification]);

    // 🎯 Handlers para Steps
    const handleStepClick = useCallback((stepId: string) => {
        switchToStep(stepId);
    }, [switchToStep]);

    const handleStepAdd = useCallback(() => {
        const newStepId = addStep({
            name: `Etapa ${steps.length + 1}`,
            blocks: []
        });
        showNotification('Nova etapa adicionada!', 'success');
        return newStepId;
    }, [addStep, steps.length, showNotification]);

    const handleStepDelete = useCallback((stepId: string) => {
        if (steps.length <= 1) {
            showNotification('Não é possível excluir a última etapa', 'warning');
            return;
        }
        deleteStep(stepId);
        showNotification('Etapa excluída', 'info');
    }, [deleteStep, steps.length, showNotification]);

    const handleStepRename = useCallback((stepId: string, newName: string) => {
        renameStep(stepId, newName);
        showNotification('Etapa renomeada', 'info');
    }, [renameStep, showNotification]);

    const handleStepDuplicate = useCallback((stepId: string) => {
        duplicateStep(stepId);
        showNotification('Etapa duplicada', 'success');
    }, [duplicateStep, showNotification]);

    // 🎯 Handlers para Components
    const handleComponentDrag = useCallback((componentId: string) => {
        console.log('Component drag started:', componentId);
        // TODO: Implementar lógica de drag de componentes
    }, []);

    // 🎯 Handlers para Canvas
    const handleCanvasBack = useCallback(() => {
        // Lógica para voltar etapa ou sair do editor
        const currentStepIndex = steps.findIndex(step => step.id === currentStep?.id);
        if (currentStepIndex > 0) {
            switchToStep(steps[currentStepIndex - 1].id);
        } else {
            showNotification('Primeira etapa do funil', 'info');
        }
    }, [currentStep, steps, switchToStep, showNotification]);

    // 🎯 Handlers para Block Updates
    const handleUpdateBlock = useCallback((blockId: string, updates: Record<string, any>) => {
        scheduleTask(`update-${blockId}`, () => {
            updateBlock(blockId, updates);
        });
    }, [updateBlock, scheduleTask]);

    const handleDeleteSelectedBlock = useCallback(() => {
        if (selectedBlockId) {
            deleteBlock(selectedBlockId);
            setSelectedBlockId(null);
            showNotification('Elemento excluído', 'info');
        }
    }, [selectedBlockId, deleteBlock, showNotification]);

    // 📊 Computed values
    const selectedBlock = useMemo(() =>
        blocks.find(block => block.id === selectedBlockId) || activeBlock,
        [blocks, selectedBlockId, activeBlock]
    );

    const stepsForSidebar = useMemo(() =>
        steps.map(step => ({
            id: step.id,
            name: step.name,
            isActive: step.id === currentStep?.id,
            order: step.order || 0
        })),
        [steps, currentStep]
    );

    const currentStepProgress = useMemo(() => {
        if (!currentStep || steps.length === 0) return 0;
        const currentIndex = steps.findIndex(step => step.id === currentStep.id);
        return ((currentIndex + 1) / steps.length) * 100;
    }, [currentStep, steps]);

    // 🎨 Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // ⚠️ Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Erro no Editor</h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen h-full flex flex-col bg-background ${className}`}>
            {/* 🔝 Navbar Superior */}
            <FunnelNavbar
                currentMode={currentMode}
                onModeChange={handleModeChange}
                onSave={handleSave}
                onPublish={handlePublish}
                onPreview={handlePreview}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClose={() => window.history.back()}
                canUndo={canUndo}
                canRedo={canRedo}
            />

            {/* 📱 Layout Principal Multi-Painel */}
            <div className="w-full h-full relative overflow-hidden">
                <div className="w-full h-full">
                    <div className="flex flex-col md:flex-row h-full relative">

                        {/* 📋 Sidebar de Etapas */}
                        <ModernStepSidebar
                            steps={stepsForSidebar}
                            activeStepId={currentStep?.id}
                            onStepClick={handleStepClick}
                            onStepAdd={handleStepAdd}
                            onStepDelete={handleStepDelete}
                            onStepRename={handleStepRename}
                            onStepDuplicate={handleStepDuplicate}
                        />

                        {/* 🔧 Toolbar de Componentes */}
                        <HorizontalToolbar
                            onComponentDrag={handleComponentDrag}
                            className="w-full md:flex-row flex-col"
                        />

                        {/* 🎨 Canvas Principal Expandido */}
                        <div className="w-full h-full">
                            <div className="w-full md:flex-row flex-col overflow-hidden flex h-full relative">
                                <ExpandedCanvas
                                    logoUrl="https://via.placeholder.com/96x96?text=Logo"
                                    showLogo={true}
                                    showProgress={true}
                                    allowReturn={true}
                                    progress={currentStepProgress}
                                    onBack={handleCanvasBack}
                                    className="flex-1"
                                >
                                    {/* Aqui o conteúdo atual do step seria renderizado */}
                                    {currentStep && (
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold text-center">
                                                {currentStep.name}
                                            </h2>
                                            <p className="text-center text-muted-foreground">
                                                {blocks.length} elemento(s) nesta etapa
                                            </p>
                                        </div>
                                    )}
                                </ExpandedCanvas>

                                {/* 📊 Painel de Propriedades */}
                                {selectedBlock && (
                                    <div className="hidden md:block w-full max-w-[24rem] relative overflow-auto border-l z-[50]">
                                        <div className="h-full w-full rounded-[inherit]">
                                            <div className="grid gap-4 px-4 pb-4 pt-2 my-4">

                                                {/* Header das Propriedades */}
                                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                                    <div className="flex flex-col space-y-1.5 p-6">
                                                        <p className="text-sm text-muted-foreground">
                                                            Propriedades - {selectedBlock.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Painel de Propriedades */}
                                                <div className="flex-1 overflow-auto">
                                                    <RegistryPropertiesPanel
                                                        selectedBlock={selectedBlock}
                                                        onUpdate={handleUpdateBlock}
                                                        onClose={() => setSelectedBlockId(null)}
                                                        onDelete={handleDeleteSelectedBlock}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModernModularEditorPro;