// Sistema de Validação e Feedback Avançado para o Editor
import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';

// Tipos para o sistema de validação
export type ValidationSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ValidationRule {
  id: string;
  field: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'uniqueness';
  message: string;
  severity: ValidationSeverity;
  validator?: (value: any, context?: any) => boolean;
  suggestion?: string;
  autoFix?: (value: any) => any;
}

export interface ValidationResult {
  field: string;
  rule: ValidationRule;
  isValid: boolean;
  message: string;
  severity: ValidationSeverity;
  suggestion?: string;
  autoFix?: () => void;
}

export interface FunnelValidationContext {
  funnel: any;
  pages: any[];
  currentPage?: any;
  userRole?: string;
}

// Regras de validação predefinidas
export const VALIDATION_RULES: ValidationRule[] = [
  // Funnel level validations
  {
    id: 'funnel-name-required',
    field: 'name',
    type: 'required',
    message: 'Nome do funil é obrigatório',
    severity: 'error',
    suggestion: 'Digite um nome descritivo para o funil',
  },
  {
    id: 'funnel-name-length',
    field: 'name',
    type: 'minLength',
    message: 'Nome deve ter pelo menos 3 caracteres',
    severity: 'error',
    validator: value => value && value.length >= 3,
  },
  {
    id: 'funnel-description-recommended',
    field: 'description',
    type: 'required',
    message: 'Descrição recomendada para melhor organização',
    severity: 'warning',
    suggestion: 'Adicione uma descrição para facilitar a identificação',
  },

  // Page level validations
  {
    id: 'page-title-required',
    field: 'pages[].title',
    type: 'required',
    message: 'Título da página é obrigatório',
    severity: 'error',
    suggestion: 'Cada página deve ter um título claro',
  },
  {
    id: 'page-min-components',
    field: 'pages[].components',
    type: 'custom',
    message: 'Página deve ter pelo menos um componente',
    severity: 'warning',
    validator: components => components && components.length > 0,
    suggestion: 'Adicione componentes para construir o conteúdo da página',
  },

  // SEO validations
  {
    id: 'seo-title-length',
    field: 'seo.title',
    type: 'custom',
    message: 'Título SEO deve ter entre 30-60 caracteres',
    severity: 'warning',
    validator: value => !value || (value.length >= 30 && value.length <= 60),
    suggestion: 'Otimize o título para melhor rankeamento nos buscadores',
  },
  {
    id: 'seo-description-length',
    field: 'seo.description',
    type: 'custom',
    message: 'Meta descrição deve ter entre 120-160 caracteres',
    severity: 'warning',
    validator: value => !value || (value.length >= 120 && value.length <= 160),
    suggestion: 'Crie uma descrição atrativa para aparecer nos resultados de busca',
  },

  // Performance validations
  {
    id: 'funnel-max-pages',
    field: 'pages',
    type: 'custom',
    message: 'Muitas páginas podem afetar a performance',
    severity: 'info',
    validator: pages => !pages || pages.length <= 30,
    suggestion: 'Considere dividir em múltiplos funis menores',
  },
];

// Hook para validação em tempo real
export const useValidation = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(
    (field: string, value: any, context?: FunnelValidationContext) => {
      const applicableRules = VALIDATION_RULES.filter(
        rule =>
          rule.field === field ||
          (rule.field.includes('[]') && field.includes(rule.field.replace('[]', '')))
      );

      const results: ValidationResult[] = [];

      applicableRules.forEach(rule => {
        let isValid = true;
        let message = rule.message;

        switch (rule.type) {
          case 'required':
            isValid = value !== null && value !== undefined && value !== '';
            break;
          case 'minLength':
            isValid = !value || value.length >= 3; // Default min length
            break;
          case 'maxLength':
            isValid = !value || value.length <= 255; // Default max length
            break;
          case 'custom':
            isValid = rule.validator ? rule.validator(value, context) : true;
            break;
        }

        results.push({
          field,
          rule,
          isValid,
          message,
          severity: rule.severity,
          suggestion: rule.suggestion,
          autoFix: rule.autoFix ? () => rule.autoFix!(value) : undefined,
        });
      });

      return results;
    },
    []
  );

  const validateFunnel = useCallback(
    async (context: FunnelValidationContext) => {
      setIsValidating(true);
      const allResults: ValidationResult[] = [];

      try {
        // Validate funnel level
        if (context.funnel) {
          allResults.push(...validateField('name', context.funnel.name, context));
          allResults.push(...validateField('description', context.funnel.description, context));
          allResults.push(...validateField('pages', context.pages, context));

          // SEO validation
          if (context.funnel.seo) {
            allResults.push(...validateField('seo.title', context.funnel.seo.title, context));
            allResults.push(
              ...validateField('seo.description', context.funnel.seo.description, context)
            );
          }
        }

        // Validate pages
        if (context.pages) {
          context.pages.forEach((page, index) => {
            allResults.push(...validateField(`pages[${index}].title`, page.title, context));
            allResults.push(
              ...validateField(`pages[${index}].components`, page.components, context)
            );
          });
        }

        setValidationResults(allResults);
      } catch (error) {
        console.error('Validation error:', error);
      } finally {
        setIsValidating(false);
      }
    },
    [validateField]
  );

  const getValidationSummary = useMemo(() => {
    const summary = {
      total: validationResults.length,
      errors: validationResults.filter(r => !r.isValid && r.severity === 'error').length,
      warnings: validationResults.filter(r => !r.isValid && r.severity === 'warning').length,
      info: validationResults.filter(r => !r.isValid && r.severity === 'info').length,
      score: 0,
    };

    // Calculate quality score (0-100)
    const totalIssues = summary.errors + summary.warnings;
    const maxPossibleIssues = validationResults.length;
    summary.score =
      maxPossibleIssues > 0
        ? Math.max(0, Math.round(((maxPossibleIssues - totalIssues) / maxPossibleIssues) * 100))
        : 100;

    return summary;
  }, [validationResults]);

  return {
    validationResults,
    isValidating,
    validateField,
    validateFunnel,
    getValidationSummary,
  };
};

