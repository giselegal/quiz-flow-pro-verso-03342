import { createRoot } from 'react-dom/client';
import AppSimple from './AppSimple';
import './index.css';

// 🚀 Inicialização simples para funcionar com Lovable
console.log('🚀 Inicializando aplicação...');

// Configuração mínima para desenvolvimento
if (import.meta.env.DEV) {
  console.log('🔧 Modo desenvolvimento ativo');
}

console.log('🔧 DEBUG: Criando root do React...');
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<AppSimple />);
  console.log('✅ DEBUG: App renderizado com sucesso');
} else {
  console.error('❌ Elemento root não encontrado');
}
