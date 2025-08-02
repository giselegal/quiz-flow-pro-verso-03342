
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';

interface ButtonBlockProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
  block?: any;
  onClick?: () => void;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
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
  const [localText, setLocalText] = useState(actualContent.buttonText || actualContent.text || '');
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocalText(actualContent.buttonText || actualContent.text || '');
  }, [actualContent.buttonText, actualContent.text]);

  const handleClick = () => {
    if (onSelect) onSelect();
    if (onClick) onClick();
  };

  const handleDoubleClick = () => {
    if (onUpdate) {
      setIsInlineEditing(true);
      setTimeout(() => {
        buttonRef.current?.focus();
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsInlineEditing(false);
    if (onUpdate && localText !== (actualContent.buttonText || actualContent.text)) {
      onUpdate({ buttonText: localText, text: localText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalText(actualContent.buttonText || actualContent.text || '');
      setIsInlineEditing(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isInlineEditing && actualContent.action === 'link' && actualContent.buttonUrl) {
      if (actualContent.buttonUrl.startsWith('http')) {
        window.open(actualContent.buttonUrl, '_blank');
      } else if (actualContent.buttonUrl.startsWith('/')) {
        window.location.href = actualContent.buttonUrl;
      } else if (actualContent.buttonUrl.startsWith('#')) {
        // Scroll to element
        const element = document.querySelector(actualContent.buttonUrl);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = actualContent.buttonUrl;
      }
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

  const buttonStyle = parseStyle(actualContent.style);
  const containerStyle = parseStyle(actualContent.style);

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg transition-all duration-200",
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
      <div className="flex justify-center">
        <button
          ref={buttonRef}
          contentEditable={isInlineEditing}
          suppressContentEditableWarning
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all duration-200 outline-none",
            buttonStyle.width === 'full' ? 'w-full' : buttonStyle.width ? `w-${buttonStyle.width}` : 'w-auto',
            buttonStyle.borderRadius ? `rounded-${buttonStyle.borderRadius}` : 'rounded-lg'
          )}
          style={{
            backgroundColor: buttonStyle.backgroundColor || '#3B82F6',
            color: buttonStyle.color || '#FFFFFF',
            fontSize: buttonStyle.fontSize || '1rem',
            fontWeight: buttonStyle.fontWeight || '500',
            padding: buttonStyle.padding || '0.75rem 1.5rem',
            borderRadius: buttonStyle.borderRadius || '0.5rem',
            boxShadow: buttonStyle.boxShadow || '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleButtonClick}
          onInput={(e) => {
            setLocalText(e.currentTarget.textContent || '');
          }}
        >
          {localText || 'Botão'}
        </button>
      </div>
      
      {isInlineEditing && (
        <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Editando - Enter para salvar, Esc para cancelar
        </div>
      )}
    </div>
  );
};

export default ButtonBlock;
