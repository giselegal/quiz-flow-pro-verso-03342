import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface QuizEditorInterfaceProps {
  onSave?: () => void;
}

export const QuizEditorInterface: React.FC<QuizEditorInterfaceProps> = ({ onSave }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave?.();
      toast({
        title: 'Sucesso',
        description: 'Quiz salvo com sucesso',
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar quiz',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      // Simulate publish operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Sucesso',
        description: 'Quiz publicado com sucesso',
      });
    } catch (error) {
      console.error('Publish error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao publicar quiz',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Editor de Quiz</h2>

      <div className="space-y-4">
        <p style={{ color: '#6B4F43' }}>Configure e personalize seu quiz aqui.</p>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isLoading} variant="outline">
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>

          <Button onClick={handlePublish} disabled={isLoading}>
            {isLoading ? 'Publicando...' : 'Publicar'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuizEditorInterface;
