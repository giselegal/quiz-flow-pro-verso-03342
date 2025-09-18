import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { styleConfig } from '@/config/styleConfig';
import React, { useState } from 'react';

interface StyleResultsEditorProps {
  selectedStyle: string;
  showAllStyles: boolean;
  showGuideImage: boolean;
  onChange: (config: {
    selectedStyle: string;
    showAllStyles: boolean;
    showGuideImage: boolean;
  }) => void;
}

const StyleResultsEditor: React.FC<StyleResultsEditorProps> = ({
  selectedStyle = Object.keys(styleConfig)[0],
  showAllStyles = false,
  showGuideImage = true,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState('style');

  // Lista de estilos disponíveis
  const styleOptions = Object.keys(styleConfig);

  // Função para atualizar a configuração
  const updateConfig = (updates: Partial<StyleResultsEditorProps>) => {
    onChange({
      selectedStyle,
      showAllStyles,
      showGuideImage,
      ...updates,
    });
  };

  // Obter dados do estilo selecionado
  const styleData =
    styleConfig[selectedStyle as keyof typeof styleConfig] ||
    styleConfig[Object.keys(styleConfig)[0] as keyof typeof styleConfig];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="style" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="style" className="flex-1">
            Estilo
          </TabsTrigger>
          <TabsTrigger value="display" className="flex-1">
            Exibição
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Pré-visualização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estilo Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="style-select">Selecione o Estilo</Label>
                <Select
                  value={selectedStyle}
                  onValueChange={value => updateConfig({ selectedStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions
                      .filter(style => style && style !== '')
                      .map(style => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div style={{ backgroundColor: '#FAF9F7' }}>
                <p style={{ color: '#8B7355' }}>Pré-visualização:</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={styleData.image}
                      alt={selectedStyle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedStyle}</h4>
                    <p style={{ color: '#6B4F43' }}>{styleData.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Opções de Exibição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-all-styles">Mostrar Todos os Estilos</Label>
                <Switch
                  id="show-all-styles"
                  checked={showAllStyles}
                  onCheckedChange={checked => updateConfig({ showAllStyles: checked })}
                />
              </div>
              <p style={{ color: '#8B7355' }}>
                Se ativado, mostra todos os estilos e suas pontuações, não apenas os 3 principais
              </p>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-guide-image">Mostrar Imagem do Guia</Label>
                <Switch
                  id="show-guide-image"
                  checked={showGuideImage}
                  onCheckedChange={checked => updateConfig({ showGuideImage: checked })}
                />
              </div>
              <p style={{ color: '#8B7355' }}>
                Se ativado, mostra a imagem do guia de estilo associado ao resultado
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização do Guia</CardTitle>
            </CardHeader>
            <CardContent>
              {styleData.guideImage ? (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={styleData.guideImage}
                    alt={`Guia ${selectedStyle}`}
                    className="w-full object-cover"
                  />
                </div>
              ) : (
                <p style={{ color: '#8B7355' }}>Imagem do guia não disponível para este estilo</p>
              )}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(styleData.guideImage, '_blank')}
                  disabled={!styleData.guideImage}
                >
                  Ver em Tamanho Real
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleResultsEditor;
