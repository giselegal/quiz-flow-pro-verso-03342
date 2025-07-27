
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';

interface TextBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  content,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [localText, setLocalText] = useState(content.text || '');
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalText(content.text || '');
  }, [content.text]);

  const handleDoubleClick = () => {
    if (onUpdate) {
      setIsInlineEditing(true);
      setTimeout(() => {
        textRef.current?.focus();
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsInlineEditing(false);
    if (onUpdate && localText !== content.text) {
      onUpdate({ text: localText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalText(content.text || '');
      setIsInlineEditing(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setLocalText(e.currentTarget.textContent || '');
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        isInlineEditing && "ring-2 ring-green-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer",
        className
      )}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
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
      {isInlineEditing ? (
        <div
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          className="outline-none min-h-[1.5rem] leading-relaxed"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: localText }}
        />
      ) : (
        <div 
          className="min-h-[1.5rem] leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: localText || '<span class="text-gray-400">Clique duplo para editar texto...</span>' 
          }}
        />
      )}
      
      {isInlineEditing && (
        <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Editando - Enter para salvar, Esc para cancelar
        </div>
      )}
    </div>
  );
};

export default TextBlock;
