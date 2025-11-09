// 🛡️ REACT GLOBAL PRELOAD - CRITICAL FIX
// Este arquivo DEVE ser carregado ANTES de qualquer outro módulo
// Garante que React esteja disponível globalmente para evitar erros de "exports undefined"

import React from 'react';
import ReactDOM from 'react-dom/client';

// 🔧 FIX: Expor React globalmente ANTES de qualquer vendor bundle tentar acessá-lo
if (typeof window !== 'undefined') {
  // Garantir que React está disponível em múltiplos formatos para compatibilidade
  const reactModule = {
    ...React,
    default: React,
    __esModule: true,
  };

  // Expor React em todos os formatos possíveis que vendors minificados podem procurar
  (window as any).React = reactModule;
  (window as any).ReactDOM = ReactDOM;

  // 🔧 FIX: Criar objeto "exports" que vendors CommonJS minificados esperam encontrar
  if (!(window as any).exports) {
    (window as any).exports = {};
  }
  (window as any).exports.React = reactModule;
  (window as any).exports.default = reactModule;

  // Garantir que module.exports também existe
  if (!(window as any).module) {
    (window as any).module = { exports: {} };
  }
  (window as any).module.exports = reactModule;
  (window as any).module.exports.default = reactModule;

  // Flag para indicar que preload está completo
  (window as any).__REACT_PRELOAD_READY__ = true;

  console.log('✅ [react-preload] React módulo global configurado', {
    hasReact: !!window.React,
    hasExports: !!(window as any).exports,
    hasModuleExports: !!(window as any).module?.exports,
    reactVersion: React.version,
  });
}

// Re-exportar para importações normais
export default React;
export { React, ReactDOM };
