

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockType } from '@/types/editor';
import { 
  Type, 
  Image, 
  MousePointer, 
  Square,
  Heading1,
  Star,
  DollarSign,
  Shield,
  MessageSquare,
  Video,
  BarChart,
  Gift,
  Palette,
  Layers
} from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: string) => void;
}

const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const blockTypes: Array<{
    category: string;
    blocks: Array<{
      type: string;
      name: string;
      icon: React.ComponentType<{ className?: string }>;
      description: string;
    }>;
  }> = [
    {
      category: "Básicos",
      blocks: [
        { type: "heading", name: "Título", icon: Heading1, description: "Títulos e subtítulos" },
        { type: "paragraph", name: "Texto", icon: Type, description: "Parágrafo de texto" },
        { type: "image", name: "Imagem", icon: Image, description: "Imagem com legenda" },
        { type: "button", name: "Botão", icon: MousePointer, description: "Botão de ação" },
        { type: "spacer", name: "Espaçador", icon: Square, description: "Espaço em branco" }
      ]
    },
    {
      category: "Resultado do Quiz",
      blocks: [
        { type: "style-result", name: "Estilo Principal", icon: Star, description: "Resultado do estilo principal" },
        { type: "secondary-styles", name: "Estilos Secundários", icon: Layers, description: "Outros estilos compatíveis" }
      ]
    },
    {
      category: "Vendas",
      blocks: [
        { type: "pricing", name: "Preço", icon: DollarSign, description: "Seção de preços" },
        { type: "guarantee", name: "Garantia", icon: Shield, description: "Garantia do produto" },
        { type: "testimonials", name: "Depoimentos", icon: MessageSquare, description: "Depoimentos de clientes" },
        { type: "cta", name: "Chamada para Ação", icon: MousePointer, description: "Botão principal de conversão" }
      ]
    },
    {
      category: "Avançado",
      blocks: [
        { type: "video", name: "Vídeo", icon: Video, description: "Player de vídeo" },
        { type: "two-column", name: "Duas Colunas", icon: BarChart, description: "Layout de duas colunas" },
        { type: "carousel", name: "Carrossel", icon: Gift, description: "Carrossel de conteúdo" },
        { type: "custom-code", name: "Código Customizado", icon: Palette, description: "HTML/CSS personalizado" }
      ]
    }
  ];

  return (
    <div className="h-full border-r border-gray-200 bg-white">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900">Componentes</h2>
        <p className="text-sm text-gray-500 mt-1">Arraste para adicionar</p>
      </div>
      
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {blockTypes.map((category) => (
            <Card key={category.category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {category.blocks.map((block) => (
                  <Button
                    key={block.type}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => onComponentSelect(block.type)}
                  >
                    <block.icon className="w-4 h-4 mr-3 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{block.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {block.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComponentsSidebar;

