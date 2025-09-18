/**
 * 🔍 ENHANCED VALIDATION SYSTEM - SISTEMA DE VALIDAÇÃO AVANÇADO
 * 
 * Sistema de validação em tempo real para propriedades do quiz com:
 * - Validação de interpolação de variáveis
 * - Validação visual com feedback instantâneo 
 * - Sugestões automáticas de correção
 * - Validação de acessibilidade
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Lightbulb,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Search,
  Accessibility
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== INTERFACES =====

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: ValidationCategory;
  severity: ValidationSeverity;
  validator: (value: any, context?: ValidationContext) => ValidationResult;
  autoFix?: (value: any) => any;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  suggestion?: string;
  autoFixValue?: any;
  details?: string;
}

export interface ValidationContext {
  propertyKey: string;
  propertyType: string;
  blockType: string;
  stepNumber: number;
  availableVariables: string[];
  otherProperties: Record<string, any>;
}

export enum ValidationCategory {
  INTERPOLATION = 'interpolation',
  ACCESSIBILITY = 'accessibility',
  SEO = 'seo',
  PERFORMANCE = 'performance',
  DESIGN = 'design',
  CONTENT = 'content',
  TECHNICAL = 'technical'
}

export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success'
}

export interface ValidationIssue {
  ruleId: string;
  propertyKey: string;
  severity: ValidationSeverity;
  message: string;
  suggestion?: string;
  autoFixValue?: any;
  category: ValidationCategory;
}

interface EnhancedValidationSystemProps {
  properties: Record<string, any>;
  context: ValidationContext;
  onValidationChange?: (issues: ValidationIssue[]) => void;
  onAutoFix?: (propertyKey: string, value: any) => void;
  className?: string;
}

// ===== VALIDATION RULES =====

const VALIDATION_RULES: ValidationRule[] = [
  // Interpolação
  {
    id: 'interpolation-syntax',
    name: 'Sintaxe de Interpolação',
    description: 'Verifica se as variáveis de interpolação estão bem formadas',
    category: ValidationCategory.INTERPOLATION,
    severity: ValidationSeverity.ERROR,
    validator: (value: string, context) => {
      if (!value || typeof value !== 'string') {
        return { isValid: true };
      }

      const variableRegex = /\{([^}]+)\}/g;
      const matches = Array.from(value.matchAll(variableRegex));

      for (const match of matches) {
        const variableName = match[1].trim();

        // Verificar se a variável é válida
        if (!variableName) {
          return {
            isValid: false,
            message: 'Variável vazia encontrada: {}',
            suggestion: 'Remova as chaves vazias ou adicione um nome de variável válido'
          };
        }

        // Verificar se contém apenas caracteres válidos
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(variableName)) {
          return {
            isValid: false,
            message: `Variável com nome inválido: {${variableName}}`,
            suggestion: 'Use apenas letras, números e underscore. Comece com uma letra.'
          };
        }

        // Verificar se a variável existe no contexto
        if (context?.availableVariables && !context.availableVariables.includes(variableName)) {
          return {
            isValid: false,
            message: `Variável desconhecida: {${variableName}}`,
            suggestion: `Variáveis disponíveis: ${context.availableVariables.join(', ')}`
          };
        }
      }

      return { isValid: true };
    }
  },

  // Acessibilidade
  {
    id: 'alt-text-required',
    name: 'Texto Alternativo Obrigatório',
    description: 'Imagens devem ter texto alternativo para acessibilidade',
    category: ValidationCategory.ACCESSIBILITY,
    severity: ValidationSeverity.ERROR,
    validator: (_value: string, context) => {
      if (context?.propertyKey === 'content.src' || context?.propertyKey === 'properties.src') {
        // Verificar se existe alt text correspondente
        const altKey = context.propertyKey.replace('src', 'alt');
        const altValue = context.otherProperties?.[altKey];

        if (!altValue || (typeof altValue === 'string' && !altValue.trim())) {
          return {
            isValid: false,
            message: 'Imagem sem texto alternativo',
            suggestion: 'Adicione uma descrição da imagem para acessibilidade'
          };
        }
      }

      return { isValid: true };
    }
  },

  {
    id: 'color-contrast',
    name: 'Contraste de Cores',
    description: 'Verifica se o contraste entre cores atende aos padrões de acessibilidade',
    category: ValidationCategory.ACCESSIBILITY,
    severity: ValidationSeverity.WARNING,
    validator: (value: string, context) => {
      if (!value || typeof value !== 'string' || !value.startsWith('#')) {
        return { isValid: true };
      }

      // Para cores de texto, verificar contraste com background
      if (context?.propertyKey?.includes('textColor') || context?.propertyKey?.includes('color')) {
        const backgroundColor = context.otherProperties?.backgroundColor || '#FFFFFF';

        // Cálculo simplificado de contraste
        const contrast = calculateColorContrast(value, backgroundColor);

        if (contrast < 4.5) {
          return {
            isValid: false,
            message: `Contraste insuficiente (${contrast.toFixed(1)}:1)`,
            suggestion: 'Use cores com maior contraste para melhor legibilidade (mínimo 4.5:1)'
          };
        }
      }

      return { isValid: true };
    }
  },

  // SEO
  {
    id: 'title-length',
    name: 'Comprimento do Título',
    description: 'Títulos devem ter comprimento adequado para SEO',
    category: ValidationCategory.SEO,
    severity: ValidationSeverity.WARNING,
    validator: (value: string, context) => {
      if (!value || typeof value !== 'string') {
        return { isValid: true };
      }

      if (context?.propertyKey?.includes('title') || context?.propertyKey?.includes('heading')) {
        const length = value.length;

        if (length < 10) {
          return {
            isValid: false,
            message: 'Título muito curto para SEO',
            suggestion: 'Use pelo menos 10 caracteres para melhor otimização'
          };
        }

        if (length > 60) {
          return {
            isValid: false,
            message: 'Título muito longo para SEO',
            suggestion: 'Mantenha até 60 caracteres para melhor exibição em buscadores'
          };
        }
      }

      return { isValid: true };
    }
  },

  // Performance
  {
    id: 'image-size-warning',
    name: 'Tamanho de Imagem',
    description: 'Alerta sobre possíveis problemas de performance com imagens',
    category: ValidationCategory.PERFORMANCE,
    severity: ValidationSeverity.INFO,
    validator: (value: string, context) => {
      if (!value || typeof value !== 'string') {
        return { isValid: true };
      }

      if (context?.propertyKey?.includes('src') && value.startsWith('http')) {
        // Verificar se é uma URL Cloudinary otimizada
        if (!value.includes('cloudinary.com')) {
          return {
            isValid: false,
            message: 'Imagem não otimizada',
            suggestion: 'Use imagens do Cloudinary para melhor performance'
          };
        }
      }

      return { isValid: true };
    }
  },

  // Design
  {
    id: 'consistent-spacing',
    name: 'Espaçamento Consistente',
    description: 'Verifica se os espaçamentos seguem padrões consistentes',
    category: ValidationCategory.DESIGN,
    severity: ValidationSeverity.INFO,
    validator: (value: number, context) => {
      if (typeof value !== 'number') {
        return { isValid: true };
      }

      if (context?.propertyKey?.includes('margin') || context?.propertyKey?.includes('padding')) {
        // Verificar se usa valores múltiplos de 4 (design system)
        if (value % 4 !== 0) {
          return {
            isValid: false,
            message: 'Espaçamento inconsistente',
            suggestion: 'Use valores múltiplos de 4 para consistência visual',
            autoFixValue: Math.round(value / 4) * 4
          };
        }
      }

      return { isValid: true };
    },
    autoFix: (value: number) => Math.round(value / 4) * 4
  },

  // Content
  {
    id: 'empty-content',
    name: 'Conteúdo Vazio',
    description: 'Detecta campos de conteúdo que estão vazios',
    category: ValidationCategory.CONTENT,
    severity: ValidationSeverity.WARNING,
    validator: (value: any, context) => {
      if (context?.propertyKey?.includes('text') ||
        context?.propertyKey?.includes('content') ||
        context?.propertyKey?.includes('title')) {

        if (!value || (typeof value === 'string' && !value.trim())) {
          return {
            isValid: false,
            message: 'Conteúdo vazio',
            suggestion: 'Adicione conteúdo significativo para melhor experiência do usuário'
          };
        }
      }

      return { isValid: true };
    }
  }
];

// ===== UTILITIES =====

/**
 * Calcula o contraste entre duas cores (simplificado)
 */
