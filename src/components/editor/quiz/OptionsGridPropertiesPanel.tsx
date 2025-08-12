import { ColorPicker } from '@/components/editor/shared/ColorPicker';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptionsGridProperties } from '@/config/optionsGridPropertiesMapping';

interface OptionsGridPropertiesPanelProps {
  properties: OptionsGridProperties;
  onPropertyChange: (property: keyof OptionsGridProperties, value: any) => void;
  onValidationError?: (errors: string[]) => void;
}

export const OptionsGridPropertiesPanel = ({
  properties,
  onPropertyChange,
  onValidationError
}: OptionsGridPropertiesPanelProps) => {
  const handlePropertyUpdate = (property: keyof OptionsGridProperties, value: any) => {
    // Tenta validar a atualização antes de aplicar
    const updatedProps = { ...properties, [property]: value };
    const validation = optionsGridUtils.validateProperties(updatedProps);
    
    if (!validation.isValid && onValidationError) {
      onValidationError(validation.errors);
      return;
    }
    
    onPropertyChange(property, value);
  };

  return (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="images">Imagens</TabsTrigger>
        <TabsTrigger value="behavior">Comportamento</TabsTrigger>
        <TabsTrigger value="style">Estilo</TabsTrigger>
      </TabsList>

      <TabsContent value="layout" className="space-y-4 m-0">
        <Card className="border" style={{ borderColor: '#E5DDD5' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm" style={{ color: '#432818' }}>
              Configurações do Grid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs" style={{ color: '#6B4F43' }}>
                Número de Colunas
              </Label>
              <Select
                value={properties.columns.toString()}
                onValueChange={value => handlePropertyUpdate('columns', parseInt(value))}
              >
                <SelectTrigger className="text-xs h-8 mt-1">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs" style={{ color: '#6B4F43' }}>
                  Espaçamento (Gap)
                </Label>
                <Badge variant="outline" className="text-xs">
                  {properties.gridGap}px
                </Badge>
              </div>
              <Slider
                value={[properties.gridGap]}
                onValueChange={([value]) => handlePropertyUpdate('gridGap', value)}
                min={0}
                max={48}
                step={4}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="images" className="space-y-4 m-0">
        <Card className="border" style={{ borderColor: '#E5DDD5' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm" style={{ color: '#432818' }}>
              Configurações de Imagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm" style={{ color: '#6B4F43' }}>
                Mostrar Imagens
              </Label>
              <Switch
                checked={properties.showImages}
                onCheckedChange={checked => handlePropertyUpdate('showImages', checked)}
              />
            </div>

            {properties.showImages && (
              <>
                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Tamanho da Imagem
                  </Label>
                  <Select
                    value={properties.imageSize}
                    onValueChange={value => handlePropertyUpdate('imageSize', value)}
                  >
                    <SelectTrigger className="text-xs h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequena (200x200)</SelectItem>
                      <SelectItem value="medium">Média (256x256)</SelectItem>
                      <SelectItem value="large">Grande (300x300)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Posição da Imagem
                  </Label>
                  <Select
                    value={properties.imagePosition}
                    onValueChange={value => handlePropertyUpdate('imagePosition', value)}
                  >
                    <SelectTrigger className="text-xs h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Superior</SelectItem>
                      <SelectItem value="left">Esquerda</SelectItem>
                      <SelectItem value="right">Direita</SelectItem>
                      <SelectItem value="bottom">Inferior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs" style={{ color: '#6B4F43' }}>
                    Layout da Imagem
                  </Label>
                  <Select
                    value={properties.imageLayout}
                    onValueChange={value => handlePropertyUpdate('imageLayout', value)}
                  >
                    <SelectTrigger className="text-xs h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="behavior" className="space-y-4 m-0">
        <Card className="border" style={{ borderColor: '#E5DDD5' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm" style={{ color: '#432818' }}>
              Comportamento de Seleção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm" style={{ color: '#6B4F43' }}>
                Múltipla Seleção
              </Label>
              <Switch
                checked={properties.multipleSelection}
                onCheckedChange={checked => handlePropertyUpdate('multipleSelection', checked)}
              />
            </div>

            {properties.multipleSelection && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Mínimo de Seleções
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.minSelections}
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.minSelections]}
                    onValueChange={([value]) => handlePropertyUpdate('minSelections', value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs" style={{ color: '#6B4F43' }}>
                      Máximo de Seleções
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {properties.maxSelections}
                    </Badge>
                  </div>
                  <Slider
                    value={[properties.maxSelections]}
                    onValueChange={([value]) => handlePropertyUpdate('maxSelections', value)}
                    min={properties.minSelections}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-sm" style={{ color: '#6B4F43' }}>
                Permitir Desmarcar
              </Label>
              <Switch
                checked={properties.allowDeselection}
                onCheckedChange={checked => handlePropertyUpdate('allowDeselection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm" style={{ color: '#6B4F43' }}>
                Mostrar Contagem
              </Label>
              <Switch
                checked={properties.showSelectionCount}
                onCheckedChange={checked => handlePropertyUpdate('showSelectionCount', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="style" className="space-y-4 m-0">
        <Card className="border" style={{ borderColor: '#E5DDD5' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm" style={{ color: '#432818' }}>
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ColorPicker
              value={properties.backgroundColor}
              onChange={color => handlePropertyUpdate('backgroundColor', color)}
              label="Cor de Fundo"
            />

            <ColorPicker
              value={properties.selectedColor}
              onChange={color => handlePropertyUpdate('selectedColor', color)}
              label="Cor de Seleção"
            />

            <ColorPicker
              value={properties.hoverColor}
              onChange={color => handlePropertyUpdate('hoverColor', color)}
              label="Cor de Hover"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs" style={{ color: '#6B4F43' }}>
                  Borda Arredondada
                </Label>
                <Badge variant="outline" className="text-xs">
                  {properties.borderRadius}px
                </Badge>
              </div>
              <Slider
                value={[properties.borderRadius]}
                onValueChange={([value]) => handlePropertyUpdate('borderRadius', value)}
                min={0}
                max={24}
                step={2}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs" style={{ color: '#6B4F43' }}>
                  Padding Interno
                </Label>
                <Badge variant="outline" className="text-xs">
                  {properties.padding}px
                </Badge>
              </div>
              <Slider
                value={[properties.padding]}
                onValueChange={([value]) => handlePropertyUpdate('padding', value)}
                min={0}
                max={32}
                step={4}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
