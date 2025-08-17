// @ts-nocheck
import { Upload } from 'lucide-react';
import { EditableContent } from '@/types/editor';

interface ImageBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  onContentChange?: (content: Partial<EditableContent>) => void;
  onClick?: () => void;
}

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const ImageBlock: React.FC<ImageBlockProps> = ({
  content,
  isSelected,
  onContentChange,
  onClick,
}) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onContentChange) {
      const reader = new FileReader();
      reader.onload = e => {
        onContentChange({
          url: e.target?.result as string,
          alt: content.alt || 'Uploaded image',
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
      className={`relative ${isSelected ? 'ring-2 ring-brand' : ''}`}
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
        <div style={{ borderColor: '#E5DDD5' }}>
          <div className="text-stone-400 mb-4">
            <Upload size={48} />
          </div>
          <p className="text-stone-600 mb-4">Clique para adicionar uma imagem</p>
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
