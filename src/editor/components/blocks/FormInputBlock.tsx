/**
 * 🎯 FORM INPUT BLOCK - Componente Modular
 * 
 * Campo de input para coleta de dados (nome, email, etc).
 * Usado na etapa 1 (intro) do quiz.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FormInputBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect,
    onUpdate
}) => {
    // Extrair propriedades
    const label = data.props?.label || 'Campo';
    const placeholder = data.props?.placeholder || 'Digite aqui...';
    const type = data.props?.type || 'text';
    const required = data.props?.required || false;

    // Normalização de variableName: preferir props.properties.variableName se existir no modelo original
    const rawVariableName: string | undefined = (data as any)?.props?.variableName || (data as any)?.props?.properties?.variableName || (data.metadata as any)?.variableName;
    const variableName = useMemo(() => {
        const base = rawVariableName || 'inputValue';
        return base
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '_');
    }, [rawVariableName]);

    // Estado local para valor digitado em modo edição (preview interativo)
    const [value, setValue] = useState<string>(() => data.props?.value ?? '');

    // Sincronizar caso valor externo seja atualizado (ex: undo/redo)
    useEffect(() => {
        if (typeof data.props?.value === 'string' && data.props.value !== value) {
            setValue(data.props.value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.props?.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setValue(next);
        if (isEditable && typeof onUpdate === 'function') {
            onUpdate({ value: next, variableName });
        }
    };

    return (
        <div
            className={cn(
                'relative p-4 transition-all duration-200 cursor-pointer',
                'hover:ring-1 hover:ring-blue-200',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20'
            )}
            onClick={onSelect ? () => onSelect() : undefined}
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
                    disabled={!isEditable}
                    value={value}
                    onChange={handleChange}
                />

                {required && (
                    <p className="text-xs text-gray-500">
                        * Campo obrigatório
                    </p>
                )}
                {isSelected && (
                    <p className="text-[10px] text-gray-400 pt-1 font-mono">
                        var: <strong>{variableName}</strong>{value ? ` = "${value}"` : ''}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FormInputBlock;
