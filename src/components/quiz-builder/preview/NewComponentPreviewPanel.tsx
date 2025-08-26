import { QuizComponentData, QuizStage } from '@/types/quizBuilder';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableComponent } from './DraggableComponent';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ComponentPreviewPanelProps {
  components: QuizComponentData[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onMoveComponent: (draggedId: string, targetId: string) => void;
  activeStage: QuizStage | null;
  isPreviewing: boolean;
}

export const NewComponentPreviewPanel: React.FC<ComponentPreviewPanelProps> = ({
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
        <p style={{ color: '#8B7355' }}>Selecione uma etapa para visualizar seus componentes.</p>
      </div>
    );
  }

  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="h-full bg-[#F9F5F1] flex flex-col">
      <div style={{ borderColor: '#E5DDD5' }}>
        <h3 style={{ color: '#6B4F43' }}>
          Visualizando: {activeStage.title || `Etapa ${activeStage.order + 1}`}
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div
          className={cn(
            'min-h-full w-full max-w-4xl mx-auto',
            isPreviewing ? 'pointer-events-none select-none' : ''
          )}
        >
          {sortedComponents.length === 0 ? (
            <div style={{ borderColor: '#E5DDD5' }}>
              <p style={{ color: '#8B7355' }}>
                Adicione componentes para esta etapa usando o painel lateral.
              </p>
              <Button variant="outline" size="sm" onClick={() => {}} style={{ color: '#8B7355' }}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar Componente
              </Button>
            </div>
          ) : (
            <SortableContext
              items={sortedComponents.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedComponents.map(component => (
                <DraggableComponent
                  key={component.id}
                  component={component}
                  isSelected={component.id === selectedComponentId}
                  onSelect={() => onSelectComponent(component.id)}
                  onMove={onMoveComponent}
                  isPreviewing={isPreviewing}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};