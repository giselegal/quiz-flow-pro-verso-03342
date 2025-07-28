
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Quiz } from '../../types/supabase';

interface QuizEditorProps {
  quiz: Quiz;
  onBack: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onBack }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Editando: {quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                defaultValue={quiz.title}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea 
                className="w-full p-2 border rounded h-24"
                defaultValue={quiz.description || ''}
              />
            </div>
            
            <div className="flex gap-2">
              <Button>Salvar</Button>
              <Button variant="outline">Publicar</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
