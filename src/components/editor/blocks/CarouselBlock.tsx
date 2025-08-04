import React, { useState, useEffect } from "react";
import { GalleryHorizontalEnd } from "lucide-react";
import type { BlockComponentProps } from "@/types/blocks";

const CarouselBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const { images = [], autoplay = true, interval = 5000 } = block.properties;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval || 5000);

    return () => clearInterval(timer);
  }, [autoplay, images, interval]);

  if (!images || images.length === 0) {
    return (
      <div
        className={`
          bg-gray-100 p-8 rounded-lg text-gray-500 flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-all duration-200
          ${
            isSelected
              ? "ring-1 ring-gray-400/40 bg-gray-50/30"
              : "hover:shadow-sm"
          }
          ${className}
        `}
        onClick={onClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <GalleryHorizontalEnd className="w-12 h-12 mb-4 opacity-50" />
        <p>Adicione imagens para o carrossel nas propriedades.</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "ring-1 ring-gray-400/40 bg-gray-50/30"
            : "hover:shadow-lg"
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <img
        src={currentImage.src}
        alt={currentImage.alt}
        className="w-full h-auto object-cover aspect-video"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/600x400/cccccc/333333?text=Erro+Imagem")
        }
      />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_: any, idx: number) => (
            <span
              key={idx}
              className={`block w-2 h-2 rounded-full ${currentIndex === idx ? "bg-white" : "bg-gray-400 opacity-75"}`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselBlock;
