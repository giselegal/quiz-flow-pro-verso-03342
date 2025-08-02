import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { HeaderComponent } from '../funnel/components/HeaderComponent';
import { TextComponent } from '../funnel/components/TextComponent';
import { ImageComponent } from '../funnel/components/ImageComponent';
import { MultipleChoiceComponent } from '../funnel/components/MultipleChoiceComponent';
import { SingleChoiceComponent } from '../funnel/components/SingleChoiceComponent';
import { ScaleComponent } from '../funnel/components/ScaleComponent';

interface ComponentRendererProps {
  component: QuizComponentData;
  isSelected?: boolean;
  onClick?: () => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onClick
}) => {
  const data = component.data || {};
  
  const renderComponent = () => {
    switch (component.type) {
      case 'header':
        return (
          <HeaderComponent 
            data={{ 
              title: data.title || 'Título',
              subtitle: data.subtitle || 'Subtítulo'
            }}
            style={component.style}
            isSelected={isSelected}
          />
        );

      case 'text':
        return (
          <TextComponent 
            data={{ 
              text: data.text || 'Texto padrão'
            }}
            style={component.style}
            isSelected={isSelected}
          />
        );

      case 'headline':
        return (
          <TextComponent 
            isHeadline={true}
            data={{ 
              title: data.title || 'Título',
              subtitle: data.subtitle || 'Subtítulo'
            }}
            style={component.style}
            isSelected={isSelected}
          />
        );

      case 'image':
        return (
          <ImageComponent 
            data={{ 
              imageUrl: data.imageUrl || '',
              alt: data.alt || 'Imagem'
            }}
            style={component.style}
            isSelected={isSelected}
          />
        );

      case 'multipleChoice':
        return (
          <MultipleChoiceComponent
            data={{
              question: data.question || 'Pergunta',
              options: data.options || [],
              minSelections: data.minSelections || 1,
              maxSelections: data.maxSelections || 1,
              displayType: data.displayType || 'text'
            }}
            style={component.style}
            isSelected={isSelected}
          />
        );

      case 'singleChoice':
        return (
          <SingleChoiceComponent
            data={{
              question: data.question || 'Pergunta',
              options: data.options || []
            }}
            style={component.style}
            isSelected={isSelected}
          />
        );

      case 'scale':
        return (
          <ScaleComponent
            data={{
              question: data.question || 'Pergunta',
              minValue: data.minValue || 1,
              maxValue: data.maxValue || 10,
              minLabel: data.minLabel || 'Mínimo',
              maxLabel: data.maxLabel || 'Máximo',
              showNumbers: data.showNumbers !== false
            }}
            style={component.style}
            isSelected={isSelected}
          />
        );

      default:
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-500">Tipo de componente desconhecido: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {renderComponent()}
    </div>
  );
};

export default ComponentRenderer;
