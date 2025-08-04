import React, { useState, useEffect } from "react";
import { Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import type { BlockComponentProps } from "@/types/blocks";

const QuizOfferTestimonialsBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    title = "O que nossas clientes dizem",
    textColor = "#432818",
    backgroundColor = "#f9fafb",
    testimonials = [
      {
        name: "Marina S.",
        text: "Finalmente entendi meu estilo! Agora me visto com muito mais confiança.",
        rating: 5,
      },
      {
        name: "Juliana R.",
        text: "O guia transformou completamente meu guarda-roupa. Vale cada centavo!",
        rating: 5,
      },
      {
        name: "Carla M.",
        text: "Nunca pensei que descobrir meu estilo seria tão fácil e prático.",
        rating: 5,
      },
    ],
    showStats = true,
    totalCustomers = "+10.000 mulheres transformadas",
    averageRating = "4.9/5 estrelas",
  } = block.properties;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={`
        w-full py-16 px-4 transition-all duration-200
        ${
          isSelected
            ? "ring-1 ring-gray-400/40 bg-gray-50/30"
            : "hover:shadow-sm"
        }
        ${className}
      `}
      style={{ backgroundColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-6xl mx-auto">
          <h3
            className="text-3xl font-bold text-center mb-12"
            style={{ color: textColor }}
          >
            {title}
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold" style={{ color: textColor }}>
                    {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {showStats && (
            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {totalCustomers}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current text-yellow-400" />
                  {averageRating}
                </div>
              </div>
            </div>
          )}
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizOfferTestimonialsBlock;
