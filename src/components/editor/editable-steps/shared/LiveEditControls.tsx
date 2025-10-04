/**
 * 🎮 LIVE EDIT CONTROLS
 * 
 * Controles inline que aparecem quando um componente editável é selecionado.
 * Permite editar, duplicar, deletar e mover componentes.
 */

import React from 'react';
import { Edit3, Copy, Trash2, MoveUp, MoveDown, Settings } from 'lucide-react';

export interface LiveEditControlsProps {
    /** Se os controles estão visíveis */
    isVisible: boolean;
    /** Posição dos controles (relativa ao componente) */
    position?: 'top' | 'bottom' | 'overlay';
    /** Callbacks para ações */
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onSettings?: () => void;
    /** Desabilitar certas ações */
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    canDelete?: boolean;
}

export const LiveEditControls: React.FC<LiveEditControlsProps> = ({
    isVisible,
    position = 'overlay',
    onEdit,
    onDuplicate,
    onDelete,
    onMoveUp,
    onMoveDown,
    onSettings,
    canMoveUp = true,
    canMoveDown = true,
    canDelete = true
}) => {
    if (!isVisible) return null;

    const positionClasses = {
        'top': 'absolute -top-12 left-0 z-10',
        'bottom': 'absolute -bottom-12 left-0 z-10',
        'overlay': 'absolute top-2 right-2 z-10'
    };

    const controls = [
        {
            icon: Edit3,
            label: 'Editar',
            onClick: onEdit,
            className: 'text-blue-600 hover:bg-blue-50',
            enabled: true
        },
        {
            icon: Settings,
            label: 'Configurações',
            onClick: onSettings,
            className: 'text-gray-600 hover:bg-gray-50',
            enabled: true
        },
        {
            icon: Copy,
            label: 'Duplicar',
            onClick: onDuplicate,
            className: 'text-green-600 hover:bg-green-50',
            enabled: true
        },
        {
            icon: MoveUp,
            label: 'Mover para cima',
            onClick: onMoveUp,
            className: 'text-purple-600 hover:bg-purple-50',
            enabled: canMoveUp
        },
        {
            icon: MoveDown,
            label: 'Mover para baixo',
            onClick: onMoveDown,
            className: 'text-purple-600 hover:bg-purple-50',
            enabled: canMoveDown
        },
        {
            icon: Trash2,
            label: 'Deletar',
            onClick: onDelete,
            className: 'text-red-600 hover:bg-red-50',
            enabled: canDelete
        }
    ];

    return (
        <div className={`${positionClasses[position]} flex items-center gap-1`}>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                {controls.map((control, index) => {
                    const Icon = control.icon;

                    if (!control.enabled || !control.onClick) return null;

                    return (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                control.onClick?.();
                            }}
                            className={`
                p-2 rounded-md transition-colors duration-200 
                ${control.className}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
                            title={control.label}
                            disabled={!control.enabled}
                        >
                            <Icon size={16} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};