//  G47 FIX: Inicializar Sentry ANTES de qualquer outra coisa
// SENTRY: adiar inicialização para após primeiro paint (evita bloquear bootstrap)
import { initializeSentry } from '@/config/sentry.config';
const defer = (fn: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 0);
  }
};
// Marcar para inicializar somente se habilitado e após render inicial
let sentryInitializedEarly = false;
if (import.meta.env.PROD && initializeSentry) {
  // Em produção ainda podemos inicializar cedo se necessário (feature flag futura)
  sentryInitializedEarly = true;
  initializeSentry();
}

// Importar React normalmente
import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
const LazyApp = lazy(() => import('./App'));
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
// ✨ MODULAR STEPS: adiar auto-registro dos componentes para pós-paint
defer(() => {
  import('./components/steps').catch((e) => {
    if (import.meta.env.DEV) console.warn('[Bootstrap] Falha ao importar steps (lazy):', e);
  });
});
// 🧪 Layer diagnostics (dev only)
import installLayerDiagnostics from './utils/layerDiagnostics';
// 🏗️ SCHEMA SYSTEM: Inicializa o sistema modular de schemas com lazy loading
import { initializeSchemaRegistry, SchemaAPI } from './config/schemas';
// 🤖 AI: IA do funil auto-ativada via utils
// import { activateFunnelAI } from './utils/funnelAIActivator'; // Removido - não utilizado
// import "./utils/hotmartWebhookSimulator"; // Carregar simulador de webhook - temporariamente desabilitado

// 🏗️ Inicializar sistema de schemas
// Adiar schema registry para pós-paint (reduz custo de tempo até primeiro render)
defer(() => {
  try {
    initializeSchemaRegistry();
    console.log('✅ Schema system initialized (deferred)');
  } catch (e) {
    console.warn('⚠️ Falha ao inicializar schema registry (deferred):', e);
  }
});

// ✅ W3 (lazy): Validar template built-in somente após primeira interação do usuário
// Removidos imports estáticos para tirar custo de validação do caminho crítico de bootstrap
let templateValidationScheduled = false;
const scheduleTemplateValidation = () => {
  // Usa idle para não competir com pintura após interação
  defer(() => {
    // Encadeia imports dinâmicos; cada chunk só carrega se realmente necessário
    Promise.all([
      import('@/templates/validation/validateAndNormalize'),
      import('@/templates/imports'),
    ])
      .then(([validationMod, importsMod]) => {
        const { validateBuiltInTemplate } = validationMod;
        const { QUIZ_STYLE_21_STEPS_TEMPLATE } = importsMod as any;
        try {
          const templateData = {
            metadata: {
              name: 'Quiz de Estilo 21 Etapas',
              version: '3.0.0',
              description: 'Template completo de 21 etapas para quiz de estilo pessoal',
            },
            steps: QUIZ_STYLE_21_STEPS_TEMPLATE,
          };
          const validationResult = validateBuiltInTemplate('quiz21StepsComplete', templateData);
          if (validationResult.success) {
            console.log('✅ (lazy) Built-in template "quiz21StepsComplete" validado');
            if (validationResult.warnings?.length) {
              console.warn('⚠️ Built-in template warnings:', validationResult.warnings);
            }
          } else {
            console.error('❌ (lazy) Built-in template inválido:', validationResult.errors);
          }
        } catch (error) {
          console.error('❌ Erro ao validar built-in template (lazy):', error);
        }
      })
      .catch((err) => {
        console.warn('⚠️ Falha import dinâmica para validação de template:', err);
      });
  });
};
const triggerTemplateValidation = () => {
  if (templateValidationScheduled) return;
  templateValidationScheduled = true;
  scheduleTemplateValidation();
  // Garantir remoção dos listeners (defensive) caso múltiplos eventos disparem quase juntos
  ['click', 'keydown', 'pointerdown', 'touchstart'].forEach((evt) => {
    try { window.removeEventListener(evt, triggerTemplateValidation); } catch { /* noop */ }
  });
};
if (typeof window !== 'undefined') {
  // Agenda após primeira interação real do usuário
  ['click', 'keydown', 'pointerdown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, triggerTemplateValidation, { once: true });
  });
  // Fallback: se usuário não interagir em até 5s, ainda assim validamos em segundo plano
  setTimeout(() => triggerTemplateValidation(), 5000);
}

defer(() => {
  try { installLayerDiagnostics(); } catch (error) {
    console.warn('[Bootstrap] Falha ao instalar diagnostics de camadas (idle):', error);
  }
});

