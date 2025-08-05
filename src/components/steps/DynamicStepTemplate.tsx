import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

// 🎯 CONFIGURAÇÃO DE QUESTÕES - JSON DINÂMICO
export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  category: string;
  styleCategory: string;
  points: number;
  imageUrl?: string;
}

export interface QuestionConfig {
  id: string;
  title: string;
  subtitle?: string;
  questionNumber: number;
  totalQuestions: number;
  options: QuestionOption[];
  layout: "grid-2" | "grid-3" | "grid-4" | "list";
  allowMultiple: boolean;
  showImages: boolean;
}

export interface DynamicStepProps {
  stepNumber: number;
  questionData: QuestionConfig;
  progressValue: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onAnswer?: (answer: string | string[]) => void;
  selectedAnswers?: string[];
  logoUrl?: string;
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// 🎨 COMPONENTE DINÂMICO QUE SUBSTITUI 21 TEMPLATES
export const DynamicStepTemplate: React.FC<DynamicStepProps> = ({
  stepNumber,
  questionData,
  progressValue,
  onNext,
  onPrevious,
  onAnswer,
  selectedAnswers = [],
  logoUrl = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
  brandColors = {
    primary: "#B89B7A",
    secondary: "#432818",
    accent: "#E8D5C4",
  },
}) => {
  const [localSelected, setLocalSelected] = React.useState<string[]>(selectedAnswers);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleOptionClick = (optionId: string) => {
    setIsAnimating(true);

    let newSelection: string[];

    if (questionData.allowMultiple) {
      // Múltipla seleção
      newSelection = localSelected.includes(optionId)
        ? localSelected.filter(id => id !== optionId)
        : [...localSelected, optionId];
    } else {
      // Seleção única
      newSelection = [optionId];
    }

    setLocalSelected(newSelection);
    onAnswer?.(questionData.allowMultiple ? newSelection : newSelection[0]);

    // Reset animation
    setTimeout(() => setIsAnimating(false), 300);
  };

  const canProceed = localSelected.length > 0;

  const getGridColumns = () => {
    switch (questionData.layout) {
      case "grid-2":
        return "grid-cols-1 md:grid-cols-2";
      case "grid-3":
        return "grid-cols-1 md:grid-cols-3";
      case "grid-4":
        return "grid-cols-2 md:grid-cols-4";
      case "list":
        return "grid-cols-1";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FEFCFA] to-[#E8D5C4]/20">
      {/* Header com Logo e Progresso */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#B89B7A]/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shadow-md"
              />
              {onPrevious && stepNumber > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  className="text-[#432818] hover:bg-[#B89B7A]/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Voltar
                </Button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="flex items-center gap-2 text-sm text-[#8F7A6A] mb-2">
                <span>Progresso</span>
                <span className="ml-auto">{progressValue}%</span>
              </div>
              <div className="w-full bg-[#E8D5C4]/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#B89B7A] to-[#D4C2A8] h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Question Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 border-[#B89B7A] text-[#B89B7A] bg-[#B89B7A]/5">
            Questão {questionData.questionNumber} de {questionData.totalQuestions}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4 leading-tight">
            {questionData.title}
          </h1>

          {questionData.subtitle && (
            <p className="text-lg text-[#8F7A6A] max-w-2xl mx-auto">{questionData.subtitle}</p>
          )}
        </div>

        {/* Options Grid */}
        <div className={cn("grid gap-4 mb-8", getGridColumns())}>
          {questionData.options.map((option, index) => {
            const isSelected = localSelected.includes(option.id);

            return (
              <Card
                key={option.id}
                className={cn(
                  "p-6 cursor-pointer transition-all duration-300 group hover:shadow-lg",
                  "border-2 transform hover:scale-105",
                  isSelected
                    ? "border-[#B89B7A] bg-gradient-to-br from-[#B89B7A]/10 to-[#E8D5C4]/20 shadow-md"
                    : "border-[#E8D5C4] hover:border-[#B89B7A]/50 bg-white",
                  isAnimating && "animate-pulse"
                )}
                onClick={() => handleOptionClick(option.id)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Option Image (se habilitado) */}
                {questionData.showImages && option.imageUrl && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={option.imageUrl}
                      alt={option.text}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}

                {/* Option Content */}
                <div className="text-center">
                  <h3
                    className={cn(
                      "font-semibold text-lg mb-2 transition-colors duration-300",
                      isSelected ? "text-[#432818]" : "text-[#5C4A3A] group-hover:text-[#432818]"
                    )}
                  >
                    {option.text}
                  </h3>

                  {option.category && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs transition-colors duration-300",
                        isSelected
                          ? "bg-[#B89B7A] text-white"
                          : "bg-[#E8D5C4] text-[#8F7A6A] group-hover:bg-[#B89B7A]/20"
                      )}
                    >
                      {option.category}
                    </Badge>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center animate-bounce">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={onNext}
            disabled={!canProceed}
            size="lg"
            className={cn(
              "px-8 py-4 text-lg font-bold transition-all duration-300 relative overflow-hidden group",
              canProceed
                ? "bg-gradient-to-r from-[#B89B7A] to-[#D4C2A8] hover:from-[#A08967] hover:to-[#B89B7A] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            <span className="flex items-center gap-2 relative z-10">
              Continuar
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>

            {/* Button animation effect */}
            {canProceed && (
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            )}
          </Button>

          {!canProceed && (
            <p className="text-sm text-[#8F7A6A] mt-2">
              Selecione {questionData.allowMultiple ? "uma ou mais opções" : "uma opção"} para
              continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicStepTemplate;
