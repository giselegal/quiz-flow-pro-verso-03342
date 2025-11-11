/**
 * UnifiedStepRenderer - Adapter wrapper for ModularPreviewContainer
 * 
 * This component serves as an adapter between ModularPreviewContainer's expected interface
 * and the actual UnifiedStepContent component. It translates the 'mode' prop into
 * the isEditMode/isPreviewMode boolean flags that UnifiedStepContent expects.
 */

import React from 'react';
import { UnifiedStepContent } from '@/components/editor/renderers/common/UnifiedStepContent';
import type { EditableQuizStep } from '@/components/editor/quiz/types';

export interface UnifiedStepRendererProps {
    /** Step data to render */
    step: EditableQuizStep;
    
    /** Rendering mode: 'edit' or 'preview' */
    mode: 'edit' | 'preview';
    
    /** Session data for preview mode (userName, answers, etc.) */
    sessionData?: Record<string, any>;
    
    /** Callback for session data updates */
    onUpdateSessionData?: (key: string, value: any) => void;
    
    /** Replicate production behaviors in edit mode */
    productionParityInEdit?: boolean;
    
    /** Enable auto-advance in edit mode for QA */
    autoAdvanceInEdit?: boolean;
}

/**
 * Adapter component that converts between prop interfaces
 */
export const UnifiedStepRenderer: React.FC<UnifiedStepRendererProps> = ({
    step,
    mode,
    sessionData = {},
    onUpdateSessionData,
    productionParityInEdit = true,
    autoAdvanceInEdit = false,
}) => {
    const isEditMode = mode === 'edit';
    const isPreviewMode = mode === 'preview';

    return (
        <UnifiedStepContent
            step={step}
            isEditMode={isEditMode}
            isPreviewMode={isPreviewMode}
            sessionData={sessionData}
            onUpdateSessionData={onUpdateSessionData}
            productionParityInEdit={productionParityInEdit}
            autoAdvanceInEdit={autoAdvanceInEdit}
        />
    );
};

export default UnifiedStepRenderer;
