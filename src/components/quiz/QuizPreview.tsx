
import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Quiz } from '../../types/supabase';

interface QuizPreviewProps {
  quiz: Quiz;
  onBack: () => void;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {quiz.title}
            <Badge variant="secondary">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{quiz.description}</p>
          <div className="mt-4">
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Iniciar Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPreview;
