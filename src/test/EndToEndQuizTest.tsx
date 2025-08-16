/**
 * 🔄 END-TO-END QUIZ INTEGRATION TEST
 * 
 * Tests the complete flow from user name input → quiz logic → calculations → results
 * Validates that all components work together as documented in the analysis.
 */

import React, { useState, useEffect } from 'react';
import { useQuizLogic } from '../hooks/useQuizLogic';
import { useUserName } from '../hooks/useUserName';
import { calculateQuizResult } from '../lib/quizEngine';

// Mock quiz data for testing
const mockQuestions = [
  {
    id: 'q1',
    title: 'Qual dessas opções melhor descreve seu estilo?',
    options: [
      { id: 'opt1', text: 'Clássico e elegante', style: 'classico', weight: 1 },
      { id: 'opt2', text: 'Romântico e suave', style: 'romântico', weight: 1 },
      { id: 'opt3', text: 'Natural e autêntico', style: 'natural', weight: 1 },
    ]
  },
  {
    id: 'q2', 
    title: 'Como você prefere se vestir no dia a dia?',
    options: [
      { id: 'opt4', text: 'Sempre elegante', style: 'elegante', weight: 1 },
      { id: 'opt5', text: 'Confortável e prático', style: 'natural', weight: 1 },
      { id: 'opt6', text: 'Criativo e único', style: 'criativo', weight: 1 },
    ]
  }
];

export const EndToEndQuizTest: React.FC = () => {
  const [step, setStep] = useState(1);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  // 🎯 HOOKS SENDO TESTADOS
  const quizLogic = useQuizLogic();
  const userName = useUserName();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addResult('🧪 Teste de integração end-to-end iniciado');
    quizLogic.initializeQuiz(mockQuestions);
  }, []);

  const handleUserNameSubmit = (name: string) => {
    addResult(`👤 Nome coletado: ${name}`);
    
    // ✅ TESTE: setUserNameFromInput do useQuizLogic
    quizLogic.setUserNameFromInput(name);
    
    // Verificar se foi salvo corretamente
    const storedName = localStorage.getItem('quizUserName');
    addResult(`💾 Nome salvo no localStorage: ${storedName}`);
    addResult(`🔗 Nome do hook useUserName: ${userName}`);
    
    setStep(2);
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    addResult(`📝 Resposta registrada: ${questionId} → ${optionId}`);
    
    // ✅ TESTE: answerQuestion do useQuizLogic
    quizLogic.answerQuestion(questionId, optionId);
    
    if (quizLogic.answers.length === mockQuestions.length) {
      setStep(3);
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    addResult(`🎯 Finalizando quiz com ${quizLogic.answers.length} respostas`);
    
    // ✅ TESTE: completeQuiz do useQuizLogic
    quizLogic.completeQuiz();
    
    // ✅ TESTE: Cálculo manual com quizEngine
    const manualResult = calculateQuizResult(quizLogic.answers, mockQuestions);
    addResult(`🧮 Cálculo manual concluído: ${manualResult.primaryStyle.style}`);
    
    setStep(4);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🔄 Teste End-to-End: Quiz Integration
      </h1>

      {/* ETAPA 1: COLETA DO NOME */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Etapa 1: Coleta do Nome</h2>
          <p className="text-gray-600">
            Testando a integração entre FormInputBlock → useQuizLogic → useUserName
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const name = formData.get('name') as string;
            handleUserNameSubmit(name);
          }}>
            <input
              type="text"
              name="name"
              placeholder="Digite seu nome"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full mt-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Continuar
            </button>
          </form>
        </div>
      )}

      {/* ETAPA 2: QUIZ QUESTIONS */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Etapa 2: Questão {quizLogic.currentQuestionIndex + 1} de {mockQuestions.length}
          </h2>
          <p className="text-green-600">✅ Nome integrado: {userName}</p>
          
          {mockQuestions[quizLogic.currentQuestionIndex] && (
            <div>
              <h3 className="font-medium mb-3">
                {mockQuestions[quizLogic.currentQuestionIndex].title}
              </h3>
              <div className="space-y-2">
                {mockQuestions[quizLogic.currentQuestionIndex].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(mockQuestions[quizLogic.currentQuestionIndex].id, option.id)}
                    className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {option.text} <span className="text-sm text-gray-500">({option.style})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ETAPA 3: PROCESSAMENTO */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Etapa 3: Processando Resultado</h2>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Calculando seu estilo...</p>
          </div>
        </div>
      )}

      {/* ETAPA 4: RESULTADO */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">🎉 Resultado Final</h2>
          
          {quizLogic.quizResult && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-800">
                Olá {userName}! Seu estilo predominante é:
              </h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {quizLogic.quizResult.primaryStyle.category.toUpperCase()}
              </p>
              <p className="text-green-700 mt-1">
                Pontuação: {quizLogic.quizResult.primaryStyle.points} pontos
                ({quizLogic.quizResult.primaryStyle.percentage}%)
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              quizLogic.restartQuiz();
              setStep(1);
              setTestResults([]);
            }}
            className="w-full p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Reiniciar Teste
          </button>
        </div>
      )}

      {/* LOG DE RESULTADOS */}
      <div className="mt-8 border-t pt-4">
        <h3 className="font-semibold mb-2">📋 Log de Integração:</h3>
        <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index} className="text-sm text-gray-700 mb-1">
              {result}
            </div>
          ))}
        </div>
      </div>

      {/* STATUS DA INTEGRAÇÃO */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded">
          <strong>Respostas:</strong> {quizLogic.answers.length}
        </div>
        <div className="bg-green-50 p-3 rounded">
          <strong>Quiz Completo:</strong> {quizLogic.quizCompleted ? 'Sim' : 'Não'}
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <strong>Nome Usuário:</strong> {quizLogic.userName || 'Não definido'}
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <strong>Resultado:</strong> {quizLogic.quizResult ? 'Calculado' : 'Pendente'}
        </div>
      </div>
    </div>
  );
};

export default EndToEndQuizTest;