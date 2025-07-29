
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';
import { cn } from '@/lib/utils';

// Definir todos os 21 componentes do funil
const FUNNEL_COMPONENTS = [
  { id: 'funnel-step-intro', name: 'Introdução', icon: '🏠', category: 'Introdução', stepNumber: 1 },
  { id: 'funnel-step-name-collect', name: 'Coleta de Nome', icon: '👤', category: 'Coleta', stepNumber: 2 },
  { id: 'funnel-step-quiz-intro', name: 'Intro Quiz', icon: '🎯', category: 'Quiz', stepNumber: 3 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 1', icon: '❓', category: 'Quiz', stepNumber: 4 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 2', icon: '❓', category: 'Quiz', stepNumber: 5 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 3', icon: '❓', category: 'Quiz', stepNumber: 6 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 4', icon: '❓', category: 'Quiz', stepNumber: 7 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 5', icon: '❓', category: 'Quiz', stepNumber: 8 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 6', icon: '❓', category: 'Quiz', stepNumber: 9 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 7', icon: '❓', category: 'Quiz', stepNumber: 10 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 8', icon: '❓', category: 'Quiz', stepNumber: 11 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 9', icon: '❓', category: 'Quiz', stepNumber: 12 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 10', icon: '❓', category: 'Quiz', stepNumber: 13 },
  { id: 'funnel-step-question-multiple', name: 'Pergunta 11', icon: '❓', category: 'Quiz', stepNumber: 14 },
  { id: 'funnel-step-quiz-transition', name: 'Transição Quiz', icon: '🔄', category: 'Transição', stepNumber: 15 },
  { id: 'funnel-step-processing', name: 'Processamento', icon: '⚙️', category: 'Processamento', stepNumber: 16 },
  { id: 'funnel-step-result-intro', name: 'Intro Resultado', icon: '📊', category: 'Resultado', stepNumber: 17 },
  { id: 'funnel-step-result-details', name: 'Detalhes Resultado', icon: '📋', category: 'Resultado', stepNumber: 18 },
  { id: 'funnel-step-result-guide', name: 'Guia Resultado', icon: '📖', category: 'Resultado', stepNumber: 19 },
  { id: 'funnel-step-offer-transition', name: 'Transição Oferta', icon: '🎁', category: 'Oferta', stepNumber: 20 },
  { id: 'funnel-step-offer-page', name: 'Página Oferta', icon: '💰', category: 'Oferta', stepNumber: 21 }
];

export const ComponentsSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { handleAddBlock } = useEditor();

  const categories = [...new Set(FUNNEL_COMPONENTS.map(comp => comp.category))];

  const filteredComponents = FUNNEL_COMPONENTS.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleComponentAdd = (component: typeof FUNNEL_COMPONENTS[0]) => {
    console.log('Adicionando componente:', component);
    handleAddBlock(component.id);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-[#432818] mb-3">
          Componentes do Funil
        </h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            Todos
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {filteredComponents.map((component) => (
            <div
              key={`${component.id}-${component.stepNumber}`}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              )}
              onClick={() => handleComponentAdd(component)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{component.icon}</span>
                <div>
                  <div className="font-medium text-sm text-[#432818]">
                    {component.name}
                  </div>
                  <div className="text-xs text-[#8F7A6A]">
                    Etapa {component.stepNumber}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {component.category}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComponentAdd(component);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum componente encontrado</p>
            <p className="text-sm mt-1">Tente ajustar sua busca</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
