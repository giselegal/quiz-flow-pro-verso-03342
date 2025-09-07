/**
 * 🎯 UNIFIED EDITOR - CONSOLIDAÇÃO SIMPLIFICADA
 * 
 * Editor consolidado que unifica EditorPro legacy com estrutura moderna
 */

import React, { Suspense } from 'react';
import { useEditor } from '@/components/editor/EditorProvider';
import { logger } from '@/utils/debugLogger';

interface UnifiedEditorProps {
  className?: string;
}

/**
 * 🎨 UNIFIED EDITOR
 * 
 * Ponto de entrada consolidado que carrega dinamicamente o melhor editor disponível
 */
export const UnifiedEditor: React.FC<UnifiedEditorProps> = ({ className = '' }) => {
  // Context do editor com fallback seguro
  let editorContext;
  try {
    editorContext = useEditor();
  } catch (e) {
    editorContext = undefined;
  }

  // Fallback se não há contexto do editor
  if (!editorContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 mb-4 flex items-center justify-center">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro de Contexto do Editor</h2>
          <p className="text-gray-600 mb-4">
            O UnifiedEditor deve ser usado dentro de um EditorProvider.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 1019 5" />
              </svg>
              Recarregar
            </span>
          </button>
        </div>
      </div>
    );
  }

  logger.debug('🎯 UnifiedEditor: Contexto válido, carregando editor...');

  // Componente interno que carrega o editor dinamicamente
  const DynamicEditor = React.useMemo(() => {
    return React.lazy(async () => {
      try {
        // Primeiro, tentar carregar EditorPro (preferência do usuário)
        const legacyMod = await import('@/legacy/editor/EditorPro');
        const LegacyComp = legacyMod.default || legacyMod.EditorPro;
        logger.info('✅ UnifiedEditor: Carregado EditorPro (padrão)');
        try { (window as any).__ACTIVE_EDITOR__ = 'EditorPro'; } catch {}
        return { default: LegacyComp };
      } catch (legacyError) {
        logger.warn('⚠️ UnifiedEditor: EditorPro não disponível, fallback para SchemaDrivenEditorResponsive');
        try {
          // Fallback para arquitetura moderna baseada em schema
          const modernMod = await import('@/components/editor/SchemaDrivenEditorResponsive');
          const ModernComp = modernMod.default;
          logger.info('✅ UnifiedEditor: Carregado SchemaDrivenEditorResponsive (fallback)');
          try { (window as any).__ACTIVE_EDITOR__ = 'SchemaDrivenEditorResponsive'; } catch {}
          return { default: ModernComp };
        } catch (modernError) {
          logger.error('❌ UnifiedEditor: Falha ao carregar qualquer editor', { legacyError, modernError });
          throw new Error('Nenhum editor disponível');
        }
      }
    });
  }, []);

  return (
    <div className={`unified-editor-container ${className}`}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando editor unificado...</p>
          </div>
        </div>
      }>
        <DynamicEditor />
      </Suspense>
    </div>
  );
};

export default UnifiedEditor;