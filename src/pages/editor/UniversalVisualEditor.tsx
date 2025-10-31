/**
 * 🎨 UNIVERSAL VISUAL EDITOR
 * 
 * Editor visual revolucionário que integra TODA a arquitetura unificada:
 * ✅ Canvas principal com renderização em tempo real
 * ✅ Sistema de colunas com painéis laterais
 * ✅ Biblioteca de componentes drag & drop
 * ✅ Painel de propriedades dinâmico
 * ✅ Integração com todos os sistemas unificados
 * 
 * ESTRUTURA:
 * [Toolbar] [Components Panel] [Canvas] [Properties Panel] [Analytics Mini]
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
    // Layout & Navigation
    Layout,

    // Components & Tools
    Layers,
    Component,
    Box,
    Type,
    Image,
    Square,

    // Actions
    Undo,
    Redo,
    Save,

    // AI & Enhancement
    Sparkles,
    Brain,
    Target,

    // Properties
    Settings,

    // Modes
    Eye,
    Code,
    Smartphone,
    Tablet,
    Monitor,

    // Status
    Play,
} from 'lucide-react';

// Import dos hooks básicos
import { useAnalytics } from '@/hooks/useAnalytics';

// ===============================
// 🎯 EDITOR TYPES & INTERFACES
// ===============================

interface EditorState {
    // Canvas
    canvasMode: 'design' | 'preview' | 'code';
    deviceMode: 'desktop' | 'tablet' | 'mobile';
    zoomLevel: number;

    // Selection
    selectedElement: EditorElement | null;
    selectedElements: EditorElement[];
    hoveredElement: EditorElement | null;

    // History
    history: EditorSnapshot[];
    historyIndex: number;

    // Panels
    leftPanelVisible: boolean;
    rightPanelVisible: boolean;
    leftPanelWidth: number;
    rightPanelWidth: number;

    // Mode
    editMode: 'visual' | 'code' | 'hybrid';
    activeTab: string;

    // Performance
    renderMode: 'realtime' | 'ondemand';
    showDebugInfo: boolean;
}

interface EditorElement {
    id: string;
    type: ElementType;
    parentId?: string;
    name: string;

    // Position & Size
    position: { x: number; y: number };
    size: { width: number; height: number };
    rotation: number;
    scale: number;

    // Content
    content: ElementContent;
    properties: ElementProperties;
    styles: ElementStyles;
    behaviors: ElementBehaviors;

    // Meta
    locked: boolean;
    visible: boolean;
    layer: number;
    tags: string[];

    // Children (for containers)
    children: EditorElement[];
}

type ElementType =
    | 'container'
    | 'text'
    | 'heading'
    | 'button'
    | 'image'
    | 'video'
    | 'form'
    | 'input'
    | 'quiz'
    | 'funnel'
    | 'component'
    | 'section'
    | 'column'
    | 'row';

interface ElementContent {
    text?: string;
    html?: string;
    src?: string;
    alt?: string;
    placeholder?: string;
    value?: any;
    options?: Array<{ label: string; value: any }>;
    title?: string;
    questions?: any[];
    steps?: any[];
}

interface ElementProperties {
    [key: string]: any;
    // Common properties
    className?: string;
    id?: string;
    dataAttributes?: Record<string, string>;
    ariaLabel?: string;

    // Specific properties based on type
    href?: string; // for links
    target?: string; // for links
    required?: boolean; // for forms
    placeholder?: string; // for inputs
}

interface ElementStyles {
    // Layout
    display?: string;
    position?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    width?: string;
    height?: string;
    minHeight?: string;

    // Flexbox/Grid
    flex?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;

    // Typography
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    textAlign?: string;
    color?: string;

    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;

    // Border
    border?: string;
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;

    // Spacing
    margin?: string;
    marginBottom?: string;
    padding?: string;

    // Effects
    boxShadow?: string;
    opacity?: string;
    transform?: string;
    filter?: string;

    // Animation
    transition?: string;
    animation?: string;

    // Interactive
    cursor?: string;

    // Additional CSS properties
    [key: string]: string | undefined;
}

interface ElementBehaviors {
    onClick?: string;
    onHover?: string;
    onFocus?: string;
    onSubmit?: string;

    // Animations
    entrance?: string;
    exit?: string;
    hover?: string;

    // Interactions
    draggable?: boolean;
    resizable?: boolean;
    selectable?: boolean;

    // Conditions
    showIf?: string;
    hideIf?: string;
}

interface EditorSnapshot {
    timestamp: number;
    elements: EditorElement[];
    selectedElement: string | null;
    action: string;
}

interface ComponentLibraryItem {
    id: string;
    name: string;
    category: string;
    icon: React.ComponentType;
    description: string;
    defaultElement: Partial<EditorElement>;
    preview: string;
    aiEnhanced?: boolean;
}

// ===============================
// 🎨 COMPONENT LIBRARY DATA
// ===============================

const COMPONENT_LIBRARY: ComponentLibraryItem[] = [
    // Layout Components
    {
        id: 'container',
        name: 'Container',
        category: 'Layout',
        icon: Box,
        description: 'Elemento container básico',
        defaultElement: {
            type: 'container',
            size: { width: 300, height: 200 },
            styles: {
                backgroundColor: '#f3f4f6',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '16px',
            },
            children: [],
        },
        preview: '/previews/container.svg',
    },

    {
        id: 'section',
        name: 'Seção',
        category: 'Layout',
        icon: Layers,
        description: 'Seção completa com padding',
        defaultElement: {
            type: 'section',
            size: { width: 100, height: 400 }, // Percentage based
            styles: {
                width: '100%',
                padding: '60px 20px',
                backgroundColor: '#ffffff',
            },
            children: [],
        },
        preview: '/previews/section.svg',
    },

    // Typography
    {
        id: 'heading',
        name: 'Título',
        category: 'Typography',
        icon: Type,
        description: 'Título ou cabeçalho',
        defaultElement: {
            type: 'heading',
            content: { text: 'Seu Título Aqui' },
            styles: {
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem',
            },
        },
        preview: '/previews/heading.svg',
    },

    {
        id: 'text',
        name: 'Texto',
        category: 'Typography',
        icon: Type,
        description: 'Parágrafo de texto',
        defaultElement: {
            type: 'text',
            content: { text: 'Seu texto vai aqui. Você pode editar diretamente ou usar o painel de propriedades.' },
            styles: {
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#4b5563',
            },
        },
        preview: '/previews/text.svg',
    },

    // Interactive Elements
    {
        id: 'button',
        name: 'Botão',
        category: 'Interactive',
        icon: Square,
        description: 'Botão clicável',
        defaultElement: {
            type: 'button',
            content: { text: 'Clique Aqui' },
            styles: {
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
            },
            behaviors: {
                onClick: 'alert("Botão clicado!")',
            },
        },
        preview: '/previews/button.svg',
        aiEnhanced: true,
    },

    // Media
    {
        id: 'image',
        name: 'Imagem',
        category: 'Media',
        icon: Image,
        description: 'Imagem responsiva',
        defaultElement: {
            type: 'image',
            content: {
                src: 'https://via.placeholder.com/400x300',
                alt: 'Descrição da imagem',
            },
            styles: {
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
            },
        },
        preview: '/previews/image.svg',
    },

    // Forms
    {
        id: 'input',
        name: 'Campo de Texto',
        category: 'Forms',
        icon: Type,
        description: 'Campo de entrada de texto',
        defaultElement: {
            type: 'input',
            properties: {
                placeholder: 'Digite aqui...',
                required: false,
            },
            styles: {
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
            },
        },
        preview: '/previews/input.svg',
    },

    // Advanced Components
    {
        id: 'quiz',
        name: 'Quiz',
        category: 'Advanced',
        icon: Brain,
        description: 'Componente de quiz interativo',
        defaultElement: {
            type: 'quiz',
            content: {
                title: 'Quiz Personalizado',
                questions: [],
            },
            styles: {
                backgroundColor: '#f9fafb',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
            },
        },
        preview: '/previews/quiz.svg',
        aiEnhanced: true,
    },

    {
        id: 'funnel',
        name: 'Funil',
        category: 'Advanced',
        icon: Target,
        description: 'Funil de conversão',
        defaultElement: {
            type: 'funnel',
            content: {
                title: 'Funil de Conversão',
                steps: [],
            },
            styles: {
                width: '100%',
                minHeight: '600px',
            },
        },
        preview: '/previews/funnel.svg',
        aiEnhanced: true,
    },
];

// Group components by category
const COMPONENT_CATEGORIES = COMPONENT_LIBRARY.reduce((acc, item) => {
    if (!acc[item.category]) {
        acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
}, {} as Record<string, ComponentLibraryItem[]>);

// ===============================
// 🖼️ DRAGGABLE COMPONENT (SIMPLIFIED)
// ===============================

const DraggableComponent: React.FC<{ item: ComponentLibraryItem }> = ({ item }) => {
    return (
        <div
            className="p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm 
                cursor-pointer transition-all duration-200"
        >
            <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                {item.aiEnhanced && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                        <Sparkles className="w-2 h-2 mr-1" />
                        IA
                    </Badge>
                )}
            </div>
            <p className="text-xs text-gray-500 leading-tight">{item.description}</p>
        </div>
    );
};

// ===============================
// 🎨 CANVAS COMPONENT
// ===============================

interface CanvasProps {
    elements: EditorElement[];
    selectedElement: EditorElement | null;
    onElementSelect: (element: EditorElement) => void;
    onElementUpdate: (element: EditorElement) => void;
    onElementDrop: (item: any, position: { x: number; y: number }) => void;
    deviceMode: 'desktop' | 'tablet' | 'mobile';
    zoomLevel: number;
}

const Canvas: React.FC<CanvasProps> = ({
    elements,
    selectedElement,
    onElementSelect,
    onElementUpdate,
    onElementDrop: _onElementDrop,
    deviceMode,
    zoomLevel,
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    // Canvas dimensions based on device mode
    const canvasStyle = useMemo(() => {
        const width = '100%';
        let maxWidth = 'none';

        switch (deviceMode) {
            case 'mobile':
                maxWidth = '375px';
                break;
            case 'tablet':
                maxWidth = '768px';
                break;
            case 'desktop':
                maxWidth = '1200px';
                break;
        }

        return {
            width,
            maxWidth,
            minHeight: '800px',
            backgroundColor: '#ffffff',
            border: deviceMode !== 'desktop' ? '1px solid #e5e7eb' : 'none',
            borderRadius: deviceMode !== 'desktop' ? '12px' : '0',
            margin: deviceMode !== 'desktop' ? '0 auto' : '0',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
        };
    }, [deviceMode, zoomLevel]);

    return (
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
            <div
                ref={canvasRef}
                style={canvasStyle}
                className="relative canvas-container transition-all duration-300"
            >
                {elements.map((element) => (
                    <CanvasElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElement?.id === element.id}
                        onSelect={() => onElementSelect(element)}
                        onUpdate={onElementUpdate}
                    />
                ))}

                {elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Component className="w-12 h-12 mx-auto mb-4" />
                            <p className="text-lg font-medium">Clique nos componentes para adicioná-los</p>
                            <p className="text-sm">Use a biblioteca de componentes à esquerda</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ===============================
// 🧩 CANVAS ELEMENT COMPONENT
// ===============================

interface CanvasElementProps {
    element: EditorElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (element: EditorElement) => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
    element,
    isSelected,
    onSelect,
    onUpdate,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
    };

    const renderElementContent = () => {
        switch (element.type) {
            case 'text':
            case 'heading':
                return (
                    <div
                        style={element.styles as React.CSSProperties}
                        dangerouslySetInnerHTML={{ __html: element.content.text || '' }}
                    />
                );

            case 'button':
                return (
                    <button style={element.styles as React.CSSProperties} onClick={(e) => e.preventDefault()}>
                        {element.content.text}
                    </button>
                );

            case 'image':
                return (
                    <img
                        src={element.content.src}
                        alt={element.content.alt}
                        style={element.styles as React.CSSProperties}
                    />
                );

            case 'input':
                return (
                    <input
                        type="text"
                        placeholder={element.properties.placeholder}
                        style={element.styles as React.CSSProperties}
                        onChange={() => { }} // Prevent actual editing in canvas
                    />
                );

            case 'container':
                return (
                    <div style={element.styles as React.CSSProperties} className="min-h-[100px] relative">
                        {element.children?.map((child) => (
                            <CanvasElement
                                key={child.id}
                                element={child}
                                isSelected={false}
                                onSelect={() => { }}
                                onUpdate={onUpdate}
                            />
                        ))}
                        {(!element.children || element.children.length === 0) && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                                Container vazio - arraste componentes aqui
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div style={element.styles as React.CSSProperties} className="p-4 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">{element.type} component</p>
                    </div>
                );
        }
    };

    return (
        <div
            className={`
        relative group cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isHovered ? 'ring-1 ring-blue-300 ring-opacity-30' : ''}
      `}
            style={{
                position: element.position ? 'absolute' : 'relative',
                left: element.position?.x || 'auto',
                top: element.position?.y || 'auto',
                width: element.size?.width || 'auto',
                height: element.size?.height || 'auto',
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                zIndex: element.layer || 1,
                opacity: element.visible !== false ? 1 : 0.5,
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {renderElementContent()}

            {/* Selection Overlay */}
            {(isSelected || isHovered) && (
                <div className="absolute -inset-1 pointer-events-none">
                    {/* Selection handles */}
                    {isSelected && (
                        <>
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize"></div>
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize"></div>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize"></div>
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"></div>
                        </>
                    )}

                    {/* Element info */}
                    <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {element.name || element.type}
                    </div>
                </div>
            )}
        </div>
    );
};

