import React from 'react';
import { SelectableBlock } from '@/components/editor/SelectableBlock';

interface ModularStrategicQuestionStepProps {
    data: any;
    currentAnswer?: string;
    onAnswerChange?: (answer: string) => void;
    onEdit?: (field: string, value: any) => void;
    isEditable?: boolean;
    selectedBlockId?: string;
    onBlockSelect?: (blockId: string) => void;
    onOpenProperties?: (blockId: string) => void;
}

/**
 * 🎯 STRATEGIC QUESTION STEP MODULARIZADO
 * 
 * Cada seção é um bloco editável independente:
 * - Barra de progresso
 * - Número da pergunta
 * - Texto da pergunta
 * - Grid de opções
 * - Botão de ação
 */
export default function ModularStrategicQuestionStep({
    data,
    currentAnswer = '',
    onAnswerChange,
    onEdit,
    isEditable = false,
    selectedBlockId,
    onBlockSelect = () => {},
    onOpenProperties = () => {}
}: ModularStrategicQuestionStepProps) {

    const safeData = {
        questionNumber: data.questionNumber || 'Pergunta Estratégica',
        questionText: data.questionText || 'Qual é sua resposta?',
        options: data.options || [
            { id: 'opt1', text: 'Opção A' },
            { id: 'opt2', text: 'Opção B' },
            { id: 'opt3', text: 'Opção C' }
        ]
    };

    const handleOptionClick = (optionId: string) => {
        if (onAnswerChange) {
            onAnswerChange(optionId);
        }
    };

    // Block IDs
    const progressBlockId = `${data.id}-progress`;
    const questionNumberBlockId = `${data.id}-question-number`;
    const questionTextBlockId = `${data.id}-question-text`;
    const optionsBlockId = `${data.id}-options`;
    const buttonBlockId = `${data.id}-button`;

    const progress = Math.round((15 / 21) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* BLOCO 1: Barra de Progresso */}
            <SelectableBlock
                blockId={progressBlockId}
                isSelected={selectedBlockId === progressBlockId}
                isEditable={isEditable}
                onSelect={onBlockSelect}
                blockType="Barra de Progresso"
                onOpenProperties={onOpenProperties}
                isDraggable={false}
            >
                <div className="mb-6 max-w-6xl mx-auto px-4 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-center mb-4 text-gray-600">Progresso: {progress}%</p>
                </div>
            </SelectableBlock>

            <main className="w-full max-w-6xl mx-auto px-4">
                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">
                    {/* BLOCO 2: Número da Pergunta */}
                    <SelectableBlock
                        blockId={questionNumberBlockId}
                        isSelected={selectedBlockId === questionNumberBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Número da Pergunta"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#432818]">
                            {safeData.questionNumber}
                        </h2>
                    </SelectableBlock>

                    {/* BLOCO 3: Texto da Pergunta */}
                    <SelectableBlock
                        blockId={questionTextBlockId}
                        isSelected={selectedBlockId === questionTextBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Texto da Pergunta"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <p
                            className="text-xl md:text-2xl font-bold text-[#deac6d] mb-8"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                            {safeData.questionText}
                        </p>
                        {isEditable && (
                            <p className="text-xs text-blue-500 mb-4">
                                ✏️ Editável via Painel de Propriedades
                            </p>
                        )}
                    </SelectableBlock>

                    {/* BLOCO 4: Grid de Opções */}
                    <SelectableBlock
                        blockId={optionsBlockId}
                        isSelected={selectedBlockId === optionsBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Opções de Resposta"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                            {safeData.options.map((option: any) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionClick(option.id)}
                                    className={`p-4 border-2 rounded-lg transition-all duration-200 hover:border-[#deac6d] hover:shadow-md ${currentAnswer === option.id
                                            ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg'
                                            : 'border-gray-200'
                                        }`}
                                >
                                    <p className="font-medium text-sm text-[#432818]">
                                        {option.text}
                                    </p>
                                    {currentAnswer === option.id && (
                                        <div className="mt-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center mx-auto">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </SelectableBlock>

                    {/* BLOCO 5: Botão de Ação */}
                    <SelectableBlock
                        blockId={buttonBlockId}
                        isSelected={selectedBlockId === buttonBlockId}
                        isEditable={isEditable}
                        onSelect={onBlockSelect}
                        blockType="Botão de Ação"
                        onOpenProperties={onOpenProperties}
                        isDraggable={true}
                    >
                        <button
                            disabled={!currentAnswer}
                            className={`font-bold py-3 px-6 rounded-full shadow-md transition-all ${currentAnswer
                                    ? 'bg-[#deac6d] text-white hover:bg-[#c19a5d]'
                                    : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'
                                }`}
                        >
                            {currentAnswer ? 'Próxima' : 'Selecione uma opção'}
                        </button>
                    </SelectableBlock>
                </div>
            </main>
        </div>
    );
}