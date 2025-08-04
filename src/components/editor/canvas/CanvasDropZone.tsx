import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlockWrapper } from "./SortableBlockWrapper";
import { Block } from "@/types/editor";
import { cn } from "@/lib/utils";

interface CanvasDropZoneProps {
  blocks: Block[];
  selectedBlockId: string | null;
  isPreviewing: boolean;
  activeStageId: string;
  stageCount: number;
  onSelectBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: any) => void;
  onDeleteBlock: (id: string) => void;
  className?: string;
}

export const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({
  blocks,
  selectedBlockId,
  isPreviewing,
  activeStageId,
  stageCount,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  className,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-zone",
    data: {
      type: "canvas-drop-zone",
      accepts: ["component"],
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-3 min-h-[400px] transition-all duration-200",
        isOver &&
          !isPreviewing &&
          "bg-brand/5 ring-2 ring-brand/20 ring-dashed",
        className,
      )}
    >
      {blocks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-stone-700 mb-3 font-serif">
            Etapa {activeStageId}
          </h3>
          <p className="text-stone-500 text-lg mb-2">
            {isPreviewing
              ? "Modo Preview - Nenhum componente nesta etapa"
              : "Arraste componentes da sidebar para começar"}
          </p>
          <p className="text-xs text-stone-400 bg-stone-100/50 px-3 py-1 rounded-full inline-block">
            Sistema integrado com {stageCount} etapas • Drag & Drop ativo
          </p>
          {isOver && !isPreviewing && (
            <div className="mt-4 p-4 border-2 border-dashed border-brand/30 rounded-lg bg-brand/5">
              <p className="text-brand font-medium">Solte o componente aqui</p>
            </div>
          )}
        </div>
      ) : (
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {blocks.map((block) => (
              <SortableBlockWrapper
                key={block.id}
                block={block}
                isSelected={!isPreviewing && selectedBlockId === block.id}
                onSelect={() => !isPreviewing && onSelectBlock(block.id)}
                onUpdate={(updates) => {
                  if (!isPreviewing) {
                    onUpdateBlock(block.id, updates);
                  }
                }}
                onDelete={() => {
                  if (!isPreviewing) {
                    onDeleteBlock(block.id);
                  }
                }}
              />
            ))}
            {isOver && !isPreviewing && (
              <div className="p-4 border-2 border-dashed border-brand/30 rounded-lg bg-brand/5 text-center">
                <p className="text-brand font-medium">
                  Solte o componente aqui
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      )}
    </div>
  );
};
