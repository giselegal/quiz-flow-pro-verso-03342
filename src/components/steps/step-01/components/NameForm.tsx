/**
 * 📋 FORMULÁRIO DE NOME - COMPONENTE MODULAR
 * 
 * Componente independente para captura do nome do usuário
 * com validação e personalização completas.
 */

import React, { useState, useEffect } from 'react';

interface NameFormProps {
    // Dados
    initialValue?: string;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;

    // Callbacks
    onValueChange?: (value: string) => void;
    onSubmit: (name: string) => void;

    // Comportamento
    autoFocus?: boolean;
    required?: boolean;
    minLength?: number;

    // Estilo
    primaryColor?: string;
    focusColor?: string;

    // Estado
    isEditable?: boolean;
    disabled?: boolean;
}

const NameForm: React.FC<NameFormProps> = ({
    initialValue = '',
    formQuestion = 'Como posso te chamar?',
    placeholder = 'Digite seu primeiro nome aqui...',
    buttonText = 'Quero Descobrir meu Estilo Agora!',
    onValueChange = () => { },
    onSubmit,
    autoFocus = true,
    required = true,
    minLength = 1,
    primaryColor = '#B89B7A',
    focusColor = '#A1835D',
    isEditable = false,
    disabled = false
}) => {
    const [nome, setNome] = useState(initialValue);
    const [isValid, setIsValid] = useState(false);

    // Atualizar valor quando prop mudar
    useEffect(() => {
        setNome(initialValue);
    }, [initialValue]);

    // Validar nome em tempo real
    useEffect(() => {
        const trimmedName = nome.trim();
        const valid = trimmedName.length >= minLength;
        setIsValid(valid);

        // Notificar componente pai sobre mudanças
        onValueChange(trimmedName);
    }, [nome, minLength, onValueChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            setNome(e.target.value);
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmedName = nome.trim();

        if (isValid && trimmedName) {
            onSubmit(trimmedName);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isValid) {
            handleSubmit();
        }
    };

    return (
        <div className="mt-8">
            <form
                onSubmit={handleSubmit}
                className="w-full space-y-6"
                autoComplete="off"
            >
                <div>
                    <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-[#432818] mb-1.5"
                    >
                        {formQuestion} {required && <span className="text-red-500">*</span>}
                    </label>

                    <input
                        id="name"
                        type="text"
                        placeholder={placeholder}
                        value={nome}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                        style={{
                            borderColor: primaryColor
                        }}
                        autoFocus={autoFocus}
                        required={required}
                        disabled={disabled || isEditable}
                        minLength={minLength}
                    />
                </div>

                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                        backgroundColor: isValid ? primaryColor : `${primaryColor}80`, // 80 = 50% opacity
                        color: isValid ? 'white' : 'rgba(255, 255, 255, 0.9)',
                        cursor: isValid ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!isValid || disabled}
                    onMouseEnter={(e) => {
                        if (isValid) {
                            e.currentTarget.style.backgroundColor = focusColor;
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (isValid) {
                            e.currentTarget.style.backgroundColor = primaryColor;
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                >
                    {buttonText}
                </button>

                <p className="text-xs text-center text-gray-500 pt-1">
                    Seu nome é necessário para personalizar sua experiência.
                </p>
            </form>
        </div>
    );
};

export default NameForm;
