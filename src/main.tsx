// 🛡️ CRITICAL: Importar React Preload PRIMEIRO ANTES DE TUDO
import './react-preload';

// Agora importar React normalmente (já está global)
import React from 'react';
import ReactDOM from 'react-dom';

// 🔧 POLYFILLS GLOBAIS PARA REACT APIs
// Deve ser aplicado ANTES de qualquer bundle de vendor ser carregado
if (typeof window !== 'undefined') {
  // Garantir React global para todos os vendors
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;

  // Aplicar polyfills completos para APIs que podem estar ausentes
  const reactGlobalPolyfills = {
    useLayoutEffect: React.useLayoutEffect || React.useEffect,
    forwardRef: React.forwardRef || ((render: any) => {
      return React.memo ? React.memo((props: any) => render(props, null)) : (props: any) => render(props, null);
    }),
    createRef: React.createRef || (() => ({ current: null })),
    memo: React.memo || ((component: any) => component),
    useMemo: React.useMemo || ((factory: any, deps?: any) => factory()),
    useCallback: React.useCallback || ((callback: any, deps?: any) => callback),
    useImperativeHandle: React.useImperativeHandle || (() => { }),
    Fragment: React.Fragment || ((props: any) => props.children),
    StrictMode: React.StrictMode || ((props: any) => props.children),
    Suspense: React.Suspense || ((props: any) => props.children || props.fallback || null)
  };

  // Aplicar patches no React global para vendor bundles
  Object.assign(React, reactGlobalPolyfills);

  // Garantir que window.React tenha todos os polyfills
  (window as any).React = { ...React, ...reactGlobalPolyfills };

  // CRÍTICO: Verificar se forwardRef está disponível
  if (!React.forwardRef) {
    console.error('❌ React.forwardRef não está disponível! Aplicando polyfill de emergência...');
    (React as any).forwardRef = reactGlobalPolyfills.forwardRef;
  }

  console.log('🔧 [main.tsx] Polyfills React aplicados globalmente', {
    hasForwardRef: !!React.forwardRef,
    hasWindow: typeof window !== 'undefined',
    windowReact: !!(window as any).React,
  });
}

import { createRoot } from 'react-dom/client';
import App from './App';
import ClientLayout from './components/ClientLayout';
import './index.css';
// 🔍 SENTRY: Error tracking e performance monitoring
import { initSentry } from '@/lib/sentry';
// Silenciador de logs em produção (pode ser desativado via VITE_DEBUG_LOGS=true)
import './shims/consoleSilencer';
import './styles/design-system.css';
// 🚀 SUPABASE: Inicialização do serviço de dados
// 🧹 DEVELOPMENT: Sistema de limpeza de avisos do console
import { initBrowserCleanup } from './utils/browserCleanup';
import { cleanupConsoleWarnings } from './utils/development';
// 🔧 WEBSOCKET: Otimizador para resolver problemas de reconexão
import { initializeWebSocketOptimization } from './utils/websocket-optimizer';
// 📊 RUDDERSTACK: Otimizador para resolver problemas de analytics
import { initializeRudderStackOptimization } from './utils/rudderstack-optimizer';
// 🛡️ Deprecation guards: evitar alert cross-origin e listeners de unload
import { installDeprecationGuards } from './utils/deprecationGuards';
// 🛡️ DEVELOPMENT: Bloquear conexões Lovable em desenvolvimento
import './utils/blockLovableInDev';
// 🎯 PERFORMANCE: Controle de debug do canvas para melhor performance
import './utils/canvasPerformanceControl';
// ✨ MODULAR STEPS: Sistema modular de steps - auto-registro dos componentes
import './components/steps';
// 🏗️ SCHEMA SYSTEM: Inicializa o sistema modular de schemas com lazy loading
import { initializeSchemaRegistry, SchemaAPI } from './config/schemas';
// 🤖 AI: IA do funil auto-ativada via utils
// import { activateFunnelAI } from './utils/funnelAIActivator'; // Removido - não utilizado
// import "./utils/hotmartWebhookSimulator"; // Carregar simulador de webhook - temporariamente desabilitado

// 🏗️ Inicializar sistema de schemas
initializeSchemaRegistry();
console.log('✅ Schema system initialized');

// Pré-carregar schemas críticos para evitar fallback legacy em blocos de resultado
try {
  // Resultado (Step 20)
  SchemaAPI.preload(
    'result-header',
    'result-description',
    'result-image',
    'result-cta',
    'result-progress-bars',
    'result-main',
    'result-style',
    'result-characteristics',
    'result-secondary-styles',
    'result-cta-primary',
    'result-cta-secondary',
    'result-share',
  );
  // Perguntas (Steps 02–18)
  SchemaAPI.preload(
    'options-grid',
    'quiz-options',
    'question-title',
    'question-text',
    'question-number',
    'question-progress',
    'question-instructions',
    'question-navigation',
    'quiz-navigation',
    'text-inline',
    'image',
    'button',
  );
  // Intro (Step 01)
  SchemaAPI.preload(
    'intro-logo',
    'intro-title',
    'intro-image',
    'intro-description',
    'intro-form',
    'intro-logo-header',
    'quiz-intro-header',
  );
  // Transição (Steps 12 & 19)
  SchemaAPI.preload(
    'transition-title',
    'transition-text',
    'transition-loader',
    'transition-progress',
    'transition-message',
  );
  // Oferta (Step 21)
  SchemaAPI.preload(
    'offer-hero',
    'pricing',
    'benefits',
    'guarantee',
    'urgency-timer-inline',
  );
} catch { /* ignore preload errors in dev */ }

