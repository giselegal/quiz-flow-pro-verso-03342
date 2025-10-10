import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Undo, Redo, Save, Settings } from 'lucide-react';
import EditorNoCodePanel from '@/components/editor/EditorNoCodePanel';

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
    <div className={cn(
      "bg-background border-b border-border p-3 flex items-center justify-between transition-colors",
      isPreviewMode && "bg-green-50 border-green-200"
    )}>
      {/* Info da etapa */}
      <div className="flex items-center gap-4">
        <div className={cn(
          "text-sm font-medium transition-colors",
          isPreviewMode ? "text-green-700" : "text-muted-foreground"
        )}>
          {isPreviewMode ? "🎯 Preview - Etapa" : "Etapa"} {currentStep} de {totalSteps}
          {isPreviewMode && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Visualização de Produção</span>}
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

        {/* NoCode Configuration Panel */}
        <div className="flex items-center border-r border-border pr-2 mr-2">
          <EditorNoCodePanel className="px-3 py-1.5 text-sm rounded-md bg-[#B89B7A] hover:bg-[#A0895B] text-white transition-colors" />
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

        {/* Publication Controls */}
        <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
          <Button
            onClick={onPublish}
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Settings className="h-4 w-4" />
            Publicar
          </Button>
        </div>        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          title="Configurações"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;