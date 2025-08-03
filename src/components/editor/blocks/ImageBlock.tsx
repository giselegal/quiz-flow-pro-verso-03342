import React from 'react';
import { EditableContent } from '@/types/editor';

interface ImageBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  onContentChange?: (content: Partial<EditableContent>) => void;
  onClick?: () => void;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  content,
  isSelected,
  onContentChange,
  onClick
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onContentChange) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onContentChange({
          url: e.target?.result as string,
          alt: content.alt || 'Uploaded image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Create a proper style object with default values
  const containerStyle = {
    backgroundColor: content.backgroundColor || 'transparent',
    padding: content.padding || '0',
    margin: content.margin || '0',
    textAlign: (content.textAlign as any) || 'center',
  };

  const imageStyle = {
    width: content.width || '100%',
    height: content.height || 'auto',
    objectFit: (content.objectFit as any) || 'cover',
    display: 'block',
    margin: '0 auto',
    borderRadius: content.borderRadius || '0.5rem',
    boxShadow: content.boxShadow || 'none',
  };

  return (
    <div 
      className={`relative ${isSelected ? 'ring-2 ring-yellow-500' : ''}`}
      style={containerStyle}
      onClick={onClick}
    >
      {content.url ? (
        <img
          src={content.url}
          alt={content.alt || 'Image'}
          style={imageStyle}
          className="cursor-pointer"
        />
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Clique para adicionar uma imagem</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-stone-600 hover:bg-stone-700 cursor-pointer"
          >
            Selecionar Imagem
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
