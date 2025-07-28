
import React, { useState, useEffect } from 'react';
import QuizIntro from './QuizIntro';
import { QuizContent } from './QuizContent';
import { MainTransition } from './MainTransition';
import { LoadingManager } from './LoadingManager';
import { ResultPage } from './ResultPage';
import { QuizDescubraSeuEstilo } from './QuizDescubraSeuEstilo';
import { StyleResult, UserResponse } from '@/types/quiz';
import { ALL_STYLES, styleResults } from '@/data/styleData';
import { strategicQuestions } from '@/data/strategicQuestions';

type StyleType = keyof typeof ALL_STYLES;

export const QuizPage: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showingIntro, setShowingIntro] = useState<boolean>(true);
  const [showingTransition, setShowingTransition] = useState<boolean>(false);
  const [showingFinalTransition, setShowingFinalTransition] = useState<boolean>(false);
  const [showingResult, setShowingResult] = useState<boolean>(false);
  const [showingStrategicQuestions, setShowingStrategicQuestions] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentStrategicQuestionIndex, setCurrentStrategicQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string[] }>({});
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleAnswerSubmit = (response: UserResponse) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = {
        ...prevAnswers,
        [response.questionId]: response.answerIds
      };
      return updatedAnswers;
    });

    if (!showingStrategicQuestions) {
      if (currentQuestionIndex < 8) {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 500);
      } else {
        setShowingTransition(true);
        setTimeout(() => {
          setShowingTransition(false);
          setShowingStrategicQuestions(true);
        }, 3000);
      }
    } else {
      if (currentStrategicQuestionIndex < strategicQuestions.length - 1) {
        setTimeout(() => {
          setCurrentStrategicQuestionIndex(currentStrategicQuestionIndex + 1);
        }, 500);
      } else {
        setShowingStrategicQuestions(false);
        setShowingFinalTransition(true);
        calculateAndShowResult();
      }
    }
  };

  const calculateAndShowResult = async () => {
    const styleScores: Record<StyleResult, number> = {
      elegante: 0,
      romantico: 0,
      criativo: 0,
      dramatico: 0,
      natural: 0,
      sexy: 0,
      classico: 0,
      moderno: 0
    };

    Object.keys(answers).forEach(questionId => {
      const questionAnswers = answers[questionId];
      questionAnswers.forEach(answerId => {
        const styleKey = answerId as StyleResult;
        if (styleScores[styleKey] !== undefined) {
          styleScores[styleKey] += 1;
        }
      });
    });

    let calculatedPrimaryStyle: StyleResult | null = null;
    let maxScore = 0;

    (Object.keys(styleScores) as StyleResult[]).forEach(style => {
      if (styleScores[style] > maxScore) {
        maxScore = styleScores[style];
        calculatedPrimaryStyle = style;
      }
    });

    const calculatedSecondaryStyles: StyleResult[] = (Object.keys(styleScores) as StyleResult[])
      .filter(style => styleScores[style] > 0 && style !== calculatedPrimaryStyle)
      .sort((a, b) => styleScores[b] - styleScores[a])
      .slice(0, 2);

    setPrimaryStyle(calculatedPrimaryStyle);
    setSecondaryStyles(calculatedSecondaryStyles);

    localStorage.setItem('quizResult', JSON.stringify({
      primaryStyle: calculatedPrimaryStyle,
      secondaryStyles: calculatedSecondaryStyles
    }));

    setTimeout(() => {
      setShowingFinalTransition(false);
      setShowingResult(true);
    }, 3000);
  };

  const getStyleInfo = (style: StyleResult) => {
    const styleData = styleResults[style];
    if (!styleData) return null;
    
    return {
      image: styleData.image,
      description: styleData.description,
      recommendations: styleData.recommendations,
      additionalStyles: styleData.additionalStyles
    };
  };

  const handleStartOver = () => {
    setShowingResult(false);
    setShowingIntro(true);
    setCurrentQuestionIndex(0);
    setCurrentStrategicQuestionIndex(0);
    setAnswers({});
    setPrimaryStyle(null);
    setSecondaryStyles([]);
    localStorage.removeItem('quizResult');
  };

  const handleStartQuiz = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
    setShowingIntro(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {showingIntro && (
        <QuizIntro
          onStart={handleStartQuiz}
          title="Descubra Seu Estilo Pessoal"
          description="Um quiz personalizado para descobrir seu estilo único"
        />
      )}

      {!showingIntro && !showingTransition && !showingStrategicQuestions && !showingFinalTransition && !showingResult && (
        <QuizContent
          user={{ userName }}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={8}
          showingStrategicQuestions={false}
          currentStrategicQuestionIndex={currentStrategicQuestionIndex}
          currentQuestion={null}
          currentAnswers={answers[currentQuestionIndex] || []}
          handleAnswerSubmit={handleAnswerSubmit}
        />
      )}

      {showingTransition && (
        <MainTransition onContinue={() => setShowingStrategicQuestions(true)} />
      )}

      {showingStrategicQuestions && (
        <QuizContent
          user={{ userName }}
          currentQuestionIndex={8}
          totalQuestions={8}
          showingStrategicQuestions={true}
          currentStrategicQuestionIndex={currentStrategicQuestionIndex}
          currentQuestion={null}
          currentAnswers={answers[currentStrategicQuestionIndex] || []}
          handleAnswerSubmit={handleAnswerSubmit}
        />
      )}

      {showingFinalTransition && (
        <LoadingManager onComplete={() => setShowingResult(true)} />
      )}

      {showingResult && primaryStyle && (
        <ResultPage
          primaryStyle={primaryStyle}
          secondaryStyles={secondaryStyles}
          onReset={handleStartOver}
        />
      )}

      {!showingResult && localStorage.getItem('quizResult') && (
        <QuizDescubraSeuEstilo
          userStyle={primaryStyle || 'estilo não definido'}
          userName={userName}
        />
      )}
    </div>
  );
};
