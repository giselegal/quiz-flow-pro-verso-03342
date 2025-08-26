import { createRoot } from 'react-dom/client';
import App from './App';
import ClientLayout from './components/ClientLayout';
import './index.css';
// 🚀 SUPABASE: Inicialização do serviço de dados
// 🧹 DEVELOPMENT: Sistema de limpeza de avisos do console
import { initBrowserCleanup } from './utils/browserCleanup';
import { cleanupConsoleWarnings } from './utils/development';
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
if (import.meta.env.DEV && typeof window !== 'undefined') {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const DISABLE_SUPABASE = (import.meta as any)?.env?.VITE_DISABLE_SUPABASE === 'true';
    // Bloqueia logs externos em dev
    if (url.includes('cloudfunctions.net/pushLogsToGrafana')) {
      // Simula sucesso e evita 500 no console
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    // Silencia chamadas REST do Supabase quando desabilitado (evita erros 400/403 durante QA)
    if (DISABLE_SUPABASE && url.includes('.supabase.co/rest/v1/')) {
      try {
        console.warn('🛑 Interceptado (Supabase REST desabilitado em dev):', url);
      } catch {}
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
}

// �🚀 SUPABASE: Configuração inicial do serviço
console.log('🚀 Inicializando serviços Supabase...');
console.log('🔧 DEBUG: main.tsx carregado');
// O serviço é inicializado automaticamente na importação

console.log('🔧 DEBUG: Criando root do React...');
createRoot(document.getElementById('root')!).render(
  <ClientLayout>
    <App />
  </ClientLayout>
);
console.log('✅ DEBUG: App renderizado com sucesso');
