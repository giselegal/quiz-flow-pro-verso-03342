import React, { useState } from 'react';
import type { QuizStep } from '@/data/quizSteps';
import { EditableField } from './EditableField';

interface EditableIntroStepProps {
    data: QuizStep;
    onNameSubmit: (name: string) => void;
    isEditable?: boolean;
    onEdit?: (field: string, value: any) => void;
}

/**
 * 🎨 INTRO STEP EDITÁVEL
 * 
 * Versão híbrida que funciona tanto em:
 * - Modo Edição: Campos editáveis inline
 * - Modo Preview: Funcionamento normal
 */
export default function EditableIntroStep({
    data,
    onNameSubmit,
    isEditable = false,
    onEdit = () => { }
}: EditableIntroStepProps) {
    const [nome, setNome] = useState('');

    // Dados seguros com fallbacks
    const safeData = data || {
        type: 'intro',
        title: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome aqui...',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isEditable && nome.trim()) {
            onNameSubmit(nome.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isEditable) {
            handleSubmit();
        }
    };

    return (
        <main
            className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8"
            data-section="intro"
        >
            <header className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
                {/* Logo */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                        <div className="text-3xl font-bold tracking-wider">
                            ESTILO
                        </div>
                        <div className="text-xs tracking-[0.3em] text-gray-600 text-center">
                            PERSONAL
                        </div>
                    </div>
                </div>

                {/* Título Principal - EDITÁVEL */}
                <div className="text-center space-y-6">
                    <EditableField
                        value={safeData.title || ''}
                        onChange={(value) => onEdit('title', value)}
                        isEditable={isEditable}
                        htmlContent={true}
                        className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-gray-800"
                        placeholder="Digite o título principal..."
                    />

                    {/* Imagem - EDITÁVEL */}
                    <div className="flex justify-center my-6">
                        {isEditable ? (
                            <div className="relative group">
                                <img
                                    src={safeData.image || '/api/placeholder/300/200'}
                                    alt="Imagem do quiz"
                                    className="w-48 h-32 sm:w-64 sm:h-40 md:w-80 md:h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/api/placeholder/300/200';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <button
                                        className="text-white text-sm px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
                                        onClick={() => {
                                            const newUrl = prompt('URL da nova imagem:', safeData.image);
                                            if (newUrl) onEdit('image', newUrl);
                                        }}
                                    >
                                        Alterar Imagem
                                    </button>
                                </div>
                                <EditableField
                                    value={safeData.image || ''}
                                    onChange={(value) => onEdit('image', value)}
                                    isEditable={true}
                                    className="absolute -bottom-8 left-0 right-0 text-xs text-center text-gray-500 bg-white/80 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    placeholder="URL da imagem..."
                                />
                            </div>
                        ) : (
                            <img
                                src={safeData.image || '/api/placeholder/300/200'}
                                alt="Imagem do quiz"
                                className="w-48 h-32 sm:w-64 sm:h-40 md:w-80 md:h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/api/placeholder/300/200';
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Pergunta do Form - EDITÁVEL */}
                    <EditableField
                        value={safeData.formQuestion || 'Como posso te chamar?'}
                        onChange={(value) => onEdit('formQuestion', value)}
                        isEditable={isEditable}
                        className="block text-sm font-medium text-gray-700 text-center mb-2"
                        placeholder="Pergunta do formulário..."
                    />

                    {/* Input de Nome */}
                    <div className="relative">
                        <input
                            type="text"
                            value={isEditable ? safeData.placeholder || '' : nome}
                            onChange={(e) => isEditable ? onEdit('placeholder', e.target.value) : setNome(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isEditable ? 'Edite o placeholder...' : safeData.placeholder}
                            className={`w-full px-4 py-3 text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent outline-none transition-all duration-200 ${isEditable ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                            disabled={isEditable}
                        />
                        {isEditable && (
                            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                Placeholder
                            </div>
                        )}
                    </div>

                    {/* Botão - EDITÁVEL */}
                    <div className="relative">
                        <button
                            type={isEditable ? "button" : "submit"}
                            onClick={isEditable ? () => { } : handleSubmit}
                            className={`w-full py-4 px-6 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${isEditable
                                    ? 'bg-blue-500 hover:bg-blue-600 cursor-default'
                                    : 'bg-[#B89B7A] hover:bg-[#A08965] transform hover:scale-[1.02] hover:shadow-xl'
                                }`}
                        >
                            <EditableField
                                value={safeData.buttonText || 'Começar'}
                                onChange={(value) => onEdit('buttonText', value)}
                                isEditable={isEditable}
                                className="font-semibold text-white"
                                placeholder="Texto do botão..."
                            />
                        </button>
                    </div>
                </form>

                {/* Indicador de Modo */}
                {isEditable && (
                    <div className="text-center text-xs text-blue-600 bg-blue-50 py-2 px-4 rounded-lg border border-blue-200">
                        💡 <strong>Modo Edição:</strong> Clique nos textos para editar. Duplo-clique para campos avançados.
                    </div>
                )}
            </header>
        </main>
    );
}