// 🛡️ REACT GLOBAL PRELOAD - CRITICAL
// Este arquivo DEVE ser carregado ANTES de qualquer outro módulo
// Garante que React esteja disponível globalmente para todos os vendors

import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Expor React globalmente IMEDIATAMENTE
if (typeof window !== 'undefined') {
  // Criar stubs mínimos ANTES de qualquer vendor tocar em React
  const safeForwardRef = (render: any) => {
    // Mantém assinatura aproximada; ignora ref forwarding real se indisponível
    const Component = (props: any, ref: any) => render(props, ref);
    Component.displayName = render.displayName || render.name || 'ForwardRefStub';
    return Component;
  };

  // Garantir APIs críticas (forwardRef era a que estourava em vendor)
  // Não sobrescrever bindings de import (imutáveis em ESBuild). Criar shim separado.
  const reactShim: any = {
    ...React,
    forwardRef: (React as any).forwardRef || safeForwardRef,
    createRef: (React as any).createRef || (() => ({ current: null })),
    memo: (React as any).memo || ((c: any) => c),
  };

  // Expor múltiplos aliases porque alguns bundles minificados procuram variantes
  // Expor shim como React global para vendors minificados que acessam via window.React.forwardRef
  (window as any).React = reactShim;
  (window as any).ReactDOM = ReactDOM;
  (window as any).React__default = reactShim;        // comum em output ESM convertido
  (window as any).ReactDefault = reactShim;          // fallback adicional
  try { (globalThis as any).React = reactShim; } catch { /* ignore */ }

  // Flag para outros módulos saberem que preload já rodou
  (window as any).__REACT_PRELOAD_READY__ = true;

  console.log('✅ [react-preload] React shim global criado', {
    hasForwardRef: !!reactShim.forwardRef,
    hasMemo: !!reactShim.memo,
    hasCreateRef: !!reactShim.createRef,
    aliases: ['React', 'React__default', 'ReactDefault'],
    shim: true,
  });
}

// Re-exportar para que main.tsx possa importar normalmente
export { React, ReactDOM };
