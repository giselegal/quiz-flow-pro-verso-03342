import { AVAILABLE_COMPONENTS } from '@/components/editor/blocks/EnhancedBlockRegistry';
import { DraggableComponentItem } from '@/components/editor/dnd/DraggableComponentItem';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, HelpCircle, Layers, Search, Settings } from 'lucide-react';
import React, { useState } from 'react';

interface EnhancedComponentsSidebarProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = ({
  searchTerm: initialSearchTerm = '',
  setSearchTerm: externalSetSearchTerm,
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(initialSearchTerm);
  const searchTerm = externalSetSearchTerm ? initialSearchTerm : internalSearchTerm;
  const setSearchTerm = externalSetSearchTerm || setInternalSearchTerm;
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Passos do Quiz': true,
    'Componentes de Conteúdo': true,
    'Elementos do Quiz': true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Passos do Quiz':
        return <Layers className="h-4 w-4" />;
      case 'Componentes de Conteúdo':
        return <HelpCircle className="h-4 w-4" />;
      case 'Elementos do Quiz':
        return <Settings className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'step01':
        return 'Passos do Quiz';
      case 'content':
        return 'Componentes de Conteúdo';
      case 'result':
        return 'Resultados e Vendas';
      case 'quiz':
      case 'action':
      case 'conversion':
      case 'ui':
        return 'Elementos do Quiz';
      default:
        return 'Outros';
    }
  };

  const filteredComponents = AVAILABLE_COMPONENTS.reduce(
    (acc, component) => {
      const matches = component.label.toLowerCase().includes(searchTerm.toLowerCase());
      if (matches) {
        const category = getCategoryDisplayName(component.category);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(component);
      }
      return acc;
    },
    {} as Record<string, typeof AVAILABLE_COMPONENTS>
  );

  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Quiz Builder com Componentes
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="components-sidebar">
        {Object.entries(filteredComponents).map(([category, components]) => (
          <Card key={category} className="border-muted">
            <CardHeader
              className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {category}
                  <Badge variant="secondary" className="text-xs">
                    {components.length}
                  </Badge>
                </div>
                {expandedCategories[category] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>

            {expandedCategories[category] && (
              <CardContent className="pt-0 space-y-2">
                {components.map((component, index) => (
                  <DraggableComponentItem
                    key={`${component.type}-${index}`}
                    blockType={component.type}
                    title={component.label}
                    description={`Componente ${component.type}`}
                    icon={getCategoryIcon(category)}
                    category={component.category}
                    className="border border-muted hover:border-primary/50 transition-colors"
                  />
                ))}
              </CardContent>
            )}
          </Card>
        ))}

        {Object.keys(filteredComponents).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum componente encontrado</p>
            <p className="text-xs">Tente buscar por outros termos</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Export default para compatibilidade
export default EnhancedComponentsSidebar;
