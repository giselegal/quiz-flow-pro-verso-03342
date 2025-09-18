// @ts-nocheck
import { EditableContent } from '@/types/editor';

interface TextBlockProps {
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

const TextBlock: React.FC<TextBlockProps> = ({ content, isSelected, onContentChange, onClick }) => {
  // Create a proper style object with default values
  const textStyle = {
    color: content.color || '#000000',
    backgroundColor: content.backgroundColor || 'transparent',
    fontSize: content.fontSize || '1rem',
    fontWeight: content.fontWeight || 'normal',
    textAlign: (content.textAlign as any) || 'left',
    padding: content.padding || '0',
    margin: content.margin || '0',
  };

  return (
    <div
      className={`relative p-4 rounded border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors ${
        isSelected ? 'border-[#B89B7A] bg-[#B89B7A]/10' : ''
      }`}
      onClick={onClick}
    >
      <div style={textStyle}>{content.text || 'Clique para editar o texto...'}</div>
    </div>
  );
};

export default TextBlock;
