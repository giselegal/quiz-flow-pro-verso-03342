import React, { useState } from 'react';
import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (url: string) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, just create a local preview URL and simulate upload
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageUpload(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload('');
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {previewUrl ? (
        <div className="relative w-full">
          <img
            src={previewUrl}
            alt="Uploaded image"
            className="w-full h-auto max-h-64 object-contain rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8"
            onClick={handleRemoveImage}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div style={{ borderColor: '#E5DDD5' }}>
          <ImagePlus className="w-12 h-12 text-gray-400 mb-2" />
          <p style={{ color: '#8B7355' }}>Clique para fazer upload de uma imagem</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Enviando...' : 'Procurar imagens'}
          </Button>
        </div>
      )}
    </div>
  );
};
