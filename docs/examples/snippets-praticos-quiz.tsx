// ===== SNIPPETS PRÁTICOS PARA SEU PROJETO DE QUIZ =====
// Como usar os snippets ES7 React/Redux/React-Native/JS no seu projeto
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trackButtonClick } from '@/utils/analytics';

// ===== 1. COMPONENTE DE PERGUNTA DO QUIZ =====
// Digite "rafce" + Tab para criar este componente:

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}) => {
  // Digite "useState" + Tab:
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Digite "useCallback" + Tab:
  const handleAnswerClick = React.useCallback(
    (answer: string) => {
      if (isAnimating) return;

      setIsAnimating(true);

      // Digite "clg" + Tab para debug:
      console.log(`Resposta selecionada: ${answer}`);

      // Tracking com analytics
      trackButtonClick('quiz_answer_selected', `Pergunta ${questionNumber}`, 'quiz_page');

      setTimeout(() => {
        onAnswerSelect(answer);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating, onAnswerSelect, questionNumber]
  );

  // Digite "useMemo" + Tab:
  const progressPercentage = React.useMemo(() => {
    return (questionNumber / totalQuestions) * 100;
  }, [questionNumber, totalQuestions]);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Pergunta {questionNumber} de {totalQuestions}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <h2 className="text-xl font-bold mb-6 text-center">{question}</h2>

      {/* Opções */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === option ? 'default' : 'outline'}
            className={`w-full p-4 text-left justify-start transition-all duration-200 ${
              isAnimating ? 'pointer-events-none opacity-50' : ''
            }`}
            onClick={() => handleAnswerClick(option)}
            disabled={isAnimating}
          >
            <span className="mr-3 font-bold">{String.fromCharCode(65 + index)})</span>
            {option}
          </Button>
        ))}
      </div>
    </Card>
  );
};

// ===== 2. HOOK CUSTOMIZADO PARA GERENCIAR ESTADO DO QUIZ =====
// Digite "uch" + Tab para criar custom hook:

interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  isCompleted: boolean;
  startTime: number;
  score: number;
}

const useQuizState = (totalQuestions: number) => {
  // Digite "useState" + Tab:
  const [state, setState] = React.useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    isCompleted: false,
    startTime: Date.now(),
    score: 0,
  });

  // Digite "useCallback" + Tab:
  const selectAnswer = React.useCallback((answer: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: answer,
      },
    }));
  }, []);

  const nextQuestion = React.useCallback(() => {
    setState(prev => {
      const nextQuestionIndex = prev.currentQuestion + 1;
      const isCompleted = nextQuestionIndex >= totalQuestions;

      return {
        ...prev,
        currentQuestion: nextQuestionIndex,
        isCompleted,
      };
    });
  }, [totalQuestions]);

  const previousQuestion = React.useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  }, []);

  const resetQuiz = React.useCallback(() => {
    setState({
      currentQuestion: 0,
      answers: {},
      isCompleted: false,
      startTime: Date.now(),
      score: 0,
    });
  }, []);

  // Digite "useMemo" + Tab:
  const progress = React.useMemo(() => {
    return (state.currentQuestion / totalQuestions) * 100;
  }, [state.currentQuestion, totalQuestions]);

  const timeSpent = React.useMemo(() => {
    return Math.floor((Date.now() - state.startTime) / 1000);
  }, [state.startTime]);

  return {
    ...state,
    progress,
    timeSpent,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
  };
};

// ===== 3. COMPONENTE DE TIMER DO QUIZ =====
// Digite "rafce" + Tab:

interface QuizTimerProps {
  duration: number; // em segundos
  onTimeUp: () => void;
  isActive: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ duration, onTimeUp, isActive }) => {
  // Digite "useState" + Tab:
  const [timeLeft, setTimeLeft] = React.useState(duration);

  // Digite "useEffect" + Tab:
  React.useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  // Digite "useMemo" + Tab:
  const formattedTime = React.useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const progressPercentage = React.useMemo(() => {
    return (timeLeft / duration) * 100;
  }, [timeLeft, duration]);

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
      <div className="text-2xl font-mono font-bold text-gray-800">{formattedTime}</div>
      <div className="flex-1">
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft < 30 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ===== 4. COMPONENTE DE RESULTADO DO QUIZ =====
// Digite "rafce" + Tab:

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: Record<number, string>;
  onRestart: () => void;
  onShareResult: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({
  score,
  totalQuestions,
  timeSpent,
  answers,
  onRestart,
  onShareResult,
}) => {
  // Digite "useState" + Tab:
  const [isSharing, setIsSharing] = React.useState(false);

  // Digite "useMemo" + Tab:
  const percentage = React.useMemo(() => {
    return Math.round((score / totalQuestions) * 100);
  }, [score, totalQuestions]);

  const formattedTime = React.useMemo(() => {
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    return `${minutes}min ${seconds}s`;
  }, [timeSpent]);

  const resultMessage = React.useMemo(() => {
    if (percentage >= 90) return 'Excelente! Você é um expert!';
    if (percentage >= 70) return 'Muito bom! Você está no caminho certo!';
    if (percentage >= 50) return 'Bom trabalho! Continue praticando!';
    return 'Não desanime! Tente novamente!';
  }, [percentage]);

  // Digite "useCallback" + Tab:
  const handleShare = React.useCallback(async () => {
    setIsSharing(true);

    try {
      // Digite "clg" + Tab:
      console.log('Compartilhando resultado...');

      await onShareResult();

      // Tracking
      trackButtonClick('quiz_result_shared', `Score: ${percentage}%`, 'quiz_result');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    } finally {
      setIsSharing(false);
    }
  }, [onShareResult, percentage]);

  const handleRestart = React.useCallback(() => {
    // Digite "clg" + Tab:
    console.log('Reiniciando quiz...');

    trackButtonClick('quiz_restart', 'Quiz Reiniciado', 'quiz_result');
    onRestart();
  }, [onRestart]);

  return (
    <Card className="p-8 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
        <h2 className="text-2xl font-bold mb-2">{resultMessage}</h2>
        <p className="text-gray-600">
          Você acertou {score} de {totalQuestions} perguntas em {formattedTime}
        </p>
      </div>

      {/* Gráfico de progresso circular */}
      <div className="mb-8">
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-4 justify-center">
        <Button onClick={handleRestart} variant="outline" size="lg">
          Tentar Novamente
        </Button>
        <Button onClick={handleShare} disabled={isSharing} size="lg">
          {isSharing ? 'Compartilhando...' : 'Compartilhar Resultado'}
        </Button>
      </div>
    </Card>
  );
};

// ===== 5. HOOK PARA ARMAZENAR PROGRESSO NO LOCALSTORAGE =====
// Digite "uch" + Tab:

interface QuizProgress {
  currentQuestion: number;
  answers: Record<number, string>;
  startTime: number;
  quizId: string;
}

const useQuizProgress = (quizId: string) => {
  const storageKey = `quiz_progress_${quizId}`;

  // Digite "useState" + Tab:
  const [progress, setProgress] = React.useState<QuizProgress | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Digite "useCallback" + Tab:
  const saveProgress = React.useCallback(
    (progressData: QuizProgress) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(progressData));
        setProgress(progressData);
      } catch (error) {
        console.error('Erro ao salvar progresso:', error);
      }
    },
    [storageKey]
  );

  const clearProgress = React.useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setProgress(null);
    } catch (error) {
      console.error('Erro ao limpar progresso:', error);
    }
  }, [storageKey]);

  const hasProgress = React.useMemo(() => {
    return progress !== null;
  }, [progress]);

  return {
    progress,
    saveProgress,
    clearProgress,
    hasProgress,
  };
};

