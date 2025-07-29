
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockType } from '@/types/editor';
import { 
  Type, 
  Heading, 
  Image, 
  MousePointer, 
  Space, 
  HelpCircle,
  Play,
  User,
  MessageSquare,
  CheckCircle,
  Loader,
  Trophy,
  BookOpen,
  Gift,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: BlockType) => void;
}

// Definir todas as 21 etapas do funil
const FUNNEL_STEPS = [
  // Etapa 1: Introdução
  { type: 'funnel-intro', name: 'Introdução', icon: 'Play', category: 'Funil' },
  
  // Etapa 2: Coleta de nome
  { type: 'name-collect', name: 'Coleta de Nome', icon: 'User', category: 'Funil' },
  
  // Etapa 3: Introdução ao quiz
  { type: 'quiz-intro', name: 'Intro Quiz', icon: 'MessageSquare', category: 'Funil' },
  
  // Etapas 4-14: Perguntas múltiplas (11 perguntas)
  { type: 'question-multiple', name: 'Pergunta Múltipla', icon: 'HelpCircle', category: 'Funil' },
  
  // Etapa 15: Transição do quiz
  { type: 'quiz-transition', name: 'Transição Quiz', icon: 'ArrowRight', category: 'Funil' },
  
  // Etapa 16: Processamento
  { type: 'processing', name: 'Processamento', icon: 'Loader', category: 'Funil' },
  
  // Etapa 17: Introdução ao resultado
  { type: 'result-intro', name: 'Intro Resultado', icon: 'Trophy', category: 'Funil' },
  
  // Etapa 18: Detalhes do resultado
  { type: 'result-details', name: 'Detalhes Resultado', icon: 'CheckCircle', category: 'Funil' },
  
  // Etapa 19: Guia do resultado
  { type: 'result-guide', name: 'Guia Resultado', icon: 'BookOpen', category: 'Funil' },
  
  // Etapa 20: Transição para oferta
  { type: 'offer-transition', name: 'Transição Oferta', icon: 'ArrowRight', category: 'Funil' },
  
  // Etapa 21: Página da oferta
  { type: 'offer-page', name: 'Página Oferta', icon: 'ShoppingCart', category: 'Funil' },
];

const BASIC_BLOCKS = [
  { type: 'text', name: 'Texto', icon: 'Type', category: 'Básico' },
  { type: 'header', name: 'Cabeçalho', icon: 'Heading', category: 'Básico' },
  { type: 'image', name: 'Imagem', icon: 'Image', category: 'Básico' },
  { type: 'button', name: 'Botão', icon: 'MousePointer', category: 'Básico' },
  { type: 'spacer', name: 'Espaçador', icon: 'Space', category: 'Básico' },
];

const ALL_BLOCKS = [...BASIC_BLOCKS, ...FUNNEL_STEPS];

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const iconMap = {
    Type, Heading, Image, MousePointer, Space, HelpCircle,
    Play, User, MessageSquare, CheckCircle, Loader, Trophy,
    BookOpen, Gift, ArrowRight, ShoppingCart
  };

  const categories = Array.from(new Set(ALL_BLOCKS.map(block => block.category)));

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-medium text-[#432818]">Componentes do Funil</h2>
        <p className="text-sm text-gray-500 mt-1">
          Arraste os componentes para criar seu funil de 21 etapas
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
              {category}
            </h3>
            <div className="space-y-2">
              {ALL_BLOCKS.filter(block => block.category === category).map((block) => {
                const Icon = iconMap[block.icon as keyof typeof iconMap] || Type;
                return (
                  <Button
                    key={block.type}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 hover:bg-[#FAF9F7] text-left"
                    onClick={() => onComponentSelect(block.type as BlockType)}
                  >
                    <Icon className="w-4 h-4 text-[#B89B7A]" />
                    <span className="text-sm">{block.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
