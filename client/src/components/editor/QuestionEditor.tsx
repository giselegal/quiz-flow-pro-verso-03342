
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  options?: string[];
  required: boolean;
  category?: string;
  points?: number;
}

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [localQuestion, setLocalQuestion] = useState<Question>(question);
  
  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedQuestion = { ...localQuestion, text: e.target.value };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleTypeChange = (value: string) => {
    const updatedQuestion = { 
      ...localQuestion, 
      type: value as Question['type'],
      options: value === 'multiple_choice' || value === 'single_choice' ? ['Opção 1', 'Opção 2'] : undefined
    };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!localQuestion.options) return;
    
    const newOptions = [...localQuestion.options];
    newOptions[index] = value;
    const updatedQuestion = { ...localQuestion, options: newOptions };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleRequiredChange = (checked: boolean) => {
    const updatedQuestion = { ...localQuestion, required: checked };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestion = { ...localQuestion, category: e.target.value };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const addOption = () => {
    if (!localQuestion.options) return;
    
    const newOptions = [...localQuestion.options, `Opção ${localQuestion.options.length + 1}`];
    const updatedQuestion = { ...localQuestion, options: newOptions };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const removeOption = (index: number) => {
    if (!localQuestion.options || localQuestion.options.length <= 2) return;
    
    const newOptions = localQuestion.options.filter((_, i) => i !== index);
    const updatedQuestion = { ...localQuestion, options: newOptions };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value) || 0;
    const updatedQuestion = { ...localQuestion, points };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Pergunta {index + 1}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDuplicate}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}`}>Texto da Pergunta</Label>
          <Textarea
            id={`question-${question.id}`}
            value={localQuestion.text}
            onChange={handleTextChange}
            placeholder="Digite sua pergunta aqui..."
            className="min-h-[80px]"
          />
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <Label>Tipo de Pergunta</Label>
          <Select value={localQuestion.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
              <SelectItem value="single_choice">Escolha Única</SelectItem>
              <SelectItem value="text">Texto Livre</SelectItem>
              <SelectItem value="rating">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Options for multiple/single choice */}
        {(localQuestion.type === 'multiple_choice' || localQuestion.type === 'single_choice') && (
          <div className="space-y-2">
            <Label>Opções</Label>
            {localQuestion.options?.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionChange(optIndex, e.target.value)}
                  placeholder={`Opção ${optIndex + 1}`}
                />
                {localQuestion.options && localQuestion.options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(optIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>
        )}

        {/* Additional Settings */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`required-${question.id}`}
              checked={localQuestion.required}
              onCheckedChange={handleRequiredChange}
            />
            <Label htmlFor={`required-${question.id}`}>Obrigatória</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor={`points-${question.id}`}>Pontos:</Label>
            <Input
              id={`points-${question.id}`}
              type="number"
              value={localQuestion.points || 0}
              onChange={handlePointsChange}
              className="w-20"
              min="0"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor={`category-${question.id}`}>Categoria</Label>
          <Input
            id={`category-${question.id}`}
            value={localQuestion.category || ''}
            onChange={handleCategoryChange}
            placeholder="Digite a categoria..."
          />
        </div>

        {/* Question Stats */}
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            Tipo: {localQuestion.type === 'multiple_choice' ? 'Múltipla Escolha' : 
                   localQuestion.type === 'single_choice' ? 'Escolha Única' : 
                   localQuestion.type === 'text' ? 'Texto' : 'Avaliação'}
          </Badge>
          {localQuestion.required && (
            <Badge variant="destructive">Obrigatória</Badge>
          )}
          {localQuestion.points && localQuestion.points > 0 && (
            <Badge variant="default">{localQuestion.points} pontos</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
