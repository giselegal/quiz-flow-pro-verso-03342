/**
 * 🎨 RENDERIZADOR UNIVERSAL DE STEPS
 * 
 * Componente responsável por renderizar qualquer step registrado
 * no sistema, fornecendo uma interface consistente.
 */

import React, { useEffect, useRef } from 'react';
import { stepRegistry } from './StepRegistry';
import { BaseStepProps } from './StepTypes';
import { appLogger } from '@/lib/utils/appLogger';

interface StepRendererProps extends BaseStepProps {
    stepId: string;
}

export const StepRenderer: React.FC<StepRendererProps> = (props) => {
    const { stepId, ...stepProps } = props;
    const stepComponent = stepRegistry.get(stepId);
    const containerRef = useRef<HTMLDivElement | null>(null);

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

    // Dev-only: diagnóstico de camadas/renderizações duplicadas
    if (import.meta.env?.DEV) {
        useEffect(() => {
            const el = containerRef.current;
            const id = stepId;
            const now = Date.now();
            const layerInfo: any = { timestamp: new Date(now).toISOString(), stepId: id };

            try {
                // Quantos contêineres do mesmo step estão no DOM
                const sameStepContainers = document.querySelectorAll(`.step-container[data-step-id="${id}"]`);
                layerInfo.sameStepContainers = sameStepContainers.length;

                // Quantos step-containers no total
                const allStepContainers = document.querySelectorAll('.step-container');
                layerInfo.allStepContainers = allStepContainers.length;

                // Quantos overlays globais (position fixed/absolute com z-index alto)
                const overlays = Array.from(document.querySelectorAll<HTMLElement>('body *'))
                    .filter(n => {
                        const s = getComputedStyle(n);
                        if (!s) return false;
                        const pos = s.position;
                        const zi = parseInt(s.zIndex || '0', 10);
                        return (pos === 'fixed' || pos === 'absolute') && zi >= 1000;
                    });
                layerInfo.highZOverlays = overlays.length;

                // Caminho de ancestrais até #root (para entender camadas de layout)
                const ancestors: string[] = [];
                let p: HTMLElement | null = el as any;
                const limit = 20;
                let i = 0;
                while (p && i++ < limit) {
                    const desc = `${p.tagName.toLowerCase()}${p.id ? `#${p.id}` : ''}${p.className ? '.' + String(p.className).split(' ').slice(0, 3).join('.') : ''}`;
                    ancestors.push(desc);
                    if (p.id === 'root') break;
                    p = p.parentElement;
                }
                layerInfo.ancestors = ancestors;

                // Alerta se houver duplicidade do mesmo step
                if (sameStepContainers.length > 1) {
                    appLogger.warn(`🟠 [LayerDiag] Step '${id}' renderizado ${sameStepContainers.length}x simultaneamente.`);
                }

                appLogger.info('[LayerDiag] StepRenderer mount', { data: [layerInfo] });
            } catch (e) {
                appLogger.debug('[LayerDiag] Falha ao coletar diagnóstico de camadas', { data: [e] });
            }
        }, [stepId]);
    }

    return (
        <div
            className="step-container"
            data-step-id={stepId}
            data-step-name={stepComponent.name}
            data-step-category={stepComponent.config.metadata?.category}
            ref={containerRef}
        >
            <Component {...stepProps} stepId={stepId} />
        </div>
    );
};

export default StepRenderer;
