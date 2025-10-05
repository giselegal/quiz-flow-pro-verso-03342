/**
 * 🎯 COMPONENTE EDITÁVEL: FORM CONTAINER
 * 
 * Componente específico para editar containers de formulário (input de nome, email, etc.)
 */

import React, { useState } from 'react';
import { RealComponentProps, FormContainerContent } from './types';
import { cn } from '@/lib/utils';
import { Edit3, Settings, Mail, User, Phone, Lock } from 'lucide-react';

interface FormContainerEditorProps extends RealComponentProps {
    content: FormContainerContent;
}

export const FormContainerEditor: React.FC<FormContainerEditorProps> = ({
    id,
    content,
    properties,
    isEditing = false,
    isSelected = false,
    onUpdate,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleContentUpdate = (updates: Partial<FormContainerContent>) => {
        onUpdate?.({
            content: { ...content, ...updates }
        });
    };

    const getFieldIcon = () => {
        switch (content.fieldType) {
            case 'email': return <Mail size={20} className="text-gray-400" />;
            case 'tel': return <Phone size={20} className="text-gray-400" />;
            case 'password': return <Lock size={20} className="text-gray-400" />;
            default: return <User size={20} className="text-gray-400" />;
        }
    };

    const getFieldLabel = () => {
        switch (content.fieldType) {
            case 'email': return 'E-mail';
            case 'tel': return 'Telefone';
            case 'password': return 'Senha';
            default: return 'Nome';
        }
    };

    return (
        <div
            className={cn(
                'relative transition-all duration-200 rounded-lg p-6',
                'border-2 border-transparent',
                isSelected && 'border-blue-500 shadow-lg',
                isHovered && 'border-gray-300 shadow-md',
                'cursor-pointer bg-white'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
        >
            {/* 🎨 Overlay de edição */}
            {(isHovered || isSelected) && (
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                        className="p-1 bg-white rounded shadow-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Ativar modo de edição inline
                        }}
                    >
                        <Edit3 size={14} className="text-gray-600" />
                    </button>
                    <button
                        className="p-1 bg-white rounded shadow-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Abrir painel de propriedades
                        }}
                    >
                        <Settings size={14} className="text-gray-600" />
                    </button>
                </div>
            )}

            {/* 🏷️ Label do tipo */}
            {isSelected && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Form Input ({content.fieldType})
                </div>
            )}

            {/* 📝 Label do campo */}
            {content.label && (
                <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleContentUpdate({ label: e.currentTarget.textContent || '' })}
                >
                    {content.label}
                    {content.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* 🔤 Campo de input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {getFieldIcon()}
                </div>

                <input
                    type={content.fieldType}
                    className={cn(
                        'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg',
                        'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        'placeholder-gray-400 text-gray-900',
                        'transition-all duration-200'
                    )}
                    placeholder={content.placeholder || `Digite seu ${getFieldLabel().toLowerCase()}`}
                    required={content.required}
                    disabled={!isEditing}
                    style={{
                        backgroundColor: properties.backgroundColor || '#FFFFFF',
                        borderColor: properties.borderColor || '#D1D5DB',
                        borderRadius: properties.borderRadius || '8px',
                        fontSize: properties.fontSize || '16px'
                    }}
                />
            </div>

            {/* ⚠️ Validação e ajuda */}
            {content.validation && isSelected && (
                <div className="mt-2 text-xs text-gray-500">
                    <div>Validação:</div>
                    <ul className="list-disc list-inside ml-2">
                        {content.validation.minLength && (
                            <li>Mínimo: {content.validation.minLength} caracteres</li>
                        )}
                        {content.validation.maxLength && (
                            <li>Máximo: {content.validation.maxLength} caracteres</li>
                        )}
                        {content.validation.pattern && (
                            <li>Padrão: {content.validation.pattern}</li>
                        )}
                    </ul>
                </div>
            )}

            {/* 🎯 Configurações editáveis (quando selecionado) */}
            {isSelected && (
                <div className="mt-4 p-3 bg-gray-50 rounded border space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={content.required || false}
                                onChange={(e) => handleContentUpdate({ required: e.target.checked })}
                            />
                            <span>Campo obrigatório</span>
                        </label>

                        <select
                            value={content.fieldType}
                            onChange={(e) => handleContentUpdate({ fieldType: e.target.value as any })}
                            className="px-2 py-1 border rounded text-sm"
                        >
                            <option value="text">Texto</option>
                            <option value="email">E-mail</option>
                            <option value="tel">Telefone</option>
                            <option value="password">Senha</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        value={content.placeholder || ''}
                        onChange={(e) => handleContentUpdate({ placeholder: e.target.value })}
                        placeholder="Placeholder do campo"
                        className="w-full px-2 py-1 border rounded text-sm"
                    />
                </div>
            )}
        </div>
    );
};