import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import { ConnectedQuizResultsBlock } from '@/components/quiz-results/ConnectedQuizResultsBlock';
import { Button } from '@/components/ui/button';
import caktoquizQuestions from '@/data/caktoquizQuestions';

/**
 * PÁGINA DE FLUXO COMPLETO DO QUIZ DE 21 ETAPAS
 * ✅ Sistema de navegação funcional
 * ✅ Integração com lógica de cálculo
 * ✅ Templates das 21 etapas REAIS
 */
const QuizFlowPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserNameInput] = useState('');

  const { 
    answers, 
    answerQuestion, 
    answerStrategicQuestion, 
    setUserNameFromInput, 
    initializeQuiz,
    completeQuiz,
    quizResult 
  } = useQuizLogic();

  // ✅ INICIALIZAR QUIZ COM PERGUNTAS REAIS
  useEffect(() => {
    initializeQuiz(caktoquizQuestions);
  }, [initializeQuiz]);

  // Função para navegar para próxima etapa
  const handleNextStep = () => {
    if (currentStep < 21) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Função para voltar etapa
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Salvar nome na etapa 1
  const handleNameSubmit = () => {
    if (userName.trim()) {
      setUserNameFromInput(userName.trim());
      handleNextStep();
    }
  };

  // Responder pergunta de pontuação (etapas 2-11)
  const handleAnswer = (questionId: string, optionId: string) => {
    answerQuestion(questionId, optionId);
    setTimeout(() => handleNextStep(), 500); // Delay para UX
  };

  // Responder pergunta estratégica (etapas 13-18)
  const handleStrategicAnswer = (questionId: string, optionId: string) => {
    answerStrategicQuestion(questionId, optionId, 'strategic', 'tracking');
    setTimeout(() => handleNextStep(), 500);
  };

  // ✅ BUSCAR PERGUNTA ATUAL PELOS DADOS REAIS
  const getCurrentQuestion = () => {
    return caktoquizQuestions.find(q => q.order === currentStep - 1);
  };

  // Renderizar etapa específica
  const renderStep = () => {
    const currentQuestion = getCurrentQuestion();

    // ✅ ETAPA 1: COLETA DE NOME
    if (currentStep === 1) {
      return (
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Quiz!</h1>
          <p className="text-lg mb-8">{currentQuestion?.text || 'Qual é o seu primeiro nome?'}</p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Digite seu nome"
              value={userName}
              onChange={e => setUserNameInput(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-4 text-center"
            />
            <Button onClick={handleNameSubmit} disabled={!userName.trim()} className="w-full">
              Começar Quiz
            </Button>
          </div>
        </div>
      );
    }

    // ✅ ETAPAS 2-11: QUESTÕES QUE PONTUAM
    if (currentStep >= 2 && currentStep <= 11 && currentQuestion) {
      const questionNumber = currentStep - 1;
      return (
        <div className="py-12">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Pergunta {questionNumber} de 10</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(questionNumber / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(currentQuestion.id, option.id)}
                className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ✅ ETAPA 12: TRANSIÇÃO
    if (currentStep === 12) {
      const transitionQuestion = getCurrentQuestion();
      return (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Primeira Fase Concluída!</h2>
          <p className="text-lg mb-8">{transitionQuestion?.text || 'Agora vamos entender melhor seus objetivos!'}</p>
          <Button onClick={handleNextStep}>Continuar</Button>
        </div>
      );
    }

    // ✅ ETAPAS 13-18: QUESTÕES ESTRATÉGICAS
    if (currentStep >= 13 && currentStep <= 18 && currentQuestion) {
      const strategicNumber = currentStep - 12;
      return (
        <div className="py-12">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">
              Pergunta Estratégica {strategicNumber} de 6
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleStrategicAnswer(currentQuestion.id, option.id)}
                className="p-4 border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ✅ ETAPA 19: CALCULANDO RESULTADOS
    if (currentStep === 19) {
      // Calcular resultados automaticamente
      useEffect(() => {
        const timer = setTimeout(() => {
          completeQuiz();
          handleNextStep();
        }, 2000);
        return () => clearTimeout(timer);
      }, []);

      return (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Calculando seus resultados...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-8"></div>
          <p className="text-gray-600">Analisando suas respostas...</p>
        </div>
      );
    }

    // ✅ ETAPA 20: RESULTADO PERSONALIZADO
    if (currentStep === 20) {
      return (
        <div className="py-8">
          <ConnectedQuizResultsBlock showSecondaryStyles={true} showOffer={true} />
          <div className="text-center mt-8">
            <Button onClick={handleNextStep}>Ver Oferta Especial</Button>
          </div>
        </div>
      );
    }

    // ✅ ETAPA 21: OFERTA ESPECIAL
    if (currentStep === 21) {
      return (
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-6">Oferta Especial!</h1>
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Baseado no seu resultado, temos algo perfeito para você!
            </h2>
            <p className="text-lg mb-6">Aproveite 50% de desconto no nosso curso personalizado</p>
            <div className="text-3xl font-bold mb-4">R$ 497 → R$ 247</div>
            <Button
              className="bg-white text-green-600 px-8 py-3 text-lg font-semibold hover:bg-gray-100"
              onClick={() => alert('Redirecionando para checkout...')}
            >
              Garantir Desconto Agora
            </Button>
          </div>
        </div>
      );
    }

    return <div>Etapa não encontrada</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header com navegação */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-600">Etapa {currentStep} de 21</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
              ← Voltar
            </Button>
            <Button variant="outline" onClick={() => setLocation('/')}>
              Sair
            </Button>
          </div>
        </div>

        {/* Progress Bar Geral */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 21) * 100}%` }}
          ></div>
        </div>

        {/* Conteúdo da etapa */}
        <div className="max-w-4xl mx-auto">{renderStep()}</div>

        {/* Footer com informações de debug */}
        <div className="text-center text-sm text-gray-500 mt-12">
          Respostas coletadas: {answers.length} | Etapa atual: {currentStep}
        </div>
      </div>
    </div>
  );
};

export default QuizFlowPage;
