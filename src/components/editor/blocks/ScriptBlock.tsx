import React from 'react';
import { Code } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

const ScriptBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const {
    code = '// Seu código JavaScript aqui...',
    placement = 'body-end'
  } = block.properties;

  return (
    <div
      className={`
        py-6 bg-gray-800 text-white rounded-lg p-4 font-mono text-sm overflow-auto max-h-48 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-1 ring-gray-400/40 bg-gray-50/30' 
          : 'hover:shadow-sm'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        <Code className="w-4 h-4" />
        <span>Bloco de Script ({placement || 'body-end'})</span>
      </div>
      <pre className="whitespace-pre-wrap break-all text-gray-200">
        {code || '// Seu código JavaScript aqui...'}
      </pre>
      <p className="text-xs text-gray-500 mt-2">
        Este código será injetado na página publicada.
      </p>
    </div>
  );
};

export default ScriptBlock;
