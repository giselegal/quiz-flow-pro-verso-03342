
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Quiz } from '../../types/supabase';

interface QuizEditorProps {
  quiz: Quiz;
  onBack: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onBack }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <p className="text-gray-600">{quiz.description}</p>
            <Button variant="outline">
              Adicionar Pergunta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizEditor;
