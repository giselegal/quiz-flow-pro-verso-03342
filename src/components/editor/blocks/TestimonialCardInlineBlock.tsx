import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Edit3, Star, Quote, CheckCircle } from 'lucide-react';
import React, { useMemo } from 'react';

/**
 * TestimonialCardInlineBlock - Card de depoimento de cliente
 * Componente com dados reais de clientes da Gisele Galvão
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

// Dados reais dos depoimentos
const REAL_TESTIMONIALS = {
    mariangela: {
        name: 'Mariangela Santos',
        role: 'Empresária',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        testimonial: 'A consultoria da Gisele transformou completamente minha relação com a moda. Descobri cores que nunca imaginei que ficavam bem em mim e aprendi a me vestir de acordo com meu tipo físico. Me sinto muito mais confiante e elegante!',
        result: 'Descobriu seu estilo clássico-elegante',
        beforeAfter: 'Passou de insegura com as roupas para referência de elegância no trabalho',
        location: 'São Paulo, SP',
        date: 'Março 2024'
    },
    sonia: {
        name: 'Sonia Spier',
        role: 'Advogada',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        testimonial: 'Trabalhar com a Gisele foi uma experiência incrível. Ela tem um olhar muito apurado e me ajudou a criar um guarda-roupa funcional e sofisticado. Agora sei exatamente o que comprar e como combinar as peças.',
        result: 'Criou um guarda-roupa cápsula perfeito',
        beforeAfter: 'Organizou completamente seu closet e descobriu seu estilo pessoal',
        location: 'Rio de Janeiro, RJ',
        date: 'Janeiro 2024'
    }
};

// Função para converter valores de margem em classes Tailwind
const getMarginClass = (value: number | string, type: 'top' | 'bottom' | 'left' | 'right'): string => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(numValue) || numValue === 0) return '';

    const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

    if (numValue <= 4) return `${prefix}-1`;
    if (numValue <= 8) return `${prefix}-2`;
    if (numValue <= 12) return `${prefix}-3`;
    if (numValue <= 16) return `${prefix}-4`;
    if (numValue <= 20) return `${prefix}-5`;
    if (numValue <= 24) return `${prefix}-6`;
    if (numValue <= 32) return `${prefix}-8`;
    if (numValue <= 40) return `${prefix}-10`;
    return `${prefix}-12`;
};

const TestimonialCardInlineBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    isPreviewing = false,
    onClick,
    className = '',
}) => {
    const {
        // Seleção do depoimento
        testimonialType = 'mariangela', // mariangela, sonia, custom

        // Dados customizáveis (sobrescrevem os padrões se testimonialType = 'custom')
        clientName = '',
        clientRole = '',
        clientImage = '',
        clientTestimonial = '',
        clientResult = '',
        clientLocation = '',
        testimonialDate = '',
        rating = 5,

        // Layout e estilo
        cardStyle = 'elegant', // elegant, modern, minimal, luxury
        showPhoto = true,
        showRating = true,
        showResult = true,
        showLocation = true,
        showDate = true,

        // Cores
        backgroundColor = '#FFFFFF',
        textColor = '#432818',
        accentColor = '#B89B7A',
        borderColor = '#E5DDD5',

        // Estilo do card
        borderRadius = 'large',
        shadowIntensity = 'medium',

        // Sistema de margens
        marginTop = 8,
        marginBottom = 8,
        marginLeft = 0,
        marginRight = 0,
    } = block?.properties || {};

    // Obter dados do depoimento
    const testimonialData = useMemo(() => {
        if (testimonialType === 'custom') {
            return {
                name: clientName || 'Cliente Satisfeita',
                role: clientRole || 'Cliente',
                image: clientImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
                testimonial: clientTestimonial || 'Excelente trabalho!',
                result: clientResult || 'Resultado transformador',
                location: clientLocation || 'Brasil',
                date: testimonialDate || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                rating: rating,
            };
        }
        return REAL_TESTIMONIALS[testimonialType as keyof typeof REAL_TESTIMONIALS] || REAL_TESTIMONIALS.mariangela;
    }, [testimonialType, clientName, clientRole, clientImage, clientTestimonial, clientResult, clientLocation, testimonialDate, rating]);

    // Card style classes
    const cardStyleClasses = {
        elegant: 'border-2',
        modern: 'border-0 shadow-md',
        minimal: 'border border-gray-200',
        luxury: 'border-2 bg-gradient-to-br from-white to-gray-50',
    };

    // Border radius classes
    const borderRadiusClasses = {
        none: 'rounded-none',
        small: 'rounded-lg',
        medium: 'rounded-xl',
        large: 'rounded-2xl',
    };

    // Shadow classes
    const shadowClasses = {
        none: '',
        small: 'shadow-sm',
        medium: 'shadow-md',
        large: 'shadow-lg',
        xl: 'shadow-xl',
    };

    // Memoized container classes
    const containerClasses = useMemo(() => cn(
        'relative group p-6 transition-all duration-300',
        !isPreviewing && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        isPreviewing && 'cursor-default',
        cardStyleClasses[cardStyle as keyof typeof cardStyleClasses],
        borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses],
        shadowClasses[shadowIntensity as keyof typeof shadowClasses],
        isSelected && 'ring-2 ring-[#B89B7A] ring-opacity-50',
        className,
        // Margens universais
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
    ), [cardStyle, borderRadius, shadowIntensity, isSelected, isPreviewing, className, marginTop, marginBottom, marginLeft, marginRight]);

    return (
        <div
            className={containerClasses}
            style={{
                backgroundColor,
                borderColor: cardStyle === 'elegant' || cardStyle === 'luxury' ? borderColor : undefined
            }}
            onClick={onClick}
        >
            {/* Header com foto e dados */}
            <div className="flex items-start gap-4 mb-4">
                {showPhoto && (
                    <div className="flex-shrink-0">
                        <img
                            src={testimonialData.image}
                            alt={testimonialData.name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md"
                        />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h4
                        className="font-bold text-lg truncate"
                        style={{ color: textColor }}
                    >
                        {testimonialData.name}
                    </h4>
                    <p
                        className="text-sm font-medium"
                        style={{ color: accentColor }}
                    >
                        {testimonialData.role}
                    </p>

                    {showLocation && (
                        <p
                            className="text-xs mt-1"
                            style={{ color: `${textColor}80` }}
                        >
                            {testimonialData.location}
                        </p>
                    )}
                </div>

                {/* Rating */}
                {showRating && (
                    <div className="flex items-center gap-1">
                        {Array.from({ length: testimonialData.rating }).map((_, i) => (
                            <Star
                                key={i}
                                className="w-4 h-4 fill-current"
                                style={{ color: accentColor }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Depoimento */}
            <div className="relative mb-4">
                <Quote
                    className="absolute -top-2 -left-2 w-6 h-6 opacity-20"
                    style={{ color: accentColor }}
                />
                <p
                    className="text-base leading-relaxed italic pl-4"
                    style={{ color: textColor }}
                >
                    "{testimonialData.testimonial}"
                </p>
            </div>

            {/* Resultado */}
            {showResult && testimonialData.result && (
                <div
                    className="p-3 rounded-lg mb-4"
                    style={{ backgroundColor: `${accentColor}10` }}
                >
                    <div className="flex items-start gap-2">
                        <CheckCircle
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                            style={{ color: accentColor }}
                        />
                        <div>
                            <p
                                className="text-sm font-semibold mb-1"
                                style={{ color: textColor }}
                            >
                                Resultado:
                            </p>
                            <p
                                className="text-sm"
                                style={{ color: textColor }}
                            >
                                {testimonialData.result}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Data */}
            {showDate && (
                <div className="text-right">
                    <p
                        className="text-xs"
                        style={{ color: `${textColor}60` }}
                    >
                        {testimonialData.date}
                    </p>
                </div>
            )}

            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#B89B7A] text-white rounded-full p-1">
                    <Edit3 className="w-3 h-3" />
                </div>
            )}
        </div>
    );
};

export default React.memo(TestimonialCardInlineBlock);