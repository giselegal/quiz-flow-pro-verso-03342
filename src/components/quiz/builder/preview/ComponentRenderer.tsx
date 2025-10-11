// @ts-nocheck
import { QuizComponentData } from '@/types/quizBuilder';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ComponentRendererProps {
  component: QuizComponentData;
  isSelected?: boolean;
  onSelect?: () => void;
  onMove?: (draggedId: string, targetId: string) => void;
  isPreviewing?: boolean;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isSelected = false,
  onSelect,
  onMove,
  isPreviewing = false,
}) => {
  const data = component.data || {};

  const renderComponentContent = () => {
    switch (component.type) {
      case 'headline':
        return (
          <div className="space-y-2">
            {data.title && <h2 className="text-2xl font-bold">{data.title}</h2>}
            {data.subtitle && <p className="text-lg">{data.subtitle}</p>}
          </div>
        );

      case 'text':
        return <div className="prose max-w-none">{data.text || 'Texto de exemplo'}</div>;

      case 'image':
        return data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.alt || 'Imagem'}
            className="max-w-full h-auto rounded"
          />
        ) : (
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <p style={{ color: '#8B7355' }}>Imagem não definida</p>
          </div>
        );

      case 'stageQuestion':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">{data.question || 'Pergunta não definida'}</h3>
            {data.options && data.options.length > 0 ? (
              <div className="space-y-2">
                {data.options.map((option: string, index: number) => (
                  <div key={index} style={{ backgroundColor: '#FAF9F7' }}>
                    {option}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#FAF9F7' }}>
                <p style={{ color: '#8B7355' }}>Opções não definidas</p>
              </div>
            )}
          </div>
        );

      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {data.options && data.options.length > 0 ? (
              data.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`opt-${component.id}-${index}`}
                    disabled={isPreviewing}
                  />
                  <label htmlFor={`opt-${component.id}-${index}`}>{option}</label>
                </div>
              ))
            ) : (
              <div style={{ color: '#8B7355' }}>Opções não definidas</div>
            )}
          </div>
        );

      case 'singleChoice':
        return (
          <div className="space-y-2">
            {data.options && data.options.length > 0 ? (
              data.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`opt-${component.id}`}
                    id={`opt-${component.id}-${index}`}
                    disabled={isPreviewing}
                  />
                  <label htmlFor={`opt-${component.id}-${index}`}>{option}</label>
                </div>
              ))
            ) : (
              <div style={{ color: '#8B7355' }}>Opções não definidas</div>
            )}
          </div>
        );

      default:
        return <div>Componente de tipo desconhecido: {component.type}</div>;
    }
  };

  return (
    <Card
      className={cn(
        'mb-4 p-4 transition-colors',
        isSelected && !isPreviewing ? 'border-2 border-[#B89B7A]' : '',
        !isPreviewing && 'hover:bg-gray-50 cursor-pointer'
      )}
      onClick={() => !isPreviewing && onSelect && onSelect()}
    >
      {renderComponentContent()}
    </Card>
  );
};

export default ComponentRenderer;
