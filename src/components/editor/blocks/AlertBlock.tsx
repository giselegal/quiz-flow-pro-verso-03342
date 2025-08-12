// @ts-nocheck
import { InlineEditableText } from './InlineEditableText';
import { TriangleAlert, CheckCircle, Info, XCircle } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

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

const AlertBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = 'Atenção!',
    message = 'Esta é uma mensagem importante.',
    variant = 'info',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const variantClasses: Record<string, string> = {
    info: 'bg-[#B89B7A]/10 border-[#B89B7A]/30 text-[#432818]',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-stone-50 border-yellow-200 text-stone-700',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconMap: Record<string, React.ReactNode> = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <TriangleAlert className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  return (
    <div
      className={`
        p-4 rounded-lg border flex items-start gap-3 cursor-pointer transition-all duration-200
        ${variantClasses[variant || 'info']}
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-md'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="flex-shrink-0 mt-0.5">{iconMap[variant || 'info']}</div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1">
          <InlineEditableText
            value={title}
            onChange={(value: string) => handlePropertyChange('title', value)}
            className="inline-block"
            placeholder="Título do Alerta"
          />
        </h4>
        <div className="text-sm">
          <InlineEditableText
            value={message}
            onChange={(value: string) => handlePropertyChange('message', value)}
            className="inline-block w-full"
            placeholder="Mensagem do alerta"
          />
        </div>
      </div>
    </div>
  );
};

export default AlertBlock;
