import React from 'react';
import UnifiedStepContent from './common/UnifiedStepContent';
import type { EditableQuizStep } from '@/components/editor/quiz/types';

export interface PreviewModeRendererProps {
    step: EditableQuizStep;
    sessionData?: Record<string, any>;
    onUpdateSessionData?: (key: string, value: any) => void;
}

const PreviewModeRenderer: React.FC<PreviewModeRendererProps> = ({
    step,
    sessionData = {},
    onUpdateSessionData,
}) => {
    return (
        <div data-step-id={step.id}>
            <UnifiedStepContent
                step={step}
                isEditMode={false}
                isPreviewMode
                sessionData={sessionData}
                onUpdateSessionData={onUpdateSessionData}
            />
        </div>
    );
};

export default React.memo(PreviewModeRenderer);
