import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EditorBlock } from '@/types/editor';
import { X, Trash2 } from 'lucide-react';

interface EnhancedUniversalPropertiesPanelProps {
  selectedBlock: EditorBlock;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onDelete: () => void;
}

export const EnhancedUniversalPropertiesPanel: React.FC<EnhancedUniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
}) => {
  const [localText, setLocalText] = useState(selectedBlock.content?.text || '');
  const [localTitle, setLocalTitle] = useState(selectedBlock.content?.title || '');

  const handleTextChange = (value: string) => {
    setLocalText(value);
    onUpdate({
      content: {
        ...selectedBlock.content,
        text: value,
      },
    });
  };

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    onUpdate({
      content: {
        ...selectedBlock.content,
        title: value,
      },
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Propriedades do Bloco
            </h3>
            <p className="text-sm text-gray-600">
              Tipo: {selectedBlock.type}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto space-y-4">
        {/* Basic Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conteúdo Básico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="block-title">Título</Label>
              <Input
                id="block-title"
                value={localTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Digite o título do bloco"
              />
            </div>

            {/* Text */}
            <div>
              <Label htmlFor="block-text">Texto</Label>
              <Textarea
                id="block-text"
                value={localText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Digite o texto do bloco"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Block Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações do Bloco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">ID:</span> {selectedBlock.id}
            </div>
            <div className="text-sm">
              <span className="font-medium">Tipo:</span> {selectedBlock.type}
            </div>
            <div className="text-sm">
              <span className="font-medium">Ordem:</span> {selectedBlock.order}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Deletar Bloco
        </Button>
      </div>
    </div>
  );
};

export default EnhancedUniversalPropertiesPanel;