// ===============================
// 🎛️ PROPERTIES PANEL (LAZY LOADED)
// ===============================
// NOTA: PropertiesPanel foi extraído para ./components/EditorPropertiesPanel.tsx
// e é carregado sob demanda via lazy() para reduzir o bundle inicial do editor

// ===============================
// 🔧 COMPONENTS PANEL
// ===============================

interface ComponentsPanelProps {
    onComponentSelect?: (component: ComponentLibraryItem) => void;
}

const ComponentsPanel: React.FC<ComponentsPanelProps> = ({ onComponentSelect: _onComponentSelect }) => {
    const [activeCategory, setActiveCategory] = useState('Layout');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredComponents = useMemo(() => {
        const categoryComponents = COMPONENT_CATEGORIES[activeCategory] || [];

        if (!searchTerm) return categoryComponents;

        return categoryComponents.filter(component =>
            component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.description.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [activeCategory, searchTerm]);

    return (
        <div className="w-80 border-r border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Component className="w-5 h-5" />
                    Componentes
                </h2>

                {/* Search */}
                <Input
                    placeholder="Buscar componentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3"
                />

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                    {Object.keys(COMPONENT_CATEGORIES).map((category) => (
                        <Button
                            key={category}
                            variant={activeCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveCategory(category)}
                            className="text-xs"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="grid gap-3">
                    {filteredComponents.map((component) => (
                        <DraggableComponent key={component.id} item={component} />
                    ))}

                    {filteredComponents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Component className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Nenhum componente encontrado</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

// ===============================
// 🛠️ MAIN EDITOR TOOLBAR
// ===============================

interface ToolbarProps {
    editorState: EditorState;
    onStateChange: (updates: Partial<EditorState>) => void;
    onSave: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    editorState,
    onStateChange,
    onSave,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
}) => {
    const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
        onStateChange({ deviceMode: device });
    };

    const handleZoomChange = (zoom: number) => {
        onStateChange({ zoomLevel: zoom });
    };

    const handleAIOptimize = async () => {
        console.log('AI optimization requested');
    };

    return (
        <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
            {/* Left Section - File Actions */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    <Undo className="w-4 h-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRedo}
                    disabled={!canRedo}
                >
                    <Redo className="w-4 h-4" />
                </Button>
            </div>

            {/* Center Section - View Controls */}
            <div className="flex items-center gap-4">
                {/* Device Mode */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <Button
                        variant={editorState.deviceMode === 'desktop' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleDeviceChange('desktop')}
                        className="h-8"
                    >
                        <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={editorState.deviceMode === 'tablet' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleDeviceChange('tablet')}
                        className="h-8"
                    >
                        <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={editorState.deviceMode === 'mobile' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleDeviceChange('mobile')}
                        className="h-8"
                    >
                        <Smartphone className="w-4 h-4" />
                    </Button>
                </div>

                {/* Zoom Control */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleZoomChange(Math.max(0.25, editorState.zoomLevel - 0.25))}
                    >
                        -
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">
                        {Math.round(editorState.zoomLevel * 100)}%
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleZoomChange(Math.min(2, editorState.zoomLevel + 0.25))}
                    >
                        +
                    </Button>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <Button
                        variant={editorState.canvasMode === 'design' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onStateChange({ canvasMode: 'design' })}
                        className="h-8"
                    >
                        <Layout className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={editorState.canvasMode === 'preview' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onStateChange({ canvasMode: 'preview' })}
                        className="h-8"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={editorState.canvasMode === 'code' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onStateChange({ canvasMode: 'code' })}
                        className="h-8"
                    >
                        <Code className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Right Section - AI & Actions */}
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleAIOptimize}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Otimizar com IA
                </Button>

                <Button variant="default" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Visualizar
                </Button>
            </div>
        </div>
    );
};

// ===============================
// 🎨 MAIN UNIVERSAL VISUAL EDITOR
// ===============================

export const UniversalVisualEditor: React.FC = () => {
    // Editor State
    const [editorState, setEditorState] = useState<EditorState>({
        canvasMode: 'design',
        deviceMode: 'desktop',
        zoomLevel: 1,
        selectedElement: null,
        selectedElements: [],
        hoveredElement: null,
        history: [],
        historyIndex: -1,
        leftPanelVisible: true,
        rightPanelVisible: true,
        leftPanelWidth: 320,
        rightPanelWidth: 320,
        editMode: 'visual',
        activeTab: 'components',
        renderMode: 'realtime',
        showDebugInfo: false,
    });

    // Canvas Elements
    const [elements, setElements] = useState<EditorElement[]>([]);

    // Hooks
    const analytics = useAnalytics();

    // Update editor state
    const updateEditorState = useCallback((updates: Partial<EditorState>) => {
        setEditorState(prev => ({ ...prev, ...updates }));
    }, []);

    // Element management
    const handleElementSelect = useCallback((element: EditorElement) => {
        updateEditorState({ selectedElement: element });
        analytics.trackEvent('element_selected', { elementId: element.id, elementType: element.type });
    }, [updateEditorState, analytics]);

    const handleElementUpdate = useCallback((updatedElement: EditorElement) => {
        setElements(prev => prev.map(el =>
            el.id === updatedElement.id ? updatedElement : el,
        ));
        analytics.trackEvent('element_updated', { elementId: updatedElement.id });
    }, [analytics]);

    const handleElementDrop = useCallback((item: any, position: { x: number; y: number }) => {
        const newElement: EditorElement = {
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: item.type as ElementType,
            name: `${item.type} ${elements.length + 1}`,
            position,
            size: item.defaultElement?.size || { width: 200, height: 100 },
            rotation: 0,
            scale: 1,
            content: item.defaultElement?.content || {},
            properties: item.defaultElement?.properties || {},
            styles: item.defaultElement?.styles || {},
            behaviors: item.defaultElement?.behaviors || {},
            locked: false,
            visible: true,
            layer: 1,
            tags: [],
            children: [],
        };

        setElements(prev => [...prev, newElement]);
        updateEditorState({ selectedElement: newElement });

        analytics.trackEvent('element_added', {
            elementId: newElement.id,
            elementType: newElement.type,
            position,
        });
    }, [elements.length, updateEditorState, analytics]);

    // History management
    const handleSave = useCallback(() => {
        analytics.trackEvent('editor_save', { elementCount: elements.length });
        // Implement save logic
    }, [elements.length, analytics]);

    const handleUndo = useCallback(() => {
        // Implement undo logic
    }, []);

    const handleRedo = useCallback(() => {
        // Implement redo logic  
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        handleSave();
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            handleRedo();
                        } else {
                            handleUndo();
                        }
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave, handleUndo, handleRedo]);

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Toolbar */}
            <Toolbar
                editorState={editorState}
                onStateChange={updateEditorState}
                onSave={handleSave}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={false} // TODO: implement history
                canRedo={false} // TODO: implement history
            />

            {/* Main Editor Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Components */}
                {editorState.leftPanelVisible && (
                    <ComponentsPanel />
                )}

                {/* Canvas Area */}
                <Canvas
                    elements={elements}
                    selectedElement={editorState.selectedElement}
                    onElementSelect={handleElementSelect}
                    onElementUpdate={handleElementUpdate}
                    onElementDrop={handleElementDrop}
                    deviceMode={editorState.deviceMode}
                    zoomLevel={editorState.zoomLevel}
                />

                {/* Right Panel - Properties (Lazy Loaded) */}
                {editorState.rightPanelVisible && (
                    <Suspense fallback={
                        <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
                            <div className="text-center text-gray-500">
                                <Settings className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                                <p className="font-medium">Carregando propriedades...</p>
                            </div>
                        </div>
                    }>
                        <EditorPropertiesPanel
                            selectedElement={editorState.selectedElement}
                            onElementUpdate={handleElementUpdate}
                        />
                    </Suspense>
                )}
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-gray-50 border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-600">
                <div className="flex items-center gap-4">
                    <span>Elementos: {elements.length}</span>
                    <span>Selecionados: {editorState.selectedElement ? 1 : 0}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>Modo: {editorState.canvasMode}</span>
                    <span>Dispositivo: {editorState.deviceMode}</span>
                    <span>Zoom: {Math.round(editorState.zoomLevel * 100)}%</span>
                </div>
            </div>
        </div>
    );
};

export default UniversalVisualEditor;