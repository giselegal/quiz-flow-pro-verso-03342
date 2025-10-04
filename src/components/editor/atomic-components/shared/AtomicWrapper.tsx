/**
 * 🎪 ATOMIC WRAPPER
 * 
 * Wrapper universal para todos os componentes atômicos.
 * Gerencia seleção, drag & drop, controles e inserção.
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Trash2,
    Copy,
    ArrowUp,
    ArrowDown,
    GripVertical,
    MoreHorizontal
} from 'lucide-react';
import { AtomicComponentType } from '../types';

interface AtomicWrapperProps {
    children: React.ReactNode;
    componentId: string;
    componentType: AtomicComponentType;
    isSelected: boolean;
    isEditable: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onInsertAfter: (componentType: AtomicComponentType) => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
    stepId: string;
}

const COMPONENT_ICONS = {
    title: '📝',
    subtitle: '📑',
    text: '📄',
    input: '📝',
    button: '🔘',
    image: '🖼️',
    spacer: '📏',
    divider: '➖',
    question: '❓',
    options: '☑️',
    progress: '📊',
    timer: '⏱️'
};

const INSERTABLE_COMPONENTS: Array<{ type: AtomicComponentType; label: string; icon: string }> = [
    { type: 'title', label: 'Título', icon: '📝' },
    { type: 'text', label: 'Texto', icon: '📄' },
    { type: 'input', label: 'Input', icon: '📝' },
    { type: 'button', label: 'Botão', icon: '🔘' },
    { type: 'image', label: 'Imagem', icon: '🖼️' },
    { type: 'spacer', label: 'Espaço', icon: '📏' },
    { type: 'divider', label: 'Divisor', icon: '➖' },
    { type: 'question', label: 'Pergunta', icon: '❓' },
    { type: 'options', label: 'Opções', icon: '☑️' }
];

export const AtomicWrapper: React.FC<AtomicWrapperProps> = ({
    children,
    componentId,
    componentType,
    isSelected,
    isEditable,
    onSelect,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onInsertAfter,
    canMoveUp,
    canMoveDown,
    stepId
}) => {
    const [showInsertMenu, setShowInsertMenu] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    if (!isEditable) {
        return <div className="atomic-component-readonly">{children}</div>;
    }

    return (
        <div
            className={cn(
                "atomic-wrapper relative group transition-all duration-200 rounded-md",
                isSelected && "ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50",
                isHovered && !isSelected && "ring-1 ring-blue-300 bg-blue-50/20",
                "hover:shadow-sm"
            )}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Indicador de tipo de componente */}
            {(isSelected || isHovered) && (
                <div className="absolute -top-6 left-0 z-20">
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                        <span>{COMPONENT_ICONS[componentType]}</span>
                        <span className="capitalize">{componentType}</span>
                    </div>
                </div>
            )}

            {/* Drag Handle */}
            {(isSelected || isHovered) && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-20">
                    <div className="bg-gray-600 text-white p-1 rounded shadow-sm cursor-grab hover:bg-gray-700">
                        <GripVertical className="w-3 h-3" />
                    </div>
                </div>
            )}

            {/* Controles de Ação */}
            {(isSelected || isHovered) && (
                <div className="absolute -top-2 -right-2 z-20 flex gap-1">
                    {/* Mover para cima */}
                    {canMoveUp && onMoveUp && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0 shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp();
                            }}
                            title="Mover para cima"
                        >
                            <ArrowUp className="w-3 h-3" />
                        </Button>
                    )}

                    {/* Mover para baixo */}
                    {canMoveDown && onMoveDown && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0 shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown();
                            }}
                            title="Mover para baixo"
                        >
                            <ArrowDown className="w-3 h-3" />
                        </Button>
                    )}

                    {/* Duplicar */}
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0 shadow-sm text-green-600 hover:text-green-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate();
                        }}
                        title="Duplicar componente"
                    >
                        <Copy className="w-3 h-3" />
                    </Button>

                    {/* Deletar */}
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0 shadow-sm text-red-600 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        title="Deletar componente"
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {/* Conteúdo do componente */}
            <div className="atomic-content p-2">
                {children}
            </div>

            {/* Botão de inserção */}
            {(isSelected || isHovered) && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 px-2 shadow-sm bg-green-500 hover:bg-green-600 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowInsertMenu(!showInsertMenu);
                            }}
                            title="Inserir componente após este"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            <span className="text-xs">Inserir</span>
                        </Button>

                        {/* Menu de inserção */}
                        {showInsertMenu && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border rounded-lg shadow-lg z-30 min-w-32">
                                <div className="p-1">
                                    {INSERTABLE_COMPONENTS.map((comp) => (
                                        <button
                                            key={comp.type}
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded flex items-center gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onInsertAfter(comp.type);
                                                setShowInsertMenu(false);
                                            }}
                                        >
                                            <span>{comp.icon}</span>
                                            <span>{comp.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};