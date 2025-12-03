import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
    /** Status de salvamento */
    isSaving: boolean;
    /** Timestamp do último save (ms) */
    lastSaved: number | null;
    /** Erro no auto-save */
    error: Error | null;
    /** Classe CSS adicional */
    className?: string;
    /** Mostrar texto descritivo */
    showText?: boolean;
    /** Compacto (apenas ícone) */
    compact?: boolean;
}

/**
 * Indicador visual de auto-save
 * 
 * Mostra o status atual do auto-save:
 * - Salvando... (loader animado)
 * - Salvo (checkmark verde)
 * - Erro (alerta vermelho)
 * - Tempo desde último save
 * 
 * @example
 * ```tsx
 * // No Editor
 * import { useEditorContext } from '@/core/contexts/EditorContext';
 * 
 * function Editor() {
 *   const { isSaving, autoSaveError, lastSaved } = useEditorContext();
 *   
 *   return (
 *     <div>
 *       <AutoSaveIndicator 
 *         isSaving={isSaving}
 *         lastSaved={lastSaved}
 *         error={autoSaveError}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function AutoSaveIndicator({
    isSaving,
    lastSaved,
    error,
    className,
    showText = true,
    compact = false,
}: AutoSaveIndicatorProps) {
    const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>('');

    // Atualizar tempo desde último save
    useEffect(() => {
        if (!lastSaved) {
            setTimeSinceLastSave('');
            return;
        }

        const updateTime = () => {
            const now = Date.now();
            const diff = now - lastSaved;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            if (seconds < 5) {
                setTimeSinceLastSave('agora');
            } else if (seconds < 60) {
                setTimeSinceLastSave(`${seconds}s atrás`);
            } else if (minutes < 60) {
                setTimeSinceLastSave(`${minutes}m atrás`);
            } else {
                setTimeSinceLastSave(`${hours}h atrás`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [lastSaved]);

    // Estado: Erro
    if (error) {
        return (
            <div
                className={cn(
                    'flex items-center gap-2 text-sm',
                    compact ? 'gap-1' : 'gap-2',
                    className,
                )}
                role="status"
                aria-live="polite"
            >
                <AlertCircle className={cn(
                    'text-red-500',
                    compact ? 'h-4 w-4' : 'h-5 w-5',
                )} />
                {showText && !compact && (
                    <span className="text-red-600 font-medium">
                        Erro ao salvar
                    </span>
                )}
                {!compact && (
                    <span className="text-xs text-red-500" title={error.message}>
                        {error.message.substring(0, 30)}...
                    </span>
                )}
            </div>
        );
    }

    // Estado: Salvando
    if (isSaving) {
        return (
            <div
                className={cn(
                    'flex items-center gap-2 text-sm',
                    compact ? 'gap-1' : 'gap-2',
                    className,
                )}
                role="status"
                aria-live="polite"
            >
                <Loader2 className={cn(
                    'animate-spin text-blue-500',
                    compact ? 'h-4 w-4' : 'h-5 w-5',
                )} />
                {showText && !compact && (
                    <span className="text-gray-600">
                        Salvando...
                    </span>
                )}
            </div>
        );
    }

    // Estado: Salvo
    if (lastSaved) {
        return (
            <div
                className={cn(
                    'flex items-center gap-2 text-sm',
                    compact ? 'gap-1' : 'gap-2',
                    className,
                )}
                role="status"
                aria-live="polite"
            >
                <CheckCircle2 className={cn(
                    'text-green-500',
                    compact ? 'h-4 w-4' : 'h-5 w-5',
                )} />
                {showText && !compact && (
                    <span className="text-gray-600">
                        Salvo {timeSinceLastSave}
                    </span>
                )}
            </div>
        );
    }

    // Estado: Inicial (sem auto-save ainda)
    return (
        <div
            className={cn(
                'flex items-center gap-2 text-sm text-gray-400',
                compact ? 'gap-1' : 'gap-2',
                className,
            )}
            role="status"
            aria-live="polite"
        >
            <Cloud className={cn(
                compact ? 'h-4 w-4' : 'h-5 w-5',
            )} />
            {showText && !compact && (
                <span>
                    Auto-save ativo
                </span>
            )}
        </div>
    );
}

/**
 * Variante compacta do indicador (apenas ícone)
 */
export function AutoSaveIndicatorCompact(props: Omit<AutoSaveIndicatorProps, 'compact' | 'showText'>) {
    return <AutoSaveIndicator {...props} compact showText={false} />;
}

/**
 * Variante com tooltip detalhado
 */
export function AutoSaveIndicatorWithTooltip({
    isSaving,
    lastSaved,
    error,
    className,
}: Omit<AutoSaveIndicatorProps, 'showText' | 'compact'>) {
    const [showTooltip, setShowTooltip] = useState(false);

    const getTooltipContent = () => {
        if (error) return `Erro: ${error.message}`;
        if (isSaving) return 'Salvando alterações...';
        if (lastSaved) {
            const date = new Date(lastSaved);
            return `Última alteração salva em ${date.toLocaleTimeString()}`;
        }
        return 'Auto-save está ativo. Suas alterações serão salvas automaticamente.';
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <AutoSaveIndicatorCompact
                isSaving={isSaving}
                lastSaved={lastSaved}
                error={error}
                className={className}
            />
            {showTooltip && (
                <div
                    className="absolute right-0 top-full mt-2 z-50 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg"
                    role="tooltip"
                >
                    {getTooltipContent()}
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
                </div>
            )}
        </div>
    );
}