// Pré-carregar schemas críticos para evitar fallback legacy em blocos de resultado
// Dividir preload em batches para evitar monopolizar o primeiro idle e permitir cancelamento futuro
const schemaPreloadBatches: string[][] = [
  [
    // Result blocks (prioridade em funis de resultado)
    'result-header', 'result-description', 'result-image', 'result-cta', 'result-progress-bars',
    'result-main', 'result-style', 'result-characteristics', 'result-secondary-styles',
    'result-cta-primary', 'result-cta-secondary', 'result-share'
  ],
  [
    // Question + opções + componentes atômicos
    'options-grid', 'quiz-options', 'question-title', 'question-text', 'question-number', 'question-progress',
    'question-instructions', 'question-navigation', 'quiz-navigation', 'text-inline', 'image', 'button'
  ],
  [
    // Intro / Transition / Offer
    'intro-logo', 'intro-title', 'intro-image', 'intro-description', 'intro-form', 'intro-logo-header', 'quiz-intro-header',
    'transition-title', 'transition-text', 'transition-loader', 'transition-progress', 'transition-message',
    'offer-hero', 'pricing', 'benefits', 'guarantee', 'urgency-timer-inline'
  ],
];
schemaPreloadBatches.forEach((batch, i) => {
  // Escalonar cada batch ~100ms após o anterior para suavizar carga
  setTimeout(() => {
    defer(() => {
      try {
        SchemaAPI.preload(...batch);
        if (import.meta.env.DEV) {
          console.log(`🔄 Preload schemas batch ${i + 1}/${schemaPreloadBatches.length}:`, batch.length);
        }
      } catch (e) {
        if (import.meta.env.DEV) console.warn('⚠️ Falha preload batch', i + 1, e);
      }
    });
  }, i * 100);
});

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
      } catch (error) {
        console.warn('[main.tsx] Erro ao configurar Cloudinary flag:', error);
      }
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
        } catch (error) {
          console.warn('[main.tsx] Erro ao logar interceptação Sentry:', error);
        }
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      // Silencia chamadas REST do Supabase quando desabilitado (evita erros 400/403 durante QA)
      if (DISABLE_SUPABASE && url.includes('.supabase.co/rest/v1/')) {
        try {
          console.warn('🛑 Interceptado (Supabase REST desabilitado em dev):', url);
        } catch (error) {
          console.warn('[main.tsx] Erro ao logar interceptação Supabase:', error);
        }
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
          } catch (error) {
            console.warn('[main.tsx] Erro ao verificar sendBeacon Sentry:', error);
          }
          return originalBeacon(url, data);
        };
      }
    } catch (error) {
      console.warn('[main.tsx] Erro ao patch sendBeacon:', error);
    }

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
            } catch (error) {
              console.warn('[main.tsx] Erro ao verificar XHR Sentry:', error);
            }
            return originalOpen.apply(xhr, [method, url as any, true]);
          } as any;
          return xhr as any;
        }
        // Replace global XMLHttpRequest with patched version
        (window as any).XMLHttpRequest = PatchedXHR as any;
      }
    } catch (error) {
      console.warn('[main.tsx] Erro ao patch XMLHttpRequest:', error);
    }

    // Cleanup: restaurar interceptores no pagehide para evitar depreciação de unload
    window.addEventListener('pagehide', () => {
      try {
        (window as any).fetch = originalFetch;
      } catch (error) {
        console.warn('[main.tsx] Erro ao restaurar fetch original:', error);
      }
    });
  }
}

// �🚀 SUPABASE: Configuração inicial do serviço
console.log('🚀 Inicializando serviços Supabase...');
console.log('🔧 DEBUG: main.tsx carregado');

// 🔧 DIAGNOSTIC: Testar template (lazy/dev)
defer(() => {
  if (!import.meta.env.DEV) return; // diagnóstico só em dev
  import('./utils/templateDiagnostic')
    .then((mod) => {
      try {
        const fn = (mod as any).default || (mod as any).runTemplateDiagnostic;
        const diagnosticResult = typeof fn === 'function' ? fn() : undefined;
        console.log('🔬 [MAIN] Template diagnostic (lazy):', diagnosticResult);
      } catch (e) {
        console.warn('⚠️ [MAIN] Falha ao rodar template diagnostic (lazy):', e);
      }
    })
    .catch((e) => console.warn('⚠️ [MAIN] Import diagnóstico falhou:', e));
});

// Testar integração híbrida (lazy)
defer(() => {
  import('./utils/hybridIntegration')
    .then(({ getTemplateStatus }) =>
      getTemplateStatus()
        .then((status) => console.log('🔬 [MAIN] Hybrid integration status (lazy):', status))
        .catch((error) => console.error('❌ [MAIN] Hybrid integration error (lazy):', error))
    )
    .catch((e) => console.warn('⚠️ [MAIN] Import hybridIntegration falhou:', e));
});

// 🔄 Versão / prevenção de 404 de chunks desatualizados
if (typeof window !== 'undefined') {
  defer(() => {
    import('./utils/checkBuildVersion')
      .then(({ startPeriodicVersionCheck }) => {
        try {
          startPeriodicVersionCheck(180000); // a cada 3 min
        } catch (e) {
          console.warn('[VersionCheck] Falha ao iniciar verificação de versão (lazy):', e);
        }
      })
      .catch((e) => console.warn('[VersionCheck] Falha import lazy:', e));
  });
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
// Se não inicializou cedo, inicializar em idle (dev ou quando flag habilitar)
if (!sentryInitializedEarly) {
  defer(() => {
    try { initSentry(); } catch (e) { console.warn('⚠️ Falha initSentry (idle):', e); }
  });
}

console.log('🔧 DEBUG: Criando root do React...');
// Instalar guards de depreciação (alert/unload)
try {
  installDeprecationGuards();
} catch (error) {
  console.warn('[Bootstrap] Falha ao instalar guardas de deprecação:', error);
}
createRoot(document.getElementById('root')!).render(
  <ClientLayout>
    <Suspense fallback={<div data-testid="boot-splash" />}> 
      <LazyApp />
    </Suspense>
  </ClientLayout>,
);
console.log('✅ DEBUG: App renderizado com sucesso');
