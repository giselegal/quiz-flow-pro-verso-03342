import React, { useState, useEffect } from "react";
import { Crown, Star, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import type { BlockComponentProps } from "@/types/blocks";

const QuizResultSecondaryStylesBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = "",
}) => {
  const {
    primaryStyle = "elegante",
    title = "Seus Estilos Secundários",
    subtitle = "Estes estilos complementam seu estilo predominante",
    accentColor = "#B89B7A",
    textColor = "#432818",
    maxStyles = 3,
  } = block?.properties || {};

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Configuração dos estilos
  const styleConfig = {
    elegante: {
      name: "Elegante",
      description: "Sofisticação e refinamento em cada detalhe.",
      icon: Crown,
    },
    natural: {
      name: "Natural",
      description: "Conforto e autenticidade acima de tudo.",
      icon: Star,
    },
    contemporaneo: {
      name: "Contemporâneo",
      description: "Sempre em sintonia com as tendências atuais.",
      icon: Award,
    },
    classico: {
      name: "Clássico",
      description: "Atemporalidade e elegância tradicional.",
      icon: Crown,
    },
    romantico: {
      name: "Romântico",
      description: "Feminilidade e delicadeza em cada look.",
      icon: Star,
    },
    sexy: {
      name: "Sexy",
      description: "Sensualidade e confiança marcantes.",
      icon: Award,
    },
  };

  const secondaryStyles = Object.entries(styleConfig)
    .filter(([key]) => key !== primaryStyle)
    .slice(0, maxStyles);

  return (
    <div
      className={`
        w-full py-8 px-4 transition-all duration-200
        ${isSelected ? "ring-1 ring-gray-400/40 bg-gray-50/30" : "hover:shadow-sm"}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <AnimatedWrapper show={isLoaded}>
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <h3 className="text-2xl font-semibold text-center" style={{ color: textColor }}>
                {title}
              </h3>
              <p className="text-center text-gray-600">{subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {secondaryStyles.map(([key, style]) => {
                  const SecondaryIcon = style.icon;
                  return (
                    <div key={key} className="text-center p-4 rounded-lg bg-gray-50">
                      <SecondaryIcon
                        className="w-8 h-8 mx-auto mb-3"
                        style={{ color: accentColor }}
                      />
                      <h4 className="font-semibold mb-2" style={{ color: textColor }}>
                        {style.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{style.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default QuizResultSecondaryStylesBlock;
