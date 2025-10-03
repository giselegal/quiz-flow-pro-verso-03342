import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';

interface ModularResultStepProps {
    data: any;
    userProfile?: {
        userName: string;
        resultStyle: string;
        secondaryStyles?: string[];
    };
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
}

/**
 * 🏆 RESULT STEP MODULARIZADO
 * 
 * Cada seção é um bloco editável independente:
 * - Título de parabéns
 * - Resultado principal
 * - Imagem do resultado
 * - Descrição
 * - Características
 * - Call to Action
 */
export default function ModularResultStep({
    data,
    userProfile,
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect,
    onOpenProperties
}: ModularResultStepProps) {

    const safeData = {
        title: data.title || 'Seu Estilo Predominante é:',
        resultStyle: userProfile?.resultStyle || 'Clássico Elegante',
        userName: userProfile?.userName || 'João',
        description: data.description || 'Parabéns! Você descobriu seu estilo único.',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
        characteristics: data.characteristics || [
            'Elegante e refinado',
            'Atemporal e sofisticado',
            'Valoriza qualidade'
        ]
    };

    // Block IDs
    const congratsBlockId = `${data.id}-congrats`;
    const resultBlockId = `${data.id}-result`;
    const imageBlockId = `${data.id}-image`;
    const descriptionBlockId = `${data.id}-description`;
    const characteristicsBlockId = `${data.id}-characteristics`;
    const ctaBlockId = `${data.id}-cta`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                    {/* BLOCO 1: Título de Parabéns */}
                    <SelectableBlock
                        blockId={congratsBlockId}
                        isSelected={selectedBlockId === congratsBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Título de Parabéns"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <h1
                            className="text-2xl md:text-3xl font-bold text-[#432818] mb-2"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                            Parabéns, {safeData.userName}!
                        </h1>

                        <h2 className="text-lg text-gray-600 mb-6">
                            {safeData.title}
                        </h2>
                    </SelectableBlock>

                    {/* BLOCO 2: Resultado Principal */}
                    <SelectableBlock
                        blockId={resultBlockId}
                        isSelected={selectedBlockId === resultBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Resultado Principal"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="bg-gradient-to-br from-[#B89B7A] to-[#A1835D] text-white p-6 rounded-lg shadow-lg mb-8">
                            <h3
                                className="text-3xl md:text-4xl font-bold mb-4"
                                style={{ fontFamily: '"Playfair Display", serif' }}
                            >
                                {safeData.resultStyle}
                            </h3>
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 3: Imagem do Resultado */}
                    <SelectableBlock
                        blockId={imageBlockId}
                        isSelected={selectedBlockId === imageBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Imagem do Resultado"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="w-full max-w-sm mx-auto mb-6">
                            <img
                                src={safeData.image}
                                alt={`Estilo ${safeData.resultStyle}`}
                                className="w-full h-auto rounded-lg shadow-sm"
                            />
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 4: Descrição */}
                    <SelectableBlock
                        blockId={descriptionBlockId}
                        isSelected={selectedBlockId === descriptionBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Descrição"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                            {safeData.description}
                        </p>
                    </SelectableBlock>

                    {/* BLOCO 5: Características */}
                    <SelectableBlock
                        blockId={characteristicsBlockId}
                        isSelected={selectedBlockId === characteristicsBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Características"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="bg-gray-50 p-6 rounded-lg mb-8">
                            <h4 className="text-lg font-semibold text-[#432818] mb-4">
                                Suas principais características:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {safeData.characteristics.map((characteristic: string, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-white p-3 rounded-md shadow-sm border-l-4 border-[#B89B7A]"
                                    >
                                        <p className="text-sm font-medium text-[#432818]">
                                            {characteristic}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 6: Call to Action */}
                    <SelectableBlock
                        blockId={ctaBlockId}
                        isSelected={selectedBlockId === ctaBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Call to Action"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <button className="bg-[#B89B7A] hover:bg-[#A1835D] text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                            Descobrir Minha Consultoria Personalizada
                        </button>

                        {isEditable && (
                            <p className="text-xs text-blue-500 mt-4">
                                ✏️ Editável via Painel de Propriedades
                            </p>
                        )}
                    </SelectableBlock>
                </div>
            </main>
        </div>
    );
}