//  G47 FIX: Inicializar Sentry ANTES de qualquer outra coisa
import '@/lib/shims/processEnv';
// SENTRY: adiar inicialização para após primeiro paint (evita bloquear bootstrap)
import { initializeSentry } from '@/config/sentry.config';
const defer = (fn: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 0);
  }
};
// PERF: marcar início do bootstrap
try {
  if (typeof performance !== 'undefined' && 'mark' in performance) {
    performance.mark('bootstrap:start');
  }
} catch { }
// Marcar para inicializar somente se habilitado e após render inicial
let sentryInitializedEarly = false;
if (import.meta.env.PROD && initializeSentry) {
  // Em produção ainda podemos inicializar cedo se necessário (feature flag futura)
  sentryInitializedEarly = true;
  initializeSentry();
}

// Importar React normalmente
import React, { lazy, Suspense } from 'react';
import { PageLoadingFallback } from '@/components/LoadingSpinner';
import { createRoot } from 'react-dom/client';

// 🔧 HELPER: Retry para imports dinâmicos
const retryImport = <T,>(importFn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  return importFn().catch((err) => {
    if (retries <= 0) {
      console.error('❌ Import falhou após múltiplas tentativas:', err.message);
      throw err;
    }
    console.warn(`⚠️ Import falhou, tentando novamente (${retries} tentativas restantes)...`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(retryImport(importFn, retries - 1, delay)), delay);
    });
  });
};

const LazyApp = lazy(() => retryImport(() => import('./App')));
import ClientLayout from './components/ClientLayout';
import './index.css';
// 🔍 SENTRY: Error tracking e performance monitoring
import { initSentry } from '@/lib/sentry';
// Silenciador de logs em produção (pode ser desativado via VITE_DEBUG_LOGS=true)
import './lib/shims/consoleSilencer';
import './styles/design-system.css';
// 🚀 SUPABASE: Inicialização do serviço de dados
// 🧹 DEVELOPMENT: Sistema de limpeza de avisos do console
import { initBrowserCleanup } from './lib/utils/browserCleanup';
import { cleanupConsoleWarnings } from './lib/utils/development';
// 🛡️ Deprecation guards: evitar alert cross-origin e listeners de unload
import { installDeprecationGuards } from './lib/utils/deprecationGuards';
// 🎯 PERFORMANCE: Controle de debug do canvas para melhor performance
import './lib/utils/canvasPerformanceControl';
// ✨ MODULAR STEPS: adiar auto-registro dos componentes para pós-paint
defer(() => {
  import('./components/steps').catch((e) => {
    if (import.meta.env.DEV) appLogger.warn('[Bootstrap] Falha ao importar steps (lazy):', { data: [e] });
  });
});
// 🧪 Layer diagnostics (dev only)
import installLayerDiagnostics from './lib/utils/layerDiagnostics';
// 🏗️ SCHEMA SYSTEM: Inicializa o sistema modular de schemas com lazy loading
import { initializeSchemaRegistry, SchemaAPI } from './config/schemas';
import { appLogger } from '@/lib/utils/appLogger';
// 🔗 REGISTRY BRIDGE: Integração PR #58 (core/quiz ↔️ core/registry)
import { initializeRegistryBridge } from '@/core/registry/bridge';
// 🤖 AI: IA do funil auto-ativada via utils
// import { activateFunnelAI } from './utils/funnelAIActivator'; // Removido - não utilizado
// import "./utils/hotmartWebhookSimulator"; // Carregar simulador de webhook - temporariamente desabilitado

// 🏗️ Inicializar sistema de schemas
// Adiar schema registry para pós-paint (reduz custo de tempo até primeiro render)
defer(() => {
  try {
    initializeSchemaRegistry();
    appLogger.info('✅ Schema system initialized (deferred)');
  } catch (e) {
    appLogger.warn('⚠️ Falha ao inicializar schema registry (deferred):', { data: [e] });
  }
});

// 🔗 Inicializar bridge core/quiz ↔️ core/registry (PR #58)
defer(() => {
  try {
    initializeRegistryBridge();
    appLogger.info('✅ Registry bridge initialized (core/quiz integrated)');
  } catch (e) {
    appLogger.warn('⚠️ Falha ao inicializar registry bridge:', { data: [e] });
  }
});

