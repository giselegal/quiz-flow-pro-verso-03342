
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus, Minus, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PropertySchema } from '../../../config/blockDefinitionsClean';

interface PropertyFieldProps {
  property: PropertySchema;
  value: any;
  onChange: (value: any) => void;
}

export const PropertyField: React.FC<PropertyFieldProps> = ({ property, value, onChange }) => {
  const [showHelp, setShowHelp] = useState(false);

  const renderField = () => {
    switch (property.type) {
      case 'text-input':
        return (
          <Input
            value={value || property.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            className="w-full"
          />
        );

      case 'text-area':
        return (
          <Textarea
            value={value || property.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            rows={property.rows || 3}
            className="w-full resize-none"
          />
        );

      case 'number-input':
        return (
          <Input
            type="number"
            value={value || property.defaultValue || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={property.min}
            max={property.max}
            step={property.step || 1}
            className="w-full"
          />
        );

      case 'range-slider':
        const sliderValue = value || property.defaultValue || property.min || 0;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Slider
                value={[sliderValue]}
                onValueChange={(values) => onChange(values[0])}
                min={property.min || 0}
                max={property.max || 100}
                step={property.step || 1}
                className="flex-1 mr-3"
              />
              <div className="w-16 text-right text-sm font-medium">
                {sliderValue}{property.unit || ''}
              </div>
            </div>
          </div>
        );

      case 'boolean-switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value !== undefined ? value : property.defaultValue}
              onCheckedChange={onChange}
            />
            <span className="text-sm text-gray-600">
              {value ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        );

      case 'select':
        return (
          <Select
            value={value || property.defaultValue}
            onValueChange={onChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'color-picker':
        return (
          <div className="flex items-center space-x-2">
            <div
              className="w-10 h-10 rounded-md border-2 border-gray-200 cursor-pointer"
              style={{ backgroundColor: value || property.defaultValue || '#000000' }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'color';
                input.value = value || property.defaultValue || '#000000';
                input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
                input.click();
              }}
            />
            <Input
              value={value || property.defaultValue || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

      case 'image-url':
        return (
          <div className="space-y-2">
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full"
            />
            {value && (
              <div className="relative">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'file-upload':
        return (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full h-20 border-dashed border-2 flex flex-col gap-2"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => onChange(e.target?.result);
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs">Upload Imagem</span>
            </Button>
            {value && (
              <div className="relative">
                <img
                  src={value}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={() => onChange('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );

      case 'url':
        return (
          <Input
            type="url"
            value={value || property.defaultValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://exemplo.com"
            className="w-full"
          />
        );

      case 'datetime-local':
        return (
          <Input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        );

      case 'array-editor':
        const arrayValue = Array.isArray(value) ? value : property.defaultValue || [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                {property.itemSchema ? (
                  <div className="flex-1 space-y-2">
                    {property.itemSchema.map((schema) => (
                      <div key={schema.key} className="space-y-1">
                        <Label className="text-xs">{schema.label}</Label>
                        <PropertyField
                          property={schema}
                          value={item[schema.key]}
                          onChange={(newValue) => {
                            const newArray = [...arrayValue];
                            newArray[index] = { ...item, [schema.key]: newValue };
                            onChange(newArray);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Input
                    value={typeof item === 'string' ? item : item.text || ''}
                    onChange={(e) => {
                      const newArray = [...arrayValue];
                      newArray[index] = typeof item === 'string' ? e.target.value : { ...item, text: e.target.value };
                      onChange(newArray);
                    }}
                    className="flex-1"
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    onChange(newArray);
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newItem = property.itemSchema
                  ? property.itemSchema.reduce((acc, schema) => ({
                      ...acc,
                      [schema.key]: schema.defaultValue || ''
                    }), {})
                  : '';
                onChange([...arrayValue, newItem]);
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500 italic">
            Tipo de campo não implementado: {property.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium text-gray-700">
            {property.label}
            {property.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {property.description && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowHelp(!showHelp)}
            >
              <Info className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {showHelp && property.description && (
        <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
          {property.description}
        </div>
      )}

      {renderField()}
    </div>
  );
};
