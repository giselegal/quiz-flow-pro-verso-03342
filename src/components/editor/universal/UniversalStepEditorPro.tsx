/**
 * 🎯 UNIVERSAL STEP EDITOR PRO - VERSÃO HÍBRIDA DEFINITIVA
 * 
 * Combina o melhor dos dois mundos:
 * ✅ Arquitetura robusta do EditorPro (Context, DnD, Modular, Performance)
 * ✅ Painéis de propriedades detalhados do UniversalStepEditor
 * ✅ UX responsivo, lazy loading, notificações
 */

import React, { Suspense, useMemo, useState, useCallback } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { useEditor } from '@/components/editor/EditorProvider';
import './UniversalStepEditorPro.css';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import { useEditorDragAndDrop } from '@/hooks/editor/useEditorDragAndDrop';
import { useGlobalHotkeys } from '@/hooks/editor/useGlobalHotkeys';
import { useDisableAutoScroll } from '@/hooks/editor/useDisableAutoScroll';
import { FunnelHeader } from '@/components/editor/FunnelHeader';
import { getBlocksForStep } from '@/config/quizStepsComplete';
import { logger } from '@/utils/debugLogger';
import { availableComponents as AVAILABLE_COMPONENTS_CONFIG } from '@/components/editor/config/availableComponents';

// Lazy imports para performance
const StepSidebar = React.lazy(() => import('@/components/editor/sidebars/StepSidebar'));
const ComponentsSidebar = React.lazy(() => import('@/components/editor/sidebars/ComponentsSidebar'));
const CanvasAreaLayout = React.lazy(() => import('@/components/editor/layouts/CanvasArea'));
const UniversalPropertiesPanel = React.lazy(() => import('./components/UniversalPropertiesPanel'));

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

// Viewport mode type
type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'xl';

