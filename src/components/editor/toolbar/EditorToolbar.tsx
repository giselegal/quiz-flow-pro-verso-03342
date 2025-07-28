
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  EyeOff, 
  Play,
  Download,
  Upload,
  Settings
} from 'lucide-react';

export interface EditorToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onTogglePreview: () => void;
  onPreview?: () => void;
  isPreviewing: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canSave: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  onTogglePreview,
  onPreview,
  isPreviewing,
  canUndo,
  canRedo,
  canSave
}) => {
  return (
    <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-white">
      <Button
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-8"
      >
        <Undo className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="h-8"
      >
        <Redo className="w-4 h-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePreview}
        className="h-8"
      >
        {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {isPreviewing ? 'Editar' : 'Visualizar'}
      </Button>
      
      {onPreview && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          className="h-8"
        >
          <Play className="w-4 h-4" />
          Testar
        </Button>
      )}
      
      <div className="flex-1" />
      
      <Button
        variant="default"
        size="sm"
        onClick={onSave}
        disabled={!canSave}
        className="h-8"
      >
        <Save className="w-4 h-4 mr-2" />
        Salvar
      </Button>
    </div>
  );
};
