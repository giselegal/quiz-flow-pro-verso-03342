
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
import { Block } from '@/types/editor';

interface EditorToolbarProps {
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onUndo?: () => Block[];
  onRedo?: () => Block[];
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
    <div className="bg-white border-b border-[#B89B7A]/20 p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {onUndo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer"
            className="text-[#432818]"
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
            className="text-[#432818]"
          >
            <Redo className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-[#432818]",
            viewportSize === 'sm' && "bg-[#FAF9F7]"
          )}
          onClick={() => onViewportSizeChange('sm')}
          title="Visualização Mobile"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-[#432818]",
            viewportSize === 'md' && "bg-[#FAF9F7]"
          )}
          onClick={() => onViewportSizeChange('md')}
          title="Visualização Tablet"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-[#432818]",
            viewportSize === 'lg' && "bg-[#FAF9F7]"
          )}
          onClick={() => onViewportSizeChange('lg')}
          title="Visualização Desktop"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-[#432818]",
            viewportSize === 'xl' && "bg-[#FAF9F7]"
          )}
          onClick={() => onViewportSizeChange('xl')}
          title="Visualização Desktop Grande"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline" 
          size="sm"
          onClick={onTogglePreview}
          className="text-[#432818]"
        >
          {isPreviewing ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Editar
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </>
          )}
        </Button>
        
        <Button
          onClick={onSave}
          size="sm"
          className="bg-[#B89B7A] hover:bg-[#A38A69] text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>
    </div>
  );
};
