// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { QuizResponse, UserResponse } from '@/types/quiz';
import { calculateQuizResult } from '@/lib/quizEngine';

const CaktoQuizFlow: React.FC = () => {
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [, setLocation] = useLocation();

  // Convert QuizResponse to UserResponse format
  const convertResponsesToUserResponses = (quizResponses: QuizResponse[]): UserResponse[] => {
    return quizResponses.map(response => ({
      questionId: response.questionId,
      selectedOptions: response.selectedOptions,
      timestamp: response.timestamp,
    }));
  };

  const calculateResults = () => {
    // Convert responses to the format expected by the engine
    const userResponses = convertResponsesToUserResponses(responses);
    return calculateQuizResult([], []);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair text-[#432818] mb-4">Quiz de Estilo Pessoal</h1>
          <p className="text-[#8F7A6A] text-lg">
            Descubra seu estilo único respondendo algumas perguntas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#B89B7A]/20 p-8">
          {/* Quiz content would go here */}
          <p className="text-center text-[#8F7A6A]">Componente do quiz em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
};

export default CaktoQuizFlow;
