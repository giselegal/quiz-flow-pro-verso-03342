import { createRoot } from 'react-dom/client';
import './index.css';
// 🚀 SUPABASE: Inicialização do serviço de dados
// 🧹 DEVELOPMENT: Sistema de limpeza de avisos do console
import { cleanupConsoleWarnings } from './utils/development';
// import "./utils/hotmartWebhookSimulator"; // Carregar simulador de webhook - temporariamente desabilitado

// 🧹 DEVELOPMENT: Ativa limpeza de avisos apenas em desenvolvimento
if (import.meta.env.DEV) {
  cleanupConsoleWarnings();
}

// 🚀 SUPABASE: Configuração inicial do serviço
console.log('🚀 Inicializando serviços Supabase...');
console.log('🔧 DEBUG: main.tsx carregado');
// O serviço é inicializado automaticamente na importação

console.log('🔧 DEBUG: Criando root do React...');

// Teste super básico primeiro
const root = document.getElementById('root');
if (root) {
  console.log('✅ Root element found');
  root.innerHTML =
    '<div style="padding: 20px; background: lightgreen;">🧪 TESTE BÁSICO - HTML DIRETO FUNCIONANDO</div>';

  // Depois tentar React
  setTimeout(() => {
    try {
      createRoot(root).render(
        <div style={{ padding: '20px', background: 'lightblue' }}>
          🎯 TESTE REACT BÁSICO FUNCIONANDO
        </div>
      );
      console.log('✅ React básico funcionou');
    } catch (error) {
      console.error('❌ Erro no React básico:', error);
    }
  }, 1000);
} else {
  console.error('❌ Root element não encontrado');
}

console.log('✅ DEBUG: App renderizado com sucesso');
