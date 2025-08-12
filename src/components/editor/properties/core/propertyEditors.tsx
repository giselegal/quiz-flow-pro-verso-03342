import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import ColorPicker from '@/components/visual-controls/ColorPicker';
import React from 'react';
import type { PropertyEditorProps, PropertyEditorRegistry } from './types';

// Editor de texto básico
const TextEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Input
      id={property.key}
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
    />
  </div>
);

// Editor de área de texto
const TextareaEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Textarea
      id={property.key}
      value={property.value || ''}
      onChange={e => onChange(property.key, e.target.value)}
    />
  </div>
);

// Editor de cor
const ColorEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <ColorPicker
      value={property.value || '#000000'}
      onChange={color => onChange(property.key, color)}
    />
  </div>
);

// Editor de número com slider
const NumberEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Slider
      id={property.key}
      value={[property.value || 0]}
      onValueChange={([value]) => onChange(property.key, value)}
      min={0}
      max={100}
      step={1}
    />
  </div>
);

// Editor de switch/toggle
const SwitchEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => (
  <div className="flex items-center justify-between">
    <Label htmlFor={property.key}>{property.label}</Label>
    <Switch
      id={property.key}
      checked={property.value || false}
      onCheckedChange={checked => onChange(property.key, checked)}
    />
  </div>
);

// Registro de editores
export const propertyEditors: PropertyEditorRegistry = {
  text: TextEditor,
  textarea: TextareaEditor,
  color: ColorEditor,
  number: NumberEditor,
  switch: SwitchEditor,
};

// HOC para selecionar editor automaticamente
export const withPropertyEditor = (propertyType: string) => {
  const Editor = propertyEditors[propertyType] || TextEditor;
  return Editor;
};
