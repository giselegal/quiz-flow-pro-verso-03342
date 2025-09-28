import React, { useMemo } from 'react';

/**
 * SafeIframe
 * Wrapper padronizado para iframes com política de sandbox segura.
 * Evita uso simultâneo de allow-same-origin + allow-scripts (risco de quebra do sandbox),
 * permitindo opt-in controlado via props explícitas.
 */
export interface SafeIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    allowScripts?: boolean;       // Permite execução de scripts (desativa várias proteções)
    allowSameOrigin?: boolean;    // Permite acesso ao same-origin dentro do iframe
    allowForms?: boolean;
    allowPopups?: boolean;
    allowModals?: boolean;
    allowDownloads?: boolean;
    trustLevel?: 'untrusted' | 'trusted'; // trusted aplica menos sandbox, usado apenas para domínios explicitamente whitelisted
    /** Lista de domínios ou padrões RegExp (como string) permitidos para elevar confiança */
    trustedDomains?: (string | RegExp)[];
    /** Loga decisões de relaxamento de sandbox */
    debug?: boolean;
}

const DEFAULT_SANDBOX = [
    'allow-same-origin', // Mantemos para players (YouTube/Vimeo) funcionarem, mas controlamos scripts abaixo
    'allow-popups-to-escape-sandbox',
    'allow-forms',
];

// Observação: Não incluímos 'allow-scripts' por padrão.
// Caso seja necessário (ex: players que injetam JS), a prop allowScripts deve ser usada conscientemente.

export const SafeIframe: React.FC<SafeIframeProps> = ({
    allowScripts = false,
    allowSameOrigin = true,
    allowForms = true,
    allowPopups = false,
    allowModals = false,
    allowDownloads = false,
    trustLevel = 'untrusted',
    trustedDomains = [/youtube\.com$/, /youtu\.be$/, /vimeo\.com$/],
    debug = false,
    src = '',
    title,
    sandbox: _sandboxIgnored,
    allow: allowAttr,
    ...rest
}) => {
    const isTrusted = useMemo(() => {
        if (!src) return false;
        try {
            const url = new URL(src);
            const host = url.hostname;
            return trustedDomains.some(pattern => {
                if (typeof pattern === 'string') return host === pattern || host.endsWith(`.${pattern}`);
                return pattern.test(host);
            });
        } catch {
            return false;
        }
    }, [src, trustedDomains]);

    const sandboxTokens = new Set<string>();

    // Detecta players que normalmente necessitam de scripts para funcionar
    const requiresPlayerScripts = (() => {
        if (!src) return false;
        try {
            const host = new URL(src).hostname;
            return /youtube\.com$/.test(host) || /youtu\.be$/.test(host) || /player\.vimeo\.com$/.test(host) || /vimeo\.com$/.test(host);
        } catch { return false; }
    })();

    let effectiveAllowScripts = allowScripts;
    // Auto-enable para players confiáveis se o dev não desabilitou explicitamente
    if (!allowScripts && requiresPlayerScripts && isTrusted) {
        effectiveAllowScripts = true;
        if (debug) console.log('[SafeIframe] Auto habilitando allow-scripts para player confiável:', src);
    }

    if (allowForms) sandboxTokens.add('allow-forms');
    if (allowPopups) sandboxTokens.add('allow-popups');
    if (allowModals) sandboxTokens.add('allow-modals');
    if (allowDownloads) sandboxTokens.add('allow-downloads');

    if (effectiveAllowScripts && (isTrusted || trustLevel === 'trusted')) {
        sandboxTokens.add('allow-scripts');
        // Segurança: só adicionamos same-origin se explicitamente pedido e for truly trusted
        if (allowSameOrigin && trustLevel === 'trusted') {
            sandboxTokens.add('allow-same-origin');
        }
    } else {
        if (allowSameOrigin) sandboxTokens.add('allow-same-origin');
    }

    if (sandboxTokens.has('allow-scripts') && sandboxTokens.has('allow-same-origin') && trustLevel !== 'trusted') {
        sandboxTokens.delete('allow-same-origin');
        if (debug) console.warn('[SafeIframe] Removido allow-same-origin (combinação com scripts) para evitar escape:', src);
    }

    const sandboxFinal = Array.from(sandboxTokens).join(' ');

    if (debug) {
        console.log('[SafeIframe] mount', { src, sandboxFinal, isTrusted, trustLevel });
    }

    // Construir atributo allow (feature policy) mínimo necessário, mergeando se usuário forneceu algo
    const defaultAllow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    const finalAllow = allowAttr ? `${allowAttr}; ${defaultAllow}` : defaultAllow;

    return (
        <iframe
            src={src}
            title={title || 'embedded-content'}
            sandbox={sandboxFinal}
            allow={finalAllow}
            referrerPolicy="strict-origin-when-cross-origin"
            loading={rest.loading || 'lazy'}
            {...rest}
        />
    );
};

export default SafeIframe;
