/**
 * UniversalStepEditor (LEGACY STUB)
 *
 * Este componente foi removido da base original e permanece apenas como stub para
 * evitar quebrar imports existentes enquanto a migração completa para o
 * ModernUnifiedEditor é finalizada.
 *
 * Ajuste: Adicionamos as props onStepChange, onSave e showNavigation porque o
 * demo (`UniversalStepEditorDemo`) já as utiliza. Assim garantimos alinhamento
 * tipado sem necessidade de refator imediata do demo.
 */
import React from 'react';

export interface UniversalStepEditorProps {
    stepId?: string;
    stepNumber?: number;
    funnelId?: string;
    /** Callback disparado quando há intenção de trocar a etapa (string id). */
    onStepChange?: (stepId: string) => void;
    /** Acionado para persistir a etapa atual. */
    onSave?: () => void | Promise<void>;
    /** Indica se a navegação interna deveria ser exibida (não implementado no stub). */
    showNavigation?: boolean;
}

const UniversalStepEditor: React.FC<UniversalStepEditorProps> = (props) => {
    const { stepId, stepNumber, onStepChange, onSave } = props;

    if (process.env.NODE_ENV !== 'production') {
        return (
            <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
                <strong>UniversalStepEditor (legacy stub)</strong>
                <p>
                    Este componente foi descontinuado. Migre para <code>ModernUnifiedEditor</code>.
                </p>
                {(stepId || stepNumber) && (
                    <p style={{ marginTop: 8, opacity: 0.7 }}>
                        Step atual: {stepId || `#${stepNumber}`}
                    </p>
                )}
                {(onStepChange || onSave) && (
                    <p style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
                        Callbacks fornecidos:{' '}
                        {onStepChange && <code style={{ marginRight: 8 }}>onStepChange()</code>}
                        {onSave && <code>onSave()</code>}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default UniversalStepEditor;
export { UniversalStepEditor };
