'use client';

import { useState } from 'react';
import { useLocation } from 'wouter';

type QuestionOption = {
  id: string;
  text: string;
  value: number;
};

type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
};

// Dados simulados para o quiz
const quizQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Qual é o seu principal objetivo?',
    options: [
      { id: 'q1_a', text: 'Aumentar vendas', value: 10 },
      { id: 'q1_b', text: 'Melhorar engajamento', value: 5 },
      { id: 'q1_c', text: 'Construir autoridade', value: 8 },
    ],
  },
  {
    id: 'q2',
    text: 'Qual é o seu maior desafio atualmente?',
    options: [
      { id: 'q2_a', text: 'Atrair clientes', value: 8 },
      { id: 'q2_b', text: 'Converter leads', value: 10 },
      { id: 'q2_c', text: 'Fidelizar clientes', value: 5 },
    ],
  },
  {
    id: 'q3',
    text: 'Quanto tempo você dedica ao seu negócio por semana?',
    options: [
      { id: 'q3_a', text: 'Menos de 20 horas', value: 3 },
      { id: 'q3_b', text: '20 a 40 horas', value: 7 },
      { id: 'q3_c', text: 'Mais de 40 horas', value: 10 },
    ],
  },
];

export default function QuizFlow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionOption>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleOptionClick = (option: QuestionOption) => {
    // Salva a resposta selecionada
    setAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestion].id]: option,
    }));

    // Avança para a próxima pergunta ou finaliza o quiz
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Finaliza o quiz e calcula o resultado
      setIsLoading(true);
      setTimeout(() => {
        // Simula o processamento do resultado
        const resultId = calculateResultId(answers);
        setLocation(`/resultado/${resultId}`);
      }, 1000);
    }
  };

  // Função simples para calcular um ID de resultado com base nas respostas
  const calculateResultId = (userAnswers: Record<string, QuestionOption>) => {
    const totalScore = Object.values(userAnswers).reduce((sum, option) => sum + option.value, 0);
    // Gerar um ID de resultado baseado no score total
    return `result_${totalScore}`;
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div
      className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4"
      data-lovable-component="quiz-flow"
      data-lovable-editable="true"
    >
      <h1
        className="mb-8 text-3xl font-bold text-brand-primary"
        data-lovable-component="quiz-title"
        data-lovable-editable="true"
      >
        Quiz de Negócios
      </h1>

      <div
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
        data-lovable-component="quiz-container"
      >
        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-8"
            data-lovable-component="quiz-loading"
            data-lovable-editable="true"
          >
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium">Calculando seu resultado...</p>
          </div>
        ) : (
          <>
            <div
              className="mb-4 flex w-full justify-between text-sm text-muted-foreground"
              data-lovable-component="quiz-progress-text"
              data-lovable-editable="true"
            >
              <span>
                Pergunta {currentQuestion + 1} de {quizQuestions.length}
              </span>
              <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
            </div>

            <div
              className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted"
              data-lovable-component="quiz-progress-bar"
            >
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{
                  width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
                }}
              ></div>
            </div>

            <h2 className="mb-6 text-xl font-medium" data-lovable-component="quiz-question">
              {question.text}
            </h2>

            <div className="space-y-3" data-lovable-component="quiz-options">
              {question.options.map(option => (
                <button
                  key={option.id}
                  className="w-full rounded-lg border bg-card p-4 text-left hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => handleOptionClick(option)}
                  data-lovable-component="quiz-option"
                  data-lovable-editable="true"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
