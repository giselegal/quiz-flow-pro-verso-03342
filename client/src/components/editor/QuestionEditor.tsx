
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Edit2, Save, Trash2 } from 'lucide-react';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: QuestionOption[];
  correct_answers: string[];
  points: number;
  explanation?: string;
  time_limit?: number;
  required: boolean;
  hint?: string;
  media_url?: string;
  media_type?: string;
  tags: string[];
}

interface QuestionEditorProps {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
  onDelete
}) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleOptionChange = (optionId: string, field: keyof QuestionOption, value: any) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === optionId 
          ? { ...opt, [field]: value }
          : opt
      )
    }));
  };

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `option_${Date.now()}`,
      text: '',
      isCorrect: false
    };
    
    setEditedQuestion(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const removeOption = (optionId: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== optionId)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !editedQuestion.tags.includes(newTag.trim())) {
      setEditedQuestion(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    onSave(editedQuestion);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Editar Pergunta</span>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDelete(question.id)} 
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Pergunta */}
        <div className="space-y-2">
          <Label htmlFor="question">Pergunta</Label>
          <Textarea
            id="question"
            value={editedQuestion.question_text}
            onChange={(e) => setEditedQuestion(prev => ({ ...prev, question_text: e.target.value }))}
            placeholder="Digite sua pergunta aqui..."
            rows={3}
          />
        </div>

        {/* Tipo de Pergunta */}
        <div className="space-y-2">
          <Label>Tipo de Pergunta</Label>
          <Select 
            value={editedQuestion.question_type} 
            onValueChange={(value) => setEditedQuestion(prev => ({ ...prev, question_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
              <SelectItem value="single_choice">Escolha Única</SelectItem>
              <SelectItem value="true_false">Verdadeiro/Falso</SelectItem>
              <SelectItem value="short_answer">Resposta Curta</SelectItem>
              <SelectItem value="essay">Dissertativa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opções */}
        {['multiple_choice', 'single_choice', 'true_false'].includes(editedQuestion.question_type) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Opções de Resposta</Label>
              <Button onClick={addOption} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Opção
              </Button>
            </div>
            
            {editedQuestion.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Checkbox
                  checked={option.isCorrect}
                  onCheckedChange={(checked) => 
                    handleOptionChange(option.id, 'isCorrect', checked)
                  }
                />
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  className="flex-1"
                />
                <Button 
                  onClick={() => removeOption(option.id)}
                  size="sm"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Configurações */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="points">Pontos</Label>
            <Input
              id="points"
              type="number"
              value={editedQuestion.points}
              onChange={(e) => setEditedQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time_limit">Tempo Limite (segundos)</Label>
            <Input
              id="time_limit"
              type="number"
              value={editedQuestion.time_limit || ''}
              onChange={(e) => setEditedQuestion(prev => ({ ...prev, time_limit: parseInt(e.target.value) || undefined }))}
              min="0"
            />
          </div>
        </div>

        {/* Explicação */}
        <div className="space-y-2">
          <Label htmlFor="explanation">Explicação (opcional)</Label>
          <Textarea
            id="explanation"
            value={editedQuestion.explanation || ''}
            onChange={(e) => setEditedQuestion(prev => ({ ...prev, explanation: e.target.value }))}
            placeholder="Explicação sobre a resposta correta..."
            rows={2}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2 flex-wrap mb-2">
            {editedQuestion.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Adicionar tag..."
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Obrigatório */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="required"
            checked={editedQuestion.required}
            onCheckedChange={(checked) => setEditedQuestion(prev => ({ ...prev, required: !!checked }))}
          />
          <Label htmlFor="required">Pergunta obrigatória</Label>
        </div>
      </CardContent>
    </Card>
  );
};
