// Desabilitar conexões Lovable em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Bloquear tentativas de conexão WebSocket para Lovable
  const originalWebSocket = window.WebSocket;
  (window as any).WebSocket = function(url: string | URL, protocols?: string | string[]) {
    if (url.toString().includes('lovable.dev')) {
      console.warn('🚫 Bloqueada conexão WebSocket para Lovable em desenvolvimento:', url);
      // Retornar um mock WebSocket que não faz nada
      return {
        close: () => {},
        send: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        readyState: 3, // CLOSED
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3
      } as any;
    }
    return new originalWebSocket(url, protocols);
  };

  // Interceptar fetch para APIs do Lovable
  const originalFetch = window.fetch;
  window.fetch = function(url: RequestInfo | URL, options?: RequestInit) {
    if (typeof url === 'string' && url.includes('lovable.dev')) {
      console.warn('🚫 Bloqueada requisição para Lovable em desenvolvimento:', url);
      return Promise.reject(new Error('Lovable requests blocked in development'));
    }
    return originalFetch(url, options);
  };

  console.log('🛡️ Proteção contra conexões Lovable ativada para desenvolvimento');
}

export {};
