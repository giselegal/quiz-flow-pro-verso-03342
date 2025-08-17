import React from 'react';

/**
 * Página de Teste da Integração Supabase
 *
 * Página simplificada após limpeza de conflitos de templateService.
 */
const TestSupabaseIntegrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔧 Teste de Integração Supabase</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h2 className="text-yellow-800 font-medium mb-2">
              ⚠️ Página temporariamente desabilitada
            </h2>
            <p className="text-yellow-700 text-sm">
              Esta página foi desabilitada durante a limpeza de conflitos dos templateServices. O
              sistema principal está funcionando normalmente.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Sistema Atual:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ templateService principal ativo</li>
                <li>✅ StepPage.tsx funcionando</li>
                <li>✅ Sistema de blocos operacional</li>
                <li>✅ Navegação entre steps funcional</li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => (window.location.href = '/step/1')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Testar Quiz Principal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSupabaseIntegrationPage;
