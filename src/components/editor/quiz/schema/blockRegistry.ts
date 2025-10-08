import { ReactNode, lazy } from 'react';
import { Type, Image as ImageIcon, MousePointer, List, Layout } from 'lucide-react';
import { getBlockSchema } from './blockSchema';

export interface BlockRegistryItem {
    type: string;
    label: string;
    icon: ReactNode;
    category: 'layout' | 'content' | 'interactive' | 'media';
    defaultProps: Record<string, any>;
    schemaKeys: string[]; // referência rápida às chaves do schema
    // Futuro: renderer dinâmico/lazy
    renderer?: any;
}

// Lazy placeholders para renderers especializados futuros
const LazyNotImplemented = lazy(() => Promise.resolve({ default: () => null }));

function deriveDefaults(type: string): Record<string, any> {
    const schema = getBlockSchema(type);
    const defaults: Record<string, any> = {};
    if (!schema) return defaults;
    for (const prop of schema.properties) {
        if (prop.default !== undefined) defaults[prop.key] = prop.default;
    }
    return defaults;
}

export const blockRegistry: BlockRegistryItem[] = [
    {
        type: 'text',
        label: 'Texto',
        icon: <Type className="w-4 h-4" />,
    category: 'content',
        defaultProps: deriveDefaults('text'),
        schemaKeys: getBlockSchema('text')?.properties.map(p => p.key) || [],
        renderer: LazyNotImplemented
    },
    {
        type: 'heading',
        label: 'Título',
        icon: <Type className="w-5 h-5" />,
    category: 'content',
        defaultProps: deriveDefaults('heading'),
        schemaKeys: getBlockSchema('heading')?.properties.map(p => p.key) || [],
        renderer: LazyNotImplemented
    },
    {
        type: 'image',
        label: 'Imagem',
        icon: <ImageIcon className="w-4 h-4" />,
    category: 'media',
        defaultProps: deriveDefaults('image'),
        schemaKeys: getBlockSchema('image')?.properties.map(p => p.key) || [],
        renderer: LazyNotImplemented
    },
    {
        type: 'button',
        label: 'Botão',
        icon: <MousePointer className="w-4 h-4" />,
    category: 'interactive',
        defaultProps: deriveDefaults('button'),
        schemaKeys: getBlockSchema('button')?.properties.map(p => p.key) || [],
        renderer: LazyNotImplemented
    },
    {
        type: 'quiz-options',
        label: 'Opções de Quiz',
        icon: <List className="w-4 h-4" />,
    category: 'interactive',
        defaultProps: deriveDefaults('quiz-options'),
        schemaKeys: getBlockSchema('quiz-options')?.properties.map(p => p.key) || [],
        renderer: LazyNotImplemented
    },
    {
        type: 'form-input',
        label: 'Campo de Texto',
        icon: <Type className="w-4 h-4" />,
    category: 'interactive',
        defaultProps: deriveDefaults('form-input'),
        schemaKeys: getBlockSchema('form-input')?.properties.map(p => p.key) || [],
        renderer: LazyNotImplemented
    },
    {
        type: 'container',
        label: 'Container',
        icon: <Layout className="w-4 h-4" />,
    category: 'layout',
        defaultProps: deriveDefaults('container'),
        schemaKeys: getBlockSchema('container')?.properties.map(p => p.key) || [],
        renderer: LazyNotImplemented
    }
];

export function getRegistryItem(type: string) {
    return blockRegistry.find(r => r.type === type);
}
