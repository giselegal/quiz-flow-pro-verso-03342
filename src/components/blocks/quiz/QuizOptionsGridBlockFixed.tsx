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
    question: questionText = "Sua pergunta aqui?",
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
    minSelections: minSelectionsCount = 3,
    maxSelections: maxSelectionsCount = 3,
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

  const parsedOptions = parseOptions(optionsText);

  // Callbacks para interações do usuário
  const handleAnswer = (selectedOptions: any[]) => {
    setSelectedOptions(selectedOptions);

    // Notificar o editor que uma seleção foi feita
    handlePropertyUpdate(
      "selectedOptions",
      selectedOptions.map(opt => opt.id)
    );
    handlePropertyUpdate("hasCompleteSelection", selectedOptions.length >= minSelectionsCount);
  };

  const handleNext = () => {
    // Notificar o editor que o usuário quer avançar
    handlePropertyUpdate("complete", true);
    handlePropertyUpdate(
      "selectedOptions",
      selectedOptions.map(opt => opt.id)
    );
  };

  // Edição inline para question
  const handleQuestionEdit = (newQuestion: string) => {
    handlePropertyUpdate("question", newQuestion);
  };

  // Mapear propriedades do editor para o componente QuizQuestion
  return (
    <div
      className={`quiz-options-grid-block transition-all duration-200 ${isSelected ? "ring-2 ring-blue-500 ring-opacity-50 rounded-md p-2" : ""}`}
      data-block-id={block.id}
      onClick={onClick}
    >
      {/* Edição inline da pergunta quando selecionado */}
      {isSelected ? (
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-none"
            value={questionText}
            onChange={e => handleQuestionEdit(e.target.value)}
            placeholder="Digite sua pergunta aqui..."
            rows={2}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-none mt-2"
            value={optionsText}
            onChange={e => handlePropertyUpdate("options", e.target.value)}
            placeholder="Digite as opções, uma por linha..."
            rows={4}
          />
        </div>
      ) : null}

      <QuizQuestion
        question={questionText}
        description={description || ""}
        options={parsedOptions}
        optionLayout={optionsLayout}
        required={requireOption}
        multipleSelection={maxSelectionsCount > 1}
        maxSelections={maxSelectionsCount}
        minSelections={minSelectionsCount}
        initialSelections={selectedOptions.map(opt => opt.id)}
        onAnswer={handleAnswer}
        onNext={handleNext}
        autoAdvance={autoAdvance}
        autoAdvanceDelay={autoAdvanceDelay}
        showLetters={useLetterOptions}
        optionImageSize={optionImageSize}
        alignment={alignment}
        optionStyle={optionStyle}
        nextButtonText={nextButtonText}
        showNextButton={true}
      />
    </div>
  );
};

export default QuizOptionsGridBlock;
