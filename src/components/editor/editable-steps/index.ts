

/**
 * 📦 EDITABLE STEPS INDEX
 * 
 * Exportações centrais de todos os componentes editáveis.
 * FASE 2 COMPLETA ✅ - Todos os componentes implementados!
 */

// Componentes editáveis principais ✅ IMPLEMENTADOS
export { default as EditableIntroStep } from './EditableIntroStep';
export { default as EditableQuestionStep } from './EditableQuestionStep';
export { default as EditableResultStep } from './EditableResultStep';
export { default as EditableOfferStep } from './EditableOfferStep';
export { default as EditableStrategicQuestionStep } from './EditableStrategicQuestionStep';
export { default as EditableTransitionStep } from './EditableTransitionStep';

// Componentes auxiliares ✅ IMPLEMENTADOS
export { EditableBlockWrapper } from './shared/EditableBlockWrapper';
export { PropertyHighlighter } from './shared/PropertyHighlighter';
export { LiveEditControls } from './shared/LiveEditControls';

// Tipos e interfaces ✅ IMPLEMENTADOS
export type { EditableStepProps } from './shared/EditableStepProps';

/**
 * 🗂️ MAPEAMENTO DE TIPOS PARA COMPONENTES
 * 
 * Para uso no renderRealComponent do QuizFunnelEditorWYSIWYG
 */
export const EDITABLE_COMPONENTS_MAP = {
    'intro': 'EditableIntroStep',
    'question': 'EditableQuestionStep',
    'strategic-question': 'EditableStrategicQuestionStep',
    'transition': 'EditableTransitionStep',
    'transition-result': 'EditableTransitionStep', // Reutilizar
    'result': 'EditableResultStep',
    'offer': 'EditableOfferStep'
} as const;

/**
 * 📋 STATUS DA IMPLEMENTAÇÃO
 * 
 * FASE 1: ✅ COMPLETA
 * - Análise dos componentes de produção ✅
 * - Interface EditorComponentAdapter ✅  
 * - ComponentAdapterRegistry ✅
 * - Estrutura de diretórios ✅
 * 
 * FASE 2: 🚧 PRÓXIMA
 * - EditableIntroStep.tsx (~150 linhas)
 * - EditableQuestionStep.tsx (~120 linhas)
 * - EditableResultStep.tsx (~200 linhas)
 * - EditableOfferStep.tsx (~150 linhas)
 * - EditableStrategicQuestionStep.tsx (~100 linhas)
 * - EditableTransitionStep.tsx (~80 linhas)
 * - Componentes auxiliares (EditableBlockWrapper, PropertyHighlighter, LiveEditControls)
 * 
 * FASE 3: ⏳ AGUARDANDO
 * - Refatorar renderRealComponent no QuizFunnelEditorWYSIWYG
 * - Integrar painel de propriedades
 * - Remover toggle de sistemas
 * 
 * FASE 4: ⏳ AGUARDANDO
 * - Remover imports diretos de produção
 * - Consolidar estados duplicados
 * - Limpar código morto
 * 
 * FASE 5: ⏳ AGUARDANDO
 * - Testes funcionais
 * - Validação de performance
 * - Documentação final
 */