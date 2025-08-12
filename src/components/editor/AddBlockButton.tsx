import React, { useState } from 'react';
import { EditorBlock } from '@/types/editor';
import { Button } from '../ui/button';
import {
  Plus,
  Type,
  Image,
  ListChecks,
  MessageSquare,
  DollarSign,
  Shield,
  MousePointer,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AddBlockButtonProps {
  onAddBlock: (type: EditorBlock['type']) => void;
}

const AddBlockButton: React.FC<AddBlockButtonProps> = ({ onAddBlock }) => {
  const [open, setOpen] = useState(false);

  const handleAddBlock = (type: EditorBlock['type']) => {
    onAddBlock(type);
    setOpen(false);
  };

  const blockTypes = [
    { type: 'headline' as const, label: 'Título', icon: Type },
    { type: 'text' as const, label: 'Texto', icon: Type },
    { type: 'image' as const, label: 'Imagem', icon: Image },
    { type: 'benefits' as const, label: 'Benefícios', icon: ListChecks },
    {
      type: 'testimonials' as const,
      label: 'Depoimentos',
      icon: MessageSquare,
    },
    { type: 'pricing' as const, label: 'Preço', icon: DollarSign },
    { type: 'guarantee' as const, label: 'Garantia', icon: Shield },
    { type: 'cta' as const, label: 'Botão CTA', icon: MousePointer },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-[#B89B7A] hover:bg-[#8F7A6A]">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Bloco
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-1">
          {blockTypes.map(blockType => (
            <Button
              key={blockType.type}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => handleAddBlock(blockType.type)}
            >
              <blockType.icon className="w-4 h-4 mr-2 text-[#8F7A6A]" />
              {blockType.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { AddBlockButton };
