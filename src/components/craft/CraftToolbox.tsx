
import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Type,
  Image,
  Mouse,
  Square,
  Play,
  MessageSquare,
  DollarSign,
  Clock,
  HelpCircle,
  TrendingUp,
  Gift,
  Shield,
  FileText,
  Users,
  Zap
} from 'lucide-react';

export const CraftToolbox: React.FC = () => {
  const { connectors } = useEditor();

  const basicBlocks = [
    {
      type: 'CraftTextBlock',
      label: 'Texto',
      icon: <Type className="w-4 h-4" />,
      props: { text: 'Texto de exemplo' }
    },
    {
      type: 'CraftHeadingBlock',
      label: 'Cabeçalho',
      icon: <Type className="w-4 h-4" />,
      props: { text: 'Cabeçalho', level: 2 }
    },
    {
      type: 'CraftImageBlock',
      label: 'Imagem',
      icon: <Image className="w-4 h-4" />,
      props: { src: 'https://via.placeholder.com/400x200', alt: 'Imagem' }
    },
    {
      type: 'CraftButtonBlock',
      label: 'Botão',
      icon: <Mouse className="w-4 h-4" />,
      props: { text: 'Clique aqui', variant: 'default' }
    },
    {
      type: 'CraftSpacerBlock',
      label: 'Espaçador',
      icon: <Square className="w-4 h-4" />,
      props: { height: 40 }
    },
    {
      type: 'CraftVideoBlock',
      label: 'Vídeo',
      icon: <Play className="w-4 h-4" />,
      props: { videoUrl: '' }
    }
  ];

  const quizBlocks = [
    {
      type: 'CraftQuizStartBlock',
      label: 'Início do Quiz',
      icon: <Zap className="w-4 h-4" />,
      props: { title: 'Bem-vindo ao Quiz!' }
    },
    {
      type: 'CraftQuizQuestionBlock',
      label: 'Questão Quiz',
      icon: <HelpCircle className="w-4 h-4" />,
      props: { question: 'Qual é a sua pergunta?' }
    },
    {
      type: 'CraftQuizTransitionBlock',
      label: 'Transição Quiz',
      icon: <TrendingUp className="w-4 h-4" />,
      props: { message: 'Calculando resultado...' }
    },
    {
      type: 'CraftQuizResultBlock',
      label: 'Resultado Quiz',
      icon: <FileText className="w-4 h-4" />,
      props: { title: 'Seu Resultado' }
    },
    {
      type: 'CraftProgressBlock',
      label: 'Progresso',
      icon: <TrendingUp className="w-4 h-4" />,
      props: { current: 1, total: 10 }
    }
  ];

  const salesBlocks = [
    {
      type: 'CraftOfferBlock',
      label: 'Oferta',
      icon: <DollarSign className="w-4 h-4" />,
      props: { title: 'Oferta Especial!' }
    },
    {
      type: 'CraftPricingBlock',
      label: 'Preço',
      icon: <DollarSign className="w-4 h-4" />,
      props: { price: 'R$ 97', originalPrice: 'R$ 197' }
    },
    {
      type: 'CraftCountdownBlock',
      label: 'Contador',
      icon: <Clock className="w-4 h-4" />,
      props: { minutes: 15 }
    },
    {
      type: 'CraftTestimonialBlock',
      label: 'Depoimento',
      icon: <MessageSquare className="w-4 h-4" />,
      props: { text: 'Excelente produto!' }
    },
    {
      type: 'CraftBonusBlock',
      label: 'Bônus',
      icon: <Gift className="w-4 h-4" />,
      props: { title: 'Bônus Especial' }
    },
    {
      type: 'CraftGuaranteeBlock',
      label: 'Garantia',
      icon: <Shield className="w-4 h-4" />,
      props: { title: 'Garantia de 30 dias' }
    },
    {
      type: 'CraftSocialProofBlock',
      label: 'Prova Social',
      icon: <Users className="w-4 h-4" />,
      props: { count: 1000 }
    },
    {
      type: 'CraftFAQBlock',
      label: 'FAQ',
      icon: <HelpCircle className="w-4 h-4" />,
      props: { title: 'Perguntas Frequentes' }
    }
  ];

  const formBlocks = [
    {
      type: 'CraftFormBlock',
      label: 'Formulário',
      icon: <FileText className="w-4 h-4" />,
      props: { fields: [{ type: 'text', label: 'Nome' }] }
    }
  ];

  const renderBlockSection = (title: string, blocks: any[]) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <Button
            key={index}
            ref={(ref) => connectors.create(ref, <Element is={block.type} {...block.props} />)}
            variant="ghost"
            size="sm"
            className="w-full justify-start h-10"
          >
            {block.icon}
            <span className="ml-2">{block.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Componentes</h2>
        <p className="text-sm text-gray-600 mt-1">
          Arraste os componentes para o canvas
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {renderBlockSection('Básicos', basicBlocks)}
        <Separator className="my-4" />
        {renderBlockSection('Quiz', quizBlocks)}
        <Separator className="my-4" />
        {renderBlockSection('Vendas', salesBlocks)}
        <Separator className="my-4" />
        {renderBlockSection('Formulários', formBlocks)}
      </ScrollArea>
    </div>
  );
};
