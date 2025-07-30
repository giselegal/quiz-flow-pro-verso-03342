
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizComponentData } from '@/types/quizBuilder';
import { Trash2, X } from 'lucide-react';
import { PropertyEditorRouter } from '@/components/live-editor/property-editors/PropertyEditorRouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyPanelProps {
  selectedComponentId: string | null;
  components: QuizComponentData[];
  onUpdate: (id: string, updates: Partial<QuizComponentData>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponentId,
  components,
  onUpdate,
  onDelete,
  onClose,
}) => {
  if (!selectedComponentId) {
    return (
      <div className="h-full bg-white flex flex-col">
        <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
          <h2 className="font-medium text-[#432818]">Propriedades</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-[#8F7A6A]">
            Selecione um componente para editar suas propriedades
          </p>
        </div>
      </div>
    );
  }

  const component = components.find(c => c.id === selectedComponentId);

  if (!component) {
    return (
      <div className="h-full bg-white flex flex-col">
        <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
          <h2 className="font-medium text-[#432818]">Propriedades</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-[#8F7A6A]">
            Componente não encontrado
          </p>
        </div>
      </div>
    );
  }

  const getComponentTitle = () => {
    switch (component.type) {
      case 'headline': return 'Título';
      case 'text': return 'Texto';
      case 'image': return 'Imagem';
      case 'button':
      case 'cta': return 'Botão';
      case 'video': return 'Vídeo';
      case 'divider': return 'Divisória';
      case 'spacer': return 'Espaçador';
      case 'benefitsList': return 'Lista de Benefícios';
      case 'faq': return 'FAQ';
      case 'multipleChoice': return 'Múltipla Escolha';
      case 'singleChoice': return 'Escolha Única';
      case 'scale': return 'Escala';
      case 'openEnded': return 'Resposta Aberta';
      case 'date': return 'Data';
      case 'stageCover': return 'Capa do Estágio';
      case 'stageQuestion': return 'Questão do Estágio';
      case 'stageResult': return 'Resultado do Estágio';
      case 'quizResult': return 'Resultado do Quiz';
      default: return component.type.charAt(0).toUpperCase() + component.type.slice(1);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
        <h2 className="font-medium text-[#432818]">
          {getComponentTitle()}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4 text-[#8F7A6A]" />
        </Button>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-1">
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1">
          <TabsContent value="properties" className="p-4">
            <PropertyEditorRouter 
              component={component} 
              onUpdate={onUpdate} 
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <div className="p-4 border-t border-[#B89B7A]/20">
        <Button 
          variant="destructive" 
          onClick={() => onDelete(selectedComponentId)} 
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Componente
        </Button>
      </div>
    </div>
  );
};
