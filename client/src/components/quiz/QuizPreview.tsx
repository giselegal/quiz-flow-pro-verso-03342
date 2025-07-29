
import React, { useState } from 'react';
import { Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Circle, Clock, User, Star } from 'lucide-react';

interface QuizPreviewProps {
  quiz: Quiz;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Este quiz não possui perguntas ainda.</p>
      </div>
    );
  }

  if (showResults) {
    const score = Object.keys(selectedAnswers).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Quiz Concluído!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold text-blue-600">{percentage}%</div>
            <p className="text-lg text-gray-600">
              Você respondeu {score} de {totalQuestions} perguntas
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} variant="outline">
                Refazer Quiz
              </Button>
              <Button onClick={() => window.close()}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <Badge variant="secondary">
            {currentQuestionIndex + 1} de {quiz.questions.length}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.title}
          </CardTitle>
          {currentQuestion.text && currentQuestion.text !== currentQuestion.title && (
            <p className="text-gray-600 mt-2">{currentQuestion.text}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === 'multiple_choice' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                return (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <div>
              <Textarea
                placeholder="Digite sua resposta aqui..."
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                rows={4}
              />
            </div>
          )}

          {currentQuestion.type === 'single_choice' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                return (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'rating' && (
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => {
                const isSelected = selectedAnswers[currentQuestion.id] === rating.toString();
                return (
                  <button
                    key={rating}
                    onClick={() => handleAnswerSelect(currentQuestion.id, rating.toString())}
                    className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {currentQuestionIndex + 1} de {quiz.questions.length}
        </div>
        
        <Button
          onClick={handleNextQuestion}
          disabled={!selectedAnswers[currentQuestion.id]}
        >
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>
    </div>
  );
};

export default QuizPreview;
