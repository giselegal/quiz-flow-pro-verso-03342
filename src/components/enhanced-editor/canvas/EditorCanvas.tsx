import { Block } from '@/types/editor';

interface EditorCanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks: (sourceIndex: number, destinationIndex: number) => void;
  isPreviewing: boolean;
  viewportSize: string;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  isPreviewing,
  viewportSize,
}) => {
  return (
    <div className="h-full bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div style={{ color: '#8B7355' }}>
          Viewport: {viewportSize} | Preview: {isPreviewing ? 'On' : 'Off'}
        </div>
        <div className="space-y-4">
          {blocks.map(block => (
            <div
              key={block.id}
              className={`p-4 border rounded cursor-pointer ${
                selectedBlockId === block.id
                  ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                  : 'border-gray-200'
              }`}
              onClick={() => !isPreviewing && onSelectBlock(block.id)}
            >
              <div className="text-sm font-medium">{block.type}</div>
              <div style={{ color: '#8B7355' }}>ID: {block.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
