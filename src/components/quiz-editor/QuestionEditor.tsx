import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuizOption, QuizQuestion } from '@/types/quiz';
import { Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { generateSemanticId } from '../../utils/semanticIdGenerator';

interface QuestionEditorProps {
  question: QuizQuestion | null;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
  onDelete,
  isNew = false,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<QuizQuestion>(() => {
    if (question) {
      return question;
    }

    // Create a proper QuizQuestion object with all required properties
    return {
      id: generateSemanticId({
        context: 'quiz',
        type: 'question',
        identifier: 'question',
        index: Math.floor(Math.random() * 1000),
      }),
      text: '', // Add required 'text' property
      order: 0,
      question: '', // Add required 'question' property
      title: '', // Keep title for backward compatibility
      type: 'normal' as const,
      multiSelect: 3,
      options: [] as QuizOption[],
    };
  });

  useEffect(() => {
    if (question) {
      setEditedQuestion(question);
    }
  }, [question]);

  const handleSave = () => {
    // Ensure we have both question and title populated
    const questionToSave: QuizQuestion = {
      ...editedQuestion,
      question: editedQuestion.question || editedQuestion.title || '',
      title: editedQuestion.title || editedQuestion.question || '',
    };

    onSave(questionToSave);
  };

  const handleAddOption = () => {
    setEditedQuestion(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: generateSemanticId({
            context: 'quiz',
            type: 'question',
            identifier: 'option',
            index: Math.floor(Math.random() * 1000),
          }),
          text: '',
          style: 'natural',
        },
      ],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, field: string, value: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      ),
    }));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-[#B89B7A]/20">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#432818]">
          {isNew ? 'Nova Pergunta' : 'Editar Pergunta'}
        </h3>
        {onDelete && !isNew && (
          <Button variant="outline" size="sm" onClick={onDelete} style={{ color: '#432818' }}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="question-title">Título da Pergunta</Label>
          <Input
            id="question-title"
            value={editedQuestion.title || ''}
            onChange={e =>
              setEditedQuestion(prev => ({
                ...prev,
                title: e.target.value,
                question: e.target.value, // Keep in sync
              }))
            }
            placeholder="Digite o título da pergunta"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="multiselect">Número de Seleções Permitidas</Label>
          <Input
            id="multiselect"
            type="number"
            min="1"
            max="10"
            value={editedQuestion.multiSelect || 3}
            onChange={e =>
              setEditedQuestion(prev => ({
                ...prev,
                multiSelect: parseInt(e.target.value) || 3,
              }))
            }
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <Label>Opções de Resposta</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="text-[#432818] border-[#B89B7A]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>

          <div className="space-y-3">
            {editedQuestion.options.map((option, index) => (
              <div key={option.id || index} style={{ borderColor: '#E5DDD5' }}>
                <div className="flex-1">
                  <Input
                    value={option.text}
                    onChange={e => handleOptionChange(index, 'text', e.target.value)}
                    placeholder={`Opção ${index + 1}`}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  style={{ color: '#432818' }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#B89B7A]/20">
        <Button variant="outline" onClick={onCancel} className="border-[#B89B7A] text-[#432818]">
          Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-[#B89B7A] hover:bg-[#A38A69] text-white">
          Salvar Pergunta
        </Button>
      </div>
    </div>
  );
};

export default QuestionEditor;
