/**
 * 🎛️ DYNAMIC PROPERTY CONTROLS - FASE 2 Integração
 * 
 * Gera controles de propriedades dinamicamente baseado em schemas
 * Elimina necessidade de if/else hardcoded no painel de propriedades
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { schemaInterpreter, PropertySchema } from '@/core/schema/SchemaInterpreter';
import { appLogger } from '@/lib/utils/appLogger';

interface DynamicPropertyControlsProps {
  elementType: string;
  properties: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

/**
 * Renderiza controles dinamicamente baseado no schema do tipo de elemento
 */
export const DynamicPropertyControls: React.FC<DynamicPropertyControlsProps> = ({
  elementType,
  properties,
  onChange,
}) => {
  const schema = schemaInterpreter.getBlockSchema(elementType);

  // ✅ CORREÇÃO 2: Debug logging detalhado
  appLogger.info('🎛️ [DynamicPropertyControls] Renderizando:', {
    data: [{
      elementType,
      hasSchema: !!schema,
      propertiesKeys: Object.keys(properties),
      schemaPropertiesKeys: schema ? Object.keys(schema.properties) : []
    }]
  });

  if (!schema) {
    // ✅ FASE 1.2 FIX: Better fallback UI with actionable information
    return (
      <div className="space-y-3 p-4 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-950/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
              Schema não encontrado
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
              O tipo de bloco <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">{elementType}</code> não possui schema registrado.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              <strong>Possíveis causas:</strong>
            </p>
            <ul className="text-xs text-amber-600 dark:text-amber-400 list-disc list-inside mt-1 space-y-0.5">
              <li>Schemas não foram carregados no App.tsx</li>
              <li>Tipo de bloco não existe em blockPropertySchemas.ts</li>
              <li>Schema JSON não foi importado em loadEditorBlockSchemas.ts</li>
            </ul>
          </div>
        </div>
        <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
            <strong>Propriedades atuais do bloco:</strong>
          </p>
          <pre className="text-xs bg-amber-100 dark:bg-amber-900 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(properties, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(schema.properties).map(([key, propSchema]) => (
        <PropertyControl
          key={key}
          propertyKey={key}
          schema={propSchema}
          value={properties[key]}
          onChange={(value) => onChange(key, value)}
        />
      ))}
    </div>
  );
};

/**
 * Renderiza controle individual baseado no tipo de propriedade
 */
const PropertyControl: React.FC<{
  propertyKey: string;
  schema: PropertySchema;
  value: any;
  onChange: (value: any) => void;
}> = ({ propertyKey, schema, value, onChange }) => {
  const label = schema.label || propertyKey;
  const description = schema.description;

  // ✅ Normalizar control type (compatibilidade com blockPropertySchemas)
  const normalizedControl = normalizeControlType(schema.control);

  // 🔍 DEBUG: Wrapper para logar todas as mudanças
  const handleChange = (newValue: any) => {
    appLogger.info('🎛️ [PropertyControl] onChange:', {
      data: [{
        propertyKey,
        oldValue: value,
        newValue,
        control: normalizedControl
      }]
    });
    onChange(newValue);
  };

  const renderControl = () => {
    switch (normalizedControl) {
      case 'text':
        return (
          <Input
            id={propertyKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={schema.default || ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={propertyKey}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={schema.default || ''}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            id={propertyKey}
            type="number"
            value={value || schema.default || 0}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={schema.validation?.min}
            max={schema.validation?.max}
          />
        );

      case 'range': {
        // ✅ NOVO: Controle de slider para propriedades numéricas com min/max
        const rangeValue = typeof value === 'number' ? value : (schema.default || 0);
        const rangeMin = schema.validation?.min || 0;
        const rangeMax = schema.validation?.max || 100;
        const rangeStep = schema.validation?.step || 1;

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {rangeMin}
              </span>
              <span className="text-sm font-medium">
                {rangeValue}
              </span>
              <span className="text-xs text-muted-foreground">
                {rangeMax}
              </span>
            </div>
            <Slider
              value={[rangeValue]}
              onValueChange={([newValue]) => handleChange(newValue)}
              min={rangeMin}
              max={rangeMax}
              step={rangeStep}
              className="w-full"
            />
          </div>
        );
      }

      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={propertyKey}
              checked={value || schema.default || false}
              onCheckedChange={handleChange}
            />
            <span className="text-sm text-muted-foreground">
              {value ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        );

      case 'color-picker':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={value || schema.default || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              className="w-16 h-10"
            />
            <Input
              type="text"
              value={value || schema.default || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

      case 'dropdown':
        return (
          <Select value={String(value || schema.default || '')} onValueChange={handleChange}>
            <SelectTrigger id={propertyKey}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'options-list': {
        // ✅ NOVO: Editor de lista de opções (usado em options-grid, quiz-transition, etc)
        const optionsList = Array.isArray(value) ? value : [];

        return (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {optionsList.map((option: any, index: number) => (
              <div key={index} className="flex gap-2 p-2 border rounded bg-muted/30">
                <div className="flex-1 space-y-1">
                  <Input
                    value={option.text || option.label || ''}
                    onChange={(e) => {
                      const updated = [...optionsList];
                      updated[index] = { ...option, text: e.target.value };
                      handleChange(updated);
                    }}
                    placeholder="Texto da opção"
                    className="h-8 text-sm"
                  />
                  {(option.imageUrl !== undefined || option.image !== undefined) && (
                    <Input
                      value={option.imageUrl || option.image || ''}
                      onChange={(e) => {
                        const updated = [...optionsList];
                        updated[index] = { ...option, imageUrl: e.target.value };
                        handleChange(updated);
                      }}
                      placeholder="URL da imagem (opcional)"
                      className="h-7 text-xs"
                    />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => {
                    const updated = optionsList.filter((_, i) => i !== index);
                    handleChange(updated);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const newOption = {
                  id: `opt-${Date.now()}`,
                  text: 'Nova opção',
                  value: `option-${optionsList.length + 1}`,
                };
                handleChange([...optionsList, newOption]);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Adicionar Opção
            </Button>
          </div>
        );
      }

      case 'image-upload':
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="URL da imagem ou upload..."
            />
            {value && (
              <img
                src={value}
                alt="Preview"
                className="w-full h-32 object-cover rounded border"
              />
            )}
          </div>
        );

      case 'json-editor':
        return (
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(parsed);
              } catch {
                handleChange(e.target.value);
              }
            }}
            placeholder="{}"
            rows={6}
            className="font-mono text-xs"
          />
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={propertyKey} className="text-sm font-medium">
        {label}
        {schema.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {renderControl()}
    </div>
  );
};

/**
 * ✅ CORREÇÃO: Normaliza tipos de controle dos schemas para tipos internos
 * Mapeia blockPropertySchemas types → DynamicPropertyControls control types
 */
function normalizeControlType(control: string | undefined): string {
  if (!control) return 'text';

  const mapping: Record<string, string> = {
    // blockPropertySchemas.ts → DynamicPropertyControls
    'select': 'dropdown',
    'color': 'color-picker',
    'boolean': 'toggle',
    'json': 'json-editor',
    'range': 'range',
    'options-list': 'options-list',
  };

  return mapping[control] || control;
}

export default DynamicPropertyControls;
