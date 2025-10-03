import React from 'react';
import type { EditableQuizStep } from '@/types/EditableQuizStep';
import QuizEstiloWrapper from './QuizEstiloWrapper';

interface EditorTransitionStepProps {
    data: EditableQuizStep;
    onComplete?: () => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
}

/**
 * ⏳ TRANSITION STEP COM DESIGN DO /QUIZ-ESTILO
 * 
 * Versão para o editor que replica o visual exato do quiz de produção
 */
export default function EditorTransitionStep({
    data,
    onComplete,
    onEdit,
    isEditable = false
}: EditorTransitionStepProps) {

    // Dados seguros com fallbacks
    const safeData = {
        title: data.title || 'Preparando seu resultado...',
        subtitle: data.subtitle || 'Analisando suas respostas',
        description: data.description || 'Em poucos segundos você descobrirá seu estilo predominante.',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cs_fpoukb.png'
    };

    React.useEffect(() => {
        // Auto-advance após 3 segundos (no editor isso é só visual)
        const timer = setTimeout(() => {
            if (onComplete) {
                console.log('Transição completa (demo)');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <QuizEstiloWrapper showHeader={false} showProgress={false}>
            <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
                {/* Título */}
                <h1
                    className="text-2xl md:text-3xl font-bold text-[#432818] mb-4"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    {safeData.title}
                </h1>

                {/* Imagem */}
                <div className="w-full max-w-sm mx-auto mb-6">
                    <img
                        src={safeData.image}
                        alt="Transição"
                        className="w-full h-auto rounded-lg shadow-sm"
                    />
                </div>

                {/* Subtítulo */}
                <h2 className="text-lg text-[#B89B7A] font-semibold mb-4">
                    {safeData.subtitle}
                </h2>

                {/* Descrição */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {safeData.description}
                </p>

                {/* Loading animation */}
                <div className="flex justify-center items-center space-x-2 mb-6">
                    <div className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>

                {isEditable && (
                    <p className="text-xs text-blue-500">
                        ✏️ Editável via Painel de Propriedades
                    </p>
                )}
            </div>
        </QuizEstiloWrapper>
    );
}