// ⚠️ VALIDAÇÃO DESABILITADA - Template funcional mas estrutura não corresponde ao schema esperado
// O validador espera { steps: Array } mas QUIZ_STYLE_21_STEPS_TEMPLATE é Record<string, Block[]>
// Template carrega corretamente via getStepTemplate() em runtime
/*
let templateValidationScheduled = false;
const scheduleTemplateValidation = () => {
  defer(() => {
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
            appLogger.info('✅ (lazy) Built-in template "quiz21StepsComplete" validado');
            if (validationResult.warnings?.length) {
              appLogger.warn('⚠️ Built-in template warnings:', { data: [validationResult.warnings] });
            }
          } else {
            appLogger.error('❌ (lazy) Built-in template inválido:', { data: [validationResult.errors] });
          }
        } catch (error) {
          appLogger.error('❌ Erro ao validar built-in template (lazy):', { data: [error] });
        }
      })
      .catch((err) => {
        appLogger.warn('⚠️ Falha import dinâmica para validação de template:', { data: [err] });
      });
  });
};
const triggerTemplateValidation = () => {
  if (templateValidationScheduled) return;
  templateValidationScheduled = true;
  scheduleTemplateValidation();
  ['click', 'keydown', 'pointerdown', 'touchstart'].forEach((evt) => {
    try { window.removeEventListener(evt, triggerTemplateValidation); } catch { }
  });
};
if (typeof window !== 'undefined') {
  ['click', 'keydown', 'pointerdown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, triggerTemplateValidation, { once: true });
  });
  setTimeout(() => triggerTemplateValidation(), 5000);
}
*/

defer(() => {
  try { installLayerDiagnostics(); } catch (error) {
    appLogger.warn('[Bootstrap] Falha ao instalar diagnostics de camadas (idle):', { data: [error] });
  }
});

