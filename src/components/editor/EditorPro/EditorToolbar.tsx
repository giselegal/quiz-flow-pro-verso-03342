import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Edit,
  Save,
  Undo2,
  Redo2,
  Settings,
  Monitor,
  Smartphone
} from 'lucide-react';

interface EditorToolbarProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = memo(({
  isPreviewMode,
  onTogglePreview,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaving,
  viewMode,
  onViewModeChange
}) => {
  // Debounce para ações que podem ser clicadas rapidamente
  const debouncedSave = useCallback(() => {
    onSave();
  }, [onSave]);

  const debouncedUndo = useCallback(() => {
    onUndo();
  }, [onUndo]);

  const debouncedRedo = useCallback(() => {
    onRedo();
  }, [onRedo]);

  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Preview Toggle */}
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          className="flex items-center gap-2"
        >
          {isPreviewMode ? (
            <>
              <Edit className="h-4 w-4" />
              Editar
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview
            </>
          )}
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={debouncedUndo}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={debouncedRedo}
            disabled={!canRedo}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* View Mode */}
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('desktop')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Badge */}
        {isSaving && (
          <Badge variant="secondary" className="animate-pulse">
            Salvando...
          </Badge>
        )}

        {/* Save Button */}
        <Button
          onClick={debouncedSave}
          disabled={isSaving}
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;