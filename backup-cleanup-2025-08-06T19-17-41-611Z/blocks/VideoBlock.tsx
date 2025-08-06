import React from "react";
import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "../../../types/blocks";

interface VideoBlockProps extends BlockComponentProps {
  disabled?: boolean;
}

const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  // Debug das propriedades recebidas
  console.log("🔍 [VideoBlock] Propriedades recebidas:", block.properties);

  const { title = "VideoBlock Título", content = "Conteúdo do VideoBlock" } =
    block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full p-4 rounded-lg border-2 border-dashed",
        isSelected ? "border-[#B89B7A] bg-[#B89B7A]/10" : "border-gray-300 bg-white",
        "cursor-pointer hover:border-gray-400 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#aa6b5d] mb-4">{title}</h3>
        <p className="text-[#432818]">{content}</p>
      </div>
    </div>
  );
};

export default VideoBlock;
