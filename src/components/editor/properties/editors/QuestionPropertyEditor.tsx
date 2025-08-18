import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import React, { useCallback } from 'react';
import { PropertyCheckbox } from '../components/PropertyCheckbox';
import { PropertySelect } from '../components/PropertySelect';
import { PropertyTextarea } from '../components/PropertyTextarea';
import { PropertyEditorProps } from '../interfaces/PropertyEditor';

export const QuestionPropertyEditor: React.FC<PropertyEditorProps> = ({
  block,
  onUpdate,
  onValidate,
  isPreviewMode = false,
}) => {
  const handlePropertyChange = useCallback(
    (propertyName: string, value: any) => {
      onUpdate({ [propertyName]: value });

      // Validação: texto da pergunta é obrigatório
      const isValid =
        propertyName === 'text' ? !!value : block.properties?.text || propertyName !== 'text';
      onValidate?.(isValid);
    },
    [onUpdate, onValidate, block.properties?.text]
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
          <HelpCircle className="h-5 w-5 text-[#B89B7A]" />
          Propriedades da Pergunta
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <PropertyTextarea
          label="Texto da Pergunta"
          value={block.properties?.text || ''}
          onChange={value => handlePropertyChange('text', value)}
          required={true}
          placeholder="Digite sua pergunta aqui..."
        />

        <PropertySelect
          label="Tipo de Input"
          value={block.properties?.type || 'single'}
          onChange={value => handlePropertyChange('type', value)}
          options={['single', 'multiple', 'text', 'scale']}
          required={true}
        />

        <PropertyCheckbox
          label="Campo Obrigatório"
          value={block.properties?.required || false}
          onChange={value => handlePropertyChange('required', value)}
        />

        <PropertySelect
          label="Formato da Pergunta"
          value={block.properties?.questionType || 'choice'}
          onChange={value => handlePropertyChange('questionType', value)}
          options={['choice', 'input', 'scale', 'rating']}
          required={false}
        />

        {/* Preview section */}
        <div className="mt-6 p-4 bg-[#FAF9F7] rounded-lg border">
          <h4 className="text-sm font-medium text-[#6B4F43] mb-3">Preview:</h4>

          <div className="space-y-3">
            <div className="font-medium text-[#6B4F43]">
              {block.properties?.text || 'Sua pergunta aparecerá aqui...'}
              {block.properties?.required && <span className="text-red-500 ml-1">*</span>}
            </div>

            <div className="text-xs text-[#8B7355] space-y-1">
              <div>• Tipo: {block.properties?.type || 'single'}</div>
              <div>• Formato: {block.properties?.questionType || 'choice'}</div>
              <div>• Obrigatório: {block.properties?.required ? 'Sim' : 'Não'}</div>
            </div>

            {/* Simular input baseado no tipo */}
            <div className="mt-3 p-2 border border-dashed border-[#E5DDD5] rounded text-xs text-[#8B7355]">
              {block.properties?.type === 'text' && '📝 Input de texto apareceria aqui'}
              {block.properties?.type === 'single' && '⭕ Opções de escolha única apareceriam aqui'}
              {block.properties?.type === 'multiple' &&
                '☑️ Opções de múltipla escolha apareceriam aqui'}
              {block.properties?.type === 'scale' && '📊 Escala de avaliação apareceria aqui'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
