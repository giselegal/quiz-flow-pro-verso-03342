import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import ModernUnifiedEditor from '@/pages/editor/ModernUnifiedEditor';
import { useParams } from 'wouter';

/**
 * 🔄 PÁGINA REDIRECIONADA PARA MODERNUNIFIEDEDITOR  
 * Migrada para usar o editor unificado consolidado.
 */
const BuilderPoweredEditor: React.FC = () => {
    const params = useParams<{ funnelId?: string }>();
    const funnelId = params.funnelId || 'builder-quiz-21-steps';

    // Debug info para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        console.log('🏗️ BuilderPoweredEditor iniciado:', {
            funnelId,
            timestamp: new Date().toISOString(),
            provider: 'BuilderEditorProvider (Builder System)',
            editor: 'OptimizedModularEditorPro (visual inalterado)',
            features: [
                'Builder System Engine',
                'Quiz 21 etapas garantido',
                'Cálculos automáticos',
                'Layout visual idêntico',
                'Zero breaking changes'
            ]
        });
    }

    return (
        <ErrorBoundary>
            <ModernUnifiedEditor funnelId={funnelId} />
        </ErrorBoundary>
    );
};

export default BuilderPoweredEditor;