// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    TriangleAlert,
    Book,
    Mic,
    RectangleHorizontal,
    LoaderCircle,
    GalleryHorizontalEnd,
    ChartArea,
    AlignHorizontalDistributeEnd,
    Sparkles,
    Quote,
    TextCursorInput,
    Proportions,
    MessageCircleQuestion,
    ChartNoAxesColumnIncreasing,
    Images,
    List,
    ArrowRightLeft,
    SlidersHorizontal,
    Rows3,
    CircleDollarSign,
    Code,
    Scale,
    Text,
    Heading1,
    Video
} from 'lucide-react';

interface ComponentItem {
    type: string;
    name: string;
    icon: React.ComponentType<any>;
    category: string;
    description: string;
    isNew?: boolean;
}

interface CaktoToolbarProps {
    className?: string;
    onComponentDrag?: (component: ComponentItem) => void;
    onComponentClick?: (component: ComponentItem) => void;
}

const CaktoToolbar: React.FC<CaktoToolbarProps> = ({
    className = "",
    onComponentDrag,
    onComponentClick
}) => {
    const components: ComponentItem[] = [
        { type: 'alert', name: 'Alerta', icon: TriangleAlert, category: 'Conteúdo', description: 'Caixa de alerta' },
        { type: 'arguments', name: 'Argumentos', icon: Book, category: 'Conteúdo', description: 'Lista de argumentos' },
        { type: 'audio', name: 'Audio', icon: Mic, category: 'Mídia', description: 'Player de áudio' },
        { type: 'button', name: 'Botão', icon: RectangleHorizontal, category: 'Interação', description: 'Botão de ação' },
        { type: 'loading', name: 'Carregando', icon: LoaderCircle, category: 'UI', description: 'Indicador de carregamento' },
        { type: 'carousel', name: 'Carrosel', icon: GalleryHorizontalEnd, category: 'Mídia', description: 'Carrossel de imagens' },
        { type: 'chart', name: 'Cartesiano', icon: ChartArea, category: 'Dados', description: 'Gráfico cartesiano' },
        { type: 'compare', name: 'Comparar', icon: AlignHorizontalDistributeEnd, category: 'Conversão', description: 'Tabela comparativa', isNew: true },
        { type: 'confetti', name: 'Confetti', icon: Sparkles, category: 'Engajamento', description: 'Animação de confetti', isNew: true },
        { type: 'testimonial', name: 'Depoimentos', icon: Quote, category: 'Social Proof', description: 'Depoimento de cliente' },
        { type: 'input', name: 'Entrada', icon: TextCursorInput, category: 'Formulário', description: 'Campo de entrada' },
        { type: 'spacer', name: 'Espaçador', icon: Proportions, category: 'Layout', description: 'Espaçamento vertical' },
        { type: 'faq', name: 'FAQ', icon: MessageCircleQuestion, category: 'Conteúdo', description: 'Perguntas frequentes', isNew: true },
        { type: 'charts', name: 'Gráficos', icon: ChartNoAxesColumnIncreasing, category: 'Dados', description: 'Gráficos variados' },
        { type: 'image', name: 'Imagem', icon: Images, category: 'Mídia', description: 'Imagem ou foto' },
        { type: 'list', name: 'Lista', icon: List, category: 'Conteúdo', description: 'Lista de itens', isNew: true },
        { type: 'marquee', name: 'Marquise', icon: ArrowRightLeft, category: 'Engajamento', description: 'Texto em movimento', isNew: true },
        { type: 'slider', name: 'Nível', icon: SlidersHorizontal, category: 'Interação', description: 'Controle deslizante' },
        { type: 'options', name: 'Opções', icon: Rows3, category: 'Quiz', description: 'Opções de resposta' },
        { type: 'price', name: 'Preço', icon: CircleDollarSign, category: 'Conversão', description: 'Tabela de preços' },
        { type: 'script', name: 'Script', icon: Code, category: 'Avançado', description: 'Código personalizado' },
        { type: 'terms', name: 'Termos', icon: Scale, category: 'Legal', description: 'Termos e condições' },
        { type: 'text', name: 'Texto', icon: Text, category: 'Conteúdo', description: 'Parágrafo de texto' },
        { type: 'title', name: 'Título', icon: Heading1, category: 'Conteúdo', description: 'Título principal' },
        { type: 'video', name: 'Video', icon: Video, category: 'Mídia', description: 'Player de vídeo' }
    ];

    const handleComponentInteraction = (component: ComponentItem, isDrag: boolean = false) => {
        if (isDrag && onComponentDrag) {
            onComponentDrag(component);
        } else if (!isDrag && onComponentClick) {
            onComponentClick(component);
        }
    };

    return (
        <>
            {/* Desktop - Vertical Sidebar */}
            <div className="overflow-hidden relative z-[1] hidden md:block w-full max-h-full md:max-w-[9.5rem] pr-2">
                <ScrollArea className="h-full w-full">
                    <div className="flex flex-col gap-1 p-2 pb-6">
                        {components.map((component) => {
                            const IconComponent = component.icon;
                            return (
                                <div
                                    key={component.type}
                                    role="button"
                                    tabIndex={0}
                                    draggable
                                    onDragStart={() => handleComponentInteraction(component, true)}
                                    onClick={() => handleComponentInteraction(component, false)}
                                    className="bg-zinc-950/50 relative hover:z-30 cursor-move"
                                >
                                    <div className="text-zinc-100 cursor-move col-span-4 rounded border hover:border-gray-400 items-center py-2 px-3 gap-2 ease relative flex transition-all hover:shadow-lg">
                                        <div className="relative w-auto">
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                        <div className="text-xs py-1 flex-1">{component.name}</div>
                                        {component.isNew && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[0.6rem] text-white bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-lg rounded-full px-1 py-0.5 absolute -top-1 -right-1"
                                            >
                                                Novo!
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="py-8"></div>
                </ScrollArea>
            </div>

            {/* Mobile - Horizontal Toolbar */}
            <div className="overflow-hidden block md:hidden w-full max-h-[60px] pr-2">
                <ScrollArea className="h-full w-full">
                    <div className="relative z-[1] flex gap-1 p-2 pb-6" style={{ minWidth: 'fit-content' }}>
                        {components.map((component) => {
                            const IconComponent = component.icon;
                            return (
                                <div
                                    key={component.type}
                                    role="button"
                                    tabIndex={0}
                                    draggable
                                    onDragStart={() => handleComponentInteraction(component, true)}
                                    onClick={() => handleComponentInteraction(component, false)}
                                    className="bg-zinc-950/50 relative hover:z-30 cursor-move flex-shrink-0"
                                >
                                    <div className="text-zinc-100 cursor-move col-span-4 rounded border hover:border-gray-400 items-center py-2 px-3 gap-2 ease relative flex transition-all hover:shadow-lg">
                                        <div className="relative w-auto">
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                        <div className="text-xs py-1">{component.name}</div>
                                        {component.isNew && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[0.6rem] text-white bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-lg rounded-full px-1 py-0.5 absolute -top-1 -right-1"
                                            >
                                                Novo!
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
};

export default CaktoToolbar;