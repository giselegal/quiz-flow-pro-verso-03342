import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserResponse } from '@/types/quiz';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  imageUrl?: string;
  styleCategory?: string;
  points?: number;
}

interface Question {
  id: string;
  title: string;
  type: 'text' | 'image' | 'both';
  multiSelect: boolean;
  options: Option[];
}

interface QuizQuestionProps {
  question: Question;
  onAnswer: (response: UserResponse) => void;
  currentAnswers: string[];
  showQuestionImage?: boolean;
  autoAdvance?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  currentAnswers,
  showQuestionImage = true,
  autoAdvance = true,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(currentAnswers);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOptions(currentAnswers);
    setIsAnswered(currentAnswers.length > 0);
  }, [currentAnswers]);

  const handleOptionSelect = (optionId: string) => {
    let newSelection: string[];

    if (question.multiSelect) {
      if (selectedOptions.includes(optionId)) {
        newSelection = selectedOptions.filter((id) => id !== optionId);
      } else {
        newSelection = [...selectedOptions, optionId];
      }
    } else {
      newSelection = [optionId];
    }

    setSelectedOptions(newSelection);
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      setIsAnswered(true);

      // Calculate total points
      let totalPoints = 0;
      question.options.forEach(option => {
        if (selectedOptions.includes(option.id) && option.points) {
          totalPoints += option.points;
        }
      });

      const response: UserResponse = {
        questionId: question.id,
        optionIds: selectedOptions,
        points: totalPoints
      };

      onAnswer(response);
    }
  };

  useEffect(() => {
    if (isAnswered && autoAdvance) {
      // Auto-submit after a delay
      const timer = setTimeout(() => {
        handleSubmit();
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(timer);
    }
  }, [isAnswered, autoAdvance, handleSubmit]);

  const isOptionSelected = (optionId: string) => {
    return selectedOptions.includes(optionId);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{question.title}</h2>

        {showQuestionImage && (
          <div className="mb-4">
            {/* You might want to add a default image or handle missing images */}
            <img
              src="https://images.unsplash.com/photo-1517245386804-bb43f6536c3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Question Image"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        )}

        <div className="grid gap-4">
          {question.options.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border cursor-pointer ${isOptionSelected(option.id)
                ? 'bg-[#B89B7A]/20 border-[#B89B7A]'
                : 'border-gray-200 hover:border-gray-400'
                }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="flex items-center space-x-3">
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={`Option: ${option.text}`}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <span className="text-gray-700">{option.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
        {question.multiSelect && (
          <div className="mr-4 text-sm text-gray-600">
            {selectedOptions.length} opção(ões) selecionada(s)
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isAnswered}
          className="bg-[#B89B7A] hover:bg-[#A68B6A] text-white font-semibold py-2 px-4 rounded-full"
        >
          {isAnswered ? 'Avançando...' : 'Confirmar'}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
