import React, { Suspense, useMemo, useState, useCallback, useRef } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { useEditor } from '@/components/editor/EditorProvider';
import './UniversalStepEditorPro.css';
import './UniversalStepEditorPro-premium.css';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import { useEditorDragAndDrop } from '@/hooks/editor/useEditorDragAndDrop';
import { getBlocksForStep } from '@/config/quizStepsComplete';
import StepSidebar from '@/components/editor/sidebars/StepSidebar';
import ComponentsSidebar from '@/components/editor/sidebars/ComponentsSidebar';
import PropertiesColumn from '@/components/editor/properties/PropertiesColumn';
import { availableComponents as AVAILABLE_COMPONENTS_CONFIG } from '@/components/editor/config/availableComponents';

const CanvasAreaLayout = React.lazy(() => import('@/components/editor/layouts/CanvasArea'));
const EditorHeader = React.lazy(() => import('./EditorHeader'));

export interface UniversalStepEditorProProps {
    stepId?: string;
    stepNumber?: number;
    funnelId?: string;
    className?: string;
    onStepChange?: (stepId: string) => void;
    onSave?: (stepId: string, data: any) => void;
    readOnly?: boolean;
    showNavigation?: boolean;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'xl';

const UniversalStepEditorPro: React.FC<UniversalStepEditorProProps> = ({
    stepNumber = 1,
    className = '',
    onStepChange
}) => {
    // Hooks
    const editorContext = useEditor();
    const { state, actions } = editorContext;
    const notification = useNotification();
    const canvasRef = useRef<HTMLDivElement>(null);

    // Estados locais
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [previewDevice] = useState<ViewportMode>('desktop');

    const NotificationContainer = (notification as any)?.NotificationContainer ?? null;
    const safeCurrentStep = stepNumber || state.currentStep || 1;
    const currentStepKey = `step-${safeCurrentStep}`;

    // Calcula stepHasBlocks baseado no estado atual - optimized
    const stepHasBlocks = useMemo(() => {
        const stepBlocksRef = state.stepBlocks;
        if (!stepBlocksRef) return {};

        const map: Record<number, boolean> = {};
        for (let step = 1; step <= 21; step++) {
            const stepKey = `step-${step}`;
            const blocks = stepBlocksRef[stepKey];
            map[step] = Array.isArray(blocks) && blocks.length > 0;
        }
        return map;
    }, [state.stepBlocks]);

    // Dados do step atual
    const currentStepData = useMemo(() => {
        const blocks = getBlocksForStep(safeCurrentStep, state.stepBlocks) || [];
        console.log('📊 currentStepData recalculado:', {
            safeCurrentStep,
            blocksCount: blocks.length,
            blocks: blocks.map(b => ({ id: b.id, type: b.type, properties: Object.keys(b.properties || {}) })),
            stepBlocksRef: state.stepBlocks
        });
        return blocks;
    }, [safeCurrentStep, state.stepBlocks]);

    // Drag and Drop
    const { isDragging, handleDragStart, handleDragEnd } = useEditorDragAndDrop({
        currentStepData: currentStepData as any,
        currentStepKey: currentStepKey,
        actions: actions as any,
        notification: notification as any,
    });

    // Componentes agrupados
    const groupedComponents = useMemo(
        () => AVAILABLE_COMPONENTS_CONFIG.reduce<Record<string, any[]>>((acc, c) => {
            (acc[c.category] = acc[c.category] || []).push(c);
            return acc;
        }, {}),
        []
    );

    // Block selecionado - com deep logging
    const selectedBlockId = state.selectedBlockId;
    const selectedBlock = useMemo(() => {
        const block = currentStepData.find((b: any) => b.id === selectedBlockId);
        console.log('🎯 selectedBlock recalculado:', {
            selectedBlockId,
            foundBlock: block ? {
                id: block.id,
                type: block.type,
                propertiesKeys: Object.keys(block.properties || {}),
                contentKeys: block.content ? Object.keys(block.content) : [],
                fullProperties: block.properties,
                fullContent: block.content
            } : null,
            totalBlocksInStep: currentStepData.length
        });
        return block;
    }, [currentStepData, selectedBlockId]);

    // Debug logs para seleção de bloco
    React.useEffect(() => {
        console.log('🎯 Estado de seleção de bloco:', {
            selectedBlockId,
            selectedBlock: selectedBlock ? { id: selectedBlock.id, type: selectedBlock.type } : null,
            currentStepData: currentStepData.length,
            currentStepKey
        });
    }, [selectedBlockId, selectedBlock, currentStepData.length, currentStepKey]);

    // Callbacks
    const renderIcon = useCallback((_name: string, className = 'w-4 h-4') => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0-8h.01" />
        </svg>
    ), []);

    const getStepAnalysis = useCallback((step: number) => ({
        icon: 'info' as const,
        label: `Step ${step}`,
        desc: `Configuração do step ${step}`
    }), []);

    const handleStepSelect = useCallback((step: number) => {
        actions.setCurrentStep(step);
        onStepChange?.(step.toString());

        // Garantir que a etapa seja carregada se não existir
        if (actions.ensureStepLoaded) {
            actions.ensureStepLoaded(step);
        }
    }, [actions, onStepChange]);

