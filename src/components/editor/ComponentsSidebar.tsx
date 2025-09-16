import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEditor } from '@/components/editor/EditorProvider';
import { BlockType } from '@/types/editor';
import { Step20ComponentsButton } from './Step20ComponentsButton';
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
  Trophy,
  User,
  Target,
  Palette,
  Star,
  Heart,
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
  {
    title: 'Resultado Step 20',
    items: [
      {
        type: 'step20-result-header',
        label: 'Header Resultado',
        icon: <Trophy className="h-4 w-4" />,
        description: 'Cabeçalho comemorativo do resultado',
      },
      {
        type: 'step20-user-greeting',
        label: 'Saudação Usuario',
        icon: <User className="h-4 w-4" />,
        description: 'Saudação personalizada com nome',
      },
      {
        type: 'step20-style-reveal',
        label: 'Revelação Estilo',
        icon: <Palette className="h-4 w-4" />,
        description: 'Revelação do estilo descoberto',
      },
      {
        type: 'step20-compatibility',
        label: 'Compatibilidade',
        icon: <Target className="h-4 w-4" />,
        description: 'Indicador de compatibilidade animado',
      },
      {
        type: 'step20-secondary-styles',
        label: 'Estilos Secundários',
        icon: <Star className="h-4 w-4" />,
        description: 'Grid de estilos complementares',
      },
      {
        type: 'step20-personalized-offer',
        label: 'Oferta Personalizada',
        icon: <Heart className="h-4 w-4" />,
        description: 'CTA e ofertas baseadas no resultado',
      },
      {
        type: 'step20-complete-template',
        label: 'Template Completo',
        icon: <Award className="h-4 w-4" />,
        description: 'Template completo da Step 20',
      },
    ],
  },
];

export const ComponentsSidebar: React.FC = () => {
  const { addBlock, activeStageId } = useEditor();

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
  };

  // Filtrar componentes baseado na etapa ativa
  const getFilteredCategories = () => {
    const isStep20 = activeStageId === 'step-20' || activeStageId === 'step20' || activeStageId?.includes('20');
    
    if (isStep20) {
      // Na etapa 20, mostrar apenas componentes relevantes
      return blockCategories.filter(category => 
        category.title === 'Resultado Step 20' || category.title === 'Conteúdo'
      );
    }
    
    // Em outras etapas, mostrar todos exceto Step 20
    return blockCategories.filter(category => category.title !== 'Resultado Step 20');
  };

  return (
    <Card className="h-full border-r rounded-none">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm font-medium">Componentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-4 p-4">
            {/* Componentes Step 20 - Especiais */}
            <Step20ComponentsButton />
            
            {/* Indicador da etapa atual */}
            {activeStageId === 'step-20' && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg mb-4">
                <div className="text-sm font-medium text-primary">🎉 Etapa 20 - Resultado</div>
                <div className="text-xs text-muted-foreground">Componentes para página de resultado</div>
              </div>
            )}
            
            {getFilteredCategories().map((category, index) => (
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
