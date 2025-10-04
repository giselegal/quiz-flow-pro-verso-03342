/**
 * 🎁 EDITABLE OFFER STEP
 * 
 * Wrapper editável para o componente OfferStep de produção.
 * Permite edição de ofertas personalizadas com mock da lógica de compra.
 */

import React, { useMemo } from 'react';
import OfferStep from '../../quiz/OfferStep';
import { EditableBlockWrapper } from './shared/EditableBlockWrapper';
import { EditableStepProps } from './shared/EditableStepProps';

export interface EditableOfferStepProps extends EditableStepProps {
    // Propriedades específicas podem ser adicionadas
}

const EditableOfferStep: React.FC<EditableOfferStepProps> = ({
    data,
    isEditable,
    isSelected,
    onUpdate,
    onSelect,
    onDuplicate,
    onDelete,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
    canDelete,
    blockId,
    onPropertyClick
}) => {

    // 🎭 Props editáveis específicas do OfferStep
    const editableProps = [
        'title',
        'text'
        // offerMap pode ser editável através de interface específica
    ];

    // 🎪 Mock userProfile para preview
    const mockUserProfile = useMemo(() => ({
        userName: 'Preview User',
        resultStyle: 'clássico'
    }), []);

    // 🎪 Mock offerKey - usar 'default' que deve existir no offerMap
    const mockOfferKey = 'default';

    // 🎨 Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };

    // 🔧 Garantir estrutura mínima dos dados com offerMap padrão
    const safeData = useMemo(() => ({
        ...data,
        type: 'offer' as const,
        title: data.title || 'Oferta Especial Para Você!',
        text: data.text || 'Baseado no seu perfil único, preparamos uma oferta personalizada.',
        offerMap: data.offerMap || {
            'default': {
                title: 'Consultoria de Estilo Personalizada',
                description: 'Descubra seu estilo único com nossa consultoria especializada. Inclui análise completa do seu perfil, guia de cores personalizado e dicas de combinações.',
                price: 'R$ 297',
                originalPrice: 'R$ 497',
                discount: '40% OFF',
                image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_400,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
                benefits: [
                    'Análise completa do seu estilo pessoal',
                    'Guia de cores personalizado',
                    'Dicas de combinações práticas',
                    'Suporte por 30 dias'
                ],
                buttonText: 'Quero Transformar Meu Estilo Agora!',
                testimonial: {
                    quote: 'Transformou completamente minha forma de me vestir!',
                    author: 'Maria S.'
                }
            },
            'premium': {
                title: 'Transformação Completa do Guarda-Roupa',
                description: 'Pacote completo para renovar seu estilo com acompanhamento personalizado.',
                price: 'R$ 897',
                originalPrice: 'R$ 1497',
                discount: '40% OFF',
                image: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_400,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
                benefits: [
                    'Consultoria de estilo completa',
                    'Personal shopper por 3 meses',
                    'Organização do guarda-roupa',
                    'Guia de compras personalizado'
                ],
                buttonText: 'Quero a Transformação Completa!',
                testimonial: {
                    quote: 'Melhor investimento que fiz para meu estilo!',
                    author: 'Ana L.'
                }
            }
        }
    }), [data]);

    return (
        <EditableBlockWrapper
            editableProps={editableProps}
            isEditable={isEditable}
            isSelected={isSelected}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onPropertyClick={handlePropertyClick}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            canDelete={canDelete}
            blockId={blockId}
            className="editable-offer-step"
        >
            {/* 🎯 Renderizar componente de produção com dados mock */}
            <OfferStep
                data={safeData}
                userProfile={mockUserProfile}
                offerKey={mockOfferKey}
            />

            {/* 🎮 Overlay informativo para editor */}
            {isEditable && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
                        🎁 Oferta: {mockOfferKey}
                    </div>
                </div>
            )}
        </EditableBlockWrapper>
    );
};

export default EditableOfferStep;