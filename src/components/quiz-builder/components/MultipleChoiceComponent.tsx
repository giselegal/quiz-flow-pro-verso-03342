import React from "react";
import { cn } from "@/lib/utils";

interface MultipleChoiceComponentProps {
  data: {
    question?: string;
    options?: string[];
    optionImages?: string[];
    displayType?: "text" | "image" | "both";
    minSelections?: number;
    maxSelections?: number;
    [key: string]: any;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  isSelected?: boolean;
}

const MultipleChoiceComponent: React.FC<MultipleChoiceComponentProps> = ({
  data,
  style,
  isSelected,
}) => {
  const options = data.options || ["Opção 1", "Opção 2", "Opção 3"];
  const displayType = data.displayType || "text";

  return (
    <div
      className={cn(
        "p-4",
        isSelected && "outline-dashed outline-1 outline-blue-400",
      )}
      style={{
        backgroundColor: style?.backgroundColor || "transparent",
        color: style?.textColor || "inherit",
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">
          {data.question || "Pergunta de múltipla escolha"}
        </h3>
        <p className="text-sm text-gray-500">
          {data.minSelections && data.maxSelections
            ? `Selecione de ${data.minSelections} a ${data.maxSelections} opções`
            : "Selecione uma ou mais opções"}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={`option-${option}-${index}`}
            className="border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {(displayType === "image" || displayType === "both") && (
              <div className="mb-2">
                {data.optionImages && data.optionImages[index] ? (
                  <img
                    src={data.optionImages[index]}
                    alt={option}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md">
                    <span className="text-sm text-gray-500">Sem imagem</span>
                  </div>
                )}
              </div>
            )}

            {(displayType === "text" || displayType === "both") && (
              <div className="flex items-center">
                <div className="w-5 h-5 border border-gray-300 rounded mr-3"></div>
                <span>{option}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceComponent;
