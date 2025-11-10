import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * COMPONENTE DE DEBUG PARA TESTAR O LEAD FORM
 * Verificar se os componentes estão sendo carregados corretamente
 */
const DebugLeadForm: React.FC = () => {
  const handleTestLeadForm = () => {
    appLogger.info('🧪 Teste de debug do LeadFormBlock');

    // Simular dados do bloco
    const mockBlock = {
      id: 'debug-lead-form',
      type: 'lead-form',
      properties: {
        fields: ['name', 'email', 'phone'],
        submitText: 'Teste Formulário',
        backgroundColor: '#FFFFFF',
        borderColor: '#B89B7A',
        textColor: '#432818',
        primaryColor: '#B89B7A',
      },
    };

    appLogger.info('🎯 Mock block criado:', { data: [mockBlock] });

    // Disparar evento para teste
    window.dispatchEvent(
      new CustomEvent('debug-test-lead-form', {
        detail: mockBlock,
      }),
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-yellow-800">Debug Lead Form</h3>
        <button
          onClick={handleTestLeadForm}
          className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-xs font-medium text-yellow-800 transition-colors"
        >
          Testar Lead Form
        </button>
        <div className="text-xs text-yellow-600">Verifique o console para logs</div>
      </div>
    </div>
  );
};

export default DebugLeadForm;
