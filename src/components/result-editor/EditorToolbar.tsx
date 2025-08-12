import { Button } from '@/components/ui/button';
import { Save, Eye, RefreshCw, Palette } from 'lucide-react';
import { JsonConfigEditor } from './JsonConfigEditor';

interface EditorToolbarProps {
  onSave: () => void;
  isPreviewMode: boolean;
  onPreviewToggle: () => void;
  onReset: () => void;
  onEditGlobalStyles: () => void;
  resultPageConfig: any;
  onUpdateConfig: (config: any) => void;
  onShowTemplates?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  isPreviewMode,
  onPreviewToggle,
  onReset,
  onEditGlobalStyles,
  resultPageConfig,
  onUpdateConfig,
  onShowTemplates,
}) => {
  return (
    <div className="border-b border-[#B89B7A]/20 p-4 bg-white flex items-center justify-between">
      <div className="flex items-center gap-2">
        {onShowTemplates && (
          <Button variant="outline" onClick={onShowTemplates} className="text-[#8F7A6A]">
            Modelos de Página
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onPreviewToggle}>
          <Eye className="w-4 h-4 mr-2" />
          {isPreviewMode ? 'Modo Edição' : 'Visualizar'}
        </Button>

        <Button variant="outline" size="sm" onClick={onEditGlobalStyles}>
          <Palette className="w-4 h-4 mr-2" />
          Estilos Globais
        </Button>

        {resultPageConfig && onUpdateConfig && (
          <JsonConfigEditor config={resultPageConfig} onUpdate={onUpdateConfig} />
        )}

        <Button variant="outline" size="sm" onClick={onReset} style={{ color: '#6B4F43' }}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Resetar
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          className="bg-[#B89B7A] hover:bg-[#8F7A6A]"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
