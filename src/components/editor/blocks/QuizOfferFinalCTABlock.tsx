import React, { useState, useEffect } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import type { BlockComponentProps } from "@/types/blocks";

const QuizOfferFinalCTABlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    title = "Não perca esta oportunidade única!",
    subtitle = "Transforme seu estilo e sua confiança agora mesmo",
    ctaText = "QUERO DESCOBRIR MEU ESTILO AGORA",
    ctaUrl = "#checkout",
    urgencyText = "Oferta válida por tempo limitado",
    accentColor = "#B89B7A",
    textColor = "#432818",
    backgroundColor = undefined, // Will use accent color with opacity
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

  const bgColor = backgroundColor || `${accentColor}15`;

  return (
    <div
      className={`
        w-full py-16 px-4 text-center transition-all duration-200
        ${
          isSelected
            ? "ring-1 ring-gray-400/40 bg-gray-50/30"
            : "hover:shadow-sm"
        }
        ${className}
      `}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-4xl mx-auto">
          <h3
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ color: textColor }}
          >
            {title}
          </h3>
          <p className="text-xl text-gray-600 mb-8">{subtitle}</p>

          <Button
            size="lg"
            className="px-12 py-6 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-all duration-300 mb-6"
            style={{
              backgroundColor: accentColor,
              color: "white",
              border: "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (ctaUrl.startsWith("#")) {
                document
                  .querySelector(ctaUrl)
                  ?.scrollIntoView({ behavior: "smooth" });
              } else {
                window.open(ctaUrl, "_blank");
              }
            }}
          >
            <ArrowRight className="w-6 h-6 mr-2" />
            {ctaText}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {urgencyText}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizOfferFinalCTABlock;
