import React, { useState } from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const buttonVariant = block.properties?.buttonVariant || 'primary';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditable && inputValue.trim()) {
      // In production, trigger next step
      console.log('Nome enviado:', inputValue);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 my-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <div className="space-y-2">
        <Label className="text-base font-medium">{label}</Label>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full"
          disabled={isEditable}
        />
      </div>
      <Button
        type="submit"
        variant={buttonVariant as any}
        className="w-full"
        disabled={isEditable || !inputValue.trim()}
      >
        {buttonText}
      </Button>
    </form>
  );
}
