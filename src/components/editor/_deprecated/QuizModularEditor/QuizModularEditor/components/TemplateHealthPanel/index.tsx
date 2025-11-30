/**
 * 🏥 TEMPLATE HEALTH PANEL
 * 
 * Painel de saúde do template estilo VS Code Problems Panel
 * Expõe validação de integridade existente (validateTemplateIntegrity) com UI visual
 * 
 * Features:
 * - Score 0-100% de qualidade do template
 * - Lista de erros críticos, warnings e sugestões
 * - Auto-fix para problemas comuns
 * - Navegação para steps com problemas
 * 
 * @see src/lib/utils/templateValidation.ts
 */

import React, { useMemo, useState } from 'react';
import type { TemplateValidationResult } from '@/lib/utils/templateValidation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Info,
    Wrench,
    Eye,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateHealthPanelProps {
    /** Resultado da validação de integridade */
    validationResult: TemplateValidationResult | null;

    /** Callback para auto-fix de um erro */
    onAutoFix?: (errorIndex: number) => void;

    /** Callback para navegar para um step específico */
    onNavigateToStep?: (stepId: string) => void;

    /** Callback para ignorar um warning */
    onDismissWarning?: (warningIndex: number) => void;

    /** Mostrar painel colapsado */
    collapsed?: boolean;

    /** Callback para toggle collapse */
    onToggleCollapse?: () => void;
}

/**
 * Calcula health score (0-100%) baseado em erros/warnings
 */
function calculateHealthScore(result: TemplateValidationResult | null): number {
    if (!result) return 0;

    const { summary, errors, warnings } = result;

    // Pontuação base: steps válidos
    const stepScore = summary.totalSteps > 0
        ? (summary.validSteps / summary.totalSteps) * 60
        : 0;

    // Penalidade por erros críticos: -10 pontos cada (máx -30)
    const criticalErrors = errors.filter(e => e.severity === 'critical').length;
    const criticalPenalty = Math.min(criticalErrors * 10, 30);

    // Penalidade por erros altos: -5 pontos cada (máx -20)
    const highErrors = errors.filter(e => e.severity === 'high').length;
    const highPenalty = Math.min(highErrors * 5, 20);

    // Penalidade por warnings: -1 ponto cada (máx -10)
    const warningPenalty = Math.min(warnings.length * 1, 10);

    // Pontuação de blocos válidos: +40 pontos se 100% válidos
    const blockScore = summary.totalBlocks > 0
        ? (summary.validBlocks / summary.totalBlocks) * 40
        : 40;

    const score = Math.max(0, stepScore + blockScore - criticalPenalty - highPenalty - warningPenalty);

    return Math.round(score);
}

/**
 * Retorna cor baseada no score
 */
function getScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
}

/**
 * Template Health Panel Component
 */
