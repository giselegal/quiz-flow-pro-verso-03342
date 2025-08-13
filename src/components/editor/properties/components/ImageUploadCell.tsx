import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadCellProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string, imageFile?: File) => void;
  className?: string;
  size?: number;
  disabled?: boolean;
  placeholder?: string;
}

export const ImageUploadCell: React.FC<ImageUploadCellProps> = ({
  imageUrl,
  onImageChange,
  className,
  size = 60,
  disabled = false,
  placeholder = "Adicionar imagem"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.');
      return;
    }

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo: 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Criar URL temporária para preview
      const temporaryUrl = URL.createObjectURL(file);
      onImageChange(temporaryUrl, file);
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      toast.error('Erro ao carregar imagem');
    } finally {
      setIsUploading(false);
    }
  }, [disabled, onImageChange]);

  const handleClick = useCallback(() => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  }, [disabled, isUploading]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Limpar input para permitir reusar o mesmo arquivo
    e.target.value = '';
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange('');
  }, [onImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [disabled, handleFileSelect]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer group",
        dragOver && "border-primary bg-primary/5",
        !dragOver && imageUrl && "border-border",
        !dragOver && !imageUrl && "border-border hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      style={{ width: size, height: size }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground leading-tight">
                {placeholder}
              </span>
            </>
          )}
        </div>
      )}

      {dragOver && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  );
};