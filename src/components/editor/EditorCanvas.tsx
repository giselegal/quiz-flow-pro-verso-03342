import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { Block } from '@/types/editor';

interface EditorCanvasProps {
  className?: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ className }) => {
  const { state, dispatch } = useEditor();

  const renderBlock = (block: Block) => {
    // Block rendering logic here
    return (
      <div key={block.id} className="editor-block">
        {/* Block content */}
      </div>
    );
  };

  return (
    <div className={`editor-canvas ${className || ''}`}>
      {state.blocks.map(renderBlock)}
    </div>
  );
};
