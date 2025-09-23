import { useEffect } from 'react';
// import { Button } from '@/components/ui/button'; // Commented - not used
import type { QuizStep } from '@/data/quizSteps';

interface TransitionStepProps {
    data: QuizStep;
    onComplete: () => void;
}

/**
 * ⏳ COMPONENTE DE TRANSIÇÃO
 * 
 * Exibe telas de loading entre seções do quiz (etapas 12 e 19)
 * com animação e mensagens contextuais.
 */
export default function TransitionStep({ data, onComplete }: TransitionStepProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const isResultTransition = data.type === 'transition-result';

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto min-h-[60vh]">
            {/* Loading Animation */}
            <div className="relative mb-8">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#deac6d]/20"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-[#deac6d] absolute top-0 left-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#deac6d] rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#5b4135] mb-4 playfair-display">
                {data.title}
            </h2>

            {/* Description */}
            {data.text && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-md">
                    {data.text}
                </p>
            )}

            {/* Progress Indicators */}
            <div className="flex space-x-2 mb-8">
                {[1, 2, 3].map((dot) => (
                    <div
                        key={dot}
                        className={`w-3 h-3 rounded-full bg-[#deac6d] animate-pulse`}
                        style={{
                            animationDelay: `${dot * 0.2}s`,
                            animationDuration: '1.2s'
                        }}
                    ></div>
                ))}
            </div>

            {/* Contextual Message */}
            {isResultTransition ? (
                <div className="bg-gradient-to-r from-[#deac6d]/10 to-[#c49548]/10 p-6 rounded-lg border border-[#deac6d]/20">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-[#5b4135] font-medium">
                        Seu resultado personalizado está quase pronto!
                    </p>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-[#deac6d]/10 to-[#c49548]/10 p-6 rounded-lg border border-[#deac6d]/20">
                    <div className="text-4xl mb-2">🧮</div>
                    <p className="text-[#5b4135] font-medium">
                        Analisando suas respostas e calculando seu estilo predominante...
                    </p>
                </div>
            )}

            {/* Subtle Animation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-30">
                <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 h-8 bg-[#deac6d] rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '2s'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}