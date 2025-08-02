
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditorBlock } from '@/types/editor';
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
  Users
} from 'lucide-react';

interface ComponentsSidebarProps {
  onComponentSelect: (type: EditorBlock['type']) => void;
}

export const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({ onComponentSelect }) => {
  const componentGroups = [
    {
      title: 'Conteúdo',
      components: [
        { type: 'header' as const, icon: <Heading1 size={16} />, label: 'Cabeçalho' },
        { type: 'text' as const, icon: <Type size={16} />, label: 'Texto' },
        { type: 'image' as const, icon: <Image size={16} />, label: 'Imagem' },
        { type: 'button' as const, icon: <MousePointer size={16} />, label: 'Botão' },
      ]
    },
    {
      title: 'Layout',
      components: [
        { type: 'spacer' as const, icon: <Layout size={16} />, label: 'Espaçador' },
        { type: 'divider' as const, icon: <Layout size={16} />, label: 'Divisor' },
      ]
    },
    {
      title: 'Marketing',
      components: [
        { type: 'benefits' as const, icon: <List size={16} />, label: 'Benefícios' },
        { type: 'testimonials' as const, icon: <Users size={16} />, label: 'Depoimentos' },
        { type: 'pricing' as const, icon: <CreditCard size={16} />, label: 'Preços' },
        { type: 'guarantee' as const, icon: <Award size={16} />, label: 'Garantia' },
        { type: 'cta' as const, icon: <Star size={16} />, label: 'Call to Action' },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Componentes</h2>
        <p className="text-sm text-gray-600 mt-1">
          Clique nos componentes para adicionar
        </p>
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
