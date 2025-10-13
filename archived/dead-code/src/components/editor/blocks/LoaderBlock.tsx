// @ts-nocheck
import { LoaderCircle, RotateCcw } from 'lucide-react';
import { InlineEditableText } from './InlineEditableText';
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

const LoaderBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const { message = 'Carregando...', type = 'spinning', duration = 4000 } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  let loaderContent: React.ReactNode;

  switch (type) {
    case 'elegant':
      loaderContent = (
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-[#B89B7A] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#6B5B73] rounded-full animate-ping"></div>
        </div>
      );
      break;
    case 'dots':
      loaderContent = (
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce-delay-1"></span>
          <span className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce-delay-2"></span>
          <span className="w-3 h-3 bg-[#B89B7A] rounded-full animate-bounce-delay-3"></span>
        </div>
      );
      break;
    case 'bars':
      loaderContent = (
        <div className="flex items-end h-16 space-x-1">
          <div className="w-2 bg-[#B89B7A] h-4 animate-scale-y-delay-1"></div>
          <div className="w-2 bg-[#B89B7A] h-8 animate-scale-y-delay-2"></div>
          <div className="w-2 bg-[#B89B7A] h-6 animate-scale-y-delay-3"></div>
          <div className="w-2 bg-[#B89B7A] h-10 animate-scale-y-delay-4"></div>
        </div>
      );
      break;
    case 'spinning':
    default:
      loaderContent = <RotateCcw className="h-10 w-10 animate-spin text-[#B89B7A]" />;
      break;
  }

  return (
    <div
      className={`
        py-12 text-center cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-1 ring-gray-400/40 bg-gray-50/30' : 'hover:shadow-sm'}
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="inline-flex flex-col items-center space-y-4">
        {loaderContent}
        <span className="text-[#432818] text-lg font-medium">
          <InlineEditableText
            value={message}
            onChange={(value: string) => handlePropertyChange('message', value)}
            className="inline-block"
            placeholder="Mensagem de carregamento"
          />
        </span>
        {duration && <div style={{ color: '#8B7355' }}>Duração: {duration / 1000}s</div>}
      </div>

      {/* Keyframes para as animações */}
      <style>{`
        @keyframes bounce-delay-1 { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } }
        @keyframes bounce-delay-2 { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-15px); } }
        @keyframes bounce-delay-3 { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-12px); } }
        .animate-bounce-delay-1 { animation: bounce-delay-1 1.4s infinite ease-in-out both; }
        .animate-bounce-delay-2 { animation: bounce-delay-2 1.4s infinite ease-in-out both; animation-delay: -0.32s; }
        .animate-bounce-delay-3 { animation: bounce-delay-3 1.4s infinite ease-in-out both; animation-delay: -0.16s; }

        @keyframes scale-y-delay-1 { 0%, 100% { transform: scaleY(0.4); } 20% { transform: scaleY(1); } }
        @keyframes scale-y-delay-2 { 0%, 100% { transform: scaleY(0.4); } 20% { transform: scaleY(1); } }
        @keyframes scale-y-delay-3 { 0%, 100% { transform: scaleY(0.4); } 20% { transform: scaleY(1); } }
        @keyframes scale-y-delay-4 { 0%, 100% { transform: scaleY(0.4); } 20% { transform: scaleY(1); } }
        .animate-scale-y-delay-1 { animation: scale-y-delay-1 1s infinite ease-in-out both; }
        .animate-scale-y-delay-2 { animation: scale-y-delay-2 1s infinite ease-in-out both; animation-delay: -0.8s; }
        .animate-scale-y-delay-3 { animation: scale-y-delay-3 1s infinite ease-in-out both; animation-delay: -0.6s; }
        .animate-scale-y-delay-4 { animation: scale-y-delay-4 1s infinite ease-in-out both; animation-delay: -0.4s; }
      `}</style>
    </div>
  );
};

export default LoaderBlock;
