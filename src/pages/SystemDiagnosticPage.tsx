import React, { useEffect, useState } from 'react';
import { getTemplateStatus } from '@/utils/hybridIntegration';

interface SystemStatus {
    templateDiagnostic: any;
    hybridStatus: any;
    timestamp: string;
}

const SystemDiagnosticPage: React.FC = () => {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const runDiagnostic = async () => {
            try {
                console.log('🔬 [DIAGNOSTIC] Iniciando diagnóstico completo...');

                // Import dinâmico do template diagnostic
                const { default: runTemplateDiagnostic } = await import('@/utils/templateDiagnostic');
                const templateResult = runTemplateDiagnostic();

                // Status da integração híbrida
                const hybridResult = await getTemplateStatus();

                const systemStatus: SystemStatus = {
                    templateDiagnostic: templateResult,
                    hybridStatus: hybridResult,
                    timestamp: new Date().toISOString()
                };

                console.log('✅ [DIAGNOSTIC] Diagnóstico completo:', systemStatus);
                setStatus(systemStatus);

            } catch (error) {
                console.error('❌ [DIAGNOSTIC] Erro no diagnóstico:', error);
                setError(error instanceof Error ? error.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };

        runDiagnostic();
    }, []);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontFamily: 'monospace'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid rgba(255,255,255,0.3)',
                        borderTop: '4px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h2>🔬 Executando Diagnóstico...</h2>
                    <p>Verificando status do sistema</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                color: 'white',
                fontFamily: 'monospace',
                padding: '20px'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                    <h1>❌ Erro no Diagnóstico</h1>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '20px',
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <pre>{error}</pre>
                    </div>
                </div>
            </div>
        );
    }

    const { templateDiagnostic, hybridStatus } = status!;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: 'monospace',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🔬 Diagnóstico do Sistema</h1>
                    <p style={{ opacity: 0.8 }}>Quiz Quest Challenge Verse - System Status</p>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '10px',
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <strong>Timestamp:</strong> {status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'N/A'}
                    </div>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {/* Template Diagnostic */}
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '20px'
                    }}>
                        <h2>📊 Template Diagnostic</h2>
                        <div style={{ marginTop: '15px' }}>
                            <p><strong>Template Loaded:</strong> <span style={{ color: templateDiagnostic.templateLoaded ? '#4CAF50' : '#f44336' }}>
                                {templateDiagnostic.templateLoaded ? '✅ Yes' : '❌ No'}
                            </span></p>
                            <p><strong>Step Count:</strong> {templateDiagnostic.stepCount}</p>
                            <p><strong>Template Available:</strong> {templateDiagnostic.template ? 'Yes' : 'No'}</p>
                        </div>
                    </div>

                    {/* Hybrid Integration Status */}
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '20px'
                    }}>
                        <h2>🔗 Hybrid Integration</h2>
                        <div style={{ marginTop: '15px' }}>
                            <p><strong>Service Active:</strong> <span style={{ color: hybridStatus.serviceActive ? '#4CAF50' : '#f44336' }}>
                                {hybridStatus.serviceActive ? '✅ Yes' : '❌ No'}
                            </span></p>
                            <p><strong>Template Loaded:</strong> <span style={{ color: hybridStatus.templateLoaded ? '#4CAF50' : '#f44336' }}>
                                {hybridStatus.templateLoaded ? '✅ Yes' : '❌ No'}
                            </span></p>
                            <p><strong>Template Steps:</strong> {hybridStatus.templateSteps}</p>
                            <p><strong>Fallback Available:</strong> <span style={{ color: hybridStatus.fallbackAvailable ? '#4CAF50' : '#f44336' }}>
                                {hybridStatus.fallbackAvailable ? '✅ Yes' : '❌ No'}
                            </span></p>
                            <p><strong>Direct Template Steps:</strong> {hybridStatus.directTemplateSteps}</p>
                            {hybridStatus.error && (
                                <p><strong>Error:</strong> <span style={{ color: '#f44336' }}>{hybridStatus.error}</span></p>
                            )}
                        </div>
                    </div>
                </div>

                {/* System Status Summary */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '20px'
                }}>
                    <h2>🎯 Status Summary</h2>
                    <div style={{ marginTop: '15px' }}>
                        {templateDiagnostic.templateLoaded || hybridStatus.fallbackAvailable ? (
                            <div style={{ color: '#4CAF50' }}>
                                <h3>✅ Sistema Operacional</h3>
                                <p>Templates estão disponíveis. O sistema deve funcionar.</p>
                                <p><strong>Recomendação:</strong> Verificar se há problemas de renderização no React.</p>
                            </div>
                        ) : (
                            <div style={{ color: '#f44336' }}>
                                <h3>❌ Sistema com Problemas</h3>
                                <p>Templates não estão carregando corretamente.</p>
                                <p><strong>Ação necessária:</strong> Verificar imports e estrutura do template.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => window.location.href = '/comparativo'}
                            style={{
                                background: '#FFD700',
                                color: 'black',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            🏆 Comparar Editores
                        </button>
                        <button
                            onClick={() => window.location.href = '/editor'}
                            style={{
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            🔧 Editor Unificado
                        </button>
                        <button
                            onClick={() => window.location.href = '/modular-editor'}
                            style={{
                                background: '#9C27B0',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            ⚙️ ModularEditorPro
                        </button>
                        <button
                            onClick={() => window.location.href = '/quiz'}
                            style={{
                                background: '#2196F3',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            📝 Testar Quiz
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#FF9800',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                        🔄 Recarregar
                    </button>
                    
                    {/* 🚀 NAVEGAÇÃO PARA EDITOR FUNCIONAL */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                    }}>
                        <h2 style={{ margin: '0 0 1rem 0', fontSize: '24px' }}>🎯 Editor Funcional Ativo!</h2>
                        <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9, fontSize: '16px' }}>
                            Gargalos críticos resolvidos! Builder System com 21 etapas funcionais
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => window.location.href = '/editor'}
                                style={{
                                    padding: '14px 28px',
                                    background: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                🎯 Testar Editor Principal
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/editor-modular'}
                                style={{
                                    padding: '14px 28px',
                                    background: '#8B5CF6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                🔧 Editor Modular Pro
                            </button>
                        </div>
                        
                        <div style={{ 
                            marginTop: '1.5rem', 
                            fontSize: '14px', 
                            opacity: 0.9,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                ✅ 21 Etapas Funcionais
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🤖 IA Templates Ativa
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🔄 Drag & Drop
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📊 Analytics Builder
                            </span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SystemDiagnosticPage;