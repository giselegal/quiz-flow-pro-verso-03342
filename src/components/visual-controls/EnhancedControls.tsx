/**
 * 🎨 Enhanced Visual Controls for NOCODE Interface
 * 
 * Additional modern visual controls for property types not covered by basic components
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Link, Upload, Move, RotateCcw } from 'lucide-react';

/**
 * Spacing Control - for margins, padding, etc.
 */
interface SpacingControlProps {
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  label?: string;
  sides?: ('top' | 'right' | 'bottom' | 'left')[];
  linkedByDefault?: boolean;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  value = {},
  onChange,
  label = 'Espaçamento',
  sides = ['top', 'right', 'bottom', 'left'],
  linkedByDefault = false
}) => {
  const [isLinked, setIsLinked] = useState(linkedByDefault);

  const sideLabels = {
    top: 'Superior',
    right: 'Direita',
    bottom: 'Inferior',
    left: 'Esquerda'
  };

  const handleValueChange = (side: string, newValue: number) => {
    if (isLinked) {
      const newValues: Record<string, number> = {};
      sides.forEach(s => newValues[s] = newValue);
      onChange(newValues);
    } else {
      onChange({ ...value, [side]: newValue });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsLinked(!isLinked)}
          className={cn(
            "h-8 px-2 text-xs",
            isLinked && "bg-blue-50 border-blue-200"
          )}
        >
          {isLinked ? '🔗' : '🔓'} {isLinked ? 'Vinculado' : 'Individual'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sides.map(side => (
          <div key={side} className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              {sideLabels[side]}
            </Label>
            <Input
              type="number"
              value={value[side] || 0}
              onChange={(e) => handleValueChange(side, parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
              min="0"
              max="100"
            />
          </div>
        ))}
      </div>

      {!isLinked && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const resetValues: Record<string, number> = {};
            sides.forEach(s => resetValues[s] = 0);
            onChange(resetValues);
          }}
          className="w-full h-8 text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Resetar
        </Button>
      )}
    </div>
  );
};

/**
 * Gradient Picker Control
 */
interface GradientPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const GradientPicker: React.FC<GradientPickerProps> = ({
  value,
  onChange,
  label = 'Gradiente'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetGradients = [
    'linear-gradient(45deg, #ff6b6b, #feca57)',
    'linear-gradient(45deg, #48cae4, #023e8a)',
    'linear-gradient(45deg, #b79ced, #667eea)',
    'linear-gradient(45deg, #f093fb, #f5576c)',
    'linear-gradient(45deg, #4facfe, #00f2fe)',
    'linear-gradient(45deg, #43e97b, #38f9d7)',
    'linear-gradient(45deg, #fa709a, #fee140)',
    'linear-gradient(45deg, #a8edea, #fed6e3)',
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-10 justify-start"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{ background: value || 'transparent' }}
              />
              <span className="text-sm truncate">
                {value ? 'Gradiente personalizado' : 'Selecionar gradiente'}
              </span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Gradientes Pré-definidos</Label>
              <div className="grid grid-cols-2 gap-2">
                {presetGradients.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange(gradient);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full h-12 rounded border-2 hover:scale-105 transition-transform',
                      value === gradient
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    )}
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Gradiente Personalizado</Label>
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="linear-gradient(45deg, #ff0000, #00ff00)"
                className="font-mono text-xs"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {value && (
        <div
          className="w-full h-8 rounded border"
          style={{ background: value }}
        />
      )}
    </div>
  );
};

/**
 * Enhanced File Upload Control
 */
interface FileUploadControlProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  accept?: string;
  maxSize?: string;
  showPreview?: boolean;
}

export const FileUploadControl: React.FC<FileUploadControlProps> = ({
  value,
  onChange,
  label = 'Arquivo',
  accept = 'image/*',
  maxSize = '2MB',
  showPreview = true
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    // In a real implementation, this would upload to a service like Cloudinary
    // For now, we'll create a local object URL
    // Revoke previous object URL if exists
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    onChange(url);
  };

  // Cleanup object URL on unmount or when value changes away from objectUrl
  React.useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);
  const isImage = value && (value.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(value));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
          <Button
            size="sm"
            variant={uploadMode === 'url' ? 'default' : 'ghost'}
            onClick={() => setUploadMode('url')}
            className="h-6 px-2 text-xs"
          >
            <Link className="w-3 h-3 mr-1" />
            URL
          </Button>
          <Button
            size="sm"
            variant={uploadMode === 'upload' ? 'default' : 'ghost'}
            onClick={() => setUploadMode('upload')}
            className="h-6 px-2 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {uploadMode === 'url' ? (
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
            isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileSelect(file);
          }}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Arraste um arquivo ou clique para selecionar
          </p>
          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
            id="file-upload"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Selecionar Arquivo
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Máximo: {maxSize} • Formatos: {accept}
          </p>
        </div>
      )}

      {value && showPreview && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              {isImage ? (
                <img
                  src={value}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {isImage ? 'Imagem' : 'Arquivo'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onChange('')}
                    className="h-6 px-2 text-xs"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Position Control - for absolute positioning
 */
interface PositionControlProps {
  value: { x?: number; y?: number; };
  onChange: (value: { x?: number; y?: number; }) => void;
  label?: string;
  maxX?: number;
  maxY?: number;
}

export const PositionControl: React.FC<PositionControlProps> = ({
  value = {},
  onChange,
  label = 'Posição',
  maxX = 100,
  maxY = 100
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">X (Horizontal)</Label>
          <Slider
            value={[value.x || 0]}
            onValueChange={(values) => onChange({ ...value, x: values[0] })}
            max={maxX}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{value.x || 0}</span>
            <span>{maxX}</span>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Y (Vertical)</Label>
          <Slider
            value={[value.y || 0]}
            onValueChange={(values) => onChange({ ...value, y: values[0] })}
            max={maxY}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{value.y || 0}</span>
            <span>{maxY}</span>
          </div>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onChange({ x: 0, y: 0 })}
        className="w-full h-8 text-xs"
      >
        <Move className="w-3 h-3 mr-1" />
        Centralizar
      </Button>
    </div>
  );
};