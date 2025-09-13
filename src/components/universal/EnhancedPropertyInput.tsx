/**
 * 🎨 EnhancedPropertyInput - Input inteligente com feedback visual
 * Combina debounce, feedback visual e validação
 */

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PropertyChangeIndicator } from './PropertyChangeIndicator';
import { usePropertyDebounce } from '@/hooks/usePropertyDebounce';
import { useId } from 'react';

interface EnhancedPropertyInputProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number' | 'url' | 'email';
  description?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
  rows?: number;
}

export const EnhancedPropertyInput: React.FC<EnhancedPropertyInputProps> = ({
  label,
  value,
  placeholder,
  type = 'text',
  description,
  onChange,
  debounceMs = 300,
  className = '',
  rows = 3,
}) => {
  const {
    value: currentValue,
    isChanging,
    hasChanged,
    updateValue,
  } = usePropertyDebounce(value, {
    debounceMs,
    onUpdate: onChange,
  });

  const uniqueId = useId();
  const inputId = `property-${uniqueId}-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    updateValue(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId} style={{ color: '#6B4F43' }}>
        {label}
      </Label>

      <PropertyChangeIndicator isChanging={isChanging} hasChanged={hasChanged}>
        {type === 'textarea' ? (
          <Textarea
            id={inputId}
            value={currentValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={rows}
            style={{ boxShadow: '0 0 0 3px rgba(184, 155, 122, 0.5)' }}
          />
        ) : (
          <Input
            id={inputId}
            type={type}
            value={currentValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            style={{ boxShadow: '0 0 0 3px rgba(184, 155, 122, 0.5)' }}
          />
        )}
      </PropertyChangeIndicator>

      {description && <p style={{ color: '#8B7355' }}>{description}</p>}
    </div>
  );
};

export default EnhancedPropertyInput;
