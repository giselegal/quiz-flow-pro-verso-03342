
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Eye, EyeOff } from 'lucide-react';

export interface EditorToolbarProps {
  onSave: () => void;
  canSave: boolean;
  canPublish: boolean;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  canSave,
  canPublish,
  isPreviewMode,
  onTogglePreview
}) => {
  return (
    <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Editor</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
        >
          {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isPreviewMode ? 'Edit' : 'Preview'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={!canSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
