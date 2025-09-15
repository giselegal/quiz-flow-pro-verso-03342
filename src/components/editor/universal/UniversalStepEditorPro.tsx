import React, { Suspense, useMemo, useState, useCallback, useRef } from 'react';
import { useNotification } from '@/components/ui/Notification';
import { useEditor } from '@/components/editor/EditorProvider';
import './UniversalStepEditorPro.css';
import './UniversalStepEditorPro-premium.css';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import { useEditorDragAndDrop } from '@/hooks/editor/useEditorDragAndDrop';
import { getBlocksForStep } from '@/config/quizStepsComplete';

// Lazy imports para performance
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

// Viewport mode type
type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'xl';

const UniversalStepEditorPro: React.FC<UniversalStepEditorProProps> = ({
    stepNumber = 1,
    className = '',
    onStepChange,
    onSave
}) => {
    // Contexto do editor
    const editorContext = useEditor();
    const { state, actions } = editorContext;

    // Estados locais
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [previewDevice, setPreviewDevice] = useState<ViewportMode>('desktop');
};

export default UniversalStepEditorPro;

{/* 📱 MOBILE LAYOUT */ }
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
            </div >

        </StepDndProvider >
    {/* Sistema de Notificações */ }
{ NotificationContainer ? <NotificationContainer /> : null }
    </>
);
};

export default UniversalStepEditorPro;
