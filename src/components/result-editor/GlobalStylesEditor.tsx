// @ts-nocheck
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface GlobalStylesEditorProps {
  globalStyles: {
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
  };
  onSave: (styles: any) => void;
  onCancel: () => void;
}

export const GlobalStylesEditor: React.FC<GlobalStylesEditorProps> = ({
  globalStyles,
  onSave,
  onCancel,
}) => {
  const [styles, setStyles] = useState(globalStyles);

  // Handle color change safely
  const handleColorChange = (colorType: string, hexColor: string) => {
    setStyles(prev => ({
      ...prev,
      [colorType]: hexColor || '#FFFFFF', // Default to white if color is undefined
    }));
  };

  const handleChange = (key: string, value: string) => {
    setStyles(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(styles);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-[#432818]">Estilos Globais</h2>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-[#8F7A6A]">
            Fechar
          </Button>
        </div>

        <Separator className="mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Cor Primária</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 border rounded"
                style={{ backgroundColor: styles.primaryColor }}
              ></div>
              <Input
                id="primaryColor"
                type="text"
                value={styles.primaryColor || ''}
                onChange={e => handleChange('primaryColor', e.target.value)}
                placeholder="#B89B7A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Cor Secundária</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 border rounded"
                style={{ backgroundColor: styles.secondaryColor }}
              ></div>
              <Input
                id="secondaryColor"
                type="text"
                value={styles.secondaryColor || ''}
                onChange={e => handleChange('secondaryColor', e.target.value)}
                placeholder="#432818"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Cor do Texto</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 border rounded"
                style={{ backgroundColor: styles.textColor }}
              ></div>
              <Input
                id="textColor"
                type="text"
                value={styles.textColor || ''}
                onChange={e => handleChange('textColor', e.target.value)}
                placeholder="#3A3A3A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 border rounded"
                style={{ backgroundColor: styles.backgroundColor }}
              ></div>
              <Input
                id="backgroundColor"
                type="text"
                value={styles.backgroundColor || ''}
                onChange={e => handleChange('backgroundColor', e.target.value)}
                placeholder="#FAF9F7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontFamily">Fonte Principal</Label>
            <Input
              id="fontFamily"
              type="text"
              value={styles.fontFamily || ''}
              onChange={e => handleChange('fontFamily', e.target.value)}
              placeholder="Playfair Display, serif"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#B89B7A] hover:bg-[#A38A69] text-white">
              Salvar Estilos
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