    const handleUpdateBlock = useCallback((updates: any) => {
        console.log('🔄 handleUpdateBlock chamado:', {
            selectedBlockId,
            updates,
            currentStepKey,
            selectedBlockBeforeUpdate: selectedBlock ? {
                id: selectedBlock.id,
                properties: selectedBlock.properties,
                content: selectedBlock.content
            } : null
        });

        if (selectedBlockId) {
            console.log('🚀 Chamando actions.updateBlock:', { currentStepKey, selectedBlockId, updates });
            actions.updateBlock(currentStepKey, selectedBlockId, updates);

            // Verificar se o estado foi atualizado
            setTimeout(() => {
                console.log('⏰ Estado após updateBlock (1s delay):', {
                    newStepBlocks: state.stepBlocks,
                    currentStepAfterUpdate: state.stepBlocks?.[currentStepKey]
                });
            }, 100);
        } else {
            console.warn('⚠️  Nenhum bloco selecionado para atualizar');
        }
    }, [actions, currentStepKey, selectedBlockId, selectedBlock, state.stepBlocks]);

    const handleDeleteBlock = useCallback(() => {
        if (selectedBlockId) {
            actions.removeBlock(currentStepKey, selectedBlockId);
        }
    }, [actions, currentStepKey, selectedBlockId]);

    return (
        <>
            <StepDndProvider
                stepNumber={safeCurrentStep}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={`universal-step-editor-pro min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 overflow-hidden m-0 p-0 ${className} relative`}>
                    {/* Desktop Layout: Header + 4 colunas com CSS Grid */}
                    <div className="hidden lg:flex lg:flex-col h-screen w-full">
                        {/* Header Superior - Acima de todas as colunas */}
                        <div className="flex-shrink-0 border-b border-gray-800/50">
                            <Suspense fallback={<div className="h-16 bg-gray-900 border-b border-gray-800/50" />}>
                                <EditorHeader
                                    mode={mode}
                                    setMode={setMode}
                                    safeCurrentStep={safeCurrentStep}
                                    currentStepKey={currentStepKey}
                                    currentStepData={currentStepData}
                                    actions={actions as any}
                                    state={state as any}
                                    notification={notification as any}
                                    renderIcon={renderIcon}
                                    getStepAnalysis={getStepAnalysis}
                                />
                            </Suspense>
                        </div>

                        {/* Grid das 4 colunas */}
                        <div className="flex-1 editor-grid">
                            {/* Sidebar de Steps */}
                            <div className="bg-gray-900 border-r border-gray-800/50 overflow-y-auto">
                                <Suspense fallback={<div className="w-full bg-gray-900 border-r border-gray-800/50 h-full" />}>
                                    <StepSidebar
                                        currentStep={safeCurrentStep}
                                        totalSteps={21}
                                        stepHasBlocks={stepHasBlocks}
                                        stepValidation={state.stepValidation}
                                        onSelectStep={handleStepSelect}
                                        getStepAnalysis={getStepAnalysis}
                                        renderIcon={renderIcon}
                                    />
                                </Suspense>
                            </div>

                            {/* Sidebar de Componentes */}
                            <div className="bg-gray-900 border-r border-gray-800/50 overflow-y-auto">
                                <Suspense fallback={<div className="w-full bg-gray-900 border-r border-gray-800/50 h-full" />}>
                                    <ComponentsSidebar
                                        groupedComponents={groupedComponents}
                                        renderIcon={renderIcon}
                                    />
                                </Suspense>
                            </div>

                            {/* Área do Canvas Central - Sem Header interno */}
                            <div className="flex flex-col bg-gray-100 dark:bg-gray-800 overflow-y-auto" ref={canvasRef}>
                                <Suspense fallback={<div className="h-full flex items-center justify-center">Carregando Canvas...</div>}>
                                    <CanvasAreaLayout
                                        className="flex-1"
                                        containerRef={canvasRef}
                                        mode={mode}
                                        previewDevice={previewDevice}
                                        safeCurrentStep={safeCurrentStep}
                                        currentStepData={currentStepData as any}
                                        selectedBlockId={selectedBlockId}
                                        actions={actions as any}
                                        isDragging={isDragging}
                                    />
                                </Suspense>
                            </div>

                            {/* Painel de Propriedades */}
                            <div className="bg-gray-900/80 backdrop-blur-sm border-l border-gray-700/50 overflow-y-auto">
                                <Suspense fallback={<div className="w-full bg-gray-900 border-l border-gray-800/50 h-full" />}>
                                    <PropertiesColumn
                                        selectedBlock={selectedBlock}
                                        onUpdate={handleUpdateBlock}
                                        onDelete={handleDeleteBlock}
                                        onClose={() => actions.setSelectedBlockId?.(null)}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
                        {/* Header Mobile */}
                        <Suspense fallback={<div className="h-20 flex items-center justify-center">Carregando...</div>}>
                            <EditorHeader
                                mode={mode}
                                setMode={setMode}
                                safeCurrentStep={safeCurrentStep}
                                currentStepKey={currentStepKey}
                                currentStepData={currentStepData}
                                actions={actions as any}
                                state={state as any}
                                notification={notification as any}
                                renderIcon={renderIcon}
                                getStepAnalysis={getStepAnalysis}
                            />
                        </Suspense>

                        {/* Canvas Mobile */}
                        <div className="flex-1 min-h-0">
                            <Suspense fallback={<div className="h-full flex items-center justify-center">Carregando Canvas...</div>}>
                                <CanvasAreaLayout
                                    className="h-full"
                                    containerRef={canvasRef}
                                    mode={mode}
                                    previewDevice={previewDevice}
                                    safeCurrentStep={safeCurrentStep}
                                    currentStepData={currentStepData as any}
                                    selectedBlockId={selectedBlockId}
                                    actions={actions as any}
                                    isDragging={isDragging}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </StepDndProvider>

            {/* Container de Notificações */}
            {NotificationContainer && <NotificationContainer />}
        </>
    );
};

export default UniversalStepEditorPro;
