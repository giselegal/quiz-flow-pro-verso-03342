
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { PlusIcon, TrashIcon, SettingsIcon } from 'lucide-react';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({ 
  funnelId, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  useEffect(() => {
    if (funnelId) {
      // Load funnel data
      console.log('Loading funnel:', funnelId);
    }
  }, [funnelId]);

  const handleAddBlock = (blockType: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      properties: {}
    };
    setBlocks(prev => [...prev, newBlock]);
    toast({
      title: "Bloco adicionado",
      description: `Bloco ${blockType} foi adicionado com sucesso.`
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
    toast({
      title: "Bloco removido",
      description: "Bloco foi removido com sucesso."
    });
  };

  return (
    <div className={`h-full bg-background ${className}`}>
      <div className="border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Editor Schema-Driven</h1>
            <Badge variant="secondary">
              {blocks.length} blocos
            </Badge>
          </div>
          <Button onClick={() => toast({ title: "Funcionalidade em breve" })}>
            <SettingsIcon className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
            <div className="col-span-1 border-r bg-muted/20 p-4">
              <h3 className="font-semibold mb-4">Componentes</h3>
              <div className="space-y-2">
                {['text', 'heading', 'image', 'button', 'spacer'].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAddBlock(type)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="col-span-2 p-4">
              <h3 className="font-semibold mb-4">Canvas</h3>
              <div className="min-h-[400px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {blocks.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    Adicione componentes para começar a editar
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blocks.map((block: any) => (
                      <Card
                        key={block.id}
                        className={`cursor-pointer transition-all ${
                          selectedBlock === block.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedBlock(block.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">
                              {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBlock(block.id);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-sm text-muted-foreground">
                            Bloco {block.type} - ID: {block.id}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-1 border-l bg-muted/20 p-4">
              <h3 className="font-semibold mb-4">Propriedades</h3>
              {selectedBlock ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="block-id">ID do Bloco</Label>
                    <Input
                      id="block-id"
                      value={selectedBlock}
                      disabled
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Propriedades personalizadas aparecerão aqui</Label>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Selecione um bloco para editar suas propriedades
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="h-full">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Preview do Funnel</h3>
            <div className="border rounded-lg p-8 bg-white">
              <div className="text-center text-muted-foreground">
                Preview será renderizado aqui
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="h-full">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Configurações do Funnel</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="funnel-name">Nome do Funnel</Label>
                <Input
                  id="funnel-name"
                  placeholder="Nome do seu funnel"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="funnel-description">Descrição</Label>
                <Input
                  id="funnel-description"
                  placeholder="Descrição do funnel"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
