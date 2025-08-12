import { Button } from '@/components/ui/button';
import { Save, Eye, Undo, Redo } from 'lucide-react';

interface EditorToolbarProps {
  onSave?: () => void;
  onPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onPreview,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white">
      <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
        <Undo className="w-4 h-4" />
      </Button>

      <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
        <Redo className="w-4 h-4" />
      </Button>

      <div className="flex-1" />

      <Button variant="outline" size="sm" onClick={onPreview}>
        <Eye className="w-4 h-4 mr-2" />
        Preview
      </Button>

      <Button size="sm" onClick={onSave}>
        <Save className="w-4 h-4 mr-2" />
        Salvar
      </Button>
    </div>
  );
};
