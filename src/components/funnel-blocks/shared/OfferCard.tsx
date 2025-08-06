import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface OfferCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  installments?: {
    count: number;
    value: string;
  };
  features?: string[];
  buttonText?: string;
  buttonUrl?: string;
  onButtonClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  isHighlighted?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  showCountdown?: boolean;
  countdownHours?: number;
  rating?: number;
  reviewCount?: number;
}

/**
 * OfferCard - Card para exibição de ofertas
 *
 * Componente reutilizável para exibir ofertas e produtos,
 * com suporte para preços, descontos, features e contagem regressiva.
 */
export const OfferCard: React.FC<OfferCardProps> = ({
  title,
  description,
  imageUrl,
  price,
  originalPrice,
  discount,
  installments,
  features = [],
  buttonText = "Garantir agora",
  buttonUrl,
  onButtonClick,
  className = "",
  style,
  isHighlighted = false,
  showBadge = false,
  badgeText = "Mais Popular",
  showCountdown = false,
  countdownHours = 24,
  rating,
  reviewCount,
}) => {
  // Renderizar estrelas de avaliação
  const renderRating = () => {
    if (!rating) return null;

    const ratingValue = Math.min(5, Math.max(0, rating));

    return (
      <div className="flex items-center gap-1 mb-3">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Star
              key={index}
              className={cn(
                "w-4 h-4",
                index < ratingValue ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              )}
            />
          ))}
        {reviewCount && <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow duration-300 hover:shadow-lg",
        isHighlighted ? "border-2 border-primary shadow-md" : "border border-gray-200",
        className
      )}
      style={style}
    >
      {/* Badge condicional */}
      {showBadge && isHighlighted && (
        <div className="absolute top-0 right-0 bg-primary text-white py-1 px-3 text-xs font-semibold transform translate-x-4 -translate-y-0 rotate-45 origin-bottom-left">
          {badgeText}
        </div>
      )}

      {/* Imagem */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />

          {/* Desconto sobre imagem */}
          {discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white py-1 px-2 rounded text-xs font-bold">
              {discount}
            </div>
          )}
        </div>
      )}

      <CardHeader className={cn("relative", imageUrl ? "pt-4 pb-2" : "")}>
        {/* Título */}
        <h3 className={cn("font-bold", isHighlighted ? "text-xl" : "text-lg")}>{title}</h3>

        {/* Avaliação */}
        {renderRating()}
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Descrição */}
        {description && <p className="text-gray-700 text-sm">{description}</p>}

        {/* Preço */}
        {price && (
          <div className="space-y-1">
            {originalPrice && (
              <div className="text-sm text-gray-500 line-through">De R$ {originalPrice}</div>
            )}

            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-primary">R$ {price}</span>

              {installments && (
                <span className="text-xs text-gray-600">
                  ou {installments.count}x de R$ {installments.value}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <ul className="space-y-2 mt-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <div className="flex-shrink-0 mr-2 mt-1">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Contagem regressiva */}
        {showCountdown && (
          <div className="pt-2">
            <p className="text-xs text-center text-gray-500 mb-2">Esta oferta expira em:</p>
            <CountdownTimer hours={countdownHours} variant="compact" className="mx-auto" />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isHighlighted ? "default" : "outline"}
          asChild={!!buttonUrl}
          onClick={!buttonUrl ? onButtonClick : undefined}
          size="lg"
        >
          {buttonUrl ? <a href={buttonUrl}>{buttonText}</a> : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
