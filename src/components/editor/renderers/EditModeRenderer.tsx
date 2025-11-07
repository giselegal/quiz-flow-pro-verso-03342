import React from 'react';
import UnifiedStepContent from './common/UnifiedStepContent';
import type { EditableQuizStep } from '@/components/editor/quiz/types';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Copy } from 'lucide-react';

export interface EditModeRendererProps {
    step: EditableQuizStep;
    isSelected?: boolean;
    onStepClick?: (e: React.MouseEvent, step: EditableQuizStep) => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    productionParityInEdit?: boolean;
    autoAdvanceInEdit?: boolean;
    sessionData?: Record<string, any>;
    onUpdateSessionData?: (key: string, value: any) => void;
}

const EditModeRenderer: React.FC<EditModeRendererProps> = ({
    step,
    isSelected,
    onStepClick,
    onDelete,
    onDuplicate,
    productionParityInEdit = true,
    autoAdvanceInEdit = false,
    sessionData = {},
    onUpdateSessionData,
}) => {
    return (
        <div
            className={`relative group transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            onClick={(e) => onStepClick?.(e, step)}
            data-step-id={step.id}
        >
            {/* Overlay de edição */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border p-1">
                    {/* Drag handle */}
                    <Button variant="ghost" size="sm" className="cursor-grab active:cursor-grabbing h-8 w-8 p-0">
                        <GripVertical className="w-4 h-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Duplicate */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onDuplicate?.();
                        }}
                        className="h-8 w-8 p-0"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Badge de tipo */}
            <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                {step.type}
            </div>

            {/* Conteúdo real - eventos liberados no modo edição */}
            <div>
                <UnifiedStepContent
                    step={step}
                    isEditMode
                    isPreviewMode={false}
                    sessionData={sessionData}
                    onUpdateSessionData={onUpdateSessionData}
                    productionParityInEdit={productionParityInEdit}
                    autoAdvanceInEdit={autoAdvanceInEdit}
                />
            </div>
        </div>
    );
};

export default React.memo(EditModeRenderer);
