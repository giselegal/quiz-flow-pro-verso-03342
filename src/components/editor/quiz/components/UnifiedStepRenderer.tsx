/**
 * 🎯 UnifiedStepRenderer (delegador)
 * Agora delega para renderizadores específicos por modo, reduzindo re-renderizações
 * e facilitando manutenção/testes.
 */
import React, { memo } from 'react';
import type { EditableQuizStep } from '../types';
import EditModeRenderer from '@/components/editor/renderers/EditModeRenderer';
import PreviewModeRenderer from '@/components/editor/renderers/PreviewModeRenderer';

export interface UnifiedStepRendererProps {
  step: EditableQuizStep;
  mode: 'edit' | 'preview';
  // Edição
  isSelected?: boolean;
  onStepClick?: (e: React.MouseEvent, step: EditableQuizStep) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  productionParityInEdit?: boolean;
  autoAdvanceInEdit?: boolean;
  // Preview
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
}

const UnifiedStepRendererComponent: React.FC<UnifiedStepRendererProps> = (props) => {
  const { mode, step } = props;
  if (mode === 'edit') {
    const { isSelected, onStepClick, onDelete, onDuplicate, productionParityInEdit, autoAdvanceInEdit, sessionData, onUpdateSessionData } = props;
    return (
      <EditModeRenderer
        step={step}
        isSelected={isSelected}
        onStepClick={onStepClick}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        productionParityInEdit={productionParityInEdit}
        autoAdvanceInEdit={autoAdvanceInEdit}
        sessionData={sessionData}
        onUpdateSessionData={onUpdateSessionData}
      />
    );
  }
  return (
    <PreviewModeRenderer
      step={step}
      sessionData={props.sessionData}
      onUpdateSessionData={props.onUpdateSessionData}
    />
  );
};

export const UnifiedStepRenderer = memo(UnifiedStepRendererComponent);
export default UnifiedStepRenderer;
