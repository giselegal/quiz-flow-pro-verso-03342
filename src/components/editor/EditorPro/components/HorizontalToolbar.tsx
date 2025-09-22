import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ComponentCategory {
    id: string;
    name: string;
    components: ComponentItem[];
}

interface ComponentItem {
    id: string;
    name: string;
    icon: React.ReactNode;
    isNew?: boolean;
    description?: string;
}

interface HorizontalToolbarProps {
    categories?: ComponentCategory[];
    onComponentDrag?: (componentId: string) => void;
    className?: string;
}

export const HorizontalToolbar: React.FC<HorizontalToolbarProps> = ({
    categories = defaultCategories,
    onComponentDrag,
    className = '',
}) => {
    const handleDragStart = (event: React.DragEvent, componentId: string) => {
        event.dataTransfer.setData('componentId', componentId);
        onComponentDrag?.(componentId);
    };

    return (
        <div className={`w-full border-b bg-background ${className}`}>
            {/* Desktop Version */}
            <div className="hidden md:block w-full max-h-full max-w-[9.5rem] pr-2">
                <div className="h-full w-full rounded-[inherit]">
                    <div className="overflow-hidden relative z-[1] flex flex-col gap-1 p-2 pb-6">
                        {categories.map((category) =>
                            category.components.map((component) => (
                                <div
                                    key={component.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-disabled="false"
                                    className="bg-zinc-950/50 relative hover:z-30"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, component.id)}
                                    style={{
                                        transform: 'translate3d(0px, 0px, 0px) scaleX(1) scaleY(1)',
                                        opacity: 1
                                    }}
                                >
                                    <div className="text-zinc-100 cursor-move col-span-4 rounded border hover:border-gray-400 items-center py-2 px-3 gap-2 ease relative flex">
                                        <div className="relative w-auto">
                                            {component.icon}
                                        </div>
                                        <div className="text-xs py-1">{component.name}</div>
                                        {component.isNew && (
                                            <span className="text-[0.6rem] text-white bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-lg rounded-full px-1 py-0.5 absolute -top-1 -right-1">
                                                Novo!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="py-8"></div>
                    </div>
                </div>
            </div>

            {/* Mobile Version - Horizontal Scroll */}
            <div className="block md:hidden w-full max-h-[60px] pr-2">
                <div className="h-full w-full rounded-[inherit]">
                    <div className="min-w-fit">
                        <div className="relative z-[1] flex gap-1 p-2 pb-6">
                            {categories.map((category) =>
                                category.components.map((component) => (
                                    <div
                                        key={component.id}
                                        role="button"
                                        tabIndex={0}
                                        aria-disabled="false"
                                        className="bg-zinc-950/50 relative hover:z-30"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, component.id)}
                                        style={{
                                            transform: 'translate3d(0px, 0px, 0px) scaleX(1) scaleY(1)',
                                            opacity: 1
                                        }}
                                    >
                                        <div className="text-zinc-100 cursor-move col-span-4 rounded border hover:border-gray-400 items-center py-2 px-3 gap-2 ease relative flex">
                                            <div className="relative w-auto">
                                                {component.icon}
                                            </div>
                                            <div className="text-xs py-1">{component.name}</div>
                                            {component.isNew && (
                                                <span className="text-[0.6rem] text-white bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-lg rounded-full px-1 py-0.5 absolute -top-1 -right-1">
                                                    Novo!
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Default components configuration
const defaultCategories: ComponentCategory[] = [
    {
        id: 'basic',
        name: 'Básicos',
        components: [
            {
                id: 'heading',
                name: 'Título',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h8M4 18V6M12 18V6m5 12l3-2v8" /></svg>
            },
            {
                id: 'text',
                name: 'Texto',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 6.1H3M21 12.1H3M15.1 18H3" /></svg>
            },
            {
                id: 'button',
                name: 'Botão',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="12" x="2" y="6" rx="2" /></svg>
            },
            {
                id: 'image',
                name: 'Imagem',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 22H4a2 2 0 0 1-2-2V6" /><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" /><circle cx="12" cy="8" r="2" /><rect width="16" height="16" x="6" y="2" rx="2" /></svg>
            }
        ]
    },
    {
        id: 'interactive',
        name: 'Interativos',
        components: [
            {
                id: 'input',
                name: 'Entrada',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7M9 7v10" /></svg>
            },
            {
                id: 'options',
                name: 'Opções',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M21 9H3M21 15H3" /></svg>
            },
            {
                id: 'slider',
                name: 'Nível',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></svg>
            },
            {
                id: 'faq',
                name: 'FAQ',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
                isNew: true
            }
        ]
    },
    {
        id: 'media',
        name: 'Mídia',
        components: [
            {
                id: 'video',
                name: 'Video',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>
            },
            {
                id: 'audio',
                name: 'Audio',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
            },
            {
                id: 'carousel',
                name: 'Carrosel',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M2 7v10M6 5v14" /><rect width="12" height="18" x="10" y="3" rx="2" /></svg>
            }
        ]
    },
    {
        id: 'conversion',
        name: 'Conversão',
        components: [
            {
                id: 'price',
                name: 'Preço',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
            },
            {
                id: 'testimonials',
                name: 'Depoimentos',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" /></svg>
            },
            {
                id: 'compare',
                name: 'Comparar',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="6" height="14" x="4" y="5" rx="2" /><rect width="6" height="10" x="14" y="7" rx="2" /><path d="M10 2v20M20 2v20" /></svg>,
                isNew: true
            },
            {
                id: 'confetti',
                name: 'Confetti',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4M22 5h-4M4 17v2M5 18H3" /></svg>,
                isNew: true
            }
        ]
    }
];

export default HorizontalToolbar;