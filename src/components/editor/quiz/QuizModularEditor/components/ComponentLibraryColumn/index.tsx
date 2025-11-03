// 📚 COMPONENT LIBRARY COLUMN - Integração com Universal Registry
import React, { useEffect, useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Block } from '@/services/UnifiedTemplateRegistry';
import { loadComponentsFromRegistry, groupComponentsByCategory, type ComponentLibraryItem } from '@/core/editor/SchemaComponentAdapter';
import { loadDefaultSchemas } from '@/core/schema/loadDefaultSchemas';

export type ComponentLibraryColumnProps = {
    currentStepKey: string | null;
    onAddBlock: (type: Block['type']) => void;
};

function DraggableLibraryItem({ type, label, disabled }: { type: Block['type']; label: string; disabled?: boolean }) {
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
            className={`w-full border rounded px-2 py-2 text-xs cursor-grab hover:bg-accent disabled:opacity-50 ${isDragging ? 'shadow-lg' : ''}`}
        >
            + {label}
        </div>
    );
}

export default function ComponentLibraryColumn({ currentStepKey, onAddBlock }: ComponentLibraryColumnProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [components, setComponents] = useState<ComponentLibraryItem[]>([]);
    const [categories, setCategories] = useState<Record<string, ComponentLibraryItem[]>>({});

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
                    item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (matchedItems.length > 0) {
                filtered[category] = matchedItems;
            }
        });
        return filtered;
    }, [categories, searchTerm]);

    return (
        <div className="flex flex-col h-full">
            {/* Header com busca */}
            <div className="p-4 border-b space-y-3">
                <div className="text-sm font-medium">Biblioteca de Componentes</div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar componentes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-8 text-xs"
                    />
                </div>
                {!currentStepKey && (
                    <div className="text-xs text-muted-foreground">Selecione uma etapa para adicionar blocos.</div>
                )}
            </div>

            {/* Lista de componentes por categoria */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {Object.keys(filteredCategories).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-xs">
                            Nenhum componente encontrado
                        </div>
                    ) : (
                        Object.entries(filteredCategories).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">
                                    {category}
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {items.map((item) => (
                                        <DraggableLibraryItem
                                            key={item.id}
                                            type={item.id as Block['type']}
                                            label={item.name}
                                            disabled={!currentStepKey}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
