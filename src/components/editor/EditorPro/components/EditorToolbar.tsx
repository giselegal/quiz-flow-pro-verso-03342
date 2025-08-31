import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Eye, EyeOff, Undo, Redo, Save, Settings } from 'lucide-react';

/**
 * 🛠️ TOOLBAR DO EDITOR OTIMIZADA
 * 
 * Componente modular extraído do EditorPro monolítico
 */

export interface EditorToolbarProps {
  currentStep: number;
  totalSteps: number;
  isPreviewMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  onTogglePreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish: () => void;
  onOpenSettings: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = memo(({
  currentStep,
  totalSteps,
  isPreviewMode,
  canUndo,
  canRedo,
  isSaving,
  onTogglePreview,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onOpenSettings
}) => {
  return (
    <div className="bg-background border-b border-border p-3 flex items-center justify-between">
      {/* Info da etapa */}
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-muted-foreground">
          Etapa {currentStep} de {totalSteps}
        </div>
        
        {/* Indicador de progresso */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalSteps, 5) }, (_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i < currentStep 
                  ? 'bg-primary' 
                  : i === currentStep - 1 
                    ? 'bg-primary/60' 
                    : 'bg-muted'
              )}
            />
          ))}
          {totalSteps > 5 && (
            <span className="text-xs text-muted-foreground ml-1">
              ...+{totalSteps - 5}
            </span>
          )}
        </div>
      </div>

      {/* Controles principais */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview Toggle */}
        <Button
          variant={isPreviewMode ? "default" : "ghost"}
          size="sm"
          onClick={onTogglePreview}
          className={cn(
            "gap-2",
            isPreviewMode && "bg-primary text-primary-foreground"
          )}
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="h-4 w-4" />
              Sair do Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview
            </>
          )}
        </Button>

        {/* Save */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          title="Salvar (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          title="Configurações"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* Publish */}
        <Button
          onClick={onPublish}
          size="sm"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Play className="h-4 w-4" />
          Publicar
        </Button>
      </div>
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;