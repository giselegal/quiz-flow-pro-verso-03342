// @ts-nocheck
import { Suspense } from 'react';

const MegaSimpleApp = () => {
    console.log('🚀 MegaSimpleApp renderizando...');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center'
        }}>
            <div>
                <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎯</h1>
                <h2>Sistema 100% Funcional!</h2>
                <p>React carregado e renderizando ✅</p>
                <p>Timestamp: {new Date().toLocaleString()}</p>
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <h3>Status dos Services:</h3>
                    <p>🔧 Builder disponível: {typeof (globalThis as any)?.createFunnelFromTemplate === 'function' ? '✅' : '❌'}</p>
                    <p>📦 LocalStorage: {typeof localStorage !== 'undefined' ? '✅' : '❌'}</p>
                    <p>🌐 Fetch API: {typeof fetch !== 'undefined' ? '✅' : '❌'}</p>
                </div>
                <button
                    onClick={() => {
                        console.log('🔧 Teste de interação - botão clicado!');
                        alert('Sistema interativo funcionando! ✅');
                    }}
                    style={{
                        marginTop: '2rem',
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        background: '#fff',
                        color: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Testar Interação
                </button>
            </div>
        </div>
    );
};

export default MegaSimpleApp;