// ===== 6. COMPONENTE PRINCIPAL DO QUIZ =====
// Digite "rafce" + Tab:

interface QuizData {
  id: string;
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  timeLimit?: number;
}

interface QuizAppProps {
  quizData: QuizData;
  onComplete: (result: { score: number; answers: Record<number, string> }) => void;
}

const QuizApp: React.FC<QuizAppProps> = ({ quizData, onComplete }) => {
  // Digite "useState" + Tab:
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [startTime] = React.useState(Date.now());

  // Usando hooks customizados
  const { progress, saveProgress, clearProgress, hasProgress } = useQuizProgress(quizData.id);

  // Digite "useEffect" + Tab - Restaurar progresso salvo:
  React.useEffect(() => {
    if (hasProgress && progress) {
      setCurrentQuestion(progress.currentQuestion);
      setAnswers(progress.answers);
    }
  }, [hasProgress, progress]);

  // Digite "useCallback" + Tab:
  const handleAnswerSelect = React.useCallback(
    (answer: string) => {
      const newAnswers = { ...answers, [currentQuestion]: answer };
      setAnswers(newAnswers);

      // Salvar progresso
      saveProgress({
        currentQuestion,
        answers: newAnswers,
        startTime,
        quizId: quizData.id,
      });
    },
    [answers, currentQuestion, saveProgress, startTime, quizData.id]
  );

  const handleNext = React.useCallback(() => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completo
      setIsCompleted(true);

      // Calcular score
      const score = quizData.questions.reduce((acc, question, index) => {
        return acc + (answers[index] === question.correctAnswer ? 1 : 0);
      }, 0);

      // Limpar progresso salvo
      clearProgress();

      // Callback de conclusão
      onComplete({ score, answers });
    }
  }, [currentQuestion, quizData.questions, answers, clearProgress, onComplete]);

  const handlePrevious = React.useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const handleRestart = React.useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    clearProgress();
  }, [clearProgress]);

  // Digite "useMemo" + Tab:
  const currentQuestionData = React.useMemo(() => {
    return quizData.questions[currentQuestion];
  }, [quizData.questions, currentQuestion]);

  const canProceed = React.useMemo(() => {
    return answers[currentQuestion] !== undefined;
  }, [answers, currentQuestion]);

  if (isCompleted) {
    const score = quizData.questions.reduce((acc, question, index) => {
      return acc + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <QuizResult
        score={score}
        totalQuestions={quizData.questions.length}
        timeSpent={Math.floor((Date.now() - startTime) / 1000)}
        answers={answers}
        onRestart={handleRestart}
        onShareResult={async () => {
          // Implementar compartilhamento
          console.log('Compartilhando resultado...');
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">{quizData.title}</h1>

        {/* Timer se houver limite de tempo */}
        {quizData.timeLimit && (
          <QuizTimer
            duration={quizData.timeLimit}
            isActive={!isCompleted}
            onTimeUp={() => setIsCompleted(true)}
          />
        )}
      </div>

      <QuizQuestion
        question={currentQuestionData.question}
        options={currentQuestionData.options}
        selectedAnswer={answers[currentQuestion] || null}
        onAnswerSelect={handleAnswerSelect}
        questionNumber={currentQuestion + 1}
        totalQuestions={quizData.questions.length}
      />

      {/* Navegação */}
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
          Anterior
        </Button>

        <Button onClick={handleNext} disabled={!canProceed}>
          {currentQuestion === quizData.questions.length - 1 ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>
    </div>
  );
};

export { QuizQuestion, QuizTimer, QuizResult, QuizApp, useQuizState, useQuizProgress };
