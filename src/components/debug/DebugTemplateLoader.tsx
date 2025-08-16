import React, { useEffect, useState } from 'react';

/**
 * Debug Component - Teste do sistema de carregamento de templates
 */
const DebugTemplateLoader: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const testTemplateSystem = async () => {
      addResult('🔄 Iniciando teste do sistema de templates...');

      try {
        // 1. Testar imports
        addResult('📦 Testando imports...');
        const { STEP_TEMPLATES_MAPPING } = await import('@/config/stepTemplatesMapping');
        const { TemplateBlockConverter } = await import('@/utils/templateBlockConverter');
        
        addResult(`✅ STEP_TEMPLATES_MAPPING carregado: ${Object.keys(STEP_TEMPLATES_MAPPING).length} templates`);
        addResult('✅ TemplateBlockConverter carregado');

        // 2. Testar template Step01
        addResult('🔄 Testando Step01 template...');
        const step1Template = STEP_TEMPLATES_MAPPING[1];
        if (step1Template && step1Template.templateFunction) {
          const step1Blocks = await TemplateBlockConverter.convertStepTemplate(
            1,
            step1Template.templateFunction,
            { userName: 'Teste' }
          );
          addResult(`✅ Step01 carregado: ${step1Blocks.length} blocos`);
        } else {
          addResult('❌ Step01 template não encontrado');
        }

        // 3. Testar template Step02 corrigido
        addResult('🔄 Testando Step02 template corrigido...');
        const step2Template = STEP_TEMPLATES_MAPPING[2];
        if (step2Template && step2Template.templateFunction) {
          const step2Blocks = await TemplateBlockConverter.convertStepTemplate(
            2,
            step2Template.templateFunction,
            { userName: 'Teste' }
          );
          addResult(`✅ Step02 corrigido carregado: ${step2Blocks.length} blocos`);
        } else {
          addResult('❌ Step02 template não encontrado');
        }

        // 4. Testar template Step20
        addResult('🔄 Testando Step20 template...');
        const step20Template = STEP_TEMPLATES_MAPPING[20];
        if (step20Template && step20Template.templateFunction) {
          const step20Blocks = await TemplateBlockConverter.convertStepTemplate(
            20,
            step20Template.templateFunction,
            { userName: 'Teste', styleCategory: 'Elegante' }
          );
          addResult(`✅ Step20 carregado: ${step20Blocks.length} blocos`);
        } else {
          addResult('❌ Step20 template não encontrado');
        }

        // 5. Listar todos os templates disponíveis
        addResult(`📋 Templates disponíveis: ${Object.keys(STEP_TEMPLATES_MAPPING).join(', ')}`);

        addResult('✅ Teste do sistema de templates concluído!');

      } catch (error) {
        addResult(`❌ Erro durante teste: ${error}`);
        console.error('Erro no teste de templates:', error);
      }
    };

    testTemplateSystem();
  }, []);

  return (
    <div className="p-6 bg-white border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-800">🧪 Debug - Sistema de Templates</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {testResults.map((result, index) => (
          <div 
            key={index} 
            className={`p-2 rounded text-sm font-mono ${
              result.includes('✅') ? 'bg-green-100 text-green-800' :
              result.includes('❌') ? 'bg-red-100 text-red-800' :
              result.includes('🔄') ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugTemplateLoader;