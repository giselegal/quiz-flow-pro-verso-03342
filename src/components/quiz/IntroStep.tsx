import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';

interface IntroStepProps {
    data: QuizStep;
    onNameSubmit: (name: string) => void;
}

/**
 * 🚀 COMPONENTE DE INTRODUÇÃO DO QUIZ
 * 
 * Primeira etapa do quiz onde coletamos o nome do usuário
 * e apresentamos a proposta de valor do quiz de estilo pessoal.
 */
export default function IntroStep({ data, onNameSubmit }: IntroStepProps) {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
            <div
                dangerouslySetInnerHTML={{ __html: data.title! }}
                className="text-3xl md:text-4xl font-bold leading-tight mb-4"
            />

            {data.image && (
                <div className="my-6">
                    <img
                        src={data.image}
                        alt="Guarda-roupa organizado"
                        className="rounded-lg shadow-md mx-auto max-w-full h-auto"
                    />
                </div>
            )}

            <div className="mt-8">
                <p className="text-xl font-semibold mb-4">{data.formQuestion}</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={data.placeholder}
                    className="w-full max-w-sm p-3 rounded-lg border-2 border-[#deac6d] focus:outline-none focus:ring-2 focus:ring-[#deac6d] transition-colors mb-6"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className={`font-bold py-3 px-6 rounded-full shadow-md transition-transform transform hover:scale-105 ${name.trim()
                        ? 'bg-[#deac6d] text-white hover:bg-[#c49548]'
                        : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                        }`}
                >
                    {data.buttonText}
                </button>
            </div>
        </div>
    );
}