export function TemplateHealthPanel({
    validationResult,
    onAutoFix,
    onNavigateToStep,
    onDismissWarning,
    collapsed = false,
    onToggleCollapse,
}: TemplateHealthPanelProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['critical', 'high'])
    );

    const healthScore = useMemo(
        () => calculateHealthScore(validationResult),
        [validationResult]
    );

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    if (!validationResult) {
        return (
            <Card className="p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span className="text-sm">Executando validação...</span>
                </div>
            </Card>
        );
    } const { errors, warnings, summary, isValid } = validationResult;
    const criticalErrors = errors.filter(e => e.severity === 'critical');
    const highErrors = errors.filter(e => e.severity === 'high');
    const mediumErrors = errors.filter(e => e.severity === 'medium');

    // Header sempre visível
    const header = (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    {isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    <h3 className="font-semibold text-sm">Saúde do Template</h3>
                </div>

                <div className="flex items-center gap-2">
                    <span className={cn('text-2xl font-bold', getScoreColor(healthScore))}>
                        {healthScore}%
                    </span>
                    <Badge variant={isValid ? 'default' : 'destructive'} className="text-xs">
                        {isValid ? 'Válido' : 'Erros Críticos'}
                    </Badge>
                </div>
            </div>

            {onToggleCollapse && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onToggleCollapse}
                    className="h-8 w-8 p-0"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
            )}
        </div>
    );

    if (collapsed) {
        return <Card className="bg-white dark:bg-gray-800">{header}</Card>;
    }

    return (
        <Card className="overflow-hidden bg-white dark:bg-gray-800">
            {header}            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 text-xs">
                <div>
                    <div className="text-muted-foreground mb-1">Steps Válidos</div>
                    <div className="font-semibold">
                        {summary.validSteps}/{summary.totalSteps}
                    </div>
                </div>
                <div>
                    <div className="text-muted-foreground mb-1">Blocos Válidos</div>
                    <div className="font-semibold">
                        {summary.validBlocks}/{summary.totalBlocks}
                    </div>
                </div>
                <div>
                    <div className="text-muted-foreground mb-1">Problemas</div>
                    <div className="font-semibold">
                        {errors.length} erros, {warnings.length} avisos
                    </div>
                </div>
            </div>

            {/* Critical Errors */}
            {criticalErrors.length > 0 && (
                <IssueSection
                    title="Erros Críticos"
                    icon={<AlertCircle className="w-4 h-4 text-red-600" />}
                    count={criticalErrors.length}
                    variant="critical"
                    expanded={expandedSections.has('critical')}
                    onToggle={() => toggleSection('critical')}
                >
                    {criticalErrors.map((error, idx) => (
                        <IssueItem
                            key={`critical-${idx}`}
                            type="error"
                            severity="critical"
                            message={error.message}
                            stepId={error.stepId}
                            blockId={error.blockId}
                            suggestion={error.suggestion}
                            onAutoFix={onAutoFix ? () => onAutoFix(idx) : undefined}
                            onNavigate={onNavigateToStep && error.stepId ? () => onNavigateToStep(error.stepId!) : undefined}
                        />
                    ))}
                </IssueSection>
            )}

            {/* High Priority Errors */}
            {highErrors.length > 0 && (
                <IssueSection
                    title="Erros de Alta Prioridade"
                    icon={<AlertTriangle className="w-4 h-4 text-orange-600" />}
                    count={highErrors.length}
                    variant="high"
                    expanded={expandedSections.has('high')}
                    onToggle={() => toggleSection('high')}
                >
                    {highErrors.map((error, idx) => (
                        <IssueItem
                            key={`high-${idx}`}
                            type="error"
                            severity="high"
                            message={error.message}
                            stepId={error.stepId}
                            blockId={error.blockId}
                            suggestion={error.suggestion}
                            onAutoFix={onAutoFix ? () => onAutoFix(criticalErrors.length + idx) : undefined}
                            onNavigate={onNavigateToStep && error.stepId ? () => onNavigateToStep(error.stepId!) : undefined}
                        />
                    ))}
                </IssueSection>
            )}

            {/* Medium Priority Errors */}
            {mediumErrors.length > 0 && (
                <IssueSection
                    title="Erros de Média Prioridade"
                    icon={<AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    count={mediumErrors.length}
                    variant="medium"
                    expanded={expandedSections.has('medium')}
                    onToggle={() => toggleSection('medium')}
                >
                    {mediumErrors.map((error, idx) => (
                        <IssueItem
                            key={`medium-${idx}`}
                            type="error"
                            severity="medium"
                            message={error.message}
                            stepId={error.stepId}
                            blockId={error.blockId}
                            suggestion={error.suggestion}
                            onNavigate={onNavigateToStep && error.stepId ? () => onNavigateToStep(error.stepId!) : undefined}
                        />
                    ))}
                </IssueSection>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <IssueSection
                    title="Avisos"
                    icon={<Info className="w-4 h-4 text-blue-600" />}
                    count={warnings.length}
                    variant="warning"
                    expanded={expandedSections.has('warnings')}
                    onToggle={() => toggleSection('warnings')}
                >
                    {warnings.map((warning, idx) => (
                        <IssueItem
                            key={`warning-${idx}`}
                            type="warning"
                            message={warning.message}
                            stepId={warning.stepId}
                            blockId={warning.blockId}
                            onNavigate={onNavigateToStep && warning.stepId ? () => onNavigateToStep(warning.stepId!) : undefined}
                            onDismiss={onDismissWarning ? () => onDismissWarning(idx) : undefined}
                        />
                    ))}
                </IssueSection>
            )}

            {/* All Good State */}
            {errors.length === 0 && warnings.length === 0 && (
                <div className="p-6 text-center">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold mb-1">Template Perfeito!</h4>
                    <p className="text-sm text-muted-foreground">
                        Nenhum erro ou aviso encontrado. Todos os {summary.totalSteps} steps e {summary.totalBlocks} blocos estão válidos.
                    </p>
                </div>
            )}
        </Card>
    );
}

/**
 * Issue Section (collapsible)
 */
interface IssueSectionProps {
    title: string;
    icon: React.ReactNode;
    count: number;
    variant: 'critical' | 'high' | 'medium' | 'warning';
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function IssueSection({ title, icon, count, expanded, onToggle, children }: IssueSectionProps) {
    return (
        <div className="border-t">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-medium text-sm">{title}</span>
                    <Badge variant="secondary" className="text-xs">
                        {count}
                    </Badge>
                </div>
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {expanded && (
                <div className="divide-y">
                    {children}
                </div>
            )}
        </div>
    );
}

/**
 * Issue Item
 */
interface IssueItemProps {
    type: 'error' | 'warning';
    severity?: 'critical' | 'high' | 'medium';
    message: string;
    stepId?: string;
    blockId?: string;
    suggestion?: string;
    onAutoFix?: () => void;
    onNavigate?: () => void;
    onDismiss?: () => void;
}

function IssueItem({
    type,
    severity,
    message,
    stepId,
    blockId,
    suggestion,
    onAutoFix,
    onNavigate,
    onDismiss,
}: IssueItemProps) {
    return (
        <div className="p-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{message}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {stepId && <span>Step: {stepId}</span>}
                        {blockId && <span>Bloco: {blockId.slice(0, 8)}...</span>}
                    </div>

                    {suggestion && (
                        <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs border border-blue-200 dark:border-blue-800">
                            <Info className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                            <span className="text-blue-900 dark:text-blue-100">{suggestion}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {onAutoFix && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onAutoFix}
                            className="h-7 text-xs"
                        >
                            <Wrench className="w-3 h-3 mr-1" />
                            Auto-Fix
                        </Button>
                    )}

                    {onNavigate && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onNavigate}
                            className="h-7 w-7 p-0"
                            title="Ver Step"
                        >
                            <Eye className="w-3 h-3" />
                        </Button>
                    )}

                    {onDismiss && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onDismiss}
                            className="h-7 w-7 p-0"
                            title="Ignorar"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
