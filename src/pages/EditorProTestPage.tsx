import { EditorProvider } from '@/components/editor/EditorProvider';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import { EditorPro } from '@/components/editor/EditorPro';
import React from 'react';

/**
 * 🧪 Página de teste para o EditorPro Modularizado
 * 
 * Compara performance e funcionalidades com QuizEditorPro original
 */
const EditorProTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <EditorProvider
          enableSupabase={false}
          storageKey="editor-pro-test"
        >
          <div className="container mx-auto py-8">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🧪 EditorPro - Versão Modularizada
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Versão otimizada com lazy loading, componentes modulares e melhor organização do código.
              </p>
            </div>

            {/* Comparação das melhorias */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">🚀 Melhorias Implementadas:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📦 Modularização</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Componentes das colunas separados</li>
                    <li>• Facilita testes individuais</li>
                    <li>• Melhor legibilidade</li>
                    <li>• Manutenção simplificada</li>
                  </ul>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">⚡ Performance</h4>
                  <ul className="text-purple-700 space-y-1">
                    <li>• Lazy loading do painel</li>
                    <li>• Suspense com fallbacks</li>
                    <li>• Bundle inicial menor</li>
                    <li>• TTI reduzido</li>
                  </ul>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🔧 Organização</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Imports mais limpos</li>
                    <li>• Lógica bem estruturada</li>
                    <li>• Documentação clara</li>
                    <li>• TypeScript otimizado</li>
                  </ul>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">✅ Compatibilidade</h4>
                  <ul className="text-orange-700 space-y-1">
                    <li>• 100% funcionalidades preservadas</li>
                    <li>• Drag & Drop mantido</li>
                    <li>• Handlers preservados</li>
                    <li>• API idêntica</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Instruções de teste */}
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">🧪 Como testar as melhorias:</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Loading:</strong> Observe o carregamento do painel de propriedades</li>
                <li>• <strong>Performance:</strong> Compare responsividade vs. versão original</li>
                <li>• <strong>Funcionalidade:</strong> Teste todas as operações DnD</li>
                <li>• <strong>DevTools:</strong> Inspecione bundle size e network requests</li>
              </ul>
            </div>

            {/* Editor Modularizado */}
            <EditorPro />
          </div>
        </EditorProvider>
      </ErrorBoundary>
    </div>
  );
};

export default EditorProTestPage;
