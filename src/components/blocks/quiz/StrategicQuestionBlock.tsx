import React, { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * StrategicQuestionBlock - Componente para questões estratégicas (Etapas 13-18)
 *
 * Props editáveis via editor visual:
 * - question: string - Pergunta estratégica
 * - description: string - Descrição adicional
 * - options: string[] - Opções de resposta
 * - singleSelection: boolean - Seleção única (padrão para estratégicas)
 * - category: string - Categoria da questão
 * - placeholder: string - Placeholder para resposta livre
 * - allowFreeText: boolean - Permitir resposta livre
 * - onAnswer: function - Callback de resposta
 *
 * @example
 * <StrategicQuestionBlock
 *   blockId="strategic-1"
 *   question="Como você gostaria de se sentir ao se vestir?"
 *   options={[
 *     'Confiante e poderosa',
 *     'Feminina e delicada',
 *     'Confortável e prática'
 *   ]}
 *   category="motivation"
 *   onAnswer={(answer) => console.log('Resposta:', answer)}
 * />
 */

export interface StrategicQuestionBlockProps {
  // Identificação
  blockId: string;
  className?: string;
  style?: React.CSSProperties;

  // Conteúdo editável
  question: string;
  description?: string;
  options?: string[];
  category?: string;
  placeholder?: string;

  // Configurações
  singleSelection?: boolean;
  allowFreeText?: boolean;
  required?: boolean;

  // Visual
  backgroundColor?: string;
  textColor?: string;
  optionStyle?: "cards" | "buttons" | "list";
  alignment?: "left" | "center" | "right";

  // Funcionalidade
  onAnswer?: (answer: string | string[]) => void;
  selectedAnswer?: string | string[];
  disabled?: boolean;
  onClick?: () => void;
}

const StrategicQuestionBlock: React.FC<StrategicQuestionBlockProps> = ({
  blockId = "strategic-question-block",
  className = "",
  style = {},

  question = "Como você gostaria de se sentir ao se vestir?",
  description,
  options = [
    "Confiante e poderosa",
    "Feminina e delicada",
    "Confortável e prática",
    "Elegante e sofisticada",
  ],
  category = "motivation",
  placeholder = "Digite sua resposta...",

  singleSelection = true,
  allowFreeText = false,
  required = true,

  backgroundColor = "#ffffff",
  textColor = "#432818",
  optionStyle = "cards",
  alignment = "center",

  onAnswer,
  selectedAnswer = "",
  disabled = false,
  onClick,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>(selectedAnswer);
  const [freeTextAnswer, setFreeTextAnswer] = useState("");
  const [showFreeText, setShowFreeText] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (disabled) return;

    let newAnswer: string | string[];

    if (singleSelection) {
      newAnswer = option;
      setCurrentAnswer(option);
    } else {
      const currentArray = Array.isArray(currentAnswer) ? currentAnswer : [];
      if (currentArray.includes(option)) {
        newAnswer = currentArray.filter(a => a !== option);
      } else {
        newAnswer = [...currentArray, option];
      }
      setCurrentAnswer(newAnswer);
    }

    if (onAnswer) {
      onAnswer(newAnswer);
    }
  };

  const handleFreeTextSubmit = () => {
    if (freeTextAnswer.trim()) {
      const answer = freeTextAnswer.trim();
      setCurrentAnswer(answer);
      if (onAnswer) {
        onAnswer(answer);
      }
    }
  };

  const isSelected = (option: string) => {
    if (singleSelection) {
      return currentAnswer === option;
    }
    return Array.isArray(currentAnswer) && currentAnswer.includes(option);
  };

  const getOptionClasses = (option: string) => {
    const baseClasses = "w-full p-4 rounded-lg transition-all duration-200 border-2 cursor-pointer";

    if (optionStyle === "cards") {
      return `${baseClasses} ${
        isSelected(option)
          ? "bg-[#B89B7A] text-white border-[#B89B7A] shadow-lg"
          : "bg-white text-gray-700 border-gray-300 hover:border-[#B89B7A] hover:shadow-md"
      }`;
    }

    if (optionStyle === "buttons") {
      return `${baseClasses} ${
        isSelected(option)
          ? "bg-[#B89B7A] text-white border-[#B89B7A]"
          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
      }`;
    }

    // list style
    return `${baseClasses} ${
      isSelected(option)
        ? "bg-[#B89B7A]/10 border-[#B89B7A]/40 text-[#432818]"
        : "bg-white border-gray-200 hover:bg-gray-50"
    }`;
  };

  return (
    <div
      className={`strategic-question-block py-12 px-6 ${className}`}
      data-block-id={blockId}
      style={{
        backgroundColor,
        color: textColor,
        textAlign: alignment,
        ...style,
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Categoria */}
        {category && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#B89B7A]/20 text-[#432818] text-sm font-medium rounded-full">
              Questão Estratégica: {category}
            </span>
          </div>
        )}

        {/* Pergunta */}
        <h2
          className="text-2xl md:text-3xl font-bold mb-6"
          style={{
            fontFamily: "Playfair Display, serif",
            color: textColor,
          }}
        >
          {question}
        </h2>

        {/* Descrição */}
        {description && <p className="text-lg text-gray-600 mb-8 leading-relaxed">{description}</p>}

        {/* Opções */}
        <div className="space-y-4 mb-8">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={disabled}
              className={getOptionClasses(option)}
            >
              <div className="flex items-center justify-between">
                <span className="text-left font-medium">{option}</span>
                {isSelected(option) && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#B89B7A] rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Resposta livre */}
        {allowFreeText && (
          <div className="border-t pt-6">
            {!showFreeText ? (
              <Button
                onClick={() => setShowFreeText(true)}
                variant="outline"
                className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
              >
                Ou escreva sua própria resposta
              </Button>
            ) : (
              <div className="space-y-4">
                <div
                  className="w-full p-4 border-2 border-gray-300 rounded-lg min-h-[80px] bg-gray-50 text-gray-500 flex items-center justify-center cursor-pointer hover:border-[#B89B7A]/40"
                  onClick={onClick}
                  title="Configure a área de texto no Painel de Propriedades"
                >
                  {freeTextAnswer || placeholder || "Área de texto configurável"}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleFreeTextSubmit}
                    disabled={!freeTextAnswer.trim() || disabled}
                    className="bg-[#B89B7A] hover:bg-[#a68a6d] text-white"
                  >
                    Confirmar Resposta
                  </Button>
                  <Button onClick={() => setShowFreeText(false)} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informação adicional */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>💭 Esta pergunta nos ajuda a personalizar ainda mais seu resultado</p>
        </div>
      </div>
    </div>
  );
};

export default StrategicQuestionBlock;
