import React, { Suspense, useMemo, useState, useCallback, useRef } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { useEditor } from '@/components/editor/EditorProvider';
import './UniversalStepEditorPro.css';
import './UniversalStepEditorPro-premium.css';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import { useEditorDragAndDrop } from '@/hooks/editor/useEditorDragAndDrop';
import { useGlobalHotkeys } from '@/hooks/editor/useGlobalHotkeys';
import { useDisableAutoScroll } from '@/hooks/editor/useDisableAutoScroll';
import { getBlocksForStep } from '@/config/quizStepsComplete';
import { logger } from '@/utils/debugLogger';

// Lazy imports para performance
const CanvasAreaLayout = React.lazy(() => import('@/components/editor/layouts/CanvasArea'));

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

    // 🎯 CORREÇÃO: Ref para canvas container
    const canvasRef = useRef<HTMLDivElement>(null);

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
            {/* Provider de DnD */}
            <StepDndProvider
                stepNumber={safeCurrentStep}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={`universal-step-editor-pro min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 overflow-hidden m-0 p-0 ${className} relative`}>

                    {/* 🎯 DESKTOP LAYOUT 4-COLUNAS */}
                    <div className="hidden lg:flex h-screen w-full">

                        {/* 1) Steps Sidebar - 180px */}
                        <div className="w-48 flex-shrink-0 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50">
                            <div className="p-2 border-b border-gray-800/50">
                                <h2 className="text-sm font-bold text-white/90 mb-1">NAVEGAÇÃO</h2>
                                <p className="text-xs text-gray-400">Steps do funil</p>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                <div className="p-1">
                                    {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleStepSelect(num)}
                                            className={`w-full text-left px-3 py-2 mb-1 rounded-md text-sm transition-colors ${num === safeCurrentStep
                                                ? 'bg-blue-600 text-white font-medium'
                                                : 'text-gray-300 hover:bg-gray-800/50'
                                                }`}
                                        >
                                            Step {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2) Components Sidebar - 220px */}
                        <div className="w-56 flex-shrink-0 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50">
                            <div className="p-2 border-b border-gray-800/50">
                                <h2 className="text-sm font-bold text-white/90 mb-1">COMPONENTES</h2>
                                <p className="text-xs text-gray-400">Arraste para o canvas</p>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-1">
                                <div className="text-sm text-gray-400 text-center py-8">
                                    Componentes em desenvolvimento
                                </div>
                            </div>
                        </div>

                        {/* 3) Canvas Area - Dynamic */}
                        <div className="flex-1 min-w-0 flex flex-col" ref={canvasRef}>
                            <Suspense fallback={
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Carregando Canvas</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Preparando ambiente de edição premium</p>
                                    </div>
                                </div>
                            }>
                                <CanvasAreaLayout
                                    className="h-full w-full"
                                    containerRef={canvasRef}
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
                                    renderIcon={renderIcon}
                                    getStepAnalysis={getStepAnalysis}
                                    isDragging={isDragging}
                                />
                            </Suspense>
                        </div>

                        {/* 4) Properties Panel - 320px */}
                        <div className="w-80 flex-shrink-0 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800/50">
                            <div className="p-2 border-b border-gray-800/50">
                                <h2 className="text-sm font-bold text-white/90 mb-1">PROPRIEDADES</h2>
                                <p className="text-xs text-gray-400">Configure o elemento</p>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2">
                                <div className="text-sm text-gray-400 text-center py-8">
                                    Clique em um elemento para editar propriedades
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 📱 MOBILE LAYOUT */}
                    <div className="lg:hidden h-screen relative bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">

                        {/* Mobile Navigation Overlay */}
                        <div className={`fixed inset-0 z-41 transition-all duration-300 ${mobileNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)}></div>
                            <div className={`absolute top-0 left-0 w-80 h-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 border-r border-gray-800/50 shadow-2xl transition-transform duration-300 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                                <div className="flex items-center justify-between p-3 border-b border-gray-800/50 bg-gradient-to-r from-gray-800/50 to-transparent">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Navegação</h3>
                                        <p className="text-xs text-gray-400">Steps do funil</p>
                                    </div>
                                    <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2">
                                    {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => { handleStepSelect(num); setMobileNavOpen(false); }}
                                            className={`w-full text-left px-3 py-3 mb-2 rounded-md text-sm transition-colors ${num === safeCurrentStep
                                                ? 'bg-blue-600 text-white font-medium'
                                                : 'text-gray-300 hover:bg-gray-800/50'
                                                }`}
                                        >
                                            Step {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Properties Overlay */}
                        <div className={`fixed inset-0 z-42 transition-all duration-300 ${mobilePropsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobilePropsOpen(false)}></div>
                            <div className={`absolute top-0 right-0 w-80 h-full bg-gradient-to-bl from-gray-900 via-slate-900 to-gray-900 border-l border-gray-800/50 shadow-2xl transition-transform duration-300 ${mobilePropsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                                <div className="flex items-center justify-between p-3 border-b border-gray-800/50 bg-gradient-to-l from-gray-800/50 to-transparent">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Propriedades</h3>
                                        <p className="text-xs text-gray-400">Configure elementos</p>
                                    </div>
                                    <button onClick={() => setMobilePropsOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2">
                                    <div className="text-sm text-gray-400 text-center py-8">
                                        Clique em um elemento para editar propriedades
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className="fixed bottom-6 left-4 right-4 z-50">
                            <div className="flex justify-between items-center">
                                <button onClick={() => setMobileNavOpen(true)} className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-2xl shadow-2xl border border-blue-400/20 transition-all duration-300 hover:scale-110">
                                    <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div className="flex space-x-3">
                                    <button onClick={handleSave} className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-2xl shadow-2xl border border-green-400/20 transition-all duration-300 hover:scale-110">
                                        <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                    </button>
                                </div>
                                <button onClick={() => setMobilePropsOpen(true)} className="group relative bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white p-4 rounded-2xl shadow-2xl border border-violet-400/20 transition-all duration-300 hover:scale-110">
                                    <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Canvas */}
                        <div className="h-full flex items-center justify-center p-2">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Editor Mobile</div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Step {safeCurrentStep} - Use os botões no canto inferior</p>
                            </div>
                        </div>
                    </div>
                </div>
            </StepDndProvider>

            {/* Sistema de Notificações */}
            {NotificationContainer ? <NotificationContainer /> : null}
        </>
    );
};

export default UniversalStepEditorPro;
