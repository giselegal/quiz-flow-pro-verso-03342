// 🛡️ REACT GLOBAL PRELOAD - CRITICAL FIX
// Este arquivo DEVE ser carregado ANTES de qualquer outro módulo
// Garante que React esteja disponível globalmente para evitar erros de "exports undefined"

// ⚠️ CRITICAL: Importar de forma síncrona para garantir disponibilidade imediata
import * as ReactNamespace from 'react';
import * as ReactDOMNamespace from 'react-dom/client';

// Usar default export se disponível, senão usar namespace completo
const React = (ReactNamespace as any).default || ReactNamespace;
const ReactDOM = (ReactDOMNamespace as any).default || ReactDOMNamespace;

// 🔧 FIX: Expor React globalmente ANTES de qualquer vendor bundle tentar acessá-lo
if (typeof window !== 'undefined') {
  // Garantir que React está disponível em múltiplos formatos para compatibilidade
  const reactModule = {
    ...React,
    default: React,
    __esModule: true,
    version: React.version || '18.0.0',
  };

  const reactDOMModule = {
    ...ReactDOM,
    default: ReactDOM,
    __esModule: true,
  };

  // Expor React em todos os formatos possíveis que vendors minificados podem procurar
  (window as any).React = reactModule;
  (window as any).ReactDOM = reactDOMModule;
  (window as any).react = reactModule; // lowercase para CommonJS

  // 🔧 FIX: Criar estrutura completa de módulo CommonJS
  const commonJSExports = {
    React: reactModule,
    ReactDOM: reactDOMModule,
    default: reactModule,
    __esModule: true,
  };

  if (!(window as any).exports) {
    (window as any).exports = commonJSExports;
  } else {
    Object.assign((window as any).exports, commonJSExports);
  }

  // Garantir que module.exports também existe com estrutura completa
  if (!(window as any).module) {
    (window as any).module = { exports: commonJSExports };
  } else if (!(window as any).module.exports) {
    (window as any).module.exports = commonJSExports;
  } else {
    Object.assign((window as any).module.exports, commonJSExports);
  }

  // Flag para indicar que preload está completo
  (window as any).__REACT_PRELOAD_READY__ = true;

  console.log('✅ [react-preload] React módulo global configurado', {
    hasReact: !!(window as any).React,
    hasExports: !!(window as any).exports,
    hasModuleExports: !!(window as any).module?.exports,
    reactVersion: React.version,
    windowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('react')),
  });
} else {
  console.warn('⚠️ [react-preload] Window não disponível - executando em SSR?');
}

// Re-exportar para importações normais
export default React;
export { React, ReactDOM };
