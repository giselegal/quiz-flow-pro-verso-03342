import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditorBlock } from "@/types/editor";
import {
  Type,
  Heading1,
  Image,
  MousePointer,
  Layout,
  List,
  Star,
  CreditCard,
  Award,
  Users,
} from "lucide-react";

interface ComponentsSidebarProps {
  onComponentSelect: (type: EditorBlock["type"]) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const componentGroups = [
    {
      title: "Básico",
      components: [
        {
          type: "text-inline" as const,
          icon: <Type size={16} />,
          label: "Texto",
        },
        {
          type: "heading-inline" as const,
          icon: <Heading1 size={16} />,
          label: "Cabeçalho",
        },
        {
          type: "image-display-inline" as const,
          icon: <Image size={16} />,
          label: "Imagem",
        },
        {
          type: "button-inline" as const,
          icon: <MousePointer size={16} />,
          label: "Botão",
        },
        {
          type: "badge-inline" as const,
          icon: <Star size={16} />,
          label: "Badge",
        },
        {
          type: "progress-inline" as const,
          icon: <Layout size={16} />,
          label: "Progresso",
        },
        {
          type: "stat-inline" as const,
          icon: <Award size={16} />,
          label: "Estatística",
        },
        {
          type: "countdown-inline" as const,
          icon: <Users size={16} />,
          label: "Contador",
        },
      ],
    },
    {
      title: "Design",
      components: [
        {
          type: "style-card-inline" as const,
          icon: <CreditCard size={16} />,
          label: "Card de Estilo",
        },
        {
          type: "result-card-inline" as const,
          icon: <Award size={16} />,
          label: "Card de Resultado",
        },
        {
          type: "pricing-card-inline" as const,
          icon: <CreditCard size={16} />,
          label: "Preços",
        },
        {
          type: "testimonial-card-inline" as const,
          icon: <Users size={16} />,
          label: "Depoimentos",
        },
      ],
    },
    {
      title: "Quiz",
      components: [
        {
          type: "quiz-start-page-inline" as const,
          icon: <Star size={16} />,
          label: "Página Inicial",
        },
        {
          type: "quiz-question-inline" as const,
          icon: <List size={16} />,
          label: "Questão",
        },
        {
          type: "quiz-result-inline" as const,
          icon: <Award size={16} />,
          label: "Resultado",
        },
        {
          type: "quiz-offer-cta-inline" as const,
          icon: <MousePointer size={16} />,
          label: "Call to Action",
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col border-r border-stone-200 bg-white">
      <div className="p-4 border-b border-stone-200">
        <h2 className="text-lg font-semibold text-stone-900">Componentes</h2>
        <p className="text-sm text-stone-600 mt-1">Clique nos componentes para adicionar</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {componentGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {group.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {group.components.map((component, componentIndex) => (
                  <Button
                    key={componentIndex}
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 flex flex-col gap-1 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => onComponentSelect(component.type)}
                  >
                    <span className="text-gray-600">{component.icon}</span>
                    <span className="text-xs font-medium">{component.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComponentsSidebar;
