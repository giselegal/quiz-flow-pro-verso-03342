/**
 * 🎯 EDITOR FUNNEL CONTEXT
 * 
 * Contexto global que propaga funnelId automaticamente para todos os componentes filhos.
 * Evita prop drilling e centraliza a lógica de resolução do funnelId.
 * 
 * Fontes de funnelId (em ordem de prioridade):
 * 1. Prop explícita passada ao provider
 * 2. URL query parameter (?funnel=xxx ou ?funnelId=xxx)
 * 3. localStorage (última sessão)
 * 4. String vazia (canvas em branco)
 */

import React, { createContext, useContext, useMemo, useEffect, useState, useCallback } from 'react';
import { NO_FUNNEL_ID, isValidFunnelId, getFunnelIdOrEmpty } from '@/constants/editor';
import { appLogger } from '@/lib/utils/logger';

// ============================================================
// TIPOS
// ============================================================

interface EditorFunnelContextValue {
  /** ID do funil atual */
  funnelId: string;
  /** Se o funnelId é válido (não vazio) */
  hasFunnel: boolean;
  /** Atualizar o funnelId programaticamente */
  setFunnelId: (id: string) => void;
  /** Obter funnelId da URL */
  getFunnelIdFromUrl: () => string;
  /** Step atual do editor */
  currentStep: number;
  /** Atualizar step atual */
  setCurrentStep: (step: number) => void;
}

interface EditorFunnelProviderProps {
  children: React.ReactNode;
  /** funnelId explícito (sobrescreve URL e localStorage) */
  funnelId?: string;
  /** Step inicial */
  initialStep?: number;
  /** Callback quando funnelId muda */
  onFunnelChange?: (funnelId: string) => void;
}

// ============================================================
// CONTEXTO
// ============================================================

const EditorFunnelContext = createContext<EditorFunnelContextValue | null>(null);

// ============================================================
// HOOK PRINCIPAL
// ============================================================

/**
 * Hook para acessar o funnelId do contexto do editor
 * @throws Error se usado fora do EditorFunnelProvider
 */
export function useEditorFunnel(): EditorFunnelContextValue {
  const context = useContext(EditorFunnelContext);
  
  if (!context) {
    throw new Error(
      'useEditorFunnel deve ser usado dentro de um EditorFunnelProvider. ' +
      'Certifique-se de que o componente está envolvido pelo provider.'
    );
  }
  
  return context;
}

/**
 * Hook para acessar o funnelId do contexto do editor (versão segura)
 * Retorna undefined se usado fora do provider em vez de lançar erro
 */
export function useEditorFunnelSafe(): EditorFunnelContextValue | null {
  return useContext(EditorFunnelContext);
}

/**
 * Hook simplificado que retorna apenas o funnelId
 */
export function useFunnelId(): string {
  const context = useEditorFunnelSafe();
  return context?.funnelId ?? NO_FUNNEL_ID;
}

// ============================================================
// HELPERS
// ============================================================

const STORAGE_KEY = 'editor_funnel_id';

/** Extrair funnelId da URL */
function extractFunnelIdFromUrl(): string {
  if (typeof window === 'undefined') return NO_FUNNEL_ID;
  
  try {
    const params = new URLSearchParams(window.location.search);
    const funnelId = params.get('funnel') || params.get('funnelId') || '';
    return getFunnelIdOrEmpty(funnelId);
  } catch {
    return NO_FUNNEL_ID;
  }
}

/** Carregar funnelId do localStorage */
function loadFunnelIdFromStorage(): string {
  if (typeof window === 'undefined') return NO_FUNNEL_ID;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return getFunnelIdOrEmpty(stored || '');
  } catch {
    return NO_FUNNEL_ID;
  }
}

