import React from 'react';
import { Button } from '@/components/ui/button';
import { blockDefinitions } from '../../../config/blockDefinitions.ts';

interface SimpleSidebarProps {
  onComponentSelect: (type: string) => void;
}

export const SimpleSidebar: React.FC<SimpleSidebarProps> = ({ onComponentSelect }) => {
  console.log('SimpleSidebar - Total blocks:', blockDefinitions.length);

  return (
    <div className="h-full p-4 bg-white border-r">
      <h2 className="font-bold text-lg mb-4">Blocos Disponíveis</h2>
      <p className="text-sm text-gray-600 mb-4">Total: {blockDefinitions.length} blocos</p>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {blockDefinitions.slice(0, 10).map((block: any) => (
          <Button
            key={block.id}
            variant="outline"
            className="w-full text-left justify-start"
            onClick={() => onComponentSelect(block.type)}
          >
            {block.name}
          </Button>
        ))}
      </div>
      
      {blockDefinitions.length > 10 && (
        <p className="text-xs text-gray-500 mt-2">
          Mostrando apenas os primeiros 10 blocos de {blockDefinitions.length}
        </p>
      )}
    </div>
  );
};
