import React, { useState, useRef, useEffect } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Save, X, Settings, Palette } from 'lucide-react';

interface InlineEditableBlockProps {
  block: Block;
  children: React.ReactNode;
  onBlockUpdate: (blockId: string, changes: Partial<Block>) => void;
  isActive: boolean;
  onActivate: (blockId: string) => void;
  className?: string;
}

export const InlineEditableBlock: React.FC<InlineEditableBlockProps> = ({
  block,
  children,
  onBlockUpdate,
  isActive,
  onActivate,
  className,
}) => {
  const [editMode, setEditMode] = useState<'text' | 'properties' | null>(null);
  const [tempText, setTempText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editMode === 'text') {
      setTimeout(() => {
        inputRef.current?.focus() || textareaRef.current?.focus();
      }, 100);
    }
  }, [editMode]);

  const handleStartTextEdit = () => {
    const currentText = block.content?.text || block.properties?.content || '';
    setTempText(currentText);
    setEditMode('text');
  };

  const handleSaveText = () => {
    const updates: Partial<Block> = {
      content: { ...block.content, text: tempText },
      properties: { ...block.properties, content: tempText },
    };
    onBlockUpdate(block.id, updates);
    setEditMode(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setTempText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveText();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const renderTextEditor = () => {
    const isLongText = tempText.length > 50;
    
    if (isLongText) {
      return (
        <Textarea
          ref={textareaRef}
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[80px] resize-none"
          placeholder="Digite o texto..."
        />
      );
    }

    return (
      <Input
        ref={inputRef}
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite o texto..."
        className="w-full"
      />
    );
  };

  return (
    <div
      className={cn(
        'relative group transition-all duration-200',
        isActive && 'ring-2 ring-primary ring-offset-2',
        'hover:ring-1 hover:ring-primary/50',
        className
      )}
      onClick={() => onActivate(block.id)}
    >
      {/* Block Content */}
      <div className={cn(editMode === 'text' && 'opacity-50 pointer-events-none')}>
        {children}
      </div>

      {/* Inline Text Editor */}
      {editMode === 'text' && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm border border-primary rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Editando texto
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveText} className="h-7">
                  <Save className="w-3 h-3 mr-1" />
                  Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {renderTextEditor()}
          </div>
        </div>
      )}

      {/* Edit Controls - Show on hover or when active */}
      {(isActive || editMode) && editMode !== 'text' && (
        <div className="absolute -top-2 -right-2 z-40 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleStartTextEdit();
            }}
            className="h-6 w-6 p-0"
            title="Editar texto"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setEditMode('properties');
            }}
            className="h-6 w-6 p-0"
            title="Editar propriedades"
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implementar editor de estilo
            }}
            className="h-6 w-6 p-0"
            title="Editar estilo"
          >
            <Palette className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Block Type Badge */}
      {isActive && (
        <div className="absolute -top-6 left-0 z-30">
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
            {block.type}
          </div>
        </div>
      )}
    </div>
  );
};