/** Salvar funnelId no localStorage */
function saveFunnelIdToStorage(funnelId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (isValidFunnelId(funnelId)) {
      localStorage.setItem(STORAGE_KEY, funnelId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignorar erros de storage
  }
}

/** Atualizar URL com funnelId sem recarregar a página */
function updateUrlWithFunnelId(funnelId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const url = new URL(window.location.href);
    
    if (isValidFunnelId(funnelId)) {
      url.searchParams.set('funnel', funnelId);
    } else {
      url.searchParams.delete('funnel');
      url.searchParams.delete('funnelId');
    }
    
    window.history.replaceState({}, '', url.toString());
  } catch {
    // Ignorar erros de URL
  }
}

// ============================================================
// PROVIDER
// ============================================================

export const EditorFunnelProvider: React.FC<EditorFunnelProviderProps> = ({
  children,
  funnelId: propFunnelId,
  initialStep = 1,
  onFunnelChange,
}) => {
  // Resolver funnelId inicial
  const resolveInitialFunnelId = useCallback((): string => {
    // 1. Prop explícita tem prioridade
    if (isValidFunnelId(propFunnelId)) {
      return propFunnelId;
    }
    
    // 2. URL query parameter
    const urlFunnelId = extractFunnelIdFromUrl();
    if (isValidFunnelId(urlFunnelId)) {
      return urlFunnelId;
    }
    
    // 3. localStorage (última sessão)
    const storedFunnelId = loadFunnelIdFromStorage();
    if (isValidFunnelId(storedFunnelId)) {
      return storedFunnelId;
    }
    
    // 4. Sem funil (canvas em branco)
    return NO_FUNNEL_ID;
  }, [propFunnelId]);

  const [funnelId, setFunnelIdState] = useState<string>(resolveInitialFunnelId);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Atualizar quando prop mudar
  useEffect(() => {
    if (isValidFunnelId(propFunnelId) && propFunnelId !== funnelId) {
      setFunnelIdState(propFunnelId);
    }
  }, [propFunnelId, funnelId]);

  // Sincronizar com URL quando funnelId mudar
  useEffect(() => {
    if (isValidFunnelId(funnelId)) {
      saveFunnelIdToStorage(funnelId);
      updateUrlWithFunnelId(funnelId);
      onFunnelChange?.(funnelId);
      
      appLogger.debug('🎯 EditorFunnelContext: funnelId atualizado', { funnelId });
    }
  }, [funnelId, onFunnelChange]);

  // Setter público
  const setFunnelId = useCallback((newFunnelId: string) => {
    const sanitized = getFunnelIdOrEmpty(newFunnelId);
    setFunnelIdState(sanitized);
    
    appLogger.debug('🎯 EditorFunnelContext: setFunnelId chamado', { 
      from: funnelId, 
      to: sanitized 
    });
  }, [funnelId]);

  // Getter para URL
  const getFunnelIdFromUrl = useCallback(() => {
    return extractFunnelIdFromUrl();
  }, []);

  // Valor do contexto (memoizado)
  const value = useMemo<EditorFunnelContextValue>(() => ({
    funnelId,
    hasFunnel: isValidFunnelId(funnelId),
    setFunnelId,
    getFunnelIdFromUrl,
    currentStep,
    setCurrentStep,
  }), [funnelId, setFunnelId, getFunnelIdFromUrl, currentStep]);

  return (
    <EditorFunnelContext.Provider value={value}>
      {children}
    </EditorFunnelContext.Provider>
  );
};

// ============================================================
// HOC PARA COMPONENTES QUE PRECISAM DE FUNNEL ID
// ============================================================

/**
 * HOC que injeta funnelId automaticamente em componentes
 */
export function withFunnelId<P extends { funnelId?: string }>(
  WrappedComponent: React.ComponentType<P>
): React.FC<Omit<P, 'funnelId'>> {
  const WithFunnelId: React.FC<Omit<P, 'funnelId'>> = (props) => {
    const { funnelId } = useEditorFunnel();
    
    return <WrappedComponent {...(props as P)} funnelId={funnelId} />;
  };
  
  WithFunnelId.displayName = `withFunnelId(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithFunnelId;
}

export default EditorFunnelContext;
