import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Undo, 
  Redo, 
  Rocket,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

export interface FunnelNavbarProps {
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  viewportSize: 'sm' | 'md' | 'lg' | 'xl';
  onViewportSizeChange: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
}

const FunnelNavbar: React.FC<FunnelNavbarProps> = ({
  onSave,
  onPublish,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isPreviewing,
  onTogglePreview,
  viewportSize,
  onViewportSizeChange,
}) => {
  const getViewportIcon = (size: string) => {
    switch (size) {
      case 'sm': return <Smartphone className="w-4 h-4" />;
      case 'md': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left: Undo/Redo */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Center: Viewport controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Button
                key={size}
                variant={viewportSize === size ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewportSizeChange(size)}
                className="h-8 w-8 p-0"
              >
                {getViewportIcon(size)}
              </Button>
            ))}
          </div>
        </div>

        {/* Right: Preview & Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant={isPreviewing ? "default" : "outline"}
            size="sm"
            onClick={onTogglePreview}
            title="Alternar Preview"
          >
            {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreviewing ? 'Editar' : 'Preview'}
          </Button>
          
          <div className="h-4 w-px bg-gray-300" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            title="Salvar (Ctrl+S)"
          >
            <Save className="w-4 h-4 mr-1" />
            Salvar
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onPublish}
            title="Publicar"
          >
            <Rocket className="w-4 h-4 mr-1" />
            Publicar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FunnelNavbar;