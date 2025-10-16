/**
 * 🏠 INTRO STEP - MODULAR VERSION
 * 
 * Refatorado para usar blocos atômicos modulares
 * Reduzido de 203 linhas para ~90 linhas (-55%)
 */

import React, { useState } from 'react';
import type { QuizStep } from '../../data/quizSteps';
import { BlockRenderer } from '@/components/editor/blocks/BlockRenderer';
import { INTRO_STEP_SCHEMA } from '@/data/stepBlockSchemas';

interface IntroStepProps {
    data: QuizStep;
    onNameSubmit?: (name: string) => void;
    mode?: 'edit' | 'preview';
}

export default function IntroStep({ 
    data, 
    onNameSubmit,
    mode = 'preview'
}: IntroStepProps) {
    const [nome, setNome] = useState('');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [blocks, setBlocks] = useState(INTRO_STEP_SCHEMA.blocks);

    // Fallback de dados
    const safeData = data || {
        type: 'intro',
        title: '<span style="color: #B89B7A;">Chega</span> de um guarda-roupa cheio e a sensação de <span style="color: #B89B7A;">não ter nada</span> para vestir!',
        formQuestion: 'Como posso te chamar?',
        placeholder: 'Digite seu primeiro nome',
        buttonText: 'Quero Descobrir meu Estilo Agora!',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview%20(10)-jSEJlJtUY9lO7BHo7r1f6Wv39CKSbg.png',
    };

    // Handlers para formulário
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!nome.trim()) return;

        if (typeof onNameSubmit === 'function') {
            try {
                onNameSubmit(nome.trim());
            } catch (err) {
                console.error('❌ [IntroStep] Erro ao executar onNameSubmit:', err);
            }
        }
    };

    // Context data para os blocos (alimenta placeholders dinâmicos)
    const contextData = {
        userName: nome,
        formQuestion: safeData.formQuestion,
        placeholder: safeData.placeholder,
        buttonText: safeData.buttonText,
        image: safeData.image,
        title: safeData.title
    };

    // Handlers para blocos (modo edit)
    const handleBlockUpdate = (blockId: string, updates: any) => {
        setBlocks(prev =>
            prev.map(b => b.id === blockId ? { ...b, props: { ...b.props, ...updates } } : b)
        );
    };

    const handleBlockReorder = (blockId: string, direction: 'up' | 'down') => {
        setBlocks(prev => {
            const index = prev.findIndex(b => b.id === blockId);
            if (index === -1) return prev;

            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const newBlocks = [...prev];
            [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];

            return newBlocks.map((b, i) => ({ ...b, order: i }));
        });
    };

    return (
        <main
            className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white to-gray-50 py-8"
            data-section="intro"
        >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg px-4 space-y-8 mx-auto">
                {blocks
                    .sort((a, b) => a.order - b.order)
                    .map(block => {
                        // Override de props específicas para blocos especiais
                        const blockProps = { ...block };

                        // Bloco de form: interceptar onChange
                        if (block.id === 'intro-form') {
                            blockProps.props = {
                                ...block.props,
                                value: nome,
                                onChange: (value: string) => setNome(value),
                                label: safeData.formQuestion,
                                placeholder: safeData.placeholder
                            };
                        }

                        // Bloco de botão: interceptar onClick e disabled
                        if (block.id === 'intro-button') {
                            blockProps.props = {
                                ...block.props,
                                text: safeData.buttonText,
                                onClick: handleSubmit,
                                disabled: !nome.trim()
                            };
                        }

                        // Bloco de headline: usar título do data
                        if (block.id === 'intro-headline') {
                            blockProps.props = {
                                ...block.props,
                                html: safeData.title
                            };
                        }

                        // Bloco de imagem: usar imagem do data
                        if (block.id === 'intro-image') {
                            blockProps.props = {
                                ...block.props,
                                src: safeData.image
                            };
                        }

                        return (
                            <BlockRenderer
                                key={block.id}
                                block={blockProps}
                                mode={mode}
                                isSelected={selectedBlockId === block.id}
                                onSelect={setSelectedBlockId}
                                onUpdate={handleBlockUpdate}
                                onDelete={(id) => setBlocks(prev => prev.filter(b => b.id !== id))}
                                onDuplicate={(id) => {
                                    const original = blocks.find(b => b.id === id);
                                    if (original) {
                                        const duplicate = {
                                            ...original,
                                            id: `${original.id}-copy-${Date.now()}`,
                                            order: original.order + 1
                                        };
                                        setBlocks(prev => [...prev, duplicate]);
                                    }
                                }}
                                onReorder={handleBlockReorder}
                                contextData={contextData}
                            />
                        );
                    })}
            </div>
        </main>
    );
}
