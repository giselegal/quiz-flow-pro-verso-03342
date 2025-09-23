import React from 'react';
import { ErrorBoundary } from '@/components/editor/ErrorBoundary';
import ModernUnifiedEditor from '@/pages/editor/ModernUnifiedEditor';
import { useLocation } from 'wouter';

/**
 * 🔄 PÁGINA REDIRECIONADA PARA MODERNUNIFIEDEDITOR
 * Migrada do SchemaDrivenEditorResponsive (deletado) para o editor unificado.
 */
const SchemaEditorPage: React.FC = () => {
    const [location] = useLocation();
    const params = React.useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
    const funnelId = params.get('funnel') || (import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID;

    return (
        <ErrorBoundary>
            <ModernUnifiedEditor funnelId={funnelId} />
        </ErrorBoundary>
    );
};

export default SchemaEditorPage;
