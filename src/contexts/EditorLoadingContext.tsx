/**
 * 🎯 EDITOR LOADING CONTEXT - SPRINT 2 Fase 2
 * 
 * Contexto unificado para gerenciar TODOS os estados de loading do editor
 * Elimina os 7 estados duplicados identificados na auditoria
 * 
 * Estados unificados:
 * ✅ isLoadingTemplate - Carregamento do template completo
 * ✅ isLoadingStep - Carregamento de um step específico
 * ✅ loadingBlocks - Set de IDs de blocos sendo carregados
 * ✅ errors - Map de erros por chave
 * ✅ progress - Progresso geral (0-100)
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface EditorLoadingContextType {
  // Estados de loading
  isLoadingTemplate: boolean;
  isLoadingStep: boolean;
  loadingBlocks: Set<string>;
  errors: Map<string, Error>;
  progress: number; // 0-100

  // Setters
  setTemplateLoading: (loading: boolean) => void;
  setStepLoading: (loading: boolean) => void;
  setBlockLoading: (blockId: string, loading: boolean) => void;
  setError: (key: string, error: Error | null) => void;
  clearErrors: () => void;

  // Helpers
  isAnyLoading: boolean;
  getBlockLoadingState: (blockId: string) => boolean;
  hasErrors: boolean;
  getError: (key: string) => Error | undefined;
}

const EditorLoadingContext = createContext<EditorLoadingContextType | undefined>(undefined);

export interface EditorLoadingProviderProps {
  children: React.ReactNode;
}

/**
 * Provider do contexto de loading unificado
 */
export const EditorLoadingProvider: React.FC<EditorLoadingProviderProps> = ({ children }) => {
  // Estados centralizados
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Map<string, Error>>(new Map());

  // 🎯 Setters otimizados
  const setTemplateLoading = useCallback((loading: boolean) => {
    setIsLoadingTemplate(loading);
  }, []);

  const setStepLoading = useCallback((loading: boolean) => {
    setIsLoadingStep(loading);
  }, []);

  const setBlockLoading = useCallback((blockId: string, loading: boolean) => {
    setLoadingBlocks((prev) => {
      const next = new Set(prev);
      if (loading) {
        next.add(blockId);
      } else {
        next.delete(blockId);
      }
      return next;
    });
  }, []);

  const setError = useCallback((key: string, error: Error | null) => {
    setErrors((prev) => {
      const next = new Map(prev);
      if (error) {
        next.set(key, error);
      } else {
        next.delete(key);
      }
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors(new Map());
  }, []);

  // 📊 Cálculo de progresso
  const progress = useMemo(() => {
    // Progresso simples baseado em estados ativos
    const total = 3; // template, step, blocks
    let completed = 0;

    if (!isLoadingTemplate) completed += 1;
    if (!isLoadingStep) completed += 1;
    if (loadingBlocks.size === 0) completed += 1;

    return Math.round((completed / total) * 100);
  }, [isLoadingTemplate, isLoadingStep, loadingBlocks.size]);

  // 🎯 Helpers derivados
  const isAnyLoading = useMemo(
    () => isLoadingTemplate || isLoadingStep || loadingBlocks.size > 0,
    [isLoadingTemplate, isLoadingStep, loadingBlocks.size],
  );

  const getBlockLoadingState = useCallback(
    (blockId: string): boolean => {
      return loadingBlocks.has(blockId);
    },
    [loadingBlocks],
  );

  const hasErrors = useMemo(() => errors.size > 0, [errors.size]);

  const getError = useCallback(
    (key: string): Error | undefined => {
      return errors.get(key);
    },
    [errors],
  );

  // 📦 Valor do contexto
  const value: EditorLoadingContextType = useMemo(
    () => ({
      // Estados
      isLoadingTemplate,
      isLoadingStep,
      loadingBlocks,
      errors,
      progress,

      // Setters
      setTemplateLoading,
      setStepLoading,
      setBlockLoading,
      setError,
      clearErrors,

      // Helpers
      isAnyLoading,
      getBlockLoadingState,
      hasErrors,
      getError,
    }),
    [
      isLoadingTemplate,
      isLoadingStep,
      loadingBlocks,
      errors,
      progress,
      setTemplateLoading,
      setStepLoading,
      setBlockLoading,
      setError,
      clearErrors,
      isAnyLoading,
      getBlockLoadingState,
      hasErrors,
      getError,
    ],
  );

  return <EditorLoadingContext.Provider value={value}>{children}</EditorLoadingContext.Provider>;
};

/**
 * Hook para acessar o contexto de loading
 * 
 * @throws Error se usado fora do EditorLoadingProvider
 */
export const useEditorLoading = (): EditorLoadingContextType => {
  const context = useContext(EditorLoadingContext);

  if (!context) {
    throw new Error('useEditorLoading deve ser usado dentro de EditorLoadingProvider');
  }

  return context;
};

/**
 * Hook opcional que retorna undefined se usado fora do provider
 * Útil para componentes que podem ou não estar dentro do provider
 */
export const useOptionalEditorLoading = (): EditorLoadingContextType | undefined => {
  return useContext(EditorLoadingContext);
};

export default EditorLoadingContext;
