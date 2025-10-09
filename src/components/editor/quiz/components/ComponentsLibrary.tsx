/**
 * 🎯 BIBLIOTECA DE COMPONENTES (Coluna 2)
 * Drag source para adicionar blocos ao canvas
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import {
  Type,
  Image as ImageIcon,
  MousePointer,
  List,
  Layout,
  Heading1,
  TextCursor,
  LayoutGrid,
} from 'lucide-react';

interface ComponentType {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'layout' | 'content' | 'interactive' | 'media';
  defaultProps: Record<string, any>;
}

const COMPONENT_TYPES: ComponentType[] = [
  // Layout
  {
    id: 'container',
    type: 'container',
    label: 'Container',
    description: 'Contêiner flexível',
    icon: <Layout className="w-5 h-5" />,
    category: 'layout',
    defaultProps: { padding: 'medium', alignment: 'center' },
  },
  {
    id: 'divider',
    type: 'divider',
    label: 'Divisor',
    description: 'Linha divisória',
    icon: <LayoutGrid className="w-5 h-5" />,
    category: 'layout',
    defaultProps: { thickness: 1, color: 'border' },
  },

  // Content
  {
    id: 'heading',
    type: 'heading',
    label: 'Título',
    description: 'Cabeçalho/título',
    icon: <Heading1 className="w-5 h-5" />,
    category: 'content',
    defaultProps: { text: 'Novo Título', level: 2, align: 'center' },
  },
  {
    id: 'text',
    type: 'text',
    label: 'Texto',
    description: 'Parágrafo de texto',
    icon: <Type className="w-5 h-5" />,
    category: 'content',
    defaultProps: { text: 'Texto aqui...', align: 'left' },
  },
  {
    id: 'image',
    type: 'image',
    label: 'Imagem',
    description: 'Imagem ou foto',
    icon: <ImageIcon className="w-5 h-5" />,
    category: 'media',
    defaultProps: { src: '', alt: 'Imagem', width: 'auto' },
  },

  // Interactive
  {
    id: 'button',
    type: 'button',
    label: 'Botão',
    description: 'Botão de ação',
    icon: <MousePointer className="w-5 h-5" />,
    category: 'interactive',
    defaultProps: { text: 'Clique Aqui', variant: 'default' },
  },
  {
    id: 'quiz-options',
    type: 'quiz-options',
    label: 'Opções de Quiz',
    description: 'Seleção múltipla',
    icon: <List className="w-5 h-5" />,
    category: 'interactive',
    defaultProps: {
      options: [
        { id: '1', text: 'Opção 1' },
        { id: '2', text: 'Opção 2' },
      ],
      multiSelect: true,
    },
  },
  {
    id: 'form-input',
    type: 'form-input',
    label: 'Campo de Texto',
    description: 'Input de formulário',
    icon: <TextCursor className="w-5 h-5" />,
    category: 'interactive',
    defaultProps: { placeholder: 'Digite aqui...', required: false },
  },
];

function DraggableComponent({ component }: { component: ComponentType }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: { type: component.type, defaultProps: component.defaultProps },
  });

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:scale-105',
        isDragging && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-primary">{component.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{component.label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {component.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function ComponentsLibrary() {
  const layoutComponents = COMPONENT_TYPES.filter(c => c.category === 'layout');
  const contentComponents = COMPONENT_TYPES.filter(c => c.category === 'content');
  const interactiveComponents = COMPONENT_TYPES.filter(c => c.category === 'interactive');
  const mediaComponents = COMPONENT_TYPES.filter(c => c.category === 'media');

  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-secondary/10 to-accent/10">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <div className="w-5 h-5 bg-secondary rounded-md flex items-center justify-center text-secondary-foreground text-xs">
            2
          </div>
          Componentes
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Arraste para o canvas
        </p>
      </div>

      {/* Categorias */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
          <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
          <TabsTrigger value="content" className="text-xs">Conteúdo</TabsTrigger>
          <TabsTrigger value="interactive" className="text-xs">Interativo</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="all" className="space-y-2 mt-0">
            {COMPONENT_TYPES.map(comp => (
              <DraggableComponent key={comp.id} component={comp} />
            ))}
          </TabsContent>

          <TabsContent value="layout" className="space-y-2 mt-0">
            {layoutComponents.map(comp => (
              <DraggableComponent key={comp.id} component={comp} />
            ))}
          </TabsContent>

          <TabsContent value="content" className="space-y-2 mt-0">
            {[...contentComponents, ...mediaComponents].map(comp => (
              <DraggableComponent key={comp.id} component={comp} />
            ))}
          </TabsContent>

          <TabsContent value="interactive" className="space-y-2 mt-0">
            {interactiveComponents.map(comp => (
              <DraggableComponent key={comp.id} component={comp} />
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
