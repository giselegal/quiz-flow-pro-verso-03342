import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';
import React, { useCallback } from 'react';
import { PropertyArrayEditor } from '../components/PropertyArrayEditor';
import { PropertyCheckbox } from '../components/PropertyCheckbox';
import { PropertyNumber } from '../components/PropertyNumber';
import { PropertySelect } from '../components/PropertySelect';
import { PropertyEditorProps } from '../interfaces/PropertyEditor';

interface OptionItem {
  id: string;
  text: string;
  value?: string;
}

export const OptionsPropertyEditor: React.FC<PropertyEditorProps> = ({
  block,
  onUpdate,
  onValidate,
  isPreviewMode = false,
}) => {
  const handlePropertyChange = useCallback(
    (propertyName: string, value: any) => {
      onUpdate({ [propertyName]: value });

      // Validação: lista de opções é obrigatória
      const isValid =
        propertyName === 'items'
          ? Array.isArray(value) && value.length > 0
          : (Array.isArray(block.properties?.items) && block.properties.items.length > 0) ||
            propertyName !== 'items';
      onValidate?.(isValid);
    },
    [onUpdate, onValidate, block.properties?.items]
  );

  if (isPreviewMode) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Preview mode - properties editing disabled</p>
      </div>
    );
  }

  const currentItems = block.properties?.items || [];
  const allowMultiple = block.properties?.allowMultiple || false;
  const maxSelections = block.properties?.maxSelections || 1;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckSquare className="h-5 w-5 text-[#B89B7A]" />
          Propriedades das Opções
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <PropertyArrayEditor
          label="Lista de Opções"
          value={currentItems}
          onChange={value => handlePropertyChange('items', value)}
          itemLabel="Opção"
          maxItems={8}
          required={true}
        />

        <PropertySelect
          label="Estilo das Opções"
          value={block.properties?.type || 'radio'}
          onChange={value => handlePropertyChange('type', value)}
          options={['radio', 'checkbox', 'buttons', 'cards']}
          required={true}
        />

        <PropertyCheckbox
          label="Permitir Múltiplas Seleções"
          value={allowMultiple}
          onChange={value => handlePropertyChange('allowMultiple', value)}
        />

        {allowMultiple && (
          <PropertyNumber
            label="Máximo de Seleções"
            value={maxSelections}
            onChange={value => handlePropertyChange('maxSelections', value)}
            min={1}
            max={currentItems.length || 8}
            step={1}
          />
        )}

        {/* Preview section */}
        <div className="mt-6 p-4 bg-[#FAF9F7] rounded-lg border">
          <h4 className="text-sm font-medium text-[#6B4F43] mb-3">Preview:</h4>

          <div className="space-y-3">
            <div className="text-xs text-[#8B7355] space-y-1">
              <div>• Estilo: {block.properties?.type || 'radio'}</div>
              <div>• Múltiplas seleções: {allowMultiple ? 'Sim' : 'Não'}</div>
              {allowMultiple && <div>• Máximo: {maxSelections} opções</div>}
              <div>• Total de opções: {currentItems.length}</div>
            </div>

            {/* Simular as opções */}
            <div className="space-y-2">
              {currentItems.length > 0 ? (
                currentItems.slice(0, 4).map((item: OptionItem, index: number) => (
                  <div key={item.id || index} className="flex items-center gap-2 text-sm">
                    <span className="text-[#B89B7A]">
                      {block.properties?.type === 'checkbox' || allowMultiple ? '☑️' : '⭕'}
                    </span>
                    <span className="text-[#6B4F43]">{item.text || `Opção ${index + 1}`}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#8B7355] italic">
                  Adicione opções acima para ver o preview
                </div>
              )}

              {currentItems.length > 4 && (
                <div className="text-xs text-[#8B7355]">
                  ... e mais {currentItems.length - 4} opções
                </div>
              )}
            </div>

            {/* Aviso de validação */}
            {currentItems.length === 0 && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ Pelo menos uma opção é obrigatória
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
