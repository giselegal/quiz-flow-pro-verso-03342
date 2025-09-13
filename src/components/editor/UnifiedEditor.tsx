/**
 * 🎯 UNIFIED EDITOR - CONSOLIDAÇÃO SIMPLIFICADA COM OTIMIZAÇÕES DE PERFORMANCE
 * 
 * Editor consolidado que unifica EditorPro legacy com estrutura moderna
 * Integrado com sistema de lazy loading inteligente, memoização avançada e profiling
 */

import React, { Suspense } from 'react';
import { useEditor } from '@/components/editor/EditorProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logger } from '@/utils/debugLogger';
import { PerformanceProfiler, withPerformanceProfiler } from '@/utils/performance/PerformanceProfiler';
import { EditorLazyComponents } from '@/utils/performance/LazyLoadingSystem';

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

  // Componente interno que carrega o editor dinamicamente com otimizações de performance
  const DynamicEditor = React.useMemo(() => {
    return React.lazy(async () => {
      try {
        // Primeiro, tentar carregar EditorPro (preferência do usuário) com lazy loading otimizado
        logger.info('🚀 UnifiedEditor: Iniciando carregamento do EditorPro com lazy loading...');

        // Usar sistema de lazy loading inteligente para EditorPro
        const LegacyEditor = EditorLazyComponents.EditorPro;

        // Wrapper com performance profiling
        const ProfiledEditor = withPerformanceProfiler(LegacyEditor, 'EditorPro-Unified');

        logger.info('✅ UnifiedEditor: Carregado EditorPro com otimizações (padrão)');
        try { (window as any).__ACTIVE_EDITOR__ = 'EditorPro-Optimized'; } catch { }

        return { default: ProfiledEditor };
      } catch (legacyError) {
        logger.warn('⚠️ UnifiedEditor: EditorPro não disponível, fallback para SchemaDrivenEditorResponsive');
        try {
          // Fallback para arquitetura moderna baseada em schema (carregamento manual)
          const modernMod = await import('@/components/editor/SchemaDrivenEditorResponsive');
          const ModernEditor = modernMod.default;
          const ProfiledModernEditor = withPerformanceProfiler(ModernEditor, 'SchemaDriven-Unified');

          logger.info('✅ UnifiedEditor: Carregado SchemaDrivenEditorResponsive com otimizações (fallback)');
          try { (window as any).__ACTIVE_EDITOR__ = 'SchemaDriven-Optimized'; } catch { }

          return { default: ProfiledModernEditor };
        } catch (modernError) {
          logger.error('❌ UnifiedEditor: Falha ao carregar qualquer editor', { legacyError, modernError });
          throw new Error('Nenhum editor disponível');
        }
      }
    });
  }, []);

  // Fallback loading otimizado
  const optimizedLoadingFallback = React.useMemo(() => (
    <div className="flex items-center justify-center h-64 bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="md" className="mb-4" />
        <p className="text-gray-600 font-medium">Carregando editor unificado...</p>
        <p className="text-gray-400 text-sm mt-2">Aplicando otimizações de performance...</p>
      </div>
    </div>
  ), []);

  return (
    <PerformanceProfiler id="UnifiedEditor-Container" enableLogging>
      <div className={`unified-editor-container ${className}`}>
        <Suspense fallback={optimizedLoadingFallback}>
          <DynamicEditor />
        </Suspense>
      </div>
    </PerformanceProfiler>
  );
};

export default UnifiedEditor;