import React, { useState, useCallback } from 'react';
import { EnhancedUploadProperty } from './types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, FileImage, Link2, ExternalLink } from 'lucide-react';
import { ContextualTooltip } from './ContextualTooltip';
import { useDropzone } from 'react-dropzone';

interface UploadValue {
  type: 'file' | 'url';
  url: string;
  name?: string;
  size?: number;
}

interface EnhancedUploadEditorProps {
  property: EnhancedUploadProperty;
  onChange: (value: UploadValue | null) => void;
}

export const EnhancedUploadEditor: React.FC<EnhancedUploadEditorProps> = ({
  property,
  onChange
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      onChange({
        type: 'file',
        url,
        name: file.name,
        size: file.size
      });
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: property.accept ? { [property.accept]: [] } : undefined,
    maxSize: property.maxSize,
    multiple: false
  });

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange({
        type: 'url',
        url: urlInput.trim()
      });
      setUrlInput('');
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  const value = property.value;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{property.label}</Label>
        <ContextualTooltip content="Faça upload de um arquivo ou insira uma URL" />
      </div>

      {/* Upload Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
        <Button
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
        >
          <Link2 className="h-4 w-4 mr-2" />
          URL
        </Button>
      </div>

      {/* Current Value Display */}
      {value && (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
          <FileImage className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {value.name || 'Arquivo carregado'}
            </p>
            {value.type === 'url' && (
              <a 
                href={value.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Ver original <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Interface */}
      {uploadMode === 'file' && !value && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive 
              ? 'Solte o arquivo aqui...' 
              : 'Clique ou arraste um arquivo aqui'
            }
          </p>
          {property.accept && (
            <p className="text-xs text-muted-foreground mt-1">
              Aceita: {property.accept}
            </p>
          )}
          {property.maxSize && (
            <p className="text-xs text-muted-foreground">
              Tamanho máximo: {Math.round(property.maxSize / 1024 / 1024)}MB
            </p>
          )}
        </div>
      )}

      {/* URL Input */}
      {uploadMode === 'url' && !value && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
          />
          <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
            Adicionar
          </Button>
        </div>
      )}
    </div>
  );
};