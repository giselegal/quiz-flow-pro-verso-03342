import React, { useMemo } from 'react';
import { Block } from '@/types/editor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, X, Eye } from 'lucide-react';
import { HeaderPropertyEditor } from './editors/HeaderPropertyEditor';
import { getBlockEditorConfig } from './PropertyEditorRegistry';
import { cn } from '@/lib/utils';

interface PropertiesPanelProps {
  /** Bloco atualmente selecionado */
  selectedBlock?: Block | null;
  /** Callback para atualizar propriedades do bloco */
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  /** Callback para fechar o painel */
  onClose?: () => void;
  /** Callback para deletar o bloco */
  onDelete?: (blockId: string) => void;
  /** Se está em modo preview */
  isPreviewMode?: boolean;
  /** Callback para alternar preview */
  onTogglePreview?: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
  isPreviewMode = false,
  onTogglePreview,
}) => {
  const blockConfig = useMemo(() => {
    return selectedBlock ? getBlockEditorConfig(selectedBlock.type) : null;
  }, [selectedBlock?.type]);

  const handleUpdate = (updates: Record<string, any>) => {
    if (selectedBlock && onUpdate) {
      onUpdate(selectedBlock.id, updates);
    }
  };

  const handleDelete = () => {
    if (selectedBlock && onDelete) {
      onDelete(selectedBlock.id);
    }
  };

  // Estado vazio - nenhum bloco selecionado
  if (!selectedBlock) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <Settings className="h-12 w-12 text-[#B89B7A] mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-[#6B4F43]">Propriedades</h3>
              <p className="text-sm text-[#8B7355] mt-1">
                Selecione um bloco no editor para configurar suas propriedades
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar editor específico baseado no tipo
  const renderEditor = () => {
    // Para tipos válidos do BlockType
    switch (selectedBlock.type) {
      case 'header':
        return (
          <HeaderPropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        );
      
      default:
        // Para todos os outros tipos (incluindo question, options, navigation)
        const isKnownType = ['question', 'options', 'text', 'button', 'navigation'].includes(selectedBlock.type);
        
        if (isKnownType) {
          return (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#B89B7A]" />
                  Propriedades: {selectedBlock.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Editor para <strong>{selectedBlock.type}</strong> ainda não implementado.
                    <br />
                    <span className="text-xs text-yellow-600 mt-1 block">
                      Será implementado na próxima fase do desenvolvimento.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        } else {
          return (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#B89B7A]" />
                  Propriedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    ❌ Tipo de bloco <strong>"{selectedBlock.type}"</strong> não reconhecido.
                    <br />
                    <span className="text-xs text-red-600 mt-1 block">
                      Verifique se o tipo está configurado no PropertyEditorRegistry.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header do painel */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#B89B7A]" />
          <h2 className="font-semibold text-[#6B4F43]">Propriedades</h2>
          {blockConfig && (
            <span className="text-xs bg-[#E5DDD5] text-[#6B4F43] px-2 py-1 rounded">
              {selectedBlock.type}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {onTogglePreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePreview}
              className={cn(
                "h-8 w-8 p-0",
                isPreviewMode && "bg-[#E5DDD5]"
              )}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Conteúdo do editor */}
      <div className="flex-1 overflow-auto">
        {renderEditor()}
      </div>

      {/* Footer com ações */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#8B7355]">
            ID: {selectedBlock.id}
          </div>
          
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="text-xs"
            >
              Excluir Bloco
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
