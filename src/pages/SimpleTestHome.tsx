// @ts-nocheck
import React from 'react';

const SimpleTestHome = () => {
    console.log('🔧 DEBUG: SimpleTestHome component rendering...');

    return (
        <div style={{
            minHeight: '100vh',
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                    🚀 Quiz Quest Challenge Verse
                </h1>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2>✅ Sistema Funcionando!</h2>
                    <p>Se você está vendo esta página, significa que:</p>
                    <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                        <li>✅ React está renderizando corretamente</li>
                        <li>✅ O sistema de roteamento está funcionando</li>
                        <li>✅ Os componentes estão sendo carregados</li>
                        <li>✅ O CSS está sendo aplicado</li>
                    </ul>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '1.5rem'
                    }}>
                        <h3>📝 Editor</h3>
                        <p>Sistema de criação de quiz</p>
                        <button
                            onClick={() => window.location.href = '/editor'}
                            style={{
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Ir para Editor
                        </button>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '1.5rem'
                    }}>
                        <h3>📊 Quiz</h3>
                        <p>Sistema de quiz interativo</p>
                        <button
                            onClick={() => window.location.href = '/quiz'}
                            style={{
                                background: '#2196F3',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Fazer Quiz
                        </button>
                    </div>
                </div>

                <div style={{
                    marginTop: '3rem',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px'
                }}>
                    <h4>🔧 Debug Info</h4>
                    <p>Timestamp: {new Date().toLocaleString()}</p>
                    <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
                    <p>URL: {window.location.href}</p>
                </div>
            </div>
        </div>
    );
};

export default SimpleTestHome;