/**
 * TestV3Page - Página de teste para template v3.0
 * 
 * Carrega templates/step-20-v3.json e renderiza usando SectionRenderer
 * Permite testar sections isoladamente antes de integrar no editor
 * 
 * @route /admin/test-v3
 * @version 1.0.0
 * @date 2025-10-12
 */

import React, { useState, useEffect } from 'react';
import { SectionsContainer } from '@/components/sections/SectionRenderer';
import type { TemplateV3 } from '@/types/template-v3.types';

export const TestV3Page: React.FC = () => {
    const [template, setTemplate] = useState<TemplateV3 | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewedSections, setViewedSections] = useState<string[]>([]);

    // Mock user data
    const userData = {
        name: 'Maria Silva',
        styleName: 'Clássico Elegante',
        email: 'maria@example.com',
    };

    // Carregar template v3.0
    useEffect(() => {
        const loadTemplate = async () => {
            try {
                setLoading(true);

                // Tentar carregar do arquivo JSON
                const response = await fetch('/templates/step-20-v3.json');

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Validar estrutura básica
                if (!data.templateVersion || data.templateVersion !== '3.0') {
                    throw new Error('Template inválido ou versão incorreta');
                }

                if (!data.sections || !Array.isArray(data.sections)) {
                    throw new Error('Template não possui sections válidas');
                }

                setTemplate(data as TemplateV3);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar template:', err);
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, []);

    // Tracking de visualizações
    const handleSectionView = (sectionId: string) => {
        if (!viewedSections.includes(sectionId)) {
            setViewedSections(prev => [...prev, sectionId]);
            console.log(`📊 Section viewed: ${sectionId}`);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa',
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        margin: '0 auto 1.5rem',
                        border: '4px solid #e9ecef',
                        borderTop: '4px solid #007bff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }} />
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#6c757d',
                    }}>
                        Carregando template v3.0...
                    </p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
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
                background: '#f8f9fa',
                padding: '2rem',
            }}>
                <div style={{
                    maxWidth: '600px',
                    padding: '2.5rem',
                    background: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '2px solid #dc3545',
                }}>
                    <div style={{
                        fontSize: '3rem',
                        textAlign: 'center',
                        marginBottom: '1rem',
                    }}>
                        ❌
                    </div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        color: '#dc3545',
                        marginBottom: '1rem',
                        textAlign: 'center',
                    }}>
                        Erro ao Carregar Template
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        color: '#6c757d',
                        marginBottom: '1.5rem',
                        lineHeight: 1.6,
                    }}>
                        {error}
                    </p>
                    <div style={{
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'monospace',
                        color: '#495057',
                    }}>
                        <strong>Arquivo esperado:</strong><br />
                        /templates/step-20-v3.json
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            padding: '0.75rem',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0056b3'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#007bff'}
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!template) {
        return null;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: template.theme.colors.background || '#fffaf7',
        }}>
            {/* Debug header */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                background: '#212529',
                color: 'white',
                padding: '1rem 2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '2rem',
                    flexWrap: 'wrap',
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: 600,
                        }}>
                            🧪 Template v3.0 Test Page
                        </h1>
                        <p style={{
                            margin: '0.25rem 0 0',
                            fontSize: '0.875rem',
                            opacity: 0.8,
                        }}>
                            {template.metadata.name}
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        fontSize: '0.875rem',
                    }}>
                        <div>
                            <strong>Sections:</strong> {template.sections.length}
                        </div>
                        <div>
                            <strong>Viewed:</strong> {viewedSections.length}
                        </div>
                        <div>
                            <strong>Version:</strong> {template.templateVersion}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '2rem 1rem',
            }}>
                <SectionsContainer
                    sections={template.sections}
                    theme={template.theme}
                    offer={template.offer}
                    userData={userData}
                    onSectionView={handleSectionView}
                />
            </main>

            {/* Debug footer */}
            <footer style={{
                background: '#f8f9fa',
                borderTop: '2px solid #e9ecef',
                padding: '2rem',
                marginTop: '4rem',
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                }}>
                    <h3 style={{
                        fontSize: '1.125rem',
                        marginBottom: '1rem',
                        color: '#495057',
                    }}>
                        📊 Analytics
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                    }}>
                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            border: '1px solid #dee2e6',
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                                Total Sections
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#495057' }}>
                                {template.sections.length}
                            </div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            border: '1px solid #dee2e6',
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                                Sections Viewed
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                                {viewedSections.length}
                            </div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            border: '1px solid #dee2e6',
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                                Engagement Rate
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                                {Math.round((viewedSections.length / template.sections.length) * 100)}%
                            </div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            border: '1px solid #dee2e6',
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                                Product Price
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                                R$ {template.offer.pricing.salePrice}
                            </div>
                        </div>
                    </div>

                    <details style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #dee2e6',
                    }}>
                        <summary style={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: '#495057',
                            marginBottom: '1rem',
                        }}>
                            🔍 View Template JSON
                        </summary>
                        <pre style={{
                            fontSize: '0.75rem',
                            background: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            overflow: 'auto',
                            maxHeight: '400px',
                        }}>
                            {JSON.stringify(template, null, 2)}
                        </pre>
                    </details>
                </div>
            </footer>
        </div>
    );
};

export default TestV3Page;
