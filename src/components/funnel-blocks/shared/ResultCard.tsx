import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResultCardProps {
  title: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  features?: string[];
  buttonText?: string;
  buttonUrl?: string;
  onButtonClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  isHighlighted?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

/**
 * ResultCard - Card de exibição de resultado
 *
 * Componente reutilizável para exibir resultados de quiz,
 * com suporte para imagem, descrição, características e botão de ação.
 */
export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  category,
  description,
  imageUrl,
  features = [],
  buttonText = 'Ver detalhes',
  buttonUrl,
  onButtonClick,
  className = '',
  style,
  isHighlighted = false,
  showBadge = false,
  badgeText = 'Destaque',
}) => {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-shadow duration-300 hover:shadow-lg',
        isHighlighted ? 'border-2 border-primary shadow-md' : 'border border-gray-200',
        className
      )}
      style={style}
    >
      {/* Cabeçalho com imagem */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          {showBadge && (
            <Badge className="absolute top-2 right-2 bg-primary text-white" variant="default">
              {badgeText}
            </Badge>
          )}
          {category && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-center">
              {category}
            </div>
          )}
        </div>
      )}

      {/* Cabeçalho sem imagem */}
      {!imageUrl && (
        <CardHeader className="relative">
          {showBadge && (
            <Badge className="absolute top-2 right-2" variant="default">
              {badgeText}
            </Badge>
          )}
          {category && <div style={{ color: '#8B7355' }}>{category}</div>}
          <h3 className="text-lg font-bold">{title}</h3>
        </CardHeader>
      )}

      <CardContent className={imageUrl ? 'pt-4' : ''}>
        {imageUrl && <h3 className="text-lg font-bold mb-3">{title}</h3>}

        {description && <p style={{ color: '#6B4F43' }}>{description}</p>}

        {features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span style={{ color: '#6B4F43' }}>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isHighlighted ? 'default' : 'outline'}
          asChild={!!buttonUrl}
          onClick={!buttonUrl ? onButtonClick : undefined}
        >
          {buttonUrl ? <a href={buttonUrl}>{buttonText}</a> : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
