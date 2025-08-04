import React from "react";
import { QuizComponentData } from "@/types/quizBuilder";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ComponentRendererProps {
  component: QuizComponentData;
  isSelected?: boolean;
  onClick?: () => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onClick,
}) => {
  const data = component.data || {};

  const renderComponent = () => {
    switch (component.type) {
      case "header":
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{data.title || "Título"}</h2>
            <p className="text-lg">{data.subtitle || "Subtítulo"}</p>
          </div>
        );

      case "text":
        return (
          <div className="prose max-w-none">{data.text || "Texto padrão"}</div>
        );

      case "headline":
        return (
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{data.title || "Título"}</h1>
            {data.subtitle && <p className="text-xl">{data.subtitle}</p>}
          </div>
        );

      case "image":
        return data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.alt || "Imagem"}
            className="max-w-full h-auto rounded"
          />
        ) : (
          <div className="bg-gray-100 h-40 w-full flex items-center justify-center rounded">
            <p className="text-gray-500">Imagem não definida</p>
          </div>
        );

      case "multipleChoice":
        return (
          <div className="space-y-2">
            <h3 className="font-medium">{data.question || "Pergunta"}</h3>
            {data.options && data.options.length > 0 ? (
              data.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" id={`opt-${component.id}-${index}`} />
                  <label htmlFor={`opt-${component.id}-${index}`}>
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Opções não definidas</div>
            )}
          </div>
        );

      case "singleChoice":
        return (
          <div className="space-y-2">
            <h3 className="font-medium">{data.question || "Pergunta"}</h3>
            {data.options && data.options.length > 0 ? (
              data.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`opt-${component.id}`}
                    id={`opt-${component.id}-${index}`}
                  />
                  <label htmlFor={`opt-${component.id}-${index}`}>
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Opções não definidas</div>
            )}
          </div>
        );

      case "scale":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">{data.question || "Pergunta"}</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm">{data.minLabel || "Mínimo"}</span>
              <div className="flex space-x-2">
                {Array.from(
                  { length: (data.maxValue || 10) - (data.minValue || 1) + 1 },
                  (_, i) => (
                    <button
                      key={i}
                      className="w-10 h-10 border rounded hover:bg-gray-100"
                    >
                      {(data.minValue || 1) + i}
                    </button>
                  ),
                )}
              </div>
              <span className="text-sm">{data.maxLabel || "Máximo"}</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-500">
              Tipo de componente desconhecido: {component.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "transition-all cursor-pointer",
        isSelected ? "ring-2 ring-blue-500" : "",
      )}
    >
      <Card className="p-4">{renderComponent()}</Card>
    </div>
  );
};

export default ComponentRenderer;
