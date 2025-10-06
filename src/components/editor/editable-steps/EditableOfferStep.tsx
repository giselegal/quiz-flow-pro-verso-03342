/**
 * 🎁 EDITABLE OFFER STEP
 * 
 * Wrapper editável para o componente OfferStep de produção.
 * Permite edição de ofertas personalizadas com mock da lógica de compra.
 */

import React, { useMemo } from 'react';
import CompositeOfferStep, { CompositeOfferTestimonial } from '../modular/components/composite/CompositeOfferStep';
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
        'subtitle',
        'description',
        'userName',
        'resultStyle',
        'buttonText',
        'image',
        'testimonial',
        'price',
        'originalPrice',
        'benefits',
        'ctaText',
        'secureNote',
        'backgroundColor',
        'textColor',
        'accentColor'
    ];

    // 🎨 Handle property click usando callback da interface
    const handlePropertyClick = (propKey: string, element: HTMLElement) => {
        if (onPropertyClick) {
            onPropertyClick(propKey, element);
        }
    };

    // 🔧 Garantir estrutura mínima dos dados com offerMap padrão
    const safeData = useMemo(() => {
        interface OfferStepDataExtras {
            title?: string;
            subtitle?: string;
            description?: string;
            userName?: string;
            resultStyle?: string;
            buttonText?: string;
            image?: string;
            testimonial?: { quote?: string; author?: string };
            price?: string;
            originalPrice?: string;
            benefits?: string[];
            ctaText?: string;
            secureNote?: string;
            backgroundColor?: string;
            textColor?: string;
            accentColor?: string;
            showEditableHint?: boolean;
        }

        const stepData = data as OfferStepDataExtras;

        const fallbackTestimonial: CompositeOfferTestimonial = {
            quote: 'Economizei muito depois que aprendi a combinar minhas roupas com segurança.',
            author: 'Maria S.'
        };

        const testimonial: CompositeOfferTestimonial | undefined = stepData.testimonial && stepData.testimonial.quote && stepData.testimonial.author
            ? {
                quote: stepData.testimonial.quote,
                author: stepData.testimonial.author
            }
            : fallbackTestimonial;

        return {
            ...stepData,
            type: 'offer' as const,
            title: stepData.title || '{userName}, agora que você descobriu que é {resultStyle}...',
            subtitle: stepData.subtitle || 'Oferta Especial Para Você!',
            description: stepData.description || 'Receba o plano completo pensado para quem tem o estilo {resultStyle} e quer transformar o guarda-roupa com confiança.',
            userName: stepData.userName || 'Preview User',
            resultStyle: stepData.resultStyle || 'Clássico Elegante',
            buttonText: stepData.buttonText || 'Quero transformar meu estilo agora!',
            image: stepData.image,
            testimonial,
            price: stepData.price || '12x de R$ 97,00',
            originalPrice: stepData.originalPrice || 'De R$ 1.497,00',
            benefits: Array.isArray(stepData.benefits) && stepData.benefits.length > 0
                ? stepData.benefits
                : [
                    'Acesso imediato ao método completo',
                    'Plano de ação personalizado',
                    'Suporte exclusivo por 30 dias'
                ],
            ctaText: stepData.ctaText || 'Oferta por tempo limitado',
            secureNote: stepData.secureNote || 'Pagamento 100% seguro • Garantia de 7 dias',
            backgroundColor: stepData.backgroundColor || '#fffaf2',
            textColor: stepData.textColor || '#5b4135',
            accentColor: stepData.accentColor || '#deac6d',
            showEditableHint: stepData.showEditableHint ?? isEditable
        };
    }, [data, isEditable]);

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
            <CompositeOfferStep
                title={safeData.title}
                subtitle={safeData.subtitle}
                description={safeData.description}
                userName={safeData.userName}
                resultStyle={safeData.resultStyle}
                buttonText={safeData.buttonText}
                image={safeData.image}
                testimonial={safeData.testimonial}
                price={safeData.price}
                originalPrice={safeData.originalPrice}
                benefits={safeData.benefits}
                ctaText={safeData.ctaText}
                secureNote={safeData.secureNote}
                backgroundColor={safeData.backgroundColor}
                textColor={safeData.textColor}
                accentColor={safeData.accentColor}
                showEditableHint={safeData.showEditableHint}
            />

            {/* 🎮 Overlay informativo para editor */}
            {isEditable && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full opacity-80">
                        🎁 Oferta personalizada
                    </div>
                </div>
            )}
        </EditableBlockWrapper>
    );
};

export default EditableOfferStep;