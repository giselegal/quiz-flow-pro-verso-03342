/**
 * 🔄 SPECIALIZED STEP ADAPTER
 * 
 * Adapter temporário que mantém a interface de SpecializedStepRenderer
 * mas delega a renderização para UnifiedStepRenderer.
 * 
 * Permite remover SpecializedStepRenderer mantendo compatibilidade
 * com ScalableQuizRenderer sem refatoração complexa.
 * 
 * @created Sprint 4 - Dia 2 (11/out/2025)
 * @purpose Adapter pattern para facilitar migração gradual
 */

import React from 'react';
import UniversalQuizStep from '@/components/universal/UniversalQuizStep';

interface SpecializedStepAdapterProps {
    stepNumber: number;
    data: any;
    onNext: () => void;
    onBack?: () => void;
    funnelId?: string;
}

/**
 * Adapter que converte a interface antiga (SpecializedStepRenderer)
 * para o novo sistema (UniversalQuizStep).
 * 
 * Mapping de props:
 * - stepNumber → stepNumber
 * - data → data
 * - onNext → onNext
 * - onBack → Ignorado (UniversalQuizStep gerencia navegação internamente)
 * - funnelId → funnelId
 */
export const SpecializedStepAdapter: React.FC<SpecializedStepAdapterProps> = ({
    stepNumber,
    data,
    onNext,
    onBack,
    funnelId = 'quiz21StepsComplete'
}) => {
    console.log(`🔄 SpecializedStepAdapter: Adaptando step ${stepNumber} para UniversalQuizStep`);

    return (
        <UniversalQuizStep
            funnelId={funnelId}
            stepNumber={stepNumber}
            data={data}
            onNext={onNext}
            onBack={onBack || (() => console.log('No onBack handler provided'))}
        />
    );
};

export default SpecializedStepAdapter;
