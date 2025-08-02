
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';

interface HeaderBlockProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  onClick?: () => void;
  className?: string;
  block?: any;
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({
  content = {},
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  onClick,
  className,
  block
}) => {
  const actualContent = content || block?.content || {};
  
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(actualContent.title || '');
  const [localSubtitle, setLocalSubtitle] = useState(actualContent.subtitle || '');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setLocalTitle(actualContent.title || '');
    setLocalSubtitle(actualContent.subtitle || '');
  }, [actualContent.title, actualContent.subtitle]);

  const handleClick = () => {
    if (onSelect) onSelect();
    if (onClick) onClick();
  };

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
    if (onUpdate && (localTitle !== actualContent.title || localSubtitle !== actualContent.subtitle)) {
      onUpdate({ title: localTitle, subtitle: localSubtitle });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalTitle(actualContent.title || '');
      setLocalSubtitle(actualContent.subtitle || '');
      setIsInlineEditing(false);
    }
  };

  const getHeaderSize = () => {
    const styleObj = typeof actualContent.style === 'string' 
      ? (() => {
          try { return JSON.parse(actualContent.style); } 
          catch { return {}; }
        })()
      : actualContent.style || {};

    switch (styleObj.fontSize) {
      case 'text-4xl': return 'h1';
      case 'text-3xl': return 'h2';
      case 'text-2xl': return 'h3';
      case 'text-xl': return 'h4';
      default: return 'h1';
    }
  };

  // Parse style object if it's a string
  const parseStyle = (styleString?: string) => {
    if (!styleString) return {};
    if (typeof styleString === 'object') return styleString;
    
    try {
      return JSON.parse(styleString);
    } catch {
      return {};
    }
  };

  const containerStyle = parseStyle(actualContent.style);

  return (
    <div
      className={cn(
        "relative p-6 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        isInlineEditing && "ring-2 ring-green-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer",
        className
      )}
      onClick={handleClick}
      style={{
        backgroundColor: containerStyle.backgroundColor,
        padding: containerStyle.padding,
        margin: containerStyle.margin,
        textAlign: containerStyle.textAlign as any
      }}
    >
      <div className="text-center">
        {/* Logo */}
        {actualContent.logo && (
          <img 
            src={actualContent.logo} 
            alt={actualContent.logoAlt || 'Logo'} 
            className="mx-auto w-36 mb-6" 
            style={{
              width: actualContent.logoWidth,
              height: actualContent.logoHeight
            }}
          />
        )}

        {/* Title */}
        {React.createElement(
          getHeaderSize(),
          {
            ref: titleRef,
            contentEditable: isInlineEditing,
            suppressContentEditableWarning: true,
            className: cn(
              "font-bold mb-2 outline-none",
              containerStyle.fontSize || "text-3xl"
            ),
            style: {
              color: containerStyle.color,
              fontWeight: containerStyle.fontWeight,
              fontFamily: containerStyle.fontFamily
            },
            onDoubleClick: () => handleDoubleClick('title'),
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            onInput: (e: React.FormEvent<HTMLHeadingElement>) => {
              setLocalTitle(e.currentTarget.textContent || '');
            }
          },
          localTitle || 'Novo Cabeçalho'
        )}
        
        {/* Subtitle */}
        {(actualContent.subtitle || localSubtitle || isInlineEditing) && (
          <p
            ref={subtitleRef}
            contentEditable={isInlineEditing}
            suppressContentEditableWarning
            className="text-lg opacity-80 outline-none"
            style={{
              color: containerStyle.color,
              fontFamily: containerStyle.fontFamily
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
