/**
 * 🛡️ ADVANCED PROPERTIES PANEL - SAFE WRAPPER
 * 
 * Wrapper de segurança para evitar erros de contexto undefined
 */

import React from 'react';
import { Box, Text } from '@/components/ui/modern-ui';

// ✅ Import estático ES6 (corrigido - não usar require())
import AdvancedPropertiesPanelComponent, { type AdvancedPropertiesPanelProps } from './AdvancedPropertiesPanel';

interface SafeAdvancedPropertiesPanelProps extends AdvancedPropertiesPanelProps {
    // Props adicionais para o wrapper, se necessário
}

// Componente de fallback
const PropertiesPanelFallback: React.FC = () => (
    <Box className="advanced-properties-fallback" style={{ padding: '1rem' }}>
        <Text size="sm" style={{ color: '#6b7280' }}>
            ⚙️ Painel de Propriedades está carregando...
        </Text>
        <Text size="xs" style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
            Se o problema persistir, recarregue a página.
        </Text>
    </Box>
);

// Componente de erro
const PropertiesPanelError: React.FC<{ error?: Error }> = ({ error }) => (
    <Box
        className="advanced-properties-error"
        style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            borderRadius: '0.375rem'
        }}
    >
        <Text size="sm" style={{ color: '#dc2626', fontWeight: '500' }}>
            ⚠️ Erro no Painel de Propriedades
        </Text>
        <Text size="xs" style={{ color: '#ef4444', marginTop: '0.5rem' }}>
            {error?.message || 'Erro desconhecido no editor'}
        </Text>
        <Text size="xs" style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Tente recarregar a página ou use o editor básico.
        </Text>
    </Box>
);

// Error Boundary específico para o painel
class PropertiesPanelErrorBoundary extends React.Component<
    { children: React.ReactNode; onError?: (error: Error) => void },
    { hasError: boolean; error?: Error }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Erro capturado no PropertiesPanelErrorBoundary:', error, errorInfo);
        this.props.onError?.(error);
    }

    render() {
        if (this.state.hasError) {
            return <PropertiesPanelError error={this.state.error} />;
        }

        return this.props.children;
    }
}

// Wrapper principal com verificações de segurança
const SafeAdvancedPropertiesPanel: React.FC<SafeAdvancedPropertiesPanelProps> = (props) => {
    return (
        <PropertiesPanelErrorBoundary
            onError={(error) => {
                console.error('Erro no AdvancedPropertiesPanel:', error);
                // Aqui podemos adicionar analytics ou notificações se necessário
            }}
        >
            <AdvancedPropertiesPanelComponent {...props} />
        </PropertiesPanelErrorBoundary>
    );
};

export default SafeAdvancedPropertiesPanel;