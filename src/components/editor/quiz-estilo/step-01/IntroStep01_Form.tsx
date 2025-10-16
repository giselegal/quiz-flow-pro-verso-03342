/**
 * 📋 INTRO STEP 01 - FORM
 * 
 * Componente separado do formulário para a etapa 1
 * Input de nome + botão de submissão
 */

import React, { useState } from 'react';

export interface IntroStep01FormProps {
    formQuestion?: string;
    inputPlaceholder?: string;
    inputLabel?: string;
    buttonText?: string;
    required?: boolean;
    buttonColor?: string;
    buttonTextColor?: string;
    inputBorderColor?: string;
    onSubmit?: (name: string) => void;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

export const IntroStep01_Form: React.FC<IntroStep01FormProps> = ({
    formQuestion = 'Como posso te chamar?',
    inputPlaceholder = 'Digite seu primeiro nome aqui...',
    inputLabel = 'NOME',
    buttonText = 'Quero Descobrir meu Estilo Agora!',
    required = true,
    buttonColor = '#B89B7A',
    buttonTextColor = '#FFFFFF',
    inputBorderColor = '#B89B7A',
    onSubmit,
    isEditable = false,
    onEdit
}) => {
    const [nome, setNome] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (required && !nome.trim()) {
            setError('Por favor, digite seu nome');
            return;
        }

        setError('');

        if (onSubmit && typeof onSubmit === 'function') {
            onSubmit(nome.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-xs sm:max-w-md px-4 space-y-4 mx-auto">
            {/* Pergunta do formulário */}
            <div
                className="text-center"
                data-editable={isEditable ? 'formQuestion' : undefined}
                onClick={() => isEditable && onEdit?.('formQuestion', formQuestion)}
                style={{ cursor: isEditable ? 'pointer' : 'default' }}
            >
                <p className="text-base font-semibold text-gray-700 mb-1">
                    {formQuestion}
                </p>
            </div>

            {/* Campo de input */}
            <div className="space-y-2">
                <label
                    htmlFor="nome-input"
                    className="block text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                    {inputLabel} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    id="nome-input"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={inputPlaceholder}
                    required={required}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all ${error ? 'border-red-500' : ''
                        }`}
                    style={{
                        borderColor: error ? '#EF4444' : inputBorderColor,
                        fontSize: '16px'
                    }}
                    data-editable={isEditable ? 'inputPlaceholder' : undefined}
                    onClick={(e) => {
                        if (isEditable) {
                            e.stopPropagation();
                            onEdit?.('inputPlaceholder', inputPlaceholder);
                        }
                    }}
                />
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
            </div>

            {/* Botão de submissão */}
            <button
                disabled={required && !nome.trim()}
                className="w-full py-4 px-6 rounded-lg font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                    cursor: isEditable ? 'pointer' : (required && !nome.trim() ? 'not-allowed' : 'pointer')
                }}
                data-editable={isEditable ? 'buttonText' : undefined}
                onClick={(e) => {
                    if (isEditable) {
                        e.stopPropagation();
                        onEdit?.('buttonText', buttonText);
                    } else {
                        handleSubmit(e as any);
                    }
                }}
            >
                {buttonText}
            </button>

            {/* Informações adicionais */}
            <div className="text-center space-y-1">
                <p className="text-xs text-gray-500">
                    ⏱️ Leva apenas 3 minutos • 🔒 100% seguro
                </p>
                <p className="text-xs text-gray-400">
                    Mais de 10.000 pessoas já descobriram seu estilo
                </p>
            </div>
        </div>
    );
};

export default IntroStep01_Form;
