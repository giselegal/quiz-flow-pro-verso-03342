/**
 * 🎁 OFFER BLOCK - Bloco de Oferta/CTA
 * 
 * Bloco para exibir ofertas, produtos, CTAs
 */

import React from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface OfferBlockProps {
    title?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    image?: string;
    buttonText?: string;
    buttonUrl?: string;
    badge?: string;
    highlight?: boolean;
}

export const OfferBlock: React.FC<BlockComponentProps> = ({
    data,
    isSelected,
    isEditable,
    onSelect,
}) => {
    const props = data.props as OfferBlockProps;

    const handleClick = () => {
        if (isEditable && onSelect) {
            onSelect(); // assinatura padronizada sem argumentos
        }
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEditable && props.buttonUrl) {
            // fallback simples: abrir em nova aba; integração futura pode injetar navegação
            window.open(props.buttonUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            data-block-id={data.id}
            onClick={handleClick}
            className={`
        relative p-6 rounded-xl transition-all
        border-2
        ${props.highlight ? 'border-primary bg-primary/5' : 'border-border'}
        ${isEditable ? 'cursor-pointer hover:bg-accent/10' : ''}
        ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm'}
      `}
        >
            {/* Indicador de seleção */}
            {isSelected && (
                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary rounded-full" />
            )}

            {/* Badge destaque */}
            {props.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {props.badge}
                    </Badge>
                </div>
            )}

            <div className="space-y-4">
                {/* Imagem */}
                {props.image && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                            src={props.image}
                            alt={props.title || 'Oferta'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect width="400" height="225" fill="%23f1f5f9"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>
                )}

                {/* Título */}
                {props.title && (
                    <h3 className="text-xl font-bold text-foreground">
                        {props.title}
                    </h3>
                )}

                {/* Descrição */}
                {props.description && (
                    <p className="text-sm text-muted-foreground">
                        {props.description}
                    </p>
                )}

                {/* Preços */}
                {props.price && (
                    <div className="flex items-baseline gap-2">
                        {props.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                                {props.originalPrice}
                            </span>
                        )}
                        <span className="text-2xl font-bold text-primary">
                            {props.price}
                        </span>
                    </div>
                )}

                {/* Botão de ação */}
                {props.buttonText && (
                    <Button
                        onClick={handleButtonClick}
                        disabled={isEditable}
                        size="lg"
                        className="w-full"
                    >
                        {props.buttonText}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OfferBlock;
