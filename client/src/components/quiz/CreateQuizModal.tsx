
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useQuizzes } from '../../hooks/useQuiz';
import { useAuth } from '../../contexts/AuthContext';

interface CreateQuizModalProps {
  onQuizCreated: (quiz: any) => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ onQuizCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'medium'
  });
  
  const { createQuiz, loading } = useQuizzes();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const newQuiz = await createQuiz({
        ...formData,
        author_id: user.id,
        is_public: false,
        is_published: false,
        is_template: false,
        thumbnail_url: null,
        tags: [],
        view_count: 0,
        completion_rate: 0,
        average_score: 0,
        settings: {},
        time_limit: null
      });
      
      onQuizCreated(newQuiz);
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'general',
        difficulty: 'medium'
      });
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Criar Novo Quiz</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Quiz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Digite o título do quiz"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o quiz"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="education">Educação</SelectItem>
                <SelectItem value="entertainment">Entretenimento</SelectItem>
                <SelectItem value="business">Negócios</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Dificuldade</Label>
            <Select 
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Quiz'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
