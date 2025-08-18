/**
 * SNIPPETS ESPECÍFICOS PARA O PROJETO QUIZ
 *
 * Este arquivo mostra como usar os snippets ES7 React especificamente
 * para acelerar o desenvolvimento do seu projeto de quiz de estilo
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ===== SNIPPETS PARA COMPONENTES DE QUIZ =====

// 1. PERGUNTA DO QUIZ - Digite: rafce + Tab
interface QuizQuestionProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
}

export const QuizQuestionComponent = ({
  question,
  options,
  onAnswer,
  selectedAnswer,
}: QuizQuestionProps) => {
  // Digite: useState + Tab
  const [isAnswered, setIsAnswered] = useState(false);

  // Digite: useCallback + Tab
  const handleOptionClick = useCallback(
    (option: string) => {
      if (!isAnswered) {
        setIsAnswered(true);
        onAnswer(option);
      }
    },
    [isAnswered, onAnswer]
  );

  return (
    <div className="quiz-question">
      <h3>{question}</h3>
      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`option ${selectedAnswer === option ? 'selected' : ''}`}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// 2. PROGRESS BAR - Digite: rafce + Tab
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  // Digite: useMemo + Tab
  const percentage = useMemo(() => {
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  return (
    <div className="progress-bar">
      <div className="progress-info">
        <span>
          Pergunta {currentStep} de {totalSteps}
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

// 3. QUIZ TIMER - Digite: rafce + Tab
interface QuizTimerProps {
  duration: number; // em segundos
  onTimeUp: () => void;
}

export const QuizTimer = ({ duration, onTimeUp }: QuizTimerProps) => {
  // Digite: useState + Tab
  const [timeLeft, setTimeLeft] = useState(duration);

  // Digite: useEffect + Tab
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Digite: useMemo + Tab
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  return (
    <div className="quiz-timer">
      <span className="timer-label">Tempo restante:</span>
      <span className={`timer-value ${timeLeft <= 30 ? 'warning' : ''}`}>{formattedTime}</span>
    </div>
  );
};

// ===== HOOKS CUSTOMIZADOS PARA QUIZ =====

// 4. Hook para gerenciar estado do quiz
interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  score: number;
  isComplete: boolean;
}

const useQuiz = (totalQuestions: number) => {
  // Digite: useState + Tab
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    score: 0,
    isComplete: false,
  });

  // Digite: useCallback + Tab
  const answerQuestion = useCallback((answer: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: answer,
      },
    }));
  }, []);

  // Digite: useCallback + Tab
  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextQuestionIndex = prev.currentQuestion + 1;
      return {
        ...prev,
        currentQuestion: nextQuestionIndex,
        isComplete: nextQuestionIndex >= totalQuestions,
      };
    });
  }, [totalQuestions]);

  // Digite: useCallback + Tab
  const resetQuiz = useCallback(() => {
    setState({
      currentQuestion: 0,
      answers: {},
      score: 0,
      isComplete: false,
    });
  }, []);

  return {
    ...state,
    answerQuestion,
    nextQuestion,
    resetQuiz,
  };
};

// 5. Hook para salvar progresso no localStorage
const useQuizProgress = (quizId: string) => {
  // Digite: useState + Tab
  const [progress, setProgress] = useState<QuizState | null>(null);

  // Digite: useEffect + Tab
  useEffect(() => {
    const savedProgress = localStorage.getItem(`quiz-${quizId}`);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      }
    }
  }, [quizId]);

  // Digite: useCallback + Tab
  const saveProgress = useCallback(
    (state: QuizState) => {
      setProgress(state);
      localStorage.setItem(`quiz-${quizId}`, JSON.stringify(state));
    },
    [quizId]
  );

  // Digite: useCallback + Tab
  const clearProgress = useCallback(() => {
    setProgress(null);
    localStorage.removeItem(`quiz-${quizId}`);
  }, [quizId]);

  return {
    progress,
    saveProgress,
    clearProgress,
  };
};

// ===== COMPONENTE PRINCIPAL DO QUIZ =====

// 6. QUIZ COMPLETO - Digite: rafce + Tab
interface Question {
  id: number;
  text: string;
  options: string[];
  category: string;
}

interface QuizProps {
  questions: Question[];
  onComplete: (answers: Record<number, string>) => void;
}

export const Quiz = ({ questions, onComplete }: QuizProps) => {
  // Usando hooks customizados
  const { currentQuestion, answers, isComplete, answerQuestion, nextQuestion, resetQuiz } = useQuiz(
    questions.length
  );

  const { saveProgress, clearProgress } = useQuizProgress('style-quiz');

  // Digite: useEffect + Tab
  useEffect(() => {
    if (isComplete) {
      onComplete(answers);
      clearProgress();
    } else {
      saveProgress({ currentQuestion, answers, score: 0, isComplete });
    }
  }, [isComplete, answers, currentQuestion, onComplete, saveProgress, clearProgress]);

  // Digite: useCallback + Tab
  const handleAnswer = useCallback(
    (answer: string) => {
      answerQuestion(answer);

      // Delay para mostrar resposta selecionada
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    },
    [answerQuestion, nextQuestion]
  );

  // Digite: useCallback + Tab
  const handleRestart = useCallback(() => {
    resetQuiz();
    clearProgress();
  }, [resetQuiz, clearProgress]);

  if (isComplete) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Completado!</h2>
        <p>Obrigado por participar do nosso quiz de estilo!</p>
        <button onClick={handleRestart}>Refazer Quiz</button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <ProgressBar currentStep={currentQuestion + 1} totalSteps={questions.length} />

      <QuizTimer
        duration={300} // 5 minutos
        onTimeUp={handleRestart}
      />

      <QuizQuestionComponent
        question={currentQ.text}
        options={currentQ.options}
        onAnswer={handleAnswer}
        selectedAnswer={answers[currentQuestion]}
      />
    </div>
  );
};

// ===== SNIPPETS PARA RESULTADO DO QUIZ =====

// 7. RESULTADO DO QUIZ - Digite: rafce + Tab
interface QuizResult {
  dominantStyle: string;
  percentage: number;
  description: string;
  recommendations: string[];
}

interface QuizResultProps {
  result: QuizResult;
  onRetake: () => void;
}

export const QuizResultComponent = ({ result, onRetake }: QuizResultProps) => {
  // Digite: useState + Tab
  const [showDetails, setShowDetails] = useState(false);

  // Digite: useCallback + Tab
  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  // Digite: useEffect + Tab
  useEffect(() => {
    // Scroll para o topo quando o resultado é mostrado
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="quiz-result">
      <div className="result-header">
        <h2>Seu Estilo Predominante é:</h2>
        <h1 className="dominant-style">{result.dominantStyle}</h1>
        <div className="percentage">{result.percentage}%</div>
      </div>

      <div className="result-description">
        <p>{result.description}</p>
      </div>

      <div className="recommendations">
        <h3>Recomendações para você:</h3>
        <ul>
          {result.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="result-actions">
        <button onClick={toggleDetails} className="btn-secondary">
          {showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes'}
        </button>
        <button onClick={onRetake} className="btn-primary">
          Refazer Quiz
        </button>
      </div>

      {showDetails && (
        <div className="result-details">
          <h3>Análise Detalhada</h3>
          <p>Aqui você pode adicionar mais informações sobre o estilo...</p>
        </div>
      )}
    </div>
  );
};

// ===== SNIPPETS PARA ANALYTICS =====

// 8. Hook para tracking de eventos
const useAnalytics = () => {
  // Digite: useCallback + Tab
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // Digite: clg + Tab
    console.log('Tracking event:', eventName, properties);

    // Aqui você pode integrar com Google Analytics, Hotjar, etc.
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }, []);

  // Digite: useCallback + Tab
  const trackQuizStart = useCallback(() => {
    trackEvent('quiz_started', {
      timestamp: Date.now(),
      page: window.location.pathname,
    });
  }, [trackEvent]);

  // Digite: useCallback + Tab
  const trackQuizComplete = useCallback(
    (answers: Record<number, string>) => {
      trackEvent('quiz_completed', {
        answers,
        timestamp: Date.now(),
        total_questions: Object.keys(answers).length,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackQuizStart,
    trackQuizComplete,
  };
};

// ===== EXEMPLO DE USO DOS SNIPPETS =====

// 9. APLICAÇÃO COMPLETA - Digite: rafce + Tab
const QuizApplication = () => {
  // Digite: useState + Tab
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Hook customizado para analytics
  const { trackQuizStart, trackQuizComplete } = useAnalytics();

  // Digite: useCallback + Tab
  const handleStartQuiz = useCallback(() => {
    setQuizStarted(true);
    trackQuizStart();
  }, [trackQuizStart]);

  // Digite: useCallback + Tab
  const handleQuizComplete = useCallback(
    (answers: Record<number, string>) => {
      trackQuizComplete(answers);

      // Simular cálculo do resultado
      const result: QuizResult = {
        dominantStyle: 'Elegante',
        percentage: 85,
        description: 'Você tem um estilo elegante e sofisticado...',
        recommendations: ['Invista em peças clássicas', 'Prefira cores neutras'],
      };

      setQuizResult(result);
    },
    [trackQuizComplete]
  );

  // Digite: useCallback + Tab
  const handleRetake = useCallback(() => {
    setQuizStarted(false);
    setQuizResult(null);
  }, []);

  // Dados de exemplo das perguntas
  const questions: Question[] = [
    {
      id: 1,
      text: 'Qual dessas peças você usaria para um evento importante?',
      options: ['Vestido clássico', 'Conjunto casual', 'Look romântico', 'Peça moderna'],
      category: 'formal',
    },
    // ... mais perguntas
  ];

  if (quizResult) {
    return <QuizResultComponent result={quizResult} onRetake={handleRetake} />;
  }

  if (quizStarted) {
    return <Quiz questions={questions} onComplete={handleQuizComplete} />;
  }

  return (
    <div className="quiz-intro">
      <h1>Descubra Seu Estilo Pessoal</h1>
      <p>Responda algumas perguntas e descubra qual é seu estilo predominante!</p>
      <button onClick={handleStartQuiz} className="btn-primary">
        Começar Quiz
      </button>
    </div>
  );
};

export default QuizApplication;

// ===== CHEAT SHEET DOS SNIPPETS MAIS USADOS =====

/*
🚀 SNIPPETS ESSENCIAIS PARA DESENVOLVIMENTO RÁPIDO:

COMPONENTES:
rafce + Tab → React Arrow Function Component Export
rafc + Tab → React Arrow Function Component  
rfc + Tab → React Function Component

HOOKS:
useState + Tab → const [state, setState] = useState()
useEffect + Tab → useEffect(() => {}, [])
useCallback + Tab → useCallback(() => {}, [])
useMemo + Tab → useMemo(() => {}, [])

IMPORTS:
imp + Tab → import moduleName from 'module'
imd + Tab → import { destructured } from 'module'

DEBUGGING:
clg + Tab → console.log()
clo + Tab → console.log('object', object)

FUNÇÕES:
anfn + Tab → const functionName = () => {}

DICAS:
- Sempre use Tab para navegar entre placeholders
- Ctrl+Space para ver snippets disponíveis
- Personalize seus próprios snippets em: Preferences > User Snippets
*/
