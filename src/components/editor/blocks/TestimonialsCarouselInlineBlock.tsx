import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Edit3, Star, Quote, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';

/**
 * TestimonialsCarouselInlineBlock - Carrossel de depoimentos
 * Componente com múltiplos depoimentos de clientes reais da Gisele Galvão
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */

// Dados reais dos depoimentos expandidos
const TESTIMONIALS_DATABASE = [
    {
        id: 'mariangela',
        name: 'Mariangela Santos',
        role: 'Empresária',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        testimonial: 'A consultoria da Gisele transformou completamente minha relação com a moda. Descobri cores que nunca imaginei que ficavam bem em mim e aprendi a me vestir de acordo com meu tipo físico. Me sinto muito mais confiante e elegante!',
        result: 'Descobriu seu estilo clássico-elegante',
        transformation: 'Passou de insegura com as roupas para referência de elegância no trabalho',
        location: 'São Paulo, SP',
        date: 'Março 2024',
        category: 'Estilo Profissional'
    },
    {
        id: 'sonia',
        name: 'Sonia Spier',
        role: 'Advogada',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        testimonial: 'Trabalhar com a Gisele foi uma experiência incrível. Ela tem um olhar muito apurado e me ajudou a criar um guarda-roupa funcional e sofisticado. Agora sei exatamente o que comprar e como combinar as peças.',
        result: 'Criou um guarda-roupa cápsula perfeito',
        transformation: 'Organizou completamente seu closet e descobriu seu estilo pessoal',
        location: 'Rio de Janeiro, RJ',
        date: 'Janeiro 2024',
        category: 'Guarda-roupa Cápsula'
    },
    {
        id: 'ana',
        name: 'Ana Carolina Mendes',
        role: 'Médica',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        testimonial: 'Estava perdida depois da maternidade, não sabia mais como me vestir. A Gisele me ajudou a redescobrir minha feminilidade e criar looks práticos mas elegantes para o dia a dia com meu bebê.',
        result: 'Redescobriu sua feminilidade pós-maternidade',
        transformation: 'De mãe perdida para mulher confiante e estilosa',
        location: 'Belo Horizonte, MG',
        date: 'Fevereiro 2024',
        category: 'Estilo Pós-Maternidade'
    },
    {
        id: 'patricia',
        name: 'Patrícia Lima',
        role: 'Executiva de Marketing',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        rating: 5,
        testimonial: 'A consultoria de coloração pessoal mudou minha vida! Descobri que estava usando cores completamente erradas há anos. Agora recebo elogios todos os dias e me sinto radiante.',
        result: 'Descobriu sua cartela de cores perfeita',
        transformation: 'Aparência renovada com as cores certas',
        location: 'Brasília, DF',
        date: 'Abril 2024',
        category: 'Coloração Pessoal'
    }
];

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

