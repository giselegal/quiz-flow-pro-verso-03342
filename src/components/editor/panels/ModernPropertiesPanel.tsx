
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { PropertyField } from './PropertyField';
import { blockDefinitions } from '@/config/blockDefinitionsClean';
import { Block } from '@/types/editor';

interface ModernPropertiesPanelProps {
  selectedBlockId: string | null;
  blocks: Block[];
  onClose: () => void;
  onUpdate: (id: string, properties: any) => void;
  onDelete: (id: string) => void;
}

export const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({
  selectedBlockId,
  blocks,
  onClose,
  onUpdate,
  onDelete
}) => {
  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  if (!selectedBlockId || !selectedBlock) {
    return (
      <div className="h-full bg-white border-l border-[#E5E5E5] flex flex-col">
        <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <h2 className="font-medium text-[#1A1818]">Propriedades</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <div className="w-12 h-12 bg-[#FAF9F7] rounded-lg flex items-center justify-center mb-3 mx-auto">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-[#8F7A6A] text-sm">
              Selecione um elemento no canvas para editar suas propriedades
            </p>
          </div>
        </div>
      </div>
    );
  }

  const blockDefinition = blockDefinitions[selectedBlock.type];
  
  if (!blockDefinition) {
    return (
      <div className="h-full bg-white border-l border-[#E5E5E5] flex flex-col">
        <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
          <h2 className="font-medium text-[#1A1818]">Propriedades</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
        </div>
        <div className="p-4">
          <p className="text-[#8F7A6A] text-sm">
            Tipo de bloco não reconhecido: {selectedBlock.type}
          </p>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (propertyPath: string, value: any) => {
    console.log('🔄 Property change:', { blockId: selectedBlockId, propertyPath, value });
    
    // Criar uma cópia das propriedades atuais
    const currentProperties = selectedBlock.properties || {};
    
    // Atualizar a propriedade usando o caminho
    const updatedProperties = { ...currentProperties };
    const keys = propertyPath.split('.');
    
    if (keys.length === 1) {
      updatedProperties[keys[0]] = value;
    } else {
      // Para propriedades aninhadas como 'style.color'
      let current = updatedProperties;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    }
    
    console.log('📝 Updated properties:', updatedProperties);
    
    // Chamar o callback de atualização
    onUpdate(selectedBlockId, updatedProperties);
  };

  const renderPropertyGroups = () => {
    return Object.entries(blockDefinition.properties).map(([groupName, group]) => (
      <Card key={groupName} className="mb-4">
        <div className="p-4">
          <h3 className="font-medium text-[#1A1818] mb-3 capitalize">
            {groupName === 'content' ? 'Conteúdo' :
             groupName === 'style' ? 'Estilo' :
             groupName === 'layout' ? 'Layout' :
             groupName === 'advanced' ? 'Avançado' : groupName}
          </h3>
          
          <div className="space-y-3">
            {Object.entries(group).map(([propertyKey, property]) => {
              const propertyPath = `${groupName}.${propertyKey}`;
              const currentValue = getCurrentValue(selectedBlock.properties, propertyPath);
              
              return (
                <PropertyField
                  key={propertyPath}
                  label={property.label}
                  type={property.type}
                  value={currentValue || property.default}
                  options={property.options}
                  placeholder={property.placeholder}
                  min={property.min}
                  max={property.max}
                  step={property.step}
                  onChange={(value) => handlePropertyChange(propertyPath, value)}
                  help={property.help}
                />
              );
            })}
          </div>
        </div>
      </Card>
    ));
  };

  const getCurrentValue = (properties: any, path: string) => {
    if (!properties) return undefined;
    
    const keys = path.split('.');
    let current = properties;
    
    for (const key of keys) {
      if (current === null || current === undefined) return undefined;
      current = current[key];
    }
    
    return current;
  };

  return (
    <div className="h-full bg-white border-l border-[#E5E5E5] flex flex-col">
      <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center">
        <div>
          <h2 className="font-medium text-[#1A1818]">{blockDefinition.name}</h2>
          <p className="text-xs text-[#8F7A6A] mt-1">{selectedBlock.id}</p>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(selectedBlockId)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderPropertyGroups()}
        </div>
      </ScrollArea>
    </div>
  );
};
