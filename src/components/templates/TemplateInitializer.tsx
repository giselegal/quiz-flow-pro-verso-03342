import React, { useState } from 'react';
import { initializeTemplates } from '../../services/initializeTemplates';
import { Button } from '../ui/button';

export const TemplateInitializer: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleInitialize = async () => {
    setIsInitializing(true);
    setStatus('Iniciando população de templates...');

    try {
      const success = await initializeTemplates();

      if (success) {
        setStatus('✅ Templates inicializados com sucesso!');
      } else {
        setStatus('❌ Erro ao inicializar templates.');
      }
    } catch (error) {
      console.error('Erro na inicialização:', error);
      setStatus('❌ Erro inesperado durante a inicialização.');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Inicialização de Templates</h3>

      <p className="text-gray-600 mb-4">
        Este processo irá popular o banco de dados com templates iniciais se eles ainda não
        existirem.
      </p>

      <Button onClick={handleInitialize} disabled={isInitializing} className="mb-4">
        {isInitializing ? 'Inicializando...' : 'Inicializar Templates'}
      </Button>

      {status && (
        <div
          className={`p-3 rounded ${
            status.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : status.includes('❌')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
};
