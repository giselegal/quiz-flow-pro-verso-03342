import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Quiz } from '../../types/supabase';

interface QuizEditorProps {
  quiz: Quiz;
  onBack: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({
  quiz,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {quiz.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Editor de Quiz
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                Salvar Rascunho
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Publicar Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Editor */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Editor de Quiz
            </h2>
            <p className="text-gray-600 mb-6">
              O editor avançado será implementado na próxima fase
            </p>
            <div className="space-y-4">
              <div className="text-left max-w-md mx-auto">
                <h3 className="font-medium text-gray-900 mb-2">Informações do Quiz:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><strong>ID:</strong> {quiz.id}</li>
                  <li><strong>Título:</strong> {quiz.title}</li>
                  <li><strong>Categoria:</strong> {quiz.category}</li>
                  <li><strong>Dificuldade:</strong> {quiz.difficulty}</li>
                  <li><strong>Status:</strong> {quiz.is_published ? 'Publicado' : 'Rascunho'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
