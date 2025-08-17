// ===== SNIPPETS PRÁTICOS PARA SEU PROJETO QUIZ =====

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// ===== 1. COMPONENTE DE PERGUNTA (usando rafce) =====
const QuizQuestion = ({ question, options, onAnswer, currentIndex, totalQuestions }) => {
  // useState para resposta selecionada
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  // useCallback para otimizar performance
  const handleAnswerSelect = React.useCallback(answer => {
    setSelectedAnswer(answer);
  }, []);

  // useCallback para enviar resposta
  const handleSubmitAnswer = React.useCallback(() => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null);
    }
  }, [selectedAnswer, onAnswer]);

  // useMemo para calcular progresso
  const progress = React.useMemo(() => {
    return ((currentIndex + 1) / totalQuestions) * 100;
  }, [currentIndex, totalQuestions]);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Pergunta {currentIndex + 1} de {totalQuestions}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">{question.text}</h2>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>

      <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full">
        {currentIndex < totalQuestions - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
      </Button>
    </Card>
  );
};

// ===== 2. HOOK PERSONALIZADO PARA QUIZ (usando uch) =====
const useQuizLogic = questions => {
  // useState para índice atual
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  // useState para respostas
  const [answers, setAnswers] = React.useState([]);

  // useState para status do quiz
  const [quizStatus, setQuizStatus] = React.useState('active'); // 'active', 'completed', 'paused'

  // useCallback para próxima pergunta
  const nextQuestion = React.useCallback(() => {
    setCurrentQuestionIndex(prev => {
      const newIndex = prev + 1;
      if (newIndex >= questions.length) {
        setQuizStatus('completed');
        return prev;
      }
      return newIndex;
    });
  }, [questions.length]);

  // useCallback para pergunta anterior
  const previousQuestion = React.useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  }, []);

  // useCallback para salvar resposta
  const saveAnswer = React.useCallback(
    answer => {
      setAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = answer;
        return newAnswers;
      });

      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
      } else {
        setQuizStatus('completed');
      }
    },
    [currentQuestionIndex, questions.length, nextQuestion]
  );

  // useCallback para resetar quiz
  const resetQuiz = React.useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizStatus('active');
  }, []);

  // useMemo para pergunta atual
  const currentQuestion = React.useMemo(() => {
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);

  // useMemo para progresso
  const progress = React.useMemo(() => {
    return {
      current: currentQuestionIndex + 1,
      total: questions.length,
      percentage: ((currentQuestionIndex + 1) / questions.length) * 100,
    };
  }, [currentQuestionIndex, questions.length]);

  return {
    currentQuestion,
    currentQuestionIndex,
    answers,
    quizStatus,
    progress,
    nextQuestion,
    previousQuestion,
    saveAnswer,
    resetQuiz,
  };
};

// ===== 3. COMPONENTE DE RESULTADO (usando rafce) =====
const QuizResult = ({ answers, questions, onRestart }) => {
  // useMemo para calcular resultado
  const result = React.useMemo(() => {
    // Lógica para calcular resultado baseado nas respostas
    const score = answers.reduce((total, answer) => {
      return total + (answer.points || 0);
    }, 0);

    return {
      score,
      totalQuestions: questions.length,
      percentage: (score / questions.length) * 100,
    };
  }, [answers, questions]);

  // useEffect para analytics
  React.useEffect(() => {
    // Enviar resultado para analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quiz_completed', {
        score: result.score,
        percentage: result.percentage,
      });
    }
  }, [result]);

  return (
    <Card className="p-8 max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">Quiz Finalizado!</h2>

      <div className="mb-8">
        <div className="text-6xl font-bold text-blue-600 mb-2">
          {Math.round(result.percentage)}%
        </div>
        <p className="text-gray-600">
          Você acertou {result.score} de {result.totalQuestions} perguntas
        </p>
      </div>

      <div className="space-y-4">
        <Button onClick={onRestart} className="w-full">
          Refazer Quiz
        </Button>

        <Button variant="outline" className="w-full">
          Compartilhar Resultado
        </Button>
      </div>
    </Card>
  );
};

// ===== 4. COMPONENTE PRINCIPAL DO QUIZ (usando rafce) =====
const QuizApp = () => {
  // Dados mockados das perguntas
  const questions = React.useMemo(
    () => [
      {
        id: 1,
        text: 'Qual é seu estilo de roupa preferido?',
        options: [
          { text: 'Clássico e elegante', points: 1, category: 'elegante' },
          { text: 'Moderno e descolado', points: 2, category: 'moderno' },
          { text: 'Romântico e delicado', points: 3, category: 'romantico' },
        ],
      },
      {
        id: 2,
        text: 'Que tipo de cores você prefere?',
        options: [
          { text: 'Tons neutros', points: 1, category: 'elegante' },
          { text: 'Cores vibrantes', points: 2, category: 'moderno' },
          { text: 'Cores pastel', points: 3, category: 'romantico' },
        ],
      },
    ],
    []
  );

  // Usar hook personalizado
  const {
    currentQuestion,
    currentQuestionIndex,
    answers,
    quizStatus,
    progress,
    saveAnswer,
    resetQuiz,
  } = useQuizLogic(questions);

  // useCallback para lidar com resposta
  const handleAnswer = React.useCallback(
    answer => {
      saveAnswer(answer);
    },
    [saveAnswer]
  );

  // Renderização condicional baseada no status
  if (quizStatus === 'completed') {
    return <QuizResult answers={answers} questions={questions} onRestart={resetQuiz} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <QuizQuestion
          question={currentQuestion}
          options={currentQuestion?.options || []}
          onAnswer={handleAnswer}
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      </div>
    </div>
  );
};

// ===== 5. HOOK PARA PERSISTÊNCIA DE DADOS (usando uch) =====
const useLocalStorage = (key, initialValue) => {
  // useState com valor inicial do localStorage
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  // useCallback para salvar valor
  const setValue = React.useCallback(
    value => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

// ===== 6. COMPONENTE DE LOADING (usando rafce) =====
const LoadingSpinner = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

// ===== 7. HOOK PARA FETCH DE DADOS (usando uch) =====
const useFetch = url => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// ===== 8. COMPONENTE COM ERROR BOUNDARY (usando rcep) =====
class QuizErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Quiz Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="p-8 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Ops! Algo deu errado</h2>
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===== 9. COMPONENTE PRINCIPAL COM ERROR BOUNDARY =====
const App = () => {
  return (
    <QuizErrorBoundary>
      <QuizApp />
    </QuizErrorBoundary>
  );
};

export {
  QuizQuestion,
  QuizResult,
  QuizApp,
  LoadingSpinner,
  QuizErrorBoundary,
  useQuizLogic,
  useLocalStorage,
  useFetch,
  App,
};
