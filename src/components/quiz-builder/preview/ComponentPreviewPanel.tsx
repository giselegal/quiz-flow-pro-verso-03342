import React from "react";
import { QuizComponentData, QuizStage } from "@/types/quizBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ComponentRenderer from "./ComponentRenderer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ComponentPreviewPanelProps {
  components: QuizComponentData[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onMoveComponent: (draggedId: string, targetId: string) => void;
  activeStage: QuizStage | null;
  isPreviewing: boolean;
}

export const ComponentPreviewPanel: React.FC<ComponentPreviewPanelProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onMoveComponent,
  activeStage,
  isPreviewing,
}) => {
  if (!activeStage) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">
          Selecione uma etapa para visualizar seus componentes.
        </p>
      </div>
    );
  }

  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="h-full bg-[#F9F5F1] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <h3 className="text-sm font-medium text-gray-600">
          Visualizando: {activeStage.title || `Etapa ${activeStage.order + 1}`}
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div
          className={cn(
            "min-h-full w-full max-w-4xl mx-auto",
            isPreviewing ? "pointer-events-none select-none" : "",
          )}
        >
          {sortedComponents.length === 0 ? (
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
              <p className="text-gray-500 mb-2">
                Adicione componentes para esta etapa usando o painel lateral.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                className="text-gray-500"
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar Componente
              </Button>
            </div>
          ) : (
            sortedComponents.map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                isSelected={component.id === selectedComponentId}
                onSelect={() => onSelectComponent(component.id)}
                onMove={onMoveComponent}
                isPreviewing={isPreviewing}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
