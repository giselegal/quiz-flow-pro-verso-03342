
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Download, ArrowRight } from 'lucide-react';

interface ButtonBlockProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  onClick?: () => void;
  className?: string;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  content,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  onClick,
  className
}) => {
  const [localButtonText, setLocalButtonText] = useState(content.buttonText || '');

  useEffect(() => {
    setLocalButtonText(content.buttonText || '');
  }, [content.buttonText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      setLocalButtonText(content.buttonText || '');
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (content.action === 'link' && content.url) {
      window.open(content.url, '_blank');
    }
  };

  const getButtonIcon = () => {
    if (!content.buttonUrl) return null;
    
    if (content.buttonUrl.startsWith('mailto:')) {
      return <Mail className="h-4 w-4 mr-2" />;
    }
    if (content.buttonUrl.includes('download')) {
      return <Download className="h-4 w-4 mr-2" />;
    }
    if (content.buttonUrl.startsWith('http')) {
      return <ExternalLink className="h-4 w-4 mr-2" />;
    }
    return <ArrowRight className="h-4 w-4 mr-2" />;
  };

  const getButtonVariant = () => {
    const style = content.style?.backgroundColor;
    if (style?.includes('blue')) return 'default';
    if (style?.includes('green')) return 'default';
    if (style?.includes('red')) return 'destructive';
    if (style?.includes('gray')) return 'secondary';
    return 'default';
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        isInlineEditing && "ring-2 ring-green-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer",
        content.style?.textAlign === 'center' && "text-center",
        content.style?.textAlign === 'right' && "text-right",
        className
      )}
      onClick={onSelect}
      style={{
        backgroundColor: content.style?.backgroundColor,
        padding: content.style?.padding,
        margin: content.style?.margin
      }}
    >
      <Button
        ref={buttonRef}
        variant={getButtonVariant()}
        size="lg"
        className={cn(
          "relative transition-all duration-200",
          isInlineEditing && "ring-2 ring-green-400",
          content.style?.width && `w-${content.style.width}`,
          content.style?.borderRadius && `rounded-${content.style.borderRadius}`
        )}
        style={{
          backgroundColor: content.style?.backgroundColor,
          color: content.style?.color,
          fontSize: content.style?.fontSize,
          fontWeight: content.style?.fontWeight,
          padding: content.style?.padding,
          borderRadius: content.style?.borderRadius,
          boxShadow: content.style?.boxShadow
        }}
        onClick={handleButtonClick}
        onDoubleClick={onClick}
        title="Clique para editar no Painel de Propriedades"
      >
        {getButtonIcon()}
        <span>{localButtonText || 'Texto do botão'}</span>
      </Button>
      
      {isInlineEditing && (
        <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Editando - Enter para salvar, Esc para cancelar
        </div>
      )}
      
      {isSelected && !content.buttonUrl && (
        <div className="absolute -bottom-6 left-0 bg-orange-500 text-white px-2 py-1 rounded text-xs">
          Adicione uma URL no painel de propriedades
        </div>
      )}
    </div>
  );
};

export default ButtonBlock;
