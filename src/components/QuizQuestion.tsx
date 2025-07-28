
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QuizQuestion as QuizQuestionType, UserResponse } from '../types/quiz';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuizOption } from './quiz/QuizOption';
import { highlightStrategicWords } from '@/utils/textHighlight';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useQuestionScroll } from '@/hooks/useQuestionScroll';
import { StaggeredOptionAnimations } from './effects/StaggeredOptionAnimations';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (response: UserResponse) => void;
  currentAnswers: string[];
  autoAdvance?: boolean;
  hideTitle?: boolean;
  showQuestionImage?: boolean;
  isStrategicQuestion?: boolean; // Nova prop
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentAnswers,
  autoAdvance = false,
  hideTitle = false,
  showQuestionImage = false,
  isStrategicQuestion = false
}) => {
  const isMobile = useIsMobile();
  const hasImageOptions = question.type !== 'text';
  const [imageError, setImageError] = useState(false);
  const { scrollToQuestion } = useQuestionScroll();

  useEffect(() => {
    scrollToQuestion(question.id);
  }, [question.id, scrollToQuestion]);

  const handleOptionSelect = (optionId: string) => {
    let newSelectedOptions: string[];
    
    if (currentAnswers.includes(optionId)) {
      // Para questões estratégicas, não permitimos desmarcar a única opção selecionada
      if (isStrategicQuestion) {
        return; // Não permite desmarcar a opção em questões estratégicas
      }
      newSelectedOptions = currentAnswers.filter(id => id !== optionId);
    } else {
      if (isStrategicQuestion) {
        // Para questões estratégicas, substituímos qualquer seleção anterior
        newSelectedOptions = [optionId];
      } else if (question.multiSelect && currentAnswers.length >= question.multiSelect) {
        newSelectedOptions = [...currentAnswers.slice(1), optionId];
      } else {
        newSelectedOptions = [...currentAnswers, optionId];
      }
    }
    
    onAnswer({ 
      questionId: question.id,
      selectedOptions: newSelectedOptions,
      timestamp: new Date()
    });
  };
  
  const getGridColumns = () => {
    if (question.type === 'text') {
      if (isStrategicQuestion) {
        return "grid-cols-1 gap-3 px-2";
      }
      return isMobile ? "grid-cols-1 gap-3 px-2" : "grid-cols-1 gap-4 px-4";
    }
    return isMobile ? "grid-cols-2 gap-1 px-0.5" : "grid-cols-2 gap-3 px-2";
  };
  
  return (
    <div className={cn("w-full max-w-6xl mx-auto pb-5 relative", 
      isMobile && "px-2", 
      isStrategicQuestion && "max-w-3xl strategic-question",
      question.type === 'text' && !isStrategicQuestion && "text-only-question"
    )} id={`question-${question.id}`}>
      {!hideTitle && (
        <>
          <h2 className={cn(
            "font-playfair text-center mb-5 px-3 pt-3 text-brand-coffee font-semibold tracking-normal",
            isMobile ? "text-base" : "text-base sm:text-xl",
            isStrategicQuestion && "strategic-question-title text-[#432818] mb-6 font-bold whitespace-pre-line",
            isStrategicQuestion && isMobile && "text-[1.25rem] sm:text-2xl", // Texto maior para questões estratégicas em mobile
            question.type === 'text' && !isStrategicQuestion && ".text-only-question & " && "text-[1.15rem] sm:text-xl" // Texto maior para títulos em questões só texto
          )}>
            {highlightStrategicWords(question.title || question.question)}
          </h2>
          
          {isStrategicQuestion && question.imageUrl && !imageError && showQuestionImage && (
            <div className="w-full mb-6">
              <img 
                src={question.imageUrl} 
                alt="Question visual" 
                className="w-full max-w-md mx-auto rounded-lg shadow-sm" 
                onError={() => {
                  console.error(`Failed to load image: ${question.imageUrl}`);
                  setImageError(true);
                }}
              />
            </div>
          )}
        </>
      )}
      
      <div className="w-full">
        <StaggeredOptionAnimations 
          questionId={question.id}
          isVisible={true}
          className={cn(
            "grid h-full",
            getGridColumns(),
            hasImageOptions && "mb-4 relative",
            isStrategicQuestion && "gap-4"
          )}
        >
          {question.options.map((option, index) => (
            <QuizOption 
              key={option.id} 
              option={option} 
              isSelected={currentAnswers.includes(option.id)} 
              onSelect={handleOptionSelect}
              type={question.type === "strategic" || question.type === "normal" ? "both" : (question.type as 'text' | 'image' | 'both')}
              questionId={question.id}
              isDisabled={
                (isStrategicQuestion && currentAnswers.length > 0 && !currentAnswers.includes(option.id)) || 
                (!isStrategicQuestion && !currentAnswers.includes(option.id) && 
                  currentAnswers.length >= (question.multiSelect || 1))
              }
              isStrategicOption={isStrategicQuestion}
            />
          ))}
        </StaggeredOptionAnimations>
      </div>
    </div>
  );
};

export { QuizQuestion };

