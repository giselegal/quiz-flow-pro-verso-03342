import React from 'react';
import EditorTransitionStep from './EditorTransitionStep';

export interface ModularTransitionStepProps {
    data: any;
    blocks?: any[];
    editor?: any;
    isEditable?: boolean;
}

export default function ModularTransitionStep({ data, isEditable }: ModularTransitionStepProps) {
    // Wrapper fino com data-testid para compatibilidade de testes
    return (
        <div data-testid="modular-transition-step">
            <EditorTransitionStep data={data} isEditable={isEditable} />
        </div>
    );
}
