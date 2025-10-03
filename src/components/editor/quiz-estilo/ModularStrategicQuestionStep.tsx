import React from 'react'; import React from 'react'; import React from 'react';

import { SelectableBlock } from '@/components/editor/SelectableBlock'; import { SelectableBlock } from '@/components/editor/SelectableBlock';



interface ModularStrategicQuestionStepProps {interface M<p 

    data: any; className = "text-xl md:text-2xl font-bold text-[#deac6d] mb-8"

    currentAnswer?: string; style = {{ fontFamily: '"Playfair Display", serif' }}

onAnswerChange ?: (answer: string) => void;                        >

    onEdit ?: (field: string, value: any) => void; { safeData.questionText }

isEditable ?: boolean;                        </p > egicQuestionStepProps {

    selectedBlockId ?: string; data: any;

    onBlockSelect ?: (blockId: string) => void; currentAnswer ?: string;

    onOpenProperties ?: (blockId: string) => void; onAnswerChange ?: (answer: string) => void;

} onEdit ?: (field: string, value: any) => void;

isEditable ?: boolean;

/**    selectedBlockId ?: string;

 * 🎯 STRATEGIC QUESTION STEP MODULARIZADO    onBlockSelect ?: (blockId: string) => void;

 *     onOpenProperties ?: (blockId: string) => void;

 * Cada seção é um bloco editável independente:}

 * - Barra de progresso

 * - Número da pergunta/**

 * - Texto da pergunta * 🎯 STRATEGIC QUESTION STEP MODULARIZADO

 * - Grid de opções * 

 * - Botão de ação * Cada seção é um bloco editável independente:

 */ * - Barra de progresso

export default function ModularStrategicQuestionStep({ * - Número da pergunta

data, * - Texto da pergunta

currentAnswer, * - Grid de opções

onAnswerChange, * - Botão de ação

onEdit, */

isEditable = false,export default function ModularStrategicQuestionStep({

    selectedBlockId, data,

    onBlockSelect, currentAnswer = '',

    onOpenProperties    onAnswerChange,

}: ModularStrategicQuestionStepProps) {
    onEdit,

    isEditable = false,

    const safeData = {
        selectedBlockId,

        questionNumber: data.questionNumber || 'Pergunta Estratégica 1', onBlockSelect,

        questionText: data.questionText || 'Qual é a sua situação atual?', onOpenProperties

        options: data.options || [}: ModularStrategicQuestionStepProps) {

            { text: 'Iniciante no assunto', value: 'iniciante' },

    { text: 'Tenho conhecimento básico', value: 'basico' }, const safeData = {

            { text: 'Tenho experiência intermediária', value: 'intermediario' }, questionNumber: data.questionNumber || 'Pergunta Estratégica',

        { text: 'Sou experiente', value: 'experiente' }        questionText: data.questionText || 'Qual é sua resposta?',

        ], options: data.options || [

        buttonText: data.buttonText || 'Próxima Pergunta', { id: 'opt1', text: 'Opção A' },

        progressPercentage: data.progressPercentage || 50            { id: 'opt2', text: 'Opção B' },

    }; { id: 'opt3', text: 'Opção C' }

        ]

const handleOptionSelect = (optionValue: string) => { };

if (onAnswerChange) {

    onAnswerChange(optionValue); const handleOptionClick = (optionId: string) => {

    }        if (onAnswerChange) {

    }; onAnswerChange(optionId);

}

return (    };

<div

    className="min-h-screen bg-gradient-to-br from-[#432818] via-[#8B4513] to-[#A0522D] text-white relative overflow-hidden"    // Block IDs

    style={{
        const progressBlockId = `${data.id}-progress`;

        background: 'linear-gradient(135deg, #432818 0%, #8B4513 50%, #A0522D 100%)'    const questionNumberBlockId = `${data.id}-question-number`;

    }} const questionTextBlockId= `${data.id}-question-text`;

        >    const optionsBlockId = `${data.id}-options`;

{/* Background Pattern */ } const buttonBlockId = `${data.id}-button`;

<div className="absolute inset-0 opacity-10">

    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>    const progress = Math.round((15 / 21) * 100);

    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>

</div>    return (

    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

        <div className="relative z-10 flex flex-col min-h-screen max-w-4xl mx-auto px-6 py-8">            {/* BLOCO 1: Barra de Progresso */}

            <SelectableBlock

                {/* BLOCO 1: Barra de Progresso */} blockId={progressBlockId}

                <SelectableBlock isSelected={selectedBlockId === progressBlockId}

                blockId="strategic-progress" isEditable={isEditable}

                isSelected={selectedBlockId === 'strategic-progress'} onSelect={onBlockSelect}

                onSelect={(blockId) => onBlockSelect?.(blockId)} blockType="Barra de Progresso"

                onOpenProperties={() => onOpenProperties?.('strategic-progress')} onOpenProperties={onOpenProperties}

                isEditable={isEditable} isDraggable={false}

            >            >

                <div className="mb-8">                <div className="mb-6 max-w-6xl mx-auto px-4 py-4">

                    <div className="w-full bg-black/20 rounded-full h-2 mb-2">                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">

                        <div                         <div

                                className="bg-gradient-to-r from-[#deac6d] to-[#B89B7A] h-2 rounded-full transition-all duration-500" className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"

                            style={{ width: `${safeData.progressPercentage}%` }} style={{ width: `${progress}%` }}

                        ></div>                        ></div>

                    </div>                    </div>

                    <p className="text-center text-sm text-[#deac6d]">                    <p className="text-sm text-center mb-4 text-gray-600">Progresso: {progress}%</p>

                        {safeData.progressPercentage}% Concluído                </div>

            </p>            </SelectableBlock>

    </div>

                </SelectableBlock >            <main className="w-full max-w-6xl mx-auto px-4">

                <div className="bg-white p-6 md:p-12 rounded-lg shadow-lg text-center max-w-4xl mx-auto">

                {/* BLOCO 2: Número da Pergunta */}                    {/* BLOCO 2: Número da Pergunta */}

                <SelectableBlock                    <SelectableBlock

                    blockId="strategic-question-number"                        blockId={questionNumberBlockId}

                    isSelected={selectedBlockId === 'strategic-question-number'}                        isSelected={selectedBlockId === questionNumberBlockId}

                    onSelect={(blockId) => onBlockSelect?.(blockId)}                        isEditable={isEditable}

                    onOpenProperties={() => onOpenProperties?.('strategic-question-number')}                        onSelect={onBlockSelect}

                    isEditable={isEditable}                        blockType="Número da Pergunta"

                >                        onOpenProperties={onOpenProperties}

                    <div className="text-center mb-6">                        isDraggable={true}

                        <span                     >

                            className="text-sm font-medium text-[#deac6d] tracking-wider uppercase"                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#432818]">

                            style={{ fontFamily: '"Playfair Display", serif' }}                            {safeData.questionNumber}

                        >                        </h2>

                            {safeData.questionNumber}                    </SelectableBlock>

                        </span>

                    </div>                    {/* BLOCO 3: Texto da Pergunta */}

                </SelectableBlock>                    <SelectableBlock

                        blockId={questionTextBlockId}

                {/* BLOCO 3: Texto da Pergunta */}                        isSelected={selectedBlockId === questionTextBlockId}

                <SelectableBlock                        isEditable={isEditable}

                    blockId="strategic-question-text"                        onSelect={onBlockSelect}

                    isSelected={selectedBlockId === 'strategic-question-text'}                        blockType="Texto da Pergunta"

                    onSelect={(blockId) => onBlockSelect?.(blockId)}                        onOpenProperties={onOpenProperties}

                    onOpenProperties={() => onOpenProperties?.('strategic-question-text')}                        isDraggable={true}

                    isEditable={isEditable}                    >

                >                        <p

                    <div className="text-center mb-12">                            className="text-xl md:text-2xl font-bold text-[#deac6d] mb-8"

                        <p                             style={{ fontFamily: '"Playfair Display", serif' }}

                            className="text-xl md:text-2xl font-bold text-[#deac6d] mb-8"                        >

                            style={{ fontFamily: '"Playfair Display", serif' }}                            {safeData.questionText}

                        >                        </p>

                            {safeData.questionText}                        {isEditable && (

                        </p>                            <p className="text-xs text-blue-500 mb-4">

                    </div>                                ✏️ Editável via Painel de Propriedades

                </SelectableBlock>                            </p >

                        )}

{/* BLOCO 4: Grid de Opções */ }                    </SelectableBlock >

                <SelectableBlock

                    blockId="strategic-options-grid"                    {/* BLOCO 4: Grid de Opções */}

                    isSelected={selectedBlockId === 'strategic-options-grid'}                    <SelectableBlock

                    onSelect={(blockId) => onBlockSelect?.(blockId)}                        blockId={optionsBlockId}

                    onOpenProperties={() => onOpenProperties?.('strategic-options-grid')}                        isSelected={selectedBlockId === optionsBlockId}

                    isEditable={isEditable}                        isEditable={isEditable}

                >                        onSelect={onBlockSelect}

                    <div className="flex-1 flex items-center justify-center mb-8">                        blockType="Opções de Resposta"

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">                        onOpenProperties={onOpenProperties}

                            {safeData.options.map((option: any, index: number) => (                        isDraggable={true}

                                <button                    >

                                    key={index}                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">

                                    onClick={() => handleOptionSelect(option.value)}                            {safeData.options.map((option: any) => (

                                    className={`                                <button

                                        p-6 rounded-xl border-2 transition-all duration-300 text-left                                    key={option.id}

                                        hover:scale-105 hover:shadow-lg                                    onClick={() => handleOptionClick(option.id)}

                                        ${currentAnswer === option.value                                    className={`p-4 border-2 rounded-lg transition-all duration-200 hover:border-[#deac6d] hover:shadow-md ${currentAnswer === option.id

                                            ? 'border-[#deac6d] bg-[#deac6d]/20 shadow-lg transform scale-105'                                        ? 'border-[#5b4135] bg-gradient-to-br from-white to-[#f8f5f0] shadow-lg'

                                            : 'border-white/30 bg-white/10 hover:border-[#deac6d]/70'                                        : 'border-gray-200'

                                        }                                        }`}

                                    `}                                >

                                >                                    <p className="font-medium text-sm text-[#432818]">

                                    <div className="flex items-center space-x-3">                                        {option.text}

                                        <div className={`                                    </p>

                                            w-4 h-4 rounded-full border-2 transition-all duration-300                                    {currentAnswer === option.id && (

                                            ${currentAnswer === option.value                                        <div className="mt-2 w-6 h-6 bg-[#deac6d] rounded-full flex items-center justify-center mx-auto">

                                                ? 'border-[#deac6d] bg-[#deac6d]'                                            <span className="text-white text-xs font-bold">✓</span>

                                                : 'border-white/50'                                        </div>

                                            }                                    )}

                                        `}>                                </button>

                                            {currentAnswer === option.value && (                            ))}

                                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>                        </div>

                                            )}                    </SelectableBlock>

                                        </div >

    <span className="text-white font-medium">                    {/* BLOCO 5: Botão de Ação */}

        {option.text}                    <SelectableBlock

                                        </span>                        blockId = { buttonBlockId }

                                    </div > isSelected={ selectedBlockId === buttonBlockId }

                                </button > isEditable={ isEditable }

                            ))}                        onSelect = { onBlockSelect }

                        </div > blockType="Botão de Ação"

                    </div > onOpenProperties={ onOpenProperties }

                </SelectableBlock > isDraggable={ true }

                    >

    {/* BLOCO 5: Botão de Ação */ } < button

    < SelectableBlock                            disabled = {!currentAnswer}

blockId = "strategic-action-button"                            className = {`font-bold py-3 px-6 rounded-full shadow-md transition-all ${currentAnswer

                    isSelected = { selectedBlockId === 'strategic-action-button'}                                ?'bg-[#deac6d] text-white hover:bg-[#c19a5d]'

onSelect = {(blockId) => onBlockSelect?.(blockId)}                                : 'bg-[#e6ddd4] text-[#8a7663] opacity-50 cursor-not-allowed'

onOpenProperties = {() => onOpenProperties?.('strategic-action-button')}                                }`}

                    isEditable={isEditable}                        >

                >                            {currentAnswer ? 'Próxima' : 'Selecione uma opção'}

                    <div className="text-center">                        </button>

                        <button                    </SelectableBlock>

                            className="bg-gradient-to-r from-[#deac6d] to-[#B89B7A] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"                </div>

                            disabled={!currentAnswer}            </main>

                        >        </div>

                            {safeData.buttonText}    );

                        </button>}
                    </div>
                </SelectableBlock>

            </div>
        </div>
    );
}