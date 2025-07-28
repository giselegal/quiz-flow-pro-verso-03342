
import React from 'react';
import { cn } from '@/lib/utils';

interface CaktoQuizQuestionProps {
  question?: string;
  options?: Array<{
    id: string;
    text: string;
    imageUrl?: string;
  }>;
  onSelect?: (optionId: string) => void;
  selectedOptions?: string[];
  className?: string;
}

export const CaktoQuizQuestion: React.FC<CaktoQuizQuestionProps> = ({
  question = 'Pergunta exemplo',
  options = [],
  onSelect,
  selectedOptions = [],
  className
}) => {
  return (
    <div className={cn("p-6 bg-white rounded-lg", className)}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {question}
      </h2>
      
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "border-2 rounded-lg p-4 cursor-pointer transition-all duration-200",
              "hover:border-blue-300 hover:bg-blue-50",
              selectedOptions.includes(option.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            )}
            onClick={() => onSelect?.(option.id)}
          >
            {option.imageUrl && (
              <img 
                src={option.imageUrl} 
                alt={option.text}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            
            <span className="text-gray-800 font-medium">
              {option.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaktoQuizQuestion;
