import React from 'react';
import EditorResultStep from './EditorResultStep';

export interface ModularResultStepProps {
    data: any;
    blocks?: any[];
    editor?: any;
    isEditable?: boolean;
    userProfile?: any;
}

export default function ModularResultStep({ data, isEditable, userProfile }: ModularResultStepProps) {
    // Wrapper fino com data-testid para compatibilidade de testes
    return (
        <div data-testid="modular-result-step">
            <EditorResultStep data={data} isEditable={isEditable} userProfile={userProfile} />
        </div>
    );
}
