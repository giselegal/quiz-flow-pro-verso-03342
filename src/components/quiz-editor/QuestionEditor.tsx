import React, { useState } from 'react';
import { QuizQuestion, QuizOption } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateId } from '@/utils/idGenerator';
import QuestionOptionEditor from './QuestionOptionEditor';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionEditorProps {
  question: QuizQuestion | null;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
  onDelete
}) => {
  const [editedQuestion, setEditedQuestion] = useState<QuizQuestion>(
    question || {
      id: generateId(),
      title: '',
      type: 'text',
      multiSelect: 3,
      options: []
    }
  );

  const handleAddOption = () => {
    const newOption: QuizOption = {
      id: generateId(),
      text: 'Nova opção',
      styleCategory: 'Natural',
      points: 1
    };

    setEditedQuestion(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const handleUpdateOption = (updatedOption: QuizOption) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === updatedOption.id ? updatedOption : opt
      )
    }));
  };

  const handleDeleteOption = (optionId: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== optionId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedQuestion.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, adicione um título para a pergunta.",
        variant: "destructive"
      });
      return;
    }
    
    if (editedQuestion.options.length < 2) {
      toast({
        title: "Opções insuficientes",
        description: "Adicione pelo menos duas opções para a pergunta.",
        variant: "destructive"
      });
      return;
    }
    
    onSave(editedQuestion);
  };

  if (!question) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Editar Pergunta</CardTitle>
          <CardDescription>Configure os detalhes da pergunta e suas opções</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Pergunta</Label>
              <Textarea
                id="title"
                value={editedQuestion.title}
                onChange={(e) => setEditedQuestion(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título da pergunta"
                className="min-h-[100px] resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Pergunta</Label>
                <Select
                  value={editedQuestion.type}
                  onValueChange={(value: 'text' | 'image' | 'both' | 'normal' | 'strategic') => 
                    setEditedQuestion(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Apenas texto</SelectItem>
                    <SelectItem value="image">Apenas imagem</SelectItem>
                    <SelectItem value="both">Texto e imagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="multiSelect">Número de seleções</Label>
                <Select
                  value={String(editedQuestion.multiSelect)}
                  onValueChange={(value) => 
                    setEditedQuestion(prev => ({ ...prev, multiSelect: parseInt(value) }))
                  }
                >
                  <SelectTrigger id="multiSelect">
                    <SelectValue placeholder="Selecione o número" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 seleção</SelectItem>
                    <SelectItem value="3">3 seleções</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Opções</h3>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddOption}
                className="border-[#B89B7A] text-[#B89B7A]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Opção
              </Button>
            </div>
            
            <div className="space-y-4">
              {editedQuestion.options.map((option, index) => (
                <QuestionOptionEditor
                  key={option.id}
                  option={option}
                  questionType={editedQuestion.type}
                  onUpdate={handleUpdateOption}
                  onDelete={() => handleDeleteOption(option.id)}
                  index={index}
                />
              ))}
              
              {editedQuestion.options.length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-gray-500">Nenhuma opção adicionada</p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleAddOption}
                    className="mt-2 text-[#B89B7A]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Opção
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir pergunta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Esta pergunta será permanentemente removida do quiz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <Button type="submit" className="bg-[#B89B7A] hover:bg-[#A38A69]">
            <Save className="w-4 h-4 mr-2" />
            Salvar Pergunta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuestionEditor;
