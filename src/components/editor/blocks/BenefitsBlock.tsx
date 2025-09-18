// @ts-nocheck
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface BenefitsBlockProps {
  title?: string;
  items?: string[];
  className?: string;
}

// Função universal de margens (consistente com outros blocks)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(numValue) || numValue === 0) return '';
  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';
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
    return `-${prefix}-10`;
  }
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
  return `${prefix}-32`;
};

const BenefitsBlock: React.FC<BenefitsBlockProps> = ({
  title = 'Você vai receber',
  items = [
    'Um método claro e aplicável no dia a dia',
    'Orientação estética com propósito',
    'Resultados consistentes na sua imagem',
  ],
  className,
}) => {
  return (
    <div
      className={cn(
        'py-8',
        className,
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
    >
      <div className="max-w-3xl mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-[#B89B7A] text-center mb-6">{title}</h3>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <span className="text-[#432818] text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BenefitsBlock;
