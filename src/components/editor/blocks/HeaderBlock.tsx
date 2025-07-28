
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';

interface HeaderBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({
  content,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(content.title || '');
  const [localSubtitle, setLocalSubtitle] = useState(content.subtitle || '');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setLocalTitle(content.title || '');
    setLocalSubtitle(content.subtitle || '');
  }, [content.title, content.subtitle]);

  const handleDoubleClick = (field: 'title' | 'subtitle') => {
    if (onUpdate) {
      setIsInlineEditing(true);
      setTimeout(() => {
        if (field === 'title') {
          titleRef.current?.focus();
        } else {
          subtitleRef.current?.focus();
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsInlineEditing(false);
    if (onUpdate && (localTitle !== content.title || localSubtitle !== content.subtitle)) {
      onUpdate({ title: localTitle, subtitle: localSubtitle });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalTitle(content.title || '');
      setLocalSubtitle(content.subtitle || '');
      setIsInlineEditing(false);
    }
  };

  const getHeaderSize = () => {
    switch (content.style?.fontSize) {
      case 'text-4xl': return 'h1';
      case 'text-3xl': return 'h2';
      case 'text-2xl': return 'h3';
      case 'text-xl': return 'h4';
      default: return 'h1';
    }
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        isInlineEditing && "ring-2 ring-green-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer",
        className
      )}
      onClick={onSelect}
      style={{
        backgroundColor: content.style?.backgroundColor,
        padding: content.style?.padding,
        margin: content.style?.margin,
        textAlign: content.style?.textAlign as any
      }}
    >
      <div className="text-center">
        {React.createElement(
          getHeaderSize(),
          {
            ref: titleRef,
            contentEditable: isInlineEditing,
            suppressContentEditableWarning: true,
            className: cn(
              "font-bold mb-2 outline-none",
              content.style?.fontSize || "text-3xl"
            ),
            style: {
              color: content.style?.color,
              fontWeight: content.style?.fontWeight,
              fontFamily: content.style?.fontFamily
            },
            onDoubleClick: () => handleDoubleClick('title'),
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            onInput: (e: React.FormEvent<HTMLHeadingElement>) => {
              setLocalTitle(e.currentTarget.textContent || '');
            }
          },
          localTitle || 'Título Principal'
        )}
        
        {(content.subtitle || isInlineEditing) && (
          <p
            ref={subtitleRef}
            contentEditable={isInlineEditing}
            suppressContentEditableWarning
            className="text-lg opacity-80 outline-none"
            style={{
              color: content.style?.color,
              fontFamily: content.style?.fontFamily
            }}
            onDoubleClick={() => handleDoubleClick('subtitle')}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onInput={(e) => {
              setLocalSubtitle(e.currentTarget.textContent || '');
            }}
          >
            {localSubtitle || 'Subtítulo opcional'}
          </p>
        )}
      </div>
      
      {isInlineEditing && (
        <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Editando - Enter para salvar, Esc para cancelar
        </div>
      )}
    </div>
  );
};

export default HeaderBlock;
