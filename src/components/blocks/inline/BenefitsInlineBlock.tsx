import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Check } from 'lucide-react';

interface Props extends BlockComponentProps {
  title?: string;
  benefits?: string[];
  iconColor?: string;
  titleColor?: string;
  textColor?: string;
  className?: string;
  [key: string]: any;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value: number | string | undefined, type: string): string => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (!numValue || isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const BenefitsInlineBlock: React.FC<Props> = ({
  title = 'Principais Benefícios',
  benefits = [
    'Resultados comprovados em até 7 dias',
    'Método validado por especialistas',
    'Suporte personalizado incluído',
  ],
  iconColor = '#432818',
  titleColor = '#432818',
  textColor = '#432818',
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full py-6',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      {...props}
    >
      <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: titleColor }}>
        {title}
      </h3>

      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
              style={{ backgroundColor: iconColor }}
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
            <span className="text-sm leading-relaxed" style={{ color: textColor }}>
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsInlineBlock;
