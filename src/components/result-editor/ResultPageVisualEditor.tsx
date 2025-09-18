// @ts-nocheck
import { StyleResult } from '@/types/quiz';
import { EditorBlock } from '@/types/editor';

export interface ResultPageVisualEditorProps {
  blocks: EditorBlock[];
  onBlocksUpdate: (blocks: EditorBlock[]) => void;
  selectedBlockId?: string;
  onSelectBlock: (id: string) => void;
  selectedStyle?: StyleResult;
  onShowTemplates?: () => void;
}

export const ResultPageVisualEditor: React.FC<ResultPageVisualEditorProps> = ({
  blocks,
  onBlocksUpdate,
  selectedBlockId,
  onSelectBlock,
  selectedStyle,
  onShowTemplates,
}) => {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div style={{ borderColor: '#E5DDD5' }}>
        <h3 className="text-lg font-semibold mb-4">Blocos</h3>
        <div className="space-y-2">
          <button onClick={onShowTemplates} style={{ backgroundColor: '#FAF9F7' }}>
            + Adicionar Bloco
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg border min-h-96 p-6">
          {blocks.length === 0 ? (
            <div style={{ color: '#8B7355' }}>
              <p>Nenhum bloco adicionado ainda.</p>
              <p>Use o painel da esquerda para adicionar blocos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map(block => (
                <div
                  key={block.id}
                  className={`p-4 border rounded cursor-pointer ${
                    selectedBlockId === block.id
                      ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                      : 'border-gray-200'
                  }`}
                  onClick={() => onSelectBlock(block.id)}
                >
                  <div className="font-medium">{block.type}</div>
                  <div style={{ color: '#8B7355' }}>ID: {block.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPageVisualEditor;
