/**
 * 🎯 PAINEL DE ETAPAS (Coluna 1)
 * Lista navegável de todas as etapas do quiz
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { EditableQuizStep } from '../hooks/useEditorState';

interface StepsPanelProps {
  steps: EditableQuizStep[];
  selectedStepId: string | null;
  onSelectStep: (id: string) => void;
  onAddStep: () => void;
  onDeleteStep: (id: string) => void;
  onDuplicateStep: (id: string) => void;
}

function SortableStepItem({
  step,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  step: EditableQuizStep;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          'p-3 mb-2 cursor-pointer transition-all hover:shadow-md',
          isSelected && 'ring-2 ring-primary bg-primary/5'
        )}
        onClick={onSelect}
      >
        <div className="flex items-start gap-2">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {step.order + 1}
              </Badge>
              <span className="text-xs uppercase text-muted-foreground">
                {step.type}
              </span>
            </div>
            <p className="text-sm font-medium truncate">
              {step.title || 'Sem título'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {step.blocks.length} blocos
            </p>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function StepsPanel({
  steps,
  selectedStepId,
  onSelectStep,
  onAddStep,
  onDeleteStep,
  onDuplicateStep,
}: StepsPanelProps) {
  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs">
            1
          </div>
          Etapas do Quiz
        </h3>
        <Button
          onClick={onAddStep}
          size="sm"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Etapa
        </Button>
      </div>

      {/* Lista de etapas */}
      <ScrollArea className="flex-1 p-4">
        <SortableContext
          items={steps.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {steps.map(step => (
            <SortableStepItem
              key={step.id}
              step={step}
              isSelected={step.id === selectedStepId}
              onSelect={() => onSelectStep(step.id)}
              onDelete={() => onDeleteStep(step.id)}
              onDuplicate={() => onDuplicateStep(step.id)}
            />
          ))}
        </SortableContext>
      </ScrollArea>
    </div>
  );
}
