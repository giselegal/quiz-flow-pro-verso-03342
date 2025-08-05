import React from "react";
import { Mic } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

const AudioBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const { audioUrl = "", autoplay = false, controls = true } = block?.properties || {};

  return (
    <div
      className={`
        py-6 text-center cursor-pointer transition-all duration-200
        ${isSelected ? "ring-1 ring-gray-400/40 bg-gray-50/30" : "hover:shadow-sm"}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {audioUrl ? (
        <audio
          src={audioUrl}
          autoPlay={autoplay}
          controls={controls}
          className="w-full max-w-md mx-auto"
        >
          Seu navegador não suporta o elemento de áudio.
        </audio>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center max-w-md mx-auto">
          <Mic className="w-12 h-12 mb-4 opacity-50" />
          <p>Adicione uma URL de áudio nas propriedades.</p>
        </div>
      )}
    </div>
  );
};

export default AudioBlock;
