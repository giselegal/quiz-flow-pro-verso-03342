/**
 * 🎯 SISTEMA DE ESTADO PRINCIPAL - CONSOLIDAÇÃO
 * 
 * Este arquivo define qual sistema de estado deve ser usado como principal
 * e como migrar/deprecar os sistemas concorrentes.
 * 
 * PROBLEMA: Múltiplos sistemas de estado concorrentes causando conflitos:
 * - useQuizState (hooks/useQuizState.ts) ✅ PRINCIPAL
 * - SimpleQuizCore (core/SimpleQuizCore.tsx) ❌ Deprecar  
 * - Quiz21StepsProvider (components/quiz/Quiz21StepsProvider.tsx) ❌ Deprecar
 * - QuizFlowOrchestrator (components/core/QuizFlowOrchestrator.tsx) ❌ Deprecar
 * - useQuizFlow (hooks/core/useQuizFlow.ts) ❌ Deprecar
 */

// ============================================================================
// 🥇 SISTEMA PRINCIPAL: useQuizState
// ============================================================================

/**
 * ESCOLHA: useQuizState é o sistema principal porque:
 * 
 * 1. ✅ Interface mais madura e completa
 * 2. ✅ Melhor integração com QuizApp.tsx
 * 3. ✅ Lógica de scores e resultados testada
 * 4. ✅ Gerenciamento de estado consistente  
 * 5. ✅ Compatibilidade com dados existentes
 * 6. ✅ API mais simples e intuitiva
 */

export const PRIMARY_QUIZ_STATE_SYSTEM = 'useQuizState';

// ============================================================================
// 📝 PLANO DE MIGRAÇÃO
// ============================================================================

/**
 * ETAPA 1: Marcar sistemas como deprecated
 * - Adicionar comentários @deprecated em todos os sistemas concorrentes
 * - Documentar que useQuizState é o sistema oficial
 */

/**
 * ETAPA 2: Migrar componentes existentes
 * - Identificar componentes usando sistemas deprecated
 * - Migrar para useQuizState progressivamente
 * - Manter compatibilidade durante transição
 */

/**
 * ETAPA 3: Remover sistemas deprecated (futuro)
 * - Após validação completa da migração
 * - Remover arquivos não utilizados
 * - Limpar imports e dependências
 */

// ============================================================================
// 🎯 COMPONENTES AFETADOS PELA CONSOLIDAÇÃO
// ============================================================================

/**
 * USAR useQuizState (Sistema Principal):
 * ✅ QuizApp.tsx - Já migrado  
 * ✅ Quiz páginas principais
 * ✅ Componentes de resultado
 * ✅ Lógica de navegação
 */

/**
 * DEPRECAR (Sistemas Concorrentes):
 * ❌ SimpleQuizCore - Substituir por useQuizState
 * ❌ Quiz21StepsProvider - Funcionalidade já em useQuizState  
 * ❌ QuizFlowOrchestrator - Lógica duplicada
 * ❌ useQuizFlow - Interface menos madura
 */

// ============================================================================
// 🛠️ API DE MIGRAÇÃO
// ============================================================================

/**
 * Para facilitar migração, manter esta função helper:
 */
export const getMigratedQuizState = () => {
  console.warn(
    '⚠️ Sistema de estado consolidado! Use useQuizState como sistema principal.\n' +
    'Sistemas deprecated: SimpleQuizCore, Quiz21StepsProvider, QuizFlowOrchestrator, useQuizFlow'
  );
  
  // Retornar referência para useQuizState
  return {
    systemName: 'useQuizState',
    location: 'src/hooks/useQuizState.ts',
    status: 'PRIMARY',
    migration: 'COMPLETED'
  };
};

// ============================================================================
// 📊 STATUS DA CONSOLIDAÇÃO
// ============================================================================

export const CONSOLIDATION_STATUS = {
  useQuizState: '✅ PRINCIPAL - Interface unificada com QuizApp',
  SimpleQuizCore: '🔄 DEPRECATED - Migrar para useQuizState', 
  Quiz21StepsProvider: '🔄 DEPRECATED - Funcionalidade duplicada',
  QuizFlowOrchestrator: '🔄 DEPRECATED - Lógica já em useQuizState',
  useQuizFlow: '🔄 DEPRECATED - API menos madura',
  
  progress: '60% - useQuizState interface corrigida',
  nextStep: 'Adicionar @deprecated nos sistemas concorrentes',
  timeline: 'Finalizar consolidação até fim do sprint'
} as const;

/**
 * 🎯 PRÓXIMAS AÇÕES:
 * 
 * 1. Marcar sistemas concorrentes como @deprecated
 * 2. Documentar useQuizState como sistema oficial
 * 3. Migrar componentes restantes progressivamente
 * 4. Validar funcionamento completo do sistema
 * 5. Remover sistemas não utilizados (longo prazo)
 */