function calculateColorContrast(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Mapeia categoria para metadados visuais
 */
const CATEGORY_META = {
  [ValidationCategory.INTERPOLATION]: {
    icon: Zap,
    label: 'Interpolação',
    color: 'text-blue-600'
  },
  [ValidationCategory.ACCESSIBILITY]: {
    icon: Accessibility,
    label: 'Acessibilidade',
    color: 'text-green-600'
  },
  [ValidationCategory.SEO]: {
    icon: Search,
    label: 'SEO',
    color: 'text-purple-600'
  },
  [ValidationCategory.PERFORMANCE]: {
    icon: Zap,
    label: 'Performance',
    color: 'text-orange-600'
  },
  [ValidationCategory.DESIGN]: {
    icon: Eye,
    label: 'Design',
    color: 'text-pink-600'
  },
  [ValidationCategory.CONTENT]: {
    icon: Info,
    label: 'Conteúdo',
    color: 'text-indigo-600'
  },
  [ValidationCategory.TECHNICAL]: {
    icon: Shield,
    label: 'Técnico',
    color: 'text-gray-600'
  }
};

/**
 * Mapeia severidade para metadados visuais
 */
const SEVERITY_META = {
  [ValidationSeverity.ERROR]: {
    icon: AlertCircle,
    label: 'Erro',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  [ValidationSeverity.WARNING]: {
    icon: AlertTriangle,
    label: 'Aviso',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  [ValidationSeverity.INFO]: {
    icon: Info,
    label: 'Info',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  [ValidationSeverity.SUCCESS]: {
    icon: CheckCircle,
    label: 'Sucesso',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
};

// ===== COMPONENTE PRINCIPAL =====

export const EnhancedValidationSystem: React.FC<EnhancedValidationSystemProps> = ({
  properties,
  context,
  onValidationChange,
  onAutoFix,
  className
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ValidationCategory | 'all'>('all');

  // Executar validações
  const validationIssues = useMemo((): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    Object.entries(properties).forEach(([propertyKey, value]) => {
      const propertyContext: ValidationContext = {
        ...context,
        propertyKey,
        otherProperties: properties
      };

      VALIDATION_RULES.forEach(rule => {
        try {
          const result = rule.validator(value, propertyContext);

          if (!result.isValid) {
            issues.push({
              ruleId: rule.id,
              propertyKey,
              severity: rule.severity,
              message: result.message || rule.name,
              suggestion: result.suggestion || rule.suggestion,
              autoFixValue: result.autoFixValue,
              category: rule.category
            });
          }
        } catch (error) {
          console.warn(`Erro na validação ${rule.id}:`, error);
        }
      });
    });

    return issues;
  }, [properties, context]);

  // Notificar mudanças
  useEffect(() => {
    onValidationChange?.(validationIssues);
  }, [validationIssues, onValidationChange]);

  // Filtrar issues por categoria
  const filteredIssues = useMemo(() => {
    if (selectedCategory === 'all') return validationIssues;
    return validationIssues.filter(issue => issue.category === selectedCategory);
  }, [validationIssues, selectedCategory]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = validationIssues.length;
    const errors = validationIssues.filter(i => i.severity === ValidationSeverity.ERROR).length;
    const warnings = validationIssues.filter(i => i.severity === ValidationSeverity.WARNING).length;
    const infos = validationIssues.filter(i => i.severity === ValidationSeverity.INFO).length;

    const score = Math.max(0, 100 - (errors * 20) - (warnings * 10) - (infos * 5));

    return { total, errors, warnings, infos, score };
  }, [validationIssues]);

  // Handlers
  const handleAutoFix = useCallback((issue: ValidationIssue) => {
    if (issue.autoFixValue !== undefined && onAutoFix) {
      onAutoFix(issue.propertyKey, issue.autoFixValue);
    }
  }, [onAutoFix]);

  if (validationIssues.length === 0) {
    return (
      <Card className={cn('border-green-200 bg-green-50', className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Todas as validações passaram!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-orange-200 bg-orange-50', className)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-700">
              Validação ({stats.total} {stats.total === 1 ? 'problema' : 'problemas'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Score: {stats.score}%
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Progress Score */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Qualidade Geral</span>
            <span>{stats.score}%</span>
          </div>
          <Progress
            value={stats.score}
            className={cn(
              'h-2',
              stats.score >= 80 ? 'bg-green-100' :
                stats.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            )}
          />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-red-100 rounded">
            <div className="text-lg font-bold text-red-600">{stats.errors}</div>
            <div className="text-xs text-red-700">Erros</div>
          </div>
          <div className="text-center p-2 bg-yellow-100 rounded">
            <div className="text-lg font-bold text-yellow-600">{stats.warnings}</div>
            <div className="text-xs text-yellow-700">Avisos</div>
          </div>
          <div className="text-center p-2 bg-blue-100 rounded">
            <div className="text-lg font-bold text-blue-600">{stats.infos}</div>
            <div className="text-xs text-blue-700">Informações</div>
          </div>
        </div>

        {/* Detalhes expandidos */}
        {showDetails && (
          <div className="space-y-3">
            {/* Filtro por categoria */}
            <div className="flex flex-wrap gap-1">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="text-xs"
              >
                Todos ({validationIssues.length})
              </Button>

              {Object.values(ValidationCategory).map(category => {
                const count = validationIssues.filter(i => i.category === category).length;
                if (count === 0) return null;

                const meta = CATEGORY_META[category];
                const Icon = meta.icon;

                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs flex items-center gap-1"
                  >
                    <Icon className="w-3 h-3" />
                    {meta.label} ({count})
                  </Button>
                );
              })}
            </div>

            {/* Lista de issues */}
            <div className="space-y-2">
              {filteredIssues.map((issue, index) => {
                const severityMeta = SEVERITY_META[issue.severity];
                const categoryMeta = CATEGORY_META[issue.category];
                const SeverityIcon = severityMeta.icon;
                const CategoryIcon = categoryMeta.icon;

                return (
                  <div
                    key={`${issue.ruleId}-${issue.propertyKey}-${index}`}
                    className={cn(
                      'p-3 border rounded-lg',
                      severityMeta.bgColor,
                      severityMeta.borderColor
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <SeverityIcon className={cn('w-4 h-4', severityMeta.color)} />
                          <Badge variant="outline" className="text-xs">
                            {issue.propertyKey}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <CategoryIcon className="w-3 h-3" />
                            {categoryMeta.label}
                          </Badge>
                        </div>

                        <div className={cn('font-medium text-sm', severityMeta.color)}>
                          {issue.message}
                        </div>

                        {issue.suggestion && (
                          <div className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                            <Lightbulb className="w-3 h-3 mt-0.5 text-yellow-500" />
                            {issue.suggestion}
                          </div>
                        )}
                      </div>

                      {issue.autoFixValue !== undefined && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAutoFix(issue)}
                                className="ml-2"
                              >
                                <Zap className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Corrigir automaticamente</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedValidationSystem;