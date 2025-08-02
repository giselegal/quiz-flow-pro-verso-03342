
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import ComponentRenderer from './ComponentRenderer';

interface PreviewPanelProps {
  components: QuizComponentData[];
  selectedComponentId?: string;
  onComponentSelect?: (id: string) => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  components,
  selectedComponentId,
  onComponentSelect
}) => {
  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-4">
        {components.map((component) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            isSelected={selectedComponentId === component.id}
            onClick={() => onComponentSelect?.(component.id)}
          />
        ))}
        
        {components.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>Nenhum componente adicionado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
