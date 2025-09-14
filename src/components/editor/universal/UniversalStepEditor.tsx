/**
 * 🎯 UNIVERSAL STEP EDITOR - VERSÃO SUPER SIMPLIFICADA
 * 
 * Versão mínima para resolver problemas de inicialização
 */

import React from 'react';

export interface UniversalStepEditorProps {
    stepId: string;
    stepNumber: number;
    funnelId?: string;
    onStepChange?: (stepId: string) => void;
    onSave?: (stepId: string, data: any) => void;
    readOnly?: boolean;
    showNavigation?: boolean;
}

const UniversalStepEditor: React.FC<UniversalStepEditorProps> = ({
    stepId = 'step-1',
    stepNumber = 1,
    funnelId = 'quiz-21-steps-complete',
    onStepChange,
    onSave,
    readOnly = false,
    showNavigation = true
}) => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simular carregamento
        const timer = setTimeout(() => {
            setIsLoading(false);
            console.log('✅ UniversalStepEditor carregado:', { stepId, stepNumber, funnelId });
        }, 1000);

        return () => clearTimeout(timer);
    }, [stepId, stepNumber, funnelId]);

    const handleNext = () => {
        if (stepNumber < 21) {
            const nextStepId = `step-${stepNumber + 1}`;
            onStepChange?.(nextStepId);
        }
    };

    const handlePrevious = () => {
        if (stepNumber > 1) {
            const prevStepId = `step-${stepNumber - 1}`;
            onStepChange?.(prevStepId);
        }
    };

    const handleSave = () => {
        const mockData = { stepId, stepNumber, timestamp: Date.now() };
        onSave?.(stepId, mockData);
        console.log('✅ Step salvo:', mockData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando Step {stepNumber}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Step {stepNumber}: {stepId}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Funil: {funnelId}
                    </p>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        💾 Salvar
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="bg-gray-50 rounded-lg p-8 h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Universal Step Editor
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Editor visual para Step {stepNumber} do funil
                            </p>
                            <p className="text-sm text-gray-500">
                                ID: {stepId} | Funil: {funnelId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Properties Panel */}
                <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Propriedades
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título do Step
                            </label>
                            <input
                                type="text"
                                defaultValue={`Step ${stepNumber}`}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                readOnly={readOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                defaultValue={`Conteúdo do step ${stepNumber}`}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                readOnly={readOnly}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            {showNavigation && (
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={stepNumber <= 1}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Step {stepNumber - 1}
                    </button>
                    
                    <span className="text-sm text-gray-500">
                        Step {stepNumber} de 21
                    </span>
                    
                    <button
                        onClick={handleNext}
                        disabled={stepNumber >= 21}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Step {stepNumber + 1} →
                    </button>
                </div>
            )}
        </div>
    );
};

export default UniversalStepEditor;