import { createRoot } from 'react-dom/client';

console.log('🔧 TESTE SIMPLES: main.tsx simplificado carregando...');

function SimpleApp() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>🔧 TESTE: React Funcionando!</h1>
            <p>Se você está vendo isso, o React está funcionando.</p>
            <button onClick={() => alert('JavaScript funcionando!')}>
                Testar JavaScript
            </button>
        </div>
    );
}

console.log('🔧 TESTE SIMPLES: Criando root...');
const root = document.getElementById('root');
if (root) {
    createRoot(root).render(<SimpleApp />);
    console.log('✅ TESTE SIMPLES: App renderizado!');
} else {
    console.error('❌ TESTE SIMPLES: Root não encontrado!');
}