import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizMetadata } from '@/hooks/useQuizCRUD';
import { QuizQuestion } from '@/types/quiz';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, RotateCcw, Target, X } from 'lucide-react';
import React, { useState } from 'react';

interface QuizPreviewProps {
  metadata: QuizMetadata;
  questions: QuizQuestion[];
  onClose: () => void;
  stepNumber?: number;
}

interface UserAnswer {
  questionId: string;
  selectedOptions: string[];
  timeSpent: number;
}

/**
 * 🎯 COMPONENTE DE PREVIEW FUNCIONAL DO QUIZ
 *
 * Preview completo e interativo do quiz:
 * - Navegação entre questões
 * - Seleção de respostas
 * - Barra de progresso
 * - Cronômetro
 * - Resultado simulado
 * - Integração com etapas
 */
export const QuizPreview: React.FC<QuizPreviewProps> = ({
  metadata,
  questions,
  onClose,
  stepNumber,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

  // ===== MANIPULAR SELEÇÃO DE OPÇÕES =====
  const handleOptionSelect = (optionId: string) => {
    const existingAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);
    const timeSpent = Date.now() - questionStartTime;

    if (existingAnswer) {
      // Atualizar resposta existente
      const newAnswers = userAnswers.map(answer => {
        if (answer.questionId === currentQuestion.id) {
          const selectedOptions =
            currentQuestion.multiSelect > 1
              ? answer.selectedOptions.includes(optionId)
                ? answer.selectedOptions.filter(id => id !== optionId)
                : [...answer.selectedOptions, optionId].slice(0, currentQuestion.multiSelect)
              : [optionId];

          return { ...answer, selectedOptions, timeSpent };
        }
        return answer;
      });
      setUserAnswers(newAnswers);
    } else {
      // Nova resposta
      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedOptions: [optionId],
        timeSpent,
      };
      setUserAnswers([...userAnswers, newAnswer]);
    }
  };

  // ===== NAVEGAR PARA PRÓXIMA QUESTÃO =====
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      completeQuiz();
    }
  };

  // ===== VOLTAR QUESTÃO ANTERIOR =====
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  // ===== COMPLETAR QUIZ =====
  const completeQuiz = () => {
    setIsCompleted(true);
    setShowResults(true);
  };

  // ===== REINICIAR QUIZ =====
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuestionStartTime(Date.now());
    setIsCompleted(false);
    setShowResults(false);
  };

  // ===== OBTER RESPOSTA ATUAL =====
  const getCurrentAnswer = () => {
    return userAnswers.find(a => a.questionId === currentQuestion?.id);
  };

  // ===== CALCULAR SCORE (SIMULADO) =====
  const calculateScore = () => {
    const answeredQuestions = userAnswers.length;
    const correctAnswers = Math.floor(answeredQuestions * 0.7); // 70% simulado
    const score = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

    return {
      score: Math.round(score),
      correct: correctAnswers,
      total: questions.length,
      passed: score >= metadata.settings.passScore,
    };
  };

  const currentAnswer = getCurrentAnswer();
  const canProceed = currentAnswer && currentAnswer.selectedOptions.length > 0;

  // ===== RENDER DE RESULTADOS =====
  if (showResults) {
    const results = calculateScore();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#432818]">Quiz Concluído!</CardTitle>
            {stepNumber && (
              <Badge variant="outline" className="mx-auto">
                Etapa {stepNumber}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score */}
            <div className="text-center">
              <div
                className="text-6xl font-bold mb-2"
                style={{
                  color: results.passed ? '#10B981' : '#EF4444',
                }}
              >
                {results.score}%
              </div>
              <div className="text-lg text-[#8F7A6A]">
                {results.correct} de {results.total} questões corretas
              </div>
              <Badge variant={results.passed ? 'default' : 'destructive'} className="mt-2">
                {results.passed ? 'Aprovado' : 'Reprovado'}
              </Badge>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#B89B7A]">
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-[#8F7A6A]">Tempo Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#B89B7A]">
                  {Math.round(timeElapsed / questions.length)}s
                </div>
                <div className="text-sm text-[#8F7A6A]">Média por Questão</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#B89B7A]">{questions.length}</div>
                <div className="text-sm text-[#8F7A6A]">Total Questões</div>
              </div>
            </div>

            {/* Detalhes do Quiz */}
            <div className="bg-[#FAF9F7] p-4 rounded-lg">
              <h4 className="font-semibold text-[#432818] mb-2">Detalhes do Quiz</h4>
              <div className="space-y-1 text-sm text-[#8F7A6A]">
                <div>
                  <strong>Título:</strong> {metadata.title}
                </div>
                <div>
                  <strong>Categoria:</strong> {metadata.category}
                </div>
                <div>
                  <strong>Dificuldade:</strong> {metadata.difficulty}
                </div>
                <div>
                  <strong>Nota Mínima:</strong> {metadata.settings.passScore}%
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button
                onClick={restartQuiz}
                variant="outline"
                className="flex-1 border-[#B89B7A] text-[#432818]"
                disabled={!metadata.settings.allowRetake}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {metadata.settings.allowRetake ? 'Refazer Quiz' : 'Não Permitido'}
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-[#B89B7A] hover:bg-[#A38A69] text-white"
              >
                Fechar Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-lg text-[#8F7A6A] mb-4">Nenhuma questão encontrada</div>
            <Button onClick={onClose}>Fechar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#432818]">{metadata.title}</CardTitle>
              {stepNumber && (
                <Badge variant="outline" className="mt-1">
                  Etapa {stepNumber}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#8F7A6A] hover:text-[#432818]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress e Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-[#8F7A6A]">
              <span>
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {metadata.settings.showProgress && <Progress value={progress} className="w-full h-2" />}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Questão */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[#432818] mb-4">
              {currentQuestion.title || currentQuestion.question}
            </h3>

            {currentQuestion.multiSelect > 1 && (
              <Badge variant="outline" className="mb-4">
                Selecione até {currentQuestion.multiSelect} opções
              </Badge>
            )}
          </div>

          {/* Opções */}
          <div className="grid gap-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = currentAnswer?.selectedOptions.includes(
                option.id || `opt${index}`
              );

              return (
                <Button
                  key={option.id || index}
                  variant="outline"
                  size="lg"
                  onClick={() => handleOptionSelect(option.id || `opt${index}`)}
                  className={`p-4 h-auto text-left justify-start transition-all ${
                    isSelected
                      ? 'border-[#B89B7A] bg-[#B89B7A]/10 text-[#432818] font-semibold'
                      : 'border-gray-300 hover:border-[#B89B7A]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#B89B7A] bg-[#B89B7A]' : 'border-gray-400'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Navegação */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="border-[#B89B7A] text-[#432818]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex items-center gap-2 text-sm text-[#8F7A6A]">
              <Target className="w-4 h-4" />
              <span>
                {userAnswers.length} de {questions.length} respondidas
              </span>
            </div>

            <Button
              onClick={goToNextQuestion}
              disabled={!canProceed}
              className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
