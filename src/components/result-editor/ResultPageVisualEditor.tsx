
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BlockType, EditorBlock } from '@/types/editor';
import EditableBlock from './EditableBlock';

interface ResultPageVisualEditorProps {
  blocks: EditorBlock[];
  onBlocksUpdate: (blocks: EditorBlock[]) => void;
  selectedBlockId?: string;
  onSelectBlock: (id: string) => void;
}

export const ResultPageVisualEditor: React.FC<ResultPageVisualEditorProps> = ({
  blocks,
  onBlocksUpdate,
  selectedBlockId,
  onSelectBlock
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addBlock = (type: string) => {
    const newBlock: EditorBlock = {
      id: `block-${Date.now()}`,
      type: type as BlockType,
      content: getDefaultContent(type as BlockType),
      order: blocks.length,
      properties: {}
    };

    onBlocksUpdate([...blocks, newBlock]);
  };

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case 'header':
        return { title: 'Novo Cabeçalho', subtitle: 'Subtítulo' };
      case 'text':
        return { text: 'Novo texto. Clique para editar.' };
      case 'image':
        return { imageUrl: '', imageAlt: 'Imagem', description: '' };
      case 'button':
        return { buttonText: 'Clique aqui', buttonUrl: '#' };
      case 'benefits':
        return { 
          title: 'Benefícios',
          items: ['Benefício 1', 'Benefício 2', 'Benefício 3']
        };
      default:
        return { text: `Novo ${type}` };
    }
  };

  const updateBlock = (id: string, content: any) => {
    const updatedBlocks = blocks.map(block =>
      block.id === id ? { ...block, content: { ...block.content, ...content } } : block
    );
    onBlocksUpdate(updatedBlocks);
  };

  const deleteBlock = (id: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== id);
    onBlocksUpdate(updatedBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    
    // Update order property
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }));
    
    onBlocksUpdate(updatedBlocks);
  };

  return (
    <div className="result-page-visual-editor">
      <div className="toolbar mb-4 flex gap-2">
        <Button onClick={() => addBlock('header')} size="sm">
          + Cabeçalho
        </Button>
        <Button onClick={() => addBlock('text')} size="sm">
          + Texto
        </Button>
        <Button onClick={() => addBlock('image')} size="sm">
          + Imagem
        </Button>
        <Button onClick={() => addBlock('button')} size="sm">
          + Botão
        </Button>
        <Button onClick={() => addBlock('benefits')} size="sm">
          + Benefícios
        </Button>
      </div>

      <div className="blocks-container space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">Nenhum bloco adicionado ainda</p>
            <Button onClick={() => addBlock('text')}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar primeiro bloco
            </Button>
          </div>
        ) : (
          blocks.map((block, index) => (
            <EditableBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onSelectBlock(block.id)}
              onUpdate={(content) => updateBlock(block.id, content)}
              onDelete={() => deleteBlock(block.id)}
              onMove={(direction) => {
                if (direction === 'up' && index > 0) {
                  moveBlock(index, index - 1);
                } else if (direction === 'down' && index < blocks.length - 1) {
                  moveBlock(index, index + 1);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ResultPageVisualEditor;
