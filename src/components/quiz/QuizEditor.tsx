
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const QuizEditor: React.FC = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      text: '',
      options: ['', '', '', '']
    }]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#432818] mb-6">Editor de Quiz</h1>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="quiz-title">Título do Quiz</Label>
          <Input
            id="quiz-title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Digite o título do quiz"
            className="mt-2"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#432818]">Perguntas</h2>
            <Button onClick={addQuestion}>Adicionar Pergunta</Button>
          </div>
          
          {questions.length === 0 ? (
            <p className="text-[#8F7A6A] text-center py-8">
              Nenhuma pergunta adicionada ainda
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white p-4 rounded-lg border border-[#B89B7A]/20">
                  <h3 className="font-medium text-[#432818] mb-2">
                    Pergunta {index + 1}
                  </h3>
                  <Input
                    placeholder="Digite a pergunta"
                    className="mb-3"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option: string, optIndex: number) => (
                      <Input
                        key={optIndex}
                        placeholder={`Opção ${optIndex + 1}`}
                        className="text-sm"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancelar</Button>
          <Button>Salvar Quiz</Button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
