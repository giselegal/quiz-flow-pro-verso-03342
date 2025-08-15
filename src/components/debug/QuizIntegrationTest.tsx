import React, { useEffect, useState } from 'react';
import { quizEventDispatcher, createQuizAnswerEvent, createStrategicAnswerEvent } from '@/utils/quizEventDispatcher';

/**
 * Componente de teste para verificar integração entre templates JSON e quiz hooks
 */
const QuizIntegrationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const runIntegrationTest = async () => {
      addResult('🧪 Iniciando teste de integração Quiz JSON → Hooks...');

      // 1. Verificar status do dispatcher
      const status = quizEventDispatcher.getCurrentAnswers();
      addResult(`📊 Estado inicial: ${status.length} respostas no dispatcher`);

      // 2. Simular resposta de quiz via JSON template
      try {
        const quizEvent = createQuizAnswerEvent('q1', '1a', 3, 'Natural');
        addResult('📤 Simulando resposta de quiz via dispatcher...');
        await quizEventDispatcher.emitQuizAnswer(quizEvent);
        addResult('✅ Resposta de quiz emitida com sucesso');
      } catch (error) {
        addResult(`❌ Erro ao emitir resposta de quiz: ${error}`);
      }

      // 3. Simular resposta estratégica
      try {
        const strategicEvent = createStrategicAnswerEvent('strategic1', 'st1a', 13, 'Strategic', 'identity');
        addResult('📤 Simulando resposta estratégica via dispatcher...');
        await quizEventDispatcher.emitStrategicAnswer(strategicEvent);
        addResult('✅ Resposta estratégica emitida com sucesso');
      } catch (error) {
        addResult(`❌ Erro ao emitir resposta estratégica: ${error}`);
      }

      // 4. Verificar se os dados foram capturados
      setTimeout(() => {
        const updatedAnswers = quizEventDispatcher.getCurrentAnswers();
        const strategicAnswers = quizEventDispatcher.getStrategicAnswers();
        
        addResult(`📊 Estado final:`);
        addResult(`   • Respostas quiz: ${updatedAnswers.length}`);
        addResult(`   • Respostas estratégicas: ${strategicAnswers.length}`);
        
        if (updatedAnswers.length > status.length) {
          addResult('✅ Integração funcionando: Dados foram capturados pelos hooks');
        } else {
          addResult('⚠️ Integração pode ter problemas: Dados não foram capturados');
        }
        
        addResult('🎯 Teste de integração concluído!');
      }, 1000);
    };

    runIntegrationTest();
  }, []);

  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-800">🧪 Teste de Integração Quiz</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {testResults.map((result, index) => (
          <div 
            key={index} 
            className={`p-2 rounded text-sm font-mono ${
              result.includes('✅') ? 'bg-green-100 text-green-800' :
              result.includes('❌') ? 'bg-red-100 text-red-800' :
              result.includes('📤') ? 'bg-yellow-100 text-yellow-800' :
              result.includes('🧪') || result.includes('🎯') ? 'bg-purple-100 text-purple-800' :
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

export default QuizIntegrationTest;