const TestimonialsCarouselInlineBlock: React.FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    isPreviewing = false,
    onClick,
    onPropertyChange,
    className = '',
}) => {
    const {
        // Configurações do carrossel
        showNavigationArrows = true,
        showDots = true,
        autoPlay = false,
        autoPlayInterval = 5000,

        // Layout
        layout = 'cards', // cards, list, grid
        itemsPerView = 1, // 1, 2, 3
        showAllAtOnce = false,

        // Conteúdo
        title = 'O que nossas clientes dizem',
        subtitle = 'Transformações reais de mulheres que descobriram seu estilo',
        showHeader = true,
        selectedTestimonials = ['mariangela', 'sonia', 'ana', 'patricia'], // IDs dos depoimentos a mostrar

        // Visual
        backgroundColor = '#FAF9F7',
        textColor = '#432818',
        accentColor = '#B89B7A',
        cardBackgroundColor = '#FFFFFF',
        borderRadius = 'large',

        // Sistema de margens
        marginTop = 16,
        marginBottom = 16,
        marginLeft = 0,
        marginRight = 0,
    } = block?.properties || {};

    const [currentIndex, setCurrentIndex] = useState(0);

    // Filtrar depoimentos selecionados
    const activeTestimonials = useMemo(() => {
        return TESTIMONIALS_DATABASE.filter(testimonial =>
            selectedTestimonials.includes(testimonial.id)
        );
    }, [selectedTestimonials]);

    // Navegação do carrossel
    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) =>
            prev + itemsPerView >= activeTestimonials.length ? 0 : prev + itemsPerView
        );
    }, [itemsPerView, activeTestimonials.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(0, activeTestimonials.length - itemsPerView) : prev - itemsPerView
        );
    }, [itemsPerView, activeTestimonials.length]);

    // Auto play
    React.useEffect(() => {
        if (autoPlay && !isSelected) {
            const interval = setInterval(nextSlide, autoPlayInterval);
            return () => clearInterval(interval);
        }
    }, [autoPlay, autoPlayInterval, nextSlide, isSelected]);

    // Layout classes
    const layoutClasses = {
        cards: 'space-y-6',
        list: 'space-y-4',
        grid: 'grid gap-6',
    };

    // Border radius classes
    const borderRadiusClasses = {
        none: 'rounded-none',
        small: 'rounded-lg',
        medium: 'rounded-xl',
        large: 'rounded-2xl',
    };

    // Memoized container classes
    const containerClasses = useMemo(() => cn(
        'relative group p-6 md:p-8',
        'border border-transparent transition-all duration-200',
        !isPreviewing && 'hover:border-gray-200 cursor-pointer',
        isPreviewing && 'cursor-default',
        isSelected && 'border-[#B89B7A] bg-[#B89B7A]/10',
        borderRadiusClasses[borderRadius as keyof typeof borderRadiusClasses],
        className,
        // Margens universais
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
    ), [isSelected, isPreviewing, className, borderRadius, marginTop, marginBottom, marginLeft, marginRight]);

    // Calcular depoimentos visíveis
    const visibleTestimonials = useMemo(() => {
        if (showAllAtOnce) {
            return activeTestimonials;
        }
        return activeTestimonials.slice(currentIndex, currentIndex + itemsPerView);
    }, [activeTestimonials, currentIndex, itemsPerView, showAllAtOnce]);

    const renderTestimonial = (testimonial: typeof TESTIMONIALS_DATABASE[0], index: number) => (
        <div
            key={testimonial.id}
            className="p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: cardBackgroundColor }}
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                    <h4
                        className="font-bold text-lg"
                        style={{ color: textColor }}
                    >
                        {testimonial.name}
                    </h4>
                    <p
                        className="font-medium text-sm"
                        style={{ color: accentColor }}
                    >
                        {testimonial.role}
                    </p>
                    <p
                        className="text-xs mt-1 opacity-70"
                        style={{ color: textColor }}
                    >
                        {testimonial.location}
                    </p>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                            key={i}
                            className="w-4 h-4 fill-current"
                            style={{ color: accentColor }}
                        />
                    ))}
                </div>
            </div>

            {/* Depoimento */}
            <div className="relative mb-4">
                <Quote
                    className="absolute -top-2 -left-2 w-8 h-8 opacity-10"
                    style={{ color: accentColor }}
                />
                <p
                    className="text-base leading-relaxed italic pl-6"
                    style={{ color: textColor }}
                >
                    "{testimonial.testimonial}"
                </p>
            </div>

            {/* Resultado */}
            <div
                className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: `${accentColor}10` }}
            >
                <p
                    className="font-semibold mb-1"
                    style={{ color: textColor }}
                >
                    Resultado: {testimonial.result}
                </p>
                <p
                    className="text-xs opacity-80"
                    style={{ color: textColor }}
                >
                    {testimonial.date}
                </p>
            </div>
        </div>
    );

    return (
        <div
            className={containerClasses}
            style={{ backgroundColor }}
            onClick={onClick}
        >
            {/* Header */}
            {showHeader && (
                <div className="text-center mb-8">
                    <h3
                        className="text-2xl md:text-3xl font-bold mb-2"
                        style={{ color: textColor }}
                    >
                        {title}
                    </h3>
                    <p
                        className="text-lg opacity-80"
                        style={{ color: textColor }}
                    >
                        {subtitle}
                    </p>

                    {/* Estatística */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <Users
                            className="w-5 h-5"
                            style={{ color: accentColor }}
                        />
                        <span
                            className="font-semibold"
                            style={{ color: accentColor }}
                        >
                            Mais de 10.000+ clientes transformadas
                        </span>
                    </div>
                </div>
            )}

            {/* Carrossel */}
            <div className="relative">
                {/* Depoimentos */}
                <div className={cn(
                    layoutClasses[layout as keyof typeof layoutClasses],
                    layout === 'grid' && `grid-cols-1 md:grid-cols-${Math.min(itemsPerView, 2)} lg:grid-cols-${itemsPerView}`
                )}>
                    {visibleTestimonials.map((testimonial, index) =>
                        renderTestimonial(testimonial, index)
                    )}
                </div>

                {/* Navegação */}
                {showNavigationArrows && !showAllAtOnce && activeTestimonials.length > itemsPerView && (
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={prevSlide}
                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                            style={{ color: accentColor }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
                            style={{ color: accentColor }}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Dots */}
                {showDots && !showAllAtOnce && activeTestimonials.length > itemsPerView && (
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: Math.ceil(activeTestimonials.length / itemsPerView) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index * itemsPerView)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all',
                                    Math.floor(currentIndex / itemsPerView) === index
                                        ? 'w-8'
                                        : 'opacity-50 hover:opacity-75'
                                )}
                                style={{
                                    backgroundColor: accentColor
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#B89B7A] text-white rounded-full p-1">
                    <Edit3 className="w-3 h-3" />
                </div>
            )}
        </div>
    );
};

export default React.memo(TestimonialsCarouselInlineBlock);