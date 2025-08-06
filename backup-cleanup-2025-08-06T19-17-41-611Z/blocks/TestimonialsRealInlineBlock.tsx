import React from "react";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";
import type { BlockData } from "@/types/blocks";

interface TestimonialsRealInlineBlockProps {
  block: BlockData;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente inline para depoimentos reais da etapa 20
 * 100% responsivo, mobile-first com máximo 2 colunas
 */
const TestimonialsRealInlineBlock: React.FC<TestimonialsRealInlineBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  const properties = block.properties || {};
  const testimonials = properties.testimonials || [
    {
      name: "Ana Silva",
      text: "A consultoria mudou completamente minha forma de me vestir. Agora me sinto mais confiante e elegante!",
      rating: 5,
      image: "https://placehold.co/80x80/cccccc/333333?text=AS",
      occupation: "Executiva",
    },
  ];
  const title = properties.title || "Depoimentos Reais";
  const layout = properties.layout || "grid";
  const showRating = properties.showRating !== false;

  const handleEdit = (field: string, value: any) => {
    if (onPropertyChange && !disabled) {
      onPropertyChange(field, value);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn("w-4 h-4", i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
      />
    ));
  };

  const renderTestimonial = (testimonial: any, index: number) => (
    <div
      key={index}
      className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col"
    >
      {/* Quote Icon */}
      <Quote className="w-6 h-6 text-pink-400 mb-3 flex-shrink-0" />

      {/* Depoimento */}
      <p className="text-gray-700 text-sm md:text-base mb-4 flex-grow leading-relaxed">
        "{testimonial.text}"
      </p>

      {/* Rating */}
      {showRating && (
        <div className="flex items-center gap-1 mb-3">{renderStars(testimonial.rating || 5)}</div>
      )}

      {/* Cliente Info */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image || "https://placehold.co/50x50/cccccc/333333?text=?"}
          alt={testimonial.name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-pink-200"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
          {testimonial.occupation && (
            <p className="text-gray-600 text-xs">{testimonial.occupation}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "w-full p-4 md:p-6 transition-all duration-200",
        "bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg",
        isSelected && "ring-2 ring-pink-400 bg-pink-50",
        !disabled && "cursor-pointer hover:bg-pink-50/80",
        className
      )}
      onClick={onClick}
    >
      {/* Título */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2">{title}</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full" />
      </div>

      {/* Grid de Depoimentos */}
      <div
        className={cn(
          "grid gap-4 md:gap-6",
          layout === "grid" && testimonials.length > 1
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1",
          "auto-rows-fr" // Altura uniforme
        )}
      >
        {testimonials.map((testimonial: any, index: number) =>
          renderTestimonial(testimonial, index)
        )}
      </div>
    </div>
  );
};

export default TestimonialsRealInlineBlock;
