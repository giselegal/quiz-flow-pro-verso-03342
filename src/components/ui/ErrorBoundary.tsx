import React from 'react';

export default class ErrorBoundary extends React.Component<any, { hasError: boolean; error?: any }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }
    componentDidCatch(error: any, info: any) {
        // Exibe detalhes no console para facilitar debug em ambiente de desenvolvimento
        console.error('ErrorBoundary:', this.props?.componentName, error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-3 border rounded bg-red-50 text-red-700 text-sm">
                    Erro ao carregar {this.props?.componentName || 'componente'}. Verifique o console para detalhes.
                </div>
            );
        }
        return this.props.children as React.ReactNode;
    }
}
