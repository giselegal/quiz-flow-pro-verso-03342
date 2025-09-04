/**
 * 🔗 SISTEMA DE INTERPOLAÇÃO VISUAL
 *
 * Componente para exibir e editar campos com suporte a variáveis dinâmicas,
 * incluindo preview em tempo real e validação de sintaxe.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Code, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Info,
  Sparkles
} from 'lucide-react';
import { DynamicVariable, AVAILABLE_VARIABLES } from '@/services/PropertyExtractionService';

interface InterpolationFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  availableVariables?: DynamicVariable[];
  placeholder?: string;
  description?: string;
  multiline?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

/**
 * Campo de texto com suporte a interpolação de variáveis
 */
export const InterpolationField: React.FC<InterpolationFieldProps> = ({
  label,
  value = '',
  onChange,
  availableVariables = AVAILABLE_VARIABLES,
  placeholder = 'Digite o texto...',
  description,
  multiline = false,
  required = false,
  error,
  className = ''
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  // Validação de sintaxe de interpolação
  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Verificar sintaxe de variáveis
    const variablePattern = /\{([^}]+)\}/g;
    const matches = [...value.matchAll(variablePattern)];
    
    matches.forEach(match => {
      const variableName = match[1];
      const availableKeys = availableVariables.map(v => v.key);
      
      if (!availableKeys.includes(variableName)) {
        errors.push(`Variável "{${variableName}}" não encontrada`);
      }
    });

    // Verificar chaves não fechadas
    const openBraces = (value.match(/\{/g) || []).length;
    const closeBraces = (value.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push('Chaves não balanceadas');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      hasVariables: matches.length > 0
    };
  }, [value, availableVariables]);

  // Preview com interpolação aplicada
  const interpolatedPreview = useMemo(() => {
    let result = value;
    
    availableVariables.forEach(variable => {
      const pattern = new RegExp(`\\{${variable.key}\\}`, 'g');
      result = result.replace(pattern, variable.currentValue);
    });
    
    return result;
  }, [value, availableVariables]);

  // Inserir variável na posição do cursor
  const insertVariable = useCallback((variable: DynamicVariable) => {
    const variableText = `{${variable.key}}`;
    
    // Em um caso real, pegaria a posição do cursor
    const newValue = value + variableText;
    onChange(newValue);
    setShowVariables(false);
  }, [value, onChange]);

  // Componente de input baseado no tipo
  const InputComponent = multiline ? Textarea : Input;

  return (
    <TooltipProvider>
      <div className={`space-y-2 ${className}`}>
        {/* Label com indicadores */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor={label} className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive">*</span>}
            </Label>
            
            {validation.hasVariables && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Dinâmico
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Botão de preview */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="h-6 w-6 p-0"
                >
                  {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
              </TooltipContent>
            </Tooltip>

            {/* Status de validação */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  {validation.isValid ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {validation.isValid ? 'Sintaxe válida' : validation.errors[0]}
              </TooltipContent>
            </Tooltip>

            {/* Menu de variáveis */}
            <Popover open={showVariables} onOpenChange={setShowVariables}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Variáveis Disponíveis</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {availableVariables.map(variable => (
                      <div
                        key={variable.key}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                        onClick={() => insertVariable(variable)}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium">{variable.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {variable.description}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            <Code className="w-3 h-3 mr-1" />
                            {`{${variable.key}}`}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {variable.currentValue}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Descrição */}
        {description && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            {description}
          </div>
        )}

        {/* Campo de input */}
        <InputComponent
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${!validation.isValid ? 'border-destructive' : ''} ${
            validation.hasVariables ? 'border-primary' : ''
          }`}
          {...(multiline && { className: `${!validation.isValid ? 'border-destructive' : ''} min-h-[100px]` })}
        />

        {/* Preview interpolado */}
        {showPreview && validation.hasVariables && (
          <div className="p-3 bg-muted/50 rounded border">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Preview com valores atuais:
            </div>
            <div className="text-sm">{interpolatedPreview}</div>
          </div>
        )}

        {/* Erros de validação */}
        {error && (
          <div className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}

        {!validation.isValid && (
          <div className="space-y-1">
            {validation.errors.map((err, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="w-3 h-3" />
                {err}
              </div>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

/**
 * Preview de interpolação para qualquer texto
 */
export const InterpolationPreview: React.FC<{
  text: string;
  variables?: DynamicVariable[];
  className?: string;
}> = ({ 
  text, 
  variables = AVAILABLE_VARIABLES,
  className = ''
}) => {
  const interpolated = useMemo(() => {
    let result = text;
    
    variables.forEach(variable => {
      const pattern = new RegExp(`\\{${variable.key}\\}`, 'g');
      result = result.replace(pattern, variable.currentValue);
    });
    
    return result;
  }, [text, variables]);

  return (
    <div className={`p-2 bg-muted/30 rounded text-sm ${className}`}>
      {interpolated}
    </div>
  );
};

/**
 * Validador de sintaxe de interpolação
 */
export const validateInterpolation = (
  text: string, 
  availableVariables: DynamicVariable[] = AVAILABLE_VARIABLES
) => {
  const errors: string[] = [];
  const variables: string[] = [];

  // Extrair variáveis do texto
  const variablePattern = /\{([^}]+)\}/g;
  const matches = [...text.matchAll(variablePattern)];
  
  matches.forEach(match => {
    const variableName = match[1];
    variables.push(variableName);
    
    const availableKeys = availableVariables.map(v => v.key);
    if (!availableKeys.includes(variableName)) {
      errors.push(`Variável "${variableName}" não encontrada`);
    }
  });

  // Verificar chaves balanceadas
  const openBraces = (text.match(/\{/g) || []).length;
  const closeBraces = (text.match(/\}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    errors.push('Chaves não balanceadas');
  }

  return {
    isValid: errors.length === 0,
    errors,
    variables,
    hasVariables: variables.length > 0
  };
};

/**
 * Hook para gerenciar interpolação
 */
export const useInterpolation = (
  availableVariables: DynamicVariable[] = AVAILABLE_VARIABLES
) => {
  const interpolate = useCallback((text: string) => {
    let result = text;
    
    availableVariables.forEach(variable => {
      const pattern = new RegExp(`\\{${variable.key}\\}`, 'g');
      result = result.replace(pattern, variable.currentValue);
    });
    
    return result;
  }, [availableVariables]);

  const validate = useCallback((text: string) => {
    return validateInterpolation(text, availableVariables);
  }, [availableVariables]);

  return {
    interpolate,
    validate,
    availableVariables
  };
};