/**
 * 🎨 Universal Property Renderer
 * 
 * Renders any property type with appropriate modern visual controls
 * Ensures ALL backend properties are accessible in NOCODE interface
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ColorPicker from '@/components/visual-controls/ColorPicker';
import { SpacingControl, GradientPicker, FileUploadControl, PositionControl } from '@/components/visual-controls/EnhancedControls';
import { PropertyType } from '@/hooks/useUnifiedProperties';
import { DiscoveredProperty } from './PropertyDiscovery';
import { Plus, Trash2, Eye, EyeOff, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversalPropertyRendererProps {
  property: DiscoveredProperty;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  showAdvanced?: boolean;
  compact?: boolean;
}

/**
 * Text Input Renderer
 */
const TextRenderer: React.FC<{
  property: DiscoveredProperty;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium">{property.label}</Label>
      {property.description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{property.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <Input
      type={property.type === PropertyType.EMAIL ? 'email' : property.type === PropertyType.URL ? 'url' : 'text'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || !property.isEditable}
      placeholder={`Digite ${property.label.toLowerCase()}`}
      className="w-full"
    />
  </div>
);

/**
 * Textarea Renderer
 */
const TextareaRenderer: React.FC<{
  property: DiscoveredProperty;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{property.label}</Label>
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || !property.isEditable}
      placeholder={`Digite ${property.label.toLowerCase()}`}
      className="min-h-[80px] resize-y"
    />
  </div>
);

/**
 * Number Input Renderer
 */
const NumberRenderer: React.FC<{
  property: DiscoveredProperty;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{property.label}</Label>
    <Input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      disabled={disabled || !property.isEditable}
      min={property.constraints?.min}
      max={property.constraints?.max}
      step={property.constraints?.step || 1}
      className="w-full"
    />
  </div>
);

/**
 * Range Slider Renderer
 */
const RangeRenderer: React.FC<{
  property: DiscoveredProperty;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium">{property.label}</Label>
      <Badge variant="outline" className="text-xs">
        {value || property.defaultValue}
      </Badge>
    </div>
    <Slider
      value={[value || property.defaultValue || 0]}
      onValueChange={(values) => onChange(values[0])}
      disabled={disabled || !property.isEditable}
      min={property.constraints?.min || 0}
      max={property.constraints?.max || 100}
      step={property.constraints?.step || 1}
      className="w-full"
    />
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{property.constraints?.min || 0}</span>
      <span>{property.constraints?.max || 100}</span>
    </div>
  </div>
);

/**
 * Switch Renderer
 */
const SwitchRenderer: React.FC<{
  property: DiscoveredProperty;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => (
  <div className="flex items-center justify-between space-x-2">
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium">{property.label}</Label>
      {property.description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{property.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <Switch
      checked={!!value}
      onCheckedChange={onChange}
      disabled={disabled || !property.isEditable}
    />
  </div>
);

/**
 * Select Dropdown Renderer
 */
const SelectRenderer: React.FC<{
  property: DiscoveredProperty;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{property.label}</Label>
    <Select
      value={value || property.defaultValue}
      onValueChange={onChange}
      disabled={disabled || !property.isEditable}
    >
      <SelectTrigger>
        <SelectValue placeholder={`Selecione ${property.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {property.options?.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

/**
 * Array Renderer (for lists of items)
 */
const ArrayRenderer: React.FC<{
  property: DiscoveredProperty;
  value: any[];
  onChange: (value: any[]) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => {
  const handleAddItem = () => {
    const newValue = [...(value || []), ''];
    onChange(newValue);
  };

  const handleRemoveItem = (index: number) => {
    const newValue = (value || []).filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleUpdateItem = (index: number, newItem: any) => {
    const newValue = [...(value || [])];
    newValue[index] = newItem;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{property.label}</Label>
        <Button
          size="sm"
          onClick={handleAddItem}
          disabled={disabled || !property.isEditable}
          className="h-8 px-2"
        >
          <Plus className="w-3 h-3 mr-1" />
          Adicionar
        </Button>
      </div>
      <div className="space-y-2">
        {(value || []).map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => handleUpdateItem(index, e.target.value)}
              disabled={disabled || !property.isEditable}
              placeholder={`Item ${index + 1}`}
              className="flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRemoveItem(index)}
              disabled={disabled || !property.isEditable}
              className="h-9 w-9 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Object Renderer (for complex objects)
 */
const ObjectRenderer: React.FC<{
  property: DiscoveredProperty;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
}> = ({ property, value, onChange, disabled }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{property.label}</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 px-2"
        >
          {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </Button>
      </div>
      {isExpanded && (
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <Textarea
              value={JSON.stringify(value || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  onChange(parsed);
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              disabled={disabled || !property.isEditable}
              className="font-mono text-xs min-h-[120px]"
              placeholder="JSON object"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Main Universal Property Renderer Component
 */
export const UniversalPropertyRenderer: React.FC<UniversalPropertyRendererProps> = ({
  property,
  value,
  onChange,
  disabled = false,
  showAdvanced = false,
  compact = false,
}) => {
  // Hide advanced properties unless explicitly shown
  if (property.isAdvanced && !showAdvanced) {
    return null;
  }

  const renderProps = { property, value, onChange, disabled };

  const getRenderer = () => {
    // Handle special cases with enhanced controls
    const keyLower = property.key.toLowerCase();
    
    // Spacing controls for margin, padding, etc.
    if (keyLower.includes('margin') || keyLower.includes('padding') || keyLower.includes('spacing')) {
      return (
        <SpacingControl
          value={value || {}}
          onChange={onChange}
          label={property.label}
          sides={['top', 'right', 'bottom', 'left']}
        />
      );
    }
    
    // Position controls
    if (keyLower.includes('position') && typeof value === 'object') {
      return (
        <PositionControl
          value={value || {}}
          onChange={onChange}
          label={property.label}
        />
      );
    }
    
    // Gradient controls
    if (keyLower.includes('gradient') || (keyLower.includes('background') && typeof value === 'string' && value.includes('gradient'))) {
      return (
        <GradientPicker
          value={value || ''}
          onChange={onChange}
          label={property.label}
        />
      );
    }

    switch (property.type) {
      case PropertyType.TEXTAREA:
      case PropertyType.RICH_TEXT:
      case PropertyType.MARKDOWN:
      case PropertyType.CODE:
        return <TextareaRenderer {...renderProps} />;
      
      case PropertyType.NUMBER:
        return <NumberRenderer {...renderProps} />;
      
      case PropertyType.RANGE:
        return <RangeRenderer {...renderProps} />;
      
      case PropertyType.COLOR:
        return (
          <div className="space-y-2">
            <ColorPicker 
              label={property.label}
              value={value || property.defaultValue || '#000000'}
              onChange={onChange}
            />
          </div>
        );
      
      case PropertyType.SWITCH:
        return <SwitchRenderer {...renderProps} />;
      
      case PropertyType.SELECT:
        return <SelectRenderer {...renderProps} />;
      
      case PropertyType.ARRAY:
        return <ArrayRenderer {...renderProps} />;
      
      case PropertyType.OBJECT:
        return <ObjectRenderer {...renderProps} />;
      
      case PropertyType.UPLOAD:
        return (
          <FileUploadControl
            value={value || ''}
            onChange={onChange}
            label={property.label}
            accept="image/*"
          />
        );
      
      default:
        return <TextRenderer {...renderProps} />;
    }
  };

  if (compact) {
    return (
      <div className={cn(
        "p-3 border rounded-lg",
        property.isAdvanced && "border-dashed opacity-75"
      )}>
        {getRenderer()}
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-2",
      property.isAdvanced && "opacity-75"
    )}>
      {getRenderer()}
      {property.isAdvanced && (
        <Badge variant="secondary" className="text-xs">
          Avançado
        </Badge>
      )}
    </div>
  );
};

export default UniversalPropertyRenderer;