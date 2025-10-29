// 🔗 Editor-Bridge (quiz-modular)
// ❌ DEPRECATED - Este arquivo está deprecated desde 2025-10-29
// Os componentes Modular* foram substituídos por renderização direta de blocos via BlockTypeRenderer
// no arquivo UnifiedStepContent.tsx
// 
// MOTIVO: Eliminar camada intermediária de abstração
// - Antes: UnifiedStepContent → Modular* → BlockTypeRenderer → Blocos atômicos
// - Agora: UnifiedStepContent → BlockTypeRenderer → Blocos atômicos
//
// Esses exports são mantidos apenas para compatibilidade temporária com testes antigos.
// Os componentes reais foram movidos para archived-deprecated/quiz-estilo/

/**
 * @deprecated Use BlockTypeRenderer diretamente para renderizar blocos.
 * Os componentes Modular* foram movidos para archived-deprecated/
 */
export { default as ModularIntroStep } from '../../archived-deprecated/quiz-estilo/ModularIntroStep';
/**
 * @deprecated Use BlockTypeRenderer diretamente para renderizar blocos.
 * Os componentes Modular* foram movidos para archived-deprecated/
 */
export { default as ModularQuestionStep } from '../../archived-deprecated/quiz-estilo/ModularQuestionStep';
/**
 * @deprecated Use BlockTypeRenderer diretamente para renderizar blocos.
 * Os componentes Modular* foram movidos para archived-deprecated/
 */
export { default as ModularStrategicQuestionStep } from '../../archived-deprecated/quiz-estilo/ModularStrategicQuestionStep';
/**
 * @deprecated Use BlockTypeRenderer diretamente para renderizar blocos.
 * Os componentes Modular* foram movidos para archived-deprecated/
 */
export { default as ModularTransitionStep } from '../../archived-deprecated/quiz-estilo/ModularTransitionStep';
/**
 * @deprecated Use BlockTypeRenderer diretamente para renderizar blocos.
 * Os componentes Modular* foram movidos para archived-deprecated/
 */
export { default as ModularResultStep } from '../../archived-deprecated/quiz-estilo/ModularResultStep';
/**
 * @deprecated Use BlockTypeRenderer diretamente para renderizar blocos.
 * Os componentes Modular* foram movidos para archived-deprecated/
 */
export { default as ModularOfferStep } from '../../archived-deprecated/quiz-estilo/ModularOfferStep';
