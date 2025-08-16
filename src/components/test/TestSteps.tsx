import { CLEAN_21_STEPS } from '@/config/clean21Steps';
import React from 'react';

const TestSteps: React.FC = () => {
  React.useEffect(() => {
    console.log('🔍 Teste CLEAN_21_STEPS:');
    console.log('- Quantidade:', CLEAN_21_STEPS.length);
    console.log('- Dados completos:', CLEAN_21_STEPS);

    if (CLEAN_21_STEPS.length > 0) {
      console.log('- Primeira etapa:', CLEAN_21_STEPS[0]);
      console.log('- Última etapa:', CLEAN_21_STEPS[CLEAN_21_STEPS.length - 1]);
    }
  }, []);

  return (
    <div className="p-4 bg-white border rounded">
      <h3 className="font-bold mb-2">Test 21 Steps</h3>
      <p>Quantidade de etapas: {CLEAN_21_STEPS.length}</p>
      <div className="max-h-40 overflow-y-auto mt-2">
        {CLEAN_21_STEPS.map((step, index) => (
          <div key={step.id} className="text-xs mb-1">
            {index + 1}. {step.name} ({step.type})
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSteps;
