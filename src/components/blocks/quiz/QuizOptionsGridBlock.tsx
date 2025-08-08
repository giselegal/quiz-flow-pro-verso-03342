// @ts-nocheck
import QuizQuestion from "@/components/funnel-blocks/QuizQuestion";
import React, { useState } from "react";
import { QuizBlockProps } from "./types";

/**
 * QuizOptionsGridBlock - Componente de grid de opções para quiz
 *
 * Utiliza o componente base QuizQuestion para renderizar uma pergunta
 * com múltiplas opções em formato de grid, permitindo seleção única ou múltipla.
 */
export interface QuizOptionsGridBlockProps extends QuizBlockProps {
  properties: {
    question: string;
    description?: string;
    options: string;
    requireOption?: boolean;
    autoAdvance?: boolean;
    autoAdvanceDelay?: number;
    showCorrectAnswer?: boolean;
    correctOptionIndex?: number;
    useLetterOptions?: boolean;
    optionsLayout?: "vertical" | "horizontal" | "grid";
    optionsPerRow?: number;
    showOptionImages?: boolean;
    optionImageSize?: "small" | "medium" | "large";
    alignment?: "left" | "center" | "right";
    optionStyle?: "card" | "button" | "radio" | "checkbox";
    nextButtonText?: string;
    minSelections?: number;
    maxSelections?: number;
  };
  deviceView?: "mobile" | "tablet" | "desktop";
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return "";

  const prefix = type === "top" ? "mt" : type === "bottom" ? "mb" : type === "left" ? "ml" : "mr";

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuizOptionsGridBlock: React.FC<QuizOptionsGridBlockProps> = ({
  properties,
  id,
  onPropertyChange,
  ...props
}) => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // Extrair as opções do formato texto para array de objetos
  const parseOptions = (optionsText: string) => {
    return optionsText
      .split("\n")
      .filter(line => line.trim() !== "")
      .map((line, index) => ({
        id: `option-${index}`,
        text: line.trim(),
        value: `option-${index}`,
        imageUrl: "",
      }));
  };

  const options = parseOptions(properties?.options || "");

  // Determinar o número mínimo de seleções com base nas propriedades
  // Por padrão são 3 opções obrigatórias conforme requisito
  const minSelections = properties?.minSelections || 3;
  const maxSelections = properties?.maxSelections || options.length;

  // Callbacks para interações do usuário
  const handleAnswer = (selectedOptions: any[]) => {
    setSelectedOptions(selectedOptions);

    // Notificar o editor que uma seleção foi feita
    if (onPropertyChange) {
      onPropertyChange(
        "selectedOptions",
        selectedOptions.map(opt => opt.id)
      );
      onPropertyChange("hasCompleteSelection", selectedOptions.length >= minSelections);
    }
  };

  const handleNext = () => {
    // Notificar o editor que o usuário quer avançar
    if (onPropertyChange) {
      onPropertyChange("complete", true);
      onPropertyChange(
        "selectedOptions",
        selectedOptions.map(opt => opt.id)
      );
    }
  };

  // Mapear propriedades do editor para o componente QuizQuestion
  return (
    <div className="quiz-options-grid-block" data-block-id={id}>
      <QuizQuestion
        question={properties?.question || ""}
        description={properties?.description || ""}
        options={options}
        multipleSelection={true}
        minSelections={minSelections}
        maxSelections={maxSelections}
        required={properties?.requireOption !== false}
        alignment={properties?.alignment || "center"}
        optionLayout={properties?.optionsLayout || "vertical"}
        optionStyle={properties?.optionStyle || "card"}
        showLetters={properties?.useLetterOptions === true}
        optionImageSize={(properties?.optionImageSize as "small" | "medium" | "large") || "medium"}
        autoAdvance={properties?.autoAdvance === true}
        autoAdvanceDelay={properties?.autoAdvanceDelay || 1000}
        showNextButton={true}
        nextButtonText={properties?.nextButtonText || "Avançar"}
        onAnswer={handleAnswer}
        onNext={handleNext}
        deviceView={props.deviceView || "desktop"}
      />
    </div>
  );
};

export default QuizOptionsGridBlock;