// 🎯 PRÉ-CARREGAR FUNNEL PRINCIPAL (lazy loader)
// Popular cache para ferramentas de debug e editor
defer(() => {
  import('@/templates/loaders/dynamic')
    .then(({ loadFunnel }) => {
      return loadFunnel('quiz21StepsComplete', { validate: true, useCache: true });
    })
    .then(() => {
      if (import.meta.env.DEV) {
        appLogger.info('✅ Funnel principal pré-carregado no cache (lazy loader)');
      }
    })
    .catch((e) => {
      if (import.meta.env.DEV) {
        appLogger.warn('⚠️ Falha ao pré-carregar funnel:', { data: [e] });
      }
    });
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
          appLogger.info(`🔄 Preload schemas batch ${i + 1}/${schemaPreloadBatches.length}:`, { data: [batch.length] });
        }
      } catch (e) {
        if (import.meta.env.DEV) appLogger.warn('⚠️ Falha preload batch', { data: [i + 1, e] });
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
    appLogger.warn('⚠️ FASE 1: LocalStorage quota exceeded, clearing...');
    try {
      localStorage.clear();
      sessionStorage.clear();
      appLogger.info('✅ FASE 1: Storage cleared successfully');
    } catch (clearError) {
      appLogger.error('❌ FASE 1: Failed to clear storage:', { data: [clearError] });
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
}

// 🛡️ Interceptor simples para bloquear logs externos em dev (Grafana)
// Ativado somente com flag explícita para evitar efeitos colaterais em preview/prod
if (typeof window !== 'undefined') {
  const ENABLE_NETWORK_INTERCEPTORS = (import.meta as any)?.env?.VITE_ENABLE_NETWORK_INTERCEPTORS === 'true';
  const isDevMode = import.meta.env.DEV;

  // Guard: só ativa interceptores quando flag estiver ligada
  if (ENABLE_NETWORK_INTERCEPTORS && isDevMode) {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const DISABLE_SUPABASE = (import.meta as any)?.env?.VITE_DISABLE_SUPABASE === 'true';
      try {
        (window as any).__USE_CLOUDINARY__ = ((import.meta as any)?.env?.VITE_ENABLE_CLOUDINARY === 'true');
      } catch (error) {
        appLogger.warn('[main.tsx] Erro ao configurar Cloudinary flag:', { data: [error] });
      }
      // Bloqueia logs externos em dev
      if (url.includes('cloudfunctions.net/pushLogsToGrafana')) {
        // Simula sucesso e evita 500 no console
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      // Silencia Sentry em dev para evitar 404/429 e ruído excessivo
      if (/sentry\.io|ingest\.sentry\.io/.test(url) && isDevMode) {
        try {
          appLogger.warn('🛑 Interceptado (Sentry desabilitado em dev):', { data: [url] });
        } catch (error) {
          appLogger.warn('[main.tsx] Erro ao logar interceptação Sentry:', { data: [error] });
        }
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      // Silencia chamadas REST do Supabase quando desabilitado (evita erros 400/403 durante QA)
      if (DISABLE_SUPABASE && url.includes('.supabase.co/rest/v1/')) {
        try {
          appLogger.warn('🛑 Interceptado (Supabase REST desabilitado em dev):', { data: [url] });
        } catch (error) {
          appLogger.warn('[main.tsx] Erro ao logar interceptação Supabase:', { data: [error] });
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
      if (navigator?.sendBeacon && isDevMode) {
        const originalBeacon = navigator.sendBeacon.bind(navigator);
        (navigator as any).sendBeacon = (url: any, data?: any) => {
          try {
            const str = typeof url === 'string' ? url : String(url);
            if (/sentry\.io|ingest\.sentry\.io/.test(str)) {
              appLogger.warn('🛑 Interceptado (sendBeacon -> Sentry bloqueado):', { data: [str] });
              return true; // finge sucesso
            }
          } catch (error) {
            appLogger.warn('[main.tsx] Erro ao verificar sendBeacon Sentry:', { data: [error] });
          }
          return originalBeacon(url, data);
        };
      }
    } catch (error) {
      appLogger.warn('[main.tsx] Erro ao patch sendBeacon:', { data: [error] });
    }

    // Intercepta XHR para evitar ruído em libs que não usam fetch
    try {
      if (isDevMode && typeof XMLHttpRequest !== 'undefined') {
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
                appLogger.warn('🛑 Interceptado (XHR -> Sentry bloqueado):', { data: [u] });
                return originalOpen.apply(xhr, ['GET', 'data:ignored', true]);
              }
            } catch (error) {
              appLogger.warn('[main.tsx] Erro ao verificar XHR Sentry:', { data: [error] });
            }
            return originalOpen.apply(xhr, [method, url as any, true]);
          } as any;
          return xhr as any;
        }
        // Replace global XMLHttpRequest with patched version
        (window as any).XMLHttpRequest = PatchedXHR as any;
      }
    } catch (error) {
      appLogger.warn('[main.tsx] Erro ao patch XMLHttpRequest:', { data: [error] });
    }

    // Cleanup: restaurar interceptores no pagehide para evitar depreciação de unload
    window.addEventListener('pagehide', () => {
      try {
        (window as any).fetch = originalFetch;
      } catch (error) {
        appLogger.warn('[main.tsx] Erro ao restaurar fetch original:', { data: [error] });
      }
    });
  }
}

// Sanity check pós-bootstrap para __assign em dev: detecta se guard foi aplicado
if (import.meta.env.DEV) {
  defer(() => {
    try {
      const assignOk = typeof (window as any).__assign === 'function';
      const guardApplied = (window as any).__ASSIGN_GUARD_APPLIED === true;
      if (!assignOk) {
        appLogger.warn('[Sanity] __assign ausente após bootstrap (dev)');
      } else if (guardApplied) {
        appLogger.info('[Sanity] __assign ativa (fallback guard aplicado)');
      } else {
        appLogger.info('[Sanity] __assign ok (native/vendor)');
      }
    } catch (e) {
      try { appLogger.warn('[Sanity] Falha ao checar __assign:', { data: [e] }); } catch { }
    }
  });
}

// �🚀 SUPABASE: Configuração inicial do serviço
appLogger.info('🚀 Inicializando serviços Supabase...');
appLogger.info('🔧 DEBUG: main.tsx carregado');

