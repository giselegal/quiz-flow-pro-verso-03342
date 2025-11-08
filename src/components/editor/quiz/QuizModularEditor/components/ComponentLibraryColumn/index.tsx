// 📚 COMPONENT LIBRARY COLUMN - FASE 8 UI Avançado
import React, { useEffect, useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, ChevronDown, ChevronRight, Star, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';
import { loadComponentsFromRegistry, groupComponentsByCategory, type ComponentLibraryItem } from '@/core/editor/SchemaComponentAdapter';
import { loadDefaultSchemas } from '@/core/schema/loadDefaultSchemas';

export type ComponentLibraryColumnProps = {
    currentStepKey: string | null;
    onAddBlock: (type: Block['type']) => void;
};

function DraggableLibraryItem({
    type,
    label,
    description,
    disabled,
    isNew,
    isFavorite
}: {
    type: Block['type'];
    label: string;
    description?: string;
    disabled?: boolean;
    isNew?: boolean;
    isFavorite?: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `lib:${type}`,
        disabled,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'relative group',
                'border rounded-lg p-3',
                'cursor-grab active:cursor-grabbing',
                'transition-all duration-200',
                'hover:border-primary hover:shadow-sm hover:scale-[1.02]',
                'animate-fade-in',
                isDragging && 'shadow-lg ring-2 ring-primary',
                disabled && 'opacity-50 cursor-not-allowed'
            )}
        >
            {/* Badges */}
            <div className="absolute top-1 right-1 flex gap-1">
                {isFavorite && (
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                )}
                {isNew && (
                    <Badge variant="secondary" className="h-4 text-[10px] px-1">
                        Novo
                    </Badge>
                )}
            </div>

            {/* Label */}
            <div className="font-medium text-xs mb-1 pr-8">{label}</div>

            {/* Description (on hover) */}
            {isHovered && description && (
                <div className="text-[10px] text-muted-foreground line-clamp-2 animate-fade-in">
                    {description}
                </div>
            )}

            {/* Type badge */}
            <div className="text-[9px] text-muted-foreground font-mono mt-1">
                {type}
            </div>
        </div>
    );
}

export default function ComponentLibraryColumn({ currentStepKey, onAddBlock }: ComponentLibraryColumnProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [components, setComponents] = useState<ComponentLibraryItem[]>([]);
    const [categories, setCategories] = useState<Record<string, ComponentLibraryItem[]>>({});
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
    const [favorites, setFavorites] = useState<Set<string>>(new Set(['intro-logo', 'question-title']));
    const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

    // Carregar componentes do registry dinamicamente
    useEffect(() => {
        loadDefaultSchemas();
        const loadedComponents = loadComponentsFromRegistry();
        setComponents(loadedComponents);
        setCategories(groupComponentsByCategory(loadedComponents));
    }, []);

    // Filtrar componentes por termo de busca
    const filteredCategories = useMemo(() => {
        if (!searchTerm) return categories;

        const filtered: Record<string, ComponentLibraryItem[]> = {};
        Object.entries(categories).forEach(([category, items]) => {
            const matchedItems = items.filter(
                item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (matchedItems.length > 0) {
                filtered[category] = matchedItems;
            }
        });
        return filtered;
    }, [categories, searchTerm]);

    // Toggle categoria
    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    // Componentes novos (últimas 5 adicionados - baseado em versão ou data)
    const newComponents = useMemo(() => {
        return new Set(['offer-urgency', 'layout-spacer', 'question-progress']);
    }, []);

    // Stats
    const totalComponents = components.length;
    const totalCategories = Object.keys(categories).length;

    return (
        <div className="flex flex-col h-full bg-background" data-testid="component-library">
            {/* Header com busca e stats */}
            <div className="p-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">Componentes</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                        {totalComponents}
                    </Badge>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar componentes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-9 text-xs"
                    />
                </div>

                {!currentStepKey && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 animate-fade-in">
                        <span>→</span>
                        <span>Selecione uma etapa primeiro</span>
                    </div>
                )}
            </div>

            {/* Recentes (se houver) */}
            {recentlyUsed.length > 0 && !searchTerm && (
                <div className="p-4 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Recentes</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {recentlyUsed.slice(0, 3).map(id => {
                            const item = components.find(c => c.id === id);
                            return item ? (
                                <Badge key={id} variant="outline" className="text-[10px] cursor-pointer hover:bg-accent">
                                    {item.name}
                                </Badge>
                            ) : null;
                        })}
                    </div>
                </div>
            )}

            {/* Lista de componentes por categoria (colapsável) */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
                {Object.keys(filteredCategories).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-xs space-y-2">
                        <Search className="h-8 w-8 mx-auto opacity-30" />
                        <p>Nenhum componente encontrado</p>
                        <p className="text-[10px]">Tente outro termo de busca</p>
                    </div>
                ) : (
                    Object.entries(filteredCategories).map(([category, items]) => {
                        const isCollapsed = collapsedCategories.has(category);
                        return (
                            <Collapsible
                                key={category}
                                open={!isCollapsed}
                                onOpenChange={() => toggleCategory(category)}
                                className="space-y-2"
                            >
                                <CollapsibleTrigger className="w-full group">
                                    <div className="flex items-center justify-between hover:bg-accent/50 rounded px-2 py-1.5 transition-colors">
                                        <div className="flex items-center gap-2">
                                            {isCollapsed ? (
                                                <ChevronRight className="h-3 w-3 transition-transform" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3 transition-transform" />
                                            )}
                                            <span className="text-xs font-semibold uppercase text-muted-foreground">
                                                {category}
                                            </span>
                                        </div>
                                        <Badge variant="secondary" className="text-[9px] h-4">
                                            {items.length}
                                        </Badge>
                                    </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="animate-accordion-down">
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        {items.map((item) => (
                                            <DraggableLibraryItem
                                                key={item.id}
                                                type={item.id as Block['type']}
                                                label={item.name}
                                                description={item.description}
                                                disabled={!currentStepKey}
                                                isNew={newComponents.has(item.id)}
                                                isFavorite={favorites.has(item.id)}
                                            />
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })
                )}
            </div>

            {/* Footer com dica */}
            <div className="p-3 border-t bg-muted/10">
                <p className="text-[10px] text-muted-foreground text-center">
                    💡 Arraste componentes para o canvas
                </p>
            </div>
        </div>
    );
}
