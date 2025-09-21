/**
 * 🚀 SIMPLIFIED OPTIMIZED EDITOR - TEMPORARY PASSTHROUGH
 * 
 * FIXME: Este arquivo está temporariamente redirecionando para ModularEditorPro
 * devido a incompatibilidades com SimpleBuilderProvider vs EditorProvider.
 * 
 * TODO: Migrar completamente para usar SimpleBuilderProvider state structure:
 * - Trocar `stepBlocks` por `steps`
 * - Implementar template loading otimizado compatível
 * - Adaptar métricas de performance para novo estado
 */

import React from 'react';
import ModularEditorPro from './ModularEditorPro';

/**
 * Passthrough component - redireciona para ModularEditorPro funcional
 */
const SimplifiedOptimizedEditor: React.FC = () => {
  console.warn('⚠️ SimplifiedOptimizedEditor: Usando fallback para ModularEditorPro (migração pendente)');
  
  return <ModularEditorPro />;
};

SimplifiedOptimizedEditor.displayName = 'SimplifiedOptimizedEditor';

export default SimplifiedOptimizedEditor;