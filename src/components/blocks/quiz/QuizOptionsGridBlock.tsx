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
