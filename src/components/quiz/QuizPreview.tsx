
import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Quiz } from '../../types/supabase';

interface QuizPreviewProps {
  quiz: Quiz;
  onBack: () => void;
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <Badge variant="secondary">Preview</Badge>
          </div>
          
          <p className="text-gray-600">{quiz.description}</p>
          
          <div className="space-y-2">
            <p><strong>Categoria:</strong> {quiz.category}</p>
            <p><strong>Dificuldade:</strong> {quiz.difficulty || 'Não definida'}</p>
            <p><strong>Status:</strong> {quiz.is_published ? 'Publicado' : 'Rascunho'}</p>
          </div>
          
          <div className="pt-4">
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Iniciar Quiz
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
