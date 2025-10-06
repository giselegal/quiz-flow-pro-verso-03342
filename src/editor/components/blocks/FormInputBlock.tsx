/**
 * 🎯 FORM INPUT BLOCK - Componente Modular
 * 
 * Campo de input para coleta de dados (nome, email, etc).
 * Usado na etapa 1 (intro) do quiz.
 */

import React from 'react';
import { BlockComponentProps } from '@/editor/registry/BlockRegistry';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FormInputBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    onSelect
}) => {
    // Extrair propriedades
    const label = data.content?.label || 'Campo';
    const placeholder = data.content?.placeholder || 'Digite aqui...';
    const type = data.content?.type || 'text';
    const required = data.properties?.required || false;
    const variableName = data.properties?.variableName || 'inputValue';

    return (
        <div
            className={cn(
                'relative p-4 transition-all duration-200 cursor-pointer',
                'hover:ring-1 hover:ring-blue-200',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20'
            )}
            onClick={onSelect}
            data-block-id={data.id}
            data-block-type={data.type}
        >
            {isSelected && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded shadow-sm z-10 flex items-center gap-1">
                    📥 Input
                    <span className="opacity-70">({variableName})</span>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor={`input-${data.id}`} className="text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                <Input
                    id={`input-${data.id}`}
                    type={type}
                    placeholder={placeholder}
                    className="w-full"
                    disabled={true} // Preview mode - não editável inline
                />

                {required && (
                    <p className="text-xs text-gray-500">
                        * Campo obrigatório
                    </p>
                )}
            </div>
        </div>
    );
};

export default FormInputBlock;
