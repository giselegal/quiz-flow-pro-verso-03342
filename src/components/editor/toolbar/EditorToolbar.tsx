
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, EyeOff, Undo, Redo, Settings } from 'lucide-react';

export interface EditorToolbarProps {
  onSave: () => void;
  canSave: boolean;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onSettings?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  canSave,
  isPreviewing,
  onTogglePreview,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onSettings
}) => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={!canSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        {onUndo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo className="w-4 h-4" />
          </Button>
        )}
        
        {onRedo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo className="w-4 h-4" />
          </Button>
        )}
        
        {onSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
        >
          {isPreviewing ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Edit
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </>
          )}
        </Button>
        
        <Badge variant={isPreviewing ? "default" : "secondary"}>
          {isPreviewing ? "Preview" : "Edit"}
        </Badge>
      </div>
    </div>
  );
};
