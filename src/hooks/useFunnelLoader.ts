/**
 * 🔄 HOOK DE CARREGAMENTO E VALIDAÇÃO DE FUNIL
 * 
 * Hook responsável por:
 * - Gerenciar estado de carregamento do funil
 * - Validar existência e permissões
 * - Fornecer fallbacks e error handling
 * - Centralizar estado do funil atual
 */

import { useState, useEffect, useCallback } from 'react';
import { funnelValidationService, type FunnelValidationResult } from '@/services/funnelValidationService';

export interface FunnelLoadingState {
  // Estados de carregamento
  isLoading: boolean;
  isValidating: boolean;
  isError: boolean;
  
  // Dados do funil
  funnelId: string | null;
  funnel: any | null;
  validationResult: FunnelValidationResult | null;
  
  // Controle de erro
  error: string | null;
  errorType: string | null;
  
  // Sugestões e alternativas
  suggestions: string[];
  
  // Ações
  retry: () => void;
  validateFunnel: (id: string, userId?: string) => Promise<void>;
  clearError: () => void;
}

export function useFunnelLoader(initialFunnelId?: string, userId?: string): FunnelLoadingState {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [funnelId, setFunnelId] = useState<string | null>(initialFunnelId || null);
  const [funnel, setFunnel] = useState<any | null>(null);
  const [validationResult, setValidationResult] = useState<FunnelValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const clearError = useCallback(() => {
    setIsError(false);
    setError(null);
    setErrorType(null);
  }, []);

  const validateFunnel = useCallback(async (id: string, currentUserId?: string) => {
    if (!id) return;

    setIsValidating(true);
    setIsLoading(true);
    clearError();

    try {
      console.log('🔍 Validando funil:', id);
      
      const result = await funnelValidationService.validateFunnelAccess(id, currentUserId || userId);
      setValidationResult(result);

      if (result.isValid) {
        setFunnelId(id);
        setFunnel(result.funnel);
        console.log('✅ Funil validado com sucesso:', result.funnel);
      } else {
        setIsError(true);
        setError(result.error || 'Erro desconhecido');
        setErrorType(result.errorType || 'UNKNOWN');
        
        // Buscar sugestões de funis alternativos
        const alternativeSuggestions = await funnelValidationService.suggestAlternativeFunnels(id);
        setSuggestions(alternativeSuggestions);
        
        console.warn('❌ Falha na validação do funil:', result);
      }
    } catch (err) {
      console.error('🚨 Erro crítico na validação do funil:', err);
      setIsError(true);
      setError('Erro crítico ao validar funil');
      setErrorType('CRITICAL_ERROR');
    } finally {
      setIsValidating(false);
      setIsLoading(false);
    }
  }, [userId, clearError]);

  const retry = useCallback(() => {
    if (funnelId) {
      validateFunnel(funnelId, userId);
    }
  }, [funnelId, userId, validateFunnel]);

  // Auto-validar quando o funnelId inicial muda
  useEffect(() => {
    if (initialFunnelId && initialFunnelId !== funnelId) {
      validateFunnel(initialFunnelId, userId);
    }
  }, [initialFunnelId, userId, validateFunnel, funnelId]);

  return {
    isLoading,
    isValidating,
    isError,
    funnelId,
    funnel,
    validationResult,
    error,
    errorType,
    suggestions,
    retry,
    validateFunnel,
    clearError
  };
}

/**
 * 🎯 HOOK SIMPLIFICADO PARA CONTEXTO DE FUNIL
 */
export function useFunnelContext(funnelId?: string, userId?: string) {
  const funnelState = useFunnelLoader(funnelId, userId);
  
  return {
    // Estado simplificado
    isReady: !funnelState.isLoading && !funnelState.isError && funnelState.validationResult?.isValid,
    isLoading: funnelState.isLoading,
    hasError: funnelState.isError,
    
    // Dados do funil
    currentFunnel: funnelState.funnel,
    funnelId: funnelState.funnelId,
    
    // Informações de erro
    errorMessage: funnelState.error,
    errorType: funnelState.errorType,
    suggestions: funnelState.suggestions,
    
    // Permissões
    permissions: funnelState.validationResult?.funnel,
    canEdit: funnelState.validationResult?.hasPermission,
    
    // Ações
    retry: funnelState.retry,
    reload: () => funnelState.validateFunnel(funnelId || '', userId)
  };
}
