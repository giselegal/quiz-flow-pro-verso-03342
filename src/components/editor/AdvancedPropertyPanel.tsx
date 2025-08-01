
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, X } from 'lucide-react';
import { EditorBlock } from '@/types/editor';

interface AdvancedPropertyPanelProps {
  selectedBlock: EditorBlock | null;
  onUpdateBlock: (id: string, updates: Partial<EditorBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onClose: () => void;
}

export const 
AdvancedPropertyPanel: React.FC<AdvancedPropertyPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onClose
}) => {
  if (!selectedBlock) {
    return (
      <div className="h-full bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="font-medium mb-2">Propriedades</h3>
          <p className="text-sm">Selecione um bloco para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  const updateContent = (key: string, value: any) => {
    onUpdateBlock(selectedBlock.id, {
      content: { ...selectedBlock.content, [key]: value }
    });
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium">Propriedades do Bloco</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="block-type">Tipo</Label>
              <Input id="block-type" value={selectedBlock.type} disabled />
            </div>
            
            <div>
              <Label htmlFor="block-id">ID</Label>
              <Input id="block-id" value={selectedBlock.id} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Propriedades específicas por tipo */}
        {selectedBlock.type === 'header' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cabeçalho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={selectedBlock.content.title || ''}
                  onChange={(e) => updateContent('title', e.target.value)}
                  placeholder="Digite o título"
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={selectedBlock.content.subtitle || ''}
                  onChange={(e) => updateContent('subtitle', e.target.value)}
                  placeholder="Digite o subtítulo"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedBlock.type === 'text' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Texto</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="text-content">Conteúdo</Label>
                <Textarea
                  id="text-content"
                  value={selectedBlock.content.text || ''}
                  onChange={(e) => updateContent('text', e.target.value)}
                  placeholder="Digite o texto"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedBlock.type === 'image' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Imagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="image-url">URL da Imagem</Label>
                <Input
                  id="image-url"
                  value={selectedBlock.content.imageUrl || ''}
                  onChange={(e) => updateContent('imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="image-alt">Texto Alternativo</Label>
                <Input
                  id="image-alt"
                  value={selectedBlock.content.imageAlt || ''}
                  onChange={(e) => updateContent('imageAlt', e.target.value)}
                  placeholder="Descrição da imagem"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedBlock.type === 'button' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Botão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="button-text">Texto do Botão</Label>
                <Input
                  id="button-text"
                  value={selectedBlock.content.buttonText || ''}
                  onChange={(e) => updateContent('buttonText', e.target.value)}
                  placeholder="Clique aqui"
                />
              </div>
              
              <div>
                <Label htmlFor="button-url">URL</Label>
                <Input
                  id="button-url"
                  value={selectedBlock.content.buttonUrl || ''}
                  onChange={(e) => updateContent('buttonUrl', e.target.value)}
                  placeholder="https://exemplo.com"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedBlock.type === 'quiz-question' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pergunta do Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="question">Pergunta</Label>
                <Textarea
                  id="question"
                  value={selectedBlock.content.question || ''}
                  onChange={(e) => updateContent('question', e.target.value)}
                  placeholder="Digite a pergunta"
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Opções</Label>
                {selectedBlock.content.options?.map((option: any, index: number) => (
                  <div key={option.id || index} className="flex gap-2">
                    <Input
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...(selectedBlock.content.options || [])];
                        newOptions[index] = { ...option, text: e.target.value };
                        updateContent('options', newOptions);
                      }}
                      placeholder={`Opção ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão de deletar */}
        <Card className="border-red-200">
          <CardContent className="pt-4">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDeleteBlock(selectedBlock.id)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar Bloco
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
