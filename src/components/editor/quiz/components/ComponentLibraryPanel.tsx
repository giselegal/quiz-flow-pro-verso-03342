import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';
import { Wand2, Layers } from 'lucide-react';
import { BuilderSystemPanel } from '@/components/editor/BuilderSystemPanel';

export interface LibraryComponentItem {
    type: string;
    label: string;
    icon: React.ReactNode;
    category: string;
}

export interface ComponentLibraryPanelProps {
    components: LibraryComponentItem[];
    categories?: string[];
    selectedStepId?: string;
    onAdd?: (type: string) => void;
    onQuizCreated?: (quiz: any) => void;
}

export const ComponentLibraryPanel: React.FC<ComponentLibraryPanelProps> = ({
    components,
    categories = ['content', 'interactive', 'media', 'layout'],
    selectedStepId,
    onAdd,
    onQuizCreated
}) => {
    const [activeTab, setActiveTab] = useState('components');

    return (
        <div className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-4 pt-3 pb-0 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="components" className="text-xs">
                            <Layers className="w-3 h-3 mr-1" />
                            Componentes
                        </TabsTrigger>
                        <TabsTrigger value="builder" className="text-xs">
                            <Wand2 className="w-3 h-3 mr-1" />
                            Builder
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="components" className="flex-1 flex flex-col mt-0">
                    <div className="px-4 py-3 border-b">
                        <p className="text-xs text-muted-foreground">Arraste para o canvas</p>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-3 space-y-3">
                            {categories.map(category => {
                                const items = components.filter(c => c.category === category);
                                if (items.length === 0) return null;

                                const categoryLabels: Record<string, string> = {
                                    layout: 'Layout',
                                    content: 'Conteúdo',
                                    visual: 'Visual',
                                    quiz: 'Quiz',
                                    forms: 'Formulários',
                                    action: 'Ações',
                                    result: 'Resultado',
                                    offer: 'Oferta',
                                    navigation: 'Navegação',
                                    ai: 'IA',
                                    advanced: 'Avançado',
                                    // Legacy categories
                                    interactive: 'Interativo',
                                    media: 'Mídia'
                                };

                                return (
                                    <div key={category}>
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                            {categoryLabels[category] || category}
                                        </h3>
                                        <div className="space-y-1">
                                            {items.map(component => {
                                                const DraggableItem: React.FC = () => {
                                                    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `lib:${component.type}` });
                                                    const style: React.CSSProperties = {
                                                        transform: transform ? CSS.Translate.toString(transform) : undefined,
                                                        opacity: isDragging ? 0.4 : 1,
                                                    };
                                                    return (
                                                        <button
                                                            ref={setNodeRef}
                                                            {...attributes}
                                                            {...listeners}
                                                            key={component.type}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                            onClick={() => selectedStepId && onAdd && onAdd(component.type)}
                                                            disabled={!selectedStepId}
                                                            style={style}
                                                        >
                                                            {component.icon}
                                                            <span>{component.label}</span>
                                                        </button>
                                                    );
                                                };
                                                return <DraggableItem key={component.type} />;
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="builder" className="flex-1 flex flex-col mt-0 overflow-hidden">
                    <ScrollArea className="flex-1">
                        <div className="p-3">
                            <BuilderSystemPanel onQuizCreated={onQuizCreated} />
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ComponentLibraryPanel;
