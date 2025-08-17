import { DraggableComponentItem } from '@/components/editor/dnd/DraggableComponentItem';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AVAILABLE_COMPONENTS } from '@/components/editor/blocks/enhancedBlockRegistry';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';

import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  HelpCircle,
  Layers,
  Search,
  Settings,
} from 'lucide-react';
import React, { useState } from 'react';

interface EnhancedComponentsSidebarProps {}

const EnhancedComponentsSidebar: React.FC<EnhancedComponentsSidebarProps> = () => {
  const { scrollRef } = useSyncedScroll({ source: 'components' });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Edição JSON': true,
    'Componentes Modulares': true,
    Quiz: true,
    Interativo: true,
    CTA: true,
    Conteúdo: false,
    Legal: false,
    Estrutura: false,
  });

  // 🎯 Blocos principais do editor-fixed (limpos do EnhancedBlockRegistry)
  const allBlocks = AVAILABLE_COMPONENTS.map(comp => ({
    type: comp.type,
    name: comp.label,
    category: comp.category,
    description: `Componente ${comp.label}`
  }));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch =
      !searchQuery ||
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (block.description && block.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const groupedBlocks = filteredBlocks.reduce(
    (groups, block) => {
      const category = block.category || 'Outros';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(block);
      return groups;
    },
    {} as Record<string, typeof allBlocks>
  );

  // Ícones por categoria conhecida
  const categoryIcons: Record<string, React.ComponentType<any>> = {
    content: GripVertical,
    interactive: HelpCircle,
    media: Layers,
    design: Settings,
  };

  // Ordena dinamicamente pelas categorias existentes
  const orderedCategories = Object.keys(groupedBlocks);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>🎯 Quiz Builder com Componentes Modulares</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar componentes..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto [scrollbar-gutter:stable] overflow-x-hidden"
        >
          <div className="space-y-1 p-0">
            {orderedCategories.map(category => (
              <div key={category} className="space-y-1">
                <div
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center space-x-2">
                    {expandedCategories[category] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {React.createElement(categoryIcons[category] || GripVertical, {
                      className: 'h-4 w-4 text-primary',
                    })}
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {groupedBlocks[category].length}
                  </Badge>
                </div>

                {expandedCategories[category] && (
                  <div className="pl-4 space-y-1">
                    {groupedBlocks[category].map((block: any) => (
                      <DraggableComponentItem
                        key={block.type}
                        blockType={block.type}
                        title={block.name}
                        description={block.description}
                        icon={<GripVertical className="h-4 w-4" />}
                        category={category}
                        className="w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedComponentsSidebar;
