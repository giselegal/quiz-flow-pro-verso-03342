
import React from 'react';
import { Card } from './ui/card';
import { AnimatedWrapper } from './ui/animated-wrapper';
import { QuizQuestion } from './QuizQuestion';
import { strategicQuestions } from '../data/strategicQuestions';
import { UserResponse } from '@/types/quiz';

interface QuizTransitionProps {
  onContinue: () => void;
  onAnswer: (response: UserResponse) => void;
  currentAnswers: string[];
}

const QuizTransition: React.FC<QuizTransitionProps> = ({ onContinue, onAnswer, currentAnswers }) => {
  const handleFirstStrategicAnswer = (response: UserResponse) => {
    onAnswer(response);
    // Reduzindo o delay para a transição ser mais rápida
    setTimeout(() => {
      onContinue();
    }, 250); // Reduzido de 500ms para 250ms
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <AnimatedWrapper show={true}>
          <Card className="p-8 space-y-8 bg-white shadow-md mb-10 border-[#B89B7A]/20">
            <h2 className="text-2xl font-playfair text-[#432818] text-center tracking-normal font-semibold">
              Enquanto calculamos o seu resultado...
            </h2>
            
            <p className="text-[#1A1818]/80 text-base">
              Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.
            </p>
            
            <p className="text-[#1A1818]/80 text-base">
              A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.
            </p>
            
            <div className="bg-[#B89B7A]/10 p-6 rounded-lg">
              <p className="text-[#432818] italic text-center font-medium">
                Responda com sinceridade. Isso é só entre você e a sua nova versão.
              </p>
            </div>
          </Card>
        </AnimatedWrapper>

        <AnimatedWrapper show={true}>
          <QuizQuestion
            question={strategicQuestions[0]}
            onAnswer={handleFirstStrategicAnswer}
            currentAnswers={currentAnswers}
            autoAdvance={true}
          />
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default QuizTransition;
