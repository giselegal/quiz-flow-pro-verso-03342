import { createRoot } from 'react-dom/client';
import App from './App';
import ClientLayout from './components/ClientLayout';
import './index.css';
import './styles/design-system.css';
// 🚀 SUPABASE: Inicialização do serviço de dados
// 🧹 DEVELOPMENT: Sistema de limpeza de avisos do console
import { initBrowserCleanup } from './utils/browserCleanup';
import { cleanupConsoleWarnings } from './utils/development';
// 🛡️ DEVELOPMENT: Bloquear conexões Lovable em desenvolvimento
import './utils/blockLovableInDev';
// import "./utils/hotmartWebhookSimulator"; // Carregar simulador de webhook - temporariamente desabilitado

// 🧹 DEVELOPMENT: Ativa limpeza de avisos apenas em desenvolvimento
if (import.meta.env.DEV) {
  cleanupConsoleWarnings();
  // Limpeza de warnings comuns de navegador (Permissions-Policy, sandbox, preload não usado)
  if (typeof window !== 'undefined') {
    initBrowserCleanup();
  }
}

// � Interceptor simples para bloquear logs externos em dev (Grafana/gpt-engineer)
if ((import.meta.env.DEV || typeof window !== 'undefined') && typeof window !== 'undefined') {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const DISABLE_SUPABASE = (import.meta as any)?.env?.VITE_DISABLE_SUPABASE === 'true';
    try {
      (window as any).__USE_CLOUDINARY__ = ((import.meta as any)?.env?.VITE_ENABLE_CLOUDINARY === 'true');
    } catch { }
    const isPreviewHost = typeof location !== 'undefined' && /lovable\.app|stackblitz\.io|codesandbox\.io/.test(location.hostname);
    // Bloqueia logs externos em dev
    if (url.includes('cloudfunctions.net/pushLogsToGrafana')) {
      // Simula sucesso e evita 500 no console
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    // Silencia Sentry em dev para evitar 404/429 e ruído excessivo
    if (/sentry\.io|ingest\.sentry\.io/.test(url) && (import.meta.env.DEV || isPreviewHost)) {
      try {
        console.warn('🛑 Interceptado (Sentry desabilitado em dev):', url);
      } catch { }
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    // Silencia chamadas REST do Supabase quando desabilitado (evita erros 400/403 durante QA)
    if (DISABLE_SUPABASE && url.includes('.supabase.co/rest/v1/')) {
      try {
        console.warn('🛑 Interceptado (Supabase REST desabilitado em dev):', url);
      } catch { }
      // Responder com lista vazia ou sucesso sem corpo
      const wantsJson =
        (init?.headers &&
          typeof (init.headers as any).get === 'function' &&
          ((init.headers as any).get('accept') || '').includes('application/json')) ||
        (typeof url === 'string' && url.includes('select='));
      return Promise.resolve(
        wantsJson
          ? new Response('[]', {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
          : new Response(null, { status: 204 })
      );
    }
    return originalFetch(input as any, init);
  };

  // Também intercepta sendBeacon (Sentry usa esse transporte em prod)
  try {
    const isPreviewHost = typeof location !== 'undefined' && /lovable\.app|stackblitz\.io|codesandbox\.io/.test(location.hostname);
    if (navigator?.sendBeacon && (import.meta.env.DEV || isPreviewHost)) {
      const originalBeacon = navigator.sendBeacon.bind(navigator);
      (navigator as any).sendBeacon = (url: any, data?: any) => {
        try {
          const str = typeof url === 'string' ? url : String(url);
          if (/sentry\.io|ingest\.sentry\.io/.test(str)) {
            console.warn('🛑 Interceptado (sendBeacon -> Sentry bloqueado):', str);
            return true; // finge sucesso
          }
        } catch { }
        return originalBeacon(url, data);
      };
    }
  } catch { }

  // Intercepta XHR para evitar ruído em libs que não usam fetch
  try {
    const isPreviewHost = typeof location !== 'undefined' && /lovable\.app|stackblitz\.io|codesandbox\.io/.test(location.hostname);
    if ((import.meta.env.DEV || isPreviewHost) && typeof XMLHttpRequest !== 'undefined') {
      const OriginalXHR = XMLHttpRequest;
      // @ts-ignore - extend constructor
      function PatchedXHR(this: XMLHttpRequest) {
        const xhr = new OriginalXHR();
        const originalOpen = xhr.open;
        (xhr as any).open = function patchedOpen(method: string, url: string | URL) {
          try {
            const u = typeof url === 'string' ? url : url.toString();
            if (/sentry\.io|ingest\.sentry\.io/.test(u)) {
              // Reescreve para um data: vazio e ignora
              console.warn('🛑 Interceptado (XHR -> Sentry bloqueado):', u);
              return originalOpen.apply(xhr, ['GET', 'data:ignored', true]);
            }
          } catch { }
          return originalOpen.apply(xhr, [method, url as any, true]);
        } as any;
        return xhr as any;
      }
      // @ts-ignore
      (window as any).XMLHttpRequest = PatchedXHR as any;
    }
  } catch { }
}

// �🚀 SUPABASE: Configuração inicial do serviço
console.log('🚀 Inicializando serviços Supabase...');
console.log('🔧 DEBUG: main.tsx carregado');

// 🔧 DIAGNOSTIC: Testar template
import runTemplateDiagnostic from './utils/templateDiagnostic';
import { getTemplateStatus } from './utils/hybridIntegration';

const diagnosticResult = runTemplateDiagnostic();
console.log('🔬 [MAIN] Template diagnostic:', diagnosticResult);

// Testar integração híbrida
getTemplateStatus().then(status => {
  console.log('🔬 [MAIN] Hybrid integration status:', status);
}).catch(error => {
  console.error('❌ [MAIN] Hybrid integration error:', error);
});

// O serviço é inicializado automaticamente na importação

console.log('🔧 DEBUG: Criando root do React...');
createRoot(document.getElementById('root')!).render(
  <ClientLayout>
    <App />
  </ClientLayout>
);
console.log('✅ DEBUG: App renderizado com sucesso');
