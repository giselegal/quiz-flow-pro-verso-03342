
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  content: initialContent,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  // Ensure content is always an object with default values
  const content = initialContent || {
    imageUrl: '',
    imageAlt: 'Imagem',
    caption: '',
    style: {
      width: '100%',
      borderRadius: '8px'
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpdate) return;

    setIsUploading(true);
    
    try {
      // Simular upload - em produção, fazer upload real
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onUpdate({
          imageUrl,
          imageAlt: content.imageAlt || file.name
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro no upload:', error);
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput && onUpdate) {
      onUpdate({
        imageUrl: urlInput,
        imageAlt: content.imageAlt || 'Imagem'
      });
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    if (onUpdate) {
      onUpdate({
        imageUrl: '',
        imageAlt: ''
      });
    }
  };

  // Ensure style object exists
  const style = content.style || {};

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer",
        className
      )}
      onClick={onSelect}
      style={{
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        margin: style.margin,
        textAlign: style.textAlign as any
      }}
    >
      {content.imageUrl ? (
        <div className="relative group">
          <img
            src={content.imageUrl}
            alt={content.imageAlt || 'Imagem'}
            className={cn(
              "max-w-full h-auto rounded-lg",
              style.width && `w-${style.width}`,
              style.height && `h-${style.height}`,
              style.objectFit && `object-${style.objectFit}`
            )}
            style={{
              borderRadius: style.borderRadius,
              boxShadow: style.boxShadow
            }}
          />
          
          {isSelected && onUpdate && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="p-1 h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {content.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {content.caption}
            </p>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Enviando...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-gray-600">Adicione uma imagem</p>
              
              {onUpdate && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Upload de Arquivo
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="w-full"
                  >
                    Adicionar por URL
                  </Button>
                  
                  {showUrlInput && (
                    <div className="flex gap-2">
                      <Input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="flex-1"
                      />
                      <Button onClick={handleUrlSubmit} size="sm">
                        OK
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