// 🧹 FASE 1: Emergency localStorage cleanup on startup if quota exceeded
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    const testKey = '__storage_quota_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
  } catch (error) {
    // QuotaExceededError detected - clear localStorage
    console.warn('⚠️ FASE 1: LocalStorage quota exceeded, clearing...');
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('✅ FASE 1: Storage cleared successfully');
    } catch (clearError) {
      console.error('❌ FASE 1: Failed to clear storage:', clearError);
    }
  }
}

// 🧹 DEVELOPMENT: Ativa limpeza de avisos apenas em desenvolvimento
if (import.meta.env.DEV) {
  cleanupConsoleWarnings();
  // Limpeza de warnings comuns de navegador (Permissions-Policy, sandbox, preload não usado)
  if (typeof window !== 'undefined') {
    initBrowserCleanup();
  }
  // Inicializar otimizadores para desenvolvimento
  initializeWebSocketOptimization();
  initializeRudderStackOptimization();
}

// � Interceptor simples para bloquear logs externos em dev (Grafana/gpt-engineer)
// Ativado somente com flag explícita para evitar efeitos colaterais em preview/prod
if (typeof window !== 'undefined') {
  const ENABLE_NETWORK_INTERCEPTORS = (import.meta as any)?.env?.VITE_ENABLE_NETWORK_INTERCEPTORS === 'true';
  const isDevOrPreview = import.meta.env.DEV || (typeof location !== 'undefined' && /lovable\.app|stackblitz\.io|codesandbox\.io/.test(location.hostname));

  // Guard: só ativa interceptores quando flag estiver ligada
  if (ENABLE_NETWORK_INTERCEPTORS && isDevOrPreview) {
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
            : new Response(null, { status: 204 }),
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
        // Properly typed XHR constructor patch
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
        // Replace global XMLHttpRequest with patched version
        (window as any).XMLHttpRequest = PatchedXHR as any;
      }
    } catch { }

    // Cleanup: restaurar interceptores no pagehide para evitar depreciação de unload
    window.addEventListener('pagehide', () => {
      try { (window as any).fetch = originalFetch; } catch { }
    });
  }
}

// �🚀 SUPABASE: Configuração inicial do serviço
console.log('🚀 Inicializando serviços Supabase...');
console.log('🔧 DEBUG: main.tsx carregado');

// 🔧 DIAGNOSTIC: Testar template
import runTemplateDiagnostic from './utils/templateDiagnostic';
import { getTemplateStatus } from './utils/hybridIntegration';
import { startPeriodicVersionCheck } from './utils/checkBuildVersion';

const diagnosticResult = runTemplateDiagnostic();
console.log('🔬 [MAIN] Template diagnostic:', diagnosticResult);

// Testar integração híbrida
getTemplateStatus().then(status => {
  console.log('🔬 [MAIN] Hybrid integration status:', status);
}).catch(error => {
  console.error('❌ [MAIN] Hybrid integration error:', error);
});

// 🔄 Versão / prevenção de 404 de chunks desatualizados
if (typeof window !== 'undefined') {
  try {
    startPeriodicVersionCheck(180000); // a cada 3 min
  } catch (e) {
    console.warn('[VersionCheck] Falha ao iniciar verificação de versão:', e);
  }
}

// 🧹 DEV: Garantir que nenhum Service Worker legado interfira em localhost
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !import.meta.env.PROD) {
  // Desregistrar SWs antigos e limpar caches em ambiente de desenvolvimento
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => {
      reg.unregister().catch(() => void 0);
    });
  }).catch(() => void 0);
  if (typeof caches !== 'undefined') {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).catch(() => void 0);
  }
}

// 🚀 FASE 3.5: Service Worker para Offline Support e PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);

        // Verificar atualizações a cada hora
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Monitorar nova versão disponível
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 Nova versão do app disponível! Recarregue para atualizar.');
                // Notificar usuário (pode implementar toast/banner depois)
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error);
      });
  });
}

// O serviço é inicializado automaticamente na importação

// 🔍 SENTRY: Inicializar antes do React
initSentry();

console.log('🔧 DEBUG: Criando root do React...');
// Instalar guards de depreciação (alert/unload)
try { installDeprecationGuards(); } catch { }
createRoot(document.getElementById('root')!).render(
  <ClientLayout>
    <App />
  </ClientLayout>,
);
console.log('✅ DEBUG: App renderizado com sucesso');
