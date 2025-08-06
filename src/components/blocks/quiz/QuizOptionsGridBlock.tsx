import QuizQuestion from "@/components/funnel-blocks/QuizQuestion";
import type { BlockComponentProps } from "@/types/blocks";
import React, { useState } from "react";

/**
 * QuizOptionsGridBlock - Componente de grid de opções para quiz
 *
 * Utiliza o componente base QuizQuestion para renderizar uma pergunta
 * com múltiplas opções em formato de grid, permitindo seleção única ou múltipla.
 */
export interface QuizOptionsGridProperties {
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
}

const QuizOptionsGridBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const {
    question = "Sua pergunta aqui?",
    description,
    options: optionsText = "Opção 1\nOpção 2\nOpção 3",
    requireOption = true,
    autoAdvance = false,
    autoAdvanceDelay = 800,
    showCorrectAnswer = false,
    correctOptionIndex = 0,
    useLetterOptions = false,
    optionsLayout = "vertical",
    optionsPerRow = 1,
    showOptionImages = false,
    optionImageSize = "medium",
    alignment = "left",
    optionStyle = "card",
    nextButtonText = "Continuar",
    minSelections: propMinSelections = 3,
    maxSelections: propMaxSelections = 3,
  } = (properties || {}) as QuizOptionsGridProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

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

  const optionsList = parseOptions(optionsText);

  // Determinar o número mínimo de seleções com base nas propriedades
  // Por padrão são 3 opções obrigatórias conforme requisito
  const minSelections = propMinSelections;
  const maxSelections = propMaxSelections;

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
    <div
      className={`quiz-options-grid-block transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      data-block-id={block?.id}
      onClick={onClick}
    >
      <QuizQuestion
        question={question}
        description={description}
        options={optionsList}
        multipleSelection={true}
        minSelections={minSelections}
        maxSelections={maxSelections}
        required={requireOption}
        alignment={alignment}
        optionLayout={optionsLayout}
        optionStyle={optionStyle}
        showLetters={useLetterOptions}
        optionImageSize={optionImageSize}
        autoAdvance={autoAdvance}
        autoAdvanceDelay={autoAdvanceDelay}
        showNextButton={true}
        nextButtonText={nextButtonText}
        onAnswer={handleAnswer}
        onNext={handleNext}
        deviceView="desktop"
      />
    </div>
  );
};

export default QuizOptionsGridBlock;
