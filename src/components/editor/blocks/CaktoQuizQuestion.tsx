/**
 * TODO: MIGRAÇÃO EM ANDAMENTO (FASE 2) - CaktoQuizQuestion
 * - [x] Remove @ts-nocheck
 * - [x] Adiciona tipos adequados para as props
 * - [x] Integra logger utility
 * - [ ] Refina validações e tratamento de erros
 * - [ ] Otimiza performance se necessário
 */
import React from 'react';
import { EditableContent } from '@/types/editor';
import QuizQuestionBlock from '../quiz/QuizQuestionBlock';
import { appLogger } from '@/utils/logger';

interface CaktoQuizQuestionProps {
  id?: string;
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const CaktoQuizQuestion: React.FC<CaktoQuizQuestionProps> = (props) => {
  appLogger.debug('CaktoQuizQuestion: Renderizando componente wrapper para QuizQuestionBlock');
  const { id = 'default-quiz-question', onUpdate, ...restProps } = props;

  const handleUpdate = (_updateId: string, updates: any) => {
    if (onUpdate) {
      onUpdate(updates);
    }
  };

  return <QuizQuestionBlock id={id} onUpdate={handleUpdate} {...restProps} />;
};

export default CaktoQuizQuestion;
