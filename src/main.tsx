import { createRoot } from 'react-dom/client';
import App from './App';
import ClientLayout from './components/ClientLayout';
import './index.css';
// 🚀 SUPABASE: Inicialização do serviço de dados
// 🧹 DEVELOPMENT: Sistema de limpeza de avisos do console
import { cleanupConsoleWarnings } from './utils/development';
// import "./utils/hotmartWebhookSimulator"; // Carregar simulador de webhook - temporariamente desabilitado

// Adiciona tipagem para import.meta.env
interface ImportMetaEnv {
  DEV: boolean;
  [key: string]: any;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

// 🧹 Inicializar limpeza de avisos do console em desenvolvimento
if (import.meta.env.DEV) {
  cleanupConsoleWarnings();
}

// 🚀 SUPABASE: Configuração inicial do serviço
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
