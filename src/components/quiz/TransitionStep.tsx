import { useEffect, useMemo } from 'react';
import type { QuizStep } from '../../data/quizSteps';
import { TRANSITION_STEP_SCHEMA } from '@/data/stepBlockSchemas';
import { Block } from '@/types/editor';

interface TransitionStepProps {
    data: QuizStep;
    onComplete: () => void;
}

/**
 * ⏳ COMPONENTE DE TRANSIÇÃO - MODULAR
 * 
 * Usa sistema de blocos para renderização modular
 */
export default function TransitionStep({ data, onComplete }: TransitionStepProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const isResultTransition = data.type === 'transition-result';

    // Preparar blocos do schema com dados dinâmicos
    const blocks: Block[] = useMemo(() => {
        return TRANSITION_STEP_SCHEMA.blocks.map((schemaBlock, index) => ({
            id: `transition-${data.id || 'unknown'}-${schemaBlock.id}`,
            type: schemaBlock.type as any,
            order: index,
            content: {},
            properties: {
                ...schemaBlock.props,
                text: schemaBlock.props.text
                    ?.replace('{{title}}', data.title || '')
                    ?.replace('{{text}}', data.text || '')
            }
        }));
    }, [data]);

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
        </div>
    );
}
