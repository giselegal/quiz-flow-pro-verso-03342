/**
 * 🎛️ DYNAMIC PROPERTY CONTROLS - FASE 2 Integração + Draft Pattern
 * 
 * Gera controles de propriedades dinamicamente baseado em schemas.
 * Agora integrado com o sistema de draft e validação em tempo real.
 * 
 * MELHORIAS:
 * - Validação por campo em tempo real
 * - JSON editor com buffer de texto (evita estados inconsistentes)
 * - Tratamento correto de valores falsy (0, false, '')
 * - Controles type-safe com fallback
 */

import React, { useState, useCallback, memo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Plus, X, AlertTriangle, AlertCircle } from 'lucide-react';
import { schemaInterpreter, PropertySchema, BlockTypeSchema } from '@/core/schema/SchemaInterpreter';
import { appLogger } from '@/lib/utils/appLogger';
import {
  PropertyControlType,
  normalizeControlType as normalizeControlTypeFn,
  getInitialValueFromSchema,
  safeParseJson,
} from '@/core/schema/propertyValidation';

interface DynamicPropertyControlsProps {
  elementType: string;
  properties: Record<string, any>;
  onChange: (key: string, value: any) => void;
  /** Optional: override schema (BlockRegistry bridge) */
  schemaOverride?: BlockTypeSchema | null;
  /** Optional: field-level errors from draft validation */
  errors?: Record<string, string>;
  /** Optional: callback for JSON field text changes (for buffer support) */
  onJsonTextChange?: (key: string, text: string) => void;
  /** Optional: get JSON buffer text for a field */
  getJsonBuffer?: (key: string) => string;
}

/**
 * Renderiza controles dinamicamente baseado no schema do tipo de elemento
 */
export const DynamicPropertyControls: React.FC<DynamicPropertyControlsProps> = ({
  elementType,
  properties,
  onChange,
  schemaOverride,
  errors = {},
  onJsonTextChange,
  getJsonBuffer,
}) => {
  const schema = schemaOverride ?? schemaInterpreter.getBlockSchema(elementType);

  // ✅ CORREÇÃO 2: Debug logging detalhado
  appLogger.info('🎛️ [DynamicPropertyControls] Renderizando:', {
    data: [{
      elementType,
      hasSchema: !!schema,
      propertiesKeys: Object.keys(properties),
      schemaPropertiesKeys: schema ? Object.keys(schema.properties) : [],
    }],
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
          elementType={elementType}
          schema={propSchema}
          value={properties[key]}
          error={errors[key]}
          onChange={(value) => onChange(key, value)}
          onJsonTextChange={onJsonTextChange ? (text) => onJsonTextChange(key, text) : undefined}
          getJsonBuffer={getJsonBuffer ? () => getJsonBuffer(key) : undefined}
        />
      ))}
    </div>
  );
};

/**
 * Renderiza controle individual baseado no tipo de propriedade
 * Memoized para evitar re-renders desnecessários
 */
interface PropertyControlProps {
  propertyKey: string;
  elementType: string;
  schema: PropertySchema;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  onJsonTextChange?: (text: string) => void;
  getJsonBuffer?: () => string;
}

