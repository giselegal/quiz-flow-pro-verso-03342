import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditableContent } from '@/types/editor';
import { ColorPicker } from "@/components/result/editor/ColorPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StyleEditorProps {
  style: EditableContent['style'];
  onUpdate: (style: any) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ style = {}, onUpdate }) => {
  const updateStyle = (key: string, value: any) => {
    onUpdate({ ...style, [key]: value });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="typography" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="typography" className="flex-1">
            Tipografia
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex-1">
            Layout
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex-1">
            Cores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Família da Fonte</Label>
            <Select
              value={style.fontFamily || ''}
              onValueChange={value => updateStyle('fontFamily', value)}
            >
              <SelectTrigger id="fontFamily">
                <SelectValue placeholder="Selecione uma fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão</SelectItem>
                <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                <SelectItem value="'Poppins', sans-serif">Poppins</SelectItem>
                <SelectItem value="'Nunito', sans-serif">Nunito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontSize">Tamanho da Fonte</Label>
            <Input
              id="fontSize"
              value={style.fontSize || ''}
              onChange={e => updateStyle('fontSize', e.target.value)}
              placeholder="ex: 16px ou 1.2rem"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontWeight">Peso da Fonte</Label>
            <Select
              value={style.fontWeight || ''}
              onValueChange={value => updateStyle('fontWeight', value)}
            >
              <SelectTrigger id="fontWeight">
                <SelectValue placeholder="Selecione um peso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão</SelectItem>
                <SelectItem value="300">Leve (300)</SelectItem>
                <SelectItem value="400">Normal (400)</SelectItem>
                <SelectItem value="500">Médio (500)</SelectItem>
                <SelectItem value="600">Semi-Negrito (600)</SelectItem>
                <SelectItem value="700">Negrito (700)</SelectItem>
                <SelectItem value="800">Extra-Negrito (800)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lineHeight">Altura da Linha</Label>
            <Input
              id="lineHeight"
              value={style.lineHeight || ''}
              onChange={e => updateStyle('lineHeight', e.target.value)}
              placeholder="ex: 1.5 ou 24px"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="textAlign">Alinhamento do Texto</Label>
            <Select
              value={style.textAlign || 'left'}
              onValueChange={value => updateStyle('textAlign', value)}
            >
              <SelectTrigger id="textAlign">
                <SelectValue placeholder="Selecione um alinhamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
                <SelectItem value="justify">Justificado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="letterSpacing">Espaçamento entre Letras</Label>
            <Input
              id="letterSpacing"
              value={style.letterSpacing || ''}
              onChange={e => updateStyle('letterSpacing', e.target.value)}
              placeholder="ex: 1px ou 0.05em"
            />
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="margin">Margem</Label>
              <Input
                id="margin"
                value={style.margin || ''}
                onChange={e => updateStyle('margin', e.target.value)}
                placeholder="ex: 1rem ou 16px"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Input
                id="padding"
                value={style.padding || ''}
                onChange={e => updateStyle('padding', e.target.value)}
                placeholder="ex: 1rem ou 16px"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Largura</Label>
              <Input
                id="width"
                value={style.width || ''}
                onChange={e => updateStyle('width', e.target.value)}
                placeholder="ex: 100% ou 300px"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura</Label>
              <Input
                id="height"
                value={style.height || ''}
                onChange={e => updateStyle('height', e.target.value)}
                placeholder="ex: auto ou 300px"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display">Display</Label>
            <Select
              value={style.display || ''}
              onValueChange={value => updateStyle('display', value)}
            >
              <SelectTrigger id="display">
                <SelectValue placeholder="Selecione um valor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="inline-block">Inline Block</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="inline-flex">Inline Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {style.display === 'flex' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flexDirection">Direção do Flex</Label>
                <Select
                  value={style.flexDirection || 'row'}
                  onValueChange={value => updateStyle('flexDirection', value)}
                >
                  <SelectTrigger id="flexDirection">
                    <SelectValue placeholder="Selecione uma direção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="row">Row</SelectItem>
                    <SelectItem value="column">Column</SelectItem>
                    <SelectItem value="row-reverse">Row Reverse</SelectItem>
                    <SelectItem value="column-reverse">Column Reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="justifyContent">Justify Content</Label>
                <Select
                  value={style.justifyContent || 'flex-start'}
                  onValueChange={value => updateStyle('justifyContent', value)}
                >
                  <SelectTrigger id="justifyContent">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flex-start">Flex Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">Flex End</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                    <SelectItem value="space-evenly">Space Evenly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alignItems">Align Items</Label>
                <Select
                  value={style.alignItems || 'stretch'}
                  onValueChange={value => updateStyle('alignItems', value)}
                >
                  <SelectTrigger id="alignItems">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stretch">Stretch</SelectItem>
                    <SelectItem value="flex-start">Flex Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">Flex End</SelectItem>
                    <SelectItem value="baseline">Baseline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gap">Gap</Label>
                <Input
                  id="gap"
                  value={style.gap || ''}
                  onChange={e => updateStyle('gap', e.target.value)}
                  placeholder="ex: 10px ou 1rem"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="borderRadius">Arredondamento das Bordas</Label>
            <Input
              id="borderRadius"
              value={style.borderRadius || ''}
              onChange={e => updateStyle('borderRadius', e.target.value)}
              placeholder="ex: 8px ou 0.5rem"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="boxShadow">Sombra</Label>
            <Input
              id="boxShadow"
              value={style.boxShadow || ''}
              onChange={e => updateStyle('boxShadow', e.target.value)}
              placeholder="ex: 0 2px 4px rgba(0,0,0,0.1)"
            />
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color">Cor do Texto</Label>
            <ColorPicker
              color={style.color || '#000000'}
              onChange={color => updateStyle('color', color)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <ColorPicker
              color={style.backgroundColor || '#ffffff'}
              onChange={color => updateStyle('backgroundColor', color)}
            />
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label>Bordas</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="borderWidth">Largura</Label>
                <Input
                  id="borderWidth"
                  value={style.borderWidth || ''}
                  onChange={e => updateStyle('borderWidth', e.target.value)}
                  placeholder="ex: 1px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderStyle">Estilo</Label>
                <Select
                  value={style.borderStyle || ''}
                  onValueChange={value => updateStyle('borderStyle', value)}
                >
                  <SelectTrigger id="borderStyle">
                    <SelectValue placeholder="Selecione um estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="solid">Sólido</SelectItem>
                    <SelectItem value="dashed">Tracejado</SelectItem>
                    <SelectItem value="dotted">Pontilhado</SelectItem>
                    <SelectItem value="double">Duplo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <Label htmlFor="borderColor">Cor da Borda</Label>
              <ColorPicker
                color={style.borderColor || '#000000'}
                onChange={color => updateStyle('borderColor', color)}
              />
            </div>
          </div>

          {(style.objectFit !== undefined || style.type === 'image') && (
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="objectFit">Ajuste de Imagem</Label>
              <Select
                value={style.objectFit || 'cover'}
                onValueChange={value => updateStyle('objectFit', value)}
              >
                <SelectTrigger id="objectFit">
                  <SelectValue placeholder="Selecione um ajuste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="scale-down">Scale Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleEditor;
