import React from 'react';
import { cn } from '@/lib/utils';
import { Trophy, Star, Heart, Award } from 'lucide-react';
import { useQuizData } from '../QuizDataProvider';
import type { BaseModuleProps } from '../../types';

export interface ResultHeaderModuleProps extends BaseModuleProps {
  // Conteúdo
  showCelebration?: boolean;
  congratsMessage?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  
  // Ícone comemorativo
  celebrationIcon?: 'trophy' | 'star' | 'heart' | 'award' | 'none';
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  
  // Layout
  alignment?: 'left' | 'center' | 'right';
  spacing?: 'sm' | 'md' | 'lg';
  
  // Estilo
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  borderRadius?: string;
  padding?: string;
}

const iconMap = {
  trophy: Trophy,
  star: Star, 
  heart: Heart,
  award: Award
};

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const spacingMap = {
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6'
};

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};

const ResultHeaderModule: React.FC<ResultHeaderModuleProps> = ({
  showCelebration = true,
  congratsMessage = 'Parabéns! Descobrimos seu Estilo Pessoal',
  subtitle = 'Seu resultado personalizado está pronto',
  showSubtitle = true,
  celebrationIcon = 'trophy',
  iconSize = 'lg',
  showIcon = true,
  alignment = 'center',
  spacing = 'md',
  backgroundColor = 'transparent',
  textColor = '#432818',
  iconColor = '#B89B7A',
  borderRadius = '0px',
  padding = '16px',
  className = '',
  isSelected = false
}) => {
  const { userName, isLoading } = useQuizData();
  
  const IconComponent = celebrationIcon !== 'none' ? iconMap[celebrationIcon as keyof typeof iconMap] : null;

  if (isLoading) {
    return (
      <div className={cn('animate-pulse', spacingMap[spacing], alignmentMap[alignment], className)}>
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        {showSubtitle && <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'w-full transition-all duration-200',
        spacingMap[spacing],
        alignmentMap[alignment],
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      style={{ 
        backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
        borderRadius,
        padding
      }}
    >
      {/* Ícone comemorativo */}
      {showIcon && showCelebration && IconComponent && (
        <div className={cn('flex', alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start')}>
          <IconComponent 
            className={cn(sizeMap[iconSize])} 
            style={{ color: iconColor }}
          />
        </div>
      )}
      
      {/* Mensagem de parabéns */}
      {showCelebration && (
        <div>
          <h1 
            className="text-3xl md:text-4xl font-bold"
            style={{ color: textColor }}
          >
            {congratsMessage.replace('{userName}', userName)}
          </h1>
          
          {showSubtitle && subtitle && (
            <p 
              className="text-lg md:text-xl opacity-80 mt-2"
              style={{ color: textColor }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Configurações para o editor de propriedades
(ResultHeaderModule as any).craft = {
  displayName: 'Header do Resultado',
  props: {
    showCelebration: true,
    congratsMessage: 'Parabéns! Descobrimos seu Estilo Pessoal',
    subtitle: 'Seu resultado personalizado está pronto',
    showSubtitle: true,
    celebrationIcon: 'trophy',
    iconSize: 'lg',
    showIcon: true,
    alignment: 'center',
    spacing: 'md',
    backgroundColor: 'transparent',
    textColor: '#432818',
    iconColor: '#B89B7A',
    borderRadius: '0px',
    padding: '16px'
  }
};

export default ResultHeaderModule;