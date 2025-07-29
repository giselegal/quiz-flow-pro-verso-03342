
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  points?: number;
}

interface Question {
  id: string;
  title: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  options: QuestionOption[];
  required: boolean;
  description?: string;
  hint?: string;
  tags: string[];
}

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  onDelete
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...question, title: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    onUpdate({ 
      ...question, 
      type: value as Question['type'],
      options: value === 'text' ? [] : question.options
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...question, description: e.target.value });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({ ...question, required: checked });
  };

  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...question, hint: e.target.value });
  };

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      text: '',
      isCorrect: false,
      points: 1
    };
    onUpdate({ ...question, options: [...question.options, newOption] });
  };

  const updateOption = (optionId: string, updates: Partial<QuestionOption>) => {
    const updatedOptions = question.options.map(opt => 
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    onUpdate({ ...question, options: updatedOptions });
  };

  const removeOption = (optionId: string) => {
    const updatedOptions = question.options.filter(opt => opt.id !== optionId);
    onUpdate({ ...question, options: updatedOptions });
  };

  const handleOptionTextChange = (optionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    updateOption(optionId, { text: e.target.value });
  };

  const handleOptionCorrectChange = (optionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    updateOption(optionId, { isCorrect: e.target.checked });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onUpdate({ ...question, tags });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pergunta</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ocultar' : 'Avançado'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Question Title */}
        <div className="space-y-2">
          <Label htmlFor="question-title">Título da Pergunta</Label>
          <Input
            id="question-title"
            value={question.title}
            onChange={handleTitleChange}
            placeholder="Digite sua pergunta..."
          />
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <Label htmlFor="question-type">Tipo de Pergunta</Label>
          <Select value={question.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
              <SelectItem value="single_choice">Escolha Única</SelectItem>
              <SelectItem value="text">Texto Livre</SelectItem>
              <SelectItem value="rating">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question Description */}
        {showAdvanced && (
          <div className="space-y-2">
            <Label htmlFor="question-description">Descrição (Opcional)</Label>
            <Textarea
              id="question-description"
              value={question.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Adicione uma descrição para esta pergunta..."
              rows={3}
            />
          </div>
        )}

        {/* Options */}
        {question.type !== 'text' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opções de Resposta</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Opção
              </Button>
            </div>
            
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center gap-2 p-2 border rounded">
                  <Checkbox
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionCorrectChange(option.id, e)}
                  />
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e)}
                    placeholder="Texto da opção..."
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={question.required}
                onChange={(e) => handleRequiredChange(e.target.checked)}
              />
              <Label htmlFor="required">Pergunta obrigatória</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hint">Dica (Opcional)</Label>
              <Input
                id="hint"
                value={question.hint || ''}
                onChange={handleHintChange}
                placeholder="Adicione uma dica para ajudar os usuários..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={question.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="categoria, nivel1, importante..."
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {question.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