// Componente de feedback visual para campos
export const FieldValidationFeedback: React.FC<{
  field: string;
  value: any;
  context?: FunnelValidationContext;
  className?: string;
}> = ({ field, value, context, className = '' }) => {
  const { validateField } = useValidation();
  const results = validateField(field, value, context);
  const activeResults = results.filter(r => !r.isValid);

  if (activeResults.length === 0) return null;

  const mostSevere = activeResults.reduce((prev, current) => {
    const severityOrder = { error: 4, warning: 3, info: 2, success: 1 };
    return severityOrder[current.severity] > severityOrder[prev.severity] ? current : prev;
  });

  const getIcon = (severity: ValidationSeverity) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getColorClass = (severity: ValidationSeverity) => {
    switch (severity) {
      case 'error':
        return 'border-red-500 text-red-600';
      case 'warning':
        return 'border-yellow-500 text-stone-600';
      case 'info':
        return 'border-[#B89B7A] text-[#B89B7A]';
      case 'success':
        return 'border-green-500 text-green-600';
    }
  };

  return (
    <div className={`mt-1 ${className}`}>
      <Alert className={`${getColorClass(mostSevere.severity)} bg-white`}>
        <div className="flex items-start gap-2">
          {getIcon(mostSevere.severity)}
          <div className="flex-1">
            <AlertDescription className="text-sm">
              {mostSevere.message}
              {mostSevere.suggestion && (
                <div className="mt-1 text-xs opacity-80">💡 {mostSevere.suggestion}</div>
              )}
            </AlertDescription>
            {mostSevere.autoFix && (
              <Button size="sm" variant="outline" className="mt-2" onClick={mostSevere.autoFix}>
                Corrigir automaticamente
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
};

// Componente de resumo de validação
export const ValidationSummary: React.FC<{
  context: FunnelValidationContext;
  className?: string;
}> = ({ context, className = '' }) => {
  const { validationResults, getValidationSummary, validateFunnel, isValidating } = useValidation();
  const summary = getValidationSummary;

  React.useEffect(() => {
    validateFunnel(context);
  }, [context, validateFunnel]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-stone-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Aceitável';
    return 'Precisa melhorar';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quality Score */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Qualidade do Funil</h3>
          <Badge
            variant={
              summary.score >= 70 ? 'secondary' : summary.score >= 50 ? 'outline' : 'destructive'
            }
          >
            {getScoreLabel(summary.score)}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Score</span>
            <span className={`font-bold ${getScoreColor(summary.score)}`}>{summary.score}/100</span>
          </div>
          <Progress value={summary.score} className="h-2" />
        </div>
      </div>

      {/* Issues Summary */}
      {summary.total > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-semibold mb-3">Resumo de Validação</h3>
          <div className="space-y-2">
            {summary.errors > 0 && (
              <div style={{ color: '#432818' }}>
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{summary.errors} erro(s) crítico(s)</span>
              </div>
            )}
            {summary.warnings > 0 && (
              <div className="flex items-center gap-2 text-stone-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{summary.warnings} aviso(s)</span>
              </div>
            )}
            {summary.info > 0 && (
              <div className="flex items-center gap-2 text-[#B89B7A]">
                <Info className="h-4 w-4" />
                <span className="text-sm">{summary.info} sugestão(ões)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Issues */}
      {validationResults.filter(r => !r.isValid).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Detalhes</h4>
          {validationResults
            .filter(r => !r.isValid)
            .map((result, index) => (
              <Alert key={index} className="bg-white">
                <div className="flex items-start gap-2">
                  {result.severity === 'error' && <AlertCircle style={{ color: '#432818' }} />}
                  {result.severity === 'warning' && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  {result.severity === 'info' && <Info className="h-4 w-4 text-[#B89B7A]" />}
                  <div className="flex-1">
                    <AlertDescription className="text-sm">
                      <strong>{result.field}:</strong> {result.message}
                      {result.suggestion && (
                        <div className="mt-1 text-xs opacity-70">{result.suggestion}</div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
        </div>
      )}

      {isValidating && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div style={{ borderColor: '#E5DDD5' }}></div>
            Validando funil...
          </div>
        </div>
      )}
    </div>
  );
};

// HOC para adicionar validação a inputs
export const withValidation = <P extends object>(Component: React.ComponentType<P>) => {
  return React.forwardRef<
    HTMLElement,
    P & {
      field?: string;
      value?: any;
      context?: FunnelValidationContext;
      showFeedback?: boolean;
    }
  >((props, ref) => {
    const { field, value, context, showFeedback = true, ...componentProps } = props;

    return (
      <div className="space-y-1">
        <Component {...(componentProps as P)} ref={ref} />
        {showFeedback && field && (
          <FieldValidationFeedback field={field} value={value} context={context} />
        )}
      </div>
    );
  });
};

export default useValidation;
