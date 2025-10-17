import React from 'react';
import { AtomicBlockProps } from '@/types/blockProps';
import { useResult } from '@/contexts/ResultContext';

/**
 * 🎨 RESULT STYLE BLOCK
 * 
 * Exibe os TOP 3 estilos com barras de progresso e porcentagens.
 * Consome calculations do ResultContext.
 */
export default function ResultStyleBlock({
    block,
    isSelected,
    onClick
}: AtomicBlockProps) {
    // 🎯 Tentar usar context (modo production) ou fallback (modo editor)
    let calculations, styleConfig;

    try {
        const result = useResult();
        calculations = result.calculations;
        styleConfig = result.styleConfig;
    } catch (e) {
        // Editor mode: usar dados mock
        calculations = null;
        styleConfig = null;
    }

    // ✅ Configurações do bloco
    const showTopThree = block.content?.showTopThree !== false;
    const showConfidence = block.content?.showConfidence !== false;
    const showProgressBars = block.content?.showProgressBars !== false;
    const showImage = block.content?.showImage !== false;
    const color = block.content?.color || '#B89B7A';

    // Dados mockados para editor
    const mockTopStyles = [
        { key: 'classico', displayKey: 'clássico', name: 'Clássico', percentage: 35, score: 15 },
        { key: 'elegante', displayKey: 'elegante', name: 'Elegante', percentage: 28, score: 12 },
        { key: 'natural', displayKey: 'natural', name: 'Natural', percentage: 23, score: 10 }
    ];

    // Usar dados reais ou mock
    const topStyles = calculations?.topStyles || mockTopStyles;
    const confidence = calculations?.confidence || 85;
    const imageUrl = styleConfig?.imageUrl;

    return (
        <div
            className={`p-6 rounded-lg bg-gradient-to-br from-[#B89B7A]/10 to-[#a08966]/10 mb-6 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={onClick}
        >
            {/* Imagem do estilo (se disponível e configurado) */}
            {showImage && imageUrl && (
                <div className="mb-6">
                    <img
                        src={imageUrl}
                        alt="Estilo"
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* TOP 3 Estilos */}
            {showTopThree && (
                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        Seus estilos principais:
                    </h3>
                    {topStyles.slice(0, 3).map((style, index) => (
                        <div key={style.key}>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-medium text-gray-700">
                                    {index + 1}. {style.name}
                                </span>
                                <span className="text-xl font-bold" style={{ color }}>
                                    {style.percentage.toFixed(0)}%
                                </span>
                            </div>

                            {showProgressBars && (
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500"
                                        style={{
                                            backgroundColor: color,
                                            width: `${style.percentage}%`,
                                            opacity: 1 - (index * 0.2) // Fade progressivo
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Confiança do resultado */}
            {showConfidence && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-sm text-gray-600 text-center">
                        Confiança do resultado: <span className="font-bold" style={{ color }}>
                            {confidence}%
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}