import React from 'react';
import { Badge as AntBadge, Tag } from 'antd';
import type { BadgeProps as AntBadgeProps, TagProps } from 'antd';
import { difficultyColors, statusColors, quizCategoryColors } from '../config/antd-theme';

export interface BadgeProps extends Omit<AntBadgeProps, 'color'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
}

export interface StatusBadgeProps {
  status: 'published' | 'draft' | 'archived' | 'public' | 'private';
  size?: 'small' | 'medium' | 'large';
}

export interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  size?: 'small' | 'medium' | 'large';
}

export interface CategoryBadgeProps {
  category: keyof typeof quizCategoryColors;
  size?: 'small' | 'medium' | 'large';
}

// Badge padrão
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  const getColor = (variant: BadgeProps['variant']) => {
    switch (variant) {
      case 'primary':
        return '#1890ff';
      case 'secondary':
        return '#8c8c8c';
      case 'success':
        return '#52c41a';
      case 'warning':
        return '#faad14';
      case 'danger':
        return '#ff4d4f';
      case 'info':
        return '#1890ff';
      default:
        return '#1890ff';
    }
  };

  return (
    <AntBadge
      color={getColor(variant)}
      {...props}
    >
      {children}
    </AntBadge>
  );
};

// Badge de Status
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium'
}) => {
  const getStatusText = (status: StatusBadgeProps['status']) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      case 'public':
        return 'Público';
      case 'private':
        return 'Privado';
      default:
        return status;
    }
  };

  const tagSize = size === 'small' ? 'small' : 'default';

  return (
    <Tag 
      color={statusColors[status]}
      size={tagSize}
      className="font-medium"
    >
      {getStatusText(status)}
    </Tag>
  );
};

// Badge de Dificuldade
export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'medium'
}) => {
  const getDifficultyText = (difficulty: DifficultyBadgeProps['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  const getDifficultyIcon = (difficulty: DifficultyBadgeProps['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '⭐';
      case 'medium':
        return '⭐⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return '';
    }
  };

  const tagSize = size === 'small' ? 'small' : 'default';

  return (
    <Tag 
      color={difficultyColors[difficulty]}
      size={tagSize}
      className="font-medium flex items-center gap-1"
    >
      <span>{getDifficultyIcon(difficulty)}</span>
      {getDifficultyText(difficulty)}
    </Tag>
  );
};

// Badge de Categoria
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'medium'
}) => {
  const getCategoryText = (category: CategoryBadgeProps['category']) => {
    switch (category) {
      case 'geral':
        return 'Geral';
      case 'educacao':
        return 'Educação';
      case 'entretenimento':
        return 'Entretenimento';
      case 'business':
        return 'Negócios';
      case 'tecnologia':
        return 'Tecnologia';
      case 'saude':
        return 'Saúde';
      case 'esportes':
        return 'Esportes';
      case 'historia':
        return 'História';
      case 'ciencia':
        return 'Ciência';
      case 'arte':
        return 'Arte';
      default:
        return category;
    }
  };

  const tagSize = size === 'small' ? 'small' : 'default';

  return (
    <Tag 
      color={quizCategoryColors[category]}
      size={tagSize}
      className="font-medium"
    >
      {getCategoryText(category)}
    </Tag>
  );
};

// Badge customizado para contadores
export const CountBadge: React.FC<{
  count: number;
  maxCount?: number;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ count, maxCount = 99, color = '#ff4d4f', size = 'medium' }) => {
  return (
    <AntBadge
      count={count}
      overflowCount={maxCount}
      style={{ 
        backgroundColor: color,
        fontSize: size === 'small' ? '10px' : size === 'large' ? '14px' : '12px'
      }}
    />
  );
};

// Badge de dot/ponto
export const DotBadge: React.FC<{
  color?: string;
  children: React.ReactNode;
}> = ({ color = '#ff4d4f', children }) => {
  return (
    <AntBadge dot color={color}>
      {children}
    </AntBadge>
  );
};

export default Badge;
