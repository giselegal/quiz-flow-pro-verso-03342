/**
 * 🎯 EDITOR CONSOLIDADO - PONTO DE ENTRADA OFICIAL
 * 
 * Este é o ponto de entrada oficial consolidado para o sistema de editor.
 * Substitui a fragmentação entre MainEditor, EditorPro, ModularEditorPro, etc.
 */

import React from 'react';
import { logger } from '@/utils/debugLogger';

export interface EditorConsolidatedProps {
  className?: string;
}

/**
 * 🏗️ DOCUMENTAÇÃO DA ARQUITETURA CONSOLIDADA
 * 
 * PONTOS DE ENTRADA OFICIAIS (em ordem de prioridade):
 * 
 * 1. 🎯 PRIMARY: /src/pages/MainEditor.tsx
 *    - Ponto de entrada principal da aplicação
 *    - Gerencia providers e contexto
 *    - Carrega editor dinâmicamente
 * 
 * 2. 🔧 FALLBACK: /src/legacy/editor/EditorPro.tsx  
 *    - Editor legacy completo (~868 linhas)
 *    - Mantido por compatibilidade
 *    - Funcionalidade completa e testada
 * 
 * 3. 🚀 MODERN: /src/components/editor/SchemaDrivenEditorResponsive.tsx
 *    - Arquitetura moderna responsiva
 *    - 4 colunas adaptáveis
 *    - Sistema unificado
 * 
 * COMPONENTES AUXILIARES:
 * - /src/components/editor/EditorPro/ (componentes modulares)  
 * - /src/components/editor/unified/ (sistema unificado)
 * - /src/components/editor/properties/ (painel de propriedades)
 * 
 * STATUS DA CONSOLIDAÇÃO:
 * ✅ Build limpo e funcional
 * ✅ Segurança RLS implementada  
 * ✅ Editor funcionando
 * ✅ Sistema NOCODE ativo
 * ✅ Drag & Drop operacional
 * ✅ 21 etapas carregando
 * ⏳ Otimizações de performance (Fase 2)
 * ⏳ Limpeza de arquivos redundantes (Fase 2)
 */
export const EditorConsolidated: React.FC<EditorConsolidatedProps> = ({ className = '' }) => {
  logger.info('🎯 EditorConsolidated: Redirecionando para UnifiedEditor');
  
  // Carregar UnifiedEditor dinamicamente
  const UnifiedEditor = React.useMemo(() => {
    return React.lazy(async () => {
      try {
        const mod = await import('./UnifiedEditor');
        return { default: mod.default };
      } catch (error) {
        logger.error('❌ EditorConsolidated: Falha ao carregar UnifiedEditor', error);
        throw error;
      }
    });
  }, []);

  return (
    <div className={`editor-consolidated ${className}`}>
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Inicializando editor consolidado...</p>
          </div>
        </div>
      }>
        <UnifiedEditor className={className} />
      </React.Suspense>
    </div>
  );
};

export default EditorConsolidated;