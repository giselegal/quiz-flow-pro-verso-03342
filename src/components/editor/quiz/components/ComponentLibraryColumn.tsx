/**
 * 📚 COMPONENT LIBRARY COLUMN - Fase 2 Modularização
 * 
 * Coluna 2: Biblioteca de componentes disponíveis para arrasto
 * Extraído de QuizModularProductionEditor para melhor organização
 */

import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Type,
  Image as ImageIcon,
  MousePointer,
  List,
  Layout,
  Search,
} from 'lucide-react';

export interface ComponentLibraryItem {
  id: string;
  type: string;
  label: string;
  category: string;
  icon?: React.ReactNode;
  description?: string;
}

interface ComponentLibraryColumnProps {
  components: ComponentLibraryItem[];
  onComponentDragStart?: (component: ComponentLibraryItem) => void;
  className?: string;
}

const DEFAULT_ICONS: Record<string, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  image: <ImageIcon className="h-4 w-4" />,
  button: <MousePointer className="h-4 w-4" />,
  options: <List className="h-4 w-4" />,
  layout: <Layout className="h-4 w-4" />,
};

export const ComponentLibraryColumn: React.FC<ComponentLibraryColumnProps> = ({
  components,
  onComponentDragStart,
  className,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Agrupar componentes por categoria
  const groupedComponents = useMemo(() => {
    const filtered = components.filter(c =>
      c.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return filtered.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    }, {} as Record<string, ComponentLibraryItem[]>);
  }, [components, searchTerm]);

  const categories = Object.keys(groupedComponents);

  return (
    <div className={cn('flex flex-col h-full border-r bg-muted/20', className)}>
      <div className="p-4 border-b bg-background space-y-3">
        <h2 className="text-lg font-semibold">Componentes</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Arraste para o canvas →
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum componente encontrado
          </div>
        ) : (
          categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">
                {category}
              </h3>
              <div className="space-y-2">
                {groupedComponents[category].map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={() => onComponentDragStart?.(component)}
                    data-testid={`lib-item-${component.type}`}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border',
                      'bg-card hover:bg-accent cursor-grab active:cursor-grabbing',
                      'transition-colors',
                    )}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      {component.icon || DEFAULT_ICONS[component.type] || DEFAULT_ICONS.layout}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{component.label}</div>
                      {component.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {component.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