const UniversalStepEditorPro: React.FC<UniversalStepEditorProProps> = ({
    stepNumber = 1,
    className = '',
    onStepChange,
    onSave
}) => {
    // Context do editor robusto
    const editorContext = useEditor();
    const { state, actions } = editorContext;

    // Estados locais para UX
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [previewDevice, setPreviewDevice] = useState<ViewportMode>('desktop');
    
    // 🎯 CORREÇÃO CRÍTICA: Estados para overlays (substitui document.getElementById)
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [mobilePropsOpen, setMobilePropsOpen] = useState(false);

    // Sistema de notificações
    const notification = useNotification();
    const NotificationContainer = (notification as any)?.NotificationContainer ?? null;

    // Desabilitar auto-scroll no editor
    useDisableAutoScroll(true);

    // Hotkeys globais (Undo/Redo)
    useGlobalHotkeys((e) => {
        const isUndo = (e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z');
        const isRedo = (e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y');

        if (isUndo) {
            e.preventDefault();
            try {
                (actions as any)?.undo?.();
                notification?.success('Ação desfeita');
            } catch (error) {
                notification?.error('Erro ao desfazer');
            }
            return;
        }

        if (isRedo) {
            e.preventDefault();
            try {
                (actions as any)?.redo?.();
                notification?.success('Ação refeita');
            } catch (error) {
                notification?.error('Erro ao refazer');
            }
        }
    }, [actions, notification]);

    // Step atual seguro
    const safeCurrentStep = stepNumber || state.currentStep || 1;
    const currentStepKey = `step-${safeCurrentStep}`;

    // Dados do step atual com cache otimizado
    const currentStepData = useMemo(() => {
        const blocks = getBlocksForStep(safeCurrentStep, state.stepBlocks) || [];

        logger.debug('🔍 UniversalStepEditorPro currentStepData:', {
            step: safeCurrentStep,
            stepKey: currentStepKey,
            blocksFound: blocks.length,
            blockTypes: blocks.map(b => b.type)
        });

        return blocks;
    }, [safeCurrentStep, state.stepBlocks, currentStepKey]);

    // Sistema de DnD avançado
    const { isDragging, handleDragStart, handleDragEnd } = useEditorDragAndDrop({
        currentStepData: currentStepData as any,
        currentStepKey: currentStepKey,
        actions: actions as any,
        notification: notification as any,
    });

    // Verificação de blocos por step
    const stepHasBlocks = useMemo(() => {
        const stepBlocksRef = state.stepBlocks;
        if (!stepBlocksRef) return {};

        const map: Record<number, boolean> = {};
        for (let i = 1; i <= 21; i++) {
            const blocks = getBlocksForStep(i, stepBlocksRef) || [];
            map[i] = blocks.length > 0;
        }

        return map;
    }, [state.stepBlocks]);

    // Componentes agrupados para a sidebar
    const groupedComponents = useMemo(() => {
        return Object.entries(AVAILABLE_COMPONENTS_CONFIG).reduce((groups, [key, config]) => {
            const category = config.category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push({ key, ...config });
            return groups;
        }, {} as Record<string, any[]>);
    }, []);

    // Helper para renderizar ícones
    const renderIcon = useCallback((_name: string, className = 'w-4 h-4') => {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0-8h.01" />
            </svg>
        );
    }, []);

    // Análise de step
    const getStepAnalysis = useCallback((step: number) => {
        return {
            icon: 'info' as const,
            label: `Step ${step}`,
            desc: `Configuração do step ${step}`
        };
    }, []);

    // Handlers
    const handleStepSelect = useCallback((step: number) => {
        if (actions?.setCurrentStep) {
            actions.setCurrentStep(step);
            onStepChange?.(`step-${step}`);
            notification?.info(`Navegou para Step ${step}`);
        }
    }, [actions, onStepChange, notification]);

    const handleSave = useCallback(() => {
        try {
            // Implementar lógica de save usando o contexto
            const stepData = {
                stepId: currentStepKey,
                stepNumber: safeCurrentStep,
                blocks: currentStepData,
                timestamp: Date.now()
            };

            onSave?.(currentStepKey, stepData);
            notification?.success('Step salvo com sucesso!');

            logger.info('💾 Step salvo:', stepData);
        } catch (error) {
            notification?.error('Erro ao salvar step');
            logger.error('❌ Erro ao salvar:', error);
        }
    }, [currentStepKey, safeCurrentStep, currentStepData, onSave, notification]);

    // Handler para viewport mode
    const handleViewportModeChange = useCallback((mode: ViewportMode) => {
        setPreviewDevice(mode);
    }, []);

    // Fallback se não há contexto do editor
    if (!editorContext) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-2xl border border-gray-800/50 p-6 text-center">
                    <div className="text-red-400 mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-100 mb-2">Erro de Contexto</h2>
                    <p className="text-gray-400 mb-4">
                        O UniversalStepEditorPro deve ser usado dentro de um EditorProvider.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:opacity-80 transition-opacity"
                    >
                        Recarregar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header do Funil */}
            <FunnelHeader
                viewportMode={previewDevice}
                onViewportModeChange={setPreviewDevice}
            />

            {/* Provider de DnD */}
            <StepDndProvider
                stepNumber={safeCurrentStep}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={`universal-step-editor-pro h-[calc(100vh-120px)] bg-gray-950 flex overflow-hidden max-w-screen ${className} relative`}>

                    {/* 📱 MOBILE OVERLAYS - SISTEMA BASEADO EM ESTADO REACT */}
                    <div className="lg:hidden">
                        {/* Mobile Navigation Overlay */}
                        <div className={`mobile-overlay mobile-nav-overlay ${mobileNavOpen ? 'show' : ''}`}>
                            <div className="mobile-overlay-header">
                                <h3>Navegação</h3>
                                <button
                                    onClick={() => setMobileNavOpen(false)}
                                    className="mobile-overlay-close"
                                    aria-label="Fechar navegação"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mobile-overlay-content">
                                <Suspense fallback={<div className="p-4">Carregando steps...</div>}>
                                    <StepSidebar
                                        currentStep={safeCurrentStep}
                                        totalSteps={21}
                                        stepHasBlocks={stepHasBlocks}
                                        stepValidation={(state as any)?.stepValidation || {}}
                                        onSelectStep={(step) => {
                                            handleStepSelect(step);
                                            setMobileNavOpen(false); // Fechar overlay ao selecionar
                                        }}
                                        getStepAnalysis={getStepAnalysis}
                                        renderIcon={renderIcon}
                                        className="bg-gray-900"
                                    />
                                </Suspense>

                                <Suspense fallback={<div className="p-4">Carregando componentes...</div>}>
                                    <ComponentsSidebar
                                        groupedComponents={groupedComponents}
                                        renderIcon={renderIcon}
                                        className="bg-gray-900 mt-4"
                                    />
                                </Suspense>
                            </div>
                        </div>

                        {/* Mobile Properties Overlay */}
                        <div className={`mobile-overlay mobile-props-overlay ${mobilePropsOpen ? 'show' : ''}`}>
                            <div className="mobile-overlay-header">
                                <h3>Propriedades</h3>
                                <button
                                    onClick={() => setMobilePropsOpen(false)}
                                    className="mobile-overlay-close"
                                    aria-label="Fechar propriedades"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mobile-overlay-content">
                                <Suspense fallback={<div className="p-4">Carregando propriedades...</div>}>
                                    <UniversalPropertiesPanel
                                        selectedBlockId={state.selectedBlockId}
                                        stepData={currentStepData}
                                        stepNumber={safeCurrentStep}
                                        onSave={handleSave}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* 📱 MOBILE ACTION BUTTONS - SISTEMA BASEADO EM ESTADO REACT */}
                    <div className="lg:hidden fixed bottom-4 left-4 right-4 flex justify-between z-40">
                        <button
                            onClick={() => setMobileNavOpen(true)}
                            className="mobile-action-btn bg-blue-600 flex flex-col items-center px-4 py-2 rounded-lg text-white shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="text-xs">Menu</span>
                        </button>

                        <button
                            onClick={handleSave}
                            className="mobile-action-btn bg-green-600 flex flex-col items-center px-4 py-2 rounded-lg text-white shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            <span className="text-xs">Salvar</span>
                        </button>

                        <button
                            onClick={() => setMobilePropsOpen(true)}
                            className="mobile-action-btn bg-purple-600 flex flex-col items-center px-4 py-2 rounded-lg text-white shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            <span className="text-xs">Props</span>
                        </button>
                    </div>

                    {/* 💻 DESKTOP LAYOUT */}
                    {/* 1) Steps Sidebar - Fixed width */}
                    <div className="hidden lg:block w-[180px] min-w-[180px] max-w-[180px] flex-shrink-0">
                        <Suspense fallback={<div className="p-4 bg-gray-900 border-r border-gray-800/50">Carregando steps...</div>}>
                            <StepSidebar
                                currentStep={safeCurrentStep}
                                totalSteps={21}
                                stepHasBlocks={stepHasBlocks}
                                stepValidation={(state as any)?.stepValidation || {}}
                                onSelectStep={handleStepSelect}
                                getStepAnalysis={getStepAnalysis}
                                renderIcon={renderIcon}
                                className="!w-full bg-gray-900 border-r border-gray-800/50"
                            />
                        </Suspense>
                    </div>

                    {/* 2) Components Sidebar - Fixed width */}
                    <div className="hidden lg:block w-[220px] min-w-[220px] max-w-[220px] flex-shrink-0">
                        <Suspense fallback={<div className="p-4 bg-gray-900 border-r border-gray-800/50">Carregando componentes...</div>}>
                            <ComponentsSidebar
                                groupedComponents={groupedComponents}
                                renderIcon={renderIcon}
                                className="!w-full bg-gray-900 border-r border-gray-800/50"
                            />
                        </Suspense>
                    </div>

                    {/* 3) Canvas Area - Dynamic width */}
                    <div className="w-full lg:flex-1 lg:min-w-0">
                        <Suspense fallback={<div className="p-8 bg-gray-800 text-white">Carregando canvas...</div>}>
                            <CanvasAreaLayout
                                className=""
                                mode={mode}
                                setMode={setMode}
                                previewDevice={previewDevice}
                                setPreviewDevice={handleViewportModeChange}
                                safeCurrentStep={safeCurrentStep}
                                currentStepKey={currentStepKey}
                                currentStepData={currentStepData as any}
                                selectedBlockId={state.selectedBlockId}
                                actions={actions as any}
                                state={state as any}
                                notification={notification as any}
                                containerRef={React.createRef<HTMLDivElement>()}
                                getStepAnalysis={getStepAnalysis}
                                renderIcon={renderIcon}
                                isDragging={isDragging}
                            />
                        </Suspense>
                    </div>

                    {/* 4) Universal Properties Panel - Fixed width */}
                    <div className="hidden lg:block w-[320px] min-w-[320px] max-w-[320px] flex-shrink-0">
                        <Suspense fallback={<div className="p-4 bg-gray-900 border-l border-gray-800/50">Carregando propriedades...</div>}>
                            <UniversalPropertiesPanel
                                selectedBlockId={state.selectedBlockId}
                                stepData={currentStepData}
                                stepNumber={safeCurrentStep}
                                onSave={handleSave}
                                className="!w-full bg-gray-900 border-l border-gray-800/50 h-full overflow-y-auto"
                            />
                        </Suspense>
                    </div>
                </div>
            </StepDndProvider>

            {/* Sistema de Notificações */}
            {NotificationContainer ? <NotificationContainer /> : null}
        </>
    );
};

export default UniversalStepEditorPro;