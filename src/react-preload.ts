// 🛡️ REACT GLOBAL PRELOAD - CRITICAL
// Este arquivo DEVE ser carregado ANTES de qualquer outro módulo
// Garante que React esteja disponível globalmente para todos os vendors

import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Expor React globalmente IMEDIATAMENTE
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  
  console.log('✅ [react-preload] React disponível globalmente', {
    hasForwardRef: !!React.forwardRef,
    hasMemo: !!React.memo,
    hasCreateRef: !!React.createRef,
  });
}

// Re-exportar para que main.tsx possa importar normalmente
export { React, ReactDOM };
