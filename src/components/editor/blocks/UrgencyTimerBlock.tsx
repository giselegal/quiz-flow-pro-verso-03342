// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
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

const UrgencyTimerBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditing = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = '🚨 Oferta Limitada - Expira em:',
    duration = 15, // em minutos
    showExpiredMessage = true,
    expiredMessage = '⏰ Esta oferta especial expirou! Mas não se preocupe, ainda temos outras oportunidades para você.',
    timerColor = 'red',
  } = block?.properties || {};

  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isExpired, setIsExpired] = useState(false);

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const colorClasses = {
    red: 'bg-red-500 text-white',
    orange: 'bg-[#B89B7A]/100 text-white',
    yellow: 'bg-stone-500 text-black',
    green: 'bg-green-500 text-white',
  };

  return (
    <div
      className={`
        p-6 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'border-2 border-[#B89B7A] bg-[#B89B7A]/10'
            : 'border-2 border-dashed border-[#B89B7A]/40 hover:bg-[#FAF9F7]'
        }
        ${className}
      `}
      onClick={onClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <div className="text-center">
        {!isExpired ? (
          <>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock style={{ color: '#432818' }} />
              <InlineEditableText
                value={title}
                onChange={(value: string) => handlePropertyChange('title', value)}
                className="text-lg font-semibold text-[#432818]"
                placeholder="Título do timer de urgência"
              />
            </div>

            <div
              className={`${colorClasses[timerColor as keyof typeof colorClasses] || colorClasses.red} rounded-lg py-4 px-6 inline-block shadow-lg`}
            >
              <div className="text-3xl font-bold font-mono">{formatTime(timeLeft)}</div>
              <div className="text-sm mt-1 opacity-90">minutos restantes</div>
            </div>
          </>
        ) : (
          showExpiredMessage && (
            <div style={{ backgroundColor: '#E5DDD5' }}>
              <InlineEditableText
                value={expiredMessage}
                onChange={(value: string) => handlePropertyChange('expiredMessage', value)}
                style={{ color: '#6B4F43' }}
                placeholder="Mensagem quando o timer expira"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UrgencyTimerBlock;
