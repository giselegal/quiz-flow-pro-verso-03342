import React from 'react';
/**
 * DEPRECATED StepSidebar (versão simples)
 * --------------------------------------
 * Use a versão avançada em: src/components/editor/sidebars/StepSidebar.tsx
 * Esta variante permanece apenas para compatibilidade temporária.
 * Será removida após consolidação do ModernUnifiedEditor.
 */

export interface StepItem {
    id: string;
    label: string;
    type?: string;
}

interface StepSidebarProps {
    steps: StepItem[];
    currentStepId?: string;
    onSelectStep?: (id: string) => void;
}

export const StepSidebar: React.FC<StepSidebarProps> = ({ steps, currentStepId, onSelectStep }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b bg-neutral-50">Etapas</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {steps.map(step => {
                    const active = step.id === currentStepId;
                    return (
                        <button
                            key={step.id}
                            onClick={() => onSelectStep?.(step.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors border ${active ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white hover:bg-blue-50 border-gray-200 text-gray-700'}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium truncate">{step.label}</span>
                                {step.type && (
                                    <span className="text-[10px] uppercase tracking-wide opacity-70 ml-2">{step.type}</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StepSidebar;
