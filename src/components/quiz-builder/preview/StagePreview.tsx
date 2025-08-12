import { QuizStage, QuizComponentData } from '@/types/quizBuilder';
import ComponentRenderer from '../ComponentRenderer';

interface StagePreviewProps {
  stage: QuizStage;
  components: QuizComponentData[];
}

const StagePreview: React.FC<StagePreviewProps> = ({ stage, components }) => {
  if (!stage) {
    return (
      <div className="text-center p-8 border border-dashed border-[#B89B7A]/40 rounded-lg">
        <p className="text-[#8F7A6A]">Selecione uma etapa para visualizar</p>
      </div>
    );
  }

  // Ordenar os componentes por ordem
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedComponents.map(component => (
        <ComponentRenderer key={component.id} component={component} isSelected={false} />
      ))}

      {sortedComponents.length === 0 && (
        <div className="text-center p-8 border border-dashed border-[#B89B7A]/40 rounded-lg">
          <p className="text-[#8F7A6A]">
            Nenhum componente adicionado para a etapa "{stage.title}".
          </p>
          <p className="text-[#8F7A6A] text-sm mt-2">
            Adicione componentes no editor para visualizá-los aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default StagePreview;
