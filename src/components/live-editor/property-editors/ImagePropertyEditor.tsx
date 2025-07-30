
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ImagePropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
  onStyleUpdate: (updates: any) => void;
}

export const ImagePropertyEditor: React.FC<ImagePropertyEditorProps> = ({
  component,
  onDataUpdate,
  onStyleUpdate
}) => {
  const data = component.data || {};
  const style = component.style || {};

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you'd upload to a service like Supabase
      const reader = new FileReader();
      reader.onload = (e) => {
        onDataUpdate({ imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Imagem</h3>
        
        <div className="space-y-2">
          <Label htmlFor="image-url">URL da Imagem</Label>
          <Input
            id="image-url"
            value={data.imageUrl || ''}
            onChange={(e) => onDataUpdate({ imageUrl: e.target.value })}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label>Ou fazer upload</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Escolher Arquivo
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alt-text">Texto Alternativo</Label>
          <Input
            id="alt-text"
            value={data.alt || ''}
            onChange={(e) => onDataUpdate({ alt: e.target.value })}
            placeholder="Descrição da imagem para acessibilidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-size">Tamanho</Label>
          <Select 
            value={data.imageSize || 'medium'} 
            onValueChange={(value) => onDataUpdate({ imageSize: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="full">Largura Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Style Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Estilo</h3>
        
        <div className="space-y-2">
          <Label htmlFor="border-radius">Arredondamento</Label>
          <Select 
            value={style.borderRadius || '0'} 
            onValueChange={(value) => onStyleUpdate({ borderRadius: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sem arredondamento</SelectItem>
              <SelectItem value="4">Pequeno (4px)</SelectItem>
              <SelectItem value="8">Médio (8px)</SelectItem>
              <SelectItem value="16">Grande (16px)</SelectItem>
              <SelectItem value="50">Circular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="padding">Espaçamento</Label>
          <Select 
            value={style.paddingY || '16'} 
            onValueChange={(value) => onStyleUpdate({ paddingY: value, paddingX: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sem espaçamento</SelectItem>
              <SelectItem value="8">Pequeno (8px)</SelectItem>
              <SelectItem value="16">Médio (16px)</SelectItem>
              <SelectItem value="24">Grande (24px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
