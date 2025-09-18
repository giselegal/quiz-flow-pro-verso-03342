import React from 'react';
import { cn } from '@/lib/utils';
import { useQuizData } from './QuizDataProvider';
import type { BaseModuleProps } from '../types';

export interface UserGreetingModuleProps extends BaseModuleProps {
  greetingText?: string;
  showUserName?: boolean;
  showEmoji?: boolean;
  emoji?: string;
  textColor?: string;
  nameColor?: string;
  fontSize?: number;
}

const UserGreetingModule: React.FC<UserGreetingModuleProps> = ({
  greetingText = 'Parabéns',
  showUserName = true,
  showEmoji = true,
  emoji = '🎉',
  textColor = '#432818',
  nameColor = '#B89B7A',
  fontSize = 18,
  className = '',
  isSelected = false
}) => {
  const { userName, isLoading } = useQuizData();

  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 font-bold',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      style={{ fontSize: `${fontSize}px`, color: textColor }}
    >
      {showEmoji && <span className="text-2xl">{emoji}</span>}
      <span>{greetingText}</span>
      {showUserName && (
        <span style={{ color: nameColor }}>{userName}!</span>
      )}
    </div>
  );
};

export default UserGreetingModule;