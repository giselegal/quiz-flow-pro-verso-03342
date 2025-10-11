// @ts-nocheck
import React, { useState } from 'react';
import { StyleResult, QuizFunnel } from '@/types/quiz';
import { Block, EditorBlock } from '@/types/editor';
import { ResultPageVisualEditor } from './ResultPageVisualEditor';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save, RefreshCw } from 'lucide-react';

interface EnhancedResultPageEditorProps {
  selectedStyle?: StyleResult;
  primaryStyle?: StyleResult;
  secondaryStyles?: StyleResult[];
  initialFunnel?: QuizFunnel;
  onSave?: (funnel: QuizFunnel) => void;
  onShowTemplates?: () => void;
}

export const EnhancedResultPageEditor: React.FC<EnhancedResultPageEditorProps> = ({
  selectedStyle,
  primaryStyle,
  secondaryStyles = [],
  initialFunnel,
  onSave,
  onShowTemplates,
}) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleBlocksUpdate = (updatedBlocks: EditorBlock[]) => {
    setBlocks(updatedBlocks);
  };

  const handleSelectBlock = (id: string) => {
    setSelectedBlockId(id);
  };

  const handleSave = () => {
    console.log('Saving blocks:', blocks);
    if (onSave && initialFunnel) {
      onSave(initialFunnel);
    }
  };

  const handleReset = () => {
    setBlocks([]);
    setSelectedBlockId('');
  };

  const togglePreview = () => {
    setIsPreviewing(!isPreviewing);
  };

  const style = selectedStyle || primaryStyle;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div style={{ borderColor: '#E5DDD5' }}>
        <h2 className="text-xl font-semibold">Editor de Resultados Aprimorado</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={togglePreview}>
            {isPreviewing ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Editar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <ResultPageVisualEditor
          blocks={blocks}
          onBlocksUpdate={handleBlocksUpdate}
          selectedBlockId={selectedBlockId || undefined}
          onSelectBlock={handleSelectBlock}
          selectedStyle={style}
          onShowTemplates={onShowTemplates}
        />
      </div>
    </div>
  );
};

export default EnhancedResultPageEditor;
