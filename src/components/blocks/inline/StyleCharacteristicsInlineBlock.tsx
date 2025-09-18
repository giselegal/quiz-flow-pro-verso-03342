// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StyleCharacteristicsInlineBlock = ({
  block,
  isSelected = false,
  onClick = () => {},
  onPropertyChange = () => {},
  disabled = false,
  className = '',
}) => {
  const {
    title = 'Características do Seu Estilo',
    description = 'Veja o que define o seu perfil único',
    characteristics = [],
    showDescription = true,
    backgroundColor = 'bg-background',
    titleColor = 'text-foreground',
    descriptionColor = 'text-muted-foreground',
    borderRadius = 'rounded-lg',
    padding = 'p-6',
    spacing = 'space-y-4',
    badgeVariant = 'secondary',
  } = block?.properties || {};

  const defaultCharacteristics = [
    { label: 'Elegante', score: 85 },
    { label: 'Sofisticado', score: 78 },
    { label: 'Moderno', score: 92 },
    { label: 'Minimalista', score: 67 },
  ];

  const displayCharacteristics =
    characteristics?.length > 0 ? characteristics : defaultCharacteristics;

  return (
    <div
      className={`${className} ${backgroundColor} ${borderRadius} ${padding} ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="p-0 pb-4">
          <CardTitle className={`${titleColor} text-xl font-semibold`}>{title}</CardTitle>
          {showDescription && (
            <CardDescription className={`${descriptionColor}`}>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className={`p-0 ${spacing}`}>
          <div className="grid grid-cols-2 gap-3">
            {displayCharacteristics.map((characteristic, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <Badge variant={badgeVariant} className="text-sm">
                  {characteristic.label}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">
                  {characteristic.score}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleCharacteristicsInlineBlock;
