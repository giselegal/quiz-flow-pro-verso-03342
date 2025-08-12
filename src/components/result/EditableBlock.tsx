import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X, Plus, Trash2, Image as ImageIcon, Type, List, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableBlockProps {
  type: 'header' | 'text' | 'image' | 'benefits' | 'quote' | 'cta';
  content: any;
  onUpdate: (content: any) => void;
  onDelete?: () => void;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const EditableBlock: React.FC<EditableBlockProps> = ({
  type,
  content,
  onUpdate,
  onDelete,
  className,
  isSelected = false,
  onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const renderHeader = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Input
            ref={inputRef}
            value={editContent.title || ''}
            onChange={e => setEditContent({ ...editContent, title: e.target.value })}
            placeholder="Título"
            className="text-2xl font-bold"
          />
          <Input
            value={editContent.subtitle || ''}
            onChange={e => setEditContent({ ...editContent, subtitle: e.target.value })}
            placeholder="Subtítulo"
            className="text-lg"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#432818]">{content.title || 'Título'}</h1>
        {content.subtitle && <p style={{ color: '#6B4F43' }}>{content.subtitle}</p>}
      </div>
    );
  };

  const renderText = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Textarea
            ref={textareaRef}
            value={editContent.text || ''}
            onChange={e => setEditContent({ ...editContent, text: e.target.value })}
            placeholder="Seu texto aqui..."
            rows={4}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return <p style={{ color: '#6B4F43' }}>{content.text || 'Clique para editar este texto...'}</p>;
  };

  const renderImage = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Input
            value={editContent.imageUrl || ''}
            onChange={e => setEditContent({ ...editContent, imageUrl: e.target.value })}
            placeholder="URL da imagem"
          />
          <Input
            value={editContent.imageAlt || ''}
            onChange={e => setEditContent({ ...editContent, imageAlt: e.target.value })}
            placeholder="Texto alternativo"
          />
          <Input
            value={editContent.caption || ''}
            onChange={e => setEditContent({ ...editContent, caption: e.target.value })}
            placeholder="Legenda (opcional)"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        {content.imageUrl ? (
          <img
            src={content.imageUrl}
            alt={content.imageAlt || 'Imagem'}
            className="mx-auto rounded-lg max-w-full h-auto"
          />
        ) : (
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p style={{ color: '#8B7355' }}>Clique para adicionar imagem</p>
          </div>
        )}
        {content.caption && <p style={{ color: '#6B4F43' }}>{content.caption}</p>}
      </div>
    );
  };

  const renderBenefits = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Input
            value={editContent.title || ''}
            onChange={e => setEditContent({ ...editContent, title: e.target.value })}
            placeholder="Título dos benefícios"
          />
          <div className="space-y-2">
            {(editContent.items || ['']).map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={e => {
                    const newItems = [...(editContent.items || [''])];
                    newItems[index] = e.target.value;
                    setEditContent({ ...editContent, items: newItems });
                  }}
                  placeholder={`Benefício ${index + 1}`}
                />
                <Button
                  onClick={() => {
                    const newItems = (editContent.items || ['']).filter(
                      (_: any, i: number) => i !== index
                    );
                    setEditContent({ ...editContent, items: newItems });
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => {
                const newItems = [...(editContent.items || ['']), ''];
                setEditContent({ ...editContent, items: newItems });
              }}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar item
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-xl font-semibold mb-4 text-[#432818]">
          {content.title || 'Benefícios'}
        </h3>
        <ul className="space-y-2">
          {(content.items || []).map((item: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-1">
                ✓
              </Badge>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderQuote = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Textarea
            value={editContent.quote || ''}
            onChange={e => setEditContent({ ...editContent, quote: e.target.value })}
            placeholder="Citação..."
            rows={3}
          />
          <Input
            value={editContent.author || ''}
            onChange={e => setEditContent({ ...editContent, author: e.target.value })}
            placeholder="Autor"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <blockquote className="border-l-4 border-[#B89B7A] pl-6 italic">
        <p style={{ color: '#6B4F43' }}>
          "{content.quote || 'Clique para adicionar uma citação...'}"
        </p>
        {content.author && <cite style={{ color: '#6B4F43' }}>— {content.author}</cite>}
      </blockquote>
    );
  };

  const renderCTA = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Input
            value={editContent.text || ''}
            onChange={e => setEditContent({ ...editContent, text: e.target.value })}
            placeholder="Texto do botão"
          />
          <Input
            value={editContent.href || ''}
            onChange={e => setEditContent({ ...editContent, href: e.target.value })}
            placeholder="URL do link"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <Button
          className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-3 text-lg"
          onClick={() => content.href && window.open(content.href, '_blank')}
        >
          {content.text || 'Clique aqui'}
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'header':
        return renderHeader();
      case 'text':
        return renderText();
      case 'image':
        return renderImage();
      case 'benefits':
        return renderBenefits();
      case 'quote':
        return renderQuote();
      case 'cta':
        return renderCTA();
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'header':
        return <Type className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'benefits':
        return <List className="w-4 h-4" />;
      case 'quote':
        return <Quote className="w-4 h-4" />;
      case 'cta':
        return <Type className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  return (
    <Card
      className={cn(
        'p-6 cursor-pointer transition-all duration-200 relative group',
        isSelected && 'ring-2 ring-[#B89B7A] border-[#B89B7A]',
        className
      )}
      onClick={onClick}
    >
      {/* Control buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          onClick={e => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          variant="secondary"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Pencil className="w-3 h-3" />
        </Button>
        {onDelete && (
          <Button
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            variant="secondary"
            size="sm"
            style={{ color: '#432818' }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Type indicator */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Badge variant="secondary" className="flex items-center gap-1">
          {getIcon()}
          {type}
        </Badge>
      </div>

      {renderContent()}
    </Card>
  );
};
