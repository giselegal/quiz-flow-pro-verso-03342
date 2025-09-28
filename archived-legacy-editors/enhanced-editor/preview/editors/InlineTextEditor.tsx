import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InlineTextEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  isPreviewing?: boolean; // Desabilita edição no modo preview
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  multiline = false,
  isPreviewing = false,
}) => {
  const [text, setText] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setText(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();

      if ('setSelectionRange' in editorRef.current) {
        const length = editorRef.current.value.length;
        editorRef.current.setSelectionRange(length, length);
      }
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setText(e.target.value);
    onChange?.(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange?.(text);
  };

  const handleClick = () => {
    if (!isPreviewing) {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      setIsEditing(false);
      onChange?.(text);
    }
  };

  if (multiline) {
    return (
      <div className="relative">
        {isEditing ? (
          <textarea
            ref={editorRef as React.RefObject<HTMLTextAreaElement>}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn('w-full min-h-[60px] resize-none', className)}
            rows={Math.max(3, text.split('\n').length)}
          />
        ) : (
          <div
            onClick={handleClick}
            className={cn(
              'w-full whitespace-pre-wrap',
              isPreviewing ? 'cursor-default' : 'cursor-text',
              !text && 'text-gray-400',
              className
            )}
          >
            {text || placeholder}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isEditing ? (
        <input
          ref={editorRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn('w-full', className)}
        />
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            'w-full',
            isPreviewing ? 'cursor-default' : 'cursor-text',
            !text && 'text-gray-400',
            className
          )}
        >
          {text || placeholder}
        </div>
      )}
    </div>
  );
};

export default InlineTextEditor;
