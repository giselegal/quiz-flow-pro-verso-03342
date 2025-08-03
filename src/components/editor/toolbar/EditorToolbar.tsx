import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Undo, 
  Redo,
  Smartphone, 
  Tablet, 
  Monitor, 
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  viewportSize?: 'sm' | 'md' | 'lg' | 'xl';
  onViewportSizeChange?: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  isPreviewing,
  onTogglePreview,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  viewportSize = 'lg',
  onViewportSizeChange = () => {}
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-b border-white/20 p-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-3">
        {onUndo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer"
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </Button>
        )}
        
        {onRedo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer"
            className="text-white hover:bg-white/20 disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </Button>
        )}

        <div className="h-6 w-px bg-white/30 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-white hover:bg-white/20 transition-all",
            viewportSize === 'sm' && "bg-white/30 shadow-md"
          )}
          onClick={() => onViewportSizeChange('sm')}
          title="Mobile"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-white hover:bg-white/20 transition-all",
            viewportSize === 'md' && "bg-white/30 shadow-md"
          )}
          onClick={() => onViewportSizeChange('md')}
          title="Tablet"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-white hover:bg-white/20 transition-all",
            viewportSize === 'lg' && "bg-white/30 shadow-md"
          )}
          onClick={() => onViewportSizeChange('lg')}
          title="Desktop"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-white hover:bg-white/20 transition-all",
            viewportSize === 'xl' && "bg-white/30 shadow-md"
          )}
          onClick={() => onViewportSizeChange('xl')}
          title="Desktop Large"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline" 
          size="sm"
          onClick={onTogglePreview}
          className="border-white/30 text-white hover:bg-white/20 bg-transparent"
        >
          {isPreviewing ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Editar
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </>
          )}
        </Button>
        
        <Button
          onClick={onSave}
          size="sm"
          className="bg-white text-purple-600 hover:bg-gray-100 font-medium px-6"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>
    </div>
  );
};