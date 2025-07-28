import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, Type, Image, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Upload } from 'lucide-react';
import { PropertySchema } from '@/config/blockDefinitionsClean';

interface PropertyInputProps {
  schema: PropertySchema;
  currentValue: any;
  onValueChange: (newValue: any) => void;
  // Para array-editor
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  onUpdateItem?: (index: number, field: string, value: any) => void;
}

export const PropertyInput: React.FC<PropertyInputProps> = ({
  schema,
  currentValue,
  onValueChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem
}) => {
  const handleInputChange = (value: any) => {
    onValueChange(value);
  };

  // Renderizar preview de imagem
  const renderImagePreview = (url: string) => {
    if (!url) return null;
    return (
      <img 
        src={url} 
        alt="Preview" 
        className="mt-2 max-w-32 h-20 object-cover rounded border"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  };

  switch (schema.type) {
    case 'text-input':
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <Input
            id={schema.key}
            value={currentValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value)}
            placeholder={schema.placeholder}
          />
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    case 'textarea':
    case 'text-area': // Alias para compatibilidade
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <Textarea
            id={schema.key}
            value={currentValue || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e.target.value)}
            placeholder={schema.placeholder}
            rows={schema.rows || 3}
          />
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    case 'number-input':
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <Input
            id={schema.key}
            type="number"
            value={currentValue || ''}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            placeholder={schema.placeholder}
            min={schema.min}
            max={schema.max}
          />
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    case 'boolean-switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={schema.key}
            checked={currentValue || false}
            onCheckedChange={handleInputChange}
          />
          <Label htmlFor={schema.key}>{schema.label}</Label>
          {schema.description && (
            <p className="text-xs text-gray-500 ml-2">{schema.description}</p>
          )}
        </div>
      );

    case 'color-picker':
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={schema.key}
              type="color"
              value={currentValue || '#000000'}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              type="text"
              value={currentValue || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    case 'font-size-slider':
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>{schema.label}</Label>
            <span className="text-sm text-gray-500">{currentValue || 14}px</span>
          </div>
          <Slider
            value={[currentValue || 14]}
            onValueChange={(value) => handleInputChange(value[0])}
            max={schema.max || 72}
            min={schema.min || 8}
            step={1}
            className="w-full"
          />
        </div>
      );

    case 'font-weight-buttons':
      return (
        <div className="space-y-2">
          <Label>{schema.label}</Label>
          <div className="flex gap-1">
            {['Normal', 'Médio', 'Semi', 'Negrito'].map((weight, index) => {
              const weights = ['400', '500', '600', '700'];
              const isActive = currentValue === weights[index];
              return (
                <Button
                  key={weight}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange(weights[index])}
                  className={`flex-1 ${isActive ? 'bg-[#B89B7A] hover:bg-[#a08965]' : ''}`}
                >
                  {weight}
                </Button>
              );
            })}
          </div>
        </div>
      );

    case 'text-style-buttons':
      return (
        <div className="space-y-2">
          <Label>{schema.label}</Label>
          <div className="flex gap-1">
            <Button
              variant={currentValue?.includes('italic') ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const styles = currentValue ? currentValue.split(' ') : [];
                const hasItalic = styles.includes('italic');
                const newStyles = hasItalic 
                  ? styles.filter(s => s !== 'italic')
                  : [...styles, 'italic'];
                handleInputChange(newStyles.join(' '));
              }}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={currentValue?.includes('underline') ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const styles = currentValue ? currentValue.split(' ') : [];
                const hasUnderline = styles.includes('underline');
                const newStyles = hasUnderline 
                  ? styles.filter(s => s !== 'underline')
                  : [...styles, 'underline'];
                handleInputChange(newStyles.join(' '));
              }}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );

    case 'text-align-buttons':
      return (
        <div className="space-y-2">
          <Label>{schema.label}</Label>
          <div className="flex gap-1">
            {[
              { value: 'left', icon: AlignLeft },
              { value: 'center', icon: AlignCenter },
              { value: 'right', icon: AlignRight }
            ].map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={currentValue === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleInputChange(value)}
                className={`flex-1 ${currentValue === value ? 'bg-[#B89B7A] hover:bg-[#a08965]' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
      );

    case 'content-type-buttons':
      return (
        <div className="space-y-2">
          <Label>{schema.label}</Label>
          <div className="flex gap-1">
            <Button
              variant={currentValue === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleInputChange('text')}
              className={`flex-1 ${currentValue === 'text' ? 'bg-[#B89B7A] hover:bg-[#a08965]' : ''}`}
            >
              <Type className="w-4 h-4 mr-1" />
              Texto
            </Button>
            <Button
              variant={currentValue === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleInputChange('image')}
              className={`flex-1 ${currentValue === 'image' ? 'bg-[#B89B7A] hover:bg-[#a08965]' : ''}`}
            >
              <Image className="w-4 h-4 mr-1" />
              Imagem
            </Button>
          </div>
        </div>
      );

    case 'color-palette':
      return (
        <div className="space-y-2">
          <Label>{schema.label}</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Cor do Texto</Label>
              <div className="flex items-center space-x-2 mt-1">
                <div 
                  className="w-8 h-8 rounded border cursor-pointer"
                  style={{ backgroundColor: currentValue?.text || '#000000' }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = currentValue?.text || '#000000';
                    input.onchange = (e) => {
                      handleInputChange({
                        ...currentValue,
                        text: (e.target as HTMLInputElement).value
                      });
                    };
                    input.click();
                  }}
                />
                <span className="text-xs">{currentValue?.text || '#f29c'}</span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Cor de Fundo</Label>
              <div className="flex items-center space-x-2 mt-1">
                <div 
                  className="w-8 h-8 rounded border cursor-pointer"
                  style={{ backgroundColor: currentValue?.background || 'transparent' }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = currentValue?.background || '#ffffff';
                    input.onchange = (e) => {
                      handleInputChange({
                        ...currentValue,
                        background: (e.target as HTMLInputElement).value
                      });
                    };
                    input.click();
                  }}
                />
                <span className="text-xs">{currentValue?.background || 'transp'}</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <select
            id={schema.key}
            value={currentValue || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione...</option>
            {schema.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    case 'image-url':
    case 'image-upload': // Novo tipo para upload de arquivo
      if (schema.type === 'image-upload') {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          accept: { 'image/*': [] },
          onDrop: (files) => {
            if (files.length > 0) {
              const file = files[0];
              // Simular URL para preview (em produção, enviar para servidor)
              const url = URL.createObjectURL(file);
              handleInputChange(url);
            }
          }
        });

        return (
          <div className="space-y-2">
            <Label htmlFor={schema.key}>{schema.label}</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600">Solte a imagem aqui...</p>
              ) : (
                <div>
                  <p className="text-gray-600">Arraste uma imagem ou clique para selecionar</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF até 10MB</p>
                </div>
              )}
            </div>
            {currentValue && renderImagePreview(currentValue)}
          </div>
        );
      }
      
      // Fallback para image-url
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <Input
            id={schema.key}
            type="url"
            value={currentValue || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={schema.placeholder}
          />
          {currentValue && renderImagePreview(currentValue)}
        </div>
      );

    case 'video-url':
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <Input
            id={schema.key}
            type="url"
            value={currentValue || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={schema.placeholder}
          />
          {currentValue && (
            <video 
              src={currentValue} 
              controls 
              className="mt-2 max-w-full h-32 rounded border"
            />
          )}
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    case 'array-editor':
      const arrayValue = Array.isArray(currentValue) ? currentValue : [];
      
      return (
        <div className="space-y-2">
          <Label>{schema.label}</Label>
          <div className="space-y-2 p-3 border border-gray-200 rounded">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                <div className="flex-1 space-y-2">
                  {schema.itemSchema?.map((itemProp) => (
                    <PropertyInput
                      key={itemProp.key}
                      schema={itemProp}
                      currentValue={item[itemProp.key]}
                      onValueChange={(value) => 
                        onUpdateItem?.(index, itemProp.key, value)
                      }
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem?.(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={onAddItem}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar {schema.label}
            </Button>
          </div>
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    case 'json-editor':
      const jsonValue = currentValue ? JSON.stringify(currentValue, null, 2) : '';
      
      return (
        <div className="space-y-2">
          <Label htmlFor={schema.key}>{schema.label}</Label>
          <Textarea
            id={schema.key}
            value={jsonValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleInputChange(parsed);
              } catch (error) {
                // Manter o valor como string até ser válido
                console.warn('JSON inválido:', error);
              }
            }}
            placeholder={schema.placeholder}
            rows={schema.rows || 6}
            className="font-mono text-sm"
          />
          {schema.description && (
            <p className="text-xs text-gray-500">{schema.description}</p>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label>{schema.label}</Label>
          <p className="text-sm text-red-500">
            Tipo de campo não suportado: {schema.type}
          </p>
        </div>
      );
  }
};
