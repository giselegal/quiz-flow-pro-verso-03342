import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateQuizModalProps {
  onCreate: (quizData: { title: string; description: string; category: string }) => void;
  onCancel: () => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = () => {
    onCreate({ title, description, category });
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Criar Novo Quiz</CardTitle>
        <CardDescription>Preencha os detalhes do quiz abaixo:</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Título do Quiz</Label>
          <Input
            id="title"
            placeholder="Ex: Quiz de Conhecimentos Gerais"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Uma breve descrição sobre o quiz"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Categoria</Label>
          <Select onValueChange={setCategory} defaultValue={category}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Geral</SelectItem>
              <SelectItem value="sports">Esportes</SelectItem>
              <SelectItem value="history">História</SelectItem>
              <SelectItem value="science">Ciência</SelectItem>
              <SelectItem value="entertainment">Entretenimento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <div className="flex justify-end space-x-2 p-6">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Criar Quiz</Button>
      </div>
    </Card>
  );
};
