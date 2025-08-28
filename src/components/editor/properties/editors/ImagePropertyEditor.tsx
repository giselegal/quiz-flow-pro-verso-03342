import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Block } from '@/types/editor';
import React from 'react';
import { PropertyNumber } from '../components/PropertyNumber';

interface ImagePropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const ImagePropertyEditor: React.FC<ImagePropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  // Propriedades da imagem ficam em block.properties/content (EditorContext faz merge)
  const src = (block.properties as any)?.src || (block.content as any)?.src || '';
  const alt = (block.properties as any)?.alt || (block.content as any)?.alt || '';
  const width = (block.properties as any)?.width || (block.content as any)?.width || 0;
  const height = (block.properties as any)?.height || (block.content as any)?.height || 0;
  const objectFit =
    (block.properties as any)?.objectFit || (block.content as any)?.objectFit || 'cover';
  const borderRadius =
    (block.properties as any)?.borderRadius || (block.content as any)?.borderRadius || 8;

  // Atualiza como propriedade de topo para refletir em properties e content
  const handleUpdate = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const fitOptions = [
    { value: 'cover', label: 'Cobrir' },
    { value: 'contain', label: 'Conter' },
    { value: 'fill', label: 'Preencher' },
    { value: 'none', label: 'Nenhum' },
  ];

  const renderPreview = () => {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded border">
        {src ? (
          <img
            src={src}
            alt={alt || 'Preview'}
            style={{
              width: width ? `${width}px` : 'auto',
              height: height ? `${height}px` : 'auto',
              borderRadius: `${borderRadius}px`,
              objectFit: objectFit as any,
              maxWidth: '100%',
            }}
          />
        ) : (
          <div className="text-xs text-gray-500">Informe a URL da imagem para visualizar</div>
        )}
      </div>
    );
  };

  if (isPreviewMode) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">Preview: Imagem</CardTitle>
        </CardHeader>
        <CardContent>{renderPreview()}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Propriedades: Imagem
          <Badge variant="secondary" className="ml-auto">
            {objectFit}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Fonte */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="img-src">URL da Imagem</Label>
            <Input
              id="img-src"
              value={src}
              onChange={e => handleUpdate('src', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="img-alt">Texto Alternativo (SEO)</Label>
            <Input
              id="img-alt"
              value={alt}
              onChange={e => handleUpdate('alt', e.target.value)}
              placeholder="Descrição da imagem"
            />
          </div>
        </div>

        <Separator />

        {/* Tamanho */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <PropertyNumber
              label="Largura"
              value={width}
              onChange={(v: number) => handleUpdate('width', v)}
              min={0}
              max={1920}
              step={1}
            />
            <span className="text-xs text-gray-500">px (0 para automático)</span>
          </div>
          <div className="space-y-2">
            <PropertyNumber
              label="Altura"
              value={height}
              onChange={(v: number) => handleUpdate('height', v)}
              min={0}
              max={1920}
              step={1}
            />
            <span className="text-xs text-gray-500">px (0 para automático)</span>
          </div>
        </div>

        {/* Aparência */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="objectFit">Ajuste</Label>
            <Select value={objectFit} onValueChange={v => handleUpdate('objectFit', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fitOptions
                  .filter(opt => opt.value && opt.value !== '')
                  .map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <PropertyNumber
              label="Borda Arredondada"
              value={borderRadius}
              onChange={(v: number) => handleUpdate('borderRadius', v)}
              min={0}
              max={64}
              step={1}
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          {renderPreview()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePropertyEditor;
