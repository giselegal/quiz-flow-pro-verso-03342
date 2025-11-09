// 🛡️ REACT GLOBAL PRELOAD - CRITICAL FIX
// Este arquivo DEVE ser carregado ANTES de qualquer outro módulo
// Garante que React esteja disponível globalmente para evitar erros de "exports undefined"

// ⚠️ CRITICAL: Importar React de forma padrão (ESM)
import React from 'react';
import ReactDOM from 'react-dom/client';

// 🔧 FIX: Expor React globalmente APENAS se necessário (em desenvolvimento)
if (typeof window !== 'undefined') {
  // Expor React globalmente para compatibilidade com vendors
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;

  // Flag para indicar que preload está completo
  (window as any).__REACT_PRELOAD_READY__ = true;

  if (import.meta.env.DEV) {
    console.log('✅ [react-preload] React configurado', {
      hasReact: !!React,
      hasReactDOM: !!ReactDOM,
      reactVersion: React.version,
    });
  }
}

// Re-exportar para importações normais
export default React;
export { React, ReactDOM };