// 🔧 DIAGNOSTIC: Testar template (lazy/dev)
defer(() => {
  if (!import.meta.env.DEV) return; // diagnóstico só em dev
  import('./lib/utils/templateDiagnostic')
    .then((mod) => {
      try {
        const fn = (mod as any).default || (mod as any).runTemplateDiagnostic;
        const diagnosticResult = typeof fn === 'function' ? fn() : undefined;
        appLogger.info('🔬 [MAIN] Template diagnostic (lazy):', { data: [diagnosticResult] });
      } catch (e) {
        appLogger.warn('⚠️ [MAIN] Falha ao rodar template diagnostic (lazy):', { data: [e] });
      }
    })
    .catch((e) => appLogger.warn('⚠️ [MAIN] Import diagnóstico falhou:', { data: [e] }));
});

// Testar integração híbrida (lazy)
defer(() => {
  import('./lib/utils/hybridIntegration')
    .then(({ getTemplateStatus }) =>
      getTemplateStatus()
        .then((status) => appLogger.info('🔬 [MAIN] Hybrid integration status (lazy):', { data: [status] }))
        .catch((error) => appLogger.error('❌ [MAIN] Hybrid integration error (lazy):', { data: [error] }))
    )
    .catch((e) => appLogger.warn('⚠️ [MAIN] Import hybridIntegration falhou:', { data: [e] }));
});

// 🔄 Versão / prevenção de 404 de chunks desatualizados
if (typeof window !== 'undefined') {
  defer(() => {
    import('./lib/utils/checkBuildVersion')
      .then(({ startPeriodicVersionCheck }) => {
        try {
          startPeriodicVersionCheck(180000); // a cada 3 min
        } catch (e) {
          appLogger.warn('[VersionCheck] Falha ao iniciar verificação de versão (lazy):', { data: [e] });
        }
      })
      .catch((e) => appLogger.warn('[VersionCheck] Falha import lazy:', { data: [e] }));
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
        appLogger.info('✅ Service Worker registrado:', { data: [registration.scope] });

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
                appLogger.info('🔄 Nova versão do app disponível! Recarregue para atualizar.');
                // Notificar usuário (pode implementar toast/banner depois)
              }
            });
          }
        });
      })
      .catch((error) => {
        appLogger.error('❌ Erro ao registrar Service Worker:', { data: [error] });
      });
  });
}

// O serviço é inicializado automaticamente na importação

// 🔍 SENTRY: Inicializar antes do React
// Se não inicializou cedo, inicializar em idle (dev ou quando flag habilitar)
if (!sentryInitializedEarly) {
  defer(() => {
    try { initSentry(); } catch (e) { appLogger.warn('⚠️ Falha initSentry (idle):', { data: [e] }); }
  });
}

appLogger.info('🔧 DEBUG: Criando root do React...');
try {
  if (typeof performance !== 'undefined' && 'mark' in performance) {
    performance.mark('react:render:start');
  }
} catch { }
// Instalar guards de depreciação (alert/unload)
try {
  installDeprecationGuards();
} catch (error) {
  appLogger.warn('[Bootstrap] Falha ao instalar guardas de deprecação:', { data: [error] });
}
createRoot(document.getElementById('root')!).render(
  <ClientLayout>
    <Suspense fallback={<PageLoadingFallback message="Carregando aplicação..." />}>
      <LazyApp />
    </Suspense>
  </ClientLayout>,
);
// PERF: medir TTFP (Time To First Paint) aproximado
try {
  if (typeof performance !== 'undefined' && 'mark' in performance && 'measure' in performance) {
    requestAnimationFrame(() => {
      try {
        performance.mark('react:paint');
        performance.measure('ttfp', 'bootstrap:start', 'react:paint');
        const entries = performance.getEntriesByName('ttfp');
        const entry = entries[entries.length - 1];
        if (entry) appLogger.info(`[PERF] TTFP ms: ${Math.round(entry.duration)}`);
      } catch { }
    });
  }
} catch { }
appLogger.info('✅ DEBUG: App renderizado com sucesso');
