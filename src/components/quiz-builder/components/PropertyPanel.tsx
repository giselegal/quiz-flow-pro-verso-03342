
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { QuizComponentData } from '@/types/quizBuilder';
import { Trash2 } from 'lucide-react';

interface PropertyPanelProps {
  selectedComponentId: string | null;
  components: QuizComponentData[];
  onUpdate: (id: string, data: Partial<QuizComponentData['data']>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponentId,
  components,
  onUpdate,
  onDelete,
  onClose,
}) => {
  if (!selectedComponentId) {
    return (
      <div className="p-4 text-center text-[#432818]/60">
        Selecione um componente para editar suas propriedades
      </div>
    );
  }

  const component = components.find(c => c.id === selectedComponentId);

  if (!component) {
    return (
      <div className="p-4 text-center text-[#432818]/60">
        Componente não encontrado
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    onUpdate(selectedComponentId, { 
      ...component.data, 
      [field]: value 
    });
  };

  return (
    <div className="h-full p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#432818]">Propriedades</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          onClick={() => onDelete(selectedComponentId)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={component.data.title || ''}
            placeholder="Digite o título"
            onChange={(e) => handleUpdate('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            value={component.data.subtitle || ''}
            placeholder="Digite o subtítulo"
            onChange={(e) => handleUpdate('subtitle', e.target.value)}
          />
        </div>

        {component.type === 'text' && (
          <div className="space-y-2">
            <Label htmlFor="text">Texto</Label>
            <Textarea
              id="text"
              value={component.data.text || ''}
              placeholder="Digite o texto"
              className="min-h-[100px]"
              onChange={(e) => handleUpdate('text', e.target.value)}
            />
          </div>
        )}

        {(component.type === 'image' || component.data.imageUrl !== undefined) && (
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={component.data.imageUrl || ''}
              placeholder="https://exemplo.com/imagem.jpg"
              onChange={(e) => handleUpdate('imageUrl', e.target.value)}
            />
          </div>
        )}

        {component.type === 'stageQuestion' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Pergunta</Label>
              <Textarea
                id="question"
                value={component.data.question || ''}
                placeholder="Digite a pergunta"
                className="min-h-[80px]"
                onChange={(e) => handleUpdate('question', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="multiSelect">Múltipla Escolha</Label>
              <Input
                id="multiSelect"
                type="number"
                min="0"
                max="10"
                value={component.data.multiSelect || 0}
                onChange={(e) => handleUpdate('multiSelect', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-[#8F7A6A]">0 para escolha única, 1+ para múltipla</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
