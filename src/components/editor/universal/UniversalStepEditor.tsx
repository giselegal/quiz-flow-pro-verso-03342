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
import DeprecatedNotice from '@/components/ui/DeprecatedNotice';

// Em desenvolvimento, emitir aviso único de depreciação
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    const flag = '__UNIVERSAL_STEP_EDITOR_DEPRECATED__';
    if (!(window as any)[flag]) {
        (window as any)[flag] = true;
        // eslint-disable-next-line no-console
        console.warn('[DEPRECATED] UniversalStepEditor: use ModernUnifiedEditor. Guia: MIGRATION_GUIDE_EDITOR.md');
    }
}

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
            <DeprecatedNotice
                title="UniversalStepEditor (stub)"
                replacement="ModernUnifiedEditor"
                docsLink="/docs/migration/editor"
                extra={(
                    <div style={{ fontSize: 12 }}>
                        {(stepId || stepNumber) && (
                            <div style={{ opacity: 0.7, marginBottom: 4 }}>
                                Step atual: {stepId || `#${stepNumber}`}
                            </div>
                        )}
                        {(onStepChange || onSave) && (
                            <div style={{ opacity: 0.8 }}>
                                Callbacks: {onStepChange && <code style={{ marginRight: 8 }}>onStepChange()</code>} {onSave && <code>onSave()</code>}
                            </div>
                        )}
                    </div>
                )}
            />
        );
    }
    return null;
};

export default UniversalStepEditor;
export { UniversalStepEditor };
