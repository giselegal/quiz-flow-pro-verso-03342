import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 🚀 SUPABASE: Inicialização do serviço de dados
// 🧹 DEVELOPMENT: Sistema de limpeza de avisos do console
import { cleanupConsoleWarnings } from './utils/development';

// 🧹 DEVELOPMENT: Ativa limpeza de avisos apenas em desenvolvimento
if (import.meta.env.DEV) {
  cleanupConsoleWarnings();
}

// 🚀 SUPABASE: Configuração inicial do serviço
console.log('🚀 Inicializando serviços Supabase...');
console.log('🔧 DEBUG: main.tsx carregado');

console.log('🔧 DEBUG: Criando root do React...');

// Renderizar aplicação principal
const root = document.getElementById('root');
if (root) {
  console.log('✅ Root element found');

  createRoot(root).render(<App />);
  console.log('✅ App renderizado com sucesso');
} else {
  console.error('❌ Root element não encontrado');
}
