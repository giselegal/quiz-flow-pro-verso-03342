// 🔗 Editor-Bridge (quiz-modular)
// ❌ DEPRECATED - Este arquivo está deprecated desde 2025-10-29
// Os componentes Modular* foram substituídos por renderização direta de blocos via BlockTypeRenderer
// no arquivo UnifiedStepContent.tsx
// 
// MOTIVO: Eliminar camada intermediária de abstração
// - Antes: UnifiedStepContent → Modular* → BlockTypeRenderer → Blocos atômicos
// - Agora: UnifiedStepContent → BlockTypeRenderer → Blocos atômicos
//
// ⚠️ EXPORTS DESABILITADOS - Os componentes foram movidos para archived-deprecated/
// e não são mais acessíveis via TypeScript. Use BlockTypeRenderer diretamente.

// /**
//  * @deprecated Use BlockTypeRenderer diretamente para renderizar blocos.
//  * Os componentes Modular* foram movidos para archived-deprecated/
//  */
// export { default as ModularIntroStep } from '../../archived-deprecated/quiz-estilo/ModularIntroStep';
// export { default as ModularQuestionStep } from '../../archived-deprecated/quiz-estilo/ModularQuestionStep';
// export { default as ModularStrategicQuestionStep } from '../../archived-deprecated/quiz-estilo/ModularStrategicQuestionStep';
// export { default as ModularTransitionStep } from '../../archived-deprecated/quiz-estilo/ModularTransitionStep';
// export { default as ModularResultStep } from '../../archived-deprecated/quiz-estilo/ModularResultStep';
// export { default as ModularOfferStep } from '../../archived-deprecated/quiz-estilo/ModularOfferStep';

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
