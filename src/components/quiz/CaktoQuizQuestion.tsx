// @ts-nocheck
import React, { useState } from 'react';
import { QuizQuestion, QuizResponse, UserResponse } from '@/types/quiz';
// Simple validation function
const validateResponse = (response: UserResponse, question: QuizQuestion): boolean => {
  return !!(response.selectedOptions && response.selectedOptions.length > 0);
};

interface CaktoQuizQuestionProps {
  question: QuizQuestion;
  onAnswer: (response: QuizResponse) => void;
}

const CaktoQuizQuestion: React.FC<CaktoQuizQuestionProps> = ({ question, onAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSubmit = () => {
    // Create UserResponse for validation
    const userResponse: UserResponse = {
      questionId: question.id,
      selectedOptions,
      timestamp: new Date(),
    };

    // Validate response (only needs 2 arguments now)
    if (validateResponse(userResponse, question)) {
      // Convert to QuizResponse format for onAnswer
      const quizResponse: QuizResponse = {
        questionId: question.id,
        selectedOptions: selectedOptions,

        timestamp: new Date(),
      };

      onAnswer(quizResponse);
    }
  };

  // Basic rendering of options (customize as needed)
  return (
    <div>
      <h3>{question.question}</h3>
      {question.options.map(option => (
        <div key={option.id}>
          <label>
            <input
              type="checkbox"
              value={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={e => {
                const optionId = option.id;
                setSelectedOptions(prev =>
                  e.target.checked ? [...prev, optionId] : prev.filter(id => id !== optionId)
                );
              }}
            />
            {option.text}
          </label>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CaktoQuizQuestion;
