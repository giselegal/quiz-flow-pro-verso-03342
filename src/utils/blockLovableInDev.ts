// Desabilitar conexões Lovable em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Bloquear tentativas de conexão WebSocket para Lovable
    const originalWebSocket = window.WebSocket;
    (window as any).WebSocket = function (url: string | URL, protocols?: string | string[]) {
        if (url.toString().includes('lovable.dev')) {
            console.warn('🚫 Bloqueada conexão WebSocket para Lovable em desenvolvimento:', url);
            // Retornar um mock WebSocket que não faz nada
            return {
                close: () => { },
                send: () => { },
                addEventListener: () => { },
                removeEventListener: () => { },
                readyState: 3, // CLOSED
                CONNECTING: 0,
                OPEN: 1,
                CLOSING: 2,
                CLOSED: 3
            } as any;
        }
        return new originalWebSocket(url, protocols);
    };

    // Interceptar fetch para APIs do Lovable (incluindo SDK)
    const originalFetch = window.fetch;
    window.fetch = function (url: RequestInfo | URL, options?: RequestInit) {
        const urlString = url.toString();
        if (urlString.includes('lovable.dev') || urlString.includes('rs.lovable.dev')) {
            console.warn('🚫 Bloqueada requisição para Lovable/SDK em desenvolvimento:', url);

            // Retornar mock específico para diferentes endpoints
            if (urlString.includes('sourceConfig')) {
                return Promise.resolve(new Response(JSON.stringify({
                    status: 'disabled_in_dev',
                    message: 'Lovable SDK disabled in development',
                    config: {}
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }

            return Promise.reject(new Error('Lovable requests blocked in development'));
        }
        return originalFetch(url, options);
    };

    // Bloquear scripts Lovable que podem ser carregados dinamicamente
    const originalCreateElement = document.createElement;
    document.createElement = function (tagName: string) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'script') {
            const scriptElement = element as HTMLScriptElement;
            const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src')?.set;
            if (originalSrcSetter) {
                Object.defineProperty(scriptElement, 'src', {
                    set: function (value: string) {
                        if (value && value.includes('lovable.dev')) {
                            console.warn('🚫 Bloqueado script Lovable em desenvolvimento:', value);
                            return;
                        }
                        originalSrcSetter.call(this, value);
                    },
                    get: function () {
                        return this.getAttribute('src');
                    }
                });
            }
        }
        return element;
    };

    console.log('🛡️ Proteção expandida contra Lovable/SDK ativada para desenvolvimento');
}

export { };
