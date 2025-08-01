
import React, { useState, useEffect } from 'react';
import { EditableContent, EditorBlock } from '../../../types/editor';

interface TextBlockProps {
  block: EditorBlock;  // Mudado para receber o block inteiro
  isSelected?: boolean;
  isEditing?: boolean;
  onPropertyChange?: (key: string, value: any) => void;  // Mudado para corresponder ao padrão
  onSelect?: () => void;
  onClick?: () => void;
  className?: string;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onPropertyChange,
  onSelect,
  onClick,
  className
}) => {
  // Extraindo o content do block para manter compatibilidade
  const content = block.content || {};
  const [localText, setLocalText] = useState(content.text || '');

  useEffect(() => {
    setLocalText(content.text || '');
  }, [content.text]);

  const handleUpdate = (text: string) => {
    if (onPropertyChange) {
      onPropertyChange('text', text);
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-400 ring-offset-2" : ""
      } hover:bg-gray-50 cursor-pointer ${className || ""}`}
      onClick={onClick || onSelect}
      style={{
        color: content.style?.color,
        backgroundColor: content.style?.backgroundColor,
        fontSize: content.style?.fontSize,
        fontWeight: content.style?.fontWeight,
        textAlign: content.style?.textAlign as any,
        padding: content.style?.padding,
        margin: content.style?.margin
      }}
    >
      <div 
        className="min-h-[1.5rem] leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: localText || '<span class="text-gray-400">Adicione seu texto aqui</span>' 
        }}
      />
    </div>
  );
};

export default TextBlock;
