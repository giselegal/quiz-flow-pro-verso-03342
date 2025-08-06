import React from "react";
import type { BlockComponentProps } from "../../../types/blocks";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

interface QuizStartPageBlockProps {
  block: {
    id: string;
    type: string;
    properties?: {
      title?: string;
      subtitle?: string;
      description?: string;
      buttonText?: string;
      benefits?: string[];
      nameInputPlaceholder?: string;
      showNameInput?: boolean;
      imageUrl?: string;
      backgroundColor?: string;
      textColor?: string;
    };
  };
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const QuizStartPageBlock: React.FC<QuizStartPageBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
  style,
}) => {
  // Safe destructuring with fallback defaults
  const properties = block.properties || {};
  const {
    title = "Etapa 1: Descubra Seu Estilo Pessoal Único",
    subtitle = 'Chega de guarda-roupa lotado e sensação de "não tenho nada para vestir"',
    description = "Um quiz personalizado que vai te ajudar a descobrir seu estilo predominante e como aplicá-lo no dia a dia com confiança.",
    buttonText = "Começar Meu Quiz de Estilo",
    benefits = [
      "✓ Descubra seu estilo predominante em apenas 5 minutos",
      "✓ Receba dicas personalizadas para seu perfil único",
      "✓ Aprenda a criar looks que combinam 100% com você",
      "✓ Ganhe confiança para se vestir todos os dias",
    ],
    nameInputPlaceholder = "Digite seu primeiro nome aqui...",
    showNameInput = true,
    imageUrl,
    backgroundColor = "#fffaf7",
    textColor = "#432818",
  } = properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-full flex flex-col bg-white rounded-lg border border-gray-200",
        // LAYOUT HORIZONTAL RESPONSIVO - LARGURA 100% - MÁXIMO 2 COLUNAS INTERNAS
        "p-4 md:p-6 min-h-[300px] max-w-full",
        isSelected ? "ring-2 ring-[#B89B7A] bg-[#B89B7A]/10" : "",
        "cursor-pointer hover:shadow-md transition-all duration-200",
        className
      )}
      onClick={onClick}
      style={{ backgroundColor, color: textColor, ...style }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <Badge variant="outline" className="mb-3 text-xs bg-[#B89B7A] text-white border-[#B89B7A]">
          Etapa 1 - Quiz de Estilo Pessoal
        </Badge>

        {/* Title */}
        <h1
          className={cn(
            "text-lg md:text-xl font-bold mb-2 leading-tight cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40",
            isSelected && "ring-2 ring-[#B89B7A] ring-opacity-50"
          )}
          onClick={onClick}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            "text-sm mb-3 opacity-80 leading-relaxed cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40",
            isSelected && "ring-2 ring-[#B89B7A] ring-opacity-50"
          )}
          onClick={onClick}
        >
          {subtitle}
        </p>
      </div>

      {/* Description */}
      <p
        className={cn(
          "text-xs md:text-sm mb-4 opacity-75 text-center leading-relaxed cursor-pointer p-2 rounded border-2 border-transparent hover:border-[#B89B7A]/40",
          isSelected && "ring-2 ring-[#B89B7A] ring-opacity-50"
        )}
        onClick={onClick}
      >
        {description}
      </p>

      {/* Benefits List */}
      {benefits && benefits.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-xs">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Name Input */}
      {showNameInput && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={nameInputPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
            disabled={disabled}
          />
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-auto">
        <Button
          className="w-full bg-[#B89B7A] hover:bg-[#aa6b5d] text-white text-sm"
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-3">
        <p className="text-xs opacity-60">⏱️ Leva apenas 5 minutos • 100% gratuito</p>
      </div>
    </div>
  );
};

export default QuizStartPageBlock;
