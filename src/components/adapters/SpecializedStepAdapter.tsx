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
import { appLogger } from '@/lib/utils/appLogger';

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
    funnelId, // 🎯 CORREÇÃO: Sem default hardcoded - deve ser passado via props
}) => {
    appLogger.info(`🔄 SpecializedStepAdapter: Adaptando step ${stepNumber} para UniversalQuizStep`);

    // 🎯 Early return se funnelId não foi fornecido
    if (!funnelId) {
        appLogger.warn('SpecializedStepAdapter: funnelId não fornecido');
        return (
            <div className="p-4 text-center text-muted-foreground">
                Erro: funnelId não fornecido
            </div>
        );
    }

    return (
        <UniversalQuizStep
            funnelId={funnelId}
            stepNumber={stepNumber}
            data={data}
            onNext={onNext}
            onBack={onBack || (() => appLogger.info('No onBack handler provided'))}
        />
    );
};

export default SpecializedStepAdapter;
