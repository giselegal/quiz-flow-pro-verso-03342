import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Play, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  type: "intro" | "quiz-question" | "result-page" | "offer-page" | "form" | "content";
  isCompleted?: boolean;
  isActive?: boolean;
  order: number;
}

interface StepsPanelProps {
  steps?: Step[];
  currentStepId?: string;
  onStepSelect?: (stepId: string) => void;
  onStepEdit?: (stepId: string) => void;
  onStepDelete?: (stepId: string) => void;
  onAddStep?: () => void;
  className?: string;
}

const DEFAULT_STEPS: Step[] = [
  {
    id: "1",
    title: "Página de Introdução",
    type: "intro",
    isCompleted: true,
    order: 1,
  },
  {
    id: "2",
    title: "Pergunta 1",
    type: "quiz-question",
    isCompleted: false,
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    title: "Resultado",
    type: "result-page",
    isCompleted: false,
    order: 3,
  },
  {
    id: "4",
    title: "Página de Oferta",
    type: "offer-page",
    isCompleted: false,
    order: 4,
  },
];

const getStepTypeLabel = (type: Step["type"]): string => {
  switch (type) {
    case "intro":
      return "Introdução";
    case "quiz-question":
      return "Pergunta";
    case "result-page":
      return "Resultado";
    case "offer-page":
      return "Oferta";
    case "form":
      return "Formulário";
    case "content":
      return "Conteúdo";
    default:
      return "Etapa";
  }
};

const getStepTypeColor = (type: Step["type"]): string => {
  switch (type) {
    case "intro":
      return "bg-blue-100 text-blue-700";
    case "quiz-question":
      return "bg-purple-100 text-purple-700";
    case "result-page":
      return "bg-green-100 text-green-700";
    case "offer-page":
      return "bg-orange-100 text-orange-700";
    case "form":
      return "bg-yellow-100 text-yellow-700";
    case "content":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const StepsPanel: React.FC<StepsPanelProps> = ({
  steps = DEFAULT_STEPS,
  currentStepId,
  onStepSelect,
  onStepEdit,
  onStepDelete,
  onAddStep,
  className = "",
}) => {
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  return (
    <div className={cn("h-full bg-white border-r border-gray-200 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Etapas do Funil</h2>
          {onAddStep && (
            <Button size="sm" onClick={onAddStep}>
              Adicionar
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {steps.length} etapa{steps.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Steps List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "group relative mb-2 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                currentStepId === step.id
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
              onClick={() => onStepSelect?.(step.id)}
              onMouseEnter={() => setHoveredStepId(step.id)}
              onMouseLeave={() => setHoveredStepId(null)}
            >
              {/* Step number and status */}
              <div className="flex items-start space-x-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    step.isCompleted
                      ? "bg-green-100 text-green-700"
                      : step.isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                  )}
                >
                  {step.isCompleted ? "✓" : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{step.title}</h3>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getStepTypeColor(step.type))}
                    >
                      {getStepTypeLabel(step.type)}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Etapa {step.order}</span>
                    {step.isActive && (
                      <Badge variant="outline" className="text-xs">
                        <Play className="w-3 h-3 mr-1" />
                        Ativa
                      </Badge>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>

              {/* Action buttons (show on hover) */}
              {hoveredStepId === step.id && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onStepEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={e => {
                        e.stopPropagation();
                        onStepEdit(step.id);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                  {onStepDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={e => {
                        e.stopPropagation();
                        onStepDelete(step.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StepsPanel;
