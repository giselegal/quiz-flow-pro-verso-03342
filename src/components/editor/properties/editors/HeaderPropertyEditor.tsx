import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Type } from 'lucide-react';
import React, { useCallback } from 'react';
import { PropertyInput } from '../components/PropertyInput';
import { PropertySelect } from '../components/PropertySelect';
import { PropertyEditorProps } from '../interfaces/PropertyEditor';

export const HeaderPropertyEditor: React.FC<PropertyEditorProps> = ({
  block,
  onUpdate,
  onValidate,
  isPreviewMode = false,
}) => {
  const handlePropertyChange = useCallback(
    (propertyName: string, value: any) => {
      onUpdate({ [propertyName]: value });

      // Validação simples: título é obrigatório
      const isValid =
        propertyName === 'title' ? !!value : block.properties?.title || propertyName !== 'title';
      onValidate?.(isValid);
    },
    [onUpdate, onValidate, block.properties?.title]
  );

  if (isPreviewMode) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Preview mode - properties editing disabled</p>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="h-5 w-5 text-[#B89B7A]" />
          Propriedades do Header
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <PropertyInput
          label="Título"
          value={block.properties?.title || ''}
          onChange={value => handlePropertyChange('title', value)}
          required={true}
          placeholder="Digite o título principal..."
        />

        <PropertyInput
          label="Subtítulo"
          value={block.properties?.subtitle || ''}
          onChange={value => handlePropertyChange('subtitle', value)}
          required={false}
          placeholder="Digite o subtítulo (opcional)..."
        />

        <PropertySelect
          label="Tipo de Header"
          value={block.properties?.type || 'default'}
          onChange={value => handlePropertyChange('type', value)}
          options={['default', 'hero', 'section']}
          required={true}
        />

        {/* Preview section */}
        <div className="mt-6 p-4 bg-[#FAF9F7] rounded-lg border">
          <h4 className="text-sm font-medium text-[#6B4F43] mb-2">Preview:</h4>
          <div className={`space-y-1 ${block.properties?.type === 'hero' ? 'text-center' : ''}`}>
            <h2
              className={`font-bold ${
                block.properties?.type === 'hero'
                  ? 'text-2xl'
                  : block.properties?.type === 'section'
                    ? 'text-xl'
                    : 'text-lg'
              } text-[#6B4F43]`}
            >
              {block.properties?.title || 'Título do Header'}
            </h2>
            {block.properties?.subtitle && (
              <p className="text-[#8B7355] text-sm">{block.properties.subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
