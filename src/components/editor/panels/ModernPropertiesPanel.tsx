import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { BlockDefinition } from '@/config/blockDefinitionsClean';
import { PropertyField } from './PropertyField';

interface ModernPropertiesPanelProps {
  selectedBlock: any | null;
  blockDefinitions: BlockDefinition[];
  onClose: () => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const ModernPropertiesPanel: React.FC<ModernPropertiesPanelProps> = ({
  selectedBlock,
  blockDefinitions,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!selectedBlock) {
    return (
      <div className="p-4 text-center text-[#432818]/60">
        Selecione um componente para editar suas propriedades
      </div>
    );
  }

  const blockDefinition = blockDefinitions.find(def => def.type === selectedBlock.type);

  if (!blockDefinition || !blockDefinition.properties) {
    return (
      <div className="p-4 text-center text-[#432818]/60">
        Definição de bloco não encontrada para o tipo: {selectedBlock.type}
      </div>
    );
  }

  const updateBlockProperty = (key: string, value: any) => {
    const updatedProperties = {
      ...selectedBlock.properties,
      [key]: value,
    };

    onUpdate(selectedBlock.id, { properties: updatedProperties });
  };

  const renderPropertyFields = (properties: any[], group: string) => {
    return properties
      .filter(prop => prop.group === group)
      .map((property: any) => (
        <PropertyField
          key={property.key}
          property={property}
          value={selectedBlock.properties[property.key]}
          onChange={(value) => updateBlockProperty(property.key, value)}
        />
      ));
  };

  return (
    <div className="h-full p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#432818]">Propriedades</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="style">Estilo</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <Card className="p-4 space-y-4">
            {renderPropertyFields(blockDefinition.properties, 'content')}
          </Card>
        </TabsContent>
        <TabsContent value="style">
          <Card className="p-4 space-y-4">
            {renderPropertyFields(blockDefinition.properties, 'style')}
          </Card>
        </TabsContent>
        <TabsContent value="layout">
          <Card className="p-4 space-y-4">
            {renderPropertyFields(blockDefinition.properties, 'layout')}
          </Card>
        </TabsContent>
        <TabsContent value="advanced">
          <Card className="p-4 space-y-4">
            {renderPropertyFields(blockDefinition.properties, 'advanced')}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
