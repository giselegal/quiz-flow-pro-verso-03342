import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';

type Props = {
    label?: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
    onError?: (error: unknown) => void;
};

type State = { hasError: boolean; error?: unknown };

export class SafeBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: unknown): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: unknown, info: React.ErrorInfo) {
        try {
            this.props.onError?.(error);
            if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
                 
                appLogger.error(`[SafeBoundary] ${this.props.label || 'Erro no componente'}`, { data: [error, info] });
            }
        } catch { }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <div role="alert" className="p-2 text-xs text-red-600 border border-red-300 rounded bg-red-50">
                    {this.props.label || 'Erro ao renderizar bloco.'}
                </div>
            );
        }
        return this.props.children;
    }
}

export default SafeBoundary;
