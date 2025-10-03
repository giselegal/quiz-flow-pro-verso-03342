import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';

interface ModularTransitionStepProps {
    data: any;
    onComplete?: () => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
}

/**
 * ⏳ TRANSITION STEP MODULARIZADO
 * 
 * Cada seção é um bloco editável independente:
 * - Título principal
 * - Imagem
 * - Subtítulo
 * - Descrição
 * - Loading animation
 */
export default function ModularTransitionStep({
    data,
    onComplete,
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect,
    onOpenProperties
}: ModularTransitionStepProps) {

    const safeData = {
        title: data.title || 'Preparando seu resultado...',
        subtitle: data.subtitle || 'Analisando suas respostas',
        description: data.description || 'Em poucos segundos você descobrirá seu estilo predominante.',
        image: data.image || 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png'
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) {
                console.log('Transição completa (demo)');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    // Block IDs
    const titleBlockId = `${data.id}-title`;
    const imageBlockId = `${data.id}-image`;
    const subtitleBlockId = `${data.id}-subtitle`;
    const descriptionBlockId = `${data.id}-description`;
    const loadingBlockId = `${data.id}-loading`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <main className="w-full max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
                    {/* BLOCO 1: Título Principal */}
                    <SelectableBlock
                        blockId={titleBlockId}
                        isSelected={selectedBlockId === titleBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Título Principal"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <h1
                            className="text-2xl md:text-3xl font-bold text-[#432818] mb-4"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                            {safeData.title}
                        </h1>
                    </SelectableBlock>

                    {/* BLOCO 2: Imagem */}
                    <SelectableBlock
                        blockId={imageBlockId}
                        isSelected={selectedBlockId === imageBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Imagem"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="w-full max-w-sm mx-auto mb-6">
                            <img
                                src={safeData.image}
                                alt="Transição"
                                className="w-full h-auto rounded-lg shadow-sm"
                            />
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 3: Subtítulo */}
                    <SelectableBlock
                        blockId={subtitleBlockId}
                        isSelected={selectedBlockId === subtitleBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Subtítulo"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <h2 className="text-lg text-[#B89B7A] font-semibold mb-4">
                            {safeData.subtitle}
                        </h2>
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
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {safeData.description}
                        </p>
                    </SelectableBlock>

                    {/* BLOCO 5: Loading Animation */}
                    <SelectableBlock
                        blockId={loadingBlockId}
                        isSelected={selectedBlockId === loadingBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Loading Animation"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="flex justify-center items-center space-x-2 mb-6">
                            <div className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>


                    </SelectableBlock>
                </div>
            </main>
        </div>
    );
}