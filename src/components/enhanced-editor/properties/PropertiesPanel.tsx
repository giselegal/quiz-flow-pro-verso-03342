
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Settings } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  content?: {
    title?: string;
    subtitle?: string;
    text?: string;
    imageUrl?: string;
    imageAlt?: string;
    buttonText?: string;
    buttonUrl?: string;
    [key: string]: any;
  };
  properties?: Record<string, any>;
}

interface PropertiesPanelProps {
  selectedBlock?: Block | null;
  onClose?: () => void;
  onUpdate?: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedBlock,
  onClose,
  onUpdate,
  onDelete,
  className = ''
}) => {
  if (!selectedBlock) {
    return (
      <div className={`h-full bg-gray-50 border-l border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">Selecione um bloco para editar suas propriedades</p>
          </div>
        </div>
      </div>
    );
  }

  const handleContentChange = (key: string, value: any) => {
    if (onUpdate && selectedBlock) {
      onUpdate(selectedBlock.id, {
        content: {
          ...selectedBlock.content,
          [key]: value
        }
      });
    }
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (onUpdate && selectedBlock) {
      onUpdate(selectedBlock.id, {
        properties: {
          ...selectedBlock.properties,
          [key]: value
        }
      });
    }
  };

  const content = selectedBlock.content || {};

  return (
    <div className={`h-full bg-white border-l border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-gray-900">Propriedades do Bloco</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Block Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informações do Bloco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-500">Tipo</Label>
              <p className="text-sm font-medium">{selectedBlock.type}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-500">ID</Label>
              <p className="text-xs text-gray-600 font-mono">{selectedBlock.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Content Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            {content.title !== undefined && (
              <div>
                <Label htmlFor="title" className="text-sm">Título</Label>
                <Input
                  id="title"
                  value={content.title || ''}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  placeholder="Digite o título..."
                />
              </div>
            )}

            {/* Subtitle */}
            {content.subtitle !== undefined && (
              <div>
                <Label htmlFor="subtitle" className="text-sm">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={content.subtitle || ''}
                  onChange={(e) => handleContentChange('subtitle', e.target.value)}
                  placeholder="Digite o subtítulo..."
                />
              </div>
            )}

            {/* Text */}
            {content.text !== undefined && (
              <div>
                <Label htmlFor="text" className="text-sm">Texto</Label>
                <Textarea
                  id="text"
                  value={content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  placeholder="Digite o texto..."
                  rows={4}
                />
              </div>
            )}

            {/* Image URL */}
            {content.imageUrl !== undefined && (
              <div>
                <Label htmlFor="imageUrl" className="text-sm">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={content.imageUrl || ''}
                  onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            )}

            {/* Image Alt */}
            {content.imageAlt !== undefined && (
              <div>
                <Label htmlFor="imageAlt" className="text-sm">Texto Alternativo</Label>
                <Input
                  id="imageAlt"
                  value={content.imageAlt || ''}
                  onChange={(e) => handleContentChange('imageAlt', e.target.value)}
                  placeholder="Descrição da imagem..."
                />
              </div>
            )}

            {/* Button Text */}
            {content.buttonText !== undefined && (
              <div>
                <Label htmlFor="buttonText" className="text-sm">Texto do Botão</Label>
                <Input
                  id="buttonText"
                  value={content.buttonText || ''}
                  onChange={(e) => handleContentChange('buttonText', e.target.value)}
                  placeholder="Clique aqui..."
                />
              </div>
            )}

            {/* Button URL */}
            {content.buttonUrl !== undefined && (
              <div>
                <Label htmlFor="buttonUrl" className="text-sm">URL do Botão</Label>
                <Input
                  id="buttonUrl"
                  value={content.buttonUrl || ''}
                  onChange={(e) => handleContentChange('buttonUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {onDelete && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(selectedBlock.id)}
                className="w-full"
              >
                Excluir Bloco
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
