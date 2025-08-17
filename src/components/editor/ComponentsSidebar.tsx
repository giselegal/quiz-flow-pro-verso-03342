import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEditor } from '@/context/EditorContext';
import { BlockType } from '@/types/editor';
import {
  Award,
  Box,
  CheckSquare,
  FileText,
  Gift,
  Grid,
  Heading,
  Image as ImageIcon,
  MessageSquare,
  Slash,
  Text,
  Type,
  Video,
} from 'lucide-react';
import React from 'react';

interface BlockOption {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface BlockCategory {
  title: string;
  items: BlockOption[];
}

const blockCategories: BlockCategory[] = [
  {
    title: 'Conteúdo',
    items: [
      {
        type: 'text',
        label: 'Texto',
        icon: <Text className="h-4 w-4" />,
        description: 'Adicionar texto simples',
      },
      {
        type: 'text-inline',
        label: 'Título',
        icon: <Heading className="h-4 w-4" />,
        description: 'Adicionar título ou subtítulo',
      },
      {
        type: 'image',
        label: 'Imagem',
        icon: <ImageIcon className="h-4 w-4" />,
        description: 'Adicionar imagem',
      },
      {
        type: 'video',
        label: 'Vídeo',
        icon: <Video className="h-4 w-4" />,
        description: 'Incorporar vídeo',
      },
    ],
  },
  {
    title: 'Quiz',
    items: [
      {
        type: 'quiz-header',
        label: 'Header Quiz',
        icon: <Type className="h-4 w-4" />,
        description: 'Cabeçalho do quiz',
      },
      {
        type: 'quiz-intro-header',
        label: 'Intro Quiz',
        icon: <MessageSquare className="h-4 w-4" />,
        description: 'Introdução do quiz',
      },
      {
        type: 'lead-form',
        label: 'Form Lead',
        icon: <FileText className="h-4 w-4" />,
        description: 'Formulário de captura',
      },
      {
        type: 'options-grid',
        label: 'Opções',
        icon: <CheckSquare className="h-4 w-4" />,
        description: 'Grid de opções',
      },
      {
        type: 'result-display',
        label: 'Resultado',
        icon: <Award className="h-4 w-4" />,
        description: 'Exibição do resultado',
      },
      {
        type: 'offer-cta',
        label: 'Oferta',
        icon: <Gift className="h-4 w-4" />,
        description: 'Call to action com oferta',
      },
    ],
  },
  {
    title: 'Layout',
    items: [
      {
        type: 'container',
        label: 'Container',
        icon: <Box className="h-4 w-4" />,
        description: 'Container flexível',
      },
      {
        type: 'grid',
        label: 'Grid',
        icon: <Grid className="h-4 w-4" />,
        description: 'Layout em grid',
      },
      {
        type: 'divider',
        label: 'Divisor',
        icon: <Slash className="h-4 w-4" />,
        description: 'Linha divisória',
      },
    ],
  },
];

export const ComponentsSidebar: React.FC = () => {
  const { addBlock } = useEditor();

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
  };

  return (
    <Card className="h-full border-r rounded-none">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm font-medium">Componentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-4 p-4">
            {blockCategories.map((category, index) => (
              <div key={category.title} className="space-y-2">
                {index > 0 && <Separator />}
                <h3 className="text-xs font-medium text-muted-foreground px-2 py-1">
                  {category.title}
                </h3>
                <div className="space-y-1">
                  {category.items.map(block => (
                    <Button
                      key={block.type}
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => handleAddBlock(block.type)}
                    >
                      {block.icon}
                      <span className="text-sm">{block.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
