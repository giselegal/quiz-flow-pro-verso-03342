import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditableField } from './EditableField';

interface EditableButtonProps {
    text: string;
    onClick?: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    disabled?: boolean;
    fullWidth?: boolean;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 🔘 BOTÃO EDITÁVEL STANDALONE
 * 
 * Componente de botão que pode ser editado inline:
 * - Texto editável
 * - Variantes de estilo
 * - Tamanhos configuráveis
 * - Funcional no preview
 */
export default function EditableButton({
    text = 'Botão',
    onClick = () => { },
    variant = 'default',
    size = 'default',
    disabled = false,
    fullWidth = true,
    isEditable = false,
    onEdit = () => { }
}: EditableButtonProps) {
    const [isEditing, setIsEditing] = useState(false);

    const buttonClasses = `
        ${fullWidth ? 'min-w-full' : ''}
        ${size === 'lg' ? 'h-14' : size === 'sm' ? 'h-8' : 'h-10'}
        ${isEditable ? 'relative' : ''}
    `;

    if (isEditable) {
        return (
            <div className="relative group">
                <Button
                    variant={variant}
                    size={size}
                    disabled={true}
                    className={`${buttonClasses} ${isEditing ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                        }`}
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => onEdit('text', e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setIsEditing(false);
                                }
                                if (e.key === 'Escape') {
                                    setIsEditing(false);
                                }
                            }}
                            className="bg-transparent border-none outline-none text-center w-full text-inherit"
                            autoFocus
                            onFocus={(e) => e.target.select()}
                        />
                    ) : (
                        <span className="cursor-text">{text}</span>
                    )}
                </Button>

                {/* Controles de Estilo */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-white shadow-lg rounded-lg p-3 border text-xs min-w-max">
                        <div className="flex flex-col gap-2">
                            {/* Variantes */}
                            <div>
                                <label className="block text-gray-600 mb-1">Estilo:</label>
                                <select
                                    value={variant}
                                    onChange={(e) => onEdit('variant', e.target.value)}
                                    className="w-full border rounded px-2 py-1 text-xs"
                                >
                                    <option value="default">Padrão</option>
                                    <option value="destructive">Destrutivo</option>
                                    <option value="outline">Contorno</option>
                                    <option value="secondary">Secundário</option>
                                    <option value="ghost">Fantasma</option>
                                </select>
                            </div>

                            {/* Tamanhos */}
                            <div>
                                <label className="block text-gray-600 mb-1">Tamanho:</label>
                                <select
                                    value={size}
                                    onChange={(e) => onEdit('size', e.target.value)}
                                    className="w-full border rounded px-2 py-1 text-xs"
                                >
                                    <option value="sm">Pequeno</option>
                                    <option value="default">Médio</option>
                                    <option value="lg">Grande</option>
                                </select>
                            </div>

                            {/* Largura Total */}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={fullWidth}
                                    onChange={(e) => onEdit('fullWidth', e.target.checked)}
                                    className="w-3 h-3"
                                />
                                <span>Largura total</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Indicador de Editabilidade */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">
                        Clique para editar
                    </span>
                </div>
            </div>
        );
    }

    // MODO PREVIEW: Botão funcional
    return (
        <Button
            variant={variant}
            size={size}
            disabled={disabled}
            className={buttonClasses}
            onClick={onClick}
        >
            {text}
        </Button>
    );
}