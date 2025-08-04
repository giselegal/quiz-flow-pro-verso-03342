import React from 'react';
import { EditableContent } from '@/types/editor';

interface TextBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  onContentChange?: (content: Partial<EditableContent>) => void;
  onClick?: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, isSelected, onContentChange, onClick }) => {
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
        isSelected ? 'border-blue-500 bg-[#B89B7A]/10' : ''
      }`}
      onClick={onClick}
    >
      <div style={textStyle}>{content.text || 'Clique para editar o texto...'}</div>
    </div>
  );
};

export default TextBlock;
