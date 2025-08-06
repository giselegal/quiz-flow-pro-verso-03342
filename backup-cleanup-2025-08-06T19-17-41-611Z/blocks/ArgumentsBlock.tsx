import React from "react";
import { InlineEditableText } from "./InlineEditableText";
import { Book, CheckCircle } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

const ArgumentsBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    title = "Por que escolher nosso produto?",
    items = [
      { text: "Qualidade superior garantida", icon: "CheckCircle" },
      { text: "Suporte 24/7", icon: "CheckCircle" },
      { text: "Entrega rápida", icon: "CheckCircle" },
    ],
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Fallback para ícone
  const getIcon = (iconName: string) => {
    if (iconName === "CheckCircle") {
      return <CheckCircle className="w-5 h-5 text-[#B89B7A] flex-shrink-0 mt-0.5" />;
    }
    // Se não é um ícone conhecido, trata como emoji ou usa bullet
    return <span className="text-xl flex-shrink-0">{iconName || "✅"}</span>;
  };

  return (
    <div
      className={`
        py-6 space-y-4 cursor-pointer transition-all duration-200
        ${isSelected ? "ring-1 ring-gray-400/40 bg-gray-50/30" : "hover:shadow-sm"}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <h3 className="text-xl font-bold text-center text-[#432818]">
        <InlineEditableText
          value={title}
          onChange={(value: string) => handlePropertyChange("title", value)}
          className="inline-block"
          placeholder="Título dos argumentos"
        />
      </h3>
      <div className="space-y-3">
        {(items || []).map((item: any, index: number) => (
          <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
            {getIcon(item.icon)}
            <p className="flex-1 text-[#432818]">{item.text}</p>
          </div>
        ))}
      </div>
      {(!items || items.length === 0) && (
        <div className="bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center">
          <Book className="w-12 h-12 mb-4 opacity-50" />
          <p>Configure os argumentos no painel de propriedades.</p>
        </div>
      )}
    </div>
  );
};

export default ArgumentsBlock;
