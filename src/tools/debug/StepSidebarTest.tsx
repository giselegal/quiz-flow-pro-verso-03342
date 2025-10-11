/**
 * 🔍 TESTE ISOLADO DO STEP SIDEBAR
 * Para debug do problema dos steps não aparecendo
 */

import React, { useState, useMemo } from 'react';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { normalizeStepBlocks } from '@/config/quizStepsComplete';

// StepSidebar simplificado para debug
const SimpleStepSidebar: React.FC<{
    currentStep: number;
    stepHasBlocks: Record<number, boolean>;
    onSelectStep: (step: number) => void;
}> = ({ currentStep, stepHasBlocks, onSelectStep }) => {

    console.log('🔍 SimpleStepSidebar render:', {
        currentStep,
        stepHasBlocksKeys: Object.keys(stepHasBlocks),
        stepsWithBlocks: Object.entries(stepHasBlocks).filter(([, has]) => has).map(([step]) => step)
    });

    return (
        <div className="w-[13rem] bg-gray-900 text-white h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h3 className="font-medium text-sm text-gray-200">Steps do Quiz</h3>
                <p className="text-xs text-gray-400 mt-1">21 etapas configuradas</p>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {Array.from({ length: 21 }, (_, i) => i + 1).map(step => {
                    const hasBlocks = stepHasBlocks[step];
                    const isActive = step === currentStep;

                    return (
                        <button
                            key={step}
                            onClick={() => onSelectStep(step)}
                            className={`
                                w-full text-left p-2 rounded mb-1 text-sm transition-colors
                                ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span>Step {step}</span>
                                <div className="flex items-center gap-1">
                                    {hasBlocks && (
                                        <div className="w-2 h-2 bg-green-400 rounded-full" title="Has blocks"></div>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs opacity-75 mt-1">
                                {step <= 19 ? `Pergunta ${step}` : step === 20 ? 'Resultado' : 'Oferta'}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const StepSidebarTest: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);

    // Simular o que o EditorProvider faz
    const stepBlocks = useMemo(() => {
        const normalized = normalizeStepBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
        console.log('🔍 StepSidebarTest normalized blocks:', {
            keyCount: Object.keys(normalized).length,
            keys: Object.keys(normalized),
            blockCounts: Object.entries(normalized).map(([k, v]) => [k, v.length])
        });
        return normalized;
    }, []);

    // Simular stepHasBlocks
    const stepHasBlocks = useMemo(() => {
        const map: Record<number, boolean> = {};
        for (let step = 1; step <= 21; step++) {
            const stepKey = `step-${step}`;
            const blocks = stepBlocks[stepKey];
            map[step] = Array.isArray(blocks) && blocks.length > 0;
        }
        const stepsWithBlocks = Object.entries(map).filter(([, hasBlocks]) => hasBlocks).map(([step]) => step);
        console.log(`🔍 StepSidebarTest: ${stepsWithBlocks.length} steps have blocks:`, stepsWithBlocks);
        return map;
    }, [stepBlocks]);

    const handleSelectStep = (step: number) => {
        console.log('🎯 Step selected:', step);
        setCurrentStep(step);
    };

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Sidebar simplificado */}
            <SimpleStepSidebar
                currentStep={currentStep}
                stepHasBlocks={stepHasBlocks}
                onSelectStep={handleSelectStep}
            />

            {/* Info panel */}
            <div className="flex-1 p-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4">🔍 Simple Step Sidebar Test</h1>
                    <div className="space-y-3">
                        <div>
                            <strong>Current Step:</strong> {currentStep}
                        </div>
                        <div>
                            <strong>Total Steps with Blocks:</strong> {Object.values(stepHasBlocks).filter(Boolean).length}
                        </div>
                        <div>
                            <strong>Steps with Blocks:</strong>
                            <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                                {Object.entries(stepHasBlocks)
                                    .filter(([, hasBlocks]) => hasBlocks)
                                    .map(([step]) => step)
                                    .join(', ')}
                            </div>
                        </div>
                        <div>
                            <strong>Current Step Has Blocks:</strong> {stepHasBlocks[currentStep] ? '✅ Yes' : '❌ No'}
                        </div>
                        <div>
                            <strong>Current Step Block Count:</strong> {stepBlocks[`step-${currentStep}`]?.length || 0}
                        </div>
                        <div>
                            <strong>Template Keys:</strong>
                            <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 max-h-40 overflow-y-auto">
                                {Object.keys(stepBlocks).join(', ')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepSidebarTest;