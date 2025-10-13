// Silencia logs de debug/informação em produção, mantendo warn/error
// Ative logs definindo VITE_DEBUG_LOGS=true

declare const importMetaEnv: ImportMeta['env'];

const isProd = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;
const debugEnabled = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DEBUG_LOGS === 'true';

if (isProd && !debugEnabled && typeof window !== 'undefined') {
    try {
        const noop = () => { };
        const original = { ...console };
        // Preserva erros/avisos; silencia info/log/debug
        console.log = noop;
        console.info = noop;
        console.debug = noop;

        // Opcional: filtrar alguns warns muito ruidosos
        const noisyWarnings = [
            /Deprecated/i,
            /DevTools failed to load source map/i,
            /Download the React DevTools/i,
        ];
        const originalWarn = original.warn?.bind(original) || console.warn.bind(console);
        console.warn = function (...args: any[]) {
            const msg = args?.[0];
            if (typeof msg === 'string' && noisyWarnings.some(r => r.test(msg))) return;
            return originalWarn(...args);
        } as any;

        // Restaura no unload para evitar vazamentos em HMR/preview
        window.addEventListener('beforeunload', () => {
            try {
                console.log = original.log;
                console.info = original.info;
                console.debug = original.debug;
                console.warn = original.warn;
            } catch { }
        });
    } catch { }
}
