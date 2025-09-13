import React, { Suspense } from 'react';
import { useEditor } from '@/components/editor/EditorProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface UnifiedEditorProps {
  className?: string;
}

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
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Componente interno que carrega o editor dinamicamente
  const DynamicEditor = React.useMemo(() => {
    return React.lazy(async () => {
      try {
        const LegacyEditor = await import('@/legacy/editor/EditorPro');
        return { default: LegacyEditor.default };
      } catch (legacyError) {
        try {
          const modernMod = await import('@/components/editor/SchemaDrivenEditorResponsive');
          return { default: modernMod.default };
        } catch (modernError) {
          throw new Error('Nenhum editor disponível');
        }
      }
    });
  }, []);

  const optimizedLoadingFallback = React.useMemo(() => (
    <div className="flex items-center justify-center h-64 bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="md" className="mb-4" />
        <p className="text-gray-600 font-medium">Carregando editor unificado...</p>
      </div>
    </div>
  ), []);

  return (
    <div className={`unified-editor-container ${className}`}>
      <Suspense fallback={optimizedLoadingFallback}>
        <DynamicEditor />
      </Suspense>
    </div>
  );
};

export default UnifiedEditor;