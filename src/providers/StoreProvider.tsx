/**
 * 🎯 STORE PROVIDER - Wrapper Mínimo para Stores Zustand
 * 
 * Provider extremamente simples que apenas garante que stores
 * estão disponíveis. Não gerencia estado - isso é feito pelas
 * stores Zustand diretamente.
 * 
 * SPRINT 3 - Substitui UnifiedAppProvider complexo
 */

import React, { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Provider minimalista que apenas:
 * 1. Detecta mudanças de viewport
 * 2. Deixa stores Zustand gerenciarem tudo
 */
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const setViewport = useUIStore((state) => state.setViewport);

  // Detectar mudanças de viewport
  useEffect(() => {
    const handleResize = () => {
      setViewport(window.innerWidth, window.innerHeight);
    };

    // Set initial viewport
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setViewport]);

  // Apenas renderiza children - stores são acessadas diretamente via hooks
  return <>{children}</>;
};

export default StoreProvider;
