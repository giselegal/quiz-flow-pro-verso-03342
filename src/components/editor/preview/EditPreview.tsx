
import React from 'react';
import { Block } from '@/types/editor';

interface EditPreviewProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  isPreviewing: boolean;
}

const EditPreview: React.FC<EditPreviewProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  isPreviewing
}) => {
  return (
    <div className="h-full bg-white">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`p-2 border rounded mb-2 cursor-pointer ${
              selectedBlockId === block.id ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => !isPreviewing && onSelectBlock(block.id)}
          >
            <div className="text-sm text-gray-600">Block: {block.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditPreview;
