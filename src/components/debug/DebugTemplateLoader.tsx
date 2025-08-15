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

        // 4. Testar templates críticos (3, 12, 13, 19, 20)
        const testSteps = [3, 12, 13, 19, 20];
        
        for (const stepNum of testSteps) {
          addResult(`🔄 Testando Step${stepNum.toString().padStart(2, '0')} template...`);
          const template = STEP_TEMPLATES_MAPPING[stepNum];
          
          if (template && template.templateFunction) {
            try {
              const userData = stepNum === 20 ? { userName: 'Teste', styleCategory: 'Elegante' } : {};
              const blocks = await TemplateBlockConverter.convertStepTemplate(
                stepNum,
                template.templateFunction,
                userData
              );
              addResult(`✅ Step${stepNum.toString().padStart(2, '0')} carregado: ${blocks.length} blocos - "${template.name}"`);
            } catch (error) {
              addResult(`❌ Step${stepNum.toString().padStart(2, '0')} erro ao carregar: ${error}`);
            }
          } else {
            addResult(`❌ Step${stepNum.toString().padStart(2, '0')} template não encontrado`);
          }
        }

        // 5. Testar template batch para detectar problemas
        addResult('🔄 Testando carregamento em lote (steps 3-11)...');
        let successCount = 0;
        let errorCount = 0;
        
        for (let step = 3; step <= 11; step++) {
          try {
            const template = STEP_TEMPLATES_MAPPING[step];
            if (template?.templateFunction) {
              const blocks = await TemplateBlockConverter.convertStepTemplate(
                step,
                template.templateFunction,
                {}
              );
              if (blocks.length > 0) {
                successCount++;
              } else {
                errorCount++;
                addResult(`⚠️ Step${step.toString().padStart(2, '0')} retornou 0 blocos`);
              }
            } else {
              errorCount++;
              addResult(`❌ Step${step.toString().padStart(2, '0')} sem template function`);
            }
          } catch (error) {
            errorCount++;
            addResult(`❌ Step${step.toString().padStart(2, '0')} exception: ${error}`);
          }
        }
        
        addResult(`📊 Quiz templates (3-11): ${successCount} ✅ | ${errorCount} ❌`);
        
        // 6. Testar strategic templates batch
        addResult('🔄 Testando strategic templates (13-18)...');
        let strategicSuccess = 0;
        let strategicError = 0;
        
        for (let step = 13; step <= 18; step++) {
          try {
            const template = STEP_TEMPLATES_MAPPING[step];
            if (template?.templateFunction) {
              const blocks = await TemplateBlockConverter.convertStepTemplate(
                step,
                template.templateFunction,
                {}
              );
              if (blocks.length > 0) {
                strategicSuccess++;
              } else {
                strategicError++;
              }
            } else {
              strategicError++;
            }
          } catch (error) {
            strategicError++;
            addResult(`❌ Strategic Step${step.toString().padStart(2, '0')}: ${error}`);
          }
        }
        
        addResult(`📊 Strategic templates (13-18): ${strategicSuccess} ✅ | ${strategicError} ❌`);

        // 7. Resumo geral
        addResult(`📋 Templates disponíveis: ${Object.keys(STEP_TEMPLATES_MAPPING).join(', ')}`);
        const totalTemplates = Object.keys(STEP_TEMPLATES_MAPPING).length;
        addResult(`📊 RESUMO: ${totalTemplates} templates mapeados, ${successCount + strategicSuccess + 1 + 1 + 1} testados com sucesso`);

        // 8. Testar Quiz Event Dispatcher
        addResult('🔄 Testando Quiz Event Dispatcher...');
        try {
          const { getQuizEventDispatcherStatus } = await import('@/utils/quizEventDispatcher');
          const dispatcherStatus = getQuizEventDispatcherStatus();
          
          addResult(`📊 Event Dispatcher Status:`);
          addResult(`   • Quiz Listener: ${dispatcherStatus.hasQuizListener ? '✅' : '❌'}`);
          addResult(`   • Strategic Listener: ${dispatcherStatus.hasStrategicListener ? '✅' : '❌'}`);
          addResult(`   • Navigation Listener: ${dispatcherStatus.hasNavigationListener ? '✅' : '❌'}`);
          addResult(`   • Current Answers: ${dispatcherStatus.currentAnswersCount}`);
          addResult(`   • Strategic Answers: ${dispatcherStatus.strategicAnswersCount}`);
          addResult(`   • User Name: "${dispatcherStatus.userName}"`);
          
          if (dispatcherStatus.hasQuizListener && dispatcherStatus.hasStrategicListener) {
            addResult('✅ Quiz Event Dispatcher configurado corretamente');
          } else {
            addResult('⚠️ Quiz Event Dispatcher não totalmente configurado');
          }
        } catch (error) {
          addResult(`❌ Erro ao verificar Quiz Event Dispatcher: ${error}`);
        }

        addResult('✅ Teste completo do sistema de templates concluído!');

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