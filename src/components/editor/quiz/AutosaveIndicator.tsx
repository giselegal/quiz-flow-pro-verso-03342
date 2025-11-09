/**
 * 💾 AUTOSAVE INDICATOR - Feedback Visual de Autosave
 * 
 * Componente que exibe o status do autosave:
 * - 💾 Salvando... (cinza, animado)
 * - ✅ Salvo (verde, temporário)
 * - ❌ Erro ao salvar (vermelho, com retry)
 * - ⏱️ Alterações não salvas (amarelo)
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import React, { useEffect, useState } from 'react';
import { Check, AlertCircle, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'unsaved';

interface AutosaveIndicatorProps {
    /** Status atual do autosave */
    status: AutosaveStatus;

    /** Mensagem de erro (se status === 'error') */
    errorMessage?: string;

    /** Callback para retry manual */
    onRetry?: () => void;

    /** Compacto (apenas ícone) ou completo (ícone + texto) */
    compact?: boolean;

    /** ClassName adicional */
    className?: string;
}

export function AutosaveIndicator({
    status,
    errorMessage,
    onRetry,
    compact = false,
    className,
}: AutosaveIndicatorProps) {
    const [showSaved, setShowSaved] = useState(false);

    // Auto-hide "Salvo" após 2s
    useEffect(() => {
        if (status === 'saved') {
            setShowSaved(true);
            const timer = setTimeout(() => {
                setShowSaved(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Não mostra nada se idle e não tem alterações
    if (status === 'idle' && !showSaved) {
        return null;
    }

    const statusConfig = {
        saving: {
            icon: Loader2,
            text: 'Salvando...',
            color: 'text-gray-500',
            bgColor: 'bg-gray-100',
            animate: true,
        },
        saved: {
            icon: Check,
            text: 'Salvo',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            animate: false,
        },
        error: {
            icon: AlertCircle,
            text: 'Erro ao salvar',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            animate: false,
        },
        unsaved: {
            icon: Clock,
            text: 'Alterações não salvas',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            animate: false,
        },
        idle: {
            icon: Check,
            text: 'Salvo',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            animate: false,
        },
    };

    const config = statusConfig[showSaved && status === 'idle' ? 'saved' : status];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                config.bgColor,
                config.color,
                className
            )}
            role="status"
            aria-live="polite"
        >
            <Icon
                className={cn(
                    'h-4 w-4',
                    config.animate && 'animate-spin'
                )}
                aria-hidden="true"
            />

            {!compact && (
                <span className="whitespace-nowrap">
                    {config.text}
                </span>
            )}

            {status === 'error' && onRetry && !compact && (
                <button
                    onClick={onRetry}
                    className="ml-2 text-xs underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    type="button"
                >
                    Tentar novamente
                </button>
            )}

            {status === 'error' && errorMessage && !compact && (
                <span className="ml-1 text-xs opacity-70" title={errorMessage}>
                    ({errorMessage})
                </span>
            )}
        </div>
    );
}

/**
 * Hook para gerenciar status do autosave indicator
 */
export function useAutosaveIndicator() {
    const [status, setStatus] = useState<AutosaveStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const setSaving = () => {
        setStatus('saving');
        setErrorMessage(undefined);
    };

    const setSaved = () => {
        setStatus('saved');
        setErrorMessage(undefined);
    };

    const setError = (message?: string) => {
        setStatus('error');
        setErrorMessage(message);
    };

    const setUnsaved = () => {
        setStatus('unsaved');
        setErrorMessage(undefined);
    };

    const reset = () => {
        setStatus('idle');
        setErrorMessage(undefined);
    };

    return {
        status,
        errorMessage,
        setSaving,
        setSaved,
        setError,
        setUnsaved,
        reset,
    };
}
