import QuizQuestion from "@/components/funnel-blocks/QuizQuestion";
import React, { useState } from "react";
import { QuizBlockProps } from "./types";

/**
 * QuizMultipleChoiceBlock - Componente de escolha múltipla para quiz
 *
 * Utiliza o componente base QuizQuestion para renderizar uma pergunta de múltipla escolha
 * permitindo configurar tipo de seleção (única ou múltipla), validação e aparência.
 */
export interface QuizMultipleChoiceBlockProps extends QuizBlockProps {
  properties: {
    question: string;
    explanation?: string;
    options: string;
    optionType?: "radio" | "checkbox";
    requireSelection?: boolean;
    autoAdvance?: boolean;
    autoAdvanceDelay?: number;
    showFeedback?: boolean;
    feedbackDelay?: number;
    correctAnswers?: string;
    randomizeOptions?: boolean;
    useLetterOptions?: boolean;
    optionStyle?: "default" | "buttons" | "cards" | "minimal";
    showOptionImages?: boolean;
    alignment?: "left" | "center" | "right";
    nextButtonText?: string;
  };
  deviceView?: "mobile" | "tablet" | "desktop";
}

const QuizMultipleChoiceBlock: React.FC<QuizMultipleChoiceBlockProps> = ({
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

  // Calcular as respostas corretas a partir da string de índices
  const parseCorrectAnswers = (answersStr: string) => {
    try {
      // Aceita formatos como "0,1,2" ou "0 1 2" ou "0;1;2"
      const indices = answersStr
        .split(/[,;\s]+/)
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));

      return indices;
    } catch (error) {
      console.error("Error parsing correct answers:", error);
      return [0]; // Retorna a primeira opção como correta por padrão
    }
  };

  const options = parseOptions(properties?.options || "");
  const isMultipleSelection = properties?.optionType === "checkbox";
  const correctAnswers = parseCorrectAnswers(properties?.correctAnswers || "0");

  // Callbacks para interações do usuário
  const handleAnswer = (selectedOptions: any[]) => {
    setSelectedOptions(selectedOptions);

    // Verificar se as respostas estão corretas
    const selectedIds = selectedOptions.map(opt => parseInt(opt.id.split("-")[1]));
    const correctCount = selectedIds.filter(id => correctAnswers.includes(id)).length;
    const allCorrect =
      correctCount === correctAnswers.length && selectedIds.length === correctAnswers.length;

    // Notificar o editor que uma seleção foi feita
    if (onPropertyChange) {
      onPropertyChange(
        "selectedOptions",
        selectedOptions.map(opt => opt.id)
      );
      onPropertyChange("correctAnswersSelected", allCorrect);
      onPropertyChange("partiallyCorrect", correctCount > 0 && !allCorrect);
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

  // Converter as propriedades do painel para as props do QuizQuestion
  const optionStyleMap: Record<string, any> = {
    default: "radio",
    buttons: "button",
    cards: "card",
    minimal: "radio",
  };

  return (
    <div className="quiz-multiple-choice-block" data-block-id={id}>
      <QuizQuestion
        question={properties?.question || ""}
        description={properties?.explanation || ""}
        options={options}
        multipleSelection={isMultipleSelection}
        minSelections={1}
        maxSelections={isMultipleSelection ? options.length : 1}
        required={properties?.requireSelection !== false}
        alignment={properties?.alignment || "center"}
        optionLayout="vertical"
        optionStyle={optionStyleMap[properties?.optionStyle || "default"]}
        showLetters={properties?.useLetterOptions === true}
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

export default QuizMultipleChoiceBlock;
