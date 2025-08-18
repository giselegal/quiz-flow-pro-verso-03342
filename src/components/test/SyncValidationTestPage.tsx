import { validateDataSync, ValidationResult } from '@/utils/validateDataSync';
import React, { useEffect, useState } from 'react';

export const SyncValidationTestPage: React.FC = () => {
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const result = validateDataSync();
    setValidation(result);
    console.log('🔍 Validation Result:', result);
  }, []);

  if (!validation) {
    return <div>Carregando validação...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Validação de Sincronização de Dados</h1>

      <div
        className={`p-4 rounded-lg mb-6 ${validation.isValid ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border`}
      >
        <h2 className="text-lg font-semibold mb-2">
          Status: {validation.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}
        </h2>
        <p>Steps no Quiz: {validation.details.totalStepsInQuiz}</p>
        <p>Steps no Mapping: {validation.details.totalStepsInMapping}</p>
      </div>

      {validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Erros Encontrados:</h3>
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="text-red-700 font-mono text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Avisos:</h3>
          <ul className="space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index} className="text-yellow-700 font-mono text-sm">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(validation.details.missingSteps.length > 0 || validation.details.extraSteps.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 Detalhes:</h3>
          {validation.details.missingSteps.length > 0 && (
            <p className="text-blue-700">
              Steps ausentes no mapping: {validation.details.missingSteps.join(', ')}
            </p>
          )}
          {validation.details.extraSteps.length > 0 && (
            <p className="text-blue-700">
              Steps extras no mapping: {validation.details.extraSteps.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
