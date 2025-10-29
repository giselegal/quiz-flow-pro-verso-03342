// 🔗 Editor-Bridge (quiz-modular)
// ❌ DEPRECATED - Este arquivo está deprecated desde 2025-10-29
// Os componentes Modular* foram substituídos por renderização direta de blocos via BlockTypeRenderer
// no arquivo UnifiedStepContent.tsx
// 
// MOTIVO: Eliminar camada intermediária de abstração
// - Antes: UnifiedStepContent → Modular* → BlockTypeRenderer → Blocos atômicos
// - Agora: UnifiedStepContent → BlockTypeRenderer → Blocos atômicos
//
// ⚠️ AVISO: Exports removidos. Use BlockTypeRenderer diretamente.
// Os componentes Modular* foram movidos para archived-deprecated/ e não devem mais ser importados.

/**
 * @deprecated Este arquivo não exporta mais componentes.
 * Use BlockTypeRenderer diretamente em UnifiedStepContent.
 */
export const DEPRECATED_MESSAGE = 'Use BlockTypeRenderer para renderizar blocos atômicos diretamente';

// Exports vazios para manter compatibilidade de importação (evitar quebrar código antigo)
// Retornam componentes placeholder que exibem mensagem de deprecation
const DeprecatedComponent = () => {
    if (typeof window !== 'undefined') {
        console.warn('⚠️ DEPRECATED: Componente Modular* foi removido. Use BlockTypeRenderer diretamente.');
    }
    return null;
};

export const ModularIntroStep = DeprecatedComponent;
export const ModularQuestionStep = DeprecatedComponent;
export const ModularStrategicQuestionStep = DeprecatedComponent;
export const ModularTransitionStep = DeprecatedComponent;
export const ModularResultStep = DeprecatedComponent;
export const ModularOfferStep = DeprecatedComponent;
