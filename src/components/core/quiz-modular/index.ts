import { appLogger } from '@/lib/utils/appLogger';
// ❌ DEPRECATED - Componentes Modular* foram removidos da arquitetura v3.0
// A nova arquitetura usa BlockTypeRenderer diretamente via UnifiedStepContent
// 
// MOTIVO: Eliminar camada intermediária de abstração
// - Antes: UnifiedStepContent → Modular* → BlockTypeRenderer → Blocos atômicos  
// - Agora: UnifiedStepContent → BlockTypeRenderer → Blocos atômicos
//
// ⚠️ AVISO: Estes exports são placeholders para manter compatibilidade
// Use BlockTypeRenderer diretamente em UnifiedStepContent.tsx

const DeprecatedComponent = () => {
    if (typeof window !== 'undefined') {
        appLogger.warn('⚠️ DEPRECATED: Componente Modular* foi removido. Use BlockTypeRenderer diretamente.');
    }
    return null;
};

export const ModularIntroStep = DeprecatedComponent;
export const ModularQuestionStep = DeprecatedComponent;
export const ModularStrategicQuestionStep = DeprecatedComponent;
export const ModularTransitionStep = DeprecatedComponent;
export const ModularResultStep = DeprecatedComponent;
export const ModularOfferStep = DeprecatedComponent;
