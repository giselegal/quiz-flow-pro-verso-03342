import React, { useState } from 'react';
import type { EditableQuizStep } from '@/types/EditableQuizStep';
import QuizEstiloWrapper from './QuizEstiloWrapper';

interface EditorIntroStepProps {
    data: EditableQuizStep;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
}

/**
 * 🏠 INTRO STEP COM DESIGN DO /QUIZ-ESTILO
 * 
 * Versão para o editor que replica o visual exato do quiz de produção
 */
export default function EditorIntroStep({
    data,
    onEdit,
    isEditable = false
}: EditorIntroStepProps) {
    const [nome, setNome] = useState('');

    // Dados seguros com fallbacks
    const safeData = {
        title: data.title || '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
        formQuestion: data.formQuestion || 'Como posso te chamar?',
        placeholder: data.placeholder || 'Digite seu primeiro nome aqui...',
        buttonText: data.buttonText || 'Quero Descobrir meu Estilo Agora!',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (nome.trim()) {
            // No editor, não avança automaticamente
            console.log('Nome submetido:', nome.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <QuizEstiloWrapper showHeader={true} showProgress={false}>
            <div className="flex flex-col items-center justify-start py-8 space-y-8">
                {/* Título principal */}
                <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto">
                    <h1
                        className="text-2xl font-bold text-center leading-tight px-2 sm:text-3xl md:text-4xl text-[#432818]"
                        style={{
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: 400,
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: safeData.title }} />
                    </h1>
                </div>

                {/* Conteúdo Principal */}
                <section className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto">
                    {/* Imagem principal */}
                    <div className="mt-2 w-full mx-auto flex justify-center">
                        <div
                            className="overflow-hidden rounded-lg shadow-sm"
                            style={{
                                aspectRatio: '1.47',
                                maxHeight: '204px',
                                width: '100%',
                                maxWidth: '300px'
                            }}
                        >
                            <img
                                src={safeData.image}
                                alt="Descubra seu estilo predominante"
                                className="w-full h-full object-contain"
                                width={300}
                                height={204}
                                style={{
                                    maxWidth: '300px',
                                    maxHeight: '204px',
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </div>

                    {/* Texto descritivo */}
                    <p className="text-sm text-center leading-relaxed px-2 sm:text-base text-gray-600">
                        Em poucos minutos, descubra seu{' '}
                        <span className="font-semibold text-[#B89B7A]">
                            Estilo Predominante
                        </span>{' '}
                        — e aprenda a montar looks que realmente refletem sua{' '}
                        <span className="font-semibold text-[#432818]">
                            essência
                        </span>, com
                        praticidade e{' '}
                        <span className="font-semibold text-[#432818]">
                            confiança
                        </span>.
                    </p>

                    {/* Formulário */}
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
                                    {safeData.formQuestion} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder={safeData.placeholder}
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 border-[#B89B7A] focus:outline-none focus:ring-2 focus:ring-[#A1835D]"
                                    autoFocus
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className={`w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 ${nome.trim()
                                    ? 'bg-[#B89B7A] text-white hover:bg-[#A1835D] hover:shadow-lg'
                                    : 'bg-[#B89B7A]/50 text-white/90 cursor-not-allowed'
                                    }`}
                                disabled={!nome.trim()}
                            >
                                {safeData.buttonText}
                            </button>

                            <p className="text-xs text-center text-gray-500 pt-1">
                                Seu nome é necessário para personalizar sua experiência.
                                {isEditable && (
                                    <span className="block text-blue-500 mt-1">
                                        ✏️ Editável via Painel de Propriedades
                                    </span>
                                )}
                            </p>
                        </form>
                    </div>
                </section>
            </div>
        </QuizEstiloWrapper>
    );
}