
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockType } from '@/types/editor';
import { AVAILABLE_BLOCKS } from '../blocks/BlockComponents';
import {
  Type,
  Heading,
  Image,
  MousePointer,
  Space,
  HelpCircle
} from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: BlockType) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const iconMap = {
    Type,
    Heading,
    Image,
    MousePointer,
    Space,
    HelpCircle
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-medium text-[#432818]">Componentes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Clique nos componentes para adicionar à sua página
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {AVAILABLE_BLOCKS.map((block) => {
            const Icon = iconMap[block.icon as keyof typeof iconMap] || Type;
            return (
              <Button
                key={block.type}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-[#FAF9F7]"
                onClick={() => onComponentSelect(block.type as BlockType)}
              >
                <Icon className="w-4 h-4 text-[#B89B7A]" />
                <span className="text-sm">{block.name}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
