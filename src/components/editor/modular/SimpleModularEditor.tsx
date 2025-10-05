/**
 * 🎨 EDITOR MODULAR SIMPLIFICADO - TESTE
 * 
 * Versão simplificada para debug dos problemas de renderização
 */

import React, { useState } from 'react';
import { useQuizEditor } from '@/context/QuizEditorContext';

const SimpleModularEditor: React.FC = () => {
    console.log('🔧 SimpleModularEditor: Componente carregado!');

    const {
        funnel,
        selectedComponent,
        selectComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        addComponent
    } = useQuizEditor();

    console.log('🔧 SimpleModularEditor: Funnel recebido:', funnel);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // 🔧 Verificação de segurança
    if (!funnel || !funnel.steps || funnel.steps.length === 0) {
        return (
            <div style={{ padding: '20px', border: '2px solid red', background: '#ffe6e6' }}>
                <h2>❌ Erro: Funnel não carregado</h2>
                <p>O funnel não foi carregado corretamente pelo contexto.</p>
                <pre>{JSON.stringify({ funnel }, null, 2)}</pre>
            </div>
        );
    }

    const currentStep = funnel.steps[currentStepIndex] || funnel.steps[0] || { id: 'default', components: [] };
    const components = currentStep.components || [];

    console.log('🔧 SimpleModularEditor: Step atual:', currentStep);
    console.log('🔧 SimpleModularEditor: Componentes:', components);

    const componentTypes = [
        { type: 'header', name: 'Cabeçalho', icon: '🏠' },
        { type: 'title', name: 'Título', icon: '📝' },
        { type: 'text', name: 'Texto', icon: '📄' },
        { type: 'image', name: 'Imagem', icon: '🖼️' },
        { type: 'button', name: 'Botão', icon: '🔘' },
        { type: 'options-grid', name: 'Grade de Opções', icon: '⚏' }
    ];

    const handleAddComponent = (type: string) => {
        if (!currentStep) return;
        addComponent(currentStep.id, {
            type: type as any,
            props: {
                text: `Novo ${type}`,
                title: `Título do ${type}`
            },
            style: {},
        });
    };

    const renderComponent = (component: any) => {
        switch (component.type) {
            case 'header':
                return (
                    <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', background: '#f8f9fa' }}>
                        <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                            {component.props?.title || 'Cabeçalho'}
                        </h1>
                        {component.props?.subtitle && (
                            <p style={{ margin: '8px 0 0 0', color: '#666' }}>{component.props.subtitle}</p>
                        )}
                    </div>
                );
            case 'title':
                return (
                    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>
                            {component.props?.text || 'Título'}
                        </h2>
                    </div>
                );
            case 'text':
                return (
                    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <p style={{ margin: 0, color: '#555' }}>
                            {component.props?.text || 'Texto de exemplo'}
                        </p>
                    </div>
                );
            case 'image':
                return (
                    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                        {component.props?.src ? (
                            <img
                                src={component.props.src}
                                alt={component.props?.alt || 'Imagem'}
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                            />
                        ) : (
                            <div style={{ padding: '40px', background: '#f0f0f0', borderRadius: '4px', color: '#666' }}>
                                🖼️ Imagem não definida
                            </div>
                        )}
                    </div>
                );
            case 'button':
                return (
                    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                        <button style={{
                            padding: '12px 24px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            {component.props?.text || 'Botão'}
                        </button>
                    </div>
                );
            case 'options-grid':
                const options = component.props?.options || [
                    { id: '1', text: 'Opção 1' },
                    { id: '2', text: 'Opção 2' }
                ];
                return (
                    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            {options.map((option: any, index: number) => (
                                <div key={option.id || index} style={{
                                    padding: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}>
                                    {option.image && (
                                        <img
                                            src={option.image}
                                            alt={option.text}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                                        />
                                    )}
                                    <div>{option.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div style={{ padding: '12px', border: '1px solid #red', borderRadius: '8px', background: '#ffe6e6' }}>
                        <p style={{ margin: 0, color: '#d00' }}>
                            Componente "{component.type}" não implementado
                        </p>
                    </div>
                );
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* COLUNA 1: ETAPAS */}
            <div style={{
                width: '250px',
                borderRight: '1px solid #ddd',
                padding: '16px',
                background: '#f8f9fa'
            }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>
                    📋 Etapas ({funnel.steps.length})
                </h3>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {funnel.steps.map((step: any, index: number) => (
                        <div
                            key={step.id}
                            onClick={() => setCurrentStepIndex(index)}
                            style={{
                                padding: '12px',
                                margin: '0 0 8px 0',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: index === currentStepIndex ? '#e7f3ff' : 'white',
                                borderColor: index === currentStepIndex ? '#007bff' : '#ddd'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                                {index + 1}. {step.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                {step.components?.length || 0} componentes
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUNA 2: COMPONENTES */}
            <div style={{
                width: '280px',
                borderRight: '1px solid #ddd',
                padding: '16px',
                background: '#f8f9fa'
            }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>
                    🧩 Componentes
                </h3>
                <div>
                    {componentTypes.map((comp) => (
                        <div
                            key={comp.type}
                            onClick={() => handleAddComponent(comp.type)}
                            style={{
                                padding: '12px',
                                margin: '0 0 8px 0',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{comp.icon}</span>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{comp.name}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Clique para adicionar</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUNA 3: CANVAS */}
            <div style={{
                flex: 1,
                padding: '24px',
                background: '#ffffff'
            }}>
                <div style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                    <h2 style={{ margin: 0, fontSize: '18px' }}>
                        🎨 Etapa {currentStepIndex + 1}: {currentStep?.name}
                    </h2>
                    <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                        {components.length} componentes na etapa
                    </p>
                </div>

                {components.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px',
                        color: '#666',
                        border: '2px dashed #ddd',
                        borderRadius: '8px'
                    }}>
                        <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Nenhum componente adicionado</p>
                        <p style={{ fontSize: '14px', margin: 0 }}>Use a coluna 2 para adicionar componentes</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {components.map((component: any, index: number) => (
                            <div
                                key={component.id}
                                onClick={() => selectComponent(component.id)}
                                style={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    border: selectedComponent?.id === component.id ? '2px solid #007bff' : '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    background: selectedComponent?.id === component.id ? '#f0f8ff' : 'white'
                                }}
                            >
                                {/* Badge do tipo */}
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    background: '#007bff',
                                    color: 'white',
                                    fontSize: '11px',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}>
                                    {component.type}
                                </div>

                                {/* Botões de ação */}
                                {selectedComponent?.id === component.id && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'white',
                                        borderRadius: '6px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        padding: '4px',
                                        display: 'flex',
                                        gap: '4px'
                                    }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                duplicateComponent(currentStep.id, component.id);
                                            }}
                                            style={{ padding: '4px 8px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            📋
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteComponent(currentStep.id, component.id);
                                            }}
                                            style={{ padding: '4px 8px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#ff4757', color: 'white' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}

                                {/* Renderização do componente */}
                                <div style={{ marginTop: '24px' }}>
                                    {renderComponent(component)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COLUNA 4: PROPRIEDADES */}
            <div style={{
                width: '320px',
                borderLeft: '1px solid #ddd',
                padding: '16px',
                background: '#f8f9fa'
            }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>
                    ⚙️ Propriedades
                </h3>
                {selectedComponent ? (
                    <div>
                        <div style={{ marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <strong>Componente:</strong> {selectedComponent.type}<br />
                            <strong>ID:</strong> {selectedComponent.id}
                        </div>
                        <div style={{ padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                                Painel de propriedades será implementado aqui
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            Selecione um componente para editar suas propriedades
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleModularEditor;