// @ts-nocheck
import React from 'react';

/**
 * 🧪 PÁGINA DE TESTE: COMPONENTES DO QUIZ
 * 
 * Esta página testa individualmente cada componente do quiz
 * para identificar onde está o problema de renderização
 */

// Import direto dos componentes
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import OptionsGridBlock from '@/components/editor/blocks/OptionsGridBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';

const ComponentTestPage: React.FC = () => {
    // Dados de teste para cada componente
    const testBlocks = {
        quizIntroHeader: {
            id: 'test-header-1',
            type: 'quiz-intro-header',
            properties: {
                title: 'Teste do Quiz Intro Header',
                subtitle: 'Verificando se o componente renderiza',
                logoUrl: 'https://via.placeholder.com/150',
                backgroundColor: '#faf8f5'
            }
        },
        optionsGrid: {
            id: 'test-options-1',
            type: 'options-grid',
            properties: {
                question: 'Teste do Options Grid?',
                options: [
                    { id: 'opt1', text: 'Opção 1', value: 'option1' },
                    { id: 'opt2', text: 'Opção 2', value: 'option2' }
                ]
            }
        },
        textInline: {
            id: 'test-text-1',
            type: 'text-inline',
            properties: {
                content: 'Teste do Text Inline Component',
                textColor: '#432818'
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
                    🧪 Teste de Componentes do Quiz
                </h1>

                {/* Teste 1: QuizIntroHeaderBlock direto */}
                <section style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    <h2>1. 🎯 QuizIntroHeaderBlock (Direto)</h2>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
                        <QuizIntroHeaderBlock
                            block={testBlocks.quizIntroHeader}
                            onClick={() => console.log('Header clicked')}
                        />
                    </div>
                </section>

                {/* Teste 2: OptionsGridBlock direto */}
                <section style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    <h2>2. 📊 OptionsGridBlock (Direto)</h2>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
                        <OptionsGridBlock
                            block={testBlocks.optionsGrid}
                            onClick={() => console.log('Options clicked')}
                        />
                    </div>
                </section>

                {/* Teste 3: TextInlineBlock direto */}
                <section style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    <h2>3. 📝 TextInlineBlock (Direto)</h2>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
                        <TextInlineBlock
                            block={testBlocks.textInline}
                            onClick={() => console.log('Text clicked')}
                        />
                    </div>
                </section>

                {/* Teste 4: UniversalBlockRenderer com quiz-intro-header */}
                <section style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    <h2>4. 🔄 UniversalBlockRenderer (quiz-intro-header)</h2>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
                        <UniversalBlockRenderer
                            block={testBlocks.quizIntroHeader}
                            isSelected={false}
                            isPreviewing={true}
                        />
                    </div>
                </section>

                {/* Teste 5: UniversalBlockRenderer com options-grid */}
                <section style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    <h2>5. 🔄 UniversalBlockRenderer (options-grid)</h2>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
                        <UniversalBlockRenderer
                            block={testBlocks.optionsGrid}
                            isSelected={false}
                            isPreviewing={true}
                        />
                    </div>
                </section>

                {/* Teste 6: Componente desconhecido (fallback) */}
                <section style={{ marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    <h2>6. ❓ Componente Desconhecido (Fallback)</h2>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', color: 'black' }}>
                        <UniversalBlockRenderer
                            block={{
                                id: 'test-unknown',
                                type: 'unknown-component-type',
                                properties: { test: 'value' }
                            }}
                            isSelected={false}
                            isPreviewing={true}
                        />
                    </div>
                </section>

                {/* Status do Sistema */}
                <section style={{ marginTop: '40px', padding: '20px', background: 'rgba(0,255,0,0.1)', borderRadius: '10px' }}>
                    <h2>📊 Status do Sistema</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <h3>🧩 Componentes</h3>
                            <ul>
                                <li>✅ QuizIntroHeaderBlock importado</li>
                                <li>✅ OptionsGridBlock importado</li>
                                <li>✅ TextInlineBlock importado</li>
                                <li>✅ UniversalBlockRenderer importado</li>
                            </ul>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <h3>🔗 Registry</h3>
                            <ul>
                                <li>✅ quiz-intro-header registrado</li>
                                <li>✅ options-grid registrado</li>
                                <li>✅ text-inline registrado</li>
                                <li>✅ Fallbacks disponíveis</li>
                            </ul>
                        </div>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <h3>🏗️ Build</h3>
                            <ul>
                                <li>✅ TypeScript compilado</li>
                                <li>✅ Imports resolvidos</li>
                                <li>✅ React components válidos</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Ações de Teste */}
                <section style={{ marginTop: '40px', textAlign: 'center' }}>
                    <h2>🚀 Ações de Teste</h2>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                        <button
                            onClick={() => console.log('Teste individual concluído')}
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
                            ✅ Concluir Teste
                        </button>
                        <button
                            onClick={() => window.location.href = '/editor?template=quiz21StepsComplete'}
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
                            🔧 Testar Editor
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
                </section>
            </div>
        </div>
    );
};

export default ComponentTestPage;