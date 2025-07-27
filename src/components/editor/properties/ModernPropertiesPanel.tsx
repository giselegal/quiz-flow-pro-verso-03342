import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorBlock } from '@/types/editor';
import { allBlockDefinitions } from '../../../config/blockDefinitions';
import { ModularPropertiesPanel } from '../../../components/modular/ModularPropertiesPanel';

interface ModernPropertiesPanelProps {
  selectedComponentId: string | null;
  onClose: () => void;
  onUpdate?: (content: any) => void;
  onDelete?: () => void;
  blocks?: EditorBlock[];
}

const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({ 
  selectedComponentId, 
  onClose, 
  onUpdate,
  onDelete,
  blocks 
}) => {
  const selectedBlock = blocks?.find(block => block.id === selectedComponentId);

  if (!selectedComponentId || !selectedBlock) {
    return (
      <div className="h-full p-4 bg-white">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-playfair text-[#432818]">Propriedades</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-[#8F7A6A] text-sm">
          <p>Selecione um componente para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  // Find the block definition for schema
  const blockDefinition = allBlockDefinitions.find(def => def.type === selectedBlock.type);

  return (
    <div className="h-full p-4 bg-white overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-lg font-playfair text-[#432818]">Propriedades</h2>
          <p className="text-sm text-[#8F7A6A]">{blockDefinition?.name || selectedBlock.type}</p>
        </div>
        <div className="flex gap-2">
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete}>
              Excluir
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {blockDefinition && (
        <ModularPropertiesPanel
          schema={blockDefinition.propertiesSchema || []}
          values={selectedBlock.content || selectedBlock.properties || {}}
          onChange={onUpdate || (() => {})}
        />
      )}
      
      {!blockDefinition && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Esquema de propriedades não encontrado para o tipo: {selectedBlock.type}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModernPropertiesPanel;
