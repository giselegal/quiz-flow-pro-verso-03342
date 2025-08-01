
import React from 'react';
import { useRoute } from 'wouter';

export const QuizPage: React.FC = () => {
  const [match, params] = useRoute('/quiz/:id');
  const quizId = params?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Quiz
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Quiz ID: {quizId}
          </p>
          
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Pergunta de Exemplo</h2>
              <p className="text-gray-700 mb-6">
                Esta é uma página de quiz de exemplo. O conteúdo seria carregado baseado no ID: {quizId}
              </p>
              
              <div className="space-y-3">
                <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border">
                  Opção A
                </button>
                <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border">
                  Opção B
                </button>
                <button className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border">
                  Opção C
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
