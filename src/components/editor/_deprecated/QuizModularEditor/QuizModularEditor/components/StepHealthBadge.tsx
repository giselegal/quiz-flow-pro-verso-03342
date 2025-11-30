/**
 * 🏥 STEP HEALTH BADGE
 * 
 * Badge visual para indicar saúde de um step individual
 * Usa dados de ValidationError[] filtrados por stepId
 */

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ValidationError, ValidationWarning } from '@/lib/utils/templateValidation';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export interface StepHealthBadgeProps {
    stepId: string;
    errors?: ValidationError[];
    warnings?: ValidationWarning[];
    showLabel?: boolean;
}

/**
 * Calcula status de saúde do step
 */
function calculateStepHealth(
    stepId: string,
    errors: ValidationError[] = [],
    warnings: ValidationWarning[] = []
): {
    status: 'valid' | 'warning' | 'error' | 'critical';
    icon: React.ReactNode;
    color: string;
    count: number;
    message: string;
} {
    const stepErrors = errors.filter(e => e.stepId === stepId);
    const stepWarnings = warnings.filter(w => w.stepId === stepId);

    const criticalErrors = stepErrors.filter(e => e.severity === 'critical');
    const highErrors = stepErrors.filter(e => e.severity === 'high');

    // Erros críticos
    if (criticalErrors.length > 0) {
        return {
            status: 'critical',
            icon: <AlertCircle className="w-3 h-3" />,
            color: 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400',
            count: criticalErrors.length,
            message: `${criticalErrors.length} erro${criticalErrors.length > 1 ? 's' : ''} crítico${criticalErrors.length > 1 ? 's' : ''}`,
        };
    }

    // Erros de alta prioridade
    if (highErrors.length > 0) {
        return {
            status: 'error',
            icon: <AlertTriangle className="w-3 h-3" />,
            color: 'text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-400',
            count: highErrors.length,
            message: `${highErrors.length} erro${highErrors.length > 1 ? 's' : ''} de alta prioridade`,
        };
    }

    // Warnings ou erros médios
    if (stepErrors.length > 0 || stepWarnings.length > 0) {
        return {
            status: 'warning',
            icon: <AlertTriangle className="w-3 h-3" />,
            color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400',
            count: stepErrors.length + stepWarnings.length,
            message: `${stepErrors.length} erro${stepErrors.length !== 1 ? 's' : ''}, ${stepWarnings.length} aviso${stepWarnings.length !== 1 ? 's' : ''}`,
        };
    }

    // Válido
    return {
        status: 'valid',
        icon: <CheckCircle2 className="w-3 h-3" />,
        color: 'text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400',
        count: 0,
        message: 'Step válido',
    };
}

/**
 * Step Health Badge Component
 */
export function StepHealthBadge({
    stepId,
    errors = [],
    warnings = [],
    showLabel = false,
}: StepHealthBadgeProps) {
    const health = calculateStepHealth(stepId, errors, warnings);

    // Construir lista de problemas para tooltip
    const stepErrors = errors.filter(e => e.stepId === stepId);
    const stepWarnings = warnings.filter(w => w.stepId === stepId);

    const tooltipContent = (
        <div className="space-y-2 max-w-xs">
            <div className="font-semibold text-xs">{health.message}</div>

            {stepErrors.length > 0 && (
                <div className="space-y-1">
                    <div className="text-xs font-medium text-red-300">Erros:</div>
                    {stepErrors.slice(0, 3).map((error, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                            • {error.message}
                        </div>
                    ))}
                    {stepErrors.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                            ... e mais {stepErrors.length - 3} erro{stepErrors.length - 3 > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}

            {stepWarnings.length > 0 && (
                <div className="space-y-1">
                    <div className="text-xs font-medium text-yellow-300">Avisos:</div>
                    {stepWarnings.slice(0, 2).map((warning, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                            • {warning.message}
                        </div>
                    ))}
                    {stepWarnings.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                            ... e mais {stepWarnings.length - 2} aviso{stepWarnings.length - 2 > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium',
                            health.color
                        )}
                    >
                        {health.icon}
                        {showLabel && <span>{health.count > 0 ? health.count : '✓'}</span>}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
