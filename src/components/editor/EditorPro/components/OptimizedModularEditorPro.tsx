/**
 * 🚀 OPTIMIZED MODULAR EDITOR PRO - TEMPORARY PASSTHROUGH
 * 
 * FIXME: Este arquivo está temporariamente redirecionando para ModularEditorPro
 * devido a incompatibilidades com SimpleBuilderProvider vs EditorProvider.
 * 
 * TODO: Migrar completamente para usar SimpleBuilderProvider state structure:
 * - Trocar `stepBlocks` por `steps`
 * - Implementar seleção de bloco local em vez de usar `selectedBlockId` do estado
 * - Adaptar todas as ações para usar SimpleBuilderActions
 */

import React from 'react';
import ModularEditorPro from './ModularEditorPro';

/**
 * Passthrough component - redireciona para ModularEditorPro funcional
 */
const OptimizedModularEditorPro: React.FC = () => {
  console.warn('⚠️ OptimizedModularEditorPro: Usando fallback para ModularEditorPro (migração pendente)');
  
  return <ModularEditorPro />;
};

OptimizedModularEditorPro.displayName = 'OptimizedModularEditorPro';

export default OptimizedModularEditorPro;