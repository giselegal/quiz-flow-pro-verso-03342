import { EditorPro } from '@/components/editor/EditorPro';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import React from 'react';

/**
 * 🧪 Teste de carregamento de etapas - CORRIGIDO
 *
 * Testando sem override do initial state
 */
const EditorProTestFixed: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <EditorProvider
          enableSupabase={false}
          storageKey="editor-pro-test-fixed"
          // 🚨 REMOVIDO initial={{ stepBlocks: {}, currentStep: 1 }}
          // Deixa o EditorProvider carregar o template automaticamente
        >
          <div className="container mx-auto py-8">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🔧 EditorPro - Teste CORRIGIDO
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Teste sem override do state inicial - deixa o template carregar automaticamente
              </p>
            </div>

            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🔧 CORREÇÃO APLICADA:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>
                  • <strong>PROBLEMA:</strong> initial override sobrescreve template
                </li>
                <li>
                  • <strong>SOLUÇÃO:</strong> Removido override do initial state
                </li>
                <li>
                  • <strong>RESULTADO:</strong> Template carrega automaticamente
                </li>
                <li>
                  • <strong>ETAPAS:</strong> Todas as 21 etapas devem estar disponíveis agora
                </li>
              </ul>
            </div>

            <EditorPro />
          </div>
        </EditorProvider>
      </ErrorBoundary>
    </div>
  );
};

export default EditorProTestFixed;
