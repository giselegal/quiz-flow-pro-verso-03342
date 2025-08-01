
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Type, Image, MousePointer, Layout, FileText, HelpCircle } from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

const COMPONENT_TYPES = [
  { type: 'header', name: 'Cabeçalho', icon: Type, description: 'Título principal' },
  { type: 'text', name: 'Texto', icon: FileText, description: 'Parágrafo de texto' },
  { type: 'image', name: 'Imagem', icon: Image, description: 'Imagem ou foto' },
  { type: 'button', name: 'Botão', icon: MousePointer, description: 'Botão de ação' },
  { type: 'spacer', name: 'Espaçador', icon: Layout, description: 'Espaço em branco' },
  { type: 'quiz-question', name: 'Questão', icon: HelpCircle, description: 'Pergunta do quiz' },
];

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  onComponentSelect
}) => {
  return (
    <div className="h-full bg-white border-r border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="font-medium text-gray-800 mb-2">Componentes</h3>
        <p className="text-sm text-gray-600">Arraste para adicionar ao canvas</p>
      </div>

      <div className="space-y-2">
        {COMPONENT_TYPES.map((component) => {
          const IconComponent = component.icon;
          return (
            <Card key={component.type} className="p-3 hover:shadow-md cursor-pointer transition-shadow">
              <Button
                variant="ghost"
                className="w-full justify-start p-0 h-auto"
                onClick={() => onComponentSelect(component.type)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{component.name}</div>
                    <div className="text-xs text-gray-500">{component.description}</div>
                  </div>
                </div>
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
