import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

// Componentes específicos para cada tipo de step
import { NameCollectionStep } from './steps/NameCollectionStep';
import { QuizQuestionStep } from './steps/QuizQuestionStep';
import { StrategicQuestionStep } from './steps/StrategicQuestionStep';
import { TransitionStep } from './steps/TransitionStep';
import { ResultStep } from './steps/ResultStep';

interface SmartStepRendererProps {
  stepNumber: number;
  onContinue?: () => void;
}

/**
 * 🎯 SMART STEP RENDERER - Solução Inteligente e Direta
 * 
 * ✅ Elimina todas as camadas intermediárias desnecessárias
 * ✅ Lógica condicional direta baseada no stepNumber
 * ✅ Performance superior (sem conversões custosas)
 * ✅ Fácil manutenibilidade (1 arquivo, lógica clara)
 * ✅ Type Safety nativo
 * 
 * FLUXO COMPLETO (21 STEPS):
 * Step 1: Coleta de nome
 * Steps 2-11: 10 questões principais (q1-q10) 
 * Step 12: Transição para questões estratégicas
 * Steps 13-18: 6 questões estratégicas
 * Step 19: Transição para resultado
 * Steps 20-21: Páginas de resultado/conversão
 */
export const SmartStepRenderer: React.FC<SmartStepRendererProps> = ({
  stepNumber,
  onContinue
}) => {
  const { quizState } = useEditor();

  // 🎯 STEP 1: COLETA DE NOME
  if (stepNumber === 1) {
    return (
      <NameCollectionStep 
        onContinue={onContinue}
        currentName={quizState.userName}
        onNameChange={quizState.setUserNameFromInput}
      />
    );
  }

  // 🎯 STEPS 2-11: QUESTÕES PRINCIPAIS (q1-q10)
  if (stepNumber >= 2 && stepNumber <= 11) {
    const questionIndex = stepNumber - 2; // Step 2 = q1 (index 0)
    const question = COMPLETE_QUIZ_QUESTIONS[questionIndex];
    
    if (!question) {
      return <div className="p-8 text-center">Questão {questionIndex + 1} não encontrada</div>;
    }
    
    return (
      <QuizQuestionStep
        question={question}
        stepNumber={stepNumber}
        questionNumber={questionIndex + 1}
        totalQuestions={10}
        onContinue={onContinue}
        currentAnswers={quizState.answers}
        onAnswerChange={(questionId: string, optionId: string, _points: number) => {
          quizState.answerQuestion(questionId, optionId);
        }}
      />
    );
  }

  // 🎯 STEP 12: TRANSIÇÃO PARA QUESTÕES ESTRATÉGICAS
  if (stepNumber === 12) {
    return (
      <TransitionStep
        type="strategic"
        title="Enquanto calculamos o seu resultado..."
        subtitle="Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa."
        description="A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade."
        buttonText="Vamos lá!"
        onContinue={onContinue}
        stepNumber={stepNumber}
      />
    );
  }

  // 🎯 STEPS 13-18: QUESTÕES ESTRATÉGICAS
  if (stepNumber >= 13 && stepNumber <= 18) {
    const strategicIndex = stepNumber - 13; // Step 13 = strategic1 (index 0)
    const strategicQuestions = COMPLETE_QUIZ_QUESTIONS.filter(q => q.type === 'strategic-question');
    const question = strategicQuestions[strategicIndex];
    
    if (!question) {
      return <div className="p-8 text-center">Questão estratégica {strategicIndex + 1} não encontrada</div>;
    }
    
    return (
      <StrategicQuestionStep
        question={question}
        stepNumber={stepNumber}
        questionNumber={strategicIndex + 1}
        totalStrategicQuestions={6}
        onContinue={onContinue}
        currentAnswers={quizState.strategicAnswers}
        onAnswerChange={(questionId: string, optionId: string, category?: string) => {
          quizState.answerStrategicQuestion(questionId, optionId, category || 'Strategic', 'general');
        }}
      />
    );
  }

  // 🎯 STEP 19: TRANSIÇÃO PARA RESULTADO
  if (stepNumber === 19) {
    return (
      <TransitionStep
        type="result"
        title="Obrigada por compartilhar..."
        subtitle="Chegar até aqui já mostra que você está pronta para se olhar com mais amor."
        description="Agora, é hora de revelar o seu Estilo Predominante — e os seus Estilos Complementares. E, mais do que isso, uma oportunidade real de aplicar o seu Estilo com leveza e confiança — todos os dias."
        buttonText="Vamos ao resultado?"
        onContinue={onContinue}
        stepNumber={stepNumber}
      />
    );
  }

  // 🎯 STEPS 20-21: RESULTADOS E CONVERSÃO
  if (stepNumber >= 20 && stepNumber <= 21) {
    const testType = stepNumber === 20 ? 'A' : 'B';
    return (
      <ResultStep
        testType={testType}
        stepNumber={stepNumber}
        onContinue={onContinue}
        quizAnswers={quizState.answers}
        strategicAnswers={quizState.strategicAnswers}
        userName={quizState.userName}
      />
    );
  }

  // 🚫 FALLBACK PARA STEPS NÃO IMPLEMENTADOS
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">🚧</div>
        <h2 className="text-2xl font-bold text-[#432818]">Step {stepNumber}</h2>
        <p className="text-gray-600">
          Este step ainda não foi implementado.
        </p>
        {onContinue && (
          <button
            onClick={onContinue}
            className="mt-6 px-6 py-3 bg-[#B89B7A] text-white rounded-lg hover:bg-[#432818] transition-colors"
          >
            Continuar mesmo assim →
          </button>
        )}
        
        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-white/80 rounded-lg text-sm text-left">
            <strong>Debug Info:</strong>
            <div>Step: {stepNumber}</div>
            <div>User: {quizState.userName || 'não definido'}</div>
            <div>Respostas: {quizState.answers.length}</div>
            <div>Estratégicas: {quizState.strategicAnswers.length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartStepRenderer;