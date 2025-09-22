import React, { useState } from 'react';

interface EditorComparison {
    name: string;
    route: string;
    score: number;
    category: 'principal' | 'especializado' | 'basico';
    features: {
        complexity: number;
        learning: number;
        functions: number;
        performance: number;
        ai: boolean;
        customization: number;
        mobile: number;
        bundle: 'pequeno' | 'medio' | 'grande';
        maintenance: number;
        extensible: number;
    };
    idealFor: string[];
    technologies: string[];
    pros: string[];
    cons: string[];
    metrics: {
        adoption: string;
        satisfaction: string;
        performance: string;
    };
}

const editorsData: EditorComparison[] = [
    {
        name: 'ModernUnifiedEditor',
        route: '/editor',
        score: 4.6,
        category: 'principal',
        features: {
            complexity: 5,
            learning: 4,
            functions: 5,
            performance: 4,
            ai: true,
            customization: 4,
            mobile: 3,
            bundle: 'medio',
            maintenance: 4,
            extensible: 5
        },
        idealFor: [
            'Usuários avançados que precisam de IA',
            'Projetos complexos com múltiplos templates',
            'Workflows que exigem analytics detalhados',
            'Desenvolvimento com monitoramento de performance'
        ],
        technologies: [
            'React 18 + Suspense',
            'EditorProUnified como core',
            'OptimizedAIFeatures',
            'SystemStatus monitoring',
            'PureBuilderProvider'
        ],
        pros: [
            'IA integrada para acelerar desenvolvimento',
            'Cache inteligente (85% hit rate)',
            'Monitoramento de performance em tempo real',
            'Interface consolidada e moderna',
            'Analytics detalhados'
        ],
        cons: [
            'Curva de aprendizado mais alta',
            'Bundle size médio',
            'Pode ser complexo para usuários básicos'
        ],
        metrics: {
            adoption: '65%',
            satisfaction: '4.6/5.0',
            performance: '92% score'
        }
    },
    {
        name: 'ModularEditorPro',
        route: '/modular-editor',
        score: 4.8,
        category: 'especializado',
        features: {
            complexity: 5,
            learning: 5,
            functions: 5,
            performance: 4,
            ai: false,
            customization: 5,
            mobile: 2,
            bundle: 'medio',
            maintenance: 4,
            extensible: 5
        },
        idealFor: [
            'Designers que precisam de layout customizado',
            'Desenvolvimento de templates complexos',
            'Workflows com múltiplos painéis',
            'Usuários que trabalham com telas grandes'
        ],
        technologies: [
            'Pure Builder System',
            'useOptimizedScheduler',
            'useResizableColumns (custom hook)',
            'RegistryPropertiesPanel',
            'localStorage persistence'
        ],
        pros: [
            'Colunas totalmente redimensionáveis',
            'Interface mais customizável',
            'Debug avançado com logs detalhados',
            'Painéis independentes',
            'Ideal para power users'
        ],
        cons: [
            'Sem IA integrada',
            'Complexidade alta',
            'Menos adequado para mobile'
        ],
        metrics: {
            adoption: '25%',
            satisfaction: '4.8/5.0',
            performance: '89% score'
        }
    },
    {
        name: 'SimpleEditor',
        route: '/simple-editor',
        score: 4.9,
        category: 'basico',
        features: {
            complexity: 2,
            learning: 1,
            functions: 3,
            performance: 5,
            ai: false,
            customization: 2,
            mobile: 5,
            bundle: 'pequeno',
            maintenance: 5,
            extensible: 2
        },
        idealFor: [
            'Usuários iniciantes ou não-técnicos',
            'Customizações rápidas de estilo',
            'Prototipagem rápida',
            'Dispositivos com recursos limitados'
        ],
        technologies: [
            'React básico',
            'UI Components simples',
            'safeLocalStorage',
            'Wouter routing'
        ],
        pros: [
            'Bundle muito pequeno (~50KB)',
            'Carregamento instantâneo (<0.5s)',
            'Interface intuitiva',
            'Excelente performance mobile',
            'Fácil manutenção'
        ],
        cons: [
            'Funcionalidades limitadas',
            'Sem IA ou analytics',
            'Baixa extensibilidade'
        ],
        metrics: {
            adoption: '10%',
            satisfaction: '4.9/5.0',
            performance: '98% score'
        }
    }
];

