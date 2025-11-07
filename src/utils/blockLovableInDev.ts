// Desabilitar conexões Lovable APENAS em desenvolvimento local (não no preview do Lovable)
if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || import.meta.env.DEV)) {
    // Detectar se estamos dentro do iframe do preview do Lovable
    const isInLovablePreview = window.self !== window.top;
    
    // IMPORTANTE: Não bloquear se estivermos no preview do Lovable
    if (isInLovablePreview) {
        console.log('✅ Preview do Lovable detectado - mantendo conexões ativas');
    } else {
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
                    CLOSED: 3,
                } as any;
            }
            return new originalWebSocket(url, protocols);
        };

        // Interceptar fetch para APIs do Lovable (incluindo SDK)
    const originalFetch = window.fetch;
    window.fetch = function (url: RequestInfo | URL, options?: RequestInit) {
            // Normaliza Request/URL/string para capturar endpoints chamados via Request objects
            let urlString: string;
            if (typeof url === 'string') {
                urlString = url;
            } else if (url instanceof URL) {
                urlString = url.toString();
            } else if (typeof Request !== 'undefined' && url instanceof Request) {
                urlString = url.url;
            } else {
                urlString = String(url);
            }
            if (urlString.includes('lovable.dev') || urlString.includes('rs.lovable.dev')) {
                console.warn('🚫 Bloqueada requisição para Lovable/SDK em desenvolvimento:', url);

                // Retornar mock específico para diferentes endpoints
                if (urlString.includes('sourceConfig')) {
                    return Promise.resolve(new Response(JSON.stringify({
                        status: 'disabled_in_dev',
                        message: 'Lovable SDK disabled in development',
                        config: {},
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }));
                }
                // Endpoint específico citado nos logs: /projects/:id/collaborators → retornar 200 vazio
                if (/\/projects\/.+\/collaborators/.test(urlString)) {
                    return Promise.resolve(new Response(JSON.stringify({ collaborators: [] }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }));
                }
                // Em vez de rejeitar (gerando erros no console), retornamos resposta neutra
                return Promise.resolve(new Response(JSON.stringify({
                    status: 'blocked_in_dev',
                    ok: true,
                    message: 'Lovable request silently neutralized in development'
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            return originalFetch(url, options);
        };

        // Interceptar XMLHttpRequest para capturar chamadas legacy ou libs sem fetch
        if (typeof XMLHttpRequest !== 'undefined') {
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
                const urlString = typeof url === 'string' ? url : url.toString();
                const shouldBlock = urlString.includes('lovable.dev') || urlString.includes('rs.lovable.dev');
                (this as any).__lovableBlocked = shouldBlock;

                if (shouldBlock) {
                    console.warn('🚫 Bloqueada XHR para Lovable/SDK em desenvolvimento:', urlString);
                    (this as any).__lovableMockResponse = JSON.stringify({
                        status: 'blocked_in_dev',
                        ok: true,
                        message: 'Lovable XHR neutralized in development'
                    });
                    // Não chama open original para evitar requisição real
                    return;
                }

                return originalOpen.call(this, method, url as any, async, username ?? null, password ?? null);
            };

            XMLHttpRequest.prototype.send = function (this: XMLHttpRequest, body?: Document | BodyInit | null) {
                if ((this as any).__lovableBlocked) {
                    const responsePayload = (this as any).__lovableMockResponse ?? '';

                    const applyMock = () => {
                        const define = (prop: keyof XMLHttpRequest, value: any) => {
                            try {
                                Object.defineProperty(this, prop, {
                                    configurable: true,
                                    get: () => value,
                                });
                            } catch { /* ignore descriptor errors */ }
                        };
                        define('readyState', 4);
                        define('status', 200);
                        define('response', responsePayload);
                        define('responseText', responsePayload);
                        try { this.dispatchEvent(new Event('readystatechange')); } catch { }
                        try { this.dispatchEvent(new Event('load')); } catch { }
                        try { this.dispatchEvent(new Event('loadend')); } catch { }
                    };

                    setTimeout(applyMock, 0);
                    return;
                }

                return originalSend.call(this, body as Document | XMLHttpRequestBodyInit | null | undefined);
            };
        }

        // Interceptar navigator.sendBeacon para bloquear telemetria
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const originalSendBeacon = navigator.sendBeacon.bind(navigator);
            navigator.sendBeacon = function (url: string | URL, data?: BodyInit | null) {
                const urlString = typeof url === 'string' ? url : url.toString();
                if (urlString.includes('lovable.dev') || urlString.includes('rs.lovable.dev')) {
                    console.warn('🚫 Bloqueado sendBeacon para Lovable em desenvolvimento:', urlString);
                    return true;
                }
                return originalSendBeacon(url, data);
            };
        }

        // Bloquear scripts Lovable que podem ser carregados dinamicamente
        const originalCreateElement = document.createElement;
        document.createElement = function (tagName: string) {
            const element = originalCreateElement.call(document, tagName);
            if (tagName.toLowerCase() === 'script') {
                const scriptElement = element as HTMLScriptElement;
                const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src')?.set;
                if (originalSrcSetter) {
                    Object.defineProperty(scriptElement, 'src', {
                        set (value: string) {
                            if (value && value.includes('lovable.dev')) {
                                console.warn('🚫 Bloqueado script Lovable em desenvolvimento:', value);
                                return;
                            }
                            originalSrcSetter.call(this, value);
                        },
                        get () {
                            return this.getAttribute('src');
                        },
                    });
                }
            }
            return element;
        };

        console.log('🛡️ Proteção expandida contra Lovable/SDK ativada para desenvolvimento LOCAL');
    }
}

export { };
