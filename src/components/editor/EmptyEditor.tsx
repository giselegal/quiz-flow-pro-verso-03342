import { AddBlockButton } from './AddBlockButton';
import { EditorBlock } from '@/types/editor';

interface EmptyEditorProps {
  onAddBlock: (type: EditorBlock['type']) => void;
}

export const EmptyEditor: React.FC<EmptyEditorProps> = ({ onAddBlock }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-[#B89B7A]/40">
      <p className="text-[#8F7A6A] mb-4">Sua página está vazia. Comece adicionando blocos!</p>
      <AddBlockButton onAddBlock={onAddBlock} />
    </div>
  );
};
