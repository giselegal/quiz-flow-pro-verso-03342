import React, { useState } from "react";
import { EditorBlock } from "@/types/editor";
import { Button } from "../ui/button";
import {
  Plus,
  Type,
  Image,
  ListChecks,
  MessageSquare,
  DollarSign,
  Shield,
  MousePointer,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AddBlockButtonProps {
  onAddBlock: (type: EditorBlock["type"]) => void;
}

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return "";

  const prefix = type === "top" ? "mt" : type === "bottom" ? "mb" : type === "left" ? "ml" : "mr";

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const AddBlockButton: React.FC<AddBlockButtonProps> = ({ onAddBlock }) => {
  const [open, setOpen] = useState(false);

  const handleAddBlock = (type: EditorBlock["type"]) => {
    onAddBlock(type);
    setOpen(false);
  };

  const blockTypes = [
    { type: "headline" as const, label: "Título", icon: Type },
    { type: "text" as const, label: "Texto", icon: Type },
    { type: "image" as const, label: "Imagem", icon: Image },
    { type: "benefits" as const, label: "Benefícios", icon: ListChecks },
    {
      type: "testimonials" as const,
      label: "Depoimentos",
      icon: MessageSquare,
    },
    { type: "pricing" as const, label: "Preço", icon: DollarSign },
    { type: "guarantee" as const, label: "Garantia", icon: Shield },
    { type: "cta" as const, label: "Botão CTA", icon: MousePointer },
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