const PropertyControl: React.FC<PropertyControlProps> = memo(({
  propertyKey,
  elementType,
  schema,
  value,
  error,
  onChange,
  onJsonTextChange,
  getJsonBuffer,
}) => {
  const label = schema.label || propertyKey;
  const description = schema.description;

  // ✅ Use type-safe normalizeControlType with logging for unknown types
  const normalizedControl = normalizeControlTypeFn(schema.control, elementType, propertyKey);

  // ✅ State for local JSON text buffer when not using external buffer
  const [localJsonText, setLocalJsonText] = useState<string>(() => {
    if (value === undefined || value === null) return '{}';
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2);
  });
  const [localJsonError, setLocalJsonError] = useState<string | undefined>();
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset image error when value changes
  useEffect(() => {
    setImageError(false);
  }, [value]);

  // ✅ Use getInitialValueFromSchema to properly handle falsy values
  const getDisplayValue = useCallback((val: any) => {
    return getInitialValueFromSchema(schema, val);
  }, [schema]);

  // 🔍 DEBUG: Wrapper para logar todas as mudanças
  const handleChange = useCallback((newValue: any) => {
    appLogger.info('🎛️ [PropertyControl] onChange:', {
      data: [{
        propertyKey,
        oldValue: value,
        newValue,
        control: normalizedControl,
      }],
    });
    onChange(newValue);
  }, [propertyKey, value, normalizedControl, onChange]);

  // ✅ JSON Editor handler with text buffer
  const handleJsonChange = useCallback((textValue: string) => {
    if (onJsonTextChange) {
      // Use external buffer from useDraftProperties
      onJsonTextChange(textValue);
    } else {
      // Use local buffer
      setLocalJsonText(textValue);
      const { value: parsed, error: parseError, isValid } = safeParseJson(textValue);

      if (isValid) {
        setLocalJsonError(undefined);
        handleChange(parsed);
      } else {
        setLocalJsonError(parseError);
        // Don't call handleChange with invalid JSON - keep the previous valid value
      }
    }
  }, [onJsonTextChange, handleChange]);

  // Get JSON text to display
  const getJsonDisplayText = useCallback(() => {
    if (getJsonBuffer) {
      return getJsonBuffer();
    }
    return localJsonText;
  }, [getJsonBuffer, localJsonText]);

  const renderControl = () => {
    switch (normalizedControl) {
      case 'text': {
        // ✅ Preserve empty strings, don't replace with placeholder
        const displayValue = value !== undefined && value !== null ? String(value) : '';
        return (
          <Input
            id={propertyKey}
            value={displayValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={schema.default !== undefined ? String(schema.default) : ''}
            className={error ? 'border-red-500' : ''}
          />
        );
      }

      case 'textarea': {
        const displayValue = value !== undefined && value !== null ? String(value) : '';
        return (
          <Textarea
            id={propertyKey}
            value={displayValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={schema.default !== undefined ? String(schema.default) : ''}
            rows={4}
            className={error ? 'border-red-500' : ''}
          />
        );
      }

      case 'number': {
        // ✅ Preserve 0 as valid value, use default only when undefined/null
        const displayValue = getDisplayValue(value);
        const numValue = displayValue !== undefined && displayValue !== null ? displayValue : '';
        return (
          <Input
            id={propertyKey}
            type="number"
            value={numValue}
            onChange={(e) => {
              const num = e.target.value === '' ? undefined : Number(e.target.value);
              handleChange(num);
            }}
            min={schema.validation?.min}
            max={schema.validation?.max}
            step={schema.validation?.step}
            className={error ? 'border-red-500' : ''}
          />
        );
      }

      case 'range': {
        // ✅ Preserve 0 as valid value
        const displayValue = getDisplayValue(value);
        const rangeValue = typeof displayValue === 'number' ? displayValue : (schema.default ?? 0);
        const rangeMin = schema.validation?.min ?? 0;
        const rangeMax = schema.validation?.max ?? 100;
        const rangeStep = schema.validation?.step ?? 1;

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
              id={propertyKey}
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

      case 'toggle': {
        // ✅ Preserve false as valid value
        const displayValue = getDisplayValue(value);
        const boolValue = typeof displayValue === 'boolean'
          ? displayValue
          : (typeof schema.default === 'boolean' ? schema.default : false);
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={propertyKey}
              checked={boolValue}
              onCheckedChange={handleChange}
            />
            <span className="text-sm text-muted-foreground">
              {boolValue ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        );
      }

      case 'color-picker': {
        const displayValue = getDisplayValue(value);
        const colorValue = displayValue ?? schema.default ?? '#000000';
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={colorValue}
              onChange={(e) => handleChange(e.target.value)}
              className="w-16 h-10"
            />
            <Input
              type="text"
              value={colorValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              className={`flex-1 ${error ? 'border-red-500' : ''}`}
            />
          </div>
        );
      }

      case 'dropdown': {
        const displayValue = getDisplayValue(value);
        const selectValue = displayValue !== undefined && displayValue !== null
          ? String(displayValue)
          : (schema.default !== undefined ? String(schema.default) : '');
        return (
          <Select value={selectValue} onValueChange={handleChange}>
            <SelectTrigger id={propertyKey} className={error ? 'border-red-500' : ''}>
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
      }

      case 'options-list': {
        const optionsList = Array.isArray(value) ? value : [];

        return (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {optionsList.map((option: any, index: number) => (
              <div key={option.id || index} className="flex gap-2 p-2 border rounded bg-muted/30">
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

      case 'image-upload': {
        const displayValue = value !== undefined && value !== null ? String(value) : '';
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={displayValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="URL da imagem ou upload..."
              className={error ? 'border-red-500' : ''}
            />
            {displayValue && !imageError && (
              <img
                src={displayValue}
                alt="Preview"
                className="w-full h-32 object-cover rounded border"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        );
      }

      case 'json-editor': {
        // ✅ JSON Editor with text buffer - never directly writes invalid JSON to state
        const jsonError = error || localJsonError;
        const jsonText = getJsonDisplayText();

        return (
          <div className="space-y-2">
            <Textarea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder="{}"
              rows={6}
              className={`font-mono text-xs ${jsonError ? 'border-red-500' : ''}`}
            />
            {jsonError && (
              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-3 w-3" />
                <span>{jsonError}</span>
              </div>
            )}
          </div>
        );
      }

      default: {
        // ✅ Fallback with warning about unsupported control type
        const displayValue = value !== undefined && value !== null ? String(value) : '';
        return (
          <div className="space-y-1">
            <Input
              value={displayValue}
              onChange={(e) => handleChange(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Tipo de controle não suportado: {schema.control}
            </p>
          </div>
        );
      }
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
      {error && !['json-editor'].includes(normalizedControl) && (
        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  return (
    prevProps.propertyKey === nextProps.propertyKey &&
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.schema === nextProps.schema
  );
});

PropertyControl.displayName = 'PropertyControl';

export default DynamicPropertyControls;
