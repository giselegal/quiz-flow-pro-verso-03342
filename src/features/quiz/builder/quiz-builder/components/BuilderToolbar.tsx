// @ts-nocheck
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Save,
  Eye,
  EyeOff,
  Settings,
  Edit,
  Layout,
  FileText,
  DatabaseBackup,
  Share2,
  Play,
  Import,
} from 'lucide-react';

interface BuilderToolbarProps {
  activeView: 'editor' | 'preview';
  isPreviewing: boolean;
  onViewChange: (view: 'editor' | 'preview') => void;
  onPreviewToggle: () => void;
  onSave: () => void;
  onPreviewResultPage?: () => void;
  onImportQuizTemplate: () => void;
}

const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  activeView,
  isPreviewing,
  onViewChange,
  onPreviewToggle,
  onSave,
  onPreviewResultPage,
  onImportQuizTemplate,
}) => {
  return (
    <div className="border-b border-[#333333] bg-[#222222] p-3 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <h1 className="text-lg font-medium text-white mr-6">Editor de Quiz</h1>

        <Tabs
          value={activeView}
          onValueChange={v => onViewChange(v as 'editor' | 'preview')}
          className="w-auto"
        >
          <TabsList className="bg-[#333333]">
            <TabsTrigger
              value="editor"
              className="text-sm text-gray-200 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Construtor
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="text-sm text-gray-200 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Prévia
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onImportQuizTemplate}
          className="text-gray-300 border-[#444444] bg-[#333333] hover:bg-[#444444] hover:text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Importar Quiz
        </Button>

        {activeView === 'editor' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviewToggle}
            className="text-gray-300 border-[#444444] bg-[#333333] hover:bg-[#444444] hover:text-white"
          >
            {isPreviewing ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Editar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </>
            )}
          </Button>
        )}

        {activeView === 'preview' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviewResultPage}
            className="text-gray-300 border-[#444444] bg-[#333333] hover:bg-[#444444] hover:text-white"
          >
            <Layout className="w-4 h-4 mr-2" />
            Visualizar Resultado
          </Button>
        )}

        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>

        <Button variant="default" size="sm" className="bg-[#6E59A5] hover:bg-[#5D48A0] text-white">
          <Share2 className="w-4 h-4 mr-2" />
          Publicar
        </Button>
      </div>
    </div>
  );
};

export default BuilderToolbar;
