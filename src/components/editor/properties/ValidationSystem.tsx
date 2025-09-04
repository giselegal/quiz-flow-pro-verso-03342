/**
 * 🛡️ SISTEMA DE VALIDAÇÃO SIMPLIFICADO
 * 
 * Sistema de validação focado nas funcionalidades essenciais
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion?: string;
}

interface ValidationIndicatorProps {
  result: ValidationResult;
  className?: string;
}

export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({
  result,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {result.isValid ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <Badge variant="outline" className="text-green-600">
            Válido ({result.score}%)
          </Badge>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <Badge variant="outline" className="text-orange-600">
            {result.issues.length} problemas
          </Badge>
        </>
      )}
    </div>
  );
};

export const validateProperty = (key: string, value: any): ValidationResult => {
  const issues: ValidationIssue[] = [];
  
  // Validações básicas
  if (!value && ['title', 'content', 'text'].some(req => key.includes(req))) {
    issues.push({
      type: 'warning',
      category: 'content',
      message: 'Campo obrigatório vazio',
      suggestion: 'Preencha este campo para melhorar a experiência'
    });
  }

  const score = Math.max(0, 100 - (issues.length * 25));
  
  return {
    isValid: issues.filter(i => i.type === 'error').length === 0,
    score,
    issues
  };
};