import React, { useMemo, useState } from 'react';
import QuizEstiloWrapper from '@/components/editor/quiz-estilo/QuizEstiloWrapper';

export interface CompositeIntroStepProps {
    title: string;
    formQuestion: string;
    placeholder: string;
    buttonText: string;
    image?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    showHeader?: boolean;
    showProgress?: boolean;
    progress?: number;
    onSubmit?: (name: string) => void;
}

const CompositeIntroStep: React.FC<CompositeIntroStepProps> = ({
    title,
    formQuestion,
    placeholder,
    buttonText,
    image,
    description = 'Em poucos minutos, descubra seu Estilo Predominante e aprenda a montar looks que refletem sua essência com praticidade e confiança.',
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    showHeader = true,
    showProgress = false,
    progress = 0,
    onSubmit,
}) => {
    const [name, setName] = useState('');

    const canSubmit = useMemo(() => name.trim().length > 0, [name]);

    const handleSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();
        if (!canSubmit) return;
        onSubmit?.(name.trim());
    };

    const buttonBaseClasses = 'w-full py-3 px-4 text-base font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

    return (
        <QuizEstiloWrapper showHeader={showHeader} showProgress={showProgress} progress={progress} className="py-8">
            <div className="flex flex-col items-center justify-start space-y-8" style={{ color: textColor }}>
                <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mx-auto">
                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight px-2"
                        style={{
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: 400,
                            color: textColor,
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: title }} />
                    </h1>
                </div>

                <section className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-6 md:space-y-8 mx-auto">
                    {image && (
                        <div className="mt-2 w-full mx-auto flex justify-center">
                            <div
                                className="overflow-hidden rounded-lg shadow-sm"
                                style={{
                                    aspectRatio: '1.47',
                                    maxHeight: '204px',
                                    width: '100%',
                                    maxWidth: '300px',
                                    backgroundColor,
                                }}
                            >
                                <img
                                    src={image}
                                    alt="Descubra seu estilo predominante"
                                    className="w-full h-full object-contain"
                                    width={300}
                                    height={204}
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    )}

                    <p className="text-sm sm:text-base text-center leading-relaxed px-2" style={{ color: '#4a5568' }}>
                        <span dangerouslySetInnerHTML={{ __html: description }} />
                    </p>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="w-full space-y-6" autoComplete="off">
                            <div>
                                <label
                                    htmlFor="quiz-intro-name"
                                    className="block text-xs font-semibold mb-1.5"
                                    style={{ color: textColor }}
                                >
                                    {formQuestion} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="quiz-intro-name"
                                    type="text"
                                    placeholder={placeholder}
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="w-full p-2.5 rounded-md border-2 focus:outline-none focus:ring-2"
                                    style={{
                                        backgroundColor: '#FEFEFE',
                                        borderColor: accentColor,
                                        color: textColor,
                                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleSubmit();
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={() => handleSubmit()}
                                className={`${buttonBaseClasses}`}
                                style={{
                                    backgroundColor: canSubmit ? accentColor : `${accentColor}80`,
                                    color: '#ffffff',
                                    boxShadow: canSubmit ? `0 15px 25px ${accentColor}40` : 'none',
                                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                                }}
                                disabled={!canSubmit}
                            >
                                {buttonText}
                            </button>

                            <p className="text-xs text-center" style={{ color: '#718096' }}>
                                Seu nome é necessário para personalizar sua experiência.
                            </p>
                        </form>
                    </div>
                </section>
            </div>
        </QuizEstiloWrapper>
    );
};

export default CompositeIntroStep;
