import * as React from 'react';
import { EDITOR_BLOCKS_MAP } from '../../config/editorBlocksMapping21Steps';

interface BlockMappingDebugProps {
  blocks: any[];
}

export const BlockMappingDebug: React.FC<BlockMappingDebugProps> = ({ blocks }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50 text-xs">
      <h4 className="font-bold mb-2 text-red-600">🔍 Block Mapping Debug</h4>
      
      <div className="mb-2">
        <strong>Total de blocos recebidos:</strong> {blocks.length}
      </div>

      <div className="mb-2">
        <strong>Tipos de bloco mapeados:</strong> {Object.keys(EDITOR_BLOCKS_MAP).length}
      </div>

      <div className="space-y-1">
        {blocks.map((block, index) => {
          const hasComponent = !!EDITOR_BLOCKS_MAP[block.type];
          return (
            <div key={block.id} className={`p-1 rounded ${hasComponent ? 'bg-green-50' : 'bg-red-50'}`}>
              <span className={hasComponent ? 'text-green-600' : 'text-red-600'}>
                {hasComponent ? '✅' : '❌'}
              </span>
              <span className="ml-1">
                {index + 1}. {block.type} ({block.id})
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-gray-500 text-xs">
        <details>
          <summary>Tipos mapeados disponíveis:</summary>
          <div className="mt-1 space-y-1">
            {Object.keys(EDITOR_BLOCKS_MAP).map(type => (
              <div key={type} className="text-green-600">• {type}</div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};
