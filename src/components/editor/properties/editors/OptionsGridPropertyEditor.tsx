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
import { Grid3X3, ImageIcon, Settings } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PropertyArrayEditor } from '../components/PropertyArrayEditor';
import { PropertyEditorProps } from '../interfaces/PropertyEditor';

export const OptionsGridPropertyEditor: React.FC<PropertyEditorProps> = ({
  block,
  onUpdate,
  onValidate,
  isPreviewMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'options' | 'layout' | 'style'>('options');

  const handlePropertyChange = useCallback(
    (propertyName: string, value: any) => {
      onUpdate({ [propertyName]: value });

      // Validação: lista de opções é obrigatória
      const isValid =
        propertyName === 'options'
          ? Array.isArray(value) && value.length > 0
          : (Array.isArray(block.properties?.options) && block.properties.options.length > 0) ||
          propertyName !== 'options';
      onValidate?.(isValid);
    },
    [onUpdate, onValidate, block.properties?.options]
  );

  if (isPreviewMode) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Preview mode - properties editing disabled</p>
      </div>
    );
  }

  const currentOptions = block.properties?.options || [];
  const validityFlag = block.properties?.__isValid;
  const columns = block.properties?.columns || 2;
  const layoutOrientation = block.properties?.layoutOrientation || 'vertical';
  const contentType = block.properties?.contentType || 'text-and-image';
  const showImages = block.properties?.showImages !== false;
  const minSelections = block.properties?.minSelections || 3;
  const maxSelections = block.properties?.maxSelections || currentOptions.length;
  const selectionStyle = block.properties?.selectionStyle || 'border';
  const selectedColor = block.properties?.selectedColor || '#B89B7A';
  const hoverColor = block.properties?.hoverColor || '#D4C2A8';

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Grid3X3 className="h-5 w-5 text-primary" />
          Propriedades da Grade de Opções
        </CardTitle>

        {/* Tabs de Navegação */}
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === 'options' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('options')}
            className="flex-1 text-xs h-8"
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            Opções
          </Button>
          <Button
            variant={activeTab === 'layout' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('layout')}
            className="flex-1 text-xs h-8"
          >
            <Grid3X3 className="h-3 w-3 mr-1" />
            Layout
          </Button>
          <Button
            variant={activeTab === 'style' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('style')}
            className="flex-1 text-xs h-8"
          >
            <Settings className="h-3 w-3 mr-1" />
            Estilo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {activeTab === 'options' && (
          <div className="space-y-4">
            {/* Seção de Configuração Visual */}
            <div className="p-4 bg-card border rounded-lg">
              <h4 className="text-sm font-medium mb-3 text-foreground">Configuração Visual</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-medium">Colunas</Label>
                  <Select
                    value={String(columns)}
                    onValueChange={value => handlePropertyChange('columns', parseInt(value))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Coluna</SelectItem>
                      <SelectItem value="2">2 Colunas</SelectItem>
                      <SelectItem value="3">3 Colunas</SelectItem>
                      <SelectItem value="4">4 Colunas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium">Direção</Label>
                  <Select
                    value={layoutOrientation}
                    onValueChange={value => handlePropertyChange('layoutOrientation', value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium">Tipo</Label>
                  <Select
                    value={contentType}
                    onValueChange={value => handlePropertyChange('contentType', value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-and-image">Imagem+Texto</SelectItem>
                      <SelectItem value="image-only">Só Imagem</SelectItem>
                      <SelectItem value="text-only">Só Texto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Lista de Opções com Layout Atualizado */}
            <PropertyArrayEditor
              label="Lista de Opções"
              value={currentOptions}
              onChange={value => handlePropertyChange('options', value)}
              itemLabel="Opção"
              maxItems={12}
              required={true}
              showImages={showImages}
              showDescriptions={true}
              layout="detailed"
            />
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Imagem Position</Label>
                <Select
                  value={block.properties?.imagePosition || 'top'}
                  onValueChange={value => handlePropertyChange('imagePosition', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Acima</SelectItem>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                    <SelectItem value="background">Fundo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Tamanho da Imagem (px)</Label>
                <Select
                  value={String(block.properties?.imageSize || 256)}
                  onValueChange={value => handlePropertyChange('imageSize', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">Pequeno (128px)</SelectItem>
                    <SelectItem value="256">Médio (256px)</SelectItem>
                    <SelectItem value="384">Grande (384px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Min. Seleções</Label>
                <Select
                  value={String(minSelections)}
                  onValueChange={value => handlePropertyChange('minSelections', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Seleção</SelectItem>
                    <SelectItem value="2">2 Seleções</SelectItem>
                    <SelectItem value="3">3 Seleções</SelectItem>
                    <SelectItem value="4">4 Seleções</SelectItem>
                    <SelectItem value="5">5 Seleções</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Max. Seleções</Label>
                <Select
                  value={String(maxSelections)}
                  onValueChange={value => handlePropertyChange('maxSelections', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: Math.max(currentOptions.length, 8) },
                      (_, i) => i + 1
                    ).map(num => (
                      <SelectItem key={num} value={String(num)}>
                        {num} Seleções
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ✨ NOVAS PROPRIEDADES IMPLEMENTADAS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Seleção Múltipla</Label>
                <Select
                  value={String(block.properties?.multipleSelection !== false)}
                  onValueChange={value => handlePropertyChange('multipleSelection', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Permitir</SelectItem>
                    <SelectItem value="false">Única seleção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Largura do Container (px)</Label>
                <Select
                  value={String(block.properties?.containerWidth || 'auto')}
                  onValueChange={value => handlePropertyChange('containerWidth', value === 'auto' ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automática</SelectItem>
                    <SelectItem value="600">600px</SelectItem>
                    <SelectItem value="800">800px</SelectItem>
                    <SelectItem value="1000">1000px</SelectItem>
                    <SelectItem value="1200">1200px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Espaçamento Grid (px)</Label>
                <Select
                  value={String(block.properties?.spacing || block.properties?.gap || 16)}
                  onValueChange={value => handlePropertyChange('spacing', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8px</SelectItem>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                    <SelectItem value="32">32px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Margem Inferior (px)</Label>
                <Select
                  value={String(block.properties?.marginBottom || 24)}
                  onValueChange={value => handlePropertyChange('marginBottom', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0px</SelectItem>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                    <SelectItem value="32">32px</SelectItem>
                    <SelectItem value="48">48px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Espaçamento (px)</Label>
                <Select
                  value={String(block.properties?.gap || 16)}
                  onValueChange={value => handlePropertyChange('gap', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                    <SelectItem value="32">32px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Arredondamento (px)</Label>
                <Select
                  value={String(block.properties?.cardRadius || 12)}
                  onValueChange={value => handlePropertyChange('cardRadius', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0px (Quadrado)</SelectItem>
                    <SelectItem value="6">6px</SelectItem>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estilo de Seleção */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Estilo de Seleção</Label>
                <Select
                  value={selectionStyle}
                  onValueChange={value => handlePropertyChange('selectionStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="border">Borda</SelectItem>
                    <SelectItem value="background">Fundo</SelectItem>
                    <SelectItem value="shadow">Sombra</SelectItem>
                    <SelectItem value="scale">Escala</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Tipo de Animação</Label>
                <Select
                  value={block.properties?.animationType || 'scale'}
                  onValueChange={value => handlePropertyChange('animationType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scale">Escala</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Deslizar</SelectItem>
                    <SelectItem value="bounce">Pular</SelectItem>
                    <SelectItem value="pulse">Pulsar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cores */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Cor da Borda</Label>
                <input
                  type="color"
                  className="h-9 w-full rounded border border-border bg-background"
                  value={block.properties?.borderColor || '#E5E7EB'}
                  onChange={e => handlePropertyChange('borderColor', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Cor Selecionado</Label>
                <input
                  type="color"
                  className="h-9 w-full rounded border border-border bg-background"
                  value={block.properties?.selectedBorderColor || selectedColor}
                  onChange={e => handlePropertyChange('selectedBorderColor', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Cor Hover</Label>
                <input
                  type="color"
                  className="h-9 w-full rounded border border-border bg-background"
                  value={hoverColor}
                  onChange={e => handlePropertyChange('hoverColor', e.target.value)}
                />
              </div>
            </div>

            {/* Sistema de Pontuação e Validação */}
            <div className="space-y-4 p-4 bg-card border rounded-lg">
              <h4 className="text-sm font-medium mb-3 text-foreground">Sistema de Pontuação & Validação</h4>

              <div>
                <Label className="text-sm font-medium">Sistema de Pontuação</Label>
                <Select
                  value={String(block.properties?.scoring !== false)}
                  onValueChange={value => handlePropertyChange('scoring', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ativado</SelectItem>
                    <SelectItem value="false">Desativado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Mensagem de Validação Personalizada</Label>
                <textarea
                  className="w-full p-2 border rounded-md text-sm resize-none"
                  rows={2}
                  placeholder="Ex: Selecione pelo menos 2 opções para continuar"
                  value={block.properties?.validationMessage || ''}
                  onChange={e => handlePropertyChange('validationMessage', e.target.value || undefined)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe vazio para usar a mensagem automática
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
          <h4 className="text-sm font-medium text-foreground mb-3">Preview:</h4>

          <div className="space-y-3">
            {/* Feedback de Validação vindo do canvas inline */}
            {validityFlag === false && (
              <div className="text-xs text-red-700 bg-red-50 p-2 rounded mb-2">
                ⚠️ Seleção inválida: o número de opções selecionadas não atende ao mínimo exigido.
              </div>
            )}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                • Layout: {columns} colunas, {layoutOrientation}
              </div>
              <div>• Conteúdo: {contentType}</div>
              <div>
                • Seleção: {minSelections}-{maxSelections} opções
              </div>
              <div>• Total de opções: {currentOptions.length}</div>
            </div>

            {/* Simulação visual das opções */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.min(columns, 3)}, 1fr)`,
              }}
            >
              {currentOptions.length > 0 ? (
                currentOptions.slice(0, 6).map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className="p-2 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors text-center"
                  >
                    {showImages && (
                      <div className="w-full h-12 bg-muted rounded mb-1 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                    <div className="text-xs font-medium truncate">
                      {item.text || `Opção ${index + 1}`}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
                  Adicione opções para ver o preview
                </div>
              )}
            </div>

            {currentOptions.length > 6 && (
              <div className="text-xs text-muted-foreground text-center">
                ... e mais {currentOptions.length - 6} opções
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
