/**
 * 🛡️ ADVANCED PROPERTIES PANEL - SAFE WRAPPER
 * 
 * Wrapper de segurança para evitar erros de contexto undefined
 */

import React, { ErrorBoundary } from 'react';
import { Box, Text } from '@/components/ui/modern-ui';

// Import protegido do painel original
let AdvancedPropertiesPanelComponent: React.ComponentType<any> | null = null;

try {
    // Importação dinâmica segura
    const module = require('./AdvancedPropertiesPanel');
    AdvancedPropertiesPanelComponent = module.default || module.AdvancedPropertiesPanel;
} catch (error) {
    console.warn('Erro ao carregar AdvancedPropertiesPanel:', error);
}

interface SafeAdvancedPropertiesPanelProps {
    [key: string]: any;
}

// Componente de fallback
const PropertiesPanelFallback: React.FC = () => (
    <Box className="advanced-properties-fallback" p={4}>
        <Text size="sm" color="gray.600">
            ⚙️ Painel de Propriedades está carregando...
        </Text>
        <Text size="xs" color="gray.400" mt={2}>
            Se o problema persistir, recarregue a página.
        </Text>
    </Box>
);

// Componente de erro
const PropertiesPanelError: React.FC<{ error?: Error }> = ({ error }) => (
    <Box className="advanced-properties-error" p={4} bg="red.50" borderRadius="md">
        <Text size="sm" color="red.600" fontWeight="medium">
            ⚠️ Erro no Painel de Propriedades
        </Text>
        <Text size="xs" color="red.500" mt={2}>
            {error?.message || 'Erro desconhecido no editor'}
        </Text>
        <Text size="xs" color="gray.500" mt={2}>
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
    // Verificar se o componente foi carregado com sucesso
    if (!AdvancedPropertiesPanelComponent) {
        return <PropertiesPanelFallback />;
    }

    // Verificar se as props essenciais estão presentes
    const safeProps = {
        ...props,
        // Garantir que _config sempre existe
        _config: props._config || {
            theme: 'modern',
            layout: 'horizontal',
            showPreview: true,
            autoSave: true,
            debug: false
        }
    };

    return (
        <PropertiesPanelErrorBoundary
            onError={(error) => {
                console.error('Erro no AdvancedPropertiesPanel:', error);
                // Aqui podemos adicionar analytics ou notificações se necessário
            }}
        >
            <AdvancedPropertiesPanelComponent {...safeProps} />
        </PropertiesPanelErrorBoundary>
    );
};

export default SafeAdvancedPropertiesPanel;