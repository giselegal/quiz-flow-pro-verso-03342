import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuizComponentType, QuizStage } from '@/types/quizBuilder';
import {
  Type,
  Image as ImageIcon,
  FileText,
  ListChecks,
  CheckSquare,
  FileQuestion,
} from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: QuizComponentType) => void;
  activeStage?: QuizStage | null;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  onComponentSelect,
  activeStage,
}) => {
  if (!activeStage) {
    return (
      <div className="p-4 text-center">
        <p className="text-[#8F7A6A]">Selecione uma etapa para adicionar componentes</p>
      </div>
    );
  }

  // Define components based on stage type
  const getComponentsForStageType = () => {
    switch (activeStage.type) {
      case 'cover':
        return [
          {
            type: 'text',
            icon: <FileText className="h-4 w-4 mr-2" />,
            label: 'Texto',
          },
          {
            type: 'headline',
            icon: <Type className="h-4 w-4 mr-2" />,
            label: 'Título',
          },
          {
            type: 'image',
            icon: <ImageIcon className="h-4 w-4 mr-2" />,
            label: 'Imagem',
          },
        ];
      case 'question':
        return [
          {
            type: 'stageQuestion',
            icon: <FileQuestion className="h-4 w-4 mr-2" />,
            label: 'Pergunta',
          },
          {
            type: 'text',
            icon: <FileText className="h-4 w-4 mr-2" />,
            label: 'Texto',
          },
          {
            type: 'multipleChoice',
            icon: <ListChecks className="h-4 w-4 mr-2" />,
            label: 'Múltipla Escolha',
          },
          {
            type: 'singleChoice',
            icon: <CheckSquare className="h-4 w-4 mr-2" />,
            label: 'Escolha Única',
          },
          {
            type: 'image',
            icon: <ImageIcon className="h-4 w-4 mr-2" />,
            label: 'Imagem',
          },
        ];
      case 'result':
        return [
          {
            type: 'quizResult',
            icon: <ListChecks className="h-4 w-4 mr-2" />,
            label: 'Resultado',
          },
          {
            type: 'text',
            icon: <FileText className="h-4 w-4 mr-2" />,
            label: 'Texto',
          },
          {
            type: 'headline',
            icon: <Type className="h-4 w-4 mr-2" />,
            label: 'Título',
          },
          {
            type: 'image',
            icon: <ImageIcon className="h-4 w-4 mr-2" />,
            label: 'Imagem',
          },
        ];
      default:
        return [
          {
            type: 'text',
            icon: <FileText className="h-4 w-4 mr-2" />,
            label: 'Texto',
          },
          {
            type: 'headline',
            icon: <Type className="h-4 w-4 mr-2" />,
            label: 'Título',
          },
          {
            type: 'image',
            icon: <ImageIcon className="h-4 w-4 mr-2" />,
            label: 'Imagem',
          },
        ];
    }
  };

  const components = getComponentsForStageType();

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        <h3 className="font-medium text-[#432818]">Componentes disponíveis</h3>

        <div className="grid gap-2">
          {components.map(component => (
            <Button
              key={component.type}
              variant="outline"
              className="justify-start text-left"
              onClick={() => onComponentSelect(component.type as QuizComponentType)}
            >
              {component.icon}
              {component.label}
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
