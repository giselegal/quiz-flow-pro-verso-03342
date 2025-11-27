import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizComponentData } from '@/types/quizBuilder';
import { Trash2 } from 'lucide-react';
import SinglePropertiesPanel from '@/components/editor/properties/SinglePropertiesPanel';

interface PropertiesPanelProps {
  selectedComponentId: string | null;
  components: QuizComponentData[];
  onUpdate: (id: string, data: Partial<QuizComponentData['data']>) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponentId,
  components,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const component = useMemo(
    () => components.find(c => c.id === selectedComponentId) || null,
    [components, selectedComponentId],
  );

  if (!selectedComponentId) {
    return (
      <div className="p-4 text-center text-[#432818]/60">
        Selecione um componente para editar suas propriedades
      </div>
    );
  }

  if (!component) {
    return <div className="p-4 text-center text-[#432818]/60">Componente não encontrado</div>;
  }

  const blockLike = {
    id: component.id,
    type: component.type as any,
    content: component.data || {},
    properties: {},
    order: 0,
  } as any;

  const handleUpdate = (updates: Record<string, any>) => {
    onUpdate(component.id, {
      ...(component.data || {}),
      ...updates,
    });
  };

  return (
    <div className="h-full p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-[#432818]">Propriedades</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            style={{ color: '#432818' }}
            onClick={() => onDelete(component.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" style={{ color: '#432818' }} onClick={onClose}>
              Fechar
            </Button>
          )}
        </div>
      </div>

      <Card className="p-2 h-[calc(100%-2.5rem)] overflow-hidden">
        <SinglePropertiesPanel selectedBlock={blockLike} onUpdate={handleUpdate} />
      </Card>
    </div>
  );
};
