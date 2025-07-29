// =====================================================================
// components/editor/ComponentsPanel.tsx - Painel de Componentes
// =====================================================================

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { blockDefinitions } from '../../config/blockDefinitions.ts';
import { 
  Search, Grid3X3, Type, Image, Square as ButtonIcon, 
  BarChart3, AlertCircle, Star, Calendar, Clock,
  ChevronDown, Package, Sparkles, Shield, Quote, Play, Code
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { cn } from '../../lib/utils';

interface ComponentItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description?: string;
  isNew?: boolean;
  isPro?: boolean;
}

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: ComponentItem[];
  isExpanded?: boolean;
}

interface ComponentsPanelProps {
  onComponentSelect: (componentId: string) => void;
  onComponentDrag?: (componentId: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

// Mapeamento de ícones para os componentes
const iconMap: { [key: string]: React.ReactNode } = {
  'Type': <Type className="w-4 h-4" />,
  'Image': <Image className="w-4 h-4" />,
  'Shield': <Shield className="w-4 h-4" />,
  'Quote': <Quote className="w-4 h-4" />,
  'Play': <Play className="w-4 h-4" />,
  'Code': <Code className="w-4 h-4" />,
  'ArrowRight': <ButtonIcon className="w-4 h-4" />,
  'CheckCircle': <AlertCircle className="w-4 h-4" />,
  'Target': <BarChart3 className="w-4 h-4" />,
  'Star': <Star className="w-4 h-4" />,
  'Clock': <Clock className="w-4 h-4" />,
  'Calendar': <Calendar className="w-4 h-4" />,
  'Grid3X3': <Grid3X3 className="w-4 h-4" />,
  'Package': <Package className="w-4 h-4" />,
  'Sparkles': <Sparkles className="w-4 h-4" />
};

// Função para gerar categorias e componentes dinamicamente a partir do blockDefinitions
const generateComponentCategories = (): ComponentCategory[] => {
  // Agrupar por categoria
  const categoriesMap = new Map<string, ComponentItem[]>();
  
  blockDefinitions.forEach(block => {
    const category = block.category || 'Outros';
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, []);
    }
    
    const icon = iconMap[block.icon] || <Package className="w-4 h-4" />;
    
    categoriesMap.get(category)!.push({
      id: block.type,
      name: block.name,
      icon,
      category,
      description: block.description,
      isNew: ['guarantee', 'testimonials', 'quiz-start-page', 'script'].includes(block.type)
    });
  });

  // Converter Map para array de categorias
  const categories: ComponentCategory[] = [];
  const categoryOrder = ['Básicos', 'Quiz', 'Vendas', 'Layout', 'Avançados', 'Inline'];
  
  // Adicionar categorias na ordem especificada
  categoryOrder.forEach(categoryName => {
    if (categoriesMap.has(categoryName)) {
      categories.push({
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        icon: getCategoryIcon(categoryName),
        items: categoriesMap.get(categoryName)!,
        isExpanded: ['Básicos', 'Quiz', 'Vendas'].includes(categoryName)
      });
    }
  });
  
  // Adicionar categorias restantes
  categoriesMap.forEach((items, categoryName) => {
    if (!categoryOrder.includes(categoryName)) {
      categories.push({
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        icon: <Package className="w-4 h-4" />,
        items,
        isExpanded: false
      });
    }
  });
  
  return categories;
};

// Função para obter ícone da categoria
const getCategoryIcon = (categoryName: string): React.ReactNode => {
  switch (categoryName) {
    case 'Básicos': return <Package className="w-4 h-4" />;
    case 'Quiz': return <BarChart3 className="w-4 h-4" />;
    case 'Vendas': return <Star className="w-4 h-4" />;
    case 'Layout': return <Grid3X3 className="w-4 h-4" />;
    case 'Avançados': return <Sparkles className="w-4 h-4" />;
    default: return <Package className="w-4 h-4" />;
  }
};

export const ComponentsPanel: React.FC<ComponentsPanelProps> = ({
  onComponentSelect,
  onComponentDrag,
  searchTerm = '',
  onSearchChange,
  className,
  layout = 'vertical'
}) => {
  // Gerar categorias dinamicamente a partir do blockDefinitions
  const COMPONENT_CATEGORIES = useMemo(() => generateComponentCategories(), []);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Inicializar categorias expandidas
  React.useEffect(() => {
    const initialExpanded = COMPONENT_CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat.isExpanded || false
    }), {});
    setExpandedCategories(initialExpanded);
  }, [COMPONENT_CATEGORIES]);

  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);

  const filteredCategories = useMemo(() => {
    const term = (onSearchChange ? searchTerm : internalSearchTerm).toLowerCase();
    
    if (!term) return COMPONENT_CATEGORIES;

    return COMPONENT_CATEGORIES.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
      )
    })).filter(category => category.items.length > 0);
  }, [searchTerm, internalSearchTerm, onSearchChange, COMPONENT_CATEGORIES]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchTerm(value);
    }
  };

  const ComponentButton: React.FC<{ item: ComponentItem }> = ({ item }) => (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start p-3 h-auto group hover:bg-blue-50 hover:border-blue-200',
        layout === 'horizontal' ? 'min-w-[120px]' : ''
      )}
      onClick={() => onComponentSelect(item.id)}
      onDragStart={() => onComponentDrag?.(item.id)}
      draggable={!!onComponentDrag}
    >
      <div className={cn(
        'flex items-center space-x-3 w-full',
        layout === 'horizontal' ? 'flex-col space-x-0 space-y-1' : ''
      )}>
        <div className="flex-shrink-0 text-gray-600 group-hover:text-blue-600">
          {item.icon}
        </div>
        <div className={cn(
          'flex-1 text-left',
          layout === 'horizontal' ? 'text-center' : ''
        )}>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
              {item.name}
            </span>
            {item.isNew && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Novo!
              </Badge>
            )}
            {item.isPro && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                Pro
              </Badge>
            )}
          </div>
          {item.description && layout === 'vertical' && (
            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Button>
  );

  if (layout === 'horizontal') {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              Componentes
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={onSearchChange ? searchTerm : internalSearchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 h-8 w-48"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="flex space-x-2 p-4">
              {filteredCategories.flatMap(category => category.items).map((item) => (
                <ComponentButton key={item.id} item={item} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          Componentes
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar componentes..."
            value={onSearchChange ? searchTerm : internalSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-8"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-2 pb-4">
            {filteredCategories.map((category) => (
              <Collapsible
                key={category.id}
                open={expandedCategories[category.id]}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.items.length}
                      </Badge>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      expandedCategories[category.id] ? "rotate-180" : ""
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {category.items.map((item) => (
                    <ComponentButton key={item.id} item={item} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
