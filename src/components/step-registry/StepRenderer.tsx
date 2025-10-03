/**
 * 🎨 RENDERIZADOR UNIVERSAL DE STEPS
 * 
 * Componente responsável por renderizar qualquer step registrado
 * no sistema, fornecendo uma interface consistente.
 */

import React from 'react';
import { stepRegistry } from './StepRegistry';
import { BaseStepProps } from './StepTypes';

interface StepRendererProps extends BaseStepProps {
    stepId: string;
}

export const StepRenderer: React.FC<StepRendererProps> = (props) => {
    const { stepId, ...stepProps } = props;
    const stepComponent = stepRegistry.get(stepId);

    // Tratar casos de erro
    if (!stepComponent) {
        return (
            <div className="step-error min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-red-700 mb-2">
                        Step não encontrado
                    </h2>
                    <p className="text-red-600 mb-4">
                        O step <code className="bg-red-100 px-2 py-1 rounded">{stepId}</code> não foi registrado no sistema.
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 p-4 bg-gray-100 rounded text-left text-sm">
                            <strong>🔍 Debug Info:</strong>
                            <br />Steps disponíveis: {stepRegistry.getAll().map(s => s.id).join(', ')}
                            <br />Total registrados: {stepRegistry.count()}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Renderizar o componente do step
    const Component = stepComponent.component;

    return (
        <div
            className="step-container"
            data-step-id={stepId}
            data-step-name={stepComponent.name}
            data-step-category={stepComponent.config.metadata?.category}
        >
            <Component {...stepProps} stepId={stepId} />
        </div>
    );
};

export default StepRenderer;
