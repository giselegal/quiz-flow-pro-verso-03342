import React, { useState } from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
import type { Block } from '@/types/editor';

interface IntroFormBlockProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
  onNameSubmit?: (name: string) => void;
}

export default function IntroFormBlock({
  block,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
  onNameSubmit,
}: IntroFormBlockProps) {
  const [inputValue, setInputValue] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Compatibilidade JSON v3 (section.content) + legado (properties)
  const label = (block as any)?.content?.formQuestion
    || block.properties?.label
    || 'Antes de começarmos, como posso te chamar?';
  const placeholder = (block as any)?.content?.namePlaceholder
    || block.properties?.placeholder
    || 'Digite seu primeiro nome aqui...';
  const buttonText = (block as any)?.content?.submitText
    || block.properties?.buttonText
    || 'Quero Descobrir meu Estilo Agora!';
  const helperText = (block as any)?.content?.helperText as string | undefined;
  const privacyNotice = (block as any)?.content?.privacyNotice || block.properties?.privacyNotice;

  // 🔥 TRACKING: Input focus
  const handleInputFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      window.dispatchEvent(new CustomEvent('quiz-form-started', {
        detail: {
          blockId: block.id,
          stepNumber: 1,
          formType: 'intro-name',
          timestamp: Date.now(),
        },
      }));
    }
  };

  // 🔥 TRACKING: Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    window.dispatchEvent(new CustomEvent('quiz-name-entered', {
      detail: {
        blockId: block.id,
        nameLength: newValue.length,
        hasSpaces: newValue.includes(' '),
        timestamp: Date.now(),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditable && inputValue.trim()) {
      const trimmedName = inputValue.trim();

      // 🔥 TRACKING: Form submitted
      window.dispatchEvent(new CustomEvent('quiz-form-submitted', {
        detail: {
          blockId: block.id,
          stepNumber: 1,
          formType: 'intro-name',
          nameLength: trimmedName.length,
          hasSpaces: trimmedName.includes(' '),
          timestamp: Date.now(),
        },
      }));

      // 🔥 TRACKING: Name collected (lead captured!)
      window.dispatchEvent(new CustomEvent('quiz-name-collected', {
        detail: {
          blockId: block.id,
          name: trimmedName, // Ou hash se quiser privacidade: btoa(trimmedName)
          stepNumber: 1,
          timestamp: Date.now(),
        },
      }));

      onNameSubmit?.(trimmedName);
      appLogger.debug('Nome enviado:', trimmedName);
    }
  };

  return (
    <SelectableBlock
      blockId={block.id}
      isSelected={isSelected}
      isEditable={isEditable}
      onSelect={() => onSelect?.(block.id)}
      blockType="Formulário de Nome"
      blockIndex={block.order || 0}
      onOpenProperties={() => onOpenProperties?.(block.id)}
      isDraggable={true}
    >
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto mt-8">
        <form
          className="w-full space-y-6"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="w-full space-y-3">
            <label
              htmlFor="user-name-input"
              className="block text-center text-sm font-medium uppercase tracking-wide"
              style={{ color: '#6B4F43' }}
            >
              {label}
            </label>
            <input
              id="user-name-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              required
              disabled={isEditable}
              className="w-full px-4 py-3 text-base text-center border-2 rounded-lg focus:ring-2 focus:ring-opacity-50 transition-all outline-none"
              style={{
                borderColor: '#B89B7A',
                backgroundColor: '#FFF',
                color: '#432818',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isEditable || !inputValue.trim()}
            className="w-full py-3 px-6 font-semibold rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: '#B89B7A' }}
          >
            {buttonText}
          </button>
          {(helperText || privacyNotice) && (
            <p className="text-xs text-center text-gray-500 pt-1">
              {helperText || privacyNotice}
            </p>
          )}
        </form>
      </div>
    </SelectableBlock>
  );
}

