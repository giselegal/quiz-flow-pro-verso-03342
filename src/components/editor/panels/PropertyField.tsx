import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
import { Switch } from '@radix-ui/react-switch'; // Update to correct import if using Radix UI
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyFieldProps {
  property: {
    key: string;
    label: string;
    type: string;
    description?: string;
    required?: boolean;
    options?: Array<{ label: string; value: string }>;
    min?: number;
    max?: number;
    step?: number;
    rows?: number;
    accept?: string;
    placeholder?: string;
    defaultValue?: any;
  };
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

export const PropertyField: React.FC<PropertyFieldProps> = ({
  property,
  value,
  onChange,
  className,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const renderField = () => {
    switch (property.type) {
      case 'text-input':
        return (
          <Input
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder}
            className="w-full"
          />
        );

      case 'text-area':
        return (
          <Textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder}
            rows={property.rows || 3}
            className="w-full"
          />
        );

      case 'number-input':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={e => onChange(Number(e.target.value))}
            min={property.min}
            max={property.max}
            step={property.step}
            placeholder={property.placeholder}
            className="w-full"
          />
        );

      case 'range-slider':
        return (
          <div className="space-y-2">
            <Slider
              value={[value || 0]}
              onValueChange={values => onChange(values[0])}
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
              className="w-full"
            />
            <div style={{ color: '#8B7355' }}>{value || 0}</div>
          </div>
        );

      case 'boolean-switch':
        return (
          <div className="flex items-center justify-between">
            <Switch checked={Boolean(value)} onCheckedChange={onChange} />
            <span style={{ color: '#6B4F43' }}>{value ? 'Ativado' : 'Desativado'}</span>
          </div>
        );

      case 'color-picker':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={e => onChange(e.target.value)}
              className="w-16 h-10 p-1 rounded border"
            />
            <Input
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={property.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'file-upload':
        return (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full h-20 border-dashed"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = property.accept || 'image/*';
                input.onchange = e => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => onChange(reader.result);
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-5 h-5" />
                <span className="text-sm">Upload</span>
              </div>
            </Button>
            {value && (
              <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="URL da imagem"
                className="w-full"
              />
            )}
          </div>
        );

      case 'url':
        return (
          <Input
            type="url"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder || 'https://'}
            className="w-full"
          />
        );

      case 'datetime-local':
        return (
          <Input
            type="datetime-local"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="w-full"
          />
        );

      case 'array':
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={e => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    onChange(newArray);
                  }}
                  placeholder={`Item ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    onChange(newArray);
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange([...arrayValue, ''])}
              className="w-full"
            >
              + Adicionar Item
            </Button>
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={property.placeholder}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label style={{ color: '#6B4F43' }}>
          {property.label}
          {property.required && <span style={{ color: '#432818' }}>*</span>}
        </Label>

        {property.description && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-[#B89B7A] hover:text-[#B89B7A]"
            onClick={() => setShowHelp(!showHelp)}
          >
            <Info className="w-4 h-4" />
          </Button>
        )}
      </div>

      {renderField()}

      {showHelp && property.description && (
        <div className="p-3 bg-[#B89B7A]/10 border border-[#B89B7A]/30 rounded-md">
          <p className="text-sm text-[#432818]">{property.description}</p>
        </div>
      )}
    </div>
  );
};
