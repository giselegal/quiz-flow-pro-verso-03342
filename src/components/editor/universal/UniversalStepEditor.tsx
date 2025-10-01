// @ts-nocheck
/**
 * UniversalStepEditor (LEGACY FULLY REMOVED)
 * Mantido apenas como stub mínimo para compatibilidade de imports.
 * TODO: Remover definitivamente após confirmar ausência de usos dinâmicos.
 */
import React from 'react';

export interface UniversalStepEditorProps {
    stepId?: string;
    stepNumber?: number;
    funnelId?: string;
}

const UniversalStepEditor: React.FC<UniversalStepEditorProps> = () => {
    if (process.env.NODE_ENV !== 'production') {
        return (
            <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
                <strong>UniversalStepEditor (legacy stub)</strong>
                <p>Este componente foi removido. Use <code>ModernUnifiedEditor</code>.</p>
            </div>
        );
    }
    return null;
};

export default UniversalStepEditor;
export { UniversalStepEditor };
