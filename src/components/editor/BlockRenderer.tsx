import React from 'react';
import { EditorBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import * as CustomBlocks from './blocks';

export interface BlockRendererProps {
  blocks: EditorBlock[];
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  blocks,
  onUpdate,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {blocks.map(block => {
        const renderBlock = () => {
          switch (block.type) {
            default:
              // Render automático para blocos em src/components/editor/blocks
              const kebabToPascal = (str: string) =>
                str
                  .split('-')
                  .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                  .join('');
              const componentName = `${kebabToPascal(block.type)}Block`;
              const DynamicBlock: any = (CustomBlocks as any)[componentName];
              if (DynamicBlock) {
                return (
                  <DynamicBlock
                    block={block}
                    isSelected={isSelected}
                    onClick={onSelect}
                    onPropertyChange={(key: string, value: any) =>
                      onUpdate({ content: { ...block.content, [key]: value } })
                    }
                  />
                );
              }
              return (
                <div className="py-4 text-center text-gray-500">
                  <p>Tipo de bloco: {block.type}</p>
                </div>
              );
          }
        };

        return (
          <div key={block.id}>
            {renderBlock()}
          </div>
        );
      })}
    </div>
  );
};
