// =====================================================================
// components/editor/components/RichTextEditor.tsx - Editor de texto rico
// =====================================================================

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Link, Type, Palette, Eye, Code 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Digite aqui...",
  maxLength = 500,
  rows = 4
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                   before + selectedText + after + 
                   value.substring(end);
    
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newStart = start + before.length;
      const newEnd = newStart + selectedText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  }, [value, onChange]);

  const formatActions = [
    {
      icon: Bold,
      label: 'Negrito',
      action: () => insertFormatting('**', '**'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      label: 'Itálico',
      action: () => insertFormatting('*', '*'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      label: 'Sublinhado',
      action: () => insertFormatting('<u>', '</u>'),
      shortcut: 'Ctrl+U'
    },
    {
      icon: List,
      label: 'Lista',
      action: () => insertFormatting('- ', ''),
      shortcut: 'Ctrl+L'
    },
    {
      icon: ListOrdered,
      label: 'Lista Numerada',
      action: () => insertFormatting('1. ', ''),
      shortcut: 'Ctrl+Shift+L'
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertFormatting('[', '](url)'),
      shortcut: 'Ctrl+K'
    },
    {
      icon: Code,
      label: 'Código',
      action: () => insertFormatting('`', '`'),
      shortcut: 'Ctrl+`'
    }
  ];

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertFormatting('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('*', '*');
          break;
        case 'u':
          e.preventDefault();
          insertFormatting('<u>', '</u>');
          break;
        case 'k':
          e.preventDefault();
          insertFormatting('[', '](url)');
          break;
        case '`':
          e.preventDefault();
          insertFormatting('`', '`');
          break;
        case 'l':
          e.preventDefault();
          if (e.shiftKey) {
            insertFormatting('1. ', '');
          } else {
            insertFormatting('- ', '');
          }
          break;
      }
    }
  }, [insertFormatting]);

  const renderPreview = useCallback((text: string) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside">$1</ul>');
  }, []);

  return (
    <div className="space-y-2 mt-1">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {formatActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.action}
              className="h-8 w-8 p-0"
              title={`${action.label} (${action.shortcut})`}
            >
              <action.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="h-8 px-2"
            title="Alternar preview"
          >
            <Eye className="w-4 h-4 mr-1" />
            {isPreviewMode ? 'Editar' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      {isPreviewMode ? (
        <div 
          className="min-h-[100px] p-3 border rounded-md bg-gray-50 text-sm"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className="resize-none"
            onFocus={() => setShowToolbar(true)}
            onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
          />
          
          {/* Character counter */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Dicas: Use **negrito**, *itálico*, `código`, [link](url)</p>
        <p>Atalhos: Ctrl+B (negrito), Ctrl+I (itálico), Ctrl+K (link)</p>
      </div>
    </div>
  );
};
