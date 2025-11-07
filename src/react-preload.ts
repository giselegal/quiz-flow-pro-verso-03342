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
  if (!(React as any).forwardRef) {
    (React as any).forwardRef = safeForwardRef;
  }
  if (!(React as any).createRef) {
    (React as any).createRef = () => ({ current: null });
  }
  if (!(React as any).memo) {
    (React as any).memo = (c: any) => c;
  }

  // Expor múltiplos aliases porque alguns bundles minificados procuram variantes
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  (window as any).React__default = React;        // comum em output ESM convertido
  (window as any).ReactDefault = React;          // fallback adicional
  try { (globalThis as any).React = React; } catch { /* ignore */ }

  // Flag para outros módulos saberem que preload já rodou
  (window as any).__REACT_PRELOAD_READY__ = true;

  console.log('✅ [react-preload] React disponível globalmente (preload inicial)', {
    hasForwardRef: !!React.forwardRef,
    hasMemo: !!React.memo,
    hasCreateRef: !!React.createRef,
    aliases: ['React', 'React__default', 'ReactDefault']
  });
}

// Re-exportar para que main.tsx possa importar normalmente
export { React, ReactDOM };