const EditorComparativePage: React.FC = () => {
    const [selectedEditor, setSelectedEditor] = useState<EditorComparison | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'technical' | 'metrics'>('overview');

    const getStars = (rating: number) => {
        return '⭐'.repeat(Math.round(rating));
    };

    const getCategoryColor = (category: EditorComparison['category']) => {
        switch (category) {
            case 'principal': return '#4CAF50';
            case 'especializado': return '#9C27B0';
            case 'basico': return '#2196F3';
            default: return '#666';
        }
    };

    const getCategoryLabel = (category: EditorComparison['category']) => {
        switch (category) {
            case 'principal': return '🥇 Editor Principal';
            case 'especializado': return '🥈 Editor Especializado';
            case 'basico': return '🥉 Editor Básico';
            default: return 'Editor';
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆 Comparativo dos 3 Melhores Editores</h1>
                    <p style={{ opacity: 0.8, fontSize: '1.2rem' }}>Quiz Quest Challenge Verse - Editor Analysis</p>
                </header>

                {/* Cards Overview */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {editorsData.map((editor) => (
                        <div
                            key={editor.name}
                            onClick={() => setSelectedEditor(editor)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: selectedEditor?.name === editor.name ? '2px solid white' : '2px solid transparent',
                                transform: selectedEditor?.name === editor.name ? 'scale(1.02)' : 'scale(1)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{editor.name}</h3>
                                <div style={{
                                    background: getCategoryColor(editor.category),
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {getCategoryLabel(editor.category)}
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <span>Satisfação:</span>
                                    <span style={{ fontSize: '1.2rem' }}>{getStars(editor.score)}</span>
                                    <span>({editor.score}/5.0)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>Adoção:</span>
                                    <span style={{ fontWeight: 'bold' }}>{editor.metrics.adoption}</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <strong>Ideal para:</strong>
                                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                    {editor.idealFor.slice(0, 2).map((item, idx) => (
                                        <li key={idx} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{item}</li>
                                    ))}
                                    {editor.idealFor.length > 2 && (
                                        <li style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                            +{editor.idealFor.length - 2} mais...
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = editor.route;
                                    }}
                                    style={{
                                        background: getCategoryColor(editor.category),
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    🚀 Abrir Editor
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEditor(editor);
                                    }}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    📊 Ver Detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed View */}
                {selectedEditor && (
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '32px',
                        marginBottom: '40px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0 }}>📋 Análise Detalhada: {selectedEditor.name}</h2>
                            <button
                                onClick={() => setSelectedEditor(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                ✖️ Fechar
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                            {[
                                { key: 'overview', label: '📊 Visão Geral' },
                                { key: 'features', label: '⚙️ Funcionalidades' },
                                { key: 'technical', label: '🔧 Técnico' },
                                { key: 'metrics', label: '📈 Métricas' }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    style={{
                                        background: activeTab === tab.key ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <h4>✅ Principais Vantagens</h4>
                                        <ul>
                                            {selectedEditor.pros.map((pro, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }}>{pro}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4>⚠️ Limitações</h4>
                                        <ul>
                                            {selectedEditor.cons.map((con, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }}>{con}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <h4>🎯 Funcionalidades</h4>
                                        <p><strong>Complexidade:</strong> {getStars(selectedEditor.features.complexity)}</p>
                                        <p><strong>Funções:</strong> {getStars(selectedEditor.features.functions)}</p>
                                        <p><strong>Customização:</strong> {getStars(selectedEditor.features.customization)}</p>
                                        <p><strong>IA Integrada:</strong> {selectedEditor.features.ai ? '✅ Sim' : '❌ Não'}</p>
                                    </div>
                                    <div>
                                        <h4>📱 Experiência</h4>
                                        <p><strong>Curva de Aprendizado:</strong> {getStars(selectedEditor.features.learning)}</p>
                                        <p><strong>Mobile Friendly:</strong> {getStars(selectedEditor.features.mobile)}</p>
                                        <p><strong>Performance:</strong> {getStars(selectedEditor.features.performance)}</p>
                                        <p><strong>Bundle:</strong> {selectedEditor.features.bundle}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'technical' && (
                            <div>
                                <h4>🔧 Tecnologias Utilizadas</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                    {selectedEditor.technologies.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <h4>🛠️ Características Técnicas</h4>
                                <p><strong>Manutenibilidade:</strong> {getStars(selectedEditor.features.maintenance)}</p>
                                <p><strong>Extensibilidade:</strong> {getStars(selectedEditor.features.extensible)}</p>
                                <p><strong>Rota:</strong> <code>{selectedEditor.route}</code></p>
                            </div>
                        )}

                        {activeTab === 'metrics' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <h4>👥 Adoção</h4>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{selectedEditor.metrics.adoption}</div>
                                        <p>dos usuários ativos</p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h4>😊 Satisfação</h4>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{selectedEditor.metrics.satisfaction}</div>
                                        <p>avaliação média</p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h4>⚡ Performance</h4>
                                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{selectedEditor.metrics.performance}</div>
                                        <p>benchmark score</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center'
                }}>
                    <h3>🚀 Ações Rápidas</h3>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
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
                            🥇 Testar Editor Principal
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
                            🥈 Testar Editor Especializado
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
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
                            🏠 Voltar ao Início
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorComparativePage;