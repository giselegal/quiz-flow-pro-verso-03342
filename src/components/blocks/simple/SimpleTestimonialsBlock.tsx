import React from 'react';

interface BlockComponentProps {
    block: {
        type: string;
        content: any;
        properties: any;
    };
    isSelected: boolean;
    editMode: boolean;
    previewMode?: boolean;
    onSelect: () => void;
}

/**
 * 💬 SIMPLE TESTIMONIALS BLOCK
 * 
 * Seção de depoimentos e resultados reais
 * Mostra credibilidade através de casos de sucesso
 */
const SimpleTestimonialsBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected,
    editMode,
    onSelect
}) => {
    const content = block.content || {};
    const properties = block.properties || {};

    const testimonials = [
        {
            name: "Ana Silva",
            result: "Economizei R$ 2.000 em compras desnecessárias",
            photo: "👩‍💼"
        },
        {
            name: "Maria Costa",
            result: "Finalmente encontrei meu estilo único",
            photo: "👩‍🎨"
        },
        {
            name: "Carla Santos",
            result: "Minha autoestima mudou completamente",
            photo: "👩‍💻"
        }
    ];

    return (
        <div
            onClick={onSelect}
            className={`
                p-6 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl
                ${isSelected && editMode ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${editMode ? 'cursor-pointer hover:border-pink-300' : ''}
                transition-all duration-200
            `}
        >
            {/* Title */}
            {content.title && (
                <h3 className="text-2xl font-bold text-pink-900 mb-6 text-center">
                    {content.title}
                </h3>
            )}

            {/* Testimonials grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-white/60 p-4 rounded-lg border border-pink-100 text-center"
                    >
                        <div className="text-3xl mb-2">{testimonial.photo}</div>
                        <h4 className="font-semibold text-pink-800 mb-2">
                            {testimonial.name}
                        </h4>
                        <p className="text-sm text-pink-700 italic">
                            "{testimonial.result}"
                        </p>
                        <div className="flex justify-center mt-2">
                            <div className="flex text-yellow-400">
                                {"⭐".repeat(5)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Results statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-white/60 rounded border border-pink-100">
                    <div className="text-2xl font-bold text-pink-600">94%</div>
                    <div className="text-xs text-pink-700">Satisfação</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded border border-pink-100">
                    <div className="text-2xl font-bold text-pink-600">500+</div>
                    <div className="text-xs text-pink-700">Alunas</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded border border-pink-100">
                    <div className="text-2xl font-bold text-pink-600">4.8★</div>
                    <div className="text-xs text-pink-700">Avaliação</div>
                </div>
            </div>

            {/* Testimonials highlight */}
            <div className="p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg text-center border border-pink-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">💖</span>
                    <span className="font-semibold text-pink-800">
                        Resultados Comprovados
                    </span>
                </div>
                <p className="text-sm text-pink-700">
                    Centenas de mulheres já transformaram seu estilo
                </p>
            </div>

            {/* Debug info in edit mode */}
            {editMode && (
                <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                        Dados dos depoimentos
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-200 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify({ content, properties }, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default SimpleTestimonialsBlock;