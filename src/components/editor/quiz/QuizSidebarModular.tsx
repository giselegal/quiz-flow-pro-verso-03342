/**
 * 📋 SIDEBAR MODULAR PARA COMPONENTES
 * 
 * Lista de componentes disponíveis para o editor
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Type, 
  Image, 
  Grid3X3, 
  Navigation,
  X,
  Plus
} from 'lucide-react';

interface QuizSidebarModularProps {
  onClose: () => void;
}

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const AVAILABLE_COMPONENTS: ComponentItem[] = [
  {
    id: 'headline',
    name: 'Título',
    description: 'Título principal da etapa',
    icon: <Type className="h-4 w-4" />,
    category: 'Texto'
  },
  {
    id: 'text',
    name: 'Texto',
    description: 'Parágrafo ou texto descritivo',
    icon: <Type className="h-4 w-4" />,
    category: 'Texto'
  },
  {
    id: 'image',
    name: 'Imagem',
    description: 'Imagem decorativa ou ilustrativa',
    icon: <Image className="h-4 w-4" />,
    category: 'Mídia'
  },
  {
    id: 'options-grid',
    name: 'Opções do Quiz',
    description: 'Grid de opções para seleção',
    icon: <Grid3X3 className="h-4 w-4" />,
    category: 'Quiz'
  },
  {
    id: 'quiz-navigation',
    name: 'Navegação',
    description: 'Controles de navegação entre etapas',
    icon: <Navigation className="h-4 w-4" />,
    category: 'Quiz'
  }
];

export const QuizSidebarModular: React.FC<QuizSidebarModularProps> = ({
  onClose
}) => {
  const groupedComponents = AVAILABLE_COMPONENTS.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentItem[]>);

  const handleComponentAdd = (componentId: string) => {
    // TODO: Implement component addition logic
    console.log('Adding component:', componentId);
  };

  return (
    <div className="w-80 border-r bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Componentes</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedComponents).map(([category, components]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {category}
              </h4>
              
              <div className="space-y-2">
                {components.map((component) => (
                  <Card 
                    key={component.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleComponentAdd(component.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="text-primary mt-0.5">
                          {component.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {component.name}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {component.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};