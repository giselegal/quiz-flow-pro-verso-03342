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
import { schemaInterpreter, PropertySchema } from '@/core/schema/SchemaInterpreter';

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
  console.log('🎛️ [DynamicPropertyControls] Renderizando:', {
    elementType,
    hasSchema: !!schema,
    propertiesKeys: Object.keys(properties),
    schemaPropertiesKeys: schema ? Object.keys(schema.properties) : []
  });

  if (!schema) {
    return (
      <div className="text-sm text-muted-foreground">
        Schema não encontrado para tipo: <code>{elementType}</code>
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

  const renderControl = () => {
    switch (schema.control) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.default || ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.default || ''}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || schema.default || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={schema.validation?.min}
            max={schema.validation?.max}
          />
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || schema.default || false}
              onCheckedChange={onChange}
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
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-10"
            />
            <Input
              type="text"
              value={value || schema.default || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

      case 'dropdown':
        return (
          <Select value={value || schema.default} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'image-upload':
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
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
                onChange(parsed);
              } catch {
                onChange(e.target.value);
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
            onChange={(e) => onChange(e.target.value)}
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

export default DynamicPropertyControls;
