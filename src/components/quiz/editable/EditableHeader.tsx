import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableField } from './EditableField';

interface EditableHeaderProps {
    logo?: string;
    progress?: number; // 0-100
    onBack?: () => void;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 🎯 HEADER EDITÁVEL COM PROGRESSO
 * 
 * Componente que replica o VerticalCanvasHeader do modelo:
 * - Logo editável
 * - Barra de progresso animada
 * - Botão de voltar funcional
 */
export default function EditableHeader({
    logo = '',
    progress = 0,
    onBack = () => { },
    isEditable = false,
    onEdit = () => { }
}: EditableHeaderProps) {
    const progressPercentage = Math.min(Math.max(progress, 0), 100);
    const translateX = 100 - progressPercentage;

    return (
        <div className="flex flex-row w-full h-auto justify-center relative">
            {/* Botão Voltar */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 h-10 w-10"
                onClick={isEditable ? () => { } : onBack}
                disabled={isEditable}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* Container Central */}
            <div className="flex flex-col w-full customizable-width justify-start items-center gap-4">
                {/* Logo Editável */}
                <div className="relative group">
                    <img
                        width="96"
                        height="96"
                        className="max-w-24 object-cover rounded"
                        alt="Logo"
                        src={logo || '/api/placeholder/96/96'}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/96/96';
                        }}
                    />

                    {isEditable && (
                        <>
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded flex items-center justify-center">
                                <button
                                    className="text-white text-xs px-2 py-1 bg-blue-500 rounded hover:bg-blue-600"
                                    onClick={() => {
                                        const newUrl = prompt('URL do novo logo:', logo);
                                        if (newUrl !== null) onEdit('logo', newUrl);
                                    }}
                                >
                                    Alterar Logo
                                </button>
                            </div>
                            <EditableField
                                value={logo}
                                onChange={(value) => onEdit('logo', value)}
                                isEditable={true}
                                className="absolute -bottom-8 left-0 right-0 text-xs text-center text-gray-500 bg-white/80 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                placeholder="URL do logo..."
                            />
                        </>
                    )}
                </div>

                {/* Barra de Progresso */}
                <div className="relative w-full overflow-hidden rounded-full bg-zinc-300 h-2">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{
                            transform: `translateX(-${translateX}%)`,
                            width: '100%'
                        }}
                    />
                    {isEditable && (
                        <div className="absolute -bottom-6 left-0 right-0 text-xs text-center text-gray-500">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progressPercentage}
                                onChange={(e) => onEdit('progress', parseInt(e.target.value))}
                                className="w-full h-1"
                            />
                            <span className="text-xs">{progressPercentage}%</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Indicador de Modo Edição */}
            {isEditable && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 bg-blue-50 py-1 px-3 rounded border border-blue-200">
                    💡 Header editável
                </div>
            )}
        </div>
    );
}