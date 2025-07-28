
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Eye, Undo, Redo, Settings, Download, Upload } from 'lucide-react';

interface EditorToolbarProps {
  onSave?: () => void;
  onPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSettings?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isPreviewMode?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaving?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onPreview,
  onUndo,
  onRedo,
  onSettings,
  onExport,
  onImport,
  isPreviewMode = false,
  canUndo = false,
  canRedo = false,
  isSaving = false
}) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b">
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        disabled={isSaving}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Salvando...' : 'Salvar'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onPreview}
      >
        <Eye className="w-4 h-4 mr-2" />
        {isPreviewMode ? 'Editar' : 'Visualizar'}
      </Button>
      
      <div className="w-px h-6 bg-gray-300" />
      
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <Undo className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
      >
        <Redo className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300" />
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
      >
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onImport}
      >
        <Upload className="w-4 h-4 mr-2" />
        Importar
      </Button>
      
      <div className="ml-auto" />
      
      <Button
        variant="outline"
        size="sm"
        onClick={onSettings}
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};
