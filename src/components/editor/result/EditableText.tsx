/**
 * 🎯 EDITABLE TEXT COMPONENT
 * 
 * Componente de texto editável inline para o editor
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Edit3, Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  renderAs?: (text: string, className?: string) => React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isEditing,
  className = '',
  placeholder = 'Digite aqui...',
  multiline = false,
  renderAs
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditingLocal && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingLocal]);

  const handleStartEdit = () => {
    if (!isEditing) return;
    setIsEditingLocal(true);
    setEditValue(value);
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditingLocal(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditingLocal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Modo de visualização
  if (!isEditing || !isEditingLocal) {
    const displayText = value || placeholder;
    
    if (renderAs) {
      return (
        <div
          className={cn(
            'relative group cursor-pointer',
            isEditing && 'hover:bg-blue-50/50 rounded p-1 -m-1'
          )}
          onClick={handleStartEdit}
        >
          {renderAs(displayText, className)}
          {isEditing && (
            <Edit3 className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      );
    }

    return (
      <div
        className={cn(
          'relative group cursor-pointer',
          className,
          isEditing && 'hover:bg-blue-50/50 rounded p-1 -m-1',
          !value && 'text-stone-400 italic'
        )}
        onClick={handleStartEdit}
      >
        {displayText}
        {isEditing && (
          <Edit3 className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    );
  }

  // Modo de edição
  return (
    <div className="relative">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full bg-white border-2 border-blue-500 rounded px-2 py-1 resize-none',
            className
          )}
          rows={3}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full bg-white border-2 border-blue-500 rounded px-2 py-1',
            className
          )}
        />
      )}
      
      {/* Controles de edição */}
      <div className="absolute -right-16 top-0 flex gap-1">
        <button
          onClick={handleSave}
          className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          title="Salvar"
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          title="Cancelar"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default EditableText;