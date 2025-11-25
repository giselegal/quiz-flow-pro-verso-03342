import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Block } from '@/types/editor';
import SinglePropertiesPanel from '@/components/editor/properties/SinglePropertiesPanel';

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onClose,
}) => {
  const block = useMemo(() => {
    if (!selectedBlock) return null;
    return {
      ...selectedBlock,
      content: selectedBlock.content || {},
      properties: selectedBlock.properties || {},
    } as Block;
  }, [selectedBlock]);

  if (!block) {
    return (
      <div className="flex h-full items-center justify-center border-l bg-muted/10 px-4">
        <p className="text-sm text-muted-foreground">
          Selecione um bloco de resultado para editar suas propriedades
        </p>
      </div>
    );
  }

  const handleUpdate = (updates: Record<string, any>) => {
    onUpdateBlock(block.id, updates as Partial<Block>);
  };

  return (
    <div className="flex h-full flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h3 className="text-sm font-semibold">Propriedades do Bloco</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDeleteBlock(block.id)}
          >
            🗑
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <SinglePropertiesPanel block={block} onUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default PropertiesPanel;
export { PropertiesPanel };
