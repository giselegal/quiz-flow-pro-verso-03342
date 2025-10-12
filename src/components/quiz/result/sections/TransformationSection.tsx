import React from 'react';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

interface TransformationStep {
    icon?: React.ReactNode;
    title: string;
    description: string;
}

interface Benefit {
    icon?: string;
    text: string;
}

interface TransformationSectionProps {
    title?: string;
    subtitle?: string;
    benefits: Benefit[];
    steps?: TransformationStep[];
    beforeAfterImages?: {
        before?: string;
        after?: string;
    };
    className?: string;
}

export default function TransformationSection({
    title = 'Sua Transformação Começa Aqui',
    subtitle,
    benefits,
    steps,
    beforeAfterImages,
    className = ''
}: TransformationSectionProps) {
    const defaultSteps: TransformationStep[] = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Passo 1 — Autoconhecimento',
            description: 'Descubra seu estilo único através de exercícios práticos'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Passo 2 — Estratégia Visual',
            description: 'Aprenda a usar cores e peças que valorizam você'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Passo 3 — Transformação',
            description: 'Implemente mudanças reais no seu guarda-roupa'
        }
    ];

    const transformationSteps = steps || defaultSteps;

    return (
        <div className={`bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg ${className}`}>
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#432818] mb-3">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gradient-to-br from-[#B89B7A]/5 to-transparent rounded-lg border border-[#B89B7A]/10"
                    >
                        <CheckCircle className="w-5 h-5 text-[#B89B7A] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">
                            {benefit.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* Transformation Steps */}
            {transformationSteps && transformationSteps.length > 0 && (
                <div className="space-y-4 mb-8">
                    {transformationSteps.map((step, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-4 sm:p-5 bg-white border-2 border-[#B89B7A]/20 rounded-lg hover:shadow-md transition-shadow"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#B89B7A] to-[#a08966] rounded-full flex items-center justify-center text-white">
                                {step.icon || <ArrowRight className="w-6 h-6" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="font-bold text-[#432818] text-base sm:text-lg mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Before/After Images */}
            {beforeAfterImages && (beforeAfterImages.before || beforeAfterImages.after) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {beforeAfterImages.before && (
                        <div>
                            <p className="text-center font-semibold text-gray-700 mb-2">Antes</p>
                            <img
                                src={beforeAfterImages.before}
                                alt="Antes"
                                className="w-full rounded-lg shadow-md"
                            />
                        </div>
                    )}
                    {beforeAfterImages.after && (
                        <div>
                            <p className="text-center font-semibold text-[#B89B7A] mb-2">Depois ✨</p>
                            <img
                                src={beforeAfterImages.after}
                                alt="Depois"
                                className="w-full rounded-lg shadow-md border-2 border-[#B89B7A]/30"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
