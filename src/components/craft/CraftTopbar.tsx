
import React from 'react';
import { useEditor } from '@craftjs/core';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor,
  Settings
} from 'lucide-react';

interface CraftTopbarProps {
  onSave?: (content: string) => void;
}

export const CraftTopbar: React.FC<CraftTopbarProps> = ({ onSave }) => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo()
  }));

  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreview, setIsPreview] = React.useState(false);

  const handleSave = () => {
    const json = query.serialize();
    onSave?.(json);
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
    actions.setOptions(options => options.enabled = !isPreview);
  };

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold">Editor Visual</h1>
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {/* Seletor de dispositivo */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('tablet')}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreview}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isPreview ? 'Editar' : 'Visualizar'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
        >
          <Settings className="w-4 h-4" />
        </Button>

        <Button
          onClick={handleSave}
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
};
