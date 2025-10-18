import React, { useState } from 'react';
import { AtomicBlockProps } from '@/types/blockProps';

export default function IntroFormBlock({
  block,
  isSelected,
  onClick,
  isEditable
}: AtomicBlockProps) {
  const [inputValue, setInputValue] = useState('');
  
  const label = block.properties?.label || 'Antes de começarmos, como posso te chamar?';
  const placeholder = block.properties?.placeholder || 'Digite seu primeiro nome aqui...';
  const buttonText = block.properties?.buttonText || 'Começar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditable && inputValue.trim()) {
      console.log('Nome enviado:', inputValue);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 my-6 transition-all ${isSelected ? 'ring-2 ring-primary p-4 rounded-lg' : ''}`}
      onClick={onClick}
    >
      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          required
          disabled={isEditable}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isEditable || !inputValue.trim()}
        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
      </button>
    </form